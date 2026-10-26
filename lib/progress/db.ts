import {examPlanSchema,examRunSchema,studyPlanSchema,type ExamPlan,type ExamRun,type StudyPlan} from "@/lib/exam/schema";
import {erRecordSchema,diagramSchema,type ErDiagram,type ErRecord,type ErIssue} from "@/lib/er/model";
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { emptyProgress, lessonProgressSchema, progressBackupSchema, quizAttemptSchema, attemptSchema, sqlHistorySchema, type SqlHistoryEntry, type LessonProgress, type QuizAttempt, type ProgressBackup } from "./schemas";
import { mergeProgress } from "./merge";

interface ProgressDB extends DBSchema {
  examPlans:{key:string;value:ExamPlan};
  examRuns:{key:string;value:ExamRun};
  studyPlans:{key:string;value:StudyPlan};
  erDiagrams:{key:string;value:ErRecord};
  lessons: { key: string; value: LessonProgress }; // v1 retained for non-destructive migration.
  attempts: { key: string; value: ProgressBackup["attempts"][number] };
  lessonVersions: { key: [string, number]; value: LessonProgress };
  quizAttempts: { key: string; value: QuizAttempt };
  sqlHistory: { key: string; value: SqlHistoryEntry };
}
export const DATABASE_NAME = "database-academy-progress";
export async function openProgressDB(name = DATABASE_NAME): Promise<IDBPDatabase<ProgressDB>> {
  let connection: IDBPDatabase<ProgressDB> | undefined;
  let expired = false;
  const opening = openDB<ProgressDB>(name, 5, {
    upgrade(database, oldVersion, _newVersion, transaction) {
      if(oldVersion<5){database.createObjectStore("examPlans",{keyPath:"id"});database.createObjectStore("examRuns",{keyPath:"id"});database.createObjectStore("studyPlans",{keyPath:"id"});}
      if(oldVersion<4)database.createObjectStore("erDiagrams",{keyPath:"id"});
      if (oldVersion < 1) {
        database.createObjectStore("lessons", { keyPath: "lessonId" });
        database.createObjectStore("attempts", { keyPath: "id" });
      }
      if(oldVersion < 3) database.createObjectStore("sqlHistory", { keyPath:"id" });
      if (oldVersion < 2) {
        database.createObjectStore("lessonVersions", { keyPath: ["lessonId", "lessonVersion"] });
        database.createObjectStore("quizAttempts", { keyPath: "id" });
        void transaction.done.catch(() => undefined);
        void transaction.objectStore("lessons").getAll().then(rows => {
          const parsed = rows.map(row => lessonProgressSchema.parse(row));
          return Promise.all(parsed.map(row => transaction.objectStore("lessonVersions").put(row)));
        }).catch(() => { try { transaction.abort(); } catch { /* Already aborted. */ } });
      }
    },
    blocking() { connection?.close(); },
  });
  void opening.then(db => { connection = db; if (expired) db.close(); }).catch(() => undefined);
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([opening, new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => { expired = true; reject(new Error("Archivio locale bloccato. Chiudi le altre schede dell’app e riprova.")); }, 5000);
    })]);
  } finally { clearTimeout(timer); }
}

// Short-lived connections allow upgrades and independent tabs to cooperate.
export async function readProgress(name = DATABASE_NAME): Promise<ProgressBackup> {
  const db = await openProgressDB(name);
  try {
    const tx = db.transaction(["lessonVersions", "attempts", "quizAttempts", "sqlHistory", "erDiagrams","examPlans","examRuns","studyPlans"], "readonly");
    void tx.done.catch(() => undefined);
    const [lessons, attempts, quizAttempts, sqlHistory, erDiagrams,examPlans,examRuns,studyPlans] = await Promise.all([tx.objectStore("lessonVersions").getAll(), tx.objectStore("attempts").getAll(), tx.objectStore("quizAttempts").getAll(), tx.objectStore("sqlHistory").getAll(),tx.objectStore("erDiagrams").getAll(),tx.objectStore("examPlans").getAll(),tx.objectStore("examRuns").getAll(),tx.objectStore("studyPlans").getAll()]);
    await tx.done;
    return progressBackupSchema.parse({ ...emptyProgress(), lessons, attempts, quizAttempts, sqlHistory, erDiagrams,examPlans,examRuns,studyPlans });
  } finally { db.close(); }
}
export async function updateLessonProgress(lessonId: string, lessonVersion: number, completed?: boolean, name = DATABASE_NAME) {
  const db = await openProgressDB(name);
  try {
    const tx = db.transaction("lessonVersions", "readwrite");
    void tx.done.catch(() => undefined);
    const previous = await tx.store.get([lessonId, lessonVersion]);
    const record = lessonProgressSchema.parse({ ...previous, lessonId, lessonVersion, lastVisitedAt: new Date().toISOString(), ...(completed === true ? { completedAt: previous?.completedAt ?? new Date().toISOString() } : {}) });
    if (completed === false) delete record.completedAt;
    await tx.store.put(record); await tx.done;
  } finally { db.close(); }
}
export async function saveQuizAttempt(input: QuizAttempt, name = DATABASE_NAME) {
  const attempt = quizAttemptSchema.parse(input);
  const db = await openProgressDB(name);
  try { await db.add("quizAttempts", attempt); } finally { db.close(); }
}
export async function importProgress(incoming: ProgressBackup, name = DATABASE_NAME) {
  const parsed = progressBackupSchema.parse(incoming);
  const db = await openProgressDB(name);
  try {
    const tx = db.transaction(["lessonVersions", "attempts", "quizAttempts", "sqlHistory", "erDiagrams","examPlans","examRuns","studyPlans"], "readwrite");
    const done = tx.done;
    // Attach immediately so an aborted transaction never produces an unhandled rejection.
    void done.catch(() => undefined);
    try {
      const [lessons, attempts, quizAttempts, sqlHistory, erDiagrams,examPlans,examRuns,studyPlans] = await Promise.all([tx.objectStore("lessonVersions").getAll(), tx.objectStore("attempts").getAll(), tx.objectStore("quizAttempts").getAll(), tx.objectStore("sqlHistory").getAll(),tx.objectStore("erDiagrams").getAll(),tx.objectStore("examPlans").getAll(),tx.objectStore("examRuns").getAll(),tx.objectStore("studyPlans").getAll()]);
      const current = progressBackupSchema.parse({ ...emptyProgress(), lessons, attempts, quizAttempts, sqlHistory, erDiagrams,examPlans,examRuns,studyPlans });
      const merged = mergeProgress(current, parsed);
      const writes = [
        ...merged.lessons.map(lesson => tx.objectStore("lessonVersions").put(lesson)),
        ...merged.attempts.map(attempt => tx.objectStore("attempts").put(attempt)),
        ...merged.quizAttempts.map(attempt => tx.objectStore("quizAttempts").put(attempt)),
        ...merged.sqlHistory.map(entry => tx.objectStore("sqlHistory").put(entry)),
        ...merged.erDiagrams.map(entry=>tx.objectStore("erDiagrams").put(entry)),
        ...merged.examPlans.map(entry=>tx.objectStore("examPlans").put(entry)),...merged.examRuns.map(entry=>tx.objectStore("examRuns").put(entry)),...merged.studyPlans.map(entry=>tx.objectStore("studyPlans").put(entry)),
      ];
      await Promise.all([...writes, done]);
    } catch (error) {
      try { tx.abort(); } catch { /* Already aborted or committed. */ }
      await done.catch(() => undefined);
      throw error;
    }
  } finally { db.close(); }
}

export async function saveExerciseAttempt(input: ProgressBackup["attempts"][number], name = DATABASE_NAME) {
  const row = attemptSchema.parse(input); const db = await openProgressDB(name);
  try { await db.add("attempts",row); } finally { db.close(); }
}
export async function saveSqlHistory(input: SqlHistoryEntry, name = DATABASE_NAME) {
  const row = sqlHistorySchema.parse(input); const db = await openProgressDB(name);
  try { await db.add("sqlHistory",row); } finally { db.close(); }
}

export async function saveErDiagram(diagram:ErDiagram,options:{exerciseId?:string;exerciseVersion?:number;issues?:ErIssue[];completed?:boolean}={},name=DATABASE_NAME):Promise<ErRecord>{
 const parsed=diagramSchema.parse(diagram),db=await openProgressDB(name);
 try{const tx=db.transaction("erDiagrams","readwrite");void tx.done.catch(()=>undefined);
  const rows=await tx.store.getAll();const revision=1+Math.max(0,...rows.filter(r=>r.diagram.metadata.id===parsed.metadata.id).map(r=>r.diagram.metadata.revision));const now=new Date().toISOString();
  const record=erRecordSchema.parse({id:`${parsed.metadata.id}-v${revision}`,diagram:{...parsed,metadata:{...parsed.metadata,revision,modifiedAt:now}},savedAt:now,...(options.exerciseId?{exerciseId:options.exerciseId,exerciseVersion:options.exerciseVersion}:{}),...(options.issues?{validation:{validatedAt:now,issues:options.issues}}:{}),...(options.completed?{manuallyCompletedAt:now}:{})});
  await tx.store.add(record);await tx.done;return record;
 }finally{db.close();}
}

export async function createExamSession(planInput:ExamPlan,runInput:ExamRun,name=DATABASE_NAME){
 const plan=examPlanSchema.parse(planInput),run=examRunSchema.parse(runInput);if(run.planId!==plan.id||run.revision!==1)throw new Error("Sessione iniziale non valida");
 const db=await openProgressDB(name);try{const tx=db.transaction(["examPlans","examRuns"],"readwrite");void tx.done.catch(()=>undefined);await tx.objectStore("examPlans").add(plan);await tx.objectStore("examRuns").add(run);await tx.done;}finally{db.close();}
}
export async function appendExamRun(input:ExamRun,expectedRevision:number,name=DATABASE_NAME):Promise<ExamRun>{
 const db=await openProgressDB(name);try{const tx=db.transaction("examRuns","readwrite");void tx.done.catch(()=>undefined);const rows=await tx.store.getAll(),previous=rows.filter(r=>r.sessionId===input.sessionId).sort((a,b)=>b.revision-a.revision)[0];
 if(!previous||previous.revision!==expectedRevision)throw new Error("Sessione modificata in un’altra scheda: ricarica prima di continuare. Nessuna versione sovrascritta.");
 if(previous.planId!==input.planId||previous.startedAt!==input.startedAt||previous.deadlineAt!==input.deadlineAt)throw new Error("Metadati della sessione immutabili");
 if(previous.finishedAt&&(previous.finishedAt!==input.finishedAt||JSON.stringify(previous.answers)!==JSON.stringify(input.answers)))throw new Error("Risposte bloccate dopo la conclusione");
 const revision=expectedRevision+1,row=examRunSchema.parse({...input,id:`${input.sessionId}-v${revision}`,revision,updatedAt:new Date().toISOString()});await tx.store.add(row);await tx.done;return row;
 }finally{db.close();}
}
export async function saveStudyPlan(input:StudyPlan,expectedRevision=0,name=DATABASE_NAME):Promise<StudyPlan>{
 const db=await openProgressDB(name);try{const tx=db.transaction("studyPlans","readwrite");void tx.done.catch(()=>undefined);const rows=await tx.store.getAll(),latest=Math.max(0,...rows.filter(r=>r.planId===input.planId).map(r=>r.revision));if(latest!==expectedRevision)throw new Error("Piano modificato altrove; ricarica per evitare sovrascritture.");const revision=latest+1,row=studyPlanSchema.parse({...input,id:`${input.planId}-v${revision}`,revision,updatedAt:new Date().toISOString()});await tx.store.add(row);await tx.done;return row;}finally{db.close();}
}

import "fake-indexeddb/auto";
import {describe,it,expect} from "vitest";
import {openDB,deleteDB} from "idb";
import {readProgress,saveExerciseAttempt,saveSqlHistory,importProgress} from "@/lib/progress/db";
import {emptyProgress,parseBackup,type SqlHistoryEntry} from "@/lib/progress/schemas";
const date="2026-10-24T12:00:00.000Z";
const history:SqlHistoryEntry={id:"query-1",datasetId:"sailors",query:"SELECT COUNT(*) FROM Sailors",status:"executed",rowCount:1,feedback:"Eseguita",attemptedAt:date};
describe("Compatibilità progressi Sprint 1 e SQL",()=>{
  it("migra un vero database v2 mantenendo completamenti e quiz",async()=>{
    const name="sql-migrate-v2";await deleteDB(name);
    const db=await openDB(name,2,{upgrade(database){database.createObjectStore("lessons",{keyPath:"lessonId"});database.createObjectStore("attempts",{keyPath:"id"});database.createObjectStore("lessonVersions",{keyPath:["lessonId","lessonVersion"]});database.createObjectStore("quizAttempts",{keyPath:"id"});}});
    const lesson={lessonId:"dbms-dati",lessonVersion:1,lastVisitedAt:date,completedAt:date};
    const quiz={id:"quiz-1",lessonId:"dbms-dati",lessonVersion:1,quizVersion:1,questionId:"dbms-dati-q1",questionVersion:1,selectedOptionIds:["opzione-2"],correct:true,feedback:"Nota",attemptedAt:date};
    await db.put("lessonVersions",lesson);await db.put("quizAttempts",quiz);db.close();
    const data=await readProgress(name);expect(data.schemaVersion).toBe(5);expect(data.lessons).toEqual([lesson]);expect(data.quizAttempts).toEqual([quiz]);expect(data.sqlHistory).toEqual([]);
    await deleteDB(name);
  });
  it("salva tentativi SQL e cronologia, li esporta e ripristina senza perdere lezioni",async()=>{
    const name="sql-roundtrip";await deleteDB(name);
    const attempt={id:"sql-attempt-1",exerciseId:"sailors-03",exerciseVersion:1,answer:"SELECT sname FROM Sailors GROUP BY sname",result:"failed" as const,verificationStatus:"mismatch" as const,feedback:"Non coincide sulle fixture",attemptedAt:date};
    await saveExerciseAttempt(attempt,name);await saveSqlHistory(history,name);
    const data=await readProgress(name);const parsed=parseBackup(JSON.stringify(data));
    expect(parsed.attempts).toEqual([attempt]);expect(parsed.sqlHistory).toEqual([history]);
    await deleteDB(name);
    await importProgress({...emptyProgress(),lessons:[{lessonId:"dbms-dati",lessonVersion:1,lastVisitedAt:date,completedAt:date}]},name);
    await importProgress(parsed,name);await importProgress(parsed,name);
    const restored=await readProgress(name);expect(restored.attempts).toEqual([attempt]);expect(restored.sqlHistory).toEqual([history]);expect(restored.lessons[0].completedAt).toBe(date);
    await deleteDB(name);
  });
  it("accetta backup v2 e conserva tutti i campi precedenti",()=>{
    const data={schemaVersion:2,exportedAt:date,lessons:[{lessonId:"schema-istanza",lessonVersion:1,lastVisitedAt:date}],attempts:[],quizAttempts:[]};
    expect(parseBackup(JSON.stringify(data))).toEqual({...data,schemaVersion:5,sqlHistory:[],erDiagrams:[],examPlans:[],examRuns:[],studyPlans:[]});
  });
  it("rifiuta conflitti nella cronologia senza cancellare record precedenti",async()=>{
    const name="sql-conflict";await deleteDB(name);await saveSqlHistory(history,name);
    await expect(importProgress({...emptyProgress(),sqlHistory:[{...history,query:"SELECT 2"}]},name)).rejects.toThrow("Conflitto");
    expect((await readProgress(name)).sqlHistory).toEqual([history]);await deleteDB(name);
  });
});

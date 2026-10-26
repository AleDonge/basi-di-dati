import {examPlanSchema,examRunSchema,studyPlanSchema} from "@/lib/exam/schema";
import { erRecordSchema } from "@/lib/er/model";
import { z } from "zod";
import { stableId } from "@/lib/content/schemas";
export const attemptSchema = z.object({
  id: stableId, exerciseId: stableId, exerciseVersion: z.number().int().positive(),
  answer: z.string(), result: z.enum(["passed", "failed", "guided", "unsupported"]),
  feedback: z.string(), attemptedAt: z.iso.datetime(),
  verificationStatus: z.enum(["passed", "mismatch", "inconclusive", "validation", "syntax", "execution", "timeout", "cancelled", "resource"]).optional(),
}).strict();
export const lessonProgressSchema = z.object({
  lessonId: stableId, lessonVersion: z.number().int().positive(),
  completedAt: z.iso.datetime().optional(), lastVisitedAt: z.iso.datetime(),
}).strict();
export const legacyBackupSchema = z.object({
  schemaVersion: z.literal(1), exportedAt: z.iso.datetime(),
  attempts: z.array(attemptSchema).max(50000), lessons: z.array(lessonProgressSchema).max(5000),
}).strict();
export const quizAttemptSchema = z.object({
  id: stableId, lessonId: stableId, lessonVersion: z.number().int().positive(),
  quizVersion: z.number().int().positive(), questionId: stableId, questionVersion: z.number().int().positive(),
  selectedOptionIds: z.array(stableId).min(1).max(8).refine(a => new Set(a).size === a.length),
  correct: z.boolean(), feedback: z.string().max(10000), attemptedAt: z.iso.datetime(),
}).strict();
export const v2BackupSchema = z.object({
  schemaVersion: z.literal(2), exportedAt: z.iso.datetime(),
  attempts: z.array(attemptSchema).max(50000), lessons: z.array(lessonProgressSchema).max(5000),
  quizAttempts: z.array(quizAttemptSchema).max(50000),
}).strict();
export const sqlHistorySchema = z.object({
  id: stableId, datasetId: z.enum(["sailors", "northwind"]), query: z.string().max(20000),
  status: z.enum(["executed", "validation", "syntax", "execution", "timeout", "cancelled", "resource"]),
  feedback: z.string().max(10000), rowCount: z.number().int().nonnegative().optional(), attemptedAt: z.iso.datetime(),
}).strict();
export const v3BackupSchema = z.object({
  schemaVersion: z.literal(3), exportedAt: z.iso.datetime(),
  attempts: z.array(attemptSchema).max(50000), lessons: z.array(lessonProgressSchema).max(5000),
  quizAttempts: z.array(quizAttemptSchema).max(50000), sqlHistory: z.array(sqlHistorySchema).max(50000),
 }).strict();
export const v4BackupSchema = v3BackupSchema.extend({schemaVersion:z.literal(4),erDiagrams:z.array(erRecordSchema).max(5000)});
export const progressBackupSchema = v4BackupSchema.extend({schemaVersion:z.literal(5),examPlans:z.array(examPlanSchema).max(5000),examRuns:z.array(examRunSchema).max(50000),studyPlans:z.array(studyPlanSchema).max(5000)}).superRefine((data, ctx) => {
  for (const ids of [data.lessons.map(l => `${l.lessonId}@${l.lessonVersion}`), data.attempts.map(a => a.id), data.quizAttempts.map(a => a.id), data.sqlHistory.map(a => a.id),data.erDiagrams.map(d=>d.id),data.examPlans.map(p=>p.id),data.examRuns.map(r=>r.id),data.studyPlans.map(p=>p.id)]) {
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "Registrazioni duplicate nel backup" });
  }
  const plans=new Map(data.examPlans.map(p=>[p.id,p]));
  for(const run of data.examRuns){const plan=plans.get(run.planId);if(!plan||Object.keys(run.answers).some(k=>!plan.items.some(i=>i.key===k))||Object.keys(run.results).some(k=>!plan.items.some(i=>i.key===k)))ctx.addIssue({code:"custom",message:"Sessione senza piano o attività corrispondente"});if(plan?.config.mode==="simulation"&&!run.finishedAt&&Object.keys(run.results).length)ctx.addIssue({code:"custom",message:"Risultati anticipati in simulazione"});}
  for(const rows of [data.examRuns.map(r=>`${r.sessionId}@${r.revision}`),data.studyPlans.map(r=>`${r.planId}@${r.revision}`)])if(new Set(rows).size!==rows.length)ctx.addIssue({code:"custom",message:"Revisioni duplicate"});
  const versions=data.erDiagrams.map(r=>`${r.diagram.metadata.id}@${r.diagram.metadata.revision}`);
  if(new Set(versions).size!==versions.length)ctx.addIssue({code:"custom",message:"Versioni ER duplicate"});
});
export type ProgressBackup = z.infer<typeof progressBackupSchema>;
export type LessonProgress = z.infer<typeof lessonProgressSchema>;
export type QuizAttempt = z.infer<typeof quizAttemptSchema>;
export type SqlHistoryEntry = z.infer<typeof sqlHistorySchema>;
export const emptyProgress = (): ProgressBackup => ({ schemaVersion: 5, exportedAt: new Date().toISOString(), attempts: [], lessons: [], quizAttempts: [], sqlHistory: [], erDiagrams: [], examPlans:[],examRuns:[],studyPlans:[] });
export function migrateBackup(input: unknown): ProgressBackup {
 const legacy=legacyBackupSchema.safeParse(input),v2=v2BackupSchema.safeParse(input),v3=v3BackupSchema.safeParse(input),v4=v4BackupSchema.safeParse(input);
 if(legacy.success)return progressBackupSchema.parse({...emptyProgress(),...legacy.data,schemaVersion:5});
 if(v2.success)return progressBackupSchema.parse({...emptyProgress(),...v2.data,schemaVersion:5});
 if(v3.success)return progressBackupSchema.parse({...emptyProgress(),...v3.data,schemaVersion:5});
 if(v4.success)return progressBackupSchema.parse({...emptyProgress(),...v4.data,schemaVersion:5});
 return progressBackupSchema.parse(input);
}
export function parseBackup(text: string): ProgressBackup {
  if (new TextEncoder().encode(text).length > 5 * 1024 * 1024) throw new Error("Il backup supera il limite di 5 MB.");
  try { return migrateBackup(JSON.parse(text) as unknown); }
  catch { throw new Error("Backup non valido: controlla formato, versione, date e identificativi. I dati locali non sono stati modificati."); }
}

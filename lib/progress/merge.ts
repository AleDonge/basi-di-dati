import { progressBackupSchema, type ProgressBackup } from "./schemas";

function mergeAttempts<T extends { id: string }>(local: T[], incoming: T[]) {
  const records = new Map(local.map(row => [row.id, row]));
  for (const row of incoming) {
    const existing = records.get(row.id);
    // Both inputs are parsed with the same Zod schema: property order is canonical.
    if (existing && JSON.stringify(existing) !== JSON.stringify(row)) throw new Error(`Conflitto sul tentativo ${row.id}. Nessun dato importato.`);
    records.set(row.id, row);
  }
  return [...records.values()];
}
export function mergeProgress(local: ProgressBackup, incoming: ProgressBackup): ProgressBackup {
  const lessons = new Map(local.lessons.map(row => [`${row.lessonId}@${row.lessonVersion}`, row]));
  for (const row of incoming.lessons) {
    const key = `${row.lessonId}@${row.lessonVersion}`;
    const previous = lessons.get(key);
    if (!previous) { lessons.set(key, row); continue; }
    const dates = [previous.completedAt, row.completedAt].filter((x): x is string => !!x).sort((a,b) => Date.parse(a)-Date.parse(b));
    lessons.set(key, { ...previous, lastVisitedAt: Date.parse(previous.lastVisitedAt) >= Date.parse(row.lastVisitedAt) ? previous.lastVisitedAt : row.lastVisitedAt, ...(dates[0] ? { completedAt: dates[0] } : {}) });
  }
  return progressBackupSchema.parse({
    schemaVersion: 5, exportedAt: new Date().toISOString(), lessons: [...lessons.values()],
    attempts: mergeAttempts(local.attempts, incoming.attempts), quizAttempts: mergeAttempts(local.quizAttempts, incoming.quizAttempts),
    sqlHistory: mergeAttempts(local.sqlHistory, incoming.sqlHistory),
    erDiagrams: mergeAttempts(local.erDiagrams,incoming.erDiagrams),
    examPlans:mergeAttempts(local.examPlans,incoming.examPlans),examRuns:mergeAttempts(local.examRuns,incoming.examRuns),studyPlans:mergeAttempts(local.studyPlans,incoming.studyPlans),
  });
}

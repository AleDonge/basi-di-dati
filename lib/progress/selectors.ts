import type { Manifest } from "@/lib/content/schemas";
import type { ProgressBackup } from "./schemas";
export function moduleProgress(moduleId: string, lessons: Manifest["lessons"], data: ProgressBackup) {
  const current = lessons.filter(l => l.moduleId === moduleId && l.status !== "draft");
  const completed = current.filter(l => data.lessons.some(p => p.lessonId === l.id && p.lessonVersion === l.version && p.completedAt)).length;
  return { completed, total: current.length, percent: current.length ? Math.round(100 * completed / current.length) : 0 };
}
export function latestQuizResults(lessonId: string, version: number, data: ProgressBackup) {
  const latest = new Map<string, ProgressBackup["quizAttempts"][number]>();
  for (const attempt of [...data.quizAttempts].sort((a,b) => a.questionVersion-b.questionVersion || Date.parse(a.attemptedAt)-Date.parse(b.attemptedAt))) {
    if (attempt.lessonId === lessonId && attempt.lessonVersion === version) latest.set(attempt.questionId, attempt);
  }
  return [...latest.values()];
}

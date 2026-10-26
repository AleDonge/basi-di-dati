import { z } from "zod";
import { stableId, reviewStatus, sourceRefSchema } from "./schemas";
export const questionSchema = z.object({
  id: stableId, version: z.number().int().positive(), type: z.enum(["multiple", "single", "true-false"]),
  prompt: z.string().min(1), concepts: z.array(z.string()).min(1), sourceRefs: z.array(sourceRefSchema).min(1),
  options: z.array(z.object({ id: stableId, text: z.string().min(1) }).strict()).min(2).max(8),
  correctOptionIds: z.array(stableId).min(1), explanation: z.string().min(1),
}).strict().superRefine((q, ctx) => {
  const ids = q.options.map(o => o.id);
  if (new Set(ids).size !== ids.length || new Set(q.correctOptionIds).size !== q.correctOptionIds.length || q.correctOptionIds.some(id => !ids.includes(id))) ctx.addIssue({ code: "custom", message: "Opzioni non valide" });
  if (q.type !== "multiple" && q.correctOptionIds.length !== 1) ctx.addIssue({ code: "custom", message: "La domanda richiede una sola risposta corretta" });
  if (q.type === "true-false" && (ids.length !== 2 || !ids.includes("vero") || !ids.includes("falso"))) ctx.addIssue({ code: "custom", message: "Opzioni vero/falso mancanti" });
});
export const quizSchema = z.object({ lessonId: stableId, version: z.number().int().positive(), status: reviewStatus, questions: z.array(questionSchema).min(1) }).strict().superRefine((q, ctx) => {
  if (new Set(q.questions.map(x => x.id)).size !== q.questions.length) ctx.addIssue({ code: "custom", message: "Domande duplicate" });
});
export type Question = z.infer<typeof questionSchema>;
export type PublicQuestion = Omit<Question, "correctOptionIds" | "explanation">;
export function publicQuestion({ correctOptionIds: _correct, explanation: _explanation, ...question }: Question): PublicQuestion { void _correct; void _explanation; return question; }

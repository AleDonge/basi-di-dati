import { z } from "zod";
import type { Question } from "@/lib/content/quiz-schema";
export const quizAnswerSchema = z.array(z.string().min(1).max(80)).min(1).max(8).refine(a => new Set(a).size === a.length, "Risposte duplicate");
export function gradeQuiz(question: Question, input: unknown) {
  const selected = quizAnswerSchema.parse(input);
  if (selected.some(id => !question.options.some(o => o.id === id))) throw new Error("Opzione sconosciuta");
  if (question.type !== "multiple" && selected.length !== 1) throw new Error("Seleziona una sola risposta");
  const correct = selected.length === question.correctOptionIds.length && selected.every(id => question.correctOptionIds.includes(id));
  return { correct, explanation: question.explanation, correctOptionIds: question.correctOptionIds };
}

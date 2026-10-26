import { z } from "zod";
import { NextResponse } from "next/server";
import { loadLesson } from "@/lib/content/lessons";
import { stableId } from "@/lib/content/schemas";
import { gradeQuiz, quizAnswerSchema } from "@/lib/grading/quiz";
const inputSchema = z.object({ lessonSlug: stableId, questionId: stableId, selected: quizAnswerSchema }).strict();
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 4096) return NextResponse.json({ error: "Risposta troppo grande" }, { status: 413 });
  try {
    const text = await request.text();
    if (text.length > 4096) return NextResponse.json({ error: "Risposta troppo grande" }, { status: 413 });
    const input = inputSchema.parse(JSON.parse(text));
    const lesson = loadLesson(input.lessonSlug);
    const question = lesson?.quiz.questions.find(q => q.id === input.questionId);
    if (!question) return NextResponse.json({ error: "Domanda non disponibile" }, { status: 404 });
    return NextResponse.json(gradeQuiz(question, input.selected), { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Risposta non valida: controlla le opzioni selezionate." }, { status: 400 }); }
}

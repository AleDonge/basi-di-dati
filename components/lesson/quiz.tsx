"use client";
import { useState } from "react";
import { z } from "zod";
import type { PublicQuestion } from "@/lib/content/quiz-schema";
import { useProgress } from "@/components/progress-provider";
import { saveQuizAttempt } from "@/lib/progress/db";
import { Button } from "@/components/ui/button";
const resultSchema = z.object({ correct: z.boolean(), explanation: z.string(), correctOptionIds: z.array(z.string()) });
function QuestionCard({ question, lesson, quizVersion }: { question: PublicQuestion; lesson: { id: string; slug: string; version: number }; quizVersion: number }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<z.infer<typeof resultSchema> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { data, ready, perform } = useProgress();
  const attempts = data.quizAttempts.filter(a => a.lessonId === lesson.id && a.lessonVersion === lesson.version && a.questionId === question.id && a.questionVersion === question.version);
  const latest = [...attempts].sort((a,b) => Date.parse(b.attemptedAt)-Date.parse(a.attemptedAt))[0];
  async function submit() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonSlug: lesson.slug, questionId: question.id, selected }) });
      if (!response.ok) throw new Error("Non è stato possibile correggere la risposta. Controlla le opzioni e il server locale.");
      const feedback = resultSchema.parse(await response.json());
      setResult(feedback);
      const saved = await perform(() => saveQuizAttempt({ id: crypto.randomUUID(), lessonId: lesson.id, lessonVersion: lesson.version, quizVersion, questionId: question.id, questionVersion: question.version, selectedOptionIds: selected, correct: feedback.correct, feedback: feedback.explanation, attemptedAt: new Date().toISOString() }));
      if (!saved) setError("Risposta valutata ma non salvata. Il risultato mostrato non conferma la persistenza.");
    } catch (err) { setError(err instanceof Error ? err.message : "Correzione non riuscita."); }
    finally { setBusy(false); }
  }
  return <div className="quiz-card"><fieldset disabled={busy}><legend>{question.prompt}</legend><p className="muted">{question.type === "multiple" ? "Seleziona tutte le risposte corrette." : question.type === "true-false" ? "Scegli vero o falso." : "Scegli una sola risposta."}</p><div className="quiz-options">{question.options.map(option => <label key={option.id}><input type={question.type === "multiple" ? "checkbox" : "radio"} name={question.id} value={option.id} checked={selected.includes(option.id)} onChange={e => { setResult(null); setError(""); setSelected(question.type !== "multiple" ? [option.id] : e.target.checked ? [...selected, option.id] : selected.filter(x => x !== option.id)); }} />{option.text}</label>)}</div></fieldset><Button variant="outline" disabled={!ready || busy || !selected.length} onClick={() => void submit()}>{busy ? "Verifica e salvataggio…" : "Verifica risposta"}</Button>
    {result && <div className={result.correct ? "quiz-feedback correct" : "quiz-feedback incorrect"} role="status"><strong>{result.correct ? "Risposta corretta" : "Da rivedere"}</strong><p>{result.explanation}</p><p>Risposte attese: {question.options.filter(o => result.correctOptionIds.includes(o.id)).map(o => o.text).join("; ")}</p></div>}
    {error && <p role="alert" className="error-text">{error}</p>}
    {ready && latest && <details className="quiz-history"><summary>Ultimo risultato salvato: {latest.correct ? "corretto" : "da rivedere"} · {attempts.length} tentativi</summary><p>Risposta: {question.options.filter(o => latest.selectedOptionIds.includes(o.id)).map(o => o.text).join("; ")}</p><p>{latest.feedback}</p><p>{new Date(latest.attemptedAt).toLocaleString("it-IT")}</p></details>}
  </div>;
}
export function LessonQuiz({ questions, lesson, quizVersion }: { questions: PublicQuestion[]; lesson: { id: string; slug: string; version: number }; quizVersion: number }) {
  return <section className="lesson-quiz" aria-labelledby="autoverifica"><p className="eyebrow">RAGIONA, POI VERIFICA</p><h2 id="autoverifica">Autoverifica</h2><p>Domande didattiche aggiuntive, da revisionare. Correzione deterministica sul server locale, senza AI. I tentativi si salvano separatamente dalla lettura.</p>{questions.map(q => <QuestionCard key={q.id} question={q} lesson={lesson} quizVersion={quizVersion} />)}</section>;
}

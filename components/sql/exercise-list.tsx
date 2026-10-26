"use client";
import Link from "next/link";
import type { SqlExercise } from "@/lib/sql/content";
import { useProgress } from "@/components/progress-provider";
export function SqlExerciseList({exercises}:{exercises:SqlExercise[]}) {
  const {data,ready}=useProgress();
  return <div className="sql-exercise-list">{exercises.map((e,i) => {
    const attempts=data.attempts.filter(a => a.exerciseId === e.id && a.exerciseVersion === e.version);
    const passed=attempts.some(a => a.result === "passed");
    return <Link href={`/practice/${e.id}`} key={e.id} className="panel"><span className="eyebrow">{e.datasetId.toUpperCase()} · {e.origin === "platform-activity" ? "DATABASE ACADEMY" : "CORSO"} · ESERCIZIO {i+1} · V{e.version}</span><h2>{e.title}</h2><p>{e.originalPrompt}</p><div className="exercise-tags"><span>{e.difficulty}</span><span>needs-review</span><span>{e.topics.join(" · ")}</span></div><p className="exercise-state">{!ready ? "Caricamento progressi…" : passed ? "✓ Verifica superata sulle fixture" : `${attempts.length} tentativi di verifica`} <span>Apri esercizio →</span></p></Link>;
  })}</div>;
}

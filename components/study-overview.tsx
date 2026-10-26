"use client";
import Link from "next/link";
import { useProgress } from "@/components/progress-provider";
import { manifest } from "@/lib/content";
import { moduleProgress } from "@/lib/progress/selectors";
export function StudyOverview() {
  const { data, ready } = useProgress();
  const visited = [...data.lessons].sort((a,b) => Date.parse(b.lastVisitedAt)-Date.parse(a.lastVisitedAt));
  const last = visited.find(p => manifest.lessons.some(l => l.id === p.lessonId && l.status !== "draft"));
  const lesson = manifest.lessons.find(l => l.id === last?.lessonId);
  const sqlExercises=manifest.exercises.filter(e => e.type === "sql");
  const sqlPassed=sqlExercises.filter(e => data.attempts.some(a => a.exerciseId === e.id && a.exerciseVersion === e.version && a.result === "passed")).length;
  const algebraExercises=manifest.exercises.filter(e=>e.type==="relational-algebra"&&e.gradingMode==="automatic");
  const algebraPassed=algebraExercises.filter(e=>data.attempts.some(a=>a.exerciseId===e.id&&a.exerciseVersion===e.version&&a.result==="passed")).length;
  const erExercises=manifest.exercises.filter(e=>e.type==="er-guided");
  const erCompleted=erExercises.filter(e=>data.erDiagrams.some(r=>r.exerciseId===e.id&&r.exerciseVersion===e.version&&r.manuallyCompletedAt)).length;
  const total = manifest.lessons.filter(l => l.status !== "draft").length;
  const completed = manifest.modules.reduce((sum,m) => sum + moduleProgress(m.id, manifest.lessons, data).completed, 0);
  return <section className="study-overview" aria-label="I tuoi progressi"><div><p className="eyebrow">IL TUO STUDIO, IN LOCALE</p><h2>{ready ? `${completed} di ${total} letture completate` : "Caricamento progressi…"}</h2><p>{ready && last ? `Ultimo studio: ${new Date(last.lastVisitedAt).toLocaleString("it-IT")}` : "Completamenti e quiz sono indipendenti. Le anteprime restano da revisionare."}</p>{lesson && <Link href={`/learn/${lesson.slug}`} className="text-link">Continua: {lesson.title} →</Link>}</div><div className="overview-modules">{manifest.modules.filter(m => manifest.lessons.some(l => l.moduleId === m.id)).map(m => {
    const value = moduleProgress(m.id, manifest.lessons, data);
    return <div key={m.id}><span>{m.title} <strong>{ready ? `${value.completed}/${value.total}` : "…"}</strong></span><progress max={value.total} value={value.completed} aria-label={`Progressi ${m.title}`} /></div>;
  })}</div><div className="overview-sql"><Link href="/practice">SQL Sailors: {ready ? `${sqlPassed}/${sqlExercises.length}` : "…"} verifiche superate sulle fixture →</Link><p><Link href="/practice#algebra">Algebra: {ready?`${algebraPassed}/${algebraExercises.length}`:"…"} verifiche coerenti sulle fixture →</Link></p><p><Link href="/practice#er">Progettazione ER: {ready?`${erCompleted}/${erExercises.length}`:"…"} attività completate manualmente →</Link></p><p>Progressi per versione. Soluzioni della piattaforma needs-review.</p></div></section>;
}

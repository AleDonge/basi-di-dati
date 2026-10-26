"use client";
import Link from "next/link";
import { manifest } from "@/lib/content";
import { useProgress } from "@/components/progress-provider";
import { moduleProgress, latestQuizResults } from "@/lib/progress/selectors";
export function LessonCatalog() {
  const { data, ready } = useProgress();
  return <div className="lesson-catalog">{manifest.modules.map(module => {
    const lessons = manifest.lessons.filter(l => l.moduleId === module.id && l.status !== "draft").toSorted((a,b) => a.order-b.order);
    const progress = moduleProgress(module.id, manifest.lessons, data);
    return <section className="catalog-module panel" key={module.id}><div className="section-heading"><h2>{module.title}</h2><span className="module-status">{lessons.length ? `${lessons.length} anteprime da revisionare` : "Da preparare"}</span></div><p>{module.description}</p>{lessons.length > 0 ? <><div className="catalog-progress"><progress max={progress.total} value={progress.completed} aria-label={`Avanzamento ${module.title}`} /><span>{ready ? `${progress.completed}/${progress.total} letture completate` : "Caricamento progressi…"}</span></div><ol>{lessons.map(lesson => {
      const completed = data.lessons.some(p => p.lessonId === lesson.id && p.lessonVersion === lesson.version && p.completedAt);
      const results = latestQuizResults(lesson.id, lesson.version, data);
      return <li key={lesson.id}><Link href={`/learn/${lesson.slug}`}><span className="lesson-nav-mark">{completed ? "✓" : "○"}</span><span><strong>{lesson.title}</strong><span>{lesson.description}</span><small>{completed ? "Lettura completata" : "Da leggere"}{results.length ? ` · Quiz: ${results.filter(r => r.correct).length}/${results.length} ultimi risultati corretti` : " · Quiz non ancora svolto"}</small></span><span aria-hidden="true">→</span></Link></li>;
    })}</ol></> : <p className="muted">Materiali presenti; lezioni non ancora preparate.</p>}</section>;
  })}</div>;
}

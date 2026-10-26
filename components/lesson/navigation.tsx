"use client";
import Link from "next/link";
import type { Manifest } from "@/lib/content/schemas";
import { useProgress } from "@/components/progress-provider";
import { moduleProgress } from "@/lib/progress/selectors";
export function LessonNavigation({ lessons, currentId }: { lessons: Manifest["lessons"]; currentId: string }) {
  const { data, ready } = useProgress();
  const current = lessons.find(l => l.id === currentId)!;
  const progress = moduleProgress(current.moduleId, lessons, data);
  return <aside className="lesson-nav"><Link href="/learn" className="text-link">← Tutti i moduli</Link><h2>In questo modulo</h2><p>{ready ? `${progress.completed} di ${progress.total} letture completate` : "Caricamento progressi…"}</p><progress value={progress.completed} max={progress.total || 1} aria-label="Letture completate nel modulo" />
    <nav aria-label="Lezioni del modulo">{lessons.filter(l => l.moduleId === current.moduleId && l.status !== "draft").map(l => {
      const completed = data.lessons.some(p => p.lessonId === l.id && p.lessonVersion === l.version && p.completedAt);
      return <Link key={l.id} href={`/learn/${l.slug}`} aria-current={l.id === currentId ? "page" : undefined}><span className="lesson-nav-mark" aria-label={completed ? "Completata" : "Da leggere"}>{completed ? "✓" : "○"}</span><span>{l.title}</span></Link>;
    })}</nav><p className="muted">Anteprime da revisionare. Il completamento non modifica lo stato editoriale.</p></aside>;
}

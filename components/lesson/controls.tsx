"use client";
import { useEffect, useState } from "react";
import { useProgress } from "@/components/progress-provider";
import { updateLessonProgress } from "@/lib/progress/db";
import { Button } from "@/components/ui/button";
export function LessonControls({ id, version }: { id: string; version: number }) {
  const { data, ready, perform } = useProgress();
  const [busy, setBusy] = useState(false);
  const record = data.lessons.find(p => p.lessonId === id && p.lessonVersion === version);
  const previous = data.lessons.some(p => p.lessonId === id && p.lessonVersion !== version && p.completedAt);
  useEffect(() => { void perform(() => updateLessonProgress(id, version)); }, [id, version, perform]);
  async function toggle() {
    setBusy(true); await perform(() => updateLessonProgress(id, version, !record?.completedAt)); setBusy(false);
  }
  return <div className="lesson-controls"><Button disabled={!ready || busy} onClick={() => void toggle()} variant={record?.completedAt ? "outline" : "default"}>{busy ? "Salvataggio…" : record?.completedAt ? "Annulla completamento" : "Segna come completata"}</Button><div aria-live="polite">{!ready ? "Caricamento progressi locali…" : record?.completedAt ? `Completata il ${new Date(record.completedAt).toLocaleDateString("it-IT")}` : previous ? "Hai completato una versione precedente; il dato è conservato." : "Il completamento registra la lettura, non il superamento del quiz."}</div></div>;
}

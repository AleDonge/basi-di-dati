"use client";
import { useState, type ChangeEvent } from "react";
import { useProgress } from "@/components/progress-provider";
import { parseBackup, type ProgressBackup } from "@/lib/progress/schemas";
import { mergeProgress } from "@/lib/progress/merge";
import { importProgress, readProgress } from "@/lib/progress/db";
import { Button } from "@/components/ui/button";
import { manifest } from "@/lib/content";
export function ProgressBackupControls() {
  const { ready, data, perform } = useProgress();
  const [pending, setPending] = useState<ProgressBackup | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function exportBackup() {
    setError(""); setBusy(true);
    try {
      const current = await readProgress();
      const serialized=JSON.stringify(current,null,2);
      if(new TextEncoder().encode(serialized).length>5*1024*1024)throw new Error("Archivio oltre il limite importabile di 5 MB: esportazione sospesa senza eliminare dati. Le singole copie dei diagrammi restano disponibili in ER Lab.");
      const url = URL.createObjectURL(new Blob([serialized], { type: "application/json" }));
      const link = document.createElement("a"); link.href = url; link.download = `database-academy-progressi-${new Date().toISOString().slice(0,10)}.json`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Backup esportato. Conserva il file in una cartella sicura del tuo dispositivo.");
    } catch (err) { setError(err instanceof Error?err.message:"Esportazione non riuscita: i progressi non sono stati modificati."); }
    finally { setBusy(false); }
  }
  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; setPending(null); setConfirmed(false); setError(""); setMessage("");
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("Il backup supera il limite di 5 MB.");
      const parsed = parseBackup(await file.text());
      mergeProgress(data, parsed);
      setPending(parsed);
    } catch (err) { setError(err instanceof Error ? err.message : "File non valido."); }
    finally { setBusy(false); event.target.value = ""; }
  }
  async function confirmImport() {
    if (!pending || !confirmed) return;
    setBusy(true); setError("");
    const saved = await perform(() => importProgress(pending));
    if (saved) { setPending(null); setConfirmed(false); setMessage("Importazione completata. Dati uniti; nessun tentativo locale eliminato."); }
    else setError("Importazione non riuscita. L’operazione è atomica: controlla il messaggio di errore e riprova.");
    setBusy(false);
  }
  const unknown = pending?.lessons.filter(p => !manifest.lessons.some(l => l.id === p.lessonId)).length ?? 0;
  return <section className="panel backup-panel" aria-labelledby="backup-title"><h2 id="backup-title">Progressi e backup</h2><p>Progressi salvati in IndexedDB nel browser di questo dispositivo. Per i diagrammi ER usa esplicitamente “Salva versione ER” prima di esportare. Cancella i dati del sito solo dopo aver esportato un backup. Usa sempre lo stesso indirizzo e la stessa porta: localhost e 127.0.0.1 hanno archivi distinti.</p><div className="backup-actions"><Button disabled={!ready || busy} onClick={() => void exportBackup()}>Esporta progressi JSON</Button><label className="file-label">Importa backup JSON<span className="file-picker">Scegli file JSON</span><input className="file-input" type="file" accept=".json,application/json" disabled={!ready || busy} onChange={event => void selectFile(event)} /></label></div><p className="muted">Formato v5; backup v1/v2/v3/v4 migrati senza cancellare dati. Limite 5 MB. Solo fusione conservativa: conserva letture, date e tentativi; i conflitti di ID bloccano l’importazione.</p>
    {pending && <div className="import-preview" aria-labelledby="import-title"><h3 id="import-title">Anteprima importazione</h3><p>{pending.lessons.length} registrazioni di lezione · {pending.quizAttempts.length} tentativi quiz · {pending.attempts.length} tentativi esercizi · {pending.sqlHistory.length} query in cronologia · {pending.erDiagrams.length} versioni di diagrammi ER · {pending.examPlans.length} piani Exam Prep · {pending.examRuns.length} revisioni di sessioni · {pending.studyPlans.length} versioni di piani di studio.</p><p>Le versioni precedenti e gli ID fuori catalogo vengono conservati. {unknown > 0 && `${unknown} registrazioni di lezioni non presenti nel catalogo attuale.`} I completamenti già presenti non verranno annullati e le date di ultima visita più recenti verranno mantenute.</p><label className="confirm-label"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />Ho controllato l’anteprima e voglio unire questi dati ai progressi locali.</label><div className="backup-actions"><Button disabled={!confirmed || busy} onClick={() => void confirmImport()}>Conferma importazione</Button><Button variant="outline" disabled={busy} onClick={() => { setPending(null); setConfirmed(false); }}>Annulla importazione</Button></div></div>}
    {message && <p role="status" className="success-text">{message}</p>}{error && <p role="alert" className="error-text">{error}</p>}
  </section>;
}

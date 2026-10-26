"use client";
import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Square, Database, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SqlEditor } from "./editor";
import { SqlResults } from "./results";
import { BrowserSqlAdapter } from "@/lib/sql/client";
import { SqlLabError, type SqlFixture, type SqlResult } from "@/lib/sql/types";
import type { SqlCatalog, SqlExercise } from "@/lib/sql/content";
import { gradeSql, type SqlGrade } from "@/lib/grading/sql";
import { useProgress } from "@/components/progress-provider";
import { saveSqlHistory, saveExerciseAttempt } from "@/lib/progress/db";
type DatasetId = "sailors" | "northwind";
const errorLabels = { validation:"Query non ammessa",syntax:"Errore di sintassi",execution:"Errore di esecuzione",timeout:"Limite di esecuzione",cancelled:"Esecuzione annullata",resource:"Limite di risorse" };
function asSqlError(err:unknown) { return err instanceof SqlLabError ? err : new SqlLabError("execution",err instanceof Error ? err.message : "Errore del laboratorio locale."); }
export function SqlWorkspace({exercise}:{exercise?:SqlExercise}) {
  const adapter = useRef<BrowserSqlAdapter | null>(null); const cancelledRun = useRef(false);
  const [dataset,setDataset] = useState<DatasetId>(exercise?.datasetId ?? "sailors");
  const [catalog,setCatalog] = useState<SqlCatalog | null>(null);
  const [table,setTable] = useState(""); const [preview,setPreview] = useState<SqlResult | null>(null);
  const [query,setQuery] = useState(""); const [result,setResult] = useState<SqlResult | null>(null);
  const [busy,setBusy] = useState(false); const [loaded,setLoaded] = useState(false);
  const [error,setError] = useState<SqlLabError | null>(null); const [message,setMessage] = useState("");
  const [grade,setGrade] = useState<SqlGrade | null>(null); const [solution,setSolution] = useState(""); const [solutionBusy,setSolutionBusy]=useState(false);
  const { data,ready,perform } = useProgress();
  useEffect(() => {
    const runtime=new BrowserSqlAdapter(); adapter.current=runtime; let cancelled=false;
    void runtime.loadFixture(exercise?.datasetId ?? "sailors").then(async () => {
      if(cancelled) return;
      setCatalog(runtime.catalog!); setTable(runtime.catalog!.tables[0].name);
      setQuery(exercise ? "" : `SELECT * FROM ${runtime.catalog!.tables[0].name};`);
      const result=await runtime.executeReadOnly(`SELECT * FROM "${runtime.catalog!.tables[0].name}" LIMIT 10;`);
      if(!cancelled) {setPreview(result);setLoaded(true);}
    }).catch(err => { if(!cancelled) setError(asSqlError(err)); });
    return () => { cancelled=true; runtime.stop(); adapter.current=null; };
  },[exercise]);
  async function changeDataset(id:DatasetId) {
    setBusy(true);setLoaded(false);setError(null);setResult(null);setGrade(null);setPreview(null);setDataset(id);
    try { await adapter.current!.loadFixture(id); const c=adapter.current!.catalog!;setCatalog(c);setTable(c.tables[0].name);setQuery(`SELECT * FROM "${c.tables[0].name}";`);setPreview(await adapter.current!.executeReadOnly(`SELECT * FROM "${c.tables[0].name}" LIMIT 10;`));setLoaded(true); }
    catch(err) {setError(asSqlError(err));} finally {setBusy(false);}
  }
  async function showTable(name:string) {
    setBusy(true);setTable(name);setError(null);
    try {setPreview(await adapter.current!.executeReadOnly(`SELECT * FROM "${name}" LIMIT 10;`));}
    catch(err) {setError(asSqlError(err));} finally {setBusy(false);}
  }
  async function run(verify=false,queryOverride?:string) {
    const submitted=queryOverride ?? query;
    if(busy || !loaded || !submitted.trim()) return;
    cancelledRun.current=false;
    setBusy(true);setError(null);setMessage("");setGrade(null);setResult(null);
    try {
      if(verify && exercise) {
        const response=await fetch(`/api/sql/exercise/${exercise.id}/grading`);
        if(!response.ok) throw new SqlLabError("execution","Materiali di verifica locali non disponibili.");
        const bundle=await response.json() as { query:string; fixtures:SqlFixture[] };
        const feedback=await gradeSql(submitted,bundle.query,bundle.fixtures,(f,q) => { if(cancelledRun.current) throw new SqlLabError("cancelled","Verifica annullata."); return adapter.current!.executeFixture(f,q); }, exercise.orderMatters);
        setGrade(feedback);
        const text=feedback.message+"\n"+feedback.checks.map(c => `${c.fixtureId}: ${c.passed ? "coerente" : "da rivedere"} — ${c.detail}`).join("\n");
        await perform(() => saveExerciseAttempt({id:crypto.randomUUID(),exerciseId:exercise.id,exerciseVersion:exercise.version,answer:submitted,result:feedback.status === "passed" ? "passed" : feedback.status === "failed" ? "failed" : "unsupported",verificationStatus:feedback.status === "failed" ? "mismatch" : feedback.status,feedback:text,attemptedAt:new Date().toISOString()}));
      } else {
        const output=await adapter.current!.executeReadOnly(submitted);setResult(output);
        await perform(() => saveSqlHistory({id:crypto.randomUUID(),datasetId:dataset,query:submitted,status:"executed",rowCount:output.rows.length,feedback:output.truncated ? "Eseguita con risultato limitato." : "Eseguita.",attemptedAt:new Date().toISOString()}));
      }
    } catch(err) {
      const failure=asSqlError(err);setError(failure);
      if(verify && exercise) await perform(() => saveExerciseAttempt({id:crypto.randomUUID(),exerciseId:exercise.id,exerciseVersion:exercise.version,answer:submitted,result:"unsupported",verificationStatus:failure.kind,feedback:failure.message,attemptedAt:new Date().toISOString()}));
      else await perform(() => saveSqlHistory({id:crypto.randomUUID(),datasetId:dataset,query:submitted,status:failure.kind,feedback:failure.message,attemptedAt:new Date().toISOString()}));
    } finally {setBusy(false);}
  }
  async function reset() {
    if(busy) return;setBusy(true);setError(null);setResult(null);setGrade(null);setMessage("");
    try {await adapter.current!.reset();setPreview(await adapter.current!.executeReadOnly(`SELECT * FROM "${table}" LIMIT 10;`));setLoaded(true);setMessage("Database ripristinato dai dati convertiti dell’originale. Cronologia e progressi conservati.");}
    catch(err) {setError(asSqlError(err));} finally {setBusy(false);}
  }
  const selected=catalog?.tables.find(t => t.name === table);
  const attempts=exercise ? data.attempts.filter(a => a.exerciseId === exercise.id && a.exerciseVersion === exercise.version).toSorted((a,b) => Date.parse(b.attemptedAt)-Date.parse(a.attemptedAt)) : [];
  const history=data.sqlHistory.filter(h => h.datasetId === dataset).toSorted((a,b) => Date.parse(b.attemptedAt)-Date.parse(a.attemptedAt)).slice(0,30);
  async function revealSolution() {
    if(!exercise) return;setSolutionBusy(true);
    try {const response=await fetch(`/api/sql/exercise/${exercise.id}/solution`);if(!response.ok)throw new Error("Soluzione locale non disponibile");const value=await response.json() as {query:string};setSolution(value.query);}
    catch(err) {setError(asSqlError(err));}finally{setSolutionBusy(false);}
  }
  return <div className="sql-workspace"><div className="sql-toolbar"><label>Database<select aria-label="Database SQL" value={dataset} disabled={busy || (!loaded && !error) || !!exercise} onChange={e => void changeDataset(e.target.value as DatasetId)}><option value="sailors">Sailors · 3 tabelle</option><option value="northwind">NorthWind · 8 tabelle</option></select></label><span className="dialect-badge">SQLite · compatibilità parziale con MySQL</span><Button variant="outline" disabled={busy || !loaded} onClick={() => void reset()}><RotateCcw size={15}/>Reset database</Button></div>
    {!loaded && !error && <p role="status" className="sql-loading">Caricamento del motore WASM e del dataset locale…</p>}
    {exercise && <section className="exercise-contract"><p><strong>Output della piattaforma, in quest’ordine:</strong> {exercise.outputContract.join(" · ")}. Alias liberi.</p><p>{exercise.interpretation}</p>{attempts.some(a => a.result === "passed") && <p className="success-text">Completamento locale: verifica superata sulle fixture per la versione {exercise.version}. Non equivale ad approvazione del docente.</p>}</section>}
    <div className="sql-layout"><aside className="sql-explorer"><h2><Database size={16}/>Esplora le tabelle</h2><nav aria-label="Tabelle del database">{catalog?.tables.map(t => <button key={t.name} aria-pressed={t.name === table} disabled={busy || !loaded} onClick={() => void showTable(t.name)}><span>{t.name}</span><small>{t.rowCount}</small><ChevronRight size={13}/></button>)}</nav>{selected && <details className="sql-schema" open><summary>Schema di {selected.name}</summary><ul>{selected.columns.map(c => <li key={c.name}><strong>{c.name}</strong><span>{c.type}{c.primaryKey ? " · PK" : ""}{c.notNull ? " · NOT NULL" : ""}</span></li>)}</ul>{selected.foreignKeys.map(f => <p key={f.column}>FK {f.column} → {f.table}.{f.targetColumn}</p>)}<details><summary>DDL SQLite convertito</summary><pre>{selected.ddl}</pre></details></details>}</aside>
    <div className="sql-main"><SqlEditor value={query} onChange={setQuery} disabled={busy || !loaded} onExecute={currentQuery => void run(false,currentQuery)} /><div className="sql-actions"><Button disabled={busy || !loaded || !query.trim()} onClick={() => void run()}><Play size={15}/>Esegui</Button>{exercise && <Button variant="outline" disabled={busy || !ready || !loaded || !query.trim()} onClick={() => void run(true)}>Verifica su {exercise.fixtureIds.length} fixture</Button>}<Button variant="outline" disabled={!busy} onClick={() => {cancelledRun.current=true;adapter.current?.stop();}}><Square size={13}/>Interrompi worker</Button><span>{busy ? "Esecuzione in corso…" : "Solo lettura · fino a 500 righe · budget 1,5 s"}</span></div>
      {error && <div className="sql-error" role="alert"><strong>{errorLabels[error.kind]}</strong><p>{error.message}</p>{!loaded && <Button variant="outline" disabled={busy} onClick={() => void changeDataset(dataset)}>Riprova caricamento</Button>}</div>}
      {message && <p role="status" className="success-text">{message}</p>}
      {result && <section className="sql-result-panel"><h2>Risultati</h2><SqlResults result={result}/></section>}
      {grade && <section className={`sql-grade ${grade.status}`} aria-live="polite"><h2>{grade.status === "passed" ? "Coerente sulle fixture" : grade.status === "failed" ? "Da rivedere" : "Verifica inconclusiva"}</h2><p>{grade.message}</p><ul>{grade.checks.map(c => <li key={c.fixtureId}><strong>{c.passed ? "✓" : "○"} {c.fixtureId}</strong><span>{c.detail}</span></li>)}</ul></section>}
      <details className="sql-preview"><summary>Anteprima di {table || "tabella"} · prime 10 righe</summary>{preview && <SqlResults result={preview} caption={`Anteprima ${table}`}/>}</details>
      {exercise && <div className="exercise-support"><details><summary>Suggerimenti</summary><ol>{exercise.hints.map(h => <li key={h}>{h}</li>)}</ol></details><details><summary>Limiti della verifica e provenienza</summary><ul>{exercise.limitations.map(l => <li key={l}>{l}</li>)}</ul>{exercise.sourceRefs.map(s => <p key={s.sourceId}>{s.file} · {s.section}</p>)}<p>Le fixture sintetiche aggiuntive sono della piattaforma e non modificano il dataset ufficiale.</p></details><Button variant="outline" disabled={solutionBusy} onClick={() => void revealSolution()}>{solutionBusy ? "Caricamento…" : "Mostra soluzione di riferimento"}</Button>{solution && <div className="reference-solution"><p>Soluzione Database Academy · needs-review · non fornita dal docente.</p><pre>{solution}</pre></div>}<h2>Tentativi di questo esercizio</h2>{attempts.length ? <ol className="sql-history">{attempts.slice(0,30).map(a => <li key={a.id}><p>{new Date(a.attemptedAt).toLocaleString("it-IT")} · {a.verificationStatus ? ({passed:"coerente sulle fixture",mismatch:"da rivedere",inconclusive:"inconclusiva",...errorLabels})[a.verificationStatus] : ({passed:"coerente sulle fixture",failed:"da rivedere",guided:"guidata",unsupported:"non determinata"})[a.result]}</p><pre>{a.answer}</pre><p>{a.feedback}</p></li>)}</ol> : <p>Nessuna verifica salvata. L’esecuzione libera non completa l’esercizio.</p>}</div>}
      <details className="sql-query-history"><summary>Cronologia query · {history.length} più recenti per {dataset}</summary>{!ready ? <p>Caricamento progressi locali…</p> : !history.length ? <p>Nessuna query ancora eseguita.</p> : <ol className="sql-history">{history.map(h => <li key={h.id}><p>{new Date(h.attemptedAt).toLocaleString("it-IT")} · {h.status === "executed" ? "eseguita" : errorLabels[h.status]}</p><pre>{h.query}</pre><p>{h.feedback}</p><Button variant="ghost" disabled={busy} onClick={() => setQuery(h.query)}>Riprendi query</Button></li>)}</ol>}</details>
    </div></div><p className="sql-limit-note">Database effimero ricreato per ogni query. Il worker SQL non usa IndexedDB o file persistenti. Limiti: 64 colonne, 512 KiB di valori, 8 KiB circa per cella, budget istruzioni e timeout. Nessuna garanzia di sicurezza assoluta o equivalenza MySQL.</p></div>;
}

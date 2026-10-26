import { manifest } from "@/lib/content";
import {erExercises,loadErExercise} from "@/lib/er/content";
import {ErWorkspace} from "@/components/er/workspace";
import {algebraExercises,loadAlgebraExercise} from "@/lib/algebra/content";
import {AlgebraWorkspace} from "@/components/algebra/workspace";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadSqlExercise } from "@/lib/sql/content";
import { SqlWorkspace } from "@/components/sql/workspace";
export function generateStaticParams() {return [...manifest.exercises.filter(e=>e.type==="sql").map(e=>({id:e.id})),...algebraExercises().map(e=>({id:e.id})),...erExercises().map(e=>({id:e.id}))];}
export async function generateMetadata({params}:{params:Promise<{id:string}>}) { const {id}=await params;try{return{title:(id.startsWith("er-")?loadErExercise(id):id.startsWith("ar-")?loadAlgebraExercise(id):loadSqlExercise(id)).title};}catch{return{title:"Esercizio non trovato"};} }
export default async function ExercisePage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  if(id.startsWith("er-")){let er;try{er=loadErExercise(id);}catch{notFound();}return <><Link className="text-link" href="/practice#er">← Attività ER</Link><p className="eyebrow">ER · PROGETTAZIONE GUIDATA · NEEDS-REVIEW</p><h1>{er.title}</h1><section className="official-prompt"><span className="mini-label">{er.origin==="course-question"?"DOMANDA DELLE SLIDE · TRASCRIZIONE":"ATTIVITÀ ORIGINALE DATABASE ACADEMY"} · {er.difficulty}</span><p>{er.prompt}</p>{er.sourceRefs.map(ref=><p key={`${ref.sourceId}-${ref.pageStart}`}><a href={`/sources/${ref.sourceId}#page=${ref.pageStart}`}>{ref.file} · pp. {ref.pageStart}–{ref.pageEnd}</a></p>)}</section><ErWorkspace key={er.id} exercise={er}/></>;}
  if(id.startsWith("ar-")){let algebra;try{algebra=loadAlgebraExercise(id);}catch{notFound();}return <><Link href="/practice#algebra" className="text-link">← Esercizi algebra</Link><p className="eyebrow">ALGEBRA · {algebra.gradingMode==="guided"?"AUTOVERIFICA GUIDATA":"VERIFICA SU FIXTURE"} · {algebra.difficulty} · V{algebra.version}</p><h1>{algebra.title}</h1><section className="official-prompt"><span className="mini-label">ENUNCIATO ORIGINALE · TRASCRIZIONE NEEDS-REVIEW</span><p>{algebra.originalPrompt}</p>{algebra.sourceRefs.map(ref=><p key={ref.sourceId}><a href={`/sources/${ref.sourceId}#page=${ref.pageStart}`}>{ref.file} · p. {ref.pageStart}</a></p>)}</section><AlgebraWorkspace key={algebra.id} exercise={algebra}/></>;}
  let exercise;try{exercise=loadSqlExercise(id);}catch{notFound();}
  return <><Link href="/practice" className="text-link">← Tutti gli esercizi</Link><p className="eyebrow exercise-eyebrow">PRACTICE · {exercise.datasetId.toUpperCase()} · {exercise.difficulty} · V{exercise.version}</p><h1>{exercise.title}</h1><section className="official-prompt"><span className="mini-label">{exercise.origin === "platform-activity" ? "ESERCIZIO ORIGINALE DATABASE ACADEMY · NEEDS-REVIEW" : `ENUNCIATO ORIGINALE · ESERCIZI 1 SAILOR.TXT · #${Number(id.slice(-1))}`}</span><p>{exercise.originalPrompt}</p></section><p className="muted">Soluzione e interpretazione della piattaforma: needs-review. Nessuna soluzione del docente è presente nella raccolta originale. Il dataset mostrato rimane quello ufficiale convertito.</p><SqlWorkspace exercise={exercise}/></>;
}

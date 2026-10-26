import {erExercises} from "@/lib/er/content";
import {ErExerciseList} from "@/components/er/exercise-list";
import {algebraExercises} from "@/lib/algebra/content";
import {AlgebraExerciseList} from "@/components/algebra/exercise-list";
import { loadSqlExercise } from "@/lib/sql/content";
import { manifest } from "@/lib/content";
import { SqlExerciseList } from "@/components/sql/exercise-list";
export const metadata = { title: "Practice" };
export default function Practice() {const exercises=manifest.exercises.filter(e => e.type === "sql").map(e => loadSqlExercise(e.id));return <><p className="eyebrow">PRACTICE · ESERCIZI SQL</p><h1>Metti alla prova ciò che impari.</h1><p className="lead">Progettare le query SQL che rispondono a queste domande: cinque enunciati ufficiali Sailors ed esercizi originali Database Academy su Sailors e NorthWind, con verifica locale su fixture multiple.</p><div className="notice"><strong>Provenienza esplicita, soluzioni della piattaforma da revisionare</strong><p>Le soluzioni generate per Database Academy restano needs-review. La verifica confronta risultati su dati finiti secondo un contratto esplicito: non prova equivalenza generale né compatibilità completa con MySQL.</p></div><SqlExerciseList exercises={exercises}/><AlgebraExerciseList exercises={algebraExercises()}/><ErExerciseList exercises={erExercises()}/></>;}

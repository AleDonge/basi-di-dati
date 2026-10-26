import {readFileSync} from "node:fs";
import {join} from "node:path";
import {z} from "zod";
import {manifest} from "@/lib/content";
import {sourceRefSchema} from "@/lib/content/schemas";
import {fixtureSchema} from "./schema";
const root=join(process.cwd(),"content/courses/basi-di-dati");
export const algebraExerciseSchema=z.object({id:z.string(),title:z.string(),version:z.number().int().positive(),status:z.literal("needs-review"),originalPrompt:z.string(),sourceRefs:z.array(sourceRefSchema).min(1),datasetId:z.enum(["sailors","impiegati-demo"]),difficulty:z.string(),gradingMode:z.enum(["automatic","guided"]),fixtureIds:z.array(z.string()),solutionPath:z.string().regex(/^algebra\/solutions\/[a-z0-9-]+\.txt$/),hints:z.array(z.string()),interpretation:z.string(),limitations:z.array(z.string()),solutionOrigin:z.string(),expectedColumns:z.array(z.string())}).strict().refine(e=>e.gradingMode!=="automatic"||e.fixtureIds.length>=2);
export type AlgebraExercise=z.infer<typeof algebraExerciseSchema>;
export function algebraExercises(){return manifest.exercises.filter(e=>e.type==="relational-algebra").map(e=>loadAlgebraExercise(e.id));}
export function loadAlgebraExercise(id:string){const entry=manifest.exercises.find(e=>e.id===id&&e.type==="relational-algebra");if(!entry)throw new Error("Esercizio algebra non disponibile");const e=algebraExerciseSchema.parse(JSON.parse(readFileSync(join(root,"algebra/exercises",`${entry.id}.json`),"utf8")));if(e.id!==entry.id||e.version!==entry.version||e.gradingMode!==entry.gradingMode)throw new Error("Metadati algebra divergenti");return e;}
const fixtures=["sailors","sailors-algebra-edges","sailors-algebra-empty","sailors-algebra-no-reserves","sailors-algebra-reversed","impiegati-demo","impiegati-edges","impiegati-empty","impiegati-reversed"];
export function loadAlgebraFixture(id:string){if(!fixtures.includes(id))throw new Error("Dataset algebra non disponibile");return fixtureSchema.parse(JSON.parse(readFileSync(join(root,"algebra/datasets",`${id}.json`),"utf8")));}
export function algebraSolution(e:AlgebraExercise){return readFileSync(join(root,e.solutionPath),"utf8");}
export function algebraGrading(e:AlgebraExercise){if(e.gradingMode!=="automatic")throw new Error("Esercizio guidato: nessun correttore automatico");return{reference:algebraSolution(e),fixtures:e.fixtureIds.map(loadAlgebraFixture)};}

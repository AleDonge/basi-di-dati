import {readFileSync} from "node:fs";
import {join} from "node:path";
import {z} from "zod";
import {manifest} from "@/lib/content";
import {sourceRefSchema} from "@/lib/content/schemas";
import {diagramSchema} from "./model";
const root=join(process.cwd(),"content/courses/basi-di-dati");
export const erExerciseSchema=z.object({id:z.string(),title:z.string(),version:z.number().int().positive(),status:z.literal("needs-review"),origin:z.enum(["course-question","platform-activity"]),prompt:z.string(),difficulty:z.string(),sourceRefs:z.array(sourceRefSchema).min(1),hints:z.array(z.string()),initial:diagramSchema,solutionPath:z.string().regex(/^er\/solutions\/[a-z0-9-]+\.md$/),referenceDiagramPath:z.string().regex(/^er\/diagrams\/[a-z0-9-]+\.json$/).optional(),checks:z.array(z.object({kind:z.enum(["entity","attribute","participation"]),entity:z.string(),name:z.string(),min:z.number().optional(),max:z.union([z.number(),z.literal("N")]).optional()}).strict()),limitations:z.array(z.string())}).strict();
export type ErExercise=z.infer<typeof erExerciseSchema>;
export function erExercises(){return manifest.exercises.filter(e=>e.type==="er-guided").map(e=>loadErExercise(e.id));}
export function loadErExercise(id:string){const entry=manifest.exercises.find(e=>e.id===id&&e.type==="er-guided");if(!entry)throw new Error("Attività ER non disponibile");return erExerciseSchema.parse(JSON.parse(readFileSync(join(root,"er/exercises",`${entry.id}.json`),"utf8")));}
export function erReference(e:ErExercise){return{text:readFileSync(join(root,e.solutionPath),"utf8"),diagram:e.referenceDiagramPath?diagramSchema.parse(JSON.parse(readFileSync(join(root,e.referenceDiagramPath),"utf8"))):undefined};}

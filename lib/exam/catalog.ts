import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {manifest} from "@/lib/content";
import {loadLesson} from "@/lib/content/lessons";
import {publicQuestion,questionSchema,type Question} from "@/lib/content/quiz-schema";
import {z} from "zod";
import {fixtureSchema} from "@/lib/algebra/schema";
import {loadSqlExercise,loadSolution,loadGradingFixtures,loadDataset} from "@/lib/sql/content";
import {algebraExercises,algebraGrading,algebraSolution,loadAlgebraFixture} from "@/lib/algebra/content";
import {erExercises,erReference} from "@/lib/er/content";
import {publicItemSchema,type ExamItem} from "./schema";

export function buildArchive(){
 const records:Record<string,{item:ExamItem;grading:unknown}>={};
 for(const meta of manifest.lessons.filter(l=>l.status!=="draft")){
  const lesson=loadLesson(meta.slug)!;
  for(const q of lesson.quiz.questions){const key=`quiz:${q.id}@${q.version}`,safe=publicQuestion(q);records[key]={item:publicItemSchema.parse({key,id:q.id,version:q.version,kind:"quiz",moduleId:meta.moduleId,title:meta.title,prompt:q.prompt,difficulty:"non-classificato",status:"needs-review",sourceRefs:q.sourceRefs,concepts:q.concepts,lessonIds:[meta.id],grading:"quiz",context:["Difficoltà non classificata nel contenuto originale; nessuna difficoltà dedotta automaticamente."],questionType:safe.type,options:safe.options}),grading:{question:q,lessonId:meta.id,lessonVersion:meta.version,quizVersion:lesson.quiz.version}};}
 }
 for(const e of manifest.exercises.filter(e=>e.type==="sql")){
  const x=loadSqlExercise(e.id),key=`sql:${x.id}@${x.version}`;
  records[key]={item:publicItemSchema.parse({key,id:x.id,version:x.version,kind:"sql",moduleId:e.moduleId,title:x.title,prompt:x.originalPrompt,difficulty:e.difficulty,status:"needs-review",sourceRefs:e.sourceRefs,concepts:x.topics,lessonIds:x.lessonIds.length?x.lessonIds:manifest.lessons.filter(l=>l.moduleId===e.moduleId).map(l=>l.id),grading:"fixtures",context:["SQLite: compatibilità parziale con MySQL/MariaDB.",x.interpretation,...x.outputContract,...x.limitations,loadDataset(x.datasetId).catalog.tables.map(t=>`${t.name}(${t.columns.map(c=>`${c.name}: ${c.type}`).join(", ")})`).join("; ")]}),grading:{reference:loadSolution(x),fixtures:loadGradingFixtures(x),orderMatters:e.orderMatters}};
 }
 for(const x of algebraExercises()){
  const e=manifest.exercises.find(e=>e.id===x.id)!,key=`algebra:${x.id}@${x.version}`;
  records[key]={item:publicItemSchema.parse({key,id:x.id,version:x.version,kind:"algebra",moduleId:e.moduleId,title:x.id,prompt:x.originalPrompt,difficulty:e.difficulty,status:"needs-review",sourceRefs:x.sourceRefs,concepts:[],lessonIds:manifest.lessons.filter(l=>l.moduleId===e.moduleId).map(l=>l.id),grading:x.gradingMode==="automatic"?"fixtures":"manual",context:[x.interpretation,...x.limitations,Object.entries(loadAlgebraFixture(x.datasetId).relations).map(([name,r])=>`${name}(${r.columns.map(c=>`${c.name}: ${c.type}`).join(", ")})`).join("; ")]}),grading:x.gradingMode==="automatic"?algebraGrading(x):{reference:algebraSolution(x)}};
 }
 for(const x of erExercises()){
  const e=manifest.exercises.find(e=>e.id===x.id&&e.type==="er-guided")!,key=`er:${x.id}@${x.version}`;
  records[key]={item:publicItemSchema.parse({key,id:x.id,version:x.version,kind:"er",moduleId:e.moduleId,title:x.title,prompt:x.prompt,difficulty:e.difficulty,status:"needs-review",sourceRefs:x.sourceRefs,concepts:[],lessonIds:manifest.lessons.filter(l=>l.moduleId===e.moduleId).map(l=>l.id),grading:"manual",context:[x.origin==="platform-activity"?"Attività originale Database Academy":"Domanda delle slide, adattamento Database Academy",...x.limitations],initial:x.initial}),grading:{checks:x.checks,reference:erReference(x).text}};
 }
 const body={schemaVersion:1,manifestVersion:manifest.version,records};const archiveId=createHash("sha256").update(JSON.stringify(body)).digest("hex");return{...body,archiveId};
}
export type ExamArchive=ReturnType<typeof buildArchive>;
const gradingSchema=z.union([
 z.object({question:questionSchema,lessonId:z.string(),lessonVersion:z.number().int().positive(),quizVersion:z.number().int().positive()}).strict(),
 z.object({reference:z.string(),fixtures:z.array(z.object({id:z.string(),schemaSql:z.string(),seedSql:z.string(),tables:z.array(z.string())}).strict()).min(2),orderMatters:z.boolean()}).strict(),
 z.object({reference:z.string(),fixtures:z.array(fixtureSchema).min(2)}).strict(),
 z.object({reference:z.string(),checks:z.array(z.object({kind:z.enum(["entity","attribute","participation"]),entity:z.string(),name:z.string(),min:z.number().optional(),max:z.union([z.number(),z.literal("N")]).optional()}).strict()).optional()}).strict(),
]);
const archiveSchema=z.object({schemaVersion:z.literal(1),manifestVersion:z.number().int().positive(),records:z.record(z.string(),z.object({item:publicItemSchema,grading:gradingSchema}).strict()),archiveId:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
export function readArchive(id:string):ExamArchive{
 if(!/^[a-f0-9]{64}$/.test(id))throw new Error("Archivio sconosciuto");
 const archive=JSON.parse(readFileSync(join(process.cwd(),"content/exam/archives",`${id}.json`),"utf8")) as ExamArchive;
 const{archiveId,...body}=archive;if(archiveId!==id||createHash("sha256").update(JSON.stringify(body)).digest("hex")!==id)throw new Error("Archivio alterato");archiveSchema.parse(archive);return archive;
}
export function currentCatalog(){const pointer=JSON.parse(readFileSync(join(process.cwd(),"content/exam/current.json"),"utf8")) as {archiveId:string};const archive=readArchive(pointer.archiveId);return{archiveId:archive.archiveId,items:Object.values(archive.records).map(r=>r.item)};}
export type ArchivedQuiz={question:Question;lessonId:string;lessonVersion:number;quizVersion:number};

import {z} from "zod";
import {sourceRefSchema,stableId} from "@/lib/content/schemas";
import {diagramSchema} from "@/lib/er/model";

export const difficultySchema=z.enum(["base","intermedio","avanzato","non-classificato"]);
export const kindSchema=z.enum(["quiz","sql","algebra","er"]);
export const publicItemSchema=z.object({
 key:z.string().max(160),id:stableId,version:z.number().int().positive(),kind:kindSchema,moduleId:stableId,
 title:z.string(),prompt:z.string(),difficulty:difficultySchema,status:z.literal("needs-review"),
 sourceRefs:z.array(sourceRefSchema).min(1),concepts:z.array(z.string()),lessonIds:z.array(stableId),
 grading:z.enum(["quiz","fixtures","manual"]),context:z.array(z.string()),
 questionType:z.enum(["single","multiple","true-false"]).optional(),
 options:z.array(z.object({id:stableId,text:z.string()}).strict()).optional(),initial:diagramSchema.optional(),
}).strict();
export type ExamItem=z.infer<typeof publicItemSchema>;
export const configSchema=z.object({seed:z.string().min(1).max(100),mode:z.enum(["training","simulation"]),modules:z.array(stableId).min(1),kinds:z.array(kindSchema).min(1),count:z.number().int().min(1).max(30),durationMinutes:z.number().int().min(0).max(240),quotas:z.object({base:z.number().int().nonnegative(),intermedio:z.number().int().nonnegative(),avanzato:z.number().int().nonnegative(),"non-classificato":z.number().int().nonnegative()}).strict()}).strict().refine(c=>Object.values(c.quotas).reduce((a,b)=>a+b,0)===c.count,"La somma delle difficoltà deve coincidere con il numero di esercizi.");
export const examPlanSchema=z.object({id:stableId,createdAt:z.iso.datetime(),archiveId:z.string().regex(/^[a-f0-9]{64}$/),generatorVersion:z.literal(1),config:configSchema,items:z.array(publicItemSchema).min(1).max(30)}).strict().superRefine((p,ctx)=>{if(p.items.length!==p.config.count||new Set(p.items.map(i=>i.key)).size!==p.items.length)ctx.addIssue({code:"custom",message:"Piano con conteggio errato o attività duplicate"});});
export type ExamPlan=z.infer<typeof examPlanSchema>;
export const answerSchema=z.object({text:z.string().max(20000),selectedOptionIds:z.array(stableId).max(8),diagram:diagramSchema.optional(),manualCompleted:z.boolean()}).strict();
export type ExamAnswer=z.infer<typeof answerSchema>;
export const resultSchema=z.object({outcome:z.enum(["correct","incorrect","fixture-match","fixture-mismatch","manual","inconclusive","unanswered"]),detail:z.string().max(20000),evaluatedAt:z.iso.datetime(),reference:z.string().max(30000).optional()}).strict();
export type ExamResult=z.infer<typeof resultSchema>;
export const examRunSchema=z.object({id:stableId,sessionId:stableId,planId:stableId,revision:z.number().int().positive(),startedAt:z.iso.datetime(),updatedAt:z.iso.datetime(),deadlineAt:z.iso.datetime().optional(),finishedAt:z.iso.datetime().optional(),finishReason:z.enum(["manual","timer"]).optional(),cursor:z.number().int().min(0).max(29),answers:z.record(z.string().max(160),answerSchema),results:z.record(z.string().max(160),resultSchema)}).strict();
export type ExamRun=z.infer<typeof examRunSchema>;
export function remainingMs(run:ExamRun,now=Date.now()){return run.deadlineAt?Math.max(0,Date.parse(run.deadlineAt)-(run.finishedAt?Date.parse(run.finishedAt):now)):null;}
export function latestRuns(rows:ExamRun[]){const map=new Map<string,ExamRun>();for(const r of rows)if((map.get(r.sessionId)?.revision??0)<r.revision)map.set(r.sessionId,r);return [...map.values()];}
export const blankAnswer=():ExamAnswer=>({text:"",selectedOptionIds:[],manualCompleted:false});

export const dateSchema=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>{const d=new Date(s+"T00:00:00Z");return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===s;},"Data non valida");
export const studyConfigSchema=z.object({targetDate:dateSchema,weekdays:z.array(z.number().int().min(0).max(6)).min(1).refine(a=>new Set(a).size===a.length),dailyMinutes:z.number().int().min(15).max(240),priorityModules:z.array(stableId)}).strict();
export const studyTaskSchema=z.object({id:stableId,day:dateSchema,contentId:stableId,kind:z.enum(["lesson","exercise"]),minutes:z.number().int().min(1).max(240),done:z.boolean(),note:z.string().max(500)}).strict();
export const studyPlanSchema=z.object({id:stableId,planId:stableId,revision:z.number().int().positive(),createdAt:z.iso.datetime(),updatedAt:z.iso.datetime(),config:studyConfigSchema,tasks:z.array(studyTaskSchema).max(1000),backlog:z.array(z.object({contentId:stableId,kind:z.enum(["lesson","exercise"]),remainingMinutes:z.number().int().min(1).max(30)}).strict()).max(5000)}).strict();
export type StudyPlan=z.infer<typeof studyPlanSchema>;

import {configSchema,examPlanSchema,type ExamItem,type ExamPlan} from "./schema";

// FNV-1a + xorshift32: fixed integer operations, independent of engine locale.
export function seededRandom(seed:string){let s=2166136261;for(let i=0;i<seed.length;i++){s^=seed.charCodeAt(i);s=Math.imul(s,16777619);}s>>>=0;if(!s)s=1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;};}
export function generateExam(items:ExamItem[],archiveId:string,input:unknown,id=crypto.randomUUID(),now=new Date().toISOString()):ExamPlan{
 const config=configSchema.parse(input),random=seededRandom(config.seed),selected:ExamItem[]=[];
 if(new Set(items.map(i=>i.key)).size!==items.length)throw new Error("Catalogo con attività duplicate.");
 const pool=items.filter(i=>config.modules.includes(i.moduleId)&&config.kinds.includes(i.kind));
 const shuffle=<T,>(a:T[])=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 for(const level of ["base","intermedio","avanzato","non-classificato"] as const){const candidates=pool.filter(i=>i.difficulty===level).sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0),count=config.quotas[level];if(count>candidates.length)throw new Error(`Attività insufficienti per ${level}: richieste ${count}, disponibili ${candidates.length}. Riduci il numero o amplia gli argomenti; nessuna domanda inventata.`);selected.push(...shuffle(candidates).slice(0,count));}
 return examPlanSchema.parse({id,createdAt:now,archiveId,generatorVersion:1,config,items:shuffle(selected)});
}

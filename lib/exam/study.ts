import {studyConfigSchema,studyPlanSchema,type StudyPlan} from "./schema";
export function makeStudyPlan(input:unknown,lessons:{id:string;moduleId:string;kind?:"lesson"|"exercise"}[],startDate:string,id=crypto.randomUUID()):StudyPlan{
 const config=studyConfigSchema.parse(input),start=new Date(startDate+"T00:00:00Z"),end=new Date(config.targetDate+"T00:00:00Z");
 const days=Math.round((end.getTime()-start.getTime())/86400000);if(!Number.isFinite(days)||days<0||days>366)throw new Error("Scegli una data obiettivo tra oggi e i prossimi 366 giorni; non è una data d’esame ufficiale.");
 const slots:{day:string;remaining:number}[]=[];for(let i=0;i<=days;i++){const d=new Date(start.getTime()+i*86400000);if(config.weekdays.includes(d.getUTCDay()))slots.push({day:d.toISOString().slice(0,10),remaining:config.dailyMinutes});}
 if(!slots.length)throw new Error("Nessun giorno disponibile entro la data obiettivo.");
 const ordered=[...lessons].sort((a,b)=>Number(config.priorityModules.includes(b.moduleId))-Number(config.priorityModules.includes(a.moduleId)));
 const tasks:StudyPlan["tasks"]=[],backlog:StudyPlan["backlog"]=[];let slot=0;
 for(const l of ordered){let minutes=30;while(minutes&&slot<slots.length){const s=slots[slot],amount=Math.min(minutes,s.remaining);tasks.push({id:crypto.randomUUID(),day:s.day,contentId:l.id,kind:l.kind??"lesson",minutes:amount,done:false,note:"Stima Database Academy: 30 minuti per unità, da adattare."});minutes-=amount;s.remaining-=amount;if(!s.remaining)slot++;}if(minutes)backlog.push({contentId:l.id,kind:l.kind??"lesson",remainingMinutes:minutes});}
 const now=new Date().toISOString();return studyPlanSchema.parse({id:`${id}-v1`,planId:id,revision:1,createdAt:now,updatedAt:now,config,tasks,backlog});
}

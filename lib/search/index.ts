import {manifest} from "@/lib/content";
import {loadLesson} from "@/lib/content/lessons";
export type SearchEntry={id:string;title:string;category:string;context:string;href:string};
export function buildSearchIndex():SearchEntry[]{const rows:SearchEntry[]=[];
 for(const m of manifest.modules)rows.push({id:`module-${m.id}`,title:m.title,category:"Argomento",context:m.description,href:"/learn"});
 for(const l of manifest.lessons.filter(l=>l.status!=="draft")){const lesson=loadLesson(l.slug)!;const text=lesson.body.replace(/```[\s\S]*?```/g," ").replace(/[#*$>|`]/g," ");rows.push({id:`lesson-${l.id}`,title:l.title,category:"Lezione",context:`${l.description} ${l.concepts.join(" ")} ${text}`,href:`/learn/${l.slug}`});for(const h of lesson.toc){const start=text.toLowerCase().indexOf(h.title.toLowerCase());rows.push({id:`definition-${l.id}-${h.id}`,title:`${h.title} · ${l.title}`,category:"Definizione / sezione",context:start>=0?text.slice(start,start+1200):l.description,href:`/learn/${l.slug}#${h.id}`});}}
 for(const e of manifest.exercises)rows.push({id:`exercise-${e.id}`,title:`${e.id} · ${e.prompt.slice(0,80)}`,category:e.type==="sql"?"Esercizio SQL":e.type==="er-guided"?"Attività ER":"Esercizio algebra",context:e.prompt,href:`/practice/${e.id}`});
 for(const s of manifest.sources.filter(s=>s.file!=="Book.pdf"))rows.push({id:`source-${s.id}`,title:s.file,category:"Fonte",context:s.notes,href:"/sources"});return rows;
}

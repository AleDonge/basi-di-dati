import {emptyDiagram,type ErDiagram} from "./model";
export type NodeKind="entity"|"attribute"|"relationship"|"isa";
export function addNode(input:ErDiagram,kind:NodeKind,id:string,ownerId?:string):ErDiagram{const d=structuredClone(input),s=d.semantic;const index=s.entities.length+s.relationships.length+s.attributes.length+s.generalizations.length;
 if(kind==="entity")s.entities.push({id,name:`Entità ${s.entities.length+1}`,weak:false});
 if(kind==="relationship")s.relationships.push({id,name:`Associazione ${s.relationships.length+1}`,identifying:false});
 if(kind==="attribute"){if(!ownerId||![...s.entities,...s.relationships].some(e=>e.id===ownerId))throw new Error("Seleziona un’entità o associazione proprietaria prima di creare l’attributo.");s.attributes.push({id,name:`Attributo ${s.attributes.length+1}`,ownerId,domain:"testo"});}
 if(kind==="isa"){if(!ownerId||!s.entities.some(e=>e.id===ownerId))throw new Error("Seleziona la superclasse prima di creare ISA.");s.generalizations.push({id,name:"ISA",parentId:ownerId,childIds:[],disjoint:true,complete:false});}
 d.layout.positions[id]={x:80+(index%4)*210,y:80+Math.floor(index/4)*140};return d;
}
export function deleteElement(input:ErDiagram,id:string):ErDiagram{const d=structuredClone(input),s=d.semantic;const removed=new Set([id,...s.attributes.filter(a=>a.ownerId===id).map(a=>a.id)]);s.entities=s.entities.filter(e=>e.id!==id);s.relationships=s.relationships.filter(r=>r.id!==id);s.attributes=s.attributes.filter(a=>!removed.has(a.id));s.identifiers=s.identifiers.filter(k=>k.id!==id&&!removed.has(k.entityId)).map(k=>({...k,attributeIds:k.attributeIds.filter(a=>!removed.has(a))}));s.participations=s.participations.filter(p=>p.id!==id&&p.entityId!==id&&p.relationshipId!==id);s.generalizations=s.generalizations.filter(g=>g.id!==id&&g.parentId!==id).map(g=>({...g,childIds:g.childIds.filter(c=>c!==id)}));for(const key of Object.keys(d.layout.positions))if(removed.has(key)||!([...s.entities,...s.attributes,...s.relationships,...s.generalizations].some(n=>n.id===key)))delete d.layout.positions[key];return d;}
export interface ErHistory{past:ErDiagram[];present:ErDiagram;future:ErDiagram[]}
export function startHistory(d=emptyDiagram()):ErHistory{return{past:[],present:d,future:[]};}
export function commit(h:ErHistory,d:ErDiagram):ErHistory{if(JSON.stringify(h.present)===JSON.stringify(d))return h;return{past:[...h.past,h.present].slice(-40),present:d,future:[]};}
export function undo(h:ErHistory):ErHistory{return h.past.length?{past:h.past.slice(0,-1),present:h.past.at(-1)!,future:[h.present,...h.future].slice(0,40)}:h;}
export function redo(h:ErHistory):ErHistory{return h.future.length?{past:[...h.past,h.present].slice(-40),present:h.future[0],future:h.future.slice(1)}:h;}

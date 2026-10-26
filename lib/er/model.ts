import {z} from "zod";
const id=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),name=z.string().max(80);
export const entitySchema=z.object({id,name,weak:z.boolean()}).strict();
export const attributeSchema=z.object({id,name,ownerId:id,domain:z.string().max(120)}).strict();
export const identifierSchema=z.object({id,entityId:id,attributeIds:z.array(id).max(20),kind:z.enum(["primary","candidate","partial"])}).strict();
export const relationshipSchema=z.object({id,name,identifying:z.boolean()}).strict();
export const participationSchema=z.object({id,entityId:id,relationshipId:id,role:name,min:z.number().int().min(-999).max(999),max:z.union([z.number().int().min(-999).max(999),z.literal("N")])}).strict();
export const generalizationSchema=z.object({id,name,parentId:id,childIds:z.array(id).max(20),disjoint:z.boolean(),complete:z.boolean()}).strict();
export const semanticSchema=z.object({entities:z.array(entitySchema).max(60),attributes:z.array(attributeSchema).max(150),identifiers:z.array(identifierSchema).max(100),relationships:z.array(relationshipSchema).max(60),participations:z.array(participationSchema).max(180),generalizations:z.array(generalizationSchema).max(30),notes:z.string().max(10000)}).strict();
export const positionSchema=z.object({x:z.number().finite().min(-5000).max(5000),y:z.number().finite().min(-5000).max(5000)}).strict();
export const diagramSchema=z.object({schemaVersion:z.literal(1),metadata:z.object({id,title:z.string().max(120),revision:z.number().int().nonnegative(),createdAt:z.iso.datetime(),modifiedAt:z.iso.datetime(),notation:z.literal("unitn-er-v1"),status:z.literal("needs-review")}).strict(),semantic:semanticSchema,layout:z.object({positions:z.record(id,positionSchema),viewport:z.object({x:z.number().finite().min(-10000).max(10000),y:z.number().finite().min(-10000).max(10000),zoom:z.number().min(0.2).max(3)}).strict()}).strict()}).strict().superRefine((d,ctx)=>{const ids=[...d.semantic.entities,...d.semantic.attributes,...d.semantic.identifiers,...d.semantic.relationships,...d.semantic.participations,...d.semantic.generalizations].map(x=>x.id);if(new Set(ids).size!==ids.length)ctx.addIssue({code:"custom",message:"Identificativi duplicati nel diagramma"});});
export type ErDiagram=z.infer<typeof diagramSchema>;
export type ErSemantic=z.infer<typeof semanticSchema>;
export type ErParticipation=z.infer<typeof participationSchema>;
export const issueSchema=z.object({level:z.enum(["error","warning","suggestion","manual"]),code:z.string(),message:z.string(),elementId:z.string().optional()}).strict();
export type ErIssue=z.infer<typeof issueSchema>;
export const erRecordSchema=z.object({id:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),diagram:diagramSchema,savedAt:z.iso.datetime(),exerciseId:id.optional(),exerciseVersion:z.number().int().positive().optional(),validation:z.object({validatedAt:z.iso.datetime(),issues:z.array(issueSchema).max(1000)}).strict().optional(),manuallyCompletedAt:z.iso.datetime().optional()}).strict();
export type ErRecord=z.infer<typeof erRecordSchema>;
export function emptyDiagram(diagramId=crypto.randomUUID()):ErDiagram{const now=new Date().toISOString();return{schemaVersion:1,metadata:{id:diagramId,title:"Nuovo diagramma ER",revision:0,createdAt:now,modifiedAt:now,notation:"unitn-er-v1",status:"needs-review"},semantic:{entities:[],attributes:[],identifiers:[],relationships:[],participations:[],generalizations:[],notes:""},layout:{positions:{},viewport:{x:0,y:0,zoom:1}}};}
export function parseDiagram(text:string):ErDiagram {if(new TextEncoder().encode(text).length>1024*1024)throw new Error("Diagramma oltre il limite di 1 MB.");try{const raw:unknown=JSON.parse(text);return migrateDiagram(raw);}catch{throw new Error("Diagramma non valido: controlla JSON, versione, tipi, limiti e ID univoci. Il lavoro corrente è conservato.");}}
export function migrateDiagram(input:unknown):ErDiagram{return diagramSchema.parse(input);} // v1 only: unknown future versions fail closed.
export function copyDiagram(input:ErDiagram):ErDiagram {const d=structuredClone(input),now=new Date().toISOString();d.metadata={...d.metadata,id:crypto.randomUUID(),title:`${d.metadata.title.slice(0,105)} · copia`,revision:0,createdAt:now,modifiedAt:now};return d;}
export function elementName(d:ErDiagram,id:string){const s=d.semantic;return [...s.entities,...s.attributes,...s.relationships,...s.generalizations].find(x=>x.id===id)?.name??id;}

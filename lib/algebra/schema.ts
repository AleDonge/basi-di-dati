import {z} from "zod";
const name=z.string().regex(/^[A-Za-z][A-Za-z0-9_]*$/);
export const relationSchema=z.object({columns:z.array(z.object({name,type:z.enum(["number","string","date"]),qualifier:name.optional()}).strict()).max(32),rows:z.array(z.array(z.union([z.string().max(2000),z.number().finite()])).max(32)).max(2000)}).strict().superRefine((r,ctx)=>{
  if(new Set(r.columns.map(c=>`${c.qualifier??""}.${c.name}`)).size!==r.columns.length)ctx.addIssue({code:"custom",message:"Attributi duplicati"});
  for(const row of r.rows)if(row.length!==r.columns.length||row.some((v,i)=>r.columns[i]?.type==="number"?typeof v!=="number":typeof v!=="string"||(r.columns[i]?.type==="date"&&!/^\d{4}-\d{2}-\d{2}$/.test(v))))ctx.addIssue({code:"custom",message:"Tupla incompatibile con lo schema (NULL non ammesso nell’algebra classica)"});
});
export const fixtureSchema=z.object({id:z.string().max(80),title:z.string().max(200),provenance:z.string().max(2000),relations:z.record(name,relationSchema).refine(r=>Object.keys(r).length<=16)}).strict();

import {loadErExercise,erReference} from "@/lib/er/content";
export async function GET(_r:Request,{params}:{params:Promise<{id:string}>}){try{const{id}=await params;return Response.json(erReference(loadErExercise(id)),{headers:{"Cache-Control":"no-store"}});}catch{return Response.json({error:"Riferimento non disponibile"},{status:404});}}

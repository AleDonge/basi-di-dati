import {loadAlgebraFixture} from "@/lib/algebra/content";
export async function GET(_r:Request,{params}:{params:Promise<{id:string}>}){const{id}=await params;try{if(!["sailors","impiegati-demo"].includes(id))throw new Error();return Response.json(loadAlgebraFixture(id),{headers:{"Cache-Control":"no-store"}});}catch{return Response.json({error:"Dataset non disponibile"},{status:404});}}

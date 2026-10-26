import {NextResponse} from "next/server";
import {z} from "zod";
import {prepareEvaluation} from "@/lib/exam/evaluation";
import {examPlanSchema,examRunSchema} from "@/lib/exam/schema";
const requestSchema=z.object({plan:examPlanSchema,run:examRunSchema,key:z.string().max(160).optional()}).strict();
export async function POST(request:Request){try{const text=await request.text();if(new TextEncoder().encode(text).length>2*1024*1024)throw new Error("Richiesta oltre 2 MB.");const input=requestSchema.parse(JSON.parse(text));return NextResponse.json(prepareEvaluation(input.plan,input.run,input.key),{headers:{"Cache-Control":"no-store"}});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Valutazione non disponibile"},{status:400,headers:{"Cache-Control":"no-store"}});}}

import {z} from "zod";
import {fixtureSchema} from "./schema";
import {evaluateAlgebra} from "./evaluator";
import {gradeAlgebra} from "@/lib/grading/algebra";
import {AlgebraError} from "./types";
const request=z.discriminatedUnion("type",[
  z.object({type:z.literal("execute"),expression:z.string().max(10000),fixture:fixtureSchema}).strict(),
  z.object({type:z.literal("grade"),expression:z.string().max(10000),reference:z.string().max(10000),fixtures:z.array(fixtureSchema).min(2).max(8)}).strict(),
]);
const scope=globalThis as unknown as {onmessage:(event:MessageEvent)=>void;postMessage:(value:unknown)=>void};
scope.onmessage=event=>{try{const input=request.parse(event.data);const value=input.type==="execute"?evaluateAlgebra(input.expression,input.fixture):gradeAlgebra(input.expression,input.reference,input.fixtures);scope.postMessage({ok:true,value});}catch(error){scope.postMessage({ok:false,error:{kind:error instanceof AlgebraError?error.kind:"semantic",message:error instanceof Error?error.message:"Errore del laboratorio"}});}};

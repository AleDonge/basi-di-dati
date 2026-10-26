import {gradeQuiz} from "@/lib/grading/quiz";
import {validateEr,validationMessage} from "@/lib/er/validation";
import {checkErProperties} from "@/lib/grading/er";
import type {ErExercise} from "@/lib/er/content";
import type {SqlFixture} from "@/lib/sql/types";
import type {AlgebraFixture} from "@/lib/algebra/types";
import {readArchive,type ArchivedQuiz} from "./catalog";
import {examPlanSchema,examRunSchema,type ExamPlan,type ExamRun,type ExamResult} from "./schema";
export type EvaluationJob={key:string;result?:ExamResult;reference?:string;sql?:{fixtures:SqlFixture[];orderMatters:boolean};algebra?:{fixtures:AlgebraFixture[]}};
export function prepareEvaluation(planInput:unknown,runInput:unknown,onlyKey?:string):EvaluationJob[]{
 const plan=examPlanSchema.parse(planInput),run=examRunSchema.parse(runInput);
 if(plan.id!==run.planId)throw new Error("Sessione e piano non corrispondono.");
 if(plan.config.mode==="simulation"&&!run.finishedAt)throw new Error("In simulazione la valutazione è disponibile soltanto dopo la conclusione.");
 if(onlyKey&&!plan.items.some(i=>i.key===onlyKey))throw new Error("Attività sconosciuta.");
 const archive=readArchive(plan.archiveId),now=new Date().toISOString();
 return plan.items.filter(i=>!onlyKey||i.key===onlyKey).map(item=>{
  const record=archive.records[item.key];if(!record||JSON.stringify(record.item)!==JSON.stringify(item))throw new Error("La copia dell’attività non corrisponde all’archivio locale. Nessuna valutazione sostitutiva.");
  const answer=run.answers[item.key];const result=(outcome:ExamResult["outcome"],detail:string,reference?:string):EvaluationJob=>({key:item.key,result:{outcome,detail,evaluatedAt:now,...(reference?{reference}:{})}});
  if(item.kind==="quiz"){
   if(!answer?.selectedOptionIds.length)return result("unanswered","Nessuna risposta inviata.");
   const g=record.grading as ArchivedQuiz;
   try{const graded=gradeQuiz(g.question,answer.selectedOptionIds);return result(graded.correct?"correct":"incorrect",graded.explanation,`Risposta attesa: ${g.question.options.filter(o=>graded.correctOptionIds.includes(o.id)).map(o=>o.text).join("; ")}`);}catch{return result("inconclusive","Selezione non valida per questa domanda; nessun punteggio assegnato.");}
  }
  if(item.grading==="manual"){
   const g=record.grading as {reference:string;checks?:ErExercise["checks"]};
   if(item.kind==="algebra"&&!answer?.text.trim()&&!answer?.manualCompleted)return result("unanswered","Nessuna riflessione inviata.",g.reference);
   const detail=item.kind==="er"&&answer?.diagram?[validationMessage(validateEr(answer.diagram)),...validateEr(answer.diagram).map(i=>`${i.level}: ${i.message}`),...checkErProperties(answer.diagram,g.checks??[]).map(i=>i.message)].join("\n"):"Attività guidata: la riflessione richiede revisione manuale.";
   return result(answer?.manualCompleted?"manual":"inconclusive",`${detail}\nIl completamento manuale non certifica correttezza semantica.`,g.reference);
  }
  if(!answer?.text.trim())return result("unanswered","Nessuna espressione o query inviata.");
  if(item.kind==="sql"){const g=record.grading as {reference:string;fixtures:SqlFixture[];orderMatters:boolean};return{key:item.key,reference:g.reference,sql:{fixtures:g.fixtures,orderMatters:g.orderMatters}};}
  const g=record.grading as {reference:string;fixtures:AlgebraFixture[]};return{key:item.key,reference:g.reference,algebra:{fixtures:g.fixtures}};
 });
}
export function assertRunPlan(plan:ExamPlan,run:ExamRun){return run.planId===plan.id&&Object.keys(run.answers).every(k=>plan.items.some(i=>i.key===k));}

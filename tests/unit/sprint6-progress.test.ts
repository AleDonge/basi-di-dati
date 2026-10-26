import "fake-indexeddb/auto";
import {describe,it,expect} from "vitest";
import {deleteDB} from "idb";
import {readFileSync} from "node:fs";
import {manifest} from "@/lib/content";
import {currentCatalog,readArchive} from "@/lib/exam/catalog";
import {generateExam} from "@/lib/exam/generator";
import {prepareEvaluation} from "@/lib/exam/evaluation";
import {blankAnswer,examRunSchema} from "@/lib/exam/schema";
import {emptyProgress,parseBackup} from "@/lib/progress/schemas";
import {importProgress,readProgress,saveExerciseAttempt,updateLessonProgress} from "@/lib/progress/db";

describe("Aggiornamento contenuti senza migrazione distruttiva",()=>{
 it("simulazione v5 conclusa resta identica, usa il quiz v1 e sopravvive al backup con i nuovi progressi",async()=>{
  const name="sprint6-archived-backup",now="2026-10-25T10:00:00.000Z";await deleteDB(name);
  const old=readArchive("dc2ba066827b6e4551b01dcb7b70cff1d16dfd84dc59d8cc7b9e7b3a053b5909");
  const record=old.records["quiz:ar-selezione-q1@1"],item=record.item;
  const plan=generateExam([item],old.archiveId,{seed:"preserved",mode:"simulation",modules:[item.moduleId],kinds:["quiz"],count:1,durationMinutes:0,quotas:{base:0,intermedio:0,avanzato:0,"non-classificato":1}},"old-content-plan",now);
  const question=(record.grading as {question:{correctOptionIds:string[]}}).question;
  const run=examRunSchema.parse({id:"old-run-v1",sessionId:"old-run",planId:plan.id,revision:1,startedAt:now,updatedAt:now,finishedAt:now,finishReason:"manual",cursor:0,answers:{[item.key]:{...blankAnswer(),selectedOptionIds:question.correctOptionIds}},results:{}});
  const before=prepareEvaluation(plan,run)[0];expect(before.result?.outcome).toBe("correct");
  run.results[item.key]=before.result!;
  const data={...emptyProgress(),examPlans:[plan],examRuns:[run],lessons:[{lessonId:"ar-selezione",lessonVersion:1,lastVisitedAt:now,completedAt:now}]};
  await importProgress(data,name);
  await updateLessonProgress("sql-select",1,true,name);
  await saveExerciseAttempt({id:"new-northwind",exerciseId:"academy-northwind-02",exerciseVersion:1,answer:"SELECT ...",result:"passed",verificationStatus:"passed",feedback:"Coerente sulle fixture",attemptedAt:now},name);
  expect(currentCatalog().items.some(x=>x.key==="quiz:ar-selezione-q1@2")).toBe(true);
  const backup=parseBackup(JSON.stringify(await readProgress(name)));await deleteDB(name);await importProgress(backup,name);
  const restored=await readProgress(name);
  expect(restored.examPlans).toEqual([plan]);expect(restored.examRuns).toEqual([run]);
  expect(restored.lessons.find(l=>l.lessonId==="ar-selezione")?.lessonVersion).toBe(1);
  expect(restored.lessons.find(l=>l.lessonId==="sql-select")?.completedAt).toBeTruthy();
  expect(restored.attempts[0].exerciseId).toBe("academy-northwind-02");
  expect(prepareEvaluation(restored.examPlans[0],restored.examRuns[0])[0].result).toMatchObject({outcome:before.result!.outcome,detail:before.result!.detail,reference:before.result!.reference});
  await deleteDB(name);
 });
 it("matrice riproduce ogni lezione, fonte, quiz e ID attività senza dichiarare verified",()=>{
  const coverage=JSON.parse(readFileSync("docs/CONTENT_COVERAGE.json","utf8")) as {manifestVersion:number;lessons:{lessonId:string;version:number;sourceRefs:unknown[];questionIds:string[];status:string;exercises:{id:string}[]}[];gaps:string[]};
  expect(coverage.manifestVersion).toBe(manifest.version);expect(coverage.lessons).toHaveLength(42);
  for(const row of coverage.lessons){const l=manifest.lessons.find(x=>x.id===row.lessonId)!;expect(row.version).toBe(l.version);expect(row.sourceRefs).toEqual(l.sourceRefs);expect(row.questionIds).toHaveLength(3);expect(row.status).toBe("needs-review");for(const e of row.exercises)expect(manifest.exercises.some(x=>x.id===e.id)).toBe(true);}
  expect(coverage.gaps.join(" ")).toContain("Book.pdf");expect(coverage.gaps.join(" ")).toContain("ANY/ALL");
 });
 it("catalogo Exam Prep include entrambi i dataset, tutti i nuovi quiz e riferimenti di ripasso",()=>{
  const catalog=currentCatalog(),archive=readArchive(catalog.archiveId);
  expect(catalog.items.filter(i=>i.kind==="sql")).toHaveLength(23);
  for(const item of catalog.items.filter(i=>i.id.startsWith("academy-"))){expect(item.lessonIds.length).toBeGreaterThan(0);const g=archive.records[item.key].grading as {orderMatters:boolean};expect(g.orderMatters).toBe(manifest.exercises.find(e=>e.id===item.id)!.orderMatters);if(item.id.includes("northwind"))expect(item.context.join(" ")).toContain("ProductID");}
 });
});

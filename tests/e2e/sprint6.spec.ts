import {test,expect,type Page} from "@playwright/test";
import {readFile} from "node:fs/promises";
import cases from "../fixtures/sprint6-sql-cases.json";
import {readArchive} from "../../lib/exam/catalog";
import {generateExam} from "../../lib/exam/generator";
import {emptyProgress} from "../../lib/progress/schemas";
import {blankAnswer} from "../../lib/exam/schema";
function monitor(page:Page){const external:string[]=[],errors:string[]=[];page.on("request",r=>{if(new URL(r.url()).origin!=="http://127.0.0.1:3000")external.push(r.url());});page.on("pageerror",e=>errors.push(e.message));return{external,errors};}
async function edit(page:Page,text:string){await page.getByRole("main").getByRole("textbox",{name:"Query SQL",exact:true}).fill(text);await page.getByRole("button",{name:"Verifica su 4 fixture",exact:true}).click();}
test("nuovi esercizi, entrambi i dataset, ordine, errori, tentativi e backup",async({page},info)=>{
 test.setTimeout(180000);const watched=monitor(page);
 for(const c of cases){
  await page.goto(`/practice/${c.id}`);
  await expect(page.getByRole("main").getByText("ESERCIZIO ORIGINALE DATABASE ACADEMY · NEEDS-REVIEW",{exact:true})).toBeVisible();
  await expect(page.getByRole("combobox",{name:"Database SQL"})).toHaveValue(c.id.includes("northwind")?"northwind":"sailors");
  await expect(page.getByRole("button",{name:"Mostra soluzione di riferimento",exact:true})).toBeVisible();
  await expect(page.getByRole("main").locator(".reference-solution")).toHaveCount(0);
  await page.getByRole("main").getByLabel("Editor testuale accessibile",{exact:true}).check();
  await expect(page.getByRole("textbox",{name:"Query SQL",exact:true})).toBeEnabled({timeout:20000});
  await edit(page,c.alternative);await expect(page.getByRole("main").locator(".sql-grade h2")).toHaveText("Coerente sulle fixture",{timeout:20000});
  if(c.id==="academy-northwind-02"){
   await edit(page,c.wrong);await expect(page.getByRole("main").locator(".sql-grade h2")).toHaveText("Da rivedere");
   await page.reload();await expect(page.getByRole("main").locator(".exercise-support .sql-history li")).toHaveCount(2);
   await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/screenshots/sprint6-northwind-${info.project.name}.png`,fullPage:false});
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.goto("/settings");const event=page.waitForEvent("download");await page.getByRole("button",{name:"Esporta progressi JSON"}).click();const backup=JSON.parse(await readFile((await(await event).path())!,"utf8"));expect(backup.schemaVersion).toBe(5);expect(backup.attempts).toHaveLength(19);expect(new Set(backup.attempts.map((a:{exerciseId:string})=>a.exerciseId)).size).toBe(18);
 await page.evaluate(()=>new Promise<void>((resolve,reject)=>{const r=indexedDB.deleteDatabase("database-academy-progress");r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);}));await page.reload();await page.getByRole("main").getByLabel("Importa backup JSON").setInputFiles({name:"sprint6.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(backup))});await page.getByRole("main").getByLabel(/Ho controllato l’anteprima/).check();await page.getByRole("button",{name:"Conferma importazione",exact:true}).click();await expect(page.getByRole("main").locator(".backup-panel [role=status]")).toContainText("Importazione completata");await page.goto("/practice/academy-northwind-02");await expect(page.getByRole("main").locator(".exercise-support .sql-history li")).toHaveCount(2);expect(watched.external).toEqual([]);expect(watched.errors).toEqual([]);
});
test("nuova lezione e quiz, fonti SQL, simulazione precedente conservata nel ripristino",async({page,request},info)=>{
 const watched=monitor(page);
 await page.goto("/learn/sql-filtri");await expect(page.getByRole("heading",{level:1})).toHaveText("Predicati, NULL, intervalli e pattern");const q=page.getByRole("main").locator(".quiz-card").first();await q.getByLabel("age IS NULL",{exact:true}).check();await q.getByRole("button",{name:"Verifica risposta",exact:true}).click();await expect(q.locator(".quiz-feedback")).toContainText("Risposta corretta");await page.getByRole("button",{name:"Segna come completata",exact:true}).click();await expect(page.getByRole("button",{name:"Annulla completamento",exact:true})).toBeVisible();await page.reload();await expect(page.getByRole("button",{name:"Annulla completamento",exact:true})).toBeVisible();await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/screenshots/sprint6-lesson-${info.project.name}.png`,fullPage:false});
 for(const id of ["sql-source","tools-source"])expect((await request.get(`/sources/${id}`)).headers()["content-type"]).toContain("application/pdf");expect((await request.get("/sources/book-source")).status()).toBe(404);
 const old=readArchive("dc2ba066827b6e4551b01dcb7b70cff1d16dfd84dc59d8cc7b9e7b3a053b5909"),record=old.records["quiz:ar-selezione-q1@1"],item=record.item,now="2026-10-24T12:00:00.000Z";
 const plan=generateExam([item],old.archiveId,{seed:"old-version",mode:"simulation",modules:[item.moduleId],kinds:["quiz"],count:1,durationMinutes:0,quotas:{base:0,intermedio:0,avanzato:0,"non-classificato":1}},"sprint5-plan",now);
 const question=(record.grading as {question:{correctOptionIds:string[];explanation:string}}).question;
 const run={id:"sprint5-run-v1",sessionId:"sprint5-run",planId:plan.id,revision:1,startedAt:now,updatedAt:now,finishedAt:now,finishReason:"manual",cursor:0,answers:{[item.key]:{...blankAnswer(),selectedOptionIds:question.correctOptionIds}},results:{[item.key]:{outcome:"correct",detail:question.explanation,evaluatedAt:now}}};
 const backup={...emptyProgress(),examPlans:[plan],examRuns:[run],lessons:[{lessonId:"ar-selezione",lessonVersion:1,lastVisitedAt:now,completedAt:now}]};
 await page.goto("/settings");await page.getByRole("main").getByLabel("Importa backup JSON").setInputFiles({name:"old-simulation.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(backup))});await page.getByRole("main").getByLabel(/Ho controllato l’anteprima/).check();await page.getByRole("button",{name:"Conferma importazione",exact:true}).click();await expect(page.getByRole("main").locator(".backup-panel [role=status]")).toContainText("Importazione completata");await page.goto("/exam-prep");await expect(page.getByRole("heading",{name:"Riepilogo e revisione",exact:true})).toBeVisible();await expect(page.getByRole("main").locator(".exam-result")).toContainText(question.explanation);await page.reload();await expect(page.getByRole("main").locator(".exam-result")).toContainText(question.explanation);
 await page.goto("/settings");const event=page.waitForEvent("download");await page.getByRole("button",{name:"Esporta progressi JSON"}).click();const restored=JSON.parse(await readFile((await(await event).path())!,"utf8"));expect(restored.examPlans).toEqual([plan]);expect(restored.examRuns).toEqual([run]);expect(restored.lessons.some((l:{lessonId:string})=>l.lessonId==="sql-filtri")).toBe(true);expect(watched.external).toEqual([]);expect(watched.errors).toEqual([]);
});

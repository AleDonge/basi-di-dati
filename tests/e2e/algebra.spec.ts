import {test,expect,type Page} from "@playwright/test";
import {readFile} from "node:fs/promises";
import cases from "../fixtures/algebra-grading-cases.json";
import sqlCases from "../fixtures/sql-grading-cases.json";
function monitor(page:Page){const external:string[]=[],errors:string[]=[];page.on("request",r=>{if(new URL(r.url()).origin!=="http://127.0.0.1:3000")external.push(r.url());});page.on("pageerror",e=>errors.push(e.message));return{external,errors};}
async function open(page:Page,url="/algebra-lab"){await page.goto(url);await expect(page.getByText("Caricamento del dataset locale…",{exact:true})).toHaveCount(0);}
async function expression(page:Page,value:string){await page.getByRole("textbox",{name:"Espressione di algebra relazionale",exact:true}).fill(value);}
test("albero e relazioni intermedie calcolate, operatori, errori e reset",async({page},info)=>{
 const watched=monitor(page);await open(page);
 await page.getByRole("button",{name:"Esegui algebra",exact:true}).click();
 await expect(page.locator(".algebra-intermediate h3")).toHaveText("π Proiezione");
 await expect(page.getByRole("region",{name:"Notazione matematica dell’espressione"})).toBeVisible();
 const tree=page.getByRole("navigation",{name:"Albero delle operazioni"});
 await tree.getByRole("button",{name:/^Sailors/}).click();await expect(page.locator(".algebra-intermediate tbody tr")).toHaveCount(10);
 await tree.getByRole("button",{name:/σ Selezione/}).click();await expect(page.locator(".algebra-intermediate tbody tr")).toHaveCount(7);
 await tree.getByRole("button",{name:/π Proiezione/}).click();await expect(page.locator(".algebra-intermediate tbody tr")).toHaveCount(6);
 await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/screenshots/algebra-lab-${info.project.name}.png`,fullPage:true});
 await expression(page,"π_{age}(σ_{age>100}(Sailors))");await page.getByRole("textbox",{name:"Espressione di algebra relazionale"}).press("Control+Enter");await expect(page.locator(".algebra-intermediate")).toContainText("Relazione vuota");
 await expression(page,"σ_{nope=1}(Sailors)");await page.getByRole("button",{name:"Esegui algebra",exact:true}).click();await expect(page.locator(".sql-error")).toContainText("Errore semantico");
 await expression(page,"π_sname(Sailors");await page.getByRole("button",{name:"Esegui algebra",exact:true}).click();await expect(page.locator(".sql-error")).toContainText("Errore sintattico");
 await page.getByRole("button",{name:"Reset algebra",exact:true}).click();await expect(page.locator(".algebra-evaluation")).toHaveCount(0);
 await expression(page,"");await page.getByRole("button",{name:"Inserisci σ",exact:true}).click();await expect(page.getByRole("textbox",{name:"Espressione di algebra relazionale"})).toHaveValue("σ_{age>30}()");
 await page.getByRole("combobox",{name:"Esempi guidati"}).selectOption("self-join");await page.getByRole("button",{name:"Esegui algebra",exact:true}).click();await expect(page.locator(".algebra-intermediate h3")).toHaveText("π Proiezione");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);expect(watched.external).toEqual([]);expect(watched.errors).toEqual([]);
});
test("tutti i 18 esercizi automatici, fixture discriminanti e riferimenti su richiesta",async({page},info)=>{
 const watched=monitor(page);const referenceRequests:string[]=[];page.on("request",r=>{if(r.url().includes("/api/algebra/exercise/"))referenceRequests.push(r.url());});
 for(const c of cases){const before=referenceRequests.length;await open(page,`/practice/${c.id}`);expect(referenceRequests).toHaveLength(before);await expect(page.locator(".reference-solution")).toHaveCount(0);
  if(c.id==="ar-sailors-02"){await expression(page,c.incorrect[0]);await page.getByRole("button",{name:"Verifica algebra",exact:true}).click();await expect(page.locator(".sql-grade h2")).toHaveText("Da rivedere");await expect(page.locator(".sql-grade li").first()).toContainText("✓");}
  await expression(page,c.correct[1]);await page.getByRole("button",{name:"Verifica algebra",exact:true}).click();await expect(page.locator(".sql-grade h2")).toHaveText("Coerente sulle fixture");await expect(page.locator(".algebra-history li").first()).toContainText("coerente sulle fixture");
 }
 await page.getByRole("button",{name:"Mostra riferimento algebra"}).click();await expect(page.locator(".reference-solution")).toContainText("non soluzione ufficiale");
 await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/screenshots/algebra-exercise-${info.project.name}.png`,fullPage:true});
 await page.reload();await expect(page.locator(".algebra-history li")).toHaveCount(1);
 expect(watched.external).toEqual([]);expect(watched.errors).toEqual([]);
});
test("progressi algebra, riflessione guidata e backup con SQL e letture precedenti",async({page})=>{
 const watched=monitor(page);await page.goto("/learn/dbms-dati");await page.getByRole("button",{name:"Segna come completata",exact:true}).click();await expect(page.getByRole("button",{name:"Annulla completamento"})).toBeEnabled();
 await page.goto("/practice/sailors-01");await expect(page.getByRole("button",{name:"Reset database"})).toBeEnabled();await page.getByLabel("Editor testuale accessibile",{exact:true}).check();await page.getByRole("textbox",{name:"Query SQL",exact:true}).fill(sqlCases[0].correct[0]);await page.getByRole("button",{name:"Verifica su 5 fixture"}).click();await expect(page.locator(".sql-grade h2")).toHaveText("Coerente sulle fixture");
 await open(page,"/practice/ar-sailors-01");await expression(page,cases[0].correct[0]);await page.getByRole("button",{name:"Verifica algebra"}).click();await expect(page.locator(".sql-grade h2")).toHaveText("Coerente sulle fixture");
 await open(page,"/practice/ar-impiegati-09");await expect(page.getByRole("button",{name:"Verifica algebra"})).toHaveCount(0);await page.getByRole("textbox",{name:"Riflessione personale"}).fill("Prima devo chiarire l’unità di 60K, poi filtrare e collegare il dipartimento.");await page.getByRole("button",{name:"Salva riflessione"}).click();await expect(page.locator(".algebra-history li")).toHaveCount(1);
 await page.goto("/settings");const event=page.waitForEvent("download");await page.getByRole("button",{name:"Esporta progressi JSON"}).click();const backup=JSON.parse(await readFile((await(await event).path())!,"utf8"));expect(backup.schemaVersion).toBe(5);expect(backup.attempts).toHaveLength(3);expect(backup.attempts.find((a:{exerciseId:string})=>a.exerciseId==="ar-impiegati-09").result).toBe("guided");expect(backup.lessons[0].completedAt).toBeTruthy();
 await page.evaluate(()=>new Promise<void>((resolve,reject)=>{const r=indexedDB.deleteDatabase("database-academy-progress");r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);}));await page.reload();await expect(page.getByRole("button",{name:"Esporta progressi JSON"})).toBeEnabled();await page.getByLabel("Importa backup JSON").setInputFiles({name:"algebra.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(backup))});await page.getByLabel(/Ho controllato l’anteprima/).check();await page.getByRole("button",{name:"Conferma importazione"}).click();await expect(page.getByRole("status")).toContainText("Importazione completata");
 await open(page,"/practice/ar-sailors-01");await expect(page.locator(".algebra-history li")).toContainText("coerente sulle fixture");await page.goto("/learn/dbms-dati");await expect(page.getByRole("button",{name:"Annulla completamento"})).toBeEnabled();expect(watched.external).toEqual([]);expect(watched.errors).toEqual([]);
});
test("dataset sintetico, limiti, CSP e watchdog interrompono un worker bloccato",async({page,request})=>{
 const watched=monitor(page);await open(page);await page.getByRole("combobox",{name:"Dataset algebra"}).selectOption("impiegati-demo");await expression(page,"π_{Matricola,Cognome}(Impiegato)");await page.getByRole("button",{name:"Esegui algebra"}).click();await expect(page.locator(".algebra-intermediate tbody tr")).toHaveCount(6);await expect(page.getByText(/Tutte le righe sono inventate/)).toBeVisible();
 const h=(await request.get("/algebra/algebra-worker.js")).headers();expect(h["content-security-policy"]).toContain("connect-src 'none'");expect((await request.get("/api/algebra/dataset/impiegati-edges")).status()).toBe(404);expect((await request.get("/api/algebra/exercise/ar-impiegati-09/grading")).status()).toBe(404);
 await page.route("**/algebra/algebra-worker.js",r=>r.fulfill({status:200,contentType:"text/javascript",body:"self.onmessage=()=>{while(true){}};"}),{times:1});await page.getByRole("button",{name:"Esegui algebra"}).click();await expect(page.locator(".sql-error")).toContainText("Tempo massimo",{timeout:10000});
 await page.getByRole("button",{name:"Esegui algebra"}).click();await expect(page.locator(".algebra-intermediate tbody tr")).toHaveCount(6);expect(watched.external).toEqual([]);expect(watched.errors).toEqual([]);
});

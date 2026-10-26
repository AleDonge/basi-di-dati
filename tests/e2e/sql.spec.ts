import {test,expect,type Page} from "@playwright/test";
import {readFile} from "node:fs/promises";
import cases from "../fixtures/sql-grading-cases.json";
async function openLab(page:Page) {
  await page.goto("/sql-lab");
  await expect(page.getByRole("button",{name:"Esegui",exact:true})).toBeEnabled({timeout:20000});
  await expect(page.locator(".monaco-editor")).toBeVisible();
  await page.getByLabel("Editor testuale accessibile",{exact:true}).check();
}
async function execute(page:Page,query:string) {
  await page.getByRole("textbox",{name:"Query SQL",exact:true}).fill(query);
  await page.getByRole("button",{name:"Esegui",exact:true}).click();
}
function monitor(page:Page) {
  const external:string[]=[];const errors:string[]=[];
  page.on("request",r=>{if(new URL(r.url()).origin!=="http://127.0.0.1:3000") external.push(r.url());});
  page.on("pageerror",e=>errors.push(e.message));
  return {external,errors};
}
test("Sailors: Monaco, query, errori, schema, reset, cronologia e isolamento",async({page},info)=>{
  const observed=monitor(page);await openLab(page);
  await page.getByLabel("Editor testuale accessibile",{exact:true}).uncheck();
  await page.getByRole("textbox",{name:/^Editor SQL\./}).focus();
  // Chromium runs on Windows even when emulating an iPhone viewport/user agent.
  await page.keyboard.press("Control+A");await page.keyboard.type("SELECT COUNT(*) AS n FROM Sailors;");
  await page.keyboard.press("Control+Enter");
  await expect(page.locator(".sql-result-panel tbody td")).toHaveText("10");
  await page.getByRole("textbox",{name:/^Editor SQL\./}).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button",{name:"Esegui",exact:true})).toBeFocused();
  await page.locator(".sql-editor").screenshot({path:`docs/screenshots/sql-editor-${info.project.name}.png`});
  await page.getByLabel("Editor testuale accessibile",{exact:true}).check();
  await execute(page,"SELECT sname FROM Sailors WHERE sname='Horatio';");
  await expect(page.locator(".sql-result-panel tbody tr")).toHaveCount(2);
  await execute(page,"SELECT FROM Sailors");await expect(page.locator(".sql-error")).toContainText("Errore di sintassi");
  await execute(page,"DELETE FROM Sailors");await expect(page.locator(".sql-error")).toContainText("Query non ammessa");
  await execute(page,"SELECT * FROM lessonVersions");await expect(page.locator(".sql-error")).toContainText("Errore di esecuzione");
  await execute(page,"SELECT COUNT(*) AS n FROM Sailors;");await expect(page.locator(".sql-result-panel tbody td")).toHaveText("10");
  await page.getByRole("button",{name:"Reserves 10"}).click();
  await expect(page.locator(".sql-schema")).toContainText("FK sid → Sailors.sid");
  await page.getByRole("button",{name:"Reset database"}).click();
  await expect(page.getByText(/Database ripristinato dai dati/)).toBeVisible();
  await execute(page,"SELECT COUNT(*) AS n FROM Reserves;");await expect(page.locator(".sql-result-panel tbody td")).toHaveText("10");
  await page.locator(".sql-query-history summary").click();await expect(page.locator(".sql-history li")).toHaveCount(7);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:`docs/screenshots/sql-lab-${info.project.name}.png`,fullPage:true});
  await page.reload();await expect(page.getByRole("button",{name:"Esegui",exact:true})).toBeEnabled();
  await page.locator(".sql-query-history summary").click();await expect(page.locator(".sql-history li")).toHaveCount(7);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  expect(observed.external).toEqual([]);expect(observed.errors).toEqual([]);
});
test("NorthWind completo, BLOB, limite righe e nessuna richiesta esterna",async({page,request})=>{
  const observed=monitor(page);await openLab(page);
  await page.getByRole("combobox",{name:"Database SQL"}).selectOption("northwind");
  await expect(page.getByRole("button",{name:"Esegui",exact:true})).toBeEnabled();
  await execute(page,"SELECT COUNT(*) AS n FROM orders;");await expect(page.locator(".sql-result-panel tbody td")).toHaveText("830");
  await execute(page,"SELECT COUNT(Photo) AS foto, SUM(length(Photo)) AS byte_foto FROM employees;");
  await expect(page.locator(".sql-result-panel tbody td").first()).toHaveText("9");
  await page.getByRole("button",{name:"employees 9",exact:true}).click();
  await page.locator(".sql-preview summary").click();
  await expect(page.locator(".sql-preview")).toContainText("BLOB");
  await expect(page.locator(".sql-preview tbody tr")).toHaveCount(9);
  await execute(page,"SELECT * FROM order_details;");
  await expect(page.locator(".sql-result-panel tbody tr")).toHaveCount(500);
  await expect(page.locator(".sql-result-panel")).toContainText("Risultato limitato");
  await execute(page,"SELECT COUNT(*) FROM order_details;");await expect(page.locator(".sql-result-panel tbody td")).toHaveText("2155");
  const headers=(await request.get("/sql/sql-worker.js")).headers();
  expect(headers["content-security-policy"]).toContain("connect-src 'none'");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  expect(observed.external).toEqual([]);expect(observed.errors).toEqual([]);
});
test("timeout termina il worker reale; reset e nuova query restano funzionanti",async({page})=>{
  let closed=0;page.on("worker",worker=>{if(worker.url().includes("sql-worker"))worker.on("close",()=>closed++);});
  await openLab(page);
  await execute(page,"WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n) SELECT SUM(x) FROM n;");
  await expect(page.locator(".sql-error")).toContainText("Limite di esecuzione",{timeout:10000});
  await expect.poll(()=>closed).toBeGreaterThan(0);
  await execute(page,"SELECT COUNT(*) FROM Sailors;");await expect(page.locator(".sql-result-panel tbody td")).toHaveText("10");
  await page.getByRole("button",{name:"Reset database"}).click();await expect(page.getByText(/Database ripristinato dai dati/)).toBeVisible();
  await execute(page,"SELECT COUNT(*) FROM Sailors;");await expect(page.locator(".sql-result-panel tbody td")).toHaveText("10");
  await page.locator(".sql-query-history summary").click();await expect(page.locator(".sql-history")).toContainText("Limite di esecuzione");
});
test("cinque esercizi, fixture discriminanti, soluzione su richiesta e backup con progressi precedenti",async({page},info)=>{
  const observed=monitor(page);const solutions:string[]=[];
  page.on("request",request=>{if(/\/api\/sql\/exercise\/.*\/(grading|solution)/.test(request.url()))solutions.push(request.url());});
  await page.goto("/learn/dbms-dati");await page.getByRole("button",{name:"Segna come completata",exact:true}).click();
  await expect(page.getByRole("button",{name:"Annulla completamento"})).toBeEnabled();
  for(const entry of cases) {
    const before=solutions.length;
    await page.goto(`/practice/${entry.id}`);
    await expect(page.getByRole("button",{name:"Reset database",exact:true})).toBeEnabled({timeout:20000});
    expect(solutions).toHaveLength(before);
    await expect(page.locator(".reference-solution")).toHaveCount(0);
    await page.getByLabel("Editor testuale accessibile",{exact:true}).check();
    if(entry.id==="sailors-03") {
      await page.getByRole("textbox",{name:"Query SQL",exact:true}).fill(entry.incorrect[0]);
      await page.getByRole("button",{name:"Verifica su 5 fixture"}).click();
      await expect(page.locator(".sql-grade h2")).toHaveText("Da rivedere");
      await expect(page.locator(".sql-grade li").first()).toContainText("✓ sailors");
    }
    await page.getByRole("textbox",{name:"Query SQL",exact:true}).fill(entry.correct[1]);
    await page.getByRole("button",{name:"Verifica su 5 fixture"}).click();
    await expect(page.locator(".sql-grade h2")).toHaveText("Coerente sulle fixture",{timeout:20000});
    await expect(page.getByText(/Completamento locale: verifica superata/)).toBeVisible();
  }
  await page.getByRole("button",{name:"Mostra soluzione di riferimento"}).click();
  await expect(page.locator(".reference-solution")).toContainText("non fornita dal docente");
  await execute(page,"SELECT COUNT(*) FROM Sailors;");
  await expect(page.locator(".sql-result-panel tbody td")).toHaveText("10");
  await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/screenshots/sql-exercise-${info.project.name}.png`,fullPage:true});
  await page.goto("/settings");
  const event=page.waitForEvent("download");await page.getByRole("button",{name:"Esporta progressi JSON"}).click();
  const backup=JSON.parse(await readFile((await(await event).path())!,"utf8"));
  expect(backup.schemaVersion).toBe(5);expect(backup.attempts.filter((a:{result:string})=>a.result==="passed")).toHaveLength(5);
  expect(backup.sqlHistory).toHaveLength(1);
  expect(backup.lessons[0].completedAt).toBeTruthy();
  await page.evaluate(()=>new Promise<void>((resolve,reject)=>{const r=indexedDB.deleteDatabase("database-academy-progress");r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);}));
  await page.reload();await expect(page.getByRole("button",{name:"Esporta progressi JSON"})).toBeEnabled();
  await page.getByLabel("Importa backup JSON").setInputFiles({name:"sql-backup.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(backup))});
  await page.getByLabel(/Ho controllato l’anteprima/).check();await page.getByRole("button",{name:"Conferma importazione"}).click();
  await expect(page.getByRole("status")).toContainText("Importazione completata");
  await page.goto("/practice");await expect(page.locator(".exercise-state").filter({hasText:"Verifica superata"})).toHaveCount(5);
  await page.goto("/learn/dbms-dati");await expect(page.getByRole("button",{name:"Annulla completamento"})).toBeEnabled();
  expect(observed.external).toEqual([]);expect(observed.errors).toEqual([]);
});

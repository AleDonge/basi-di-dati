import {beforeAll,describe,expect,it} from "vitest";
import init from "@sqlite.org/sqlite-wasm";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {SqliteEngine} from "@/lib/sql/engine";
import {loadSqlExercise,loadSolution,loadGradingFixtures} from "@/lib/sql/content";
import {gradeSql,compareResults} from "@/lib/grading/sql";
import {manifest} from "@/lib/content";
import {loadLesson} from "@/lib/content/lessons";
import cases from "@/tests/fixtures/sprint6-sql-cases.json";
let engine:SqliteEngine;
beforeAll(async()=>{engine=new SqliteEngine(await init());});
const rows=(data:unknown[][])=>JSON.stringify(data.toSorted((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
for(const c of cases){
 const e=loadSqlExercise(c.id),fixtures=loadGradingFixtures(e),reference=loadSolution(e);
 describe(c.id,()=>{
  it("riferimento verificato con risultati attesi indipendenti, incluse parità/NULL/vuoto",()=>{
   for(const f of fixtures.slice(1)){
    const actual=engine.execute(f,reference);
    expect(actual.truncated).toBe(false);
    const expected=f.id.endsWith("empty")?c.empty:c.expected;
    expect(e.orderMatters?actual.rows:rows(actual.rows)).toEqual(e.orderMatters?expected:rows(expected));
   }
  });
  it("accetta una formulazione alternativa sulle quattro fixture con motore reale",async()=>{
   expect((await gradeSql(c.alternative,reference,fixtures,async(f,q)=>engine.execute(f,q),e.orderMatters)).status).toBe("passed");
  });
  it("discrimina un errore specifico e una query sintatticamente invalida",async()=>{
   expect((await gradeSql(c.wrong,reference,fixtures,async(f,q)=>engine.execute(f,q),e.orderMatters)).status).toBe("failed");
   await expect(gradeSql("SELECT FROM",reference,fixtures,async(f,q)=>engine.execute(f,q),e.orderMatters)).rejects.toMatchObject({kind:"syntax"});
  });
  it("contratto, manifest, riferimenti e provenienza coerenti",()=>{
   const meta=manifest.exercises.find(x=>x.id===e.id)!;
   expect(e.origin).toBe("platform-activity");expect(e.status).toBe("needs-review");
   expect(e.outputContract).toEqual(meta.expectedColumns);expect(e.orderMatters).toBe(meta.orderMatters);
   expect(e.fixtureIds).toEqual(meta.fixtures);expect(e.sourceRefs).toEqual(meta.sourceRefs);
   for(const id of e.lessonIds)expect(manifest.lessons.some(l=>l.id===id)).toBe(true);
  });
 });
}
describe("Copertura e regressioni didattiche",()=>{
 it("esegue i blocchi SQL dichiarati operativi nelle lezioni e controlla i risultati con attesi indipendenti",()=>{
  const sailors=loadGradingFixtures(loadSqlExercise("academy-sailors-01"))[0];
  const northwind=loadGradingFixtures(loadSqlExercise("academy-northwind-01"))[0];
  const examples:[string,number,unknown[][]][]=[
   ["sql-domande",0,[[31,"lubber",8],[32,"Andy",8],[58,"Rusty",10],[71,"Zorba",10],[74,"Horatio",9]]],
   ["sql-select",0,[[58,"Rusty",10],[71,"Zorba",10],[74,"Horatio",9],[31,"lubber",8],[32,"Andy",8],[22,"Dustin",7],[64,"Horatio",7],[85,"Art",3],[95,"Bob",3],[29,"Brutus",1]]],
   ["sql-filtri",0,[[32,"Andy",25.5],[64,"Horatio",35],[74,"Horatio",35]]],
   ["sql-aggregati",0,[[10,10,1,10,6.6]]],
   ["sql-gruppi",0,[[3,2,43],[7,2,40],[8,2,40.5]]],
   ["sql-sottoquery",0,[[58,"Rusty",10],[71,"Zorba",10]]],
   ["sql-sottoquery",1,[[29,"Brutus"],[32,"Andy"],[58,"Rusty"],[71,"Zorba"],[85,"Art"],[95,"Bob"]]],
   ["sql-quantificatori",1,[[58,"Rusty",10],[71,"Zorba",10]]],
   ["sql-insiemi",0,[[29],[32],[58],[71],[85],[95]]],
   ["sql-cte",0,[[22,4],[31,3]]],
   ["sql-join",0,[[22,"Dustin",102,"1998-10-10"],[22,"Dustin",104,"1998-07-10"],[31,"lubber",102,"1998-10-11"],[31,"lubber",104,"1998-01-11"],[64,"Horatio",102,"1998-08-09"]]],
   ["sql-outer",0,[[22,"Dustin",4],[29,"Brutus",0],[31,"lubber",3],[32,"Andy",0],[58,"Rusty",0],[64,"Horatio",2],[71,"Zorba",0],[74,"Horatio",1],[85,"Art",0],[95,"Bob",0]]],
   ["strumenti-ambiente",0,[[10]]],
   ["strumenti-script",1,[[830]]],
  ];
  for(const [id,index,expected]of examples){const body=loadLesson(id)!.body,query=[...body.matchAll(/```sql\r?\n([\s\S]*?)```/g)][index][1];const result=engine.execute(id==="strumenti-script"?northwind:sailors,query);expect(result.truncated,id).toBe(false);expect(rows(result.rows),id).toBe(rows(expected));}
  for(const [id,index]of [["sql-quantificatori",0],["sql-ddl",0],["sql-ddl",1],["strumenti-script",0]] as const){const query=[...loadLesson(id)!.body.matchAll(/```sql\r?\n([\s\S]*?)```/g)][index][1];expect(()=>engine.execute(sailors,query)).toThrow();}
 });
 it("16 nuove lezioni complete con 48 domande, fonte e pagine consultabili",()=>{
  const added=manifest.lessons.filter(l=>["sql","strumenti"].includes(l.moduleId));expect(added).toHaveLength(16);
  for(const meta of added){const l=loadLesson(meta.slug)!;expect(l.quiz.questions).toHaveLength(3);expect(l.body).toContain("Database Academy");expect(l.body.toLowerCase()).toContain("errori");expect(l.body).toContain("## Riepilogo");expect(l.body.split(/\s+/).length).toBeGreaterThan(500);expect(l.meta.status).toBe("needs-review");}
 });
 it("distingue dialetti: costrutti non supportati rifiutati, RIGHT/FULL e CTE verificati",()=>{
  const f=loadGradingFixtures(loadSqlExercise(cases[0].id))[0];
  for(const q of ["SELECT rating FROM Sailors WHERE rating>ALL(SELECT rating FROM Sailors)","SELECT MONTH(day) FROM Reserves","CREATE VIEW v AS SELECT * FROM Sailors"])
   expect(()=>engine.execute(f,q)).toThrow();
  expect(engine.execute(f,"SELECT COUNT(*) FROM Sailors s RIGHT JOIN Reserves r ON s.sid=r.sid").rows).toEqual([[10]]);
  expect(engine.execute(f,"SELECT COUNT(*) FROM Sailors s FULL JOIN Reserves r ON s.sid=r.sid").rows).toEqual([[16]]);
  expect(engine.execute(f,"WITH x AS(SELECT sid FROM Sailors) SELECT COUNT(*) FROM x").rows).toEqual([[10]]);
 });
 it("risposta accidentalmente corretta sull'originale fallisce sulle fixture sintetiche",async()=>{
  const e=loadSqlExercise("academy-northwind-09"),f=loadGradingFixtures(e),q="SELECT ProductID FROM products WHERE 1=0",ref=loadSolution(e);
  expect(compareResults(engine.execute(f[0],q),engine.execute(f[0],ref),false).equal).toBe(true);
  expect((await gradeSql(q,ref,f,async(a,b)=>engine.execute(a,b))).status).toBe("failed");
 });
 it("fixture NorthWind prive di riferimenti orfani, NULL leciti e dati ufficiali separati",()=>{
  const f=loadGradingFixtures(loadSqlExercise("academy-northwind-01"));
  for(const x of f.slice(1)){
   for(const q of ["SELECT COUNT(*) FROM order_details d LEFT JOIN orders o ON o.OrderID=d.OrderID WHERE o.OrderID IS NULL","SELECT COUNT(*) FROM order_details d LEFT JOIN products p ON p.ProductID=d.ProductID WHERE p.ProductID IS NULL","SELECT COUNT(*) FROM products p LEFT JOIN categories c ON c.CategoryID=p.CategoryID WHERE p.CategoryID IS NOT NULL AND c.CategoryID IS NULL","SELECT COUNT(*) FROM orders o LEFT JOIN customers c ON c.CustomerID=o.CustomerID WHERE o.CustomerID IS NOT NULL AND c.CustomerID IS NULL"])
    expect(engine.execute(x,q).rows).toEqual([[0]]);
  }
 });
 it("i cinque esercizi ufficiali, relativi riferimenti e archivi precedenti restano identici",()=>{
  const baseline=JSON.parse(readFileSync("content/imports/sprint6-protected.json","utf8")) as Record<string,string>;
  for(const [file,sha]of Object.entries(baseline))expect(createHash("sha256").update(readFileSync(file)).digest("hex"),file).toBe(sha);
 });
});

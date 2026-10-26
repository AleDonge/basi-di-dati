import { beforeAll, describe, expect, it } from "vitest";
import init from "@sqlite.org/sqlite-wasm";
import { readFileSync } from "node:fs";
import { SqliteEngine } from "@/lib/sql/engine";
import type { SqlFixture } from "@/lib/sql/types";
let engine: SqliteEngine;
export function fixture(id: string): SqlFixture {
  const folder = `content/courses/basi-di-dati/datasets/${id}`;
  const catalog = JSON.parse(readFileSync(`${folder}/catalog.json`,"utf8")) as { tables: { name: string }[] };
  return { id, schemaSql: readFileSync(`${folder}/schema.sql`,"utf8"), seedSql: readFileSync(`${folder}/seed.sql`,"utf8"), tables: catalog.tables.map(t => t.name) };
}
beforeAll(async () => { engine = new SqliteEngine(await init()); });
describe("SQLite WASM reale e confini della lettura", () => {
  it("carica i dati Sailors, mantiene date e risultati campione", () => {
    const f = fixture("sailors");
    expect(engine.execute(f,"SELECT COUNT(*) FROM Sailors").rows).toEqual([[10]]);
    expect(engine.execute(f,"SELECT COUNT(*) FROM Boats").rows).toEqual([[4]]);
    expect(engine.execute(f,"SELECT COUNT(*) FROM Reserves").rows).toEqual([[10]]);
    expect(engine.execute(f,"SELECT day FROM Reserves WHERE sid=31 AND bid=104").rows).toEqual([["1998-01-11"]]);
    expect(engine.execute(f,"WITH x AS (SELECT age FROM Sailors) SELECT AVG(age) FROM x").rows[0][0]).toBeTypeOf("number");
  });
  it.each(["DELETE FROM Sailors", "PRAGMA query_only=OFF", "ATTACH ':memory:' AS x", "CREATE TABLE t(a)", "SELECT load_extension('x')", "SELECT readfile('x')", "SELECT * FROM sqlite_master", "SELECT * FROM lessonVersions", "SELECT 1; SELECT 2", "SELECT randomblob(1000000)"])("blocca %s", query => {
    expect(() => engine.execute(fixture("sailors"), query)).toThrow();
  });
  it("distingue sintassi invalida e nome di tabella inesistente", () => {
    expect.assertions(2);
    try { engine.execute(fixture("sailors"),"SELECT FROM Sailors"); } catch(e) { expect(e).toMatchObject({ kind: "syntax" }); }
    try { engine.execute(fixture("sailors"),"SELECT * FROM inesistente"); } catch(e) { expect(e).toMatchObject({ kind: "execution" }); }
  });
  it("gestisce stringhe/commenti con punto e virgola e conserva i duplicati", () => {
    expect(engine.execute(fixture("sailors"),"SELECT ';' AS x /* ; DELETE */; -- SELECT 2").rows).toEqual([[";"]]);
    expect(engine.execute(fixture("sailors"),"SELECT sname FROM Sailors WHERE sname='Horatio'").rows).toHaveLength(2);
  });
  it("interrompe ricorsione lunga e limita le righe", () => {
    expect(() => engine.execute(fixture("sailors"),"WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n) SELECT SUM(x) FROM n",{ timeoutMs: 10, maxRows: 500 })).toThrow(/interrott/);
    const result = engine.execute(fixture("sailors"),"SELECT * FROM Sailors",{ timeoutMs: 1000, maxRows: 3 });
    expect(result.rows).toHaveLength(3); expect(result.truncated).toBe(true);
  });
  it("importa NorthWind con tutti i conteggi e BLOB preservati", () => {
    const f = fixture("northwind");
    for (const [name,count] of Object.entries({ categories:8, customers:91, employees:9, order_details:2155, orders:830, products:77, shippers:3, suppliers:29 })) expect(engine.execute(f,`SELECT COUNT(*) FROM ${name}`).rows).toEqual([[count]]);
    expect(engine.execute(f,"SELECT COUNT(Photo), SUM(length(Photo)) FROM employees").rows[0][0]).toBe(9);
  });
  it("applica i limiti di input, colonne e dimensione dei valori", () => {
    expect(() => engine.execute(fixture("sailors"),"SELECT "+" ".repeat(20000))).toThrowError(expect.objectContaining({kind:"validation"}));
    expect(() => engine.execute(fixture("sailors"),"SELECT "+new Array(65).fill("1").join(","))).toThrowError(expect.objectContaining({kind:"resource"}));
    expect(() => engine.execute(fixture("sailors"),"WITH RECURSIVE n(x,txt) AS (SELECT 1,'x' UNION ALL SELECT x+1,txt||txt FROM n WHERE x<25) SELECT length(txt) FROM n")).toThrowError(expect.objectContaining({kind:"resource"}));
  });
  it("espone BLOB come anteprime dichiarate senza eliminare righe o alterare i dati", () => {
    const result=engine.execute(fixture("northwind"),"SELECT EmployeeID,Photo FROM employees");
    expect(result.rows).toHaveLength(9);expect(result.truncated).toBe(true);
    expect(result.rows[0][1]).toMatchObject({kind:"blob",preview:true});
    expect(engine.execute(fixture("northwind"),"SELECT COUNT(Photo) FROM employees").rows).toEqual([[9]]);
  });
});

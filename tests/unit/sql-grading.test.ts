import { beforeAll,describe,it,expect } from "vitest";
import init from "@sqlite.org/sqlite-wasm";
import { SqliteEngine } from "@/lib/sql/engine";
import { compareResults,gradeSql } from "@/lib/grading/sql";
import { loadSqlExercise,loadGradingFixtures,loadSolution } from "@/lib/sql/content";
import cases from "@/tests/fixtures/sql-grading-cases.json";
import type { SqlResult,SqlValue } from "@/lib/sql/types";
let engine:SqliteEngine;
beforeAll(async () => {engine=new SqliteEngine(await init());});
for(const entry of cases) {
  const exercise=loadSqlExercise(entry.id);const fixtures=loadGradingFixtures(exercise);const reference=loadSolution(exercise);
  describe(`Correzione ${entry.id}`,() => {
    it.each(entry.correct)("accetta sintassi equivalente: %s",async query => {
      const grade=await gradeSql(query,reference,fixtures,async(f,q) => engine.execute(f,q));
      expect(grade.status).toBe("passed"); expect(grade.checks).toHaveLength(5);
    });
    it.each(entry.incorrect)("rileva errore tipico: %s",async query => {
      expect((await gradeSql(query,reference,fixtures,async(f,q) => engine.execute(f,q))).status).toBe("failed");
    });
    if(entry.accidentallyCorrectOnOriginal) it("distingue risposta accidentalmente corretta sui dati iniziali",async() => {
      const query=entry.accidentallyCorrectOnOriginal!;
      expect(compareResults(engine.execute(fixtures[0],query),engine.execute(fixtures[0],reference),false).equal).toBe(true);
      expect((await gradeSql(query,reference,fixtures,async(f,q) => engine.execute(f,q))).status).toBe("failed");
    });
    it("verifica tutte le fixture sintetiche rispetto a PK/FK e confronta l’ordine solo quando richiesto",() => {
      for(const f of fixtures) expect(engine.execute(f,"SELECT COUNT(*) FROM Reserves r LEFT JOIN Sailors s ON r.sid=s.sid LEFT JOIN Boats b ON r.bid=b.bid WHERE s.sid IS NULL OR b.bid IS NULL").rows).toEqual([[0]]);
    });
  });
}
describe("Confronto tipato e multinsieme",() => {
  function result(rows:SqlValue[][],columns=["x"]):SqlResult{return{columns,rows,truncated:false,elapsedMs:1};}
  it("preserva duplicati, NULL, tipi e posizione delle colonne",() => {
    expect(compareResults(result([[1],[1],[null]]),result([[null],[1],[1]]),false).equal).toBe(true);
    expect(compareResults(result([[1],[2],[null]]),result([[1],[1],[null]]),false).equal).toBe(false);
    expect(compareResults(result([["1"]]),result([[1]]),false).equal).toBe(false);
    expect(compareResults(result([[0]]),result([[null]]),false).equal).toBe(false);
    expect(compareResults(result([[1,"nome"]],["a","b"]),result([["nome",1]],["b","a"]),false).equal).toBe(false);
    expect(compareResults(result([[1]]),result([[1,2]],["a","b"]),false).equal).toBe(false);
  });
  it("ORDER BY non richiesto è ignorato, ordine richiesto è rispettato",() => {
    expect(compareResults(result([[2],[1]]),result([[1],[2]]),false).equal).toBe(true);
    expect(compareResults(result([[2],[1]]),result([[1],[2]]),true).equal).toBe(false);
  });
  it("tolleranza solo numerica, interi esatti, risultati troncati inconclusivi",() => {
    expect(compareResults(result([[0.1+0.2]]),result([[0.3]]),false).equal).toBe(true);
    expect(compareResults(result([[1000000001]]),result([[1000000000]]),false).equal).toBe(false);
    expect(compareResults({...result([[1]]),truncated:true},result([[1]]),false).inconclusive).toBe(true);
  });
  it("non corregge LIMIT/OFFSET anche se accidentalmente innocui",async() => {
    const exercise=loadSqlExercise("sailors-03");const f=loadGradingFixtures(exercise);
    await expect(gradeSql("SELECT sname FROM Sailors LIMIT 999",loadSolution(exercise),f,async(a,q)=>engine.execute(a,q))).rejects.toMatchObject({kind:"validation"});
  });
  it("non scambia una parola LIMIT in una stringa per una clausola",async() => {
    const f=loadGradingFixtures(loadSqlExercise("sailors-03"));
    expect((await gradeSql("SELECT 'LIMIT'","SELECT 'LIMIT'",f,async(a,q)=>engine.execute(a,q))).status).toBe("passed");
  });
});

import type { SqlFixture, SqlResult, SqlValue } from "@/lib/sql/types";
import { SqlLabError } from "@/lib/sql/types";
import { hasRowLimit } from "@/lib/sql/lex";
function equalValue(a: SqlValue,b: SqlValue): boolean {
  if(typeof a === "number" && typeof b === "number") {
    if(Number.isInteger(a) && Number.isInteger(b)) return a === b;
    return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a-b) <= 1e-9*Math.max(1,Math.abs(a),Math.abs(b));
  }
  return JSON.stringify(a) === JSON.stringify(b);
}
export function compareResults(actual: SqlResult,expected: SqlResult,orderMatters: boolean) {
  if(actual.truncated || expected.truncated) return { equal:false, inconclusive:true, detail:"Risultato oltre i limiti: confronto incompleto, nessun verdetto di correttezza." };
  if(actual.columns.length !== expected.columns.length) return { equal:false,inconclusive:false,detail:`Colonne: attese ${expected.columns.length}, ricevute ${actual.columns.length}. Rispetta numero e posizione del contratto di output; gli alias sono liberi.` };
  if(actual.rows.length !== expected.rows.length) return { equal:false,inconclusive:false,detail:`Righe: attese ${expected.rows.length}, ricevute ${actual.rows.length}. Controlla gruppi, filtri e molteplicità.` };
  const rowEqual = (a: SqlValue[],b: SqlValue[]) => a.every((cell,i) => equalValue(cell,b[i]));
  let equal: boolean;
  if(orderMatters) equal = actual.rows.every((r,i) => rowEqual(r,expected.rows[i]));
  else {
    // Bipartite matching preserves multiplicities even when floating tolerances overlap.
    const matches = new Array<number>(expected.rows.length).fill(-1);
    const assign = (index: number, seen: Set<number>): boolean => {
      for(let j=0;j<expected.rows.length;j++) {
        if(seen.has(j) || !rowEqual(actual.rows[index],expected.rows[j])) continue;
        seen.add(j);
        if(matches[j] === -1 || assign(matches[j],seen)) { matches[j] = index; return true; }
      }
      return false;
    };
    equal = actual.rows.every((_row,i) => assign(i,new Set()));
  }
  return { equal,inconclusive:false,detail:equal ? "Valori e molteplicità coincidono." : "Valori, tipi o duplicati non coincidono. NULL è distinto da zero e da testo; la posizione delle colonne conta." };
}
export interface SqlGrade { status: "passed" | "failed" | "inconclusive"; message: string; checks: { fixtureId: string; passed: boolean; detail: string }[] }
export async function gradeSql(query: string,reference: string,fixtures: SqlFixture[],execute: (fixture: SqlFixture,sql: string) => Promise<SqlResult>,orderMatters = false): Promise<SqlGrade> {
  if(hasRowLimit(query)) throw new SqlLabError("validation","LIMIT/OFFSET sono consentiti nel laboratorio, ma esclusi dalla verifica di questi esercizi: richiedono tutti i gruppi e un limite potrebbe passare accidentalmente su fixture piccole.");
  const checks: SqlGrade["checks"] = []; let inconclusive = false;
  for(const fixture of fixtures) {
    const actual = await execute(fixture,query);
    let expected: SqlResult;
    try { expected = await execute(fixture,reference); }
    catch { throw new SqlLabError("execution","La soluzione di riferimento non è eseguibile: verifica sospesa, nessun esito assegnato."); }
    const comparison = compareResults(actual,expected,orderMatters);
    inconclusive ||= comparison.inconclusive;
    checks.push({ fixtureId:fixture.id,passed:comparison.equal,detail:comparison.detail });
  }
  const status = inconclusive ? "inconclusive" : checks.every(c => c.passed) ? "passed" : "failed";
  return { status,checks,message:status === "passed" ? `Coerente su ${checks.length} fixture con l’interpretazione dichiarata della piattaforma. Non è una prova di equivalenza generale.` : status === "inconclusive" ? "Verifica incompleta: nessun giudizio definitivo." : "Non coincide con la soluzione della piattaforma su tutte le fixture. Rivedi il contratto di output e i casi indicati; non è un giudizio sull’equivalenza generale." };
}

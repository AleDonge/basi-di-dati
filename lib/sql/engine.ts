import type { Sqlite3Static, Database, PreparedStatement, SqlValue as NativeValue } from "@sqlite.org/sqlite-wasm";
import { singleStatement } from "./lex";
import { SqlLabError, type SqlFixture, type SqlResult, type SqlValue } from "./types";

const functions = new Set("abs avg count sum total min max round coalesce ifnull nullif length lower upper trim ltrim rtrim substr substring replace instr like glob typeof cast date datetime time strftime julianday unixepoch hex quote iif concat concat_ws sign ceil ceiling floor sqrt pow power mod".split(" "));
export class SqliteEngine {
  constructor(private sqlite: Sqlite3Static) {}
  execute(fixture: SqlFixture, query: string, limits = { timeoutMs: 1500, maxRows: 500 }): SqlResult {
    const sql = singleStatement(query);
    if(!/^(SELECT|WITH)\b/i.test(sql)) throw new SqlLabError("validation","Sono ammesse soltanto SELECT o WITH … SELECT. Usa l’esploratore per lo schema, senza SHOW, DESCRIBE o PRAGMA.");
    if (limits.maxRows < 1 || limits.maxRows > 500 || limits.timeoutMs < 1 || limits.timeoutMs > 3000) throw new SqlLabError("validation", "Limiti di esecuzione non validi.");
    const start = performance.now(); const { capi } = this.sqlite;
    const db = new this.sqlite.oo1.DB(":memory:", "c"); let statement: PreparedStatement | undefined; let denied = false; let expired = false;
    try {
      db.exec("PRAGMA foreign_keys=ON; PRAGMA temp_store=MEMORY; PRAGMA trusted_schema=OFF; PRAGMA hard_heap_limit=67108864;");
      db.exec(fixture.schemaSql); db.exec(fixture.seedSql);
      db.exec("PRAGMA query_only=ON;");
      this.setLimits(db);
      const allowedTables = new Set(fixture.tables.map(t => t.toLowerCase()));
      capi.sqlite3_set_authorizer(db, (_context, action, arg1, arg2, database) => {
        const allowed = action === capi.SQLITE_SELECT || action === capi.SQLITE_RECURSIVE
          || (action === capi.SQLITE_READ && (database === "main" || database === 0) && typeof arg1 === "string" && allowedTables.has(arg1.toLowerCase()))
          || (action === capi.SQLITE_FUNCTION && typeof arg2 === "string" && functions.has(arg2.toLowerCase()));
        if (!allowed) denied = true;
        return allowed ? capi.SQLITE_OK : capi.SQLITE_DENY;
      }, 0);
      const deadline = performance.now()+limits.timeoutMs;
      let calls = 0;
      capi.sqlite3_progress_handler(db, 1000, () => {
        expired = performance.now() > deadline || ++calls > 10000;
        return expired ? 1 : 0;
      }, 0);
      try { statement = db.prepare(sql); }
      catch (error) {
        if (denied) throw new SqlLabError("validation", "Operazione o funzione non ammessa. Il laboratorio consente solo letture delle tabelle del dataset, senza PRAGMA, file, estensioni o comandi di modifica.");
        const detail = error instanceof Error ? error.message : String(error);
        if (expired) throw new SqlLabError("timeout", "Interrogazione interrotta: superato il budget di tempo o istruzioni.");
        if (/too (?:many|large|big)|out of memory|string or blob too big/i.test(detail)) throw new SqlLabError("resource",`Limite SQLite raggiunto: ${detail}`);
        if (/no such (?:table|column|function)|ambiguous column|misuse of aggregate|aggregate functions|GROUP BY/i.test(detail)) throw new SqlLabError("execution", `Controlla tabelle, colonne e aggregazioni. SQLite: ${detail}`);
        throw new SqlLabError("syntax", `Sintassi non accettata da SQLite: ${detail}`);
      }
      if (!capi.sqlite3_stmt_readonly(statement) || !statement.columnCount || statement.parameterCount) throw new SqlLabError("validation", "Occorre una SELECT senza parametri da associare. Le istruzioni di modifica non sono ammesse.");
      const columns = statement.getColumnNames(); const rows: SqlValue[][] = []; let truncated = false; let bytes = 0;
      while (statement.step()) {
        if (rows.length >= limits.maxRows) { truncated = true; break; }
        const native = statement.get([]) as NativeValue[];
        const row: SqlValue[] = [];
        for (const value of native) {
          let cell = this.cell(value);
          let size = JSON.stringify(cell).length * 2;
          if(size > 16384) {
            truncated=true;
            cell = typeof cell === "object" && cell?.kind === "blob" ? { kind:"blob",hex:cell.hex.slice(0,128),byteLength:cell.hex.length/2,preview:true } : `${String(cell).slice(0,4000)}… [valore limitato]`;
            size=JSON.stringify(cell).length*2;
          }
          if (bytes+size > 512*1024) { truncated = true; break; }
          bytes += size; row.push(cell);
        }
        if (row.length !== columns.length) break;
        rows.push(row);
      }
      return { columns, rows, truncated, elapsedMs: Math.round(performance.now()-start) };
    } catch (error) {
      if (error instanceof SqlLabError) throw error;
      if (expired) throw new SqlLabError("timeout", "Interrogazione interrotta: superato il budget di tempo o istruzioni.");
      const detail = error instanceof Error ? error.message : String(error);
      throw new SqlLabError(/memory|too (?:big|large|many)|out of/i.test(detail) ? "resource" : "execution", `SQLite: ${detail}`);
    } finally { statement?.finalize(); db.close(); }
  }
  private setLimits(db: Database) {
    const c = this.sqlite.capi;
    c.sqlite3_limit(db,c.SQLITE_LIMIT_LENGTH,1024*1024);
    c.sqlite3_limit(db,c.SQLITE_LIMIT_SQL_LENGTH,20000);
    c.sqlite3_limit(db,c.SQLITE_LIMIT_COLUMN,64);
    c.sqlite3_limit(db,c.SQLITE_LIMIT_EXPR_DEPTH,100);
    c.sqlite3_limit(db,c.SQLITE_LIMIT_COMPOUND_SELECT,20);
    c.sqlite3_limit(db,c.SQLITE_LIMIT_ATTACHED,0);
    c.sqlite3_limit(db,c.SQLITE_LIMIT_VARIABLE_NUMBER,0);
    c.sqlite3_limit(db,c.SQLITE_LIMIT_LIKE_PATTERN_LENGTH,1000);
  }
  private cell(value: NativeValue): SqlValue {
    if (typeof value === "bigint") return { kind: "integer", value: value.toString() };
    if (value instanceof Uint8Array || value instanceof Int8Array) return { kind: "blob", hex: Array.from(value, b => (b & 255).toString(16).padStart(2,"0")).join("") };
    if (value instanceof ArrayBuffer) return this.cell(new Uint8Array(value));
    return value;
  }
}

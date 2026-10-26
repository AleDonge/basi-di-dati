import type { SqlCatalog } from "./content";
import { SqlLabError, type SqlErrorKind, type SqlExecutionAdapter, type SqlFixture, type SqlResult } from "./types";
export class BrowserSqlAdapter implements SqlExecutionAdapter {
  readonly dialect = "sqlite" as const;
  readonly capabilities = ["select", "join", "group-by", "having", "cte", "subquery", "read-only"];
  private worker?: Worker;
  private initialized?: Promise<void>;
  private sequence = 0;
  private generation = 0;
  private pending = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> }>();
  private fixture?: SqlFixture;
  private wasm?: ArrayBuffer;
  catalog?: SqlCatalog;
  async loadFixture(id: string) {
    const response = await fetch(`/api/sql/dataset/${encodeURIComponent(id)}`);
    if(!response.ok) throw new SqlLabError("execution", "Impossibile caricare il dataset locale.");
    const data = await response.json() as { fixture: SqlFixture; catalog: SqlCatalog };
    this.fixture = data.fixture; this.catalog = data.catalog;
    await this.ensureWorker();
  }
  async executeReadOnly(query: string, limits = { timeoutMs: 1500, maxRows: 500 }) {
    if(!this.fixture) throw new SqlLabError("execution", "Seleziona prima un database.");
    return this.executeFixture(this.fixture,query,limits);
  }
  async executeFixture(fixture: SqlFixture,query: string, limits = { timeoutMs: 1500, maxRows: 500 }): Promise<SqlResult> {
    await this.ensureWorker();
    try { return await this.request({ type: "execute", fixture, query, limits }, limits.timeoutMs+1500) as SqlResult; }
    catch(error) { if(error instanceof SqlLabError && ["timeout","resource"].includes(error.kind)) this.stop(); throw error; }
  }
  async reset() { this.stop(); await this.ensureWorker(); }
  stop() {
    this.generation++;
    this.worker?.terminate(); this.worker = undefined; this.initialized = undefined;
    for(const request of this.pending.values()) { clearTimeout(request.timer); request.reject(new SqlLabError("cancelled","Worker terminato. Nessun dato dei progressi è stato cancellato.")); }
    this.pending.clear();
  }
  private ensureWorker() {
    if(this.initialized) return this.initialized;
    const generation = this.generation;
    this.initialized = (async () => {
      if(!this.wasm) { const response = await fetch("/sql/sqlite3.wasm"); if(!response.ok) throw new Error("File WASM locale non disponibile"); this.wasm = await response.arrayBuffer(); }
      if(generation !== this.generation) throw new SqlLabError("cancelled","Inizializzazione annullata.");
      this.worker = new Worker("/sql/sql-worker.js",{ type:"module", name:"database-academy-sql" });
      this.worker.onmessage = event => {
        const message = event.data as { id: number; ok: boolean; value?: unknown; error?: { kind: SqlErrorKind; message: string } };
        const pending = this.pending.get(message.id); if(!pending) return;
        clearTimeout(pending.timer); this.pending.delete(message.id);
        if(message.ok) pending.resolve(message.value);
        else pending.reject(new SqlLabError(message.error?.kind ?? "execution",message.error?.message ?? "Errore del worker"));
      };
      this.worker.onerror = () => this.stop();
      await this.request({ type:"init", bytes:this.wasm },10000);
    })().catch(error => { if(generation === this.generation) this.stop(); throw error; });
    return this.initialized;
  }
  private request(payload: Record<string, unknown>, timeout: number) {
    const id = ++this.sequence;
    return new Promise<unknown>((resolve,reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id); reject(new SqlLabError("timeout","Tempo massimo superato: il worker è stato terminato. Puoi ridurre la query e riprovare.")); this.stop();
      },timeout);
      this.pending.set(id,{ resolve,reject,timer });
      this.worker!.postMessage({ ...payload,id });
    });
  }
}

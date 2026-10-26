import init, { type Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import { z } from "zod";
import { SqliteEngine } from "./engine";
import { SqlLabError } from "./types";
const fixtureSchema = z.object({ id: z.string().max(80), schemaSql: z.string().max(100000), seedSql: z.string().max(2*1024*1024), tables: z.array(z.string().regex(/^\w+$/)).max(32) }).strict();
const requestSchema = z.discriminatedUnion("type", [
  z.object({ id: z.number().int(), type: z.literal("init"), bytes: z.instanceof(ArrayBuffer) }).strict(),
  z.object({ id: z.number().int(), type: z.literal("execute"), fixture: fixtureSchema, query: z.string().max(20000), limits: z.object({ timeoutMs: z.number().int().min(1).max(3000), maxRows: z.number().int().min(1).max(500) }).strict() }).strict(),
]);
let engine: SqliteEngine | undefined;
const scope = globalThis as unknown as { onmessage: ((event: MessageEvent<unknown>) => void) | null; postMessage: (message: unknown) => void };
scope.onmessage = async event => {
  let id = 0;
  try {
    const input = requestSchema.parse(event.data); id = input.id;
    if (input.type === "init") {
      // The upstream runtime accepts wasmBinary; its published init type omits options.
      const initialize = init as unknown as (options: { wasmBinary: Uint8Array; print: () => void; printErr: () => void }) => Promise<Sqlite3Static>;
      const sqlite = await initialize({ wasmBinary: new Uint8Array(input.bytes), print: () => undefined, printErr: () => undefined });
      for (const key of ["indexedDB", "XMLHttpRequest", "WebSocket", "EventSource", "importScripts"]) Object.defineProperty(globalThis, key, { value: undefined, configurable: false });
      Object.defineProperty(globalThis, "fetch", { value: () => Promise.reject(new Error("Rete disabilitata nel worker SQL")), configurable: false });
      engine = new SqliteEngine(sqlite); scope.postMessage({ id, ok: true, value: { version: sqlite.version.libVersion } });
    } else {
      if (!engine) throw new SqlLabError("execution", "Motore non inizializzato.");
      scope.postMessage({ id, ok: true, value: engine.execute(input.fixture, input.query, input.limits) });
    }
  } catch(error) { scope.postMessage({ id, ok: false, error: { kind: error instanceof SqlLabError ? error.kind : "execution", message: error instanceof Error ? error.message : "Errore del worker" } }); }
};

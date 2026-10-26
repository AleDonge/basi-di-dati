export type SqlValue = string | number | null | { kind: "blob"; hex: string; byteLength?: number; preview?: true } | { kind: "integer"; value: string };
export interface SqlResult { columns: string[]; rows: SqlValue[][]; truncated: boolean; elapsedMs: number }
export type SqlErrorKind = "validation" | "syntax" | "execution" | "timeout" | "cancelled" | "resource";
export class SqlLabError extends Error {
  constructor(public kind: SqlErrorKind, message: string) { super(message); this.name = "SqlLabError"; }
}
export interface SqlFixture { id: string; schemaSql: string; seedSql: string; tables: string[] }
export interface SqlExecutionAdapter {
  readonly dialect: "sqlite" | "mysql";
  readonly capabilities: readonly string[];
  loadFixture(fixtureId: string): Promise<void>;
  executeReadOnly(query: string, limits: { timeoutMs: number; maxRows: number }): Promise<SqlResult>;
  reset(): Promise<void>;
}

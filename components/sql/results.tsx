import type { SqlResult, SqlValue } from "@/lib/sql/types";
function Cell({value}:{value:SqlValue}) {
  if(value === null) return <span className="sql-null">NULL</span>;
  if(typeof value === "object") return value.kind === "blob" ? <span title={value.hex}>BLOB · {value.byteLength ?? value.hex.length/2} byte · {value.hex.slice(0,24)}{value.hex.length>24 ? "…" : ""}{value.preview ? " · anteprima limitata" : ""}</span> : <span>{value.value}</span>;
  return <>{String(value)}</>;
}
export function SqlResults({result,caption="Risultato della query"}:{result:SqlResult;caption?:string}) {
  return <div className="sql-results"><p className="result-meta">{result.rows.length} righe visualizzate · {result.columns.length} colonne · {result.elapsedMs} ms{result.truncated && <strong> · Risultato limitato: massimo righe, celle o dimensione raggiunto. Non utilizzabile come confronto completo.</strong>}</p><div className="sql-table-scroll" tabIndex={0} role="region" aria-label={caption}><table><caption>{caption}</caption><thead><tr>{result.columns.map((c,i) => <th key={i} scope="col">{c}</th>)}</tr></thead><tbody>{result.rows.map((row,i) => <tr key={i}>{row.map((v,j) => <td key={j}><Cell value={v} /></td>)}</tr>)}</tbody></table></div>{result.rows.length === 0 && <p className="empty-sql">La query è stata eseguita e non ha restituito righe.</p>}</div>;
}

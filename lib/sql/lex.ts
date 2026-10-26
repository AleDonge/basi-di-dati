import { SqlLabError } from "./types";
// Lexical framing only. SQLite's parser + authorizer perform structural validation.
export function singleStatement(query: string): string {
  if (!query.trim() || query.length > 20000 || query.includes("\0")) throw new SqlLabError("validation", "Inserisci una query di massimo 20.000 caratteri, senza caratteri NUL.");
  const statements: string[] = []; let buffer = ""; let quote = "";
  for (let i=0; i<query.length; i++) {
    const c = query[i]; const next = query[i+1];
    if (quote) {
      buffer += c;
      if (c === quote) { if (next === quote && quote !== "]") { buffer += next; i++; } else quote = ""; }
    } else if (c === "'" || c === '"' || c === "`" || c === "[") { quote = c === "[" ? "]" : c; buffer += c; }
    else if (c === "-" && next === "-") { while (i<query.length && query[i] !== "\n") i++; buffer += " "; }
    else if (c === "/" && next === "*") { const end = query.indexOf("*/",i+2); if(end<0) throw new SqlLabError("syntax", "Commento SQL non chiuso."); i=end+1; buffer += " "; }
    else if (c === ";") { if(buffer.trim()) statements.push(buffer.trim()); buffer = ""; }
    else buffer += c;
  }
  if (quote) throw new SqlLabError("syntax", "Stringa o identificatore non chiuso. SQLite usa apici raddoppiati per gli apostrofi.");
  if (buffer.trim()) statements.push(buffer.trim());
  if (statements.length !== 1) throw new SqlLabError("validation", "È consentita una sola interrogazione SELECT o WITH … SELECT alla volta.");
  return statements[0];
}

export function hasRowLimit(query: string) {
  const sql=singleStatement(query); let quote=""; let word="";
  const isLimit=() => ["LIMIT","OFFSET"].includes(word.toUpperCase());
  for(let i=0;i<sql.length;i++) {
    const c=sql[i];
    if(quote) { if(c===quote) { if(sql[i+1]===quote && quote!=="]") i++; else quote=""; } continue; }
    if(c==="'" || c==='"' || c==="`" || c==="[") { if(isLimit())return true;word="";quote=c==="[" ? "]" : c; }
    else if(/[a-zA-Z0-9_]/.test(c)) word+=c;
    else { if(isLimit())return true;word=""; }
  }
  return isLimit();
}

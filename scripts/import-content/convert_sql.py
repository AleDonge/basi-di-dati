"""Strict, reproducible conversion of the three provided text sources. No execution of MySQL.
Only the observed grammar is accepted; unknown commands/types/values fail closed.
"""
from pathlib import Path
import hashlib
import json
import re
import sqlite3
from datetime import date

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'content/courses/basi-di-dati/datasets'

def split_sql(text):
    statements, buf = [], []
    i, quote = 0, None
    while i < len(text):
        c = text[i]
        if quote:
            buf.append(c)
            if c == '\\' and quote != '`':
                i += 1
                if i >= len(text): raise ValueError('Escape incompleto')
                buf.append(text[i])
            elif c == quote:
                if i + 1 < len(text) and text[i+1] == quote:
                    i += 1; buf.append(text[i])
                else: quote = None
        elif c in "'\"`": quote = c; buf.append(c)
        elif text.startswith('/*', i):
            end = text.find('*/', i+2)
            if end < 0: raise ValueError('Commento incompleto')
            i = end+1; buf.append(' ')
        elif text.startswith('--', i) or c == '#':
            end = text.find('\n', i)
            i = len(text) if end < 0 else end
            buf.append('\n')
        elif c == ';':
            s = ''.join(buf).strip()
            if s: statements.append(s)
            buf = []
        else: buf.append(c)
        i += 1
    if quote: raise ValueError('Stringa incompleta')
    if ''.join(buf).strip(): raise ValueError('Statement senza terminatore')
    return statements

def comma_parts(text):
    parts, start, depth, quote, i = [], 0, 0, None, 0
    while i < len(text):
        c = text[i]
        if quote:
            if c == '\\' and quote != '`': i += 1
            elif c == quote:
                if i+1 < len(text) and text[i+1] == quote: i += 1
                else: quote = None
        elif c in "'\"`": quote = c
        elif c == '(': depth += 1
        elif c == ')': depth -= 1
        elif c == ',' and depth == 0: parts.append(text[start:i].strip()); start = i+1
        i += 1
    if quote or depth: raise ValueError('Valori sbilanciati')
    parts.append(text[start:].strip())
    return parts

def literal(token):
    if token.upper() == 'NULL': return None
    if re.fullmatch(r'0x[0-9a-fA-F]+', token): return bytes.fromhex(token[2:])
    if token.startswith("'") and token.endswith("'"):
        value, i, raw = '', 0, token[1:-1]
        escapes = {'0': '\0', 'n': '\n', 'r': '\r', 't': '\t', 'b': '\b', 'Z': '\x1a', "'": "'", '"': '"', '\\': '\\', '%': '\\%', '_': '\\_'}
        while i < len(raw):
            if raw[i] == '\\':
                i += 1
                if raw[i] not in escapes: raise ValueError(f'Escape MySQL non riconosciuto: {raw[i]}')
                value += escapes[raw[i]]
            elif raw[i:i+2] == "''": value += "'"; i += 1
            elif raw[i] == "'": raise ValueError('Apice non escapato')
            else: value += raw[i]
            i += 1
        return value
    if re.fullmatch(r'-?\d+', token): return int(token)
    if re.fullmatch(r'-?\d+\.\d+', token): return float(token)
    raise ValueError(f'Letterale non supportato: {token[:80]}')

def sql_literal(value):
    if value is None: return 'NULL'
    if isinstance(value, bytes): return "X'"+value.hex()+"'"
    if isinstance(value, str):
        if '\0' in value: return "CAST(X'"+value.encode().hex()+"' AS TEXT)"
        return "'"+value.replace("'", "''")+"'"
    return repr(value)

def convert(dataset, filename):
    path = ROOT / 'source-material' / filename
    raw = path.read_bytes(); text = raw.decode('utf-8-sig')
    statements = split_sql(text)
    tables, seed, indexes, alterations, changes = {}, [], [], [], []
    command_counts = {}
    for statement in statements:
        verb = statement.split()[0].upper(); command_counts[verb] = command_counts.get(verb, 0)+1
        create = re.fullmatch(r'CREATE TABLE\s+`?(\w+)`?\s*\(([\s\S]*)\)', statement, re.I)
        if create:
            name, body = create.groups(); cols, constraints = [], []
            for part in comma_parts(body):
                column = re.fullmatch(r'`?(\w+)`?\s+(int(?:\(\d+\))?|tinyint\(\d+\)|float|decimal\(\d+,\d+\)|varchar\(\d+\)|longtext|longblob|datetime|date)([\s\S]*)', part, re.I)
                if column:
                    col, original, suffix = column.groups(); base = original.lower().split('(')[0]
                    mapped = 'INT' if base in ('int','tinyint') else 'REAL' if base in ('float','decimal') else 'BLOB' if base == 'longblob' else 'TEXT'
                    if 'AUTO_INCREMENT' in suffix.upper(): changes.append(f'{name}.{col}: AUTO_INCREMENT rimosso; ID espliciti preservati, laboratorio in sola lettura.')
                    suffix = re.sub(r'\bAUTO_INCREMENT\b', '', suffix, flags=re.I)
                    if not re.fullmatch(r"\s*(?:NOT NULL|DEFAULT NULL|DEFAULT '[0-9.]+'|\s)*", suffix, re.I): raise ValueError(f'Suffisso inatteso: {part}')
                    cols.append(dict(name=col, originalType=original, type=mapped, suffix=suffix.strip()))
                elif re.fullmatch(r'(?:CONSTRAINT \w+ )?PRIMARY KEY\s*\([^)]*\)', part, re.I): constraints.append(part)
                elif re.fullmatch(r'UNIQUE KEY `\w+` \([^)]*\)', part, re.I): constraints.append(re.sub(r'UNIQUE KEY `\w+`', 'UNIQUE', part, flags=re.I))
                elif re.fullmatch(r'KEY `\w+` \([^)]*\)', part, re.I):
                    match = re.fullmatch(r'KEY `(\w+)` (\([^)]*\))', part, re.I)
                    indexes.append(f'CREATE INDEX "{name}_{match[1]}" ON "{name}" {match[2]};')
                else: raise ValueError(f'DDL non riconosciuto: {part}')
            if name in tables: raise ValueError('Tabella duplicata')
            tables[name] = dict(name=name, columns=cols, constraints=constraints, rows=[])
        elif statement.upper().startswith('INSERT INTO'):
            match = re.fullmatch(r'INSERT INTO\s+`?(\w+)`?\s*VALUES\s*([\s\S]*)', statement, re.I)
            if not match or match[1] not in tables: raise ValueError('INSERT non riconosciuto')
            name = match[1]
            for group in comma_parts(match[2]):
                if not group.startswith('(') or not group.endswith(')'): raise ValueError('Riga non riconosciuta')
                row = [literal(v) for v in comma_parts(group[1:-1])]
                if len(row) != len(tables[name]['columns']): raise ValueError('Conteggio colonne diverso')
                normalized = []
                for col, value in zip(tables[name]['columns'], row):
                    if value is not None:
                        if col['type'] == 'INT': value = int(value)
                        elif col['type'] == 'REAL': value = float(value)
                        elif col['type'] == 'TEXT': value = str(value)
                        elif not isinstance(value, bytes): raise ValueError('BLOB non binario')
                        if dataset == 'sailors' and col['originalType'].lower() == 'date':
                            y,m,d = [int(v) for v in value.split('-')]; iso = date(y,m,d).isoformat()
                            if value != iso: changes.append(f'{name}.{col["name"]}: {value} → {iso} (normalizzazione ISO, stessa data).')
                            value = iso
                    normalized.append(value)
                tables[name]['rows'].append(normalized)
        elif re.fullmatch(r'DROP TABLE IF EXISTS `\w+`', statement, re.I): changes.append(statement+' ignorato: conversione in database nuovo.')
        elif statement.upper() == 'SET FOREIGN_KEY_CHECKS=0': changes.append('SET FOREIGN_KEY_CHECKS=0 non eseguito: il dump non dichiara FK.')
        elif re.fullmatch(r'alter table \w+\s+add constraint \w+ foreign key \(\w+\)\s+references \w+ \(\w+\)', statement, re.I): alterations.append(statement)
        else: raise ValueError(f'Comando non supportato: {statement[:120]}')
    if alterations:
        for statement in alterations:
            m = re.fullmatch(r'alter table (\w+)\s+add (constraint \w+ foreign key \(\w+\)\s+references \w+ \(\w+\))', statement, re.I)
            tables[m[1]]['constraints'].append(m[2]); changes.append('FK Sailors spostata da ALTER TABLE a CREATE TABLE.')
    schema = []
    for name, table in tables.items():
        primary = next(c for c in table['constraints'] if 'PRIMARY KEY' in c.upper())
        pk = re.findall(r'`?(\w+)`?', primary[primary.index('(')+1:primary.index(')')])
        for col in table['columns']:
            if col['name'] in pk and 'NOT NULL' not in col['suffix'].upper(): col['suffix'] = ('NOT NULL '+col['suffix']).strip()
        ddl = f'CREATE TABLE "{name}" (\n'+',\n'.join(f'  "{c["name"]}" {c["type"]} {c["suffix"]}'.rstrip() for c in table['columns'])+',\n'+',\n'.join('  '+c for c in table['constraints'])+'\n);'
        table['ddl'] = ddl; schema.append(ddl)
    schema_sql = '\n\n'.join(schema+indexes)+'\n'
    # Parent tables first for Sailors; NorthWind has no declared FKs.
    order = ['Sailors','Boats','Reserves'] if dataset == 'sailors' else list(tables)
    for name in order:
        for row in tables[name]['rows']: seed.append(f'INSERT INTO "{name}" VALUES ('+', '.join(sql_literal(v) for v in row)+');')
    seed_sql = '\n'.join(seed)+'\n'
    db = sqlite3.connect(':memory:'); db.execute('PRAGMA foreign_keys=ON'); db.executescript(schema_sql+seed_sql)
    checks = {}; binary = []; catalog_tables = []
    for name, table in tables.items():
        actual = db.execute(f'SELECT * FROM "{name}"').fetchall()
        if actual != [tuple(row) for row in table['rows']]: raise ValueError(f'Dati non fedeli: {name}')
        for index, row in enumerate(table['rows']):
            for col, value in zip(table['columns'], row):
                if isinstance(value,bytes): binary.append(dict(table=name,row=index+1,column=col['name'],bytes=len(value),sha256=hashlib.sha256(value).hexdigest()))
        info = db.execute(f'PRAGMA table_info("{name}")').fetchall()
        fks = db.execute(f'PRAGMA foreign_key_list("{name}")').fetchall()
        catalog_tables.append(dict(name=name,rowCount=len(actual),columns=[dict(name=c[1],type=c[2],notNull=bool(c[3]),primaryKey=bool(c[5])) for c in info],foreignKeys=[dict(table=f[2],column=f[3],targetColumn=f[4]) for f in fks],ddl=table['ddl']))
        checks[name] = dict(rows=len(actual),columns=len(info),everyValueCompared=True)
    fk_errors = db.execute('PRAGMA foreign_key_check').fetchall()
    if fk_errors: raise ValueError(f'FK non valide: {fk_errors}')
    if db.execute('PRAGMA integrity_check').fetchone()[0] != 'ok': raise ValueError('Integrità SQLite fallita')
    links = []
    if dataset == 'northwind':
        for child,col,parent,pk in [('orders','CustomerID','customers','CustomerID'),('orders','EmployeeID','employees','EmployeeID'),('orders','ShipVia','shippers','ShipperID'),('order_details','OrderID','orders','OrderID'),('order_details','ProductID','products','ProductID'),('products','CategoryID','categories','CategoryID'),('products','SupplierID','suppliers','SupplierID'),('employees','ReportsTo','employees','EmployeeID')]:
            missing = db.execute(f'SELECT count(*) FROM {child} c LEFT JOIN {parent} p ON c.{col}=p.{pk} WHERE c.{col} IS NOT NULL AND p.{pk} IS NULL').fetchone()[0]
            links.append(dict(child=child,column=col,parent=parent,targetColumn=pk,missing=missing,declaredInOriginal=False))
    folder = OUT/dataset;folder.mkdir(parents=True,exist_ok=True)
    (folder/'schema.sql').write_text(schema_sql,encoding='utf-8'); (folder/'seed.sql').write_text(seed_sql,encoding='utf-8')
    catalog = dict(id=dataset,title='Sailors' if dataset=='sailors' else 'NorthWind',dialect='sqlite',source=filename,sourceSha256=hashlib.sha256(raw).hexdigest(),tables=catalog_tables)
    (folder/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    report = dict(id=dataset,converterVersion=1,source=filename,sourceSha256=catalog['sourceSha256'],sourceStatements=len(statements),commands=command_counts,tables=checks,binaryValues=binary,binaryValuesSkipped=0,rowsSkipped=0,columnsSkipped=0,changes=changes,integrityCheck='ok',foreignKeyCheck=fk_errors,inferredLinkChecks=links,limitations=['Tipi SQLite con affinità; VARCHAR(n) non limita la lunghezza.','DECIMAL e FLOAT convertiti in REAL: nessuna garanzia decimale esatta.','Date/datetime memorizzate come testo; nessuna semantica MySQL completa.','AUTO_INCREMENT non replicato: query utente solo in lettura.','Collation SQLite non replica automaticamente quella MySQL.'])
    (folder/'conversion-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(dataset, json.dumps(checks), 'BLOB:', len(binary), 'missing inferred links:', sum(l['missing'] for l in links))
    db.close()
    return report

if __name__ == '__main__':
    convert('sailors','Schema per generare DB Sailors.txt')
    convert('northwind','Schema per generare DB NorthWind.txt')

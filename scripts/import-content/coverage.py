"""Matrice editoriale riproducibile dal catalogo; non certifica correttezza umana."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
COURSE = ROOT / 'content/courses/basi-di-dati'

def build():
    manifest = json.loads((COURSE / 'manifest.json').read_text(encoding='utf-8'))
    rows = []
    for lesson in manifest['lessons']:
        quiz = json.loads((COURSE / lesson['quizPath']).read_text(encoding='utf-8'))
        exercises = []
        for e in manifest['exercises']:
            if e['type'] == 'sql' and e['id'].startswith('academy-'):
                local = json.loads((COURSE / 'exercises' / f'{e["id"]}.json').read_text(encoding='utf-8'))
                match = lesson['id'] in local['lessonIds']
            else:
                # Candidate correspondence by actual cited pages, not a claim that
                # every exercise covers all concepts of a lesson.
                match = any(a['sourceId'] == b['sourceId'] and a.get('pageStart', 0) <= b.get('pageEnd', 0)
                            and b.get('pageStart', 0) <= a.get('pageEnd', 0)
                            for a in lesson['sourceRefs'] for b in e['sourceRefs'])
                if e['type'] == 'sql' and e['id'].startswith('sailors-'):
                    match = lesson['id'] in ['sql-aggregati', 'sql-gruppi', 'sql-join']
            if match:
                exercises.append({'id': e['id'], 'gradingMode': e['gradingMode']})
        rows.append({'lessonId': lesson['id'], 'title': lesson['title'], 'topics': lesson['concepts'],
                     'sourceRefs': lesson['sourceRefs'], 'version': lesson['version'],
                     'quizPath': lesson['quizPath'], 'questionIds': [q['id'] for q in quiz['questions']],
                     'exercises': exercises, 'status': lesson['status']})
    return {'manifestVersion': manifest['version'], 'status': 'needs-review', 'lessons': rows,
            'gaps': [
                'ANY/ALL: teoria e quiz; sintassi non supportata nel laboratorio SQLite.',
                'DDL, modifiche e amministrazione: attività ragionate, nessuna esecuzione nel lab di sola lettura.',
                'JDBC/Python/installazioni: spiegazioni e quiz, nessuna esecuzione o installazione esterna verificata.',
                'Outer join algebra, aggregazioni/outer union algebra: teoria o cenni; evaluator non esteso.',
                'Aggregazione ER: spiegazione e attività guidata, costrutto non editabile.',
                'Presentazione del corso: metadati, non percorso autonomo; nessuna prova ufficiale di esame disponibile.',
                'Book.pdf: escluso da estrazione e indice, non dichiarato coperto.',
                'Normalizzazione, indici fisici e algoritmi transazionali: richiami, non un corso completo nelle fonti analizzate.',
                '48 nuovi quiz di richiamo/applicazione; difficoltà non calibrate e nessuna misura certificata di padronanza.',
            ]}

def main():
    report = build()
    (ROOT / 'docs/CONTENT_COVERAGE.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    lines = ['# Matrice di copertura — Sprint 6', '',
             'Copertura editoriale **needs-review**, non approvazione umana né programma ufficiale di esame. Pagine PDF fisiche.',
             'Gli abbinamenti di attività precedenti sono candidati per sovrapposizione delle pagine; i nuovi SQL hanno collegamenti espliciti.',
             'Gli esercizi guidati non hanno un verdetto semantico automatico. Le attività aperte nel testo integrano i link di Practice.', '',
             '| Argomento | Fonte e pagine | Lezione/versione | Quiz | Esercizi | Revisione |',
             '|---|---|---|---|---|---|']
    for row in report['lessons']:
        refs = '; '.join(f'{x["file"]} {x.get("pageStart", "")}–{x.get("pageEnd", "")}' for x in row['sourceRefs'])
        exercises = ', '.join(f'{e["id"]} ({e["gradingMode"]})' for e in row['exercises']) or 'Attività ragionata nel testo; nessun esercizio Practice collegato'
        lines.append(f'| {", ".join(row["topics"])} | {refs} | {row["lessonId"]} v{row["version"]} | 3 · {row["quizPath"]} | {exercises} | {row["status"]} |')
    lines += ['', '## Limiti e lacune dichiarati', ''] + [f'- {gap}' for gap in report['gaps']]
    lines += ['', 'Rigenerazione: `python scripts/import-content/coverage.py`. Dettagli per fonte in `SOURCE_REVIEW_SPRINT6.md`; revisione precedente in `CONTENT_REVIEW_SPRINT6.json`.']
    (ROOT / 'docs/CONTENT_COVERAGE.md').write_text('\n'.join(lines)+'\n', encoding='utf-8')
    print(f'Copertura: {len(report["lessons"])} lezioni, {sum(len(l["questionIds"]) for l in report["lessons"])} domande.')

if __name__ == '__main__':
    main()

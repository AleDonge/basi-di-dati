# Database Academy

Piattaforma personale locale per Basi di Dati UNITN 2026/27, in italiano.
**Milestone corrente: Sprint 6 — qualità didattica. App 0.7.0, manifest v6.**
Nessun account, cloud, telemetria o servizio AI durante l'uso.

## Avvio

Richiede Node.js 22.12+ e npm. Installazione iniziale:

```powershell
npm ci
npm run dev
```

Aprire **http://127.0.0.1:3000**. Per uso quotidiano:

```powershell
npm run build
npm start
```

Il server ascolta soltanto sul loopback. Dopo installazione e build si studia
senza Internet mantenendo il server locale acceso. Nessuna PWA senza server,
CDN, font remoto o variabile d'ambiente necessaria. La telemetria CLI Next è
disattivata dal wrapper dei comandi npm.

## Contenuti disponibili

| Modulo | Lezioni | Domande quiz | Esercizi Practice |
|---|---:|---:|---|
| Introduzione | 4 | 12 | Quiz e attività nel testo |
| Modello relazionale | 5 | 15 | Quiz e attività nel testo |
| Algebra | 9 | 27 | 18 automatici su fixture, 7 guidati |
| SQL | 12 | 36 | 5 ufficiali Sailors + 18 originali Sailors/NorthWind |
| ER | 8 | 24 | 7 guidati, validazione strutturale |
| Strumenti | 4 | 12 | Attività ragionate su ambiente, script, JDBC/Python |
| **Totale** | **42** | **126** | **55** |

Tutti i contenuti restano **needs-review**, zero verified. Gli originali sono
immutati. Lezioni Markdown e quiz JSON sono separati dai componenti e validati
con Zod. Il renderer non esegue HTML/JSX/JavaScript e non carica immagini remote.
Otto PDF studiati sono consultabili tramite allowlist locale; Book.pdf è escluso
da estrazione, servizio e ricerca. Nessuna prova ufficiale di esame disponibile.

Il percorso SQL tratta contratto, SELECT/alias/DISTINCT/ordine, filtri/NULL,
aggregazioni, GROUP BY/HAVING, sottoquery, ANY/ALL, insiemi, CTE/viste, join,
outer/anti join e DDL. Quattro lezioni distinguono server/client, importazione,
JDBC e Python. Tabelle, casi limite, attività guidate e quiz accompagnano i temi.
Riferimenti, ambiguità e copertura: `docs/SOURCE_REVIEW_SPRINT6.md`,
`docs/CONTENT_COVERAGE.md`, `docs/CONTENT_REVIEW_SPRINT6.json`.

## Studio, versioni e backup

Learn offre indice, fonti, navigazione e completamento della lettura indipendente
dal quiz. IndexedDB **v5** conserva letture per versione, quiz, tentativi SQL/algebra,
cronologia SQL, revisioni ER, simulazioni e piani. Aggiungere contenuti non cancella
progressi. Una lezione aggiornata richiede una nuova lettura per la versione
corrente; il completamento precedente resta esportabile e non viene riscritto.

Usare sempre stessa origine, porta e profilo browser. Impostazioni permette
backup JSON massimo **5 MB**, con validazione strict, anteprima e conferma prima
della fusione. Conflitti di ID bloccano l'importazione senza sovrascrivere.
I formati v1–v4 vengono migrati conservativamente a v5. Lo Sprint 6 non cambia il
formato dati: non è necessaria una migrazione strutturale.

Conservare anche la cartella del progetto e **content/exam/archives/**: il backup
progressi non contiene PDF, dataset o archivi delle soluzioni. Non cancellare i
dati personali per verificare il ripristino: usare un profilo di test separato.

## Laboratori

`/sql-lab`: Monaco locale o textarea accessibile; Sailors e NorthWind, esploratore,
DDL convertito, anteprime, risultati, errori, interruzione/reset e cronologia.
SQLite WASM 3.54.1 in worker isolato; una SELECT o WITH di lettura, database effimero
nuovo per query, nessun accesso ai progressi o alla rete dal worker. Limiti: 1,5 s,
500 righe, 64 colonne e budget di memoria/istruzioni dichiarati. Nessuna promessa
di sicurezza assoluta o equivalenza MySQL/MariaDB. Tab esce da Monaco;
Ctrl/⌘+Invio esegue.

Sailors: 10/4/10 righe; NorthWind: 8 tabelle, 3202 record, 77 colonne, 9 foto BLOB.
Nessuna riga ufficiale aggiunta o scartata. Le fixture sintetiche sono separate.
I 5 ufficiali rimangono identici; i 18 originali hanno contratti, suggerimenti,
soluzioni needs-review e quattro fixture ciascuno. L'ordine è verificato dove
richiesto. Uguaglianza su fixture finite non prova equivalenza generale.
ANY/ALL, DDL, modifiche, amministrazione e programmi Java/Python non sono
eseguibili in questo editor. Dettagli: `docs/SQL_LAB.md`.

`/algebra-lab`: parser/AST dedicato, semantica insiemistica, σ, π, ρ, ×, ∪, −, ∩,
join naturale/theta e ÷. Albero e risultati intermedi calcolati. Nessun NULL,
outer join o aggregato nell'evaluator. Subset e precedenza documentati in
`docs/ALGEBRA_LAB.md`; correzione finita prudente, attività ambigue guidate.

`/er-lab`: SVG locale nella notazione del corso, modello semantico Zod distinto
da layout e metadati. Entità, attributi semplici, identificatori, associazioni,
cardinalità, deboli e ISA; undo/redo, JSON, proprietà accessibili e versioni.
**Salvare con “Salva versione ER” prima di cambiare pagina.** Aggregazione e
attributi composti non editabili. Una validazione strutturale non dimostra
correttezza semantica. Dettagli: `docs/ER_LAB.md`.

## Exam Prep, ricerca e piano

`/exam-prep` usa **181 attività**: 126 quiz, 23 SQL, 25 algebra e 7 ER. Seed e quote
producono piani riproducibili senza duplicati; carenze esplicite. Allenamento con
feedback dopo la risposta, simulazione con feedback alla conclusione; timer
opzionale persistente. Quiz non classificati per difficoltà; quattro nuovi SQL
base, difficoltà degli esercizi editoriali non calibrate sull'esame.

Esiti distinti: corretto/errato, coerente/non coerente sulle fixture, manuale,
inconclusivo e senza risposta. Nessun voto semantico ER o certificato di equivalenza.
Le sessioni conservano snapshot e archivi immutabili, comprese domande v1 degli
sprint precedenti. Aggiornare il catalogo non riscrive simulazioni concluse.

Dashboard e ripasso usano regole locali motivate, distinguendo tentativi e attività
uniche. La lettura non prova padronanza. Ricerca a `/search` tra contenuti redatti,
argomenti, esercizi e metadati delle fonti, senza libro o soluzioni. Piano modificabile
con data personale, giorni, minuti e priorità; stime dichiarate, nessun appello inventato.
Contratti: `docs/EXAM_PREP.md`.

## Verifiche e manutenzione

```powershell
npm run lint
npm run typecheck
npm test
npm run test:sql-import
npm run build
npm run test:e2e
```

Installare Chromium con `npx playwright install chromium` se manca. Playwright
avvia la build di produzione; fermare un vecchio server sulla porta 3000 prima
 dei test. Desktop e mobile sono Chromium/emulazione, non Safari o telefono fisico.
Risultati effettivi e limiti in `docs/IMPLEMENTATION_LOG.md`;
procedura manuale in `docs/SPRINT6_ACCEPTANCE.md`.

`npm run sql:convert` rigenera dati e rapporti senza modificare originali;
`npm run algebra:datasets` rigenera i dataset algebra. `npm run exam:catalog`
(predev/prebuild) conserva ogni archivio precedente. `python scripts/import-content/coverage.py`
rigenera la matrice editoriale. Inventario opzionale: `npm run inventory` richiede
pypdf e non estrae il libro. Nuovi contenuti: `docs/HOW_TO_ADD_MATERIAL.md` e
`docs/HOW_TO_ADD_LESSONS.md`; mantenere ID, incrementare versioni e revisionare i diff.

**Fermo dopo lo Sprint 6. Nessun ulteriore sprint avviato.**

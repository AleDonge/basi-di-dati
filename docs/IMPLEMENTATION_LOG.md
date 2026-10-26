# Registro di implementazione

## Manutenzione Git — 26 ottobre 2026

Esclusa `/source-material/` in `.gitignore`: tutti i 13 originali presenti
(10 PDF, incluso Book.pdf, e 3 TXT) devono restare locali. Nessun originale
modificato o cancellato; nessuna modifica all'indice Git, push o riscrittura
della cronologia. I file già tracciati richiedono `git rm -r --cached -- source-material`
e un commit/push per sparire dalla versione corrente remota: restano nella
cronologia precedente. Repository privata e sito Vercel pubblico hanno visibilità
indipendente. Il deploy senza originali richiede un successivo adeguamento della
route `/sources/[id]`, che attualmente legge i PDF locali.

Verifiche: regola confermata con `git check-ignore --no-index`; lint e typecheck
superati, 531 test superati in 14 file, build superata (112 pagine).
Nessun nuovo sprint o modifica ai progressi/contenuti.

**Stato corrente: M5 / Sprint 5 implementato. Nessun ulteriore sprint iniziato.**
Le sezioni precedenti sono mantenute come storico; per le funzioni attuali vedere
la sezione Sprint 5 in fondo e README.md.

## 24 ottobre 2026 · M0 / Sprint 0 — Fondazioni

### Obiettivo e perimetro
Applicazione avviabile con dashboard derivata dal manifest, shell e navigazione.
Sprint 1 non avviato. Non sono presenti lezioni, tentativi o esercizi automatici;
nessun contenuto didattico è stato inventato o promosso a verificato.

### Ispezione iniziale
Letti integralmente PROJECT_SPEC.md, AGENTS.md, CONTENT_INVENTORY.md e ROADMAP.md.
La cartella conteneva solo sei documenti di progetto e source-material, senza
applicazione, package.json o repository Git inizializzato.

Presenti realmente 13 materiali:

| File | Riscontro |
|---|---|
| Basi_di_dati_DISI 2026-27.pdf | 15 pagine |
| Argomento01 Basi di Dati e loro utenti.pdf | 23 pagine |
| Argomento02 Modello Relazionale.pdf | 37 pagine |
| Argomento03 Algebra Relazionale.pdf | 48 pagine |
| Argomento03.1 Algebra Relazionale Autoverifica.pdf | 10 pagine |
| Argomento04 SQL.pdf | 91 pagine |
| Argomento05 Entity Relationship.pdf | 71 pagine |
| Introduzione MySQL e Dbeaver.pdf | 92 pagine |
| esercitazione_AR.pdf | 1 pagina, immagine controllata visivamente |
| Book.pdf | 1098 pagine; solo metadati, nessuna estrazione |
| Schema per generare DB Sailors.txt | 62 righe, letto integralmente |
| Schema per generare DB NorthWind.txt | 3410 righe, intestazione e DDL campione ispezionati |
| Esercizi 1 Sailor.txt | 34 righe, letto integralmente |

Tutti i PDF, salvo il libro, sono stati controllati tramite testo campione della
prima pagina. Non si tratta di revisione completa delle dispense. La pagina
scansionata è stata renderizzata con Poppler e letta visivamente, senza pubblicare
una trascrizione. Nome reale diverso dall'inventario: esercitazione_AR.pdf invece
di esercitazione_AR(1).pdf. Nessuna fonte mancante, rinominata o modificata.
Dimensioni, SHA-256 e campioni in source-audit.json; checksum ricontrollati nei test.

### Implementazione
- Next.js 16.4.3 App Router, React 19.3.1, TypeScript strict, Tailwind 4.3.3.
- Configurazione shadcn/ui e primitiva Button con Radix Slot/CVA, sorgente nel progetto.
- Tema scuro, font di sistema, layout desktop/mobile, skip link, focus visibile,
  navigazione semantica e tastiera, schermate di caricamento, errore e pagina assente.
- Dashboard con conteggi derivati: 13 fonti, sei moduli in bozza, zero lezioni.
- Learn con moduli espandibili e relativa provenienza; pagina inventario con
  dimensioni, pagine/righe, note, ID e checksum.
- Practice, SQL Lab e Algebra Lab con stato esplicito di preparazione;
  impostazioni con limiti di persistenza e offline descritti senza controlli fittizi.
- Manifest JSON v1, schemi Zod strict, validazione dei riferimenti, pagine,
  duplicati e disponibilità; predisposizione lezioni, esercizi e dataset.
- Schemi di tentativi e progressi versionati; contratti separati di SQL, algebra
  e grading. Nessun engine, parser, correzione o persistenza implementato.
- Script Python opzionale per inventario ripetibile, distinto dal manifest:
  non aggiorna contenuti approvati e non estrae il libro.
- README e changelog. Originali fuori da public e dalle route di download.
- Server vincolato a 127.0.0.1, telemetria CLI Next disattivata dai comandi npm;
  nessun account, analytics, font remoto, chiamata AI o servizio cloud.

### Verifiche
- `npm run lint`: superato, zero errori o warning ESLint.
- `npm run typecheck`: superato, inclusa generazione tipi route.
- `npm test`: 19 test superati (catalogo, 13 checksum, casi invalidi e progressi).
- `npm run build`: superato, pagine prerenderizzate.
- `npm run test:e2e`: quattro test Playwright superati, Chromium desktop e mobile.
  Redirect iniziale, moduli, 13 fonti, tutte le sezioni, impostazioni, pagina
  assente, skip link con tastiera; nessun errore JavaScript e nessuna richiesta
  esterna rilevata durante la navigazione. Verifica assenza overflow orizzontale.
- Screenshot desktop/mobile in `docs/screenshots/`, controllati visivamente.
  Corretto il contrasto del pulsante principale emerso dal controllo visivo.
- `npm install`: audit dipendenze senza vulnerabilità segnalate al momento
  dell'installazione. Lockfile incluso.

Vitest 5 non supportava Node 25 presente nell'ambiente: adottato Vitest 4.1.12
compatibile. Root Turbopack impostata esplicitamente per evitare l'inclusione di
lockfile esterni alla cartella. Il runner Playwright può emettere l'avviso di
ambiente NO_COLOR/FORCE_COLOR: non influisce sull'app o sul risultato dei test.

### Avvio
```powershell
npm ci
npm run dev
```
Aprire http://127.0.0.1:3000. Per produzione locale: `npm run build`, poi
`npm start`. Per i test browser: installare Chromium con
`npx playwright install chromium`, fare build e avviare `npm run test:e2e`.

### Limiti e gate successivo
- Dopo installazione/build, funziona senza Internet mantenendo il server locale
  attivo. Nessuna PWA o cache per avvio senza server.
- IndexedDB, esportazione/importazione, Markdown/MDX renderer, KaTeX e prime
  lezioni sono Sprint 1. Sono predisposti schemi/cartelle, non funzioni già utilizzabili.
- Monaco, SQLite WASM, worker terminabile, timeout e fixture multiple: Sprint 2.
  SQLite ha compatibilità parziale con MySQL/MariaDB; nessun dump eseguito in M0.
- Subset algebra solo pianificato; non esiste ancora grammatica eseguibile.
  Confronti futuri su fixture non proveranno equivalenza generale.
- NorthWind non convertito; nessuna affermazione di compatibilità o conteggi DB validati.
- Tutte le fonti didattiche restano needs-review; lezioni verified richiederanno
  revisione umana con citazioni puntuali. Nessuna deduzione sull'esame.
- Nessuna regressione di progressi possibile: il progetto iniziale non ne aveva
  e M0 non ne crea. Conservazione/migrazioni da verificare nello Sprint 1.

**Fermo allo Sprint 0. Per lo Sprint 1 occorre il via libera del proprietario.**

## 24 ottobre 2026 · M1 / Sprint 1 — Lettura e progressi

### Perimetro e fonti

Riletti integralmente specifica, istruzioni, inventario e roadmap. Confermati i
13 materiali dello Sprint 0. Analizzati integralmente i 23 fogli di Argomento01
e i 37 di Argomento02, mediante testo estratto e controllo visivo delle 60 pagine.
Diagrammi, tabelle e frammenti SQL in immagine sono stati verificati anche
visivamente. Nessuna pagina dei due PDF è risultata illeggibile. Le fonti sono
invariate: tutti i 13 checksum passano i test. Gli altri materiali, incluso il
libro, non sono stati estratti per creare questi contenuti.

Il report `docs/SOURCE_REVIEW_SPRINT1.md` registra copertura di tutte le pagine e
ambiguità, incluse cardinalità, indici nella definizione del prodotto, CASCADE,
SET DEFAULT e l'ultimo esempio SQL. Le precisazioni aggiunte non vengono
attribuite al docente come citazioni testuali. I numeri usati sono pagine PDF,
che possono differire dai numeri stampati nelle slide.

### Lezioni create

| ID stabile | Titolo | Fonte e pagine PDF |
|---|---|---|
| dbms-dati | Dati, DBMS e sistemi di basi di dati | Argomento01, 1–7 |
| astrazione-indipendenza | Astrazione e indipendenza dei dati | Argomento01, 8–13 |
| transazioni-analisi | Concorrenza, recupero, OLTP e OLAP | Argomento01, 14–18; richiamo 6–7 |
| utenti-scelte | Utenti, responsabilità e scelta di un DBMS | Argomento01, 19–23 |
| relazioni-domini | Domini, tuple e relazioni | Argomento02, 1–7 |
| schema-istanza | Schema, istanza, grado e cardinalità | Argomento02, 8–13 |
| chiavi-vincoli | Chiavi e integrità delle entità | Argomento02, 12 e 14–19 |
| integrita-riferimenti | Integrità referenziale e schema della base di dati | Argomento02, 20–27 |
| aggiornamenti-integrita | Aggiornamenti e conservazione dell’integrità | Argomento02, 28–37 |

Circa 7200 parole complessive di spiegazione, in unità di circa 740–1020 parole,
oltre agli obiettivi e ai quiz. Definizioni, intuizioni, scenari, applicazioni,
tabelle, diagrammi, errori comuni, attività aperte e riepiloghi; codice SQL
soltanto illustrativo e non eseguito. Provenienza esplicita e riferimenti puntuali.

Tutte le lezioni e i 27 quesiti sono v1 **needs-review**. Nessun verified.
Per richiesta del proprietario sono leggibili come anteprime personali, senza
confonderle con contenuti approvati. I moduli restano draft finché non esisterà
una lezione verified. Nessuna dichiarazione su cosa sia oggetto d'esame.

### Funzioni implementate

- Lettore Markdown con frontmatter JSON validato e coincidente con il manifest.
  Contenuti separati dai componenti, senza esecuzione di MDX/JSX/HTML.
- Tabelle GFM, formule KaTeX, codice SQL/testo, diagrammi a caselle e frecce,
  citazioni/callout e collegamenti locali. Immagini remote escluse, URL limitati
  a percorsi locali e ancore. Font e formule serviti dall'app, senza CDN.
- Navigazione per modulo e lezione, indice desktop/compatto, obiettivi,
  prerequisiti, argomenti correlati e navigazione precedente/successiva.
- Dashboard con completamenti per modulo, ultima visita e collegamento Continua.
  Catalogo Learn con stato delle letture e ultimi risultati delle domande.
- IndexedDB v2 con registrazioni per lessonId/lessonVersion, visite e date di
  completamento. Migrazione non distruttiva dal formato database v1: conserva
  lo store originario e copia le registrazioni nel nuovo store per versioni.
- Tentativi quiz append-only, con ID univoco, versione lezione/quiz/domanda,
  opzioni scelte, risultato, spiegazione e timestamp. Completare/annullare una
  lettura non aggiunge o cancella risultati quiz. Crescita del catalogo senza reset.
- Sincronizzazione dei riepiloghi fra schede mediante BroadcastChannel e al focus.
  Errori di storage visibili, nessuna finta conferma se il salvataggio fallisce;
  timeout per apertura archivio bloccata.
- 27 domande aggiuntive: nove a selezione singola, nove vero/falso e nove a
  selezione multipla. Grading deterministico per insiemi di ID, senza AI o
  confronto testuale libero. Opzioni errate, mancanti, extra e duplicate testate.
- La route locale /api/quiz riceve e valida le risposte; risposte attese e
  spiegazioni non vengono inviate con la lezione prima del tentativo.
- Esportazione JSON v2; import v1/v2 con Zod strict, limite 5 MB, anteprima,
  annullamento e conferma esplicita. Fusione in un'unica transazione, mai
  cancellazione completa: deduplica tentativi identici, blocca ID in conflitto,
  conserva completamenti, visita più recente, vecchie versioni e ID fuori catalogo.
- PDF originali consultabili in locale tramite allowlist di due ID e ancore di
  pagina; libro e percorsi arbitrari non accessibili dalla route.

### File principali

- `content/courses/basi-di-dati/manifest.json`, `lessons/*.md`, `quizzes/*.json`:
  catalogo v2, nove lezioni e 27 domande; nessuna lezione hardcoded nei componenti.
- `lib/content/{schemas,quiz-schema,markdown,lessons}.ts`: contratti, frontmatter,
  parsing sicuro, caricamento e validazione.
- `app/learn/[slug]/page.tsx`, `components/lesson/*`: lettore, indice, controlli,
  navigazione, catalogo e quiz.
- `lib/grading/quiz.ts`, `app/api/quiz/route.ts`: correzione e validazione locali.
- `lib/progress/{schemas,db,merge,selectors}.ts`: schema, IndexedDB, migrazione,
  fusione e riepiloghi. `components/progress-provider.tsx`: integrazione React.
- `components/progress-backup.tsx`, `app/settings/page.tsx`: export/import e consenso.
- `app/dashboard/page.tsx`, `components/study-overview.tsx`, `components/shell.tsx`,
  `app/globals.css`: progressi e adattamento del tema responsive.
- `app/sources/[id]/route.ts`: accesso controllato ai due PDF locali.
- `tests/unit/{content,lessons,progress}.test.ts`, `tests/e2e/learning.spec.ts`:
  verifiche dei contratti, contenuti, correzione e flussi reali.
- README, inventario, changelog, registro import, rapporto fonti, guida contenuti
  e verifica manuale aggiornati. Nessun documento originale modificato.

### Test e risultati finali

| Comando | Risultato |
|---|---|
| npm run lint | Superato, zero errori o warning ESLint |
| npm run typecheck | Superato, TypeScript strict e tipi route |
| npm test | 68 test superati, tre file |
| npm run build | Superato, nove lezioni prerenderizzate e route locali |
| npm run test:e2e | 12 test superati, Chromium desktop e mobile |
| npm audit | Zero vulnerabilità segnalate |

Copertura significativa:
- Checksum di tutti i materiali, riferimenti e metadati coerenti, nove lezioni
  caricate, rendering di diagrammi e formule senza katex-error.
- Tutte le 27 domande: risposte corrette e ordine alternativo, errori tipici,
  selezioni incomplete/extra, opzioni ignote, duplicati e input vuoto.
- Persistenza e riapertura IndexedDB, migrazione reale v1→v2 e rollback con dati legacy corrotti, quiz indipendenti
  dai completamenti, scritture concorrenti e conservazione di versioni precedenti.
- Crescita del catalogo con nuova lezione: cambia il totale, non cancella dati;
  nuova versione: conserva il vecchio completamento e non completa la nuova.
- Roundtrip backup, legacy v1, JSON corrotti, versioni sconosciute, duplicati,
  limite dimensioni, fusione idempotente e rollback atomico sui conflitti.
- Confronto corretto di date ISO anche con precisione diversa dei millisecondi.
- Browser: tutte le lezioni, formule, indici, navigazione, 404, tastiera,
  tre tipi di quiz, ricaricamento, storico, dashboard/Continua, export reale del
  file e ripristino in archivio vuoto, annullamento e conferma, errori file e
  storage negato. Nessun overflow dell'intera pagina.
- Nessun errore JavaScript nei flussi controllati. Nessuna richiesta esterna
  nella lettura di tutte le lezioni e nel percorso studio/backup; quest'ultimo
  viene eseguito anche bloccando esplicitamente le origini esterne in Playwright.

Screenshot desktop/mobile controllati in `docs/screenshots/`: dashboard, lesson,
reading e backup. Nessun layout troncato osservato. Test mobile eseguiti tramite
emulazione Chromium: non sostituiscono una prova su dispositivo fisico/Safari.

### Problemi risolti e punti aperti

- Precisazioni concettuali delle slide rese esplicite, tutte ancora needs-review.
- Sistemato il confronto delle date senza dipendere dalla forma lessicografica ISO.
- KaTeX transitive precedente segnalato dall'audit: override alla versione 0.19.1,
  formule verificate; audit finale zero. Nessun downgrade forzato dei plugin.
- Selettori dei test circoscritti ai messaggi applicativi per distinguerli dal
  route announcer di Next.js. Nessun errore applicativo lasciato aperto nei flussi testati.
- Avviso NO_COLOR/FORCE_COLOR del runner di test ancora possibile, senza effetto sul risultato.
- Revisione umana dei contenuti ancora necessaria prima della promozione a verified.
- Solo due moduli coperti; ricerca full-text, risposte quiz libere e grafici
  complessi non sono implementati. Il formato attuale usa scelte finite e diagrammi lineari.
- Funzionamento senza Internet con server locale acceso; niente PWA senza server.
  Il correttore quiz usa il server Next locale, non servizi esterni.
- Backup limitato a 5 MB; origine, porta e profilo browser delimitano l'archivio.
  Conservare copie esportate prima di cancellare i dati del sito.
- Nessun SQL Playground, SQLite, Monaco, correttore SQL/algebra, tutor AI,
  autenticazione o multiutente implementato. NorthWind non convertito.

### Avvio e controllo manuale

```powershell
npm ci
npm run dev
```

Aprire http://127.0.0.1:3000/learn. Per produzione locale:
`npm run build`, poi `npm start`. Controllo completo in
`docs/SPRINT1_ACCEPTANCE.md`: lettura, quiz, completamento, ricaricamento,
dashboard, export, annullamento/import e prova in profilo separato.

Manutenzione dei nuovi contenuti in `docs/HOW_TO_ADD_LESSONS.md`. Registrazioni
di import e diff degli ID in `content/imports/sprint1-20261024.json` e changelog.
Non modificare ID o promuovere verified automaticamente durante gli aggiornamenti.

**Fermo allo Sprint 1. Sprint 2 richiede un nuovo via libera del proprietario.**

## 24 ottobre 2026 · M2 / Sprint 2 — SQL Lab

### Funzionalità e perimetro

Implementato `/sql-lab`: editor Monaco SQL locale, alternativa testuale accessibile,
scelta database, esploratore tabelle con conteggi, colonne/PK/FK e DDL, anteprima,
esecuzione in sola lettura, tabella risultati, errori distinti, stati di caricamento,
interruzione e reset worker, cronologia persistente. Tab esce da Monaco e
Ctrl/⌘+Invio esegue. Layout e tastiera verificati desktop/mobile.

Practice espone i cinque esercizi ufficiali Sailors, enunciati originali separati
dai contratti di output della piattaforma, argomenti, difficoltà, suggerimenti,
verifica e soluzione su richiesta. Soluzioni Database Academy e metadati restano
needs-review: nessuna attribuzione al docente, zero promozioni a verified.

Il proprietario ha richiesto NorthWind già nello Sprint 2: la conversione anticipa
quella parte della roadmap, senza avviare algebra, ER o altre funzioni Sprint 3.
Le nove lezioni e i 27 quiz degli sprint precedenti restano disponibili.

### Fonti effettivamente analizzate

Tutti i 13 originali presenti sono rimasti invariati (checksum nei test).
Letti integralmente schema Sailors, schema NorthWind ed Esercizi 1 Sailor.txt.
Lo scanner della conversione esamina tutte le istruzioni NorthWind e confronta
ogni valore normalizzato con il database prodotto; le nove foto sono verificate
anche tramite hash dei byte. Consultate le parti pertinenti di Argomento04 SQL
(pp. 10–30, 58–65, 72–84) e Introduzione MySQL e Dbeaver (pp. 2–3, 26, 36, 52,
54–55, 57, 60–63), con controllo visivo delle pagine e figure utilizzate.
Riferimenti, discrepanze nelle istanze delle slide e trasformazioni sono elencati
in `docs/SQL_LAB.md`. Gli script prevalgono per i dati ufficiali; nessun dato
preso dalle figure è stato aggiunto al seed ufficiale.

### Motore, isolamento e compatibilità

SQLite 3.54.1 WASM in Web Worker, adapter separato dalla UI e correttore separato
dall'engine. Parser/prepared statement SQLite, autorizzatore con allowlist,
controllo readonly e una connessione `:memory:` nuova per ogni query.
Il thread principale carica solo asset e dataset locali; il worker riceve i byte
WASM, ha CSP connect-src none e worker-src none, non dispone di IndexedDB e
interfacce di rete. Nessuna query dell'utente viene eseguita dal server Next.

Timeout interno di 1,5 s, budget istruzioni, watchdog del thread principale che
termina il worker, massimo 500 righe, 64 colonne, circa 512 KiB di valori e circa
8 KiB per cella, limite heap SQLite 64 MiB. Risultati limitati vengono segnalati;
la correzione non assegna un superamento su risultati troncati. Il limite heap
non è una quota dell'intero processo browser: non viene dichiarata sicurezza
assoluta. Limiti esatti, casi rifiutati e compatibilità in `docs/SQL_LAB.md`.

SQLite non riproduce MySQL/MariaDB: mapping dei tipi, date testuali, collazioni,
AUTO_INCREMENT e vincoli/dialetti divergenti sono dichiarati. Nessun SQL DDL/DML
arbitrario nel laboratorio; solo SELECT e WITH … SELECT autorizzate. Reset ricrea
lo stato del motore, conservando query, cronologia e progressi.

### Dataset ed esercizi

- Sailors: Sailors 10 righe, Boats 4, Reserves 10; PK, NOT NULL e due FK conservate
  dove compatibili. Una data non padded normalizzata a ISO; dati originali distinti
  dalle istanze mostrate nelle slide. Integrità verificata.
- NorthWind: 8 tabelle, 3202 righe, 77 colonne, nove foto BLOB; nessuna colonna o
  record eliminato. Dati convertiti integralmente, senza rivendicare equivalenza
  dei comportamenti MySQL. Lo script non dichiara FK: i collegamenti inferiti sono
  controllati separatamente e non presentati come vincoli ufficiali.
- Conversione riproducibile con `npm run sql:convert`, Python con sola libreria
  standard. Output schema/seed/catalogo/report per entrambi i dataset. Parser
  conservativo: istruzioni sconosciute causano errore, nessuna omissione silenziosa.
- Cinque quesiti: aggregazioni colore/rating, date prenotazioni maggiorenni,
  omonimi con differenza età, statistiche per rating, barche e media età.
- Per ogni quesito: dataset ufficiale più quattro fixture sintetiche dichiarate
  (casi limite/NULL/duplicati, ordine inserimento inverso, vuoto, variazione).
  Le interpretazioni sul peso delle prenotazioni e le colonne attese sono esplicite.

### Correttore e progressi

Utente e riferimento eseguiti separatamente su database freschi per ciascuna fixture.
Confronto di valori e molteplicità, NULL distinto da zero, testo distinto da numero,
interi esatti e tolleranza relativa 1e-9 sui non interi. Ordine ignorato per i
cinque enunciati che non lo richiedono; comparatore testato anche in modalità ordinata.
Alias liberi, posizione e numero colonne richiesti. Errori sintattici, di esecuzione,
validazione, timeout e risorse distinti; riferimento fallito produce inconclusivo.
LIMIT/OFFSET ammessi nel laboratorio ma esclusi dalla verifica di questi quesiti.

Due query alternative corrette e tre errate per esercizio nei test. Per i quesiti
2–5 una query errata coincide sull'originale ma viene distinta dalle altre fixture.
**Un numero finito di confronti non dimostra equivalenza generale**; bare columns,
collazioni o coincidenze ulteriori possono sfuggire. L'esito è “coerente sulle
fixture”, non certificazione matematica o compatibilità MySQL.

IndexedDB v3 aggiunge sqlHistory, preservando store e record delle versioni precedenti.
Tentativi salvati con SQL, esito/feedback, data e versione esercizio; completamento
locale derivato dalle verifiche superate per la versione corrente, indipendente
dalla lettura delle lezioni. Storico visualizza gli ultimi 30 senza eliminare i
precedenti. Backup v3 include SQL e importa v1/v2; anteprima, conferma e fusione
atomica senza sovrascritture mantenute. Testata migrazione reale v2 con lezione e quiz.

### File principali

- `lib/sql/{types,lex,engine,worker,client,content}.ts`: contratti, limiti, motore,
  adapter browser, validazione e caricamento contenuti.
- `lib/grading/sql.ts`: confronto multinsieme e verifica su fixture.
- `components/sql/`, `app/sql-lab/`, `app/practice/`, `app/api/sql/`: interfaccia e
  route locali per dati/riferimenti, senza esecuzione SQL sul server.
- `lib/progress/`, componenti backup/dashboard: formato e database v3, tentativi SQL.
- `scripts/import-content/convert_sql.py`, `scripts/build-sql-assets.mjs`: conversione
  e asset locali; configurazione Next/CSP e dipendenze npm aggiornate a app v0.3.0.
- `content/courses/basi-di-dati/{datasets,exercises,solutions,fixtures}/`, manifest v3,
  `content/imports/sprint2-20261024.json`, changelog e inventario aggiornati.
- `tests/unit/sql-*.test.ts`, `tests/sql_import_test.py`, `tests/e2e/sql.spec.ts`.

### Verifica finale effettivamente eseguita

| Comando | Risultato |
|---|---|
| npm run lint | Superato, nessun errore |
| npm run typecheck | Superato |
| npm test | 128 test superati in 6 file |
| npm run test:sql-import | 4 test Python superati |
| npm run build | Superata, 25 pagine generate e route locali |
| npm run test:e2e | 20 test superati, Chromium desktop e mobile |
| npm audit | Zero vulnerabilità segnalate |

Copertura: importazioni/valori/checksum, PK/FK/integrità, BLOB, conversione ripetibile;
query equivalenti, errate e accidentalmente corrette; duplicati/NULL/ordine/tipi;
input multipli/DDL/PRAGMA/ATTACH/funzioni/schema di sistema vietati; timeout reale e
chiusura worker, recupero/reset, limiti righe/colonne/testo/BLOB; isolamento dei
progressi, migrazioni, persistenza, roundtrip backup e rollback sui conflitti.
I test browser includono i flussi Sprint 1, tastiera Monaco e Tab, tutti e cinque
gli esercizi, import/export reale e conservazione di una lezione già completata.
Nessuna richiesta esterna né errore JavaScript nei flussi monitorati. Questo
risultato riguarda i flussi eseguiti, non una prova formale di assenza universale.

Screenshot `sql-lab`, `sql-exercise`, `sql-editor` desktop/mobile in
`docs/screenshots/`, controllati visivamente. Mobile emulato in Chromium: Safari
e dispositivi fisici non certificati. Monaco può essere sostituito con textarea.

### Problemi risolti e limiti rimasti

Risolti aggiornamenti React che potevano sovrascrivere la digitazione rapida in
Monaco, scorciatoie nelle viewport mobile, uscita Tab dall'editor, autorizzazione
COUNT(*) e recupero dopo errore iniziale. Asset generati esclusi da lint e versionamento.
Dipendenza transitiva DOMPurify fissata a 3.4.17; audit finale senza segnalazioni.
Avviso NO_COLOR/FORCE_COLOR del runner possibile, senza effetto sui test.

Restano revisione umana delle interpretazioni/soluzioni, limiti finiti del grading,
compatibilità MySQL parziale, laboratorio di sola lettura, risorse browser non
interamente contingentate, backup massimo 5 MB. Origine/profilo browser delimitano
l'archivio. Senza Internet serve ancora il server locale acceso; nessuna PWA.
Nessun problema applicativo aperto nei flussi di accettazione eseguiti.
Algebra Lab, ER, tutor AI, autenticazione, multiutente ed esame non implementati.

### Avvio e verifica manuale

```powershell
npm ci
npm run dev
```

Aprire http://127.0.0.1:3000/sql-lab. Per produzione: `npm run build`, poi `npm start`.
Predev/prebuild preparano worker e WASM locali. Per riprodurre la conversione:
`npm run sql:convert`; non modifica gli originali. Percorso completo di verifica,
query campione e backup in `docs/SPRINT2_ACCEPTANCE.md`.

**Fermo allo Sprint 2. Attendere il via libera del proprietario prima dello Sprint 3.**

## 24 ottobre 2026 · M3 / Sprint 3 — Algebra relazionale

### Obiettivo, fonti e perimetro

Implementati Algebra Lab, contenuti, esercizi e progressi seguendo le specifiche
lette integralmente all'inizio. Rilevati ancora tutti i 13 originali. Letti e
controllati visivamente tutti i 48 fogli di Argomento03, i 10 dell'Autoverifica e
la pagina scansionata esercitazione_AR.pdf. Testo, formule, diagrammi e quesiti
sono leggibili; nessun contenuto è stato ricostruito inventando parti illeggibili.
Gli originali e i loro checksum non sono modificati; Book.pdf non estratto.

Mappa pagina per pagina, grammatica, contratti e ambiguità in `docs/ALGEBRA_LAB.md`.
La skill PDF è stata utilizzata per estrazione e controllo visivo, non per cambiare
le fonti. Il nome effettivo della scansione resta quello presente, senza `(1)`.
Sprint 4, ER, tutor AI, account e multiutente non avviati.

### Nove lezioni nuove e domande

Tutte needs-review, con spiegazioni della piattaforma distinte dalle fonti,
definizioni/formule, sintassi, esempi, tabelle prima/dopo, diagrammi, errori,
riferimenti, riepilogo e autoverifica. Più di 500 parole per ciascuna lezione.

| ID stabile | Argomento | Pagine Argomento03 |
|---|---|---|
| ar-selezione | Chiusura, selezione e condizioni | 2–12 |
| ar-proiezione | Proiezione, duplicati e identità | 13–20 |
| ar-insiemi | Unione, differenza, intersezione | 21–25 |
| ar-prodotto | Prodotto e cardinalità | 26–28 |
| ar-ridenominazione | Alias, rinomina e self-join | 28–30 |
| ar-join | Theta/equijoin e naturale | 31–37 |
| ar-divisione | Copertura universale e casi vuoti | 38–39 |
| ar-estensioni | Outer join e NULL, solo teoria | 40–43 |
| ar-alberi | Composizione, query tree e ottimizzazione | 44–48 |

Aggiunte 27 domande con spiegazione, tre per lezione; totale 18 lezioni e 54
quesiti. Stato editoriale invariato per i contenuti precedenti, zero verified.
Cinque PDF sono ora consultabili tramite allowlist locale; libro sempre escluso.

### Parser, AST, evaluator e grammatica

Operatori eseguibili: σ, π, ρ, ×, ∪, −, ∩, join naturale e theta (equijoin se
il predicato contiene uguaglianze), ÷. Parser ricorsivo dedicato, AST tipizzato,
evaluator insiemistico deterministico, nessuna AI/eval/traduzione SQL.
Grammatica documentata con header `{…}` o `[…]`, forma compatta richiesta,
alias ASCII, confronti, AND/OR/NOT, qualificatori e parentesi. Precedenza:
unari, ×/⋈/÷, ∩, ∪/−; pari livello da sinistra. Condizioni: NOT, AND, OR.

Domini number/string/date, controllo di arità e domini anche con relazioni vuote,
nessuna coercizione implicita testo/numero, nessun NULL. Eliminazione duplicati,
rinomina simultanea per nome, alias distinti per self-join, attributi ambigui
rifiutati. Operazioni insiemistiche per posizione con nomi del primo operando,
come nelle fonti. Theta join mantiene entrambe le colonne; naturale fonde i nomi
comuni. Divisione con candidati π_X(R), inclusa semantica dichiarata del divisore
vuoto. Non supportati outer join, aggregazioni, assegnazioni, aritmetica,
ridenominazione per posizione e wildcard: nessuna simulazione silenziosa.

Web Worker distinto da SQL, risorse solo locali, CSP connect-src none e worker-src
none. Budget 10.000 caratteri, 2000 token, 128 nodi, 32 livelli, 2000 tuple per
relazione, 32 attributi, 100.000 celle intermedie. Budget interno 250.000 operazioni
oppure circa 1 s; watchdog esterno 5 s termina il worker. Nessun grading su risultati
parziali. Non è una quota di tutta la memoria del browser né una certificazione di
sicurezza assoluta. Numericità JavaScript finita, non aritmetica di precisione arbitraria.

### Laboratorio e dataset

Editor Unicode accessibile, pulsanti con inserimento al cursore, Ctrl/⌘+Invio,
preview KaTeX dall'AST con escaping e trust=false, schemi e dati iniziali, esecuzione,
errori sintattici/semantici/risorse, reset, interruzione e quattro esempi guidati.
Albero navigabile, pulsanti dei nodi, sequenza postorder e relazione intermedia
calcolata per ciascun nodo. Nessuna tabella di risultato precompilata. Anteprima
visiva fino a 200 tuple con avviso, verifica sulla relazione completa entro limite.

Sailors algebra deriva dallo schema/seed SQL già convertito: 10/4/10 tuple, nessun
NULL, dati originali preservati. Le istanze S1/S2/S3 delle slide sono distinte.
Righe di Impiegato/Dipartimento/Progetto/Partecipazione tutte sintetiche, schema
trascritto dalla scansione, chiavi/riferimenti controllati. JSON rigenerabili con
`npm run algebra:datasets`, Python standard library. Originali e output SQL dello
Sprint 2 ricontrollati: hash invariati. Fixture sintetiche separate, inclusi
omonimi, confini, parità, relazioni vuote, prenotazioni ripetute e ordine inverso.

### Esercizi e prudenza del correttore

25 attività con fonte/pagina, enunciato, schema, difficoltà, editor, suggerimenti
e riferimento su richiesta: 6 automatiche Sailors (Autoverifica Q1–Q6), Q4bis
guidata, 14 quesiti scansionati (12 automatici e Q9/Q10 guidati), due interpretazioni
guidate della scansione e due attività guidate sugli alberi delle slide.
Totale 18 automatiche e 7 guidate. Traduzioni, soluzioni e commenti sono Database
Academy needs-review, non soluzioni generate attribuite al docente.

Ogni risposta automatica viene eseguita da zero su cinque fixture Sailors o quattro
Impiegati, separatamente dal riferimento. Confronto di schema (nomi/posizioni/tipi)
e insieme esatto delle tuple, non stringa dell'espressione; qualificatori finali e
ordine delle tuple ignorati. Sintassi/semantica/risorse/inconclusivo distinti.
Due espressioni equivalenti e due errori tipici per ogni automatico; 18 risultati
attesi calcolati a mano controllano indipendentemente i riferimenti. Molte seconde
versioni della scansione usano E ∪ E = E; le alternative Sailors includono
riscritture con selezioni anticipate, unione, differenza e divisione espansa.

La risposta verde invece di rossa coincide sull'originale per Q2, ma è distinta
sulle fixture. Il caso omonimi distingue intersecare nomi da intersecare sid.
**La verifica finita non dimostra equivalenza generale**: esito “coerente sulle
fixture”, non certificazione matematica. Errori del riferimento non producono
superamento. Attività guidate salvano soltanto riflessioni, senza correttezza automatica.

Ambiguità esplicite: proprietà di proiezione p. 16, convenzione equijoin p. 34,
barca 100 degli alberi, differenza fra script e figure, unità milioni/60K e bilanci,
dipartimenti vuoti nel Q10, lettura dei due ruoli nel Q8, tutti gli attributi
comuni nella seconda interpretazione. Nessuna correzione nascosta delle fonti.

### Progressi, compatibilità e file principali

IndexedDB e backup restano v3: lo store attempts già contiene tutti i campi
necessari, quindi non serve una migrazione strutturale. Tentativi con espressione,
esito, feedback, data e versione; quelli guidati result=guided. Stato di superamento
per versione separato dalla lettura e dalle riflessioni. Errore semantico salvato
come execution con descrizione esplicita. Import v1/v2/v3, fusione e rollback
compatibili. Testati archivio v3 con SQL/letture/cronologia, aggiunta algebra,
backup/ripristino, versioni precedenti e conflitti senza sovrascrittura.

- `lib/algebra/`: tipi, grammatica/parser, evaluator, Zod, formatter KaTeX, worker,
  adapter browser e caricamento contenuti.
- `lib/grading/algebra.ts`: confronto insiemi e verifica su fixture.
- `components/algebra/`, `app/algebra-lab/`, `app/api/algebra/`, Practice: editor,
  albero, risultati, attività automatiche/guidate e route esclusivamente locali.
- `content/courses/basi-di-dati/algebra/`, nove lezioni/quiz, manifest v4;
  `content/imports/sprint3-20261024.json`: ID, diff e 78 hash degli output nuovi.
- `scripts/import-content/build_algebra_data.py`: dataset riproducibili;
  `scripts/build-sql-assets.mjs`: compilazione anche del worker algebra.
- Dashboard/Learn/fonti/shell aggiornati; package app v0.4.0, nessuna nuova dipendenza.
- Test unitari algebra/contenuti/progressi e `tests/e2e/algebra.spec.ts`.

### Problemi individuati durante le verifiche

I test iniziali hanno evidenziato fixture non discriminanti sui colori e riferimenti
non qualificati in un self-join: corretti dati sintetici ed espressioni della
piattaforma. Nessuna modifica al seed ufficiale. Chiarita l'interpretazione della
seconda formula scansionata, dove Nome/Sede non implicano identità del codice.

Una prima suite completa a quattro worker ha avuto un errore browser
ERR_NO_BUFFER_SPACE prima della navigazione; parallelismo locale ridotto a due.
Una seconda esecuzione ha rivelato un selettore di test dashboard ambiguo e una
condizione temporale preesistente della scorciatoia Monaco: Ctrl/⌘+Invio poteva
leggere lo stato React prima degli ultimi caratteri digitati. Il selettore è ora
circoscritto al riepilogo del modulo; Monaco passa al comando una copia corrente
del proprio modello, anche per la textarea alternativa. Correzione necessaria
per preservare SQL Lab. Lint, typecheck, test e build ripetuti dopo la modifica.
I risultati finali sono registrati nella sezione seguente, senza conteggiare come
superate le esecuzioni precedenti fallite.

### Verifica finale effettivamente eseguita

| Comando | Risultato finale |
|---|---|
| npm run lint | Superato, nessun errore o warning |
| npm run typecheck | Superato |
| npm test | 295 test superati in 9 file |
| npm run test:sql-import | 4 test Python superati; Sailors/NorthWind invariati |
| npm run build | Superata, 59 pagine generate e route locali |
| npm run test:e2e | 28 test superati, Chromium desktop e mobile, due worker |
| npm audit | Zero vulnerabilità segnalate |

La suite browser finale è stata eseguita integralmente dopo le correzioni, senza
retry automatici. Copre tutti i 18 esercizi automatici, riferimenti su richiesta,
albero e risultati intermedi effettivi, errori, relazioni vuote, simboli, divisione,
dataset sintetico, timeout/watchdog con worker volutamente bloccato, recupero e
reset. Copre tentativi/riflessioni, export/import reale v3, SQL e letture già
esistenti, tutti gli indici delle 18 lezioni, assenza di overflow e flussi tastiera.
Nessuna richiesta esterna o errore JavaScript nei flussi monitorati. I test non
sono una prova universale di sicurezza o di equivalenza matematica.

Unitari: tutti gli operatori, precedenza/parantesi, rinomina simultanea e inversa,
self-join, divisione compreso divisore vuoto, deduplicazione, controlli anche su
schemi vuoti, attributi mancanti/ambigui e domini incompatibili. Riferimenti
controllati con risultati indipendenti calcolati a mano, espressioni equivalenti,
errori tipici e coincidenze accidentali sull'originale. Verificati limiti interni,
validazione Zod, riproducibilità dataset, chiavi/riferimenti sintetici e rendering
KaTeX con escaping delle costanti. Tutti i 13 checksum originali rimangono corretti.

Screenshot algebra-lab e algebra-exercise desktop/mobile controllati visivamente
in `docs/screenshots/`; grafica coerente, tabelle contenute e notazione leggibile.
Sono screenshot di Chromium, mobile emulato: nessuna certificazione Safari o prova
su telefono fisico. Gli screenshot a pagina intera ora partono dall'inizio per
non spostare artificialmente gli elementi fixed durante la cattura.

### Limiti rimasti e istruzioni manuali

Revisione umana ancora necessaria per tutte le nuove lezioni, quiz, trascrizioni,
contratti e soluzioni. Restano esplicite le ambiguità delle fonti, compresa la
notazione del self-join nell'Autoverifica p. 10, che precede una rinomina su sei
posizioni: la piattaforma usa alias e prodotto/theta join, non un naturale di una
relazione con se stessa. Nessuna modifica all'originale per correggere la notazione.

Outer join/NULL, aggregazioni, aritmetica e rinomina per posizione non eseguibili.
Nessun verificatore generale di equivalenza, ottimizzatore fisico, editor ER o
servizio AI. Relazioni grandi possono superare i budget. Solo i tentativi degli
esercizi sono persistenti: le espressioni libere non hanno una cronologia salvata.
Backup massimo 5 MB; origine e profilo delimitano lo storage; server locale
necessario anche senza Internet. Nessun problema applicativo aperto nei flussi
finali di accettazione; nessuna promessa oltre il subset dichiarato.

```powershell
npm ci
npm run dev
```

Aprire http://127.0.0.1:3000/algebra-lab. Per produzione locale: `npm run build`,
poi `npm start`. Iniziare con `π_sname(σ_age>30(Sailors))` e selezionare i tre nodi:
10 tuple iniziali, 7 dopo il filtro, 6 nomi distinti finali. Quindi provare Practice,
una verifica Sailors, una riflessione guidata e il backup. Procedura completa in
`docs/SPRINT3_ACCEPTANCE.md`; grammatica/fonti/contratti in `docs/ALGEBRA_LAB.md`.

**Fermo allo Sprint 3 al termine della precedente milestone.**

## Sprint 4 — progettazione ER · 25 ottobre 2026

Milestone corrente: **M4 / Sprint 4 implementato**, app 0.5.0, manifest v5.
Autorizzazione: richiesta esplicita del proprietario per ER. Questo perimetro
prevale sulla vecchia M4 della roadmap dedicata a NorthWind/ricerca: NorthWind è
già nello Sprint 2, ricerca globale non aggiunta. Sprint 5 non iniziato.

### Fonti e copertura

Letti PROJECT_SPEC.md, AGENTS.md, CONTENT_INVENTORY.md e ROADMAP.md prima delle
modifiche. Inventariati i 13 originali realmente presenti: Argomento01, 02, 03,
03.1, 04, 05, esercitazione_AR, introduzione MySQL/DBeaver, presentazione del
corso, Book.pdf, i due script Sailors/NorthWind e Esercizi 1 Sailor. Nessun file
descritto ma assente assunto disponibile. Originali invariati, checksum verificati.

Argomento05 Entity Relationship.pdf: lette tutte le 71 pagine, estrazione testuale
e rendering/controllo visivo di ogni pagina, incluse figure e convenzioni grafiche.
Mappa completa, notazione e ambiguità nel documento dedicato
`docs/SOURCE_REVIEW_SPRINT4.md`. Non estratto Book.pdf.

Argomenti identificati: requisiti e fasi della progettazione, entità/tipi/insiemi,
attributi/domìni, identificatori composti e candidati, associazioni binarie,
ternarie e ricorsive, attributi descrittivi, vincoli di chiave, partecipazione,
min/max, entità deboli, ISA/ereditarietà/disgiunzione/copertura, aggregazione,
scelte tra modelli e progettazione iterativa. Ambiguità principali: vincoli
ternari p. 25, periodi p. 20/50, proprietario delle entità deboli p. 32/58,
alternative polizze e aggregazione. Nessuna reinterpretazione silenziosa.

### Lezioni, quiz e attività

Otto lezioni nuove, tutte versione 1 e needs-review:

| ID | Titolo/argomento | Pagine PDF |
| --- | --- | --- |
| er-requisiti | Dai requisiti al modello concettuale | 2–9, 64–71 |
| er-entita | Entità, attributi e identificatori | 10–16 |
| er-associazioni | Associazioni e ruoli | 17–22, 30 |
| er-vincoli | Cardinalità, chiave e partecipazione | 23–29, 34 |
| er-deboli | Entità deboli e identificazione | 31–33 |
| er-gerarchie | Generalizzazione e specializzazione | 35–40, 53 |
| er-aggregazione | Aggregazione e confronto con ternarie | 41–43, 60–63 |
| er-scelte | Scelte di progettazione | 44–59 |

Spiegazioni, definizioni, esempi, diagrammi semantici JSON renderizzati in SVG,
interpretazione, errori comuni, riepiloghi, fonti e tre domande per lezione.
Ventiquattro nuovi quiz, totale 26 lezioni/78 domande. Contenuti separati da React;
zero promozioni a verified. Le aggiunte didattiche sono attribuite alla piattaforma.

Sette attività guidate: `er-company`, `er-lavora`, `er-periodi`, `er-indirizzo`,
`er-polizze`, `er-isa`, `er-aggregazione`. Cinque riprendono domande effettive
delle slide; COMPANY e ISA sono attività originali Database Academy dichiarate.
Le dispense non offrono una raccolta autonoma di esercizi numerati completi.
Ogni attività include fonte, difficoltà, modello iniziale, suggerimenti, limiti,
bozza salvabile e riferimento della piattaforma richiesto esplicitamente.
Il caso aggregazione usa note guidate: il costrutto non è editabile.

### Editor, notazione e modello semantico

`/er-lab` usa SVG React locale senza nuove dipendenze. Entità, attributi semplici,
identificatori primari/candidati/parziali e composti, associazioni con attributi,
partecipazioni, ruoli, cardinalità min/max, entità deboli e gerarchie ISA.
Creazione/modifica/eliminazione, spostamento, zoom/panoramica, reset con conferma,
undo/redo per 40 azioni, selettore accessibile e proprietà HTML alternative ai gesti.
Layout responsive, legenda, messaggi e stato di salvataggio italiani.

Notazione del corso: rettangoli/ovali/rombi, primaria sottolineata, parziale
tratteggiata, freccia dall'entità al rombo per max=1, tratto spesso per min≥1,
entità debole/identificante con contorno spesso, ISA triangolo D/O e linea doppia
per copertura totale. Min/max sempre espliciti. Nessuna sostituzione con crow's
foot, UML o doppie forme di un altro standard. Candidate visibili nel pannello.

Diagramma schemaVersion 1, Zod strict: semantica separata da layout/viewport e
metadati/versioni. ID stabili, import massimo 1 MB, limiti sulle collezioni,
coordinate finite, campi sconosciuti e versioni future rifiutati. Bozze semanticamente
incomplete ammesse per poterle salvare e correggere. Punto di migrazione esplicito.

### Validatore e feedback

Validazione deterministica di nomi, chiavi e relativi componenti, cardinalità,
riferimenti, proprietari, partecipazioni insufficienti, ruoli ricorsivi, subset
debole e cicli/referenze ISA. Distinzione tra errore strutturale, avvertimento,
suggerimento e verifica manuale. Quando non vi sono errori compare esattamente:
“Validazione strutturale superata. La correttezza semantica richiede una verifica ulteriore.”

Le proprietà esplicite delle attività sono osservazioni parziali su nomi, attributi
e partecipazioni; nessun confronto JSON con la soluzione, nessun esito automatico
di correttezza semantica. Sinonimi e modellazioni alternative richiedono lettura
umana. Nessuna AI o rete esterna per valutare il lavoro.

### Persistenza e conservazione

IndexedDB v4 aggiunge solo lo store `erDiagrams`; backup globale v4 importa
v1/v2/v3 conservativamente. Letture, quiz, SQL e algebra preservati. Salvataggio
**esplicito**: ogni “Salva versione ER” aggiunge una revisione immutabile, con
date, esercizio/versione, validazione e completamento manuale facoltativo.
Revisioni assegnate in transazione anche tra salvataggi concorrenti. Ripristino
modificabile, senza cancellare la cronologia; import diagramma come copia con
nuovo ID, conferma prima della sostituzione dell'editor. Backup atomico con
conflitti rifiutati. Mostrate le ultime 50 versioni; tutte restano nel backup.

Il banner segnala lavoro non salvato e il browser avvisa in uscita/ricaricamento;
la navigazione interna non viene bloccata: salvare prima di cambiare pagina.
Limite backup 5 MB; storage vincolato a origine, porta e profilo del browser.

### File principali

- `lib/er/{model,commands,validation,content}.ts`, `lib/grading/er.ts`.
- `components/er/{diagram,canvas,properties,workspace,exercise-list}.tsx`.
- `app/er-lab/page.tsx`, route riferimento ER, integrazione Practice/Learn/fonti/shell/dashboard.
- `lib/progress/{schemas,db,merge}.ts`, controlli backup v4.
- `content/courses/basi-di-dati/{lessons,quizzes,er}/`, manifest v5,
  `content/imports/sprint4-20261025.json`, changelog e inventario aggiornati.
- Test unitari ER/migrazioni, test E2E ER, aggiornamenti delle aspettative del catalogo.
- README, revisione fonti, contratto ER Lab e accettazione manuale Sprint 4.

### Verifiche eseguite

| Comando/prova | Esito finale |
| --- | --- |
| `npm run lint` | Superato |
| `npm run typecheck` | Superato |
| `npm test` | 355 test, 11 file, superati |
| `npm run test:sql-import` | 4 test Python superati; valori/conteggi Sailors e NorthWind invariati |
| `npm run build` | Superato; 75 pagine generate, route ER inclusa |
| `npm run test:e2e` | 36 test Chromium desktop/mobile superati, 8 specifici ER |
| `npm audit --omit=dev` | Zero vulnerabilità segnalate |
| Hash originali e contenuti degli Sprint 1–3 | Invariati |

ER: creazione, chiavi composte/candidate/parziali, collegamenti, min/max validi e
invalidi, ricorsione, deboli, ISA e cicli, cancellazioni, undo/redo, JSON invalido,
future versioni, ripristino e modificabilità. Migrazione da un database v3 reale
di test contenente letture/quiz/SQL/algebra; versioni append-only, concorrenza,
conflitti atomici, backup e ID documento di lunghezza massima. Browser: flussi
desktop/mobile, creazione con tastiera, trascinamento desktop, dati ripristinati
ancora modificabili, tutte le 26 lezioni senza overflow, soluzioni solo su richiesta,
nessuna richiesta esterna nei percorsi monitorati e nessun pageerror.

Screenshot `er-editor-*` e `er-exercise-*` controllati visivamente; mobile è
emulazione Chromium, non dispositivo fisico o Safari. Dettagli diagramma su mobile
richiedono zoom/panoramica; controlli di proprietà sempre disponibili.

Errori incontrati e risolti: handler React presenti nel renderer statico durante
prerender; selettore E2E troppo restrittivo sull'importazione; suffisso revisione
oltre il limite dell'ID documento. Un'esecuzione unitaria ha inoltre esposto una
race preesistente: il test di riproducibilità algebra riscriveva le fixture lette
da altri test. Il generatore accetta ora `--output-root` e il test rigenera in una
cartella temporanea isolata, confrontando gli hash senza modificare il catalogo.

### Limiti rimasti e verifica manuale

Aggregazione e attributi composti/multivalore non editabili; nessun correttore
semantico generale, verifica su istanze reali, traduzione ER→SQL, layout automatico
o instradamento anticolisione. Tutti i nuovi contenuti richiedono revisione umana;
restano esplicite le ambiguità delle slide e gli adattamenti dei riferimenti.
Nessuna certificazione di accessibilità o compatibilità oltre le prove dichiarate.
Server locale necessario, nessuna PWA/cache senza server, nessun servizio cloud.

Avvio: `npm ci`, `npm run dev`, poi http://127.0.0.1:3000/er-lab. Per produzione:
`npm run build` e `npm start`. Procedura completa in `docs/SPRINT4_ACCEPTANCE.md`:
creare e validare un diagramma, salvare due revisioni, riaprire/modificare, provare
import/reset con conferma, attività guidate, backup con gli altri progressi e
ripristino in profilo separato. Contratto e limiti in `docs/ER_LAB.md`.

**Fermo allo Sprint 4. Atteso un nuovo via libera prima dello Sprint 5.**

## Sprint 5 — Exam Prep · 25 ottobre 2026

Milestone M5, app **0.6.0**. Perimetro autorizzato: preparazione personale, ricerca,
statistiche e piano di studio, considerando NorthWind anticipato allo Sprint 2
ed ER nello Sprint 4. Nessun ulteriore sprint avviato, nessuna nuova dipendenza.

### Analisi prima del codice

Letta integralmente la documentazione del progetto: specifica, AGENTS, inventario,
roadmap, README/avvio, registro 0–4, revisioni delle fonti, contratti dei tre lab,
guide di accettazione/manutenzione e catalogo/changelog. Ispezionati i 13 originali
effettivamente presenti, manifest v5, 26 lezioni/78 quiz e tutti i 37 esercizi.
Checksum di originali e contenuti degli Sprint 1–4 verificati invariati. Nessuna
nuova estrazione PDF o Book.pdf, nessuna nuova domanda inventata.

Copertura: introduzione 4 lezioni/12 quiz, modello relazionale 5/15, algebra 9/27,
ER 8/24. SQL ha cinque esercizi Sailors, nessuna lezione dedicata; strumenti non
ha attività; NorthWind è disponibile nel lab libero, senza esercizi Exam Prep.
Algebra: 18 automatici e sette guidati. ER: sette guidati, nessun correttore semantico
generale. Limiti SQL/SQLite, algebra e ambiguità ER mantenuti espliciti.

**Non sono presenti prove ufficiali d'esame nell'inventario.** Le simulazioni della
piattaforma non dichiarano equivalenza con formato, tempi, difficoltà o voto reali.
Nessuna promozione editoriale: zero nuove verified, tutti i contenuti needs-review.

### Funzionalità e tipologie di sessione

Nuova sezione `/exam-prep`, collegata nella navigazione, con allenamento e simulazione.
Pool di **115 attività**: 78 quiz, cinque SQL, 25 algebra e sette ER. Selezione di
moduli/tipologie, seed, totale 1–30, quote esatte per difficoltà e durata 0–240 minuti.
I quiz non hanno difficoltà assegnata: categoria non-classificato. Le altre attività
sono 33 intermedie e quattro avanzate. Nessun livello base disponibile: richiesta
non soddisfacibile segnalata, senza riempitivi o classificazioni inventate.

Generatore v1: FNV-1a/xorshift32 e Fisher–Yates, ordinamento iniziale ASCII, filtri,
quote e controllo dei duplicati. Stesso pool/seed/configurazione riproducono la
selezione. Il piano contiene copie versionate nell'ordine scelto e archiveId:
aggiornare il catalogo non rigenera le sessioni salvate.

Archivi di contenuti/riferimenti/fixture in `content/exam/archives/`, indirizzati
da SHA-256, validati con Zod e conservati senza sovrascrivere copie precedenti.
Il generatore dei cataloghi è parte di predev/prebuild. Due copie conservate durante
lo sviluppo permettono anche il test reale di rivalutazione del catalogo precedente.
Manifest didattico v5 e ID precedenti invariati; registro Sprint 5 con checksum.

Allenamento: Valuta risposta per attività. Simulazione: nessun pulsante di correzione
o riferimento anticipato; la route rifiuta lo stato attivo. Conferma di conclusione
o scadenza bloccano le risposte e avviano il riepilogo. Revisione navigabile,
riferimenti espandibili e collegamenti alle lezioni/fonti. I link di ripasso sono
per lezione del quiz o per modulo algebra/ER; SQL segnala la mancanza di lezioni dedicate.

### Criteri di valutazione

I correttori esistenti non sono stati modificati. Quiz con gradeQuiz; SQL con
gradeSql e BrowserSqlAdapter/worker, algebra con AlgebraAdapter/worker. SQL eseguito
soltanto nel browser su fixture isolate, con stessi limiti, multinsiemi, NULL e
compatibilità SQLite/MySQL già dichiarati. ER usa canvas/proprietà/comandi condivisi
e validatore/controlli parziali precedenti; algebra guidata usa riflessioni.

Esiti separati: corretta, errata, coerenza/non coerenza sulle fixture, manuale,
inconclusivo e senza risposta. Sintassi/semantica/risorse/timeout hanno dettaglio
esplicito e non sono una verifica riuscita. Il manuale ER non assegna punteggi
semantici, neppure con struttura valida. Nessun voto aggregato o soglia inventata.
Ritentare una sessione conclusa valuta soltanto mancanti/inconclusivi, evitando
di moltiplicare artificialmente i risultati già disponibili.

Le copie pubbliche non contengono risposte attese, spiegazioni quiz o soluzioni.
I riferimenti arrivano dopo la risposta in allenamento o la conclusione in simulazione.
È un'app personale, non anti-cheat: il proprietario controlla file e richieste locali.
La verifica su fixture finite non certifica equivalenza generale, né MySQL completo.

### Ripasso, statistiche e dashboard

Regole deterministiche visibili: ultimo quiz errato +5 per domanda; ultimo esercizio
del modulo non coerente +3; lettura della versione corrente non completata +2;
visita almeno sette giorni fa +1. Ogni suggerimento motiva l'ordine. Una visita o
lettura non misura memoria o padronanza. Argomenti con segnali di difficoltà:
quiz, fixture e inconclusivi separati, compreso SQL senza lezioni.

Dashboard avanzata e riepilogo in Exam Prep: letture correnti; tentativi/domande
quiz uniche; percentuale con denominatore esplicito; tentativi/esercizi SQL unici;
tentativi/attività algebra uniche; ER con almeno un completamento manuale; simulazioni
e allenamenti conclusi distinti. Tabella temporale separata per quiz, fixture e
manuali, ultimi 30 giorni con dati, date UTC. Le ripetizioni volontarie contano
come tentativi; i risultati duplicati nelle revisioni sono deduplicati. Nessuna
media fra esiti eterogenei. Gli storici dei lab restano distinti da Exam Prep;
la dashboard avanzata aggrega entrambe le provenienze senza doppie scritture.

### Ricerca e piano di studio

Ricerca locale a `/search` e dentro Exam Prep: lezioni/testo redatto, concetti,
moduli, definizioni/sezioni, enunciati e metadati delle fonti. Accenti/maiuscole
normalizzati, tutti i termini richiesti, titolo prioritario, contesto/categoria/link,
limite 40 risultati. Nessun libro, testo integrale PDF o soluzione di riferimento
indicizzato. Non usa servizi o richieste esterne.

Piano con data personale, giorni disponibili, 15–240 minuti/giorno e priorità.
Distribuisce 26 lezioni e 37 esercizi disponibili; stima dichiarata di 30 minuti
per unità, frazionabile. Le priorità manuali prevalgono e le lezioni sono ordinate
anche dai segnali locali di ripasso. Capacità insufficiente: residui per tipo/ID
e minuti visibili. Modifica manuale di giorno, minuti, nota e spunta, con nuove
revisioni. Nessuna data d'appello inventata. Le modifiche possono superare il budget:
il controllo finale della distribuzione resta umano.

### Persistenza, backup e conservazione

IndexedDB/backup **v5** aggiungono examPlans, examRuns e studyPlans, preservando tutti
gli store precedenti e migrando backup v1–v4. Risposte automatiche con buffer di
350 ms per raggruppare la digitazione; conclusione/valutazione attendono le scritture.
Stato di salvataggio visibile e avviso browser durante scritture pendenti. Revisioni
append-only, serializzazione e controllo della revisione attesa per impedire
sovrascritture da altre schede. Risposte concluse immutabili, riapertura modificabile
per quelle attive, aggiornamento degli esiti separato. Nessuna cancellazione automatica.

Timer: scadenza assoluta persistente, nessun reset al reload, nessuna pausa. Continua
fuori pagina e conclude alla riapertura se scaduto; residuo congelato al finish.
L'orologio locale non è protetto da manipolazioni. Server locale sempre necessario.

Backup con anteprima/conferma, fusione atomica e conflitti rifiutati, limite 5 MB.
Esportazione sopra il limite sospesa con errore esplicito, senza produrre un file
non reimportabile o troncare dati. **Conservare gli archivi Exam Prep insieme al
progetto**: il JSON dei progressi non include fonti/fixture/soluzioni. Se manca un
archivio le risposte restano, la rivalutazione fallisce senza usare il catalogo nuovo.

### File principali

- `lib/exam/{schema,generator,catalog,evaluation,insights,study}.ts`.
- `components/exam/{hub,session,er-answer,insights,study-plan}.tsx`.
- `app/exam-prep/page.tsx`, `app/api/exam/evaluate/route.ts`.
- `lib/search/{index,query}.ts`, `components/search.tsx`, `app/search/page.tsx`.
- Progressi/backup v5, dashboard/shell/CSS, `content/exam/`, script catalogo e test.
- `docs/EXAM_PREP.md`, `docs/SPRINT5_ACCEPTANCE.md`, `docs/HOW_TO_ADD_MATERIAL.md`,
  README, inventario e changelog. Nessuna modifica ai documenti originali.

### Test effettivamente eseguiti

| Comando/prova | Esito |
| --- | --- |
| npm run lint | Superato, nessun warning |
| npm run typecheck | Superato |
| npm test | 386 test superati in 12 file |
| npm run test:sql-import | 4 test Python superati, dati Sailors/NorthWind invariati |
| npm run build | Superato, 78 pagine generate e nuove route locali |
| npm run test:e2e | 46 test Chromium desktop/mobile superati sulla build finale, dopo il raggruppamento delle scritture |
| npm audit --omit=dev | Zero vulnerabilità segnalate |
| Checksum originali e contenuti registrati Sprint 1–4 | Tutti invariati |

Nuovi unitari: configurazioni/quote/carenze, seed e ordine indipendente dal catalogo,
snapshot e archivi precedenti, niente correzione anticipata, quiz corretti/errati,
fixture e manuali, timer/reload/stop, vera migrazione database v4 con letture/quiz,
SQL/algebra/ER, append-only e conflitti concorrenti, risposte concluse bloccate,
backup e piani restaurati, deduplicazione statistiche, motivi del ripasso, ricerca
senza libro, date/giorni/capacità e modifiche manuali del piano.

Dieci nuovi casi browser (cinque per viewport): simulazione/ripresa/revisione e seed,
SQL corretto/mismatch/sintassi, algebra automatica ed ER manuale con diagramma
modificato e ripreso dopo reload, timer con clock
controllato, ricerca e carenze, piano modificabile dopo reload, export/download/import
reale v5 e sessione ripristinata ancora modificabile. Gli altri 36 casi verificano
gli sprint precedenti. Nessuna richiesta esterna o pageerror nei percorsi monitorati.
Desktop/mobile Chromium emulato; non certifica Safari o dispositivo fisico.

Problemi individuati e risolti: etichetta accessibile del selettore modalità;
sessione appena conclusa non più selezionata dopo ripresa; checkbox piano con
feedback ritardato; selettori E2E che intercettavano copie nascoste durante lo
streaming Next.js; oracolo del test che sceglieva una revisione di un'altra sessione
e seed di algebra che sceglieva correttamente un'attività guidata invece di automatica.
Non conteggiate come superate le esecuzioni intermedie fallite.

### Limiti e verifica manuale

Nessuna prova ufficiale o certificazione di preparazione; difficoltà non calibrate
e copertura incompleta dichiarata. Restano i limiti dei lab e revisione umana di
tutti i contenuti. Niente voto ER, equivalenza generale o servizi AI. Il piano
è una proposta basata su stime, non un calendario ufficiale. Mancano backup
suddiviso oltre 5 MB, eseguibili storici dei motori e PWA senza server. Origine,
porta e profilo delimitano i progressi. Nessun problema critico aperto nei flussi
verificati nella suite finale.

Avvio: `npm ci`, `npm run dev`; produzione: `npm run build`, `npm start`.
Aprire http://127.0.0.1:3000/exam-prep. Primo controllo: tre quiz non classificati,
stesso seed, una simulazione con reload e conclusione, poi timer, ricerca e piano.
Esportare e provare il ripristino in un profilo separato, senza cancellare quello
personale. Procedura completa in `docs/SPRINT5_ACCEPTANCE.md`.

**Fermo dopo lo Sprint 5. Nessun ulteriore sprint iniziato.**


Chiusura Sprint 5: suite completa finale 46/46 superata senza retry; 386/386
unitari, lint/typecheck/build superati. Screenshot Exam Prep e revisione
desktop/mobile controllati visivamente. Nessun pageerror o richiesta esterna nei
percorsi monitorati. Risposte SQL mancanti escluse dal conteggio dei tentativi.
Le copie nascoste durante lo streaming sono escluse dai selettori E2E tramite
la regione main e i ruoli accessibili. Nessun ulteriore sprint iniziato.

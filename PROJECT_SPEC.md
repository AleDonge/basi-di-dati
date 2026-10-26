# Database Academy — specifica di prodotto e architettura
Versione 1.0 · 24 ottobre 2026 · uso personale, locale, offline-first

## 1. Obiettivo e confini
Applicazione web personale per preparare l'esame UNITN di Basi di Dati (a.a. 2026/27) utilizzando **come fonte primaria** il materiale del corso. Non è un SaaS. Nessun account, pagamento, cloud obbligatorio, API LLM obbligatoria o generazione AI durante l'utilizzo. L'app deve restare utilizzabile quando il docente aggiunge nuove dispense.

**Criteri di successo:** lezioni leggibili e fedeli alle fonti; esercizi SQL eseguibili e valutati in modo affidabile; esercizi di algebra relazionale valutabili nei casi supportati; progressi persistenti; aggiunta incrementale di materiale senza perdita dei dati.

## 2. Fonti ricevute e provenienza
Materiale da collocare manualmente in `source-material/` mantenendo i nomi originali:
- `Basi_di_dati_DISI 2026-27.pdf` (15 pp): informazioni e impostazione del corso; NON dedurre da solo dettagli dell'esame non espliciti.
- `Argomento01 Basi di Dati e loro utenti.pdf` (23 pp): introduzione.
- `Argomento02 Modello Relazionale.pdf` (37 pp): modello relazionale.
- `Argomento03 Algebra Relazionale.pdf` (48 pp): operatori e interrogazioni.
- `Argomento03.1 Algebra Relazionale Autoverifica.pdf` (10 pp): esercizi su Sailors, esempi di soluzioni.
- `Argomento04 SQL.pdf` (91 pp): SQL, fondamenti e pattern d'uso.
- `Argomento05 Entity Relationship.pdf` (71 pp): progettazione, modello ER.
- `Introduzione MySQL e Dbeaver.pdf` (92 pp): installazione e uso MySQL/MariaDB e DBeaver.
- `esercitazione_AR(1).pdf` (1 p, prevalentemente immagine): 14 quesiti di algebra relazionale su impiegati/dipartimenti/progetti e 2 interpretazioni; leggere visivamente.
- `Book.pdf` (1098 pp, prevalentemente scansione o privo di testo estraibile): risorsa supplementare; non inventarne titolo, autore o contenuto, non processarlo integralmente senza necessità.
- `Schema per generare DB Sailors.txt`: DDL e seed Sailors, Boats, Reserves.
- `Schema per generare DB NorthWind.txt`: dump MySQL NorthWind di circa 3411 righe, contiene dialettismi MySQL e valori binari; NON eseguire alla cieca nel browser.
- `Esercizi 1 Sailor.txt`: 5 quesiti SQL con GROUP BY/HAVING/aggregazioni.

Ogni unità didattica deve avere riferimenti a documento + pagina + sezione, con stato `verified | draft | needs-review`. Distinguere testo tratto dal corso, parafrasi didattica e approfondimento aggiunto. Mai affermare che un argomento è all'esame senza evidenza documentale.

## 3. Utente e percorsi
Solo proprietario, nessun login. Percorso tipico: dashboard → modulo → lezione (spiegazione + esempi + quiz) → esercizi → feedback → ripasso. Altri percorsi: SQL Lab libero, Algebra Lab, raccolta esercizi, import di nuovi contenuti via Codex, modalità esame in fase successiva.

## 4. MVP — funzionalità obbligatorie
### 4.1 Dashboard
Moduli disponibili e futuri (futuri marcati `non ancora coperti`); completamento lezioni; tentativi e successo per tema; continua da dove eri rimasto; ultimo studio.
### 4.2 Learn
Navigazione per modulo e lezione; MDX/Markdown controllato; callout, formule KaTeX, tabelle, esempi eseguibili, mini quiz, riferimento alle slide. Distinguere materiali del docente da note integrative. Ricerca locale su titoli e testo.
### 4.3 Practice SQL
Editor Monaco; selettore dataset Sailors/NorthWind; schema e anteprima tabelle; esecuzione query SELECT in ambiente isolato; risultati tabellari, errori comprensibili; verifica automatica su più fixture e confronto per valori/tipi/duplicati/NULL, con ordinamento ignorato **solo** quando non richiesto. Verifica le colonne quando rilevanti. `LIMIT`, `ORDER BY` e semantica MySQL devono essere trattati esplicitamente nei test. Nessun confronto con stringa della query come unica regola.
### 4.4 Algebra relazionale
Input testuale con pulsanti operatori (σ, π, ρ, ×, ∪, −, ∩, ⋈), rendering KaTeX e parsing in AST; interprete relazionale su relazioni finite e semantica insiemistica, con verifica di schema e risultato su fixture diverse. Supportare prima selezione, proiezione, rinomina, prodotto, join, unione, differenza, intersezione; dichiarare chiaramente operatori e costrutti non supportati. L'equivalenza osservata su fixture NON costituisce prova matematica di equivalenza generale. Per esercizi fuori dal subset, usare autoverifica guidata e non mostrare un falso verdetto automatico.
### 4.5 Progressi
IndexedDB (Dexie facoltativo), ID stabili, salvataggio automatico tentativi, completamenti, bozze, timestamp e versione esercizio. Backup/export/import JSON con validazione e conferma prima di sovrascrivere. `localStorage` solo preferenze minori.
### 4.6 Design
UI italiana, dark mode predefinita, desktop-first ma usabile da mobile, accessibilità tastiera, layout con sidebar, tipografia leggibile e focus sullo studio. Evitare dashboard decorative prive di utilità.

## 5. Stack e decisione sui dialetti SQL
Next.js App Router, TypeScript strict, Tailwind, shadcn/ui, Monaco, KaTeX, Zod, Vitest, Playwright. Preferire contenuti in Markdown/MDX + metadati JSON versionati. Nessun backend obbligatorio.

**Vincolo critico:** il docente usa MySQL/MariaDB; SQLite WASM è comodo e gratuito ma NON implementa tutto il dialetto MySQL. Definire un `SqlExecutionAdapter` con `dialect`, `capabilities`, `loadFixture`, `executeReadOnly`, `reset`. In MVP usare SQLite WASM per il sottoinsieme compatibile, mostrare badge `SQLite (compatibilità parziale con MySQL)` e non dichiarare supporto MySQL completo. Marcare esercizi non compatibili `requires-mysql` e non correggerli tramite SQLite. In futuro possibile adapter MySQL/MariaDB locale in container isolato, opzionale; non esporre DB di sistema. Se l'implementazione sicura dell'esecuzione SQL richiede lavoro eccessivo, privilegiare un subset SELECT-only verificato e spiegare il limite.

**Sicurezza:** eseguire query in Web Worker isolato con timeout e limite righe; database effimero ripristinato per ogni tentativo/fixture; bloccare statement multipli, DDL/DML e comandi potenzialmente pericolosi nell'editor esercizi. Non affidarsi solo a blacklist regex: parser/validazione strutturale e worker terminabile. Nessun upload automatico verso servizi esterni.

## 6. Modello dati dei contenuti
- `Course`: id, title, academicYear, sourceRefs, schemaVersion.
- `Module`: id, courseId, title, order, status (`available|upcoming|draft`), prerequisites.
- `Lesson`: id, moduleId, slug, title, mdxPath, status, sourceRefs[{file,pageStart,pageEnd}], version, concepts[].
- `Dataset`: id, dialect, schemaPath, seedPath, fixturePaths[], provenance, supportedCapabilities[].
- `Exercise`: id, moduleId, type (`sql|relational-algebra|quiz|er-guided`), difficulty, prompt, datasetId, expectedColumns?, orderMatters, gradingMode (`automatic|guided|manual`), fixtures[], solutionPath, hints[], sourceRefs[], version, status.
- `Attempt`: exerciseId, exerciseVersion, answer, result, feedback, attemptedAt.
- `LessonProgress`: lessonId, lessonVersion, completedAt, lastVisitedAt.
- `ImportManifest`: importId, sourceName, checksum, createdAt, addedIds[], updatedIds[], reviewStatus.

Usare schema Zod, versionamento e migrazioni dei progressi. Soluzioni NON caricate indiscriminatamente nell'interfaccia prima del tentativo (si tratta di uno strumento personale, non sicurezza anti-cheat).

## 7. Struttura repository indicativa
```text
app/(study)/dashboard/   app/(study)/learn/[slug]/
app/(study)/practice/    app/(study)/sql-lab/
app/(study)/algebra-lab/ app/(study)/settings/
components/lesson/ components/exercise/ components/ui/
lib/content/ lib/sql/ lib/algebra/ lib/grading/ lib/progress/
content/courses/basi-di-dati/{manifest.json,modules,lessons,exercises,datasets}/
source-material/         scripts/import-content/  tests/
```

## 8. Pipeline incrementale nuovi materiali (inizialmente Codex-assisted)
1. Copiare nuovi PDF/script in `source-material/incoming/`.
2. Inventariare checksum, nomi, pagine e tipologia; leggere immagini quando il PDF non è estraibile.
3. Fare diff semantico con contenuti esistenti; non duplicare argomenti o sovrascrivere esercizi.
4. Generare **bozze** di lezioni, esempi e quesiti con fonti puntuali; segnalare lacune e ambiguità.
5. Validare JSON/Zod, build, test, fixture, soluzioni; richiedere approvazione umana prima di `verified`.
6. Pubblicare solo contenuti approvati; conservare ID stabili e versioni; non cancellare progressi.
7. Registrare in `content/CHANGELOG.md` cosa è cambiato.

**No API AI**: Codex elabora il materiale durante lo sviluppo/aggiornamento; l'app finale non chiama modelli. Una pagina di import automatico dei PDF NON fa parte del MVP.

## 9. Grading: requisiti di correttezza
- SQL: query attesa eseguita sugli stessi dataset di test; verificare multi-fixture inclusi NULL, duplicati, omonimi, righe senza join, date e confini; normalizzare tipi solo dove semanticamente giustificato; spiegare limiti dell'equivalenza per test.
- Algebra: AST + interprete + confronto su più fixture, con schema/attributi/insiemi; esercizi di divisione, quantificatori e massimi possono richiedere estensioni: non promuovere `automatic` finché non supportati.
- Esercizi ER: nel MVP `guided/manual` con rubriche e soluzione commentata; **non promettere** un correttore generale di diagrammi ER.
- Ogni esercizio automatico deve avere test positivo (almeno 2 soluzioni equivalenti, se disponibili) e negativo (almeno 2 errori tipici), inclusi edge case.

## 10. Import DB forniti
Sailors: tabelle `Sailors(sid,sname,rating,age)`, `Boats(bid,bname,color)`, `Reserves(sid,bid,day)`, con PK/FK; 10 sailors, 4 boats, 10 reserves. Verificare la conversione date e preservare i dati originali.
NorthWind: dump MySQL con `AUTO_INCREMENT`, `KEY`, `longblob`, `datetime`, `SET FOREIGN_KEY_CHECKS`, commenti, valori hex e altri dialettismi. Creare uno script **ripetibile e testato** per produrre un dataset SQLite compatibile o un subset documentato, senza alterare l'originale; validare conteggi e FK dove possibile. Se la conversione è incompleta, non fingere successo; Sailors deve comunque funzionare.

## 11. Milestone e criteri di accettazione
**M0** Repository + scaffolding, tipi Zod, navigazione e layout; `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` funzionano.
**M1** Dashboard + moduli e prime lezioni verificate da fonti, con citazioni e progressi persistenti.
**M2** Sailors SQL Lab + primi 5 esercizi ufficiali, esecuzione isolata e test di grading; verificare che alcune domande possano richiedere più fixture per evitare falsi positivi.
**M3** Algebra Lab con subset dichiarato + esercizi delle slide compatibili; valutazione guidata per i restanti.
**M4** NorthWind import validato + ampliamento esercizi + ricerca e backup.
**M5** Modalità esame e raffinamenti, solo dopo MVP stabile.

Per ogni milestone: screenshot desktop/mobile, test e report breve `docs/IMPLEMENTATION_LOG.md` con funzionalità, limiti, comandi e prossimi passi. Non implementare tutte le milestone in un unico enorme commit.

## 12. Vincoli espliciti
- Solo italiano; solo uso locale; niente registrazione o analytics esterni.
- No costi AI ricorrenti; librerie e tool gratuiti/open source quando possibile.
- Nessun contenuto inventato presentato come materiale del professore.
- Conservare materiali originali senza modificarli; non pubblicare online PDF del corso o libro senza diritti.
- Non promettere equivalenza matematica completa di query SQL/algebra tramite test finiti.
- La piattaforma è per studiare, non per fare svolgere automaticamente prove d'esame.

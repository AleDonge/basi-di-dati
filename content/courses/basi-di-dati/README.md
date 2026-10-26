# Catalogo M5

`manifest.json` è la fonte dati della UI, validata con Zod in `lib/content`.
Moduli e fonti sono reali. Ventisei lezioni sono anteprime needs-review; nessuna è
verified. Cinque esercizi Sailors needs-review e due dataset SQLite sono disponibili;
25 attività di algebra (18 automatiche, 7 guidate) sono in anteprima.

I file Markdown hanno frontmatter JSON validato con `lessonSchema`, coincidente
con la voce nel manifest. I quiz sono JSON con risposte e spiegazioni lette solo
dal server locale. Il client riceve gli enunciati e invia le risposte alla route
locale /api/quiz. Nessun HTML o MDX viene eseguito dal contenuto.

Non cambiare gli ID per una correzione editoriale. Incrementare versioni e
changelog; mantenere i progressi riferiti alle versioni originali. `draft` indica
materiale non pubblicato; `verified` richiede revisione umana. Una fonte presente
non rende automaticamente disponibile il relativo modulo.

Le anteprime needs-review sono consultabili per richiesta esplicita del
proprietario durante lo Sprint 1: questo non le promuove a pubblicate/verificate.
Formato e manutenzione: `docs/HOW_TO_ADD_LESSONS.md` nella radice del progetto.

Esercizi SQL in `exercises/`, soluzioni Database Academy in `solutions/`, fixture
sintetiche in `fixtures/`, conversioni riproducibili in `datasets/`. Le soluzioni
non sono attribuite al docente. Contratti di output, interpretazioni e limiti della
verifica finita sono espliciti in ogni esercizio. Il manifest v3 aggiunge questi ID
senza modificare quelli delle lezioni. Dettagli tecnici in `docs/SQL_LAB.md`.

Algebra in `algebra/{datasets,exercises,solutions}/`, esempi guidati in `algebra/examples.json`.
Nove lezioni aggiunte, nessun ID precedente cambiato; manifest v4. Grammatica e
ambiguità in `docs/ALGEBRA_LAB.md`. Tutte le righe Impiegati sono sintetiche.

Manifest v5: otto lezioni ER, 24 quiz e sette attività guidate aggiunti senza
cambiare gli ID precedenti. `er/{diagrams,exercises,solutions}/` mantiene modello
semantico e contenuti separati da React. I blocchi Markdown `erdiagram` contengono
JSON Zod, renderizzato in SVG, senza eseguire codice. Fonti e ambiguità in
`docs/SOURCE_REVIEW_SPRINT4.md`, contratto in `docs/ER_LAB.md`. Zero verified.

Sprint 5 non modifica manifest v5 o contenuti didattici. Exam Prep archivia copie
versionate in `content/exam/archives/` tramite `npm run exam:catalog` (predev/prebuild).
Non rimuovere o modificare gli archivi: piani precedenti li referenziano per hash.
Dettagli `docs/EXAM_PREP.md`; nuovi materiali `docs/HOW_TO_ADD_MATERIAL.md`.

## 2026-10-25 · Sprint 5 · Exam Prep catalogo v1

- Nessuna nuova domanda/lezione; manifest didattico v5 invariato.
- 115 attività copiate in archivi locali immutabili con hash, fonti e versioni.
- Quiz non classificati; difficoltà degli esercizi mantenute senza deduzioni sull'esame.
- Nessuna promozione a verified e nessuna modifica agli originali o ai contenuti precedenti.
- Piani, risposte, risultati e timer in progressi v5; backup v1–v4 migrati.
- Ricerca locale e suggerimenti deterministici, nessuna indicizzazione di Book.pdf.
- Contratti `docs/EXAM_PREP.md`, manutenzione `docs/HOW_TO_ADD_MATERIAL.md`.

## 2026-10-25 · Sprint 4 · Manifest v5

- Otto lezioni ER e 24 quiz needs-review; totale 26 lezioni e 78 domande.
- Sette attività ER guidate (cinque da domande delle slide, due originali).
- Tutte le 71 pagine ER controllate visivamente; notazione e ambiguità documentate.
- Diagrammi JSON semantici versionati, nessun contenuto didattico hardcoded in React.
- Soluzioni Database Academy su richiesta, nessuna promozione a verified.
- IndexedDB/backup v4, migrazioni conservative v1/v2/v3; tutti gli ID precedenti conservati.
- Registro `content/imports/sprint4-20261025.json`; perimetro fermo allo Sprint 4.

## 2026-10-24 · Sprint 3 · Manifest v4

- Nove lezioni di algebra e 27 quiz needs-review, con pagine puntuali e tabelle.
- 25 attività: 18 automatiche su fixture, sette guidate; nessuna verified.
- Sailors algebra derivato dallo script invariato; Impiegati e fixture sintetici
  dichiarati. Grammatica/AST/evaluator e worker, divisione compresa.
- Albero navigabile e relazioni intermedie calcolate, KaTeX da AST.
- Fonti algebra lette integralmente e controllate visivamente; ambiguità registrate.
- IndexedDB/backup v3 preservati, nessuna cancellazione o migrazione non necessaria.
- ID lezioni, quiz ed esercizi SQL precedenti invariati.
- Registro `content/imports/sprint3-20261024.json`; limiti `docs/ALGEBRA_LAB.md`.

# Changelog dei contenuti

## 2026-10-24 · manifest v3 · Sprint 2
- Script Sailors, dump NorthWind e cinque enunciati letti integralmente; originali invariati.
- Conversione riproducibile: Sailors 10/4/10 righe; NorthWind otto tabelle, 3202 record,
  77 colonne, nove BLOB, nessuna riga/colonna scartata. Report e checksum per dataset.
- Sailors: data 1998-1-11 normalizzata a 1998-01-11 e FK spostate nei CREATE.
- Cinque esercizi v1 con enunciato originale, contratto e soluzioni della piattaforma
  needs-review, mai attribuite al docente. Due soluzioni equivalenti e tre errori
  tipici testati per quesito; cinque fixture finite, senza certificare equivalenza.
- Quattro fixture sintetiche separate dai dati originali. LIMIT/OFFSET esclusi dalla
  verifica dei cinque quesiti e disponibili nel laboratorio.
- Lezioni, quiz e relativi ID dello Sprint 1 invariati; nessuna promozione a verified.
- Note delle fonti aggiornate per documentare l'analisi e la conversione, non i file originali.
- Registro import e hash output: `content/imports/sprint2-20261024.json`.

## 2026-10-24 · manifest v2 · Sprint 1
- Analisi integrale dei primi due PDF: 60 pagine, figure e tabelle controllate visivamente.
- Nove lezioni Markdown v1 e 27 domande v1, tutte `needs-review`; zero promozioni a verified.
- Aggiunti obiettivi, descrizioni, ordine, prerequisiti e collegamenti correlati.
- Riferimenti documento/pagina/sezione, distinzione di parafrasi ed esempi aggiunti.
- Report di ambiguità/refusi in `docs/SOURCE_REVIEW_SPRINT1.md`.
- Fonti originali, ID di corso/moduli/fonti preservati; nessuna lezione preesistente sostituita.
- Aggiornate solo le descrizioni dei primi due moduli; entrambi restano draft.
- Progressi separati per versione; quiz non modificano il completamento delle letture.
- Registro con checksum e diff degli ID: `content/imports/sprint1-20261024.json`.

## 2026-10-24 · manifest v1 · schema v1
- Primo inventario: 13 originali, checksum SHA-256 e conteggi effettivi.
- Sei moduli con ID stabili e stato `draft`; nessuna lezione o esercizio pubblicato.
- Differenza rilevata: `esercitazione_AR.pdf` è il nome effettivo, anziché `esercitazione_AR(1).pdf`.
- Nessun materiale precedente, tentativo o progresso sostituito. Originali invariati.
- I metadati sono controllati; la revisione didattica resta `needs-review`.

I nuovi materiali richiederanno un confronto con questo inventario, bozze versionate,
verifica delle fonti e approvazione umana prima di diventare `verified`.

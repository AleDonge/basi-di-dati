# Roadmap operativa per Codex

## Sprint 0 — Fondazioni
- Inizializzare Next.js App Router TypeScript strict + Tailwind + shadcn/ui.
- Predisporre moduli, Zod, contenuti, pagine e shell UI in italiano.
- Configurare lint, typecheck, Vitest, Playwright e README.
- Output: dashboard con dati realmente derivati da manifest, non placeholder.

## Sprint 1 — Lettura e progressi
- Estrarre indice reale da slide; creare prime lezioni con riferimenti alle pagine.
- MDX/Markdown renderer, KaTeX, quiz semplici, IndexedDB, export/import progressi.
- Testare persistenza e gestione versioni.

## Sprint 2 — SQL Sailors
- Preparare schema e seed Sailors verificati.
- Monaco, schema browser, worker SQLite WASM, adapter e limiti di sicurezza.
- Integrare 5 esercizi ufficiali, soluzioni validate, fixture multiple, hint e feedback.
- Documentare limiti del dialetto SQL.

## Sprint 3 — Algebra relazionale
- Definire grammatica subset; parser AST e interprete su insiemi finiti.
- Editor operatori, visualizzazione espressione e risultati intermedi.
- Portare esercizi compatibili; gli altri restano guided.
- Testare rinomina, join, differenza, casi con omonimi e relazioni vuote.

## Sprint 4 — NorthWind + contenuti
- Converter dump MySQL → SQLite/subset con report conversione e controlli.
- Popolare ulteriori lezioni ed esercizi da fonti già caricate.
- Ricerca, filtri per difficoltà e analisi errori.

## Sprint 5 — Qualità e preparazione esame
- Simulazioni a tempo con esercizi verificati.
- Accessibilità, responsive, performance e backup.
- Manuale `HOW_TO_ADD_MATERIAL.md` per nuove slide con Codex.

## Gate di ogni sprint
`npm run lint` · `npm run typecheck` · `npm test` · `npm run build` · smoke test browser. Non procedere se le regressioni critiche restano aperte.

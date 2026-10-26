# AGENTS.md — istruzioni permanenti per Codex

## Missione
Costruisci e mantieni Database Academy secondo `PROJECT_SPEC.md`. Sito personale locale, in italiano, incrementale, offline-first, senza API AI a pagamento. Prima di agire leggi `PROJECT_SPEC.md`, `CONTENT_INVENTORY.md` e `ROADMAP.md`.

## Metodo di lavoro obbligatorio
1. Ispeziona repository e `source-material/`; elenca cosa c'è davvero. Non assumere che file descritti ma non copiati siano disponibili.
2. Per ogni modifica proponi un piano breve e milestone corrente. Lavora in incrementi piccoli e verificabili.
3. Mantieni separati componenti, engine, grading e contenuti. No lezioni hardcoded nei componenti.
4. Non inventare informazioni dalle slide. Usa citazioni documento/pagina e flag `needs-review` quando la fonte è incerta. Controlla visivamente pagine scansionate/diagrammi.
5. Per ogni esercizio automatico scrivi test di correzione e casi limite. Non basarti sulla sola uguaglianza testuale delle query.
6. SQL: dichiarare il dialetto reale; SQLite ≠ MySQL. Isolare l'esecuzione e imporre limiti; niente query arbitrarie sul DB dell'app.
7. Algebra: dichiarare il subset supportato; niente falsa certificazione di equivalenza generale.
8. Nessun account, telemetria, API LLM, Supabase o servizio cloud senza richiesta esplicita.
9. Prima di chiudere: lint, typecheck, test, build; se non eseguibili spiegare perché. Aggiornare `docs/IMPLEMENTATION_LOG.md`.
10. Nuovi materiali: checksum, diff, ID stabili, versioni, bozza, verifica, changelog; non cancellare tentativi preesistenti.

## Qualità e UX
TypeScript strict, Zod per input e contenuti, accessibilità tastiera, layout responsive, dark mode, feedback utile agli errori, UI italiana, loading/error/empty states. Evita placeholder spacciati per contenuti reali.

## Convenzioni contenuti
Lezioni con frontmatter: `id`, `moduleId`, `title`, `version`, `status`, `sourceRefs`, `concepts`. Esercizi con `gradingMode` esplicito, `sourceRefs`, fixture e solutionPath. I materiali originali sono read-only. Non estrarre o includere integralmente `Book.pdf` senza scopo specifico.

## Definition of Done
Funzionalità funzionante end-to-end, test su casi positivi/negativi, nessuna regressione dei progressi, documentazione e istruzioni avvio aggiornate. Se la milestone è troppo ampia, completare un vertical slice solido e documentare ciò che resta.

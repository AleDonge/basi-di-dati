# Prompt iniziale da incollare in Codex

Stai lavorando nella cartella di progetto `database-academy`. Voglio che tu costruisca una piattaforma web di studio **personale e locale**, chiamata **Database Academy**, per il corso UNITN di Basi di Dati 2026/27.

**Prima di scrivere codice**, leggi integralmente `PROJECT_SPEC.md`, `AGENTS.md`, `CONTENT_INVENTORY.md` e `ROADMAP.md`. Esamina i file effettivamente presenti in `source-material/`, incluse slide, PDF, script SQL e raccolte di esercizi. Se non sono presenti, fermati e dimmi quali devo copiare; non inventare contenuti.

Requisiti non negoziabili:
- UI in italiano, dark mode, moderna, molto leggibile, responsive.
- Next.js + TypeScript strict + Tailwind + shadcn/ui, contenuti separati dal codice in Markdown/MDX e JSON validati con Zod.
- Dashboard, Learn, Practice, SQL Lab, Algebra Lab; progressi locali in IndexedDB, esportabili in JSON.
- Niente login, cloud obbligatorio, Supabase, API AI o spese ricorrenti.
- Lezioni approfondite e accurate basate sulle slide, con riferimento a file e pagine; mai inventare materiale del docente.
- SQL: dataset Sailors prima, NorthWind dopo. Editor Monaco, esecuzione sicura in browser con adapter e limiti, confronto risultati su più fixture; rendere visibili i limiti di compatibilità SQLite/MySQL.
- Algebra relazionale: editor operatori + parser/interprete per subset definito e testato; modalità guidata quando la correzione automatica non è affidabile.
- Aggiornamenti futuri: nuovi PDF analizzati incrementalmente, contenuti versionati, progressi preservati, revisione umana prima della pubblicazione.

**Procedi adesso SOLO con Sprint 0 della roadmap**, ma predisponi un'architettura pronta per gli sprint successivi. Voglio una prima applicazione avviabile, non soltanto una descrizione. Prima mostra un piano operativo breve, poi implementa; esegui lint, typecheck, test e build, risolvi gli errori, infine produci `docs/IMPLEMENTATION_LOG.md` con quanto fatto, comandi per avvio e limiti rimasti. Non passare automaticamente allo Sprint 1: attendi il mio via libera.

Preferisci soluzioni semplici e robuste a framework o dipendenze inutili. Quando una scelta tecnica ha implicazioni di correttezza (SQL, algebra, conversione NorthWind), rendile esplicite invece di nasconderle.

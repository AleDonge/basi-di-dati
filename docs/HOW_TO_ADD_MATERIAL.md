# Aggiungere materiale senza perdere i progressi

1. Copiare i nuovi originali in `source-material/incoming/`, senza sostituire
   quelli del corso. Inventariare nomi, dimensioni, pagine e SHA-256. Confrontare
   l'inventario precedente e segnalare file cambiati, duplicati o illeggibili.
2. Leggere le fonti pertinenti e controllare visivamente formule, scansioni e
   diagrammi. Non estrarre Book.pdf automaticamente. Non dedurre regole d'esame.
3. Confrontare i concetti già coperti. Aggiungere ID stabili; per correzioni allo
   stesso concetto preservare l'ID e incrementare la versione appropriata.
   Lezioni, quiz ed esercizi hanno namespace distinti, non identificazione per titolo.
4. Seguire HOW_TO_ADD_LESSONS.md e i contratti SQL_LAB, ALGEBRA_LAB, ER_LAB.
   Contenuti fuori da React, Markdown/JSON Zod, fonti/pagine e provenienza esplicite.
   Nuovi contenuti needs-review; solo revisione umana può autorizzare verified.
5. Per automatici preparare fixture discriminanti, risposte alternative e errori
   tipici. Conservare limiti di dialetto/subset; usare guidato quando la valutazione
   non è affidabile. Non trasformare uguaglianza finita in equivalenza generale.
6. Aggiornare manifest/import report/changelog con checksum, aggiunte/modifiche,
   versioni e zero cancellazioni dei tentativi precedenti. Non riutilizzare un ID
   per una domanda diversa. Se cambia la correttezza di un quiz aggiornare domanda,
   quiz e lezione secondo il contratto esistente.
7. Eseguire `npm run exam:catalog` dopo gli aggiornamenti. Conservare tutti i JSON
   già presenti in `content/exam/archives/`: sessioni precedenti possono dipenderne.
   Non modificare un archivio con hash già assegnato. Il piano salvato usa copie e
   versioni precise, non deve essere rigenerato usando il catalogo nuovo.
8. La ricerca deriva automaticamente solo dai contenuti redatti e metadati delle
   fonti; non indicizza PDF completi o libro. Verificare contesti e collegamenti.
   I piani di studio precedenti restano salvati e non si espandono automaticamente.
9. Prima di distribuire le modifiche eseguire lint, typecheck, unitari, import SQL,
   build ed E2E. Provare migrazione/backup in un profilo isolato, ripresa di una
   vecchia sessione, timer e grading di una vecchia versione. Controllare desktop/mobile.
10. Esportare il backup progressi e conservare una copia dell'intero progetto,
    inclusi gli archivi Exam Prep. Il backup JSON non include fonti e fixture.
    Pubblicare il resoconto in IMPLEMENTATION_LOG.md e attendere revisione umana.

Non inizializzare o svuotare IndexedDB quando cresce il catalogo. Nuovi formati di
progressi richiedono migrazioni testate non distruttive; gli ID fuori catalogo e le
versioni precedenti devono restare esportabili. Nessun cloud o servizio AI necessario.

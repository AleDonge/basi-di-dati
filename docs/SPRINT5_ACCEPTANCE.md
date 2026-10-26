# Accettazione manuale Sprint 5

```powershell
npm ci
npm run build
npm start
```

Aprire http://127.0.0.1:3000/exam-prep nello stesso browser/profilo degli altri lab.

1. Leggere il disclaimer sulle simulazioni della piattaforma. Scegliere modalità,
   seed, argomenti, tipologie, numero e quote. Per un primo test: 3 esercizi,
   quota non-classificato 3, altre quote 0. I quiz non hanno difficoltà assegnata.
2. In allenamento rispondere e premere Valuta risposta. Controllare spiegazione,
   riferimento espandibile, collegamenti di ripasso e stato di salvataggio.
3. In simulazione verificare assenza del pulsante di valutazione e dei riferimenti.
   Rispondere, attendere il salvataggio, ricaricare: selezioni e ordine conservati.
   Concludere con conferma; risposte bloccate, riepilogo e revisione disponibili.
4. Tornare all'elenco e creare una nuova sessione con la stessa configurazione:
   stessi elementi e ordine. Cambiare seed; provare quote superiori al pool e
   selezione del modulo Strumenti: carenza esplicita senza nuove domande.
5. Provare solo SQL: 1 esercizio, quota intermedio 1, altre 0. Usare una query
   corretta, SELECT 1 e SELECT FROM: distinguere coerenza, mismatch e sintassi
   inconclusiva. SQL usa SQLite con compatibilità parziale MySQL dichiarata.
6. Provare algebra: alcuni seed scelgono attività guidate, altre automatiche.
   Verificare correzione su fixture per le automatiche e revisione manuale per
   le guidate. ER: modificare il diagramma, spuntare il completamento manuale,
   controllare validazione strutturale senza punteggio semantico.
7. Creare una simulazione da 1 minuto, ricaricare o lasciare la pagina, poi
   tornare dopo la scadenza: conclusione automatica, niente risposte aggiuntive.
   Timer 0 significa disattivato; il tempo non è una durata ufficiale d'esame.
8. Dashboard: confrontare tentativi e attività uniche, percentuale quiz, fixture
   separate, manuali ER e sessioni concluse. Leggere i motivi del ripasso e le date
   UTC della tabella; leggere una lezione non deve diventare prova di padronanza.
9. In Ricerca cercare cardinalità, chiavi e Sailors. Controllare categorie, contesti
   e collegamenti. Book.pdf e soluzioni non devono entrare nell'indice.
10. Nel piano scegliere una data personale e giorni disponibili. Usare pochi
    minuti per vedere i residui non collocati. Cambiare giorno/minuti/nota, uscire
    dal campo per salvare, spuntare un'attività, ricaricare e verificare il ripristino.
11. Esportare il backup v5 dalle Impostazioni. Importarlo con anteprima e conferma
    in un profilo di test separato, conservando anche la cartella degli archivi
    Exam Prep del progetto. Riprendere la sessione e modificare ancora una risposta.
    Learn, quiz, SQL, algebra e versioni ER devono rimanere disponibili.
12. Su mobile provare selezione, editor testuale, proprietà ER, navigazione e
    tabelle. Usare Tab/Invio per i controlli essenziali. In Network controllare
    solo richieste locali; dopo installazione/build provare senza Internet, con
    server locale acceso. Non cancellare l'archivio personale per fare test.

Verifiche automatizzate:

```powershell
npm run lint
npm run typecheck
npm test
npm run test:sql-import
npm run build
npm run test:e2e
```

Il generatore si rigenera con `npm run exam:catalog`; non rimuove archivi precedenti.
Prima degli E2E fermare un vecchio server sulla porta 3000 per usare la build corrente.
Limiti, formati, metrica e algoritmi in `EXAM_PREP.md`. Fermarsi dopo lo Sprint 5.

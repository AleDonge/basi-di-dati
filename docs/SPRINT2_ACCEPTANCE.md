# Verifica manuale · Sprint 2

Avvio: `npm ci`, `npm run build`, `npm start`; aprire http://127.0.0.1:3000/sql-lab.
In sviluppo: `npm run dev`. Gli asset WASM/worker vengono preparati dai pre-script.
Il server deve restare acceso anche quando manca la connessione Internet.

1. Controllare il badge SQLite/compatibilità parziale e aprire la nota sui limiti.
2. Sailors: tre tabelle, 10/4/10 righe, PK e due FK di Reserves. Espandere anteprima
   e DDL. Nell'editor Monaco scrivere `SELECT COUNT(*) AS n FROM Sailors;` ed eseguire:
   una riga, n=10. Provare Ctrl/⌘+Invio ed editor testuale accessibile.
3. Eseguire `SELECT sname FROM Sailors WHERE sname='Horatio';`: due righe.
4. Provare `SELECT FROM Sailors`, `SELECT * FROM inesistente`, `DELETE FROM Sailors`,
   `PRAGMA query_only=OFF`, `SELECT load_extension('x')` e `SELECT 1; SELECT 2;`:
   errori comprensibili, nessuna modifica. Nuovo COUNT sempre 10.
5. Eseguire questa query, attendere l'interruzione, poi fare Reset e riprovare COUNT:

```sql
WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n)
SELECT SUM(x) FROM n;
```

6. Provare anche Interrompi worker durante un'interrogazione lunga. Cronologia e
   progressi devono rimanere dopo reset, ricaricamento e riapertura della pagina.
7. Selezionare NorthWind. Otto tabelle. `SELECT COUNT(*) FROM orders;` restituisce
   830; `SELECT COUNT(*) FROM order_details;` restituisce 2155.
8. `SELECT COUNT(Photo), SUM(length(Photo)) FROM employees;`: nove foto presenti.
   L'anteprima employees conserva le colonne e segnala le anteprime BLOB limitate;
   il dato completo rimane nel dataset. Non confondere limite di visualizzazione
   con perdita di dati durante l'importazione.
9. `SELECT * FROM order_details;`: massimo 500 righe e avviso di limite. Una query
   aggregata COUNT restituisce comunque il totale completo 2155.
10. Aprire Practice, scegliere uno dei cinque quesiti e confrontare l'enunciato
    originale con il file. Leggere il contratto di output prima di rispondere.
    Eseguire e verificare: sono azioni differenti. Verifica usa cinque fixture;
    cronologia e versione esercizio vengono salvate. La soluzione si apre su richiesta.
11. Nel quesito 3 provare questa risposta, accidentalmente corretta sull'originale:

```sql
SELECT sname FROM Sailors
GROUP BY sname
HAVING COUNT(*)>1 AND MAX(age)-MIN(age)<=10;
```

   La fixture ufficiale coincide, ma almeno una aggiuntiva segnala differenza.
   Cambiare `<=10` in `<10`: superamento sulle cinque fixture. Leggere comunque il
   limite della verifica finita. Provare un LIMIT: consentito in Esegui, escluso in Verifica.
12. Completare una lettura dello Sprint 1 e svolgere un quiz: devono ancora funzionare.
    Esportare dalle Impostazioni: JSON v3 con lessons, quizAttempts, attempts, sqlHistory.
    L'import mantiene anteprima e conferma. Per un ripristino in archivio vuoto usare
    un profilo browser separato: non cancellare quello principale per effettuare prove.
13. Ridurre la finestra a 390 px. Tabelle scorrono nel proprio contenitore, editor
    testuale e Monaco sono disponibili, pulsanti raggiungibili da tastiera.
14. Controllare Network: soltanto 127.0.0.1:3000. Il worker SQL ha connect-src none;
    i file WASM, worker Monaco e moduli sono locali. Non bloccare il server locale.

## Comandi di verifica eseguiti nello sprint

```powershell
npm run lint
npm run typecheck
npm test
npm run test:sql-import
npm run build
npm run test:e2e
npm audit
```

I test browser usano profili isolati e non cancellano i dati dell'utente. La prova
mobile è emulazione Chromium, non una certificazione Safari/dispositivo fisico.
Algebra, ER, tutor AI, autenticazione e multiutente restano esclusi.

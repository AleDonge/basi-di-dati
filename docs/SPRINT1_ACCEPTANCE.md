# Verifica manuale Sprint 1

Prerequisiti: `npm ci`, poi `npm run dev`, oppure `npm run build` e `npm start`.
Aprire sempre **http://127.0.0.1:3000** nello stesso browser e profilo.

1. Dalla dashboard entrare in Learn: sono presenti nove anteprime in due moduli.
   Controllare che tutte riportino needs-review, senza lezioni verificate.
2. Aprire “Dati, DBMS e sistemi di basi di dati”: obiettivi, indice dei paragrafi,
   testo, diagramma, tabelle, fonti, riepilogo e quiz devono essere consultabili.
3. Aprire una fonte: il PDF locale si apre sulla pagina richiesta. L'indice delle
   fonti consente l'apertura soltanto dei due PDF usati nelle lezioni.
4. Svolgere una domanda con risposta errata: compare una spiegazione. Riprovare
   con quella corretta. Svolgere vero/falso e selezione multipla. Il completamento
   della lettura deve restare invariato.
5. Segnare la lezione come completata. Ricaricare e verificare data, segno nella
   navigazione, cronologia del quiz e avanzamento. Annullare il completamento:
   i tentativi devono rimanere disponibili.
6. Visitare una seconda lezione, tornare alla dashboard e usare “Continua”.
7. Nelle Impostazioni, esportare il JSON. Controllare schemaVersion 2, lessons e
   quizAttempts: gli ID e le versioni sono espliciti, le date sono ISO.
8. Reimportare il medesimo file. Prima della conferma non deve cambiare nulla.
   “Annulla importazione” chiude l'anteprima senza scritture. Ripetere, confermare
   la casella e importare: non si duplicano i tentativi identici.
9. Provare un JSON non valido o una versione sconosciuta: errore comprensibile,
   nessuna modifica locale. Non cancellare il proprio archivio per fare questa prova.
10. Facoltativo: usare un profilo browser separato e importare il backup per
    verificare il ripristino in un ambiente vuoto, senza alterare quello principale.
11. Ridurre la larghezza a 390 px: la navigazione scorre, indice e tabelle sono
    accessibili, nessun overflow dell'intera pagina. Provare anche solo tastiera,
    inclusi skip link, elenco delle lezioni, indice e controlli del quiz.
12. Senza connessione Internet, mantenendo il server locale acceso, leggere e
    rispondere ai quiz. Le richieste devono restare all'origine 127.0.0.1:3000;
    font KaTeX e risorse sono locali. Non impostare offline il server stesso.

L'aggiunta di una lezione e la migrazione v1→v2 sono verificate automaticamente
con test di crescita del catalogo, IndexedDB e import legacy. I test browser usano
archivi isolati e non cancellano i progressi del profilo principale dell'utente.

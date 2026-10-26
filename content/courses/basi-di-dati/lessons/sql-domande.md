---
{
  "id": "sql-domande",
  "moduleId": "sql",
  "slug": "sql-domande",
  "title": "Dalla domanda al contratto di una query",
  "mdxPath": "lessons/sql-domande.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 1,
      "pageEnd": 12,
      "section": "Dalla domanda al contratto di una query"
    },
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 77,
      "pageEnd": 84,
      "section": "Dalla domanda al contratto di una query"
    }
  ],
  "concepts": [
    "SQL",
    "DDL",
    "DML",
    "contratto di output"
  ],
  "description": "Percorso ragionato: dalla domanda al contratto di una query, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare SQL distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 27,
  "prerequisites": [
    "schema-istanza"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-domande.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e obiettivo

SQL è un linguaggio per descrivere e interrogare basi di dati relazionali. Le pp. 2–3 distinguono DDL, che definisce gli schemi, e DML, che interroga e modifica i dati. Una query non è però soltanto una frase sintatticamente valida: deve rispondere a una domanda precisa. Le pp. 4–8 insistono sulle assunzioni necessarie per trasformare un bisogno informativo in un risultato utile. Prima di scegliere gli operatori, stabilisci quale fatto rappresenti ogni riga della risposta.

La domanda «quanti utenti attivi?» non definisce da sola attività, periodo, utenti di test e identità da contare. Contare eventi di login e contare persone distinte produce misure differenti. La slide p. 5 usa COUNT(user_id): non va presentato come conteggio universale degli utenti. La precisazione è della piattaforma: più eventi dello stesso identificativo pesano più volte, mentre un identificativo NULL non viene contato da COUNT(user_id).

## Un contratto prima del codice

Un contratto di output descrive colonne, unità di osservazione, filtri, duplicati, ordine e casi senza dati. Non è un nuovo comando SQL: è una descrizione verificabile della richiesta. Per «elenca i marinai con rating almeno 8» possiamo chiedere sid, sname e rating, una riga per marinaio, senza ordine obbligatorio. sid distingue gli omonimi; non basta il nome per contare persone.

| Decisione | Contratto dell'esempio | Errore che previene |
|---|---|---|
| Popolazione | Righe di Sailors | Confondere marinai con prenotazioni |
| Soglia | rating >= 8 | Escludere chi ha esattamente 8 |
| Colonne | sid, sname, rating | Restituire campi non richiesti |
| Molteplicità | Una riga per sid | Fondere persone omonime |
| Ordine | Non richiesto | Affidarsi all'ordine di inserimento |

## Esempio eseguibile nel laboratorio

```sql
SELECT sid, sname, rating
FROM Sailors
WHERE rating >= 8;
```

Questa SELECT è eseguibile su Sailors in SQLite. Leggi lo schema nell'esploratore prima di avviarla. Il risultato è composto da cinque marinai dello script ufficiale: sid 31, 32, 58, 71 e 74. Non è una trascrizione della tabella a p. 12: le figure e lo script presentano differenze dichiarate. Per le esercitazioni del laboratorio prevalgono i dati dello script convertito.

## Progettazione guidata

Parti da «quali marinai hanno prenotato?». L'unità desiderata è la persona, ma Reserves contiene prenotazioni. Un join produce una riga per prenotazione; la stessa persona può ricomparire. Prima di scrivere DISTINCT, chiediti quali colonne definiscano l'identità da mantenere. La lezione sulle sottoquery userà EXISTS per esprimere direttamente l'esistenza di almeno una prenotazione. Questa scomposizione segue le regole pratiche delle pp. 78–84 senza anticipare una soluzione ufficiale.

Per controllare una risposta costruisci un controesempio piccolo: una persona con due prenotazioni, un omonimo senza prenotazioni, una persona sulla soglia. Una query che funziona sulla prima istanza può fallire su questi casi. Le fixture del correttore automatizzano parte di questo lavoro; la loro coincidenza finita non dimostra equivalenza generale.

## Dialetto e confini

Il corso presenta MySQL/MariaDB, mentre SQL Lab esegue SQLite in sola lettura. DDL, inserimenti, amministrazione e programmi JDBC/Python si studiano nelle lezioni, ma non si eseguono nell'editor protetto. DATEDIFF della p. 8 non è una funzione disponibile nel laboratorio. L'ordine logico dei passaggi aiuta a ragionare; non obbliga il DBMS a costruire fisicamente tutti i prodotti cartesiani. Non dedurre costi o tempi dal solo numero di clausole.

## Errori comuni ed esercizio guidato

«Nessun errore SQL» non significa «domanda soddisfatta». Non usare il risultato corrente come definizione del requisito e non attribuire al docente i contratti aggiuntivi della piattaforma. Modifica la soglia dell'esempio da >=8 a >8: prevedi prima quali sid scompariranno e poi esegui. Scrivi anche quale scelta sui NULL stai facendo: WHERE mantiene soltanto condizioni vere.

## Riepilogo

Definisci popolazione, identità, filtri, colonne, duplicati e ordine; poi scegli gli operatori. Controlla i risultati con casi che potrebbero smentire la tua interpretazione. La verifica automatica resta subordinata al contratto e ai limiti del dialetto.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 1–12](/sources/sql-source#page=1). [Argomento04 SQL.pdf, pp. 77–84](/sources/sql-source#page=77).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

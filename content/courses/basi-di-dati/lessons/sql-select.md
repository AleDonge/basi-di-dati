---
{
  "id": "sql-select",
  "moduleId": "sql",
  "slug": "sql-select",
  "title": "SELECT, alias, duplicati e ordinamento",
  "mdxPath": "lessons/sql-select.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 13,
      "pageEnd": 17,
      "section": "SELECT, alias, duplicati e ordinamento"
    },
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 86,
      "pageEnd": 86,
      "section": "SELECT, alias, duplicati e ordinamento"
    }
  ],
  "concepts": [
    "SELECT",
    "DISTINCT",
    "ORDER BY"
  ],
  "description": "Percorso ragionato: select, alias, duplicati e ordinamento, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare SELECT distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 28,
  "prerequisites": [
    "sql-domande"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-select.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e lettura delle clausole

SELECT descrive le espressioni da restituire; FROM individua le sorgenti; WHERE decide quali righe partecipano. Le pp. 14–15 propongono una strategia concettuale: costruire le combinazioni delle sorgenti, filtrare, scegliere le colonne ed eventualmente eliminare duplicati. È un modello logico, non l'algoritmo imposto all'ottimizzatore. Con una sola tabella si può iniziare controllando ogni riga indipendentemente dalle altre.

Un alias di tabella è un nome locale per riferirsi a una sorgente, come s in FROM Sailors AS s. Un alias di colonna etichetta un'espressione nel risultato, come s.sname AS nome. La figura a p. 16 etichetta s in modo ambiguo: qui distinguiamo le due funzioni esplicitamente. Nessun alias modifica nomi o dati della tabella persistente.

## Dalla tabella alla lista richiesta

Considera questi dati sintetici, distinti dall'istanza ufficiale:

| sid | sname | rating |
|---:|---|---:|
| 1 | Ada | 8 |
| 2 | Ada | 8 |
| 3 | Nora | 9 |

SELECT sname produce Ada, Ada, Nora. SELECT DISTINCT sname produce Ada, Nora. SELECT DISTINCT sid, sname produce tre righe perché DISTINCT confronta l'intera tupla di output, non la sola colonna del nome. Aggiungere una chiave cambia quindi ciò che può essere considerato duplicato. Questa è una differenza essenziale dalla proiezione dell'algebra classica, che elimina sempre tuple identiche.

## Esempio eseguibile: ordine totale dichiarato

```sql
SELECT s.sid, s.sname AS nome, s.rating
FROM Sailors AS s
ORDER BY s.rating DESC, s.sid ASC;
```

La query ordina prima per rating decrescente e, a parità, per sid crescente. Sullo script il gruppo con rating 10 contiene 58 e 71, in questo ordine; segue 74 con rating 9. Una seconda chiave di ordinamento rende deterministica la presentazione delle parità. Senza ORDER BY non è garantito l'ordine, anche se per molte esecuzioni sembra seguire la primaria o l'inserimento.

## Ordinare non significa scegliere un solo massimo

ORDER BY cambia la sequenza delle righe, non elimina le parità. LIMIT 1, disponibile nell'esecuzione libera SQLite, restituisce una sola riga: non risponde a «tutti i marinai con rating massimo». Il caso viene approfondito alle pp. 32–34. Negli esercizi con contratto completo LIMIT/OFFSET sono esclusi dalla verifica: un limite apparentemente grande può troncare risposte su istanze future. Non confondere un limite volontario della query con il limite di 500 righe imposto dal laboratorio.

## Esercizio guidato

Esegui SELECT sname FROM Sailors e conta dieci righe; poi aggiungi DISTINCT e osserva nove nomi perché due sid sono Horatio. Aggiungi sid alla SELECT DISTINCT: le righe tornano dieci. Ora ordina per sname e sid. Chiediti se la richiesta riguardi nomi distinti oppure persone: entrambe le query possono essere sensate ma rispondono a domande diverse.

Per progettare l'output annota il numero e la posizione delle colonne. Il correttore SQL permette alias differenti ma confronta i valori per posizione. Scambiare nome e sid viola il contratto anche quando gli stessi valori compaiono da qualche parte nella tabella. SELECT * è utile per esplorare, ma rende l'output dipendente da tutte le colonne dello schema; in una risposta precisa preferisci una lista esplicita.

## Compatibilità ed errori comuni

SELECT, alias, DISTINCT e ORDER BY degli esempi sono accettati dal laboratorio e appartengono al percorso del corso. Ordinamento di testo, maiuscole, accenti e posizione dei NULL possono dipendere da dialetto e collation: non certificare l'ordine MySQL osservando SQLite. Non aspettarti che DISTINCT ordini automaticamente. Non usare l'alias del risultato come se fosse una nuova colonna persistente e non confondere proiezione di colonne con filtro di righe.

## Riepilogo

Definisci una lista di output, conserva o elimina duplicati secondo il requisito e richiedi un ordine esplicito quando serve. Un ordinamento con chiave di spareggio evita risposte instabili; la scelta dell'identità precede l'uso di DISTINCT.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 13–17](/sources/sql-source#page=13). [Argomento04 SQL.pdf, pp. 86–86](/sources/sql-source#page=86).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

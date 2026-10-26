---
{
  "id": "sql-gruppi",
  "moduleId": "sql",
  "slug": "sql-gruppi",
  "title": "GROUP BY e HAVING: ragionare per gruppi",
  "mdxPath": "lessons/sql-gruppi.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 25,
      "pageEnd": 30,
      "section": "GROUP BY e HAVING: ragionare per gruppi"
    }
  ],
  "concepts": [
    "GROUP BY",
    "HAVING",
    "aggregazioni"
  ],
  "description": "Percorso ragionato: group by e having: ragionare per gruppi, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare GROUP BY distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 31,
  "prerequisites": [
    "sql-aggregati"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-gruppi.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e intuizione

GROUP BY partiziona le righe in gruppi con uguali valori delle espressioni di raggruppamento. Gli aggregati vengono calcolati separatamente in ogni gruppo. HAVING decide quali gruppi conservare. Le pp. 25–30 sviluppano questa estensione per contare prenotazioni per barca e calcolare età medie per rating. Il gruppo è l'unità della risposta: una riga per rating non è una riga per marinaio.

La sequenza logica è FROM/JOIN, WHERE, GROUP BY, HAVING, SELECT e ORDER BY. WHERE filtra righe prima del calcolo; HAVING filtra gruppi usando valori definiti per gruppo. Spostare un filtro da una fase all'altra può cambiare la popolazione su cui si calcola la media. Non è una riscrittura innocua soltanto perché il risultato corrente coincide.

## Esempio sintetico con passaggi

| sid | rating | age |
|---:|---:|---:|
| 1 | 7 | 18 |
| 2 | 7 | 30 |
| 3 | 7 | 16 |
| 4 | 8 | 40 |

Con WHERE age>=18 restano 1, 2 e 4. Il gruppo rating 7 ha due persone ed età media 24; rating 8 ha una persona ed età media 40. HAVING COUNT(*)>=2 conserva solo il primo gruppo. Se raggruppassi prima senza WHERE, rating 7 conterrebbe anche il sedicenne: numero e media cambierebbero. Le tabelle sono aggiunte didattiche, non una nuova istanza ufficiale.

## Query eseguibile su Sailors

```sql
SELECT rating, COUNT(*) AS persone, AVG(age) AS eta_media
FROM Sailors
WHERE age >= 18
GROUP BY rating
HAVING COUNT(*) >= 2
ORDER BY rating;
```

La risposta ufficiale ha rating 3, 7 e 8, ciascuno con due persone. Le età medie sono rispettivamente 43, 40 e 40.5. Il rating 10 ha soltanto una persona maggiorenne e viene escluso dal filtro dei gruppi. Prima controlla il risultato di WHERE da solo, poi aggiungi il raggruppamento e soltanto alla fine HAVING. Questo metodo rende localizzabile un errore senza riscrivere tutta la query.

## Una colonna deve avere un significato per gruppo

La p. 26 richiede che le colonne non aggregate della SELECT compaiano nella lista GROUP BY. Per una regola didattica robusta, raggruppa esplicitamente tutte le colonne descrittive dell'output. Alcuni DBMS riconoscono dipendenze funzionali, ma ciò non giustifica scegliere un sname arbitrario per un gruppo di rating condiviso da più persone.

SQLite può accettare bare columns che la modalità ONLY_FULL_GROUP_BY di MySQL rifiuta o che non hanno un significato univoco nel requisito. Il motore locale non è quindi un controllore della disciplina di raggruppamento del corso. La query errata di p. 28, che accosta rating e AVG(age) senza GROUP BY, non diventa didatticamente corretta perché un motore permissivo la esegue.

## NULL, gruppi vuoti e conteggi

I NULL della chiave di raggruppamento vengono raccolti nello stesso gruppo. COUNT(*) continua a contare le righe, COUNT(age) soltanto età note. Una tabella vuota con GROUP BY non produce gruppi e restituisce zero righe; una SELECT globale con COUNT(*) senza GROUP BY produce invece una riga con zero. Questa differenza è importante nei test indipendenti e nei contratti degli esercizi.

## Esercizio guidato ed errori comuni

Conta le prenotazioni per bid in Reserves; poi conserva soltanto conteggi maggiori di 2. Il contratto riguarda barche prenotate: una barca senza prenotazioni non genera un gruppo. Per includerla servirà un outer join, non un diverso HAVING. Cambia >2 in >=2 e prevedi quali gruppi sul confine si aggiungano.

Non usare aggregati in WHERE nello stesso livello, non confondere numero di persone con numero di prenotazioni dopo un join e non omettere la chiave del gruppo solo perché non viene mostrata. Riepilogando, definisci la popolazione prima del raggruppamento, il significato di ogni misura e la soglia applicata ai gruppi. La verifica su fixture controlla esempi finiti, non ogni uso possibile delle bare columns.

## Riepilogo

WHERE seleziona la popolazione; GROUP BY definisce unità aggregabili; HAVING filtra i gruppi. Controlla NULL, input vuoto e significato di ogni colonna non aggregata.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 25–30](/sources/sql-source#page=25).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

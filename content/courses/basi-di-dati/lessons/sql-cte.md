---
{
  "id": "sql-cte",
  "moduleId": "sql",
  "slug": "sql-cte",
  "title": "Sottoquery, CTE, tabelle temporanee e viste",
  "mdxPath": "lessons/sql-cte.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 46,
      "pageEnd": 57,
      "section": "Sottoquery, CTE, tabelle temporanee e viste"
    }
  ],
  "concepts": [
    "CTE",
    "WITH",
    "vista",
    "tabella temporanea"
  ],
  "description": "Percorso ragionato: sottoquery, cte, tabelle temporanee e viste, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare CTE distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 35,
  "prerequisites": [
    "sql-insiemi"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-cte.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizioni e durata

Le pp. 46–57 confrontano quattro modi di organizzare un calcolo. Una sottoquery è annidata nel testo di un'altra SELECT. Una CTE, introdotta da WITH, assegna un nome a un risultato nell'ambito di una singola istruzione. Una tabella temporanea memorizza dati per una durata limitata prevista dal DBMS. Una vista ordinaria conserva una definizione di interrogazione, richiamabile per nome, senza essere una copia materializzata del suo risultato.

Durata del nome e materializzazione del risultato sono domande diverse. Una CTE non garantisce da sola che il motore calcoli il corpo una sola volta o lo conservi in memoria: sono scelte del piano. Una vista persistente può mostrare dati aggiornati delle tabelle di base perché la sua definizione viene interrogata nuovamente. Il vantaggio didattico principale è rendere espliciti passaggi e responsabilità della query.

| Costrutto | Nome riutilizzabile | Dati persistenti propri? | SQL Lab |
|---|---|---|---|
| Sottoquery | Nel suo livello | No | Lettura ammessa |
| CTE | Nella singola istruzione | Non garantiti | Lettura ammessa |
| Tabella temporanea | Sessione secondo DBMS | Dati temporanei | Creazione vietata |
| Vista ordinaria | Finché esiste la definizione | No | Creazione vietata |

## Esempio eseguibile con risultato intermedio

```sql
WITH PrenotazioniPerMarinaio AS (
  SELECT sid, COUNT(*) AS n
  FROM Reserves
  GROUP BY sid
)
SELECT sid, n
FROM PrenotazioniPerMarinaio
WHERE n >= 3
ORDER BY sid;
```

La CTE produce una riga per prenotante; la SELECT esterna conserva conteggi almeno 3. Sullo script restituisce (22,4) e (31,3). Il nome n è una colonna del risultato intermedio, quindi può comparire nel WHERE del livello esterno senza essere un aggregato di quel livello. Chi non prenota non compare nel raggruppamento: introdurre una CTE non crea gruppi mancanti.

## Procedura guidata di riscrittura

Esegui prima il corpo SELECT sid,COUNT(*) FROM Reserves GROUP BY sid. Controlla i quattro gruppi. Poi racchiudilo nella CTE, aggiungi la SELECT esterna e soltanto infine la soglia. Puoi ottenere la medesima risposta con una tabella derivata in FROM o con HAVING COUNT(*)>=3 nel livello aggregato. Il nome del costrutto non rende la risposta più corretta: la verifica riguarda popolazione, aggregazione e filtro.

Per usare più CTE separa le definizioni con virgole dopo un unico WITH; termina con una SELECT che le usa. I nomi hanno un ambito locale e non vengono salvati tra pressioni del pulsante Esegui. Ogni query del laboratorio usa un database effimero nuovo. Non interpretare questo reset come comportamento generale delle sessioni MySQL.

## Ambiguità degli esempi della fonte

Le pp. 49–53 filtrano vendite con MONTH(data)=MONTH(CURDATE()). Senza confrontare anche l'anno, il filtro può includere lo stesso mese di anni diversi. Inoltre le pp. 50 e 53 usano <2000, mentre la richiesta di p. 48 e altre versioni mantengono importi sopra 2000. Non vengono presentate come quattro riscritture equivalenti. Un intervallo di date esplicito e una soglia coerente devono precedere qualunque confronto.

MONTH e CURDATE non sono disponibili nel motore locale. Gli esempi Sailors evitano funzioni temporali non supportate; CREATE TEMPORARY TABLE e CREATE VIEW sono soltanto teoria, poiché richiedono scritture vietate. La durata delle tabelle temporanee dipende dal prodotto: non è universale la cancellazione a ogni COMMIT. In MySQL una tabella temporanea è normalmente legata alla sessione.

## Riepilogo ed errori comuni

Non aspettarti una CTE disponibile nella query successiva, non confondere vista con snapshot immutabile e non dedurre prestazioni dalla maggiore leggibilità. Le limitazioni sulle viste riportate dalla fonte sono indicazioni da contestualizzare, non un divieto generale di viste complesse. Per scegliere il costrutto, chiediti se servano soltanto chiarezza in una SELECT, dati intermedi riutilizzabili nella sessione o una definizione persistente. Nel laboratorio esercita soltanto le forme di lettura e annota le differenze di dialetto.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 46–57](/sources/sql-source#page=46).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

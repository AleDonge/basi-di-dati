---
{
  "id": "sql-join",
  "moduleId": "sql",
  "slug": "sql-join",
  "title": "JOIN: ricostruire fatti e controllare molteplicità",
  "mdxPath": "lessons/sql-join.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 58,
      "pageEnd": 62,
      "section": "JOIN: ricostruire fatti e controllare molteplicità"
    },
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 87,
      "pageEnd": 88,
      "section": "JOIN: ricostruire fatti e controllare molteplicità"
    }
  ],
  "concepts": [
    "JOIN",
    "ON",
    "chiavi",
    "molteplicità"
  ],
  "description": "Percorso ragionato: join: ricostruire fatti e controllare molteplicità, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare JOIN distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 36,
  "prerequisites": [
    "sql-cte"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-join.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e intuizione

Un inner join combina ogni coppia di righe che soddisfa il predicato ON. Le pp. 58–62 spiegano come ricostruire informazioni distribuite tra tabelle; le pp. 87–88 applicano i collegamenti a Sailors, Reserves e Boats. Il risultato non è una fusione basata sulla vicinanza grafica delle colonne. Devi dichiarare quali valori individuino il medesimo fatto o il riferimento tra fatti diversi.

Un join tra una chiave primaria e una chiave esterna valida collega ogni riga referenziante al suo genitore, salvo NULL ammessi e altri filtri. Il nome uguale non è sufficiente: due colonne chiamate id possono identificare entità diverse. In NorthWind il dump non dichiara le FK; gli otto collegamenti convenzionali controllati dalla piattaforma sono relazioni interpretative aggiuntive, non vincoli ufficialmente presenti nello script.

## Esempio con passaggi sintetici

| Sailors.sid | sname |
|---:|---|
| 1 | Ada |
| 2 | Nora |

| Reserves.sid | bid |
|---:|---:|
| 1 | 101 |
| 1 | 102 |

Il join su sid produce (1,Ada,101) e (1,Ada,102). Nora non compare perché non ha una corrispondenza. Ada compare due volte: le righe descrivono due prenotazioni differenti. SELECT sname dal join conserva due Ada; DISTINCT sname può eliminarne una, ma può anche fondere persone omonime. Prima scegli l'identità da mantenere, poi decidi come eliminare duplicati.

## Query eseguibile: prenotazioni di barche rosse

```sql
SELECT s.sid, s.sname, b.bid, r.day
FROM Sailors AS s
JOIN Reserves AS r ON r.sid = s.sid
JOIN Boats AS b ON b.bid = r.bid
WHERE b.color = 'red'
ORDER BY s.sid, b.bid, r.day;
```

La prima condizione collega la prenotazione alla persona; la seconda alla barca. Il filtro seleziona il colore della barca. Il contratto è una riga per prenotazione rossa, non una riga per persona. Sullo script ufficiale sono cinque righe. Le figure possono avere dettagli di nomi differenti: nessun dato illustrativo è stato aggiunto al dataset del laboratorio.

## Forma con prodotto e WHERE

Per inner join, FROM Sailors s,Reserves r WHERE s.sid=r.sid può descrivere lo stesso collegamento della forma JOIN ON. Separare ON dai filtri della domanda rende più evidente un legame dimenticato. Omettere completamente il predicato genera combinazioni cartesiane: dieci Sailors per dieci Reserves significano cento coppie prima di ulteriori filtri. Un conteggio elevato è un segnale, non una prova automatica dell'errore.

Non trasferire lo spostamento dei predicati agli outer join senza analizzarlo: ON decide le corrispondenze, WHERE può eliminare righe già completate con NULL. La lezione successiva mostrerà il caso. Per join con più copie della stessa tabella usa alias distinti e qualifica le colonne comuni; un nome ambiguo va risolto, non affidato a una scelta implicita del parser.

## Esercizio guidato NorthWind

Leggi products e categories nell'esploratore. ProductID identifica il prodotto, CategoryID ne indica la categoria. Progetta un output ProductID, ProductName, CategoryName; collega products.CategoryID a categories.CategoryID. Prima conta i prodotti, poi controlla se il join mantiene il conteggio o perde righe. Una categoria con più prodotti deve apparire più volte: la sua descrizione è ripetuta nel risultato senza che la categoria venga duplicata nella base.

## Riepilogo: Compatibilità, errori e riepilogo

Le query con JOIN ON sono supportate nel laboratorio. Evita NATURAL JOIN senza controllare tutti i nomi comuni: una futura colonna omonima potrebbe cambiare il collegamento. Non usare DISTINCT per nascondere un prodotto non filtrato, non collegare nomi al posto delle chiavi e non confondere conteggio di righe risultanti con persone uniche. Per ogni join annota predicato, cardinalità attesa e fatti che possono scomparire; poi verifica casi con zero, una e più corrispondenze.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 58–62](/sources/sql-source#page=58). [Argomento04 SQL.pdf, pp. 87–88](/sources/sql-source#page=87).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

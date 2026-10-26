---
{
  "id": "sql-sottoquery",
  "moduleId": "sql",
  "slug": "sql-sottoquery",
  "title": "Sottoquery scalari, IN ed EXISTS",
  "mdxPath": "lessons/sql-sottoquery.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 31,
      "pageEnd": 40,
      "section": "Sottoquery scalari, IN ed EXISTS"
    },
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 45,
      "pageEnd": 45,
      "section": "Sottoquery scalari, IN ed EXISTS"
    }
  ],
  "concepts": [
    "sottoquery",
    "EXISTS",
    "IN",
    "correlazione"
  ],
  "description": "Percorso ragionato: sottoquery scalari, in ed exists, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare sottoquery distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 32,
  "prerequisites": [
    "sql-gruppi"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-sottoquery.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e forma del risultato interno

Una sottoquery è una SELECT contenuta in un'altra interrogazione. Può fornire un valore, una colonna di valori o una tabella derivata, secondo il punto in cui compare. Le pp. 31–40 introducono il massimo rating e la presenza di prenotazioni; la p. 45 distingue collocazione in FROM, WHERE e HAVING. Prima di annidare, scrivi il contratto della query interna: quante colonne e quante righe può restituire?

Una sottoquery scalare deve rappresentare un solo valore. In MySQL più righe in quel contesto sono un errore; SQLite può prendere la prima riga, quindi il comportamento locale non certifica la portabilità. Un aggregato MAX senza GROUP BY produce esattamente una riga e una colonna: è un modo appropriato per ottenere il massimo globale, anche quando il valore risultante è NULL su input vuoto.

## Massimo con tutte le parità

```sql
SELECT sid, sname, rating
FROM Sailors
WHERE rating = (SELECT MAX(rating) FROM Sailors)
ORDER BY sid;
```

Il confronto riguarda ogni marinaio e un valore globale. Sul dataset ufficiale restituisce 58 e 71, entrambi con rating 10. ORDER BY rating DESC LIMIT 1 perderebbe una delle parità: la p. 34 segnala precisamente questa differenza semantica. MAX non può invece essere inserito direttamente in WHERE allo stesso livello per confrontare la singola riga con tutte le altre.

## Correlata significa dipendenza logica

Una sottoquery indipendente non usa attributi della query esterna; una correlata li usa. Nel modello concettuale puoi valutare la seconda per ciascuna riga esterna, sostituendo i suoi valori. Non è una garanzia sul numero fisico di esecuzioni: l'ottimizzatore può trasformare il piano. Le pp. 33 e 36 offrono un'intuizione operativa, che qui separiamo dalla strategia effettiva del motore.

| Sailor sintetico | Prenotazioni correlate | EXISTS | NOT EXISTS |
|---|---:|---|---|
| sid 1 | 2 | TRUE | FALSE |
| sid 2 | 0 | FALSE | TRUE |

EXISTS controlla se la query interna produce almeno una riga; non usa il valore della sua SELECT. SELECT 1 è quindi una convenzione leggibile. Il numero di prenotazioni non moltiplica la riga esterna: è il vantaggio rispetto a un join quando la domanda richiede soltanto esistenza.

## Esempio guidato: chi non ha prenotato

```sql
SELECT s.sid, s.sname
FROM Sailors AS s
WHERE NOT EXISTS (
  SELECT 1 FROM Reserves AS r WHERE r.sid = s.sid
);
```

Prima scegli un sid e controlla manualmente Reserves; poi interpreta la sottoquery con quel valore. Omettere r.sid=s.sid rende il test globale: se esiste una qualsiasi prenotazione, NOT EXISTS è falso per tutti. Questo errore può nascondersi su un dataset vuoto e richiede fixture con prenotanti e non prenotanti.

## Appartenenza e valori mancanti

IN verifica se il valore esterno appartiene ai valori della colonna interna. NOT IN richiede cautela se quella colonna può contenere NULL: un mancato match con un NULL nella lista può produrre UNKNOWN ed escludere la riga. NOT EXISTS con un predicato esplicito spesso rappresenta più chiaramente «nessuna corrispondenza». Nel Sailors ufficiale Reserves.sid è non NULL, ma non trasferire questa proprietà a qualsiasi nuova sorgente.

## Riepilogo: tabella derivata ed errori

In FROM una sottoquery definisce una relazione utilizzabile dal livello esterno; assegnale un alias esplicito. Puoi prima raggruppare e poi filtrare la colonna calcolata nel livello superiore. Il fatto che un risultato intermedio sia nominabile non implica una tabella persistente. Le CTE offriranno una forma equivalente più leggibile.

Tutte le query mostrate sono letture compatibili con il laboratorio. Non confondere dipendenza logica e prestazioni, non usare una sottoquery multiriga come scalare e non dimenticare i legami di correlazione. Controlla parità, NULL e input vuoto: una sola istanza non prova equivalenza di due formulazioni.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 31–40](/sources/sql-source#page=31). [Argomento04 SQL.pdf, pp. 45–45](/sources/sql-source#page=45).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

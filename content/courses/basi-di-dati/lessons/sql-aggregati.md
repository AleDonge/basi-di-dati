---
{
  "id": "sql-aggregati",
  "moduleId": "sql",
  "slug": "sql-aggregati",
  "title": "Aggregazioni e unità da contare",
  "mdxPath": "lessons/sql-aggregati.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 20,
      "pageEnd": 24,
      "section": "Aggregazioni e unità da contare"
    }
  ],
  "concepts": [
    "COUNT",
    "SUM",
    "AVG",
    "MIN",
    "MAX"
  ],
  "description": "Percorso ragionato: aggregazioni e unità da contare, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare COUNT distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 30,
  "prerequisites": [
    "sql-filtri"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-aggregati.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e livello del risultato

Un'aggregazione riassume una collezione di righe in un valore. Le pp. 20–24 passano dalla domanda «quali prenotazioni?» alla domanda «quante prenotazioni?». COUNT(*) conta righe; SUM somma valori; AVG ne calcola la media; MIN e MAX cercano gli estremi. Il risultato non è una riga rappresentativa scelta a caso: è una misura calcolata sull'insieme di input ammesso dai filtri.

Senza GROUP BY, una SELECT composta soltanto da aggregati produce una riga anche se l'input è vuoto: COUNT vale zero, mentre SUM, AVG, MIN e MAX restituiscono NULL. Zero e assenza di una somma non sono sempre lo stesso significato. COALESCE può sostituire NULL con un valore solo quando il contratto lo richiede; non va aggiunto per rendere la tabella apparentemente più bella.

## Che cosa succede ai NULL

COUNT(A) conta i valori non NULL di A, mentre COUNT(*) include tutte le righe. SUM, AVG, MIN e MAX ignorano i NULL dell'argomento. Una media non divide quindi per il numero totale delle righe se alcune osservazioni mancano. DISTINCT all'interno dell'aggregato elimina valori uguali dell'argomento prima del calcolo: non riconosce automaticamente persone distinte.

| age sintetica |
|---:|
| 20 |
| 20 |
| 40 |
| NULL |

| Espressione | Risultato |
|---|---:|
| COUNT(*) | 4 |
| COUNT(age) | 3 |
| COUNT(DISTINCT age) | 2 |
| SUM(age) | 80 |
| AVG(age) | 80/3 |
| AVG(DISTINCT age) | 30 |

Le due età 20 possono appartenere a persone diverse: eliminarne una non significa correggere un duplicato di persona. Il significato dipende dall'unità osservata. Se un join moltiplica una persona per le sue prenotazioni, la media delle età pesa ogni prenotazione. Per una media per persona occorre prima scegliere una riga per identificativo.

## Esempio eseguibile e precisazione della fonte

```sql
SELECT COUNT(*) AS marinai,
       COUNT(age) AS eta_note,
       MIN(rating) AS minimo,
       MAX(rating) AS massimo,
       AVG(rating) AS media
FROM Sailors;
```

Sullo script ufficiale trovi 10 marinai, 10 età note, rating minimo 1, massimo 10 e media 6.6. La p. 22 presenta AVG(s.rating) con FROM reserves r: l'alias s non è definito e la sorgente non è Sailors. La query qui sopra è un'aggiunta corretta della piattaforma, non una trascrizione certificata. Le tabelle della p. 24 aiutano a distinguere COUNT dei nomi da COUNT DISTINCT dei nomi.

## Esercizio guidato

Vuoi contare marinai che hanno prenotato almeno una volta. COUNT(*) su Reserves conta prenotazioni. COUNT(DISTINCT sid) su Reserves conta identificativi presenti, che nello schema rimandano ai marinai. Nel dataset ufficiale i due risultati sono 10 e 4. Scrivi prima la domanda in termini di unità e poi esegui entrambe le interrogazioni. La differenza è un'informazione sul significato, non un malfunzionamento del motore.

Per NorthWind distingui prezzo di listino corrente in products e prezzo registrato in order_details. Il secondo appartiene alla riga storica di vendita. Una somma delle quantità non è una somma monetaria; per un importo devi dichiarare prezzo, quantità, sconto e arrotondamento. Queste scelte verranno rese esplicite negli esercizi originali.

## Riepilogo: Compatibilità, errori e riepilogo

Gli aggregati mostrati sono disponibili nel laboratorio. Le colonne DECIMAL convertite in REAL usano aritmetica binaria: non promettere contabilità decimale esatta. In SQLite una divisione di interi può troncare; AVG produce invece un risultato numerico non limitato alla divisione intera. Non sostituire AVG con SUM/COUNT(*) senza controllare NULL, vuoto e tipo.

Evita colonne non aggregate accanto a una misura globale: la prossima lezione definirà il gruppo a cui devono appartenere. Per controllare un'aggregazione annota popolazione, peso di ogni riga, valori mancanti e comportamento sull'input vuoto. Un valore plausibile non basta a dimostrarne la correttezza.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 20–24](/sources/sql-source#page=20).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

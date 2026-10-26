---
{
  "id": "sql-filtri",
  "moduleId": "sql",
  "slug": "sql-filtri",
  "title": "Predicati, NULL, intervalli e pattern",
  "mdxPath": "lessons/sql-filtri.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 18,
      "pageEnd": 19,
      "section": "Predicati, NULL, intervalli e pattern"
    },
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 89,
      "pageEnd": 89,
      "section": "Predicati, NULL, intervalli e pattern"
    }
  ],
  "concepts": [
    "WHERE",
    "NULL",
    "LIKE",
    "BETWEEN",
    "IN"
  ],
  "description": "Percorso ragionato: predicati, null, intervalli e pattern, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare WHERE distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 29,
  "prerequisites": [
    "sql-select"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-filtri.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione: un filtro conserva soltanto il vero

WHERE valuta un predicato sulle righe disponibili. Le pp. 18–19 presentano confronti, BETWEEN, IN, LIKE e IS NULL. A differenza dell'algebra classica senza NULL, SQL deve trattare informazione mancante. Un confronto ordinario con NULL non produce vero o falso ma UNKNOWN. WHERE mantiene soltanto TRUE: sia FALSE sia UNKNOWN escludono la riga. NULL non è lo zero numerico, una stringa vuota o la parola testuale 'NULL'.

Per verificare la mancanza di un valore usa IS NULL; per la presenza usa IS NOT NULL. Scrivere age = NULL non trova le persone con età mancante. Nemmeno NOT(age = NULL) trova quelle note: la negazione di UNKNOWN rimane UNKNOWN. Questa precisazione sviluppa l'avvertenza esplicita della p. 18 senza fingere che il dataset Sailors ufficiale contenga NULL nelle età.

## Tabella di ragionamento aggiuntiva

| age sintetica | age > 30 | age IS NULL | passa WHERE age > 30? |
|---|---|---|---|
| 31 | TRUE | FALSE | Sì |
| 30 | FALSE | FALSE | No |
| NULL | UNKNOWN | TRUE | No |

AND richiede entrambi i predicati veri; OR richiede almeno un vero. FALSE AND UNKNOWN è FALSE, TRUE OR UNKNOWN è TRUE. Negli altri casi non risolti dalla parte nota può rimanere UNKNOWN. Usa parentesi per distinguere (rating=7 OR rating=8) AND age>=18 da rating=7 OR (rating=8 AND age>=18). NOT ha precedenza su AND, che precede OR.

## Esempio eseguibile su Sailors

```sql
SELECT sid, sname, age
FROM Sailors
WHERE age BETWEEN 18 AND 40
  AND rating IN (7, 8, 9)
ORDER BY sid;
```

BETWEEN include entrambi gli estremi: equivale qui a age>=18 AND age<=40. IN controlla l'appartenenza alla lista, quindi evita una catena di OR sugli stessi valori. Il risultato ufficiale contiene 32, 64 e 74. Per un requisito «più di 18» occorre invece >18: includere il confine sarebbe un errore semantico, non sintattico.

## Pattern e aritmetica

LIKE confronta testo con wildcard: % rappresenta una sequenza di zero o più caratteri, _ un singolo carattere. Un pattern 'B%' richiede che il testo inizi con B; '%B%' cerca B in qualsiasi posizione. Nella p. 89 compare anche aritmetica sulle età. In SQLite scrivi age-5 AS age1: la forma age1=age-5 di quella figura non è una definizione di alias portabile, può essere letta come confronto. Non viene copiata come esempio eseguibile.

Per gli apici usa delimitatori singoli ASCII e raddoppia un apostrofo interno. Le maiuscole nei confronti LIKE dipendono dal motore e dalla collation; il comportamento SQLite sui caratteri non certifica quello MySQL. Le formule degli esercizi evitano di basare il verdetto su equivalenze di collation non dichiarate.

## Date ed esercizio guidato

Le date Sailors convertite sono testo ISO YYYY-MM-DD. Un intervallo chiuso su date pure può usare BETWEEN. Se una colonna contiene anche orari, «fino al 31 agosto» non equivale sempre a <= '2025-08-31': un intervallo con estremo superiore escluso al primo settembre rappresenta l'intero giorno senza inventare l'ultimo istante. È un'aggiunta esplicativa della piattaforma; non presuppone fusi orari nel dataset.

Esegui l'esempio, poi sostituisci BETWEEN con >18 AND <40 e considera quali righe sul confine cambierebbero in una fixture. Prova a prevedere il risultato del filtro age IS NULL: sullo script ufficiale sarà vuoto. Non aggiungere NULL ai dati ufficiali per rendere l'esempio più interessante; le tabelle sintetiche servono a ragionare sui casi mancanti.

## Riepilogo ed errori comuni

Non usare =NULL, non trattare un risultato vuoto come errore, non dimenticare parentesi tra AND e OR e non confondere % con il carattere jolly di un filesystem. Un filtro è corretto soltanto rispetto a soglie, domini e casi mancanti dichiarati. Inizia da una tabella di verità piccola, poi traduci la decisione in SQL ed esegui.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 18–19](/sources/sql-source#page=18). [Argomento04 SQL.pdf, pp. 89–89](/sources/sql-source#page=89).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

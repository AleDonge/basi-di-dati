---
{
  "id": "sql-quantificatori",
  "moduleId": "sql",
  "slug": "sql-quantificatori",
  "title": "ANY e ALL: esistenza, universalità e NULL",
  "mdxPath": "lessons/sql-quantificatori.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 41,
      "pageEnd": 42,
      "section": "ANY e ALL: esistenza, universalità e NULL"
    }
  ],
  "concepts": [
    "ANY",
    "ALL",
    "quantificazione",
    "NULL"
  ],
  "description": "Percorso ragionato: any e all: esistenza, universalità e null, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare ANY distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 33,
  "prerequisites": [
    "sql-sottoquery"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-quantificatori.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione formale e domanda naturale

ANY e ALL confrontano un valore con i valori restituiti da una sottoquery. x > ANY(Q) richiede che almeno un confronto x>q sia vero; x > ALL(Q) richiede che tutti siano veri. Le pp. 41–42 usano i rating dei marinai chiamati Horatio. «Uno qualsiasi» nel linguaggio naturale è ambiguo: nella query ANY significa esistenza di almeno un valore favorevole, non maggiore di ogni valore possibile.

Per un insieme non vuoto senza NULL, x>ANY(Q) equivale a essere maggiore del minimo; x>ALL(Q) equivale a essere maggiore del massimo. Le ipotesi non sono decorazioni: insieme vuoto e valori mancanti impediscono di sostituire meccanicamente i quantificatori con MIN o MAX. Il massimo dell'insieme vuoto è NULL in SQL, mentre il confronto universale sul vuoto è vero.

## Una tabella di casi aggiuntiva

| x | Q | x > ANY(Q) | x > ALL(Q) |
|---:|---|---|---|
| 8 | 7,9 | TRUE | FALSE |
| 10 | 7,9 | TRUE | TRUE |
| 8 | vuoto | FALSE | TRUE |
| 8 | 7,NULL | TRUE | UNKNOWN |
| 8 | 9,NULL | UNKNOWN | FALSE |

ANY è falso quando tutti i confronti sono falsi o Q è vuoto; resta UNKNOWN quando non c'è un vero ma ci sono confronti sconosciuti. ALL è falso appena compare un confronto falso; senza falsi può restare UNKNOWN se esistono sconosciuti. WHERE conserva soltanto TRUE. La tabella è una spiegazione Database Academy che rende espliciti casi non sviluppati nelle due slide.

## Sintassi del corso: solo da studiare fuori dal lab

```sql
SELECT sid, sname, rating
FROM Sailors
WHERE rating > ALL (
  SELECT rating FROM Sailors WHERE sname = 'Horatio'
);
```

Questo è un esempio MySQL/MariaDB, non eseguibile direttamente in SQL Lab: SQLite non offre ANY/ALL come quantificatori di sottoquery. Sullo script, i rating dei due Horatio sono 7 e 9; la condizione universale richiede >9. Un Horatio con rating 9 supera invece >ANY perché è maggiore di 7. Non è una contraddizione: la persona può appartenere sia alla sorgente interna sia a quella esterna.

## Riscrittura eseguibile con ipotesi dichiarate

Se i rating confrontati sono non NULL, «maggiore di tutti» significa «non esiste un controesempio con rating maggiore o uguale». Puoi sperimentare questa variante SQLite:

```sql
SELECT s.sid, s.sname, s.rating
FROM Sailors AS s
WHERE s.rating IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM Sailors AS h
    WHERE h.sname = 'Horatio' AND h.rating >= s.rating
  );
```

L'esempio è valido per lo script ufficiale, dove i rating sono presenti. Non è annunciato come traduzione generale con NULL: la guardia esterna esclude NULL anche quando il divisore è vuoto, mentre ALL sul vuoto è vero. Un NULL interno, inoltre, non diventerebbe un controesempio vero nel predicato mostrato. Le differenze vanno studiate prima di riutilizzare una riscrittura.

## Esercizio guidato

Usa la tabella dei casi per prevedere x>ALL su una lista contenente soltanto NULL e su una lista vuota. Nel primo caso il confronto è UNKNOWN; nel secondo TRUE. Poi costruisci mentalmente un Horatio con rating NULL: la versione NOT EXISTS precedente potrebbe conservare righe che ALL non manterrebbe. Non alterare il dataset ufficiale: questi sono controesempi didattici sintetici.

## Riepilogo ed errori comuni

Non confondere ANY con ALL, non sostituire ALL con MAX senza analizzare il vuoto e non chiamare universale una semplice presenza di un match. I quiz verificano ragionamento deterministico, mentre nessun esercizio SQL richiede sintassi ANY/ALL non supportata. L'obiettivo è riconoscere la quantificazione e dichiarare esattamente sotto quali ipotesi una formulazione eseguibile risponde alla stessa domanda.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 41–42](/sources/sql-source#page=41).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

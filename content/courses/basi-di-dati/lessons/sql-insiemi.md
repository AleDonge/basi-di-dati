---
{
  "id": "sql-insiemi",
  "moduleId": "sql",
  "slug": "sql-insiemi",
  "title": "UNION, INTERSECT ed EXCEPT",
  "mdxPath": "lessons/sql-insiemi.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 43,
      "pageEnd": 44,
      "section": "UNION, INTERSECT ed EXCEPT"
    },
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 90,
      "pageEnd": 91,
      "section": "UNION, INTERSECT ed EXCEPT"
    }
  ],
  "concepts": [
    "UNION",
    "INTERSECT",
    "EXCEPT",
    "duplicati"
  ],
  "description": "Percorso ragionato: union, intersect ed except, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare UNION distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 34,
  "prerequisites": [
    "sql-quantificatori"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-insiemi.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e compatibilità

Gli operatori insiemistici combinano risultati di SELECT compatibili. UNION restituisce le tuple presenti in almeno un operando, INTERSECT quelle comuni, EXCEPT quelle del primo assenti dal secondo. UNION ALL conserva invece le molteplicità. Le pp. 43–44 introducono questi costrutti e le pp. 90–91 li applicano a prenotazioni rosse e verdi. Il confronto riguarda tuple intere allineate per posizione, non una ricerca automatica di chiavi con lo stesso nome.

Ogni SELECT deve produrre lo stesso numero di colonne; per chiarezza didattica allinea anche domini e significati. Un codice numerico di barca e un codice numerico di persona sono formalmente numerici ma non descrivono lo stesso universo. I nomi di output provengono dal primo ramo. Non aspettarti che UNION colleghi due righe affiancandole: quello è il compito dei join.

## Tabelle sintetiche prima e dopo

| R.sid |
|---:|
| 1 |
| 1 |
| 2 |

| S.sid |
|---:|
| 2 |
| 3 |

UNION produce 1,2,3; UNION ALL produce cinque righe, con due 1 e due 2; INTERSECT produce soltanto 2; R EXCEPT S produce soltanto 1. L'ordine scritto qui serve a leggere il ragionamento: senza ORDER BY non costituisce una promessa di presentazione del motore. Gli operatori insiemistici senza ALL eliminano duplicati del risultato.

## Esempio eseguibile: identificativi senza prenotazioni

```sql
SELECT sid FROM Sailors
EXCEPT
SELECT sid FROM Reserves
ORDER BY sid;
```

Il primo ramo definisce tutti i candidati, il secondo chi ha prenotato almeno una volta. Le prenotazioni ripetute non sottraggono più volte una persona: EXCEPT è insiemistico. Sullo script restituisce 29,32,58,71,85,95. Una variante con NOT EXISTS può rispondere alla stessa domanda; il laboratorio confronta risultati, senza usare la somiglianza del testo come criterio.

## Rosso e verde: l'identità prima del nome

Per trovare chi ha entrambe le proprietà, costruisci un ramo con sid di prenotazioni rosse e uno con sid di prenotazioni verdi; interseca i sid e poi ricava i nomi. Intersecare direttamente sname può fondere omonimi: un Horatio prenota soltanto rosso e l'altro soltanto verde, ma il nome appare in entrambi gli elenchi. La fonte p. 90 parla di nomi, mentre le query illustrate confrontano gli identificativi: questa distinzione va mantenuta durante il passaggio finale.

La richiesta «rosso ma non verde» è una differenza orientata. Invertire i rami significa «verde ma non rosso». Un filtro color='red' AND color='green' sulla stessa barca non sostituisce l'intersezione di due percorsi: chiedere due proprietà di una persona può richiedere due prenotazioni differenti.

## Precedenza e dialetti

Gli esempi sono accettati dalla versione SQLite del laboratorio. Supporto e precedenza degli operatori possono cambiare tra versioni MySQL/MariaDB. Non introdurre una dichiarazione universale «MySQL non ha INTERSECT» oppure «tutti i dialetti lo hanno». Per evitare dipendenze dalla precedenza, isola risultati intermedi in CTE e combina due rami alla volta. In SQLite le compound SELECT si associano da sinistra; non trasferire automaticamente la precedenza dell'algebra del lab.

## Riepilogo, errori ed esercizio guidato

Esegui SELECT sid FROM Reserves da sola e osserva le ripetizioni; poi usa UNION con se stessa e infine UNION ALL. Prevedi rispettivamente quattro e venti righe sullo script. Questa prova mostra che eliminazione di duplicati e combinazione di risultati sono decisioni separate. Una query con LIMIT che nasconde righe non dimostra compatibilità con il contratto.

Attenzione a colonne scambiate, domini diversi, nomi usati come identità e differenza invertita. NULL viene considerato coincidente con NULL nell'eliminazione dei duplicati dei risultati insiemistici: non confonderlo con il confronto ordinario = in WHERE. La scelta dell'operatore segue alternative, concomitanza o esclusione nel requisito, sempre sulle tuple appropriate.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 43–44](/sources/sql-source#page=43). [Argomento04 SQL.pdf, pp. 90–91](/sources/sql-source#page=90).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

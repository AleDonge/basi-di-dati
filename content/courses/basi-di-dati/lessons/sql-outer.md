---
{
  "id": "sql-outer",
  "moduleId": "sql",
  "slug": "sql-outer",
  "title": "Outer join, anti join e conteggi a zero",
  "mdxPath": "lessons/sql-outer.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 63,
      "pageEnd": 71,
      "section": "Outer join, anti join e conteggi a zero"
    }
  ],
  "concepts": [
    "LEFT JOIN",
    "RIGHT JOIN",
    "FULL JOIN",
    "anti join",
    "NULL"
  ],
  "description": "Percorso ragionato: outer join, anti join e conteggi a zero, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare LEFT JOIN distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 37,
  "prerequisites": [
    "sql-join"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-outer.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e motivazione

L'inner join conserva soltanto coppie abbinate. Il left outer join aggiunge le righe del lato sinistro senza corrispondenza, completando con NULL le colonne destre. RIGHT scambia il lato preservato; FULL conserva gli elementi non abbinati di entrambi i lati. Le pp. 63–71 mostrano perché «tutti i marinai» comprende anche quelli senza prenotazioni. Una tabella vuota e una riga completata con NULL restano oggetti diversi.

La p. 60 ripete LEFT nella lista delle varianti: non introduciamo un quinto tipo di join. I diagrammi di Venn sono un'intuizione sulle corrispondenze, ma non descrivono da soli la molteplicità: una riga sinistra può abbinarsi a molte destre. FULL non significa «tutte le combinazioni», che sarebbe il prodotto cartesiano.

## Conteggi: perché COUNT(*) non basta

| Persona sintetica | Prenotazioni reali | Righe dopo LEFT JOIN | COUNT(r.sid) |
|---|---:|---:|---:|
| Ada | 2 | 2 | 2 |
| Nora | 0 | 1 | 0 |

Nora genera una riga con r.sid NULL. COUNT(*) la conterebbe come uno, mentre COUNT(r.sid) ignora il NULL e misura zero prenotazioni. Scegli una colonna della parte destra che non possa essere NULL in una corrispondenza reale: Reserves.sid soddisfa questa condizione nello schema ufficiale. Contare una descrizione facoltativa non darebbe la stessa garanzia.

## Esempio eseguibile nel laboratorio

```sql
SELECT s.sid, s.sname, COUNT(r.sid) AS prenotazioni
FROM Sailors AS s
LEFT JOIN Reserves AS r ON r.sid = s.sid
GROUP BY s.sid, s.sname
ORDER BY s.sid;
```

Il risultato contiene dieci righe: quattro marinai con prenotazioni e sei con zero. Se cambi LEFT JOIN in JOIN perdi i sei non prenotanti. Se cambi COUNT(r.sid) in COUNT(*) non perdi righe ma trasformi gli zero in uno. Sono errori differenti, che richiedono test differenti; non basta verificare il numero di righe dell'output.

La p. 65 parla di quanti marinai prenotano ogni barca, ma mostra COUNT(r.sid), che conta righe di prenotazione. Per persone uniche serve COUNT(DISTINCT r.sid): prenotare due volte la stessa barca deve pesare una volta soltanto in quella diversa domanda.

## ON e WHERE non sono intercambiabili

Supponi di voler includere tutti i marinai contando solo prenotazioni della barca 101. Il predicato r.bid=101 appartiene a ON insieme al collegamento su sid. Se lo metti in WHERE, le righe completate con NULL non superano il filtro e scompaiono. La domanda diventa più simile a «chi ha una prenotazione 101». Prima stabilisci se il filtro restringe corrispondenze o popolazione finale.

## Anti join e prova guidata

Un anti join restituisce righe senza match. In SQLite puoi usare LEFT JOIN seguito da WHERE r.sid IS NULL, oppure NOT EXISTS con correlazione. Non esiste una parola magica ANTI JOIN richiesta dagli esercizi. Per tutte le persone senza prenotazioni, entrambe le forme devono preservare s.sid e non moltiplicare le righe.

Esegui la query di conteggio, poi costruisci la variante con WHERE r.sid IS NULL senza aggregazione. Confronta i sei sid con quelli di EXCEPT nella lezione insiemistica. Ora immagina due prenotazioni dello stesso marinaio: l'anti join non deve improvvisamente includerlo. Le fixture sintetiche comprendono assenze e ripetizioni per rendere visibili questi errori.

## Dialetti e limiti

La versione SQLite inclusa accetta LEFT, RIGHT e FULL JOIN; le lezioni usano soprattutto LEFT per esplicitare il lato preservato. Le slide segnalano FULL non disponibile nel DBMS MariaDB discusso: il fatto che funzioni nel laboratorio non lo rende portabile al server del corso. Non è stata eseguita una verifica su ogni versione MySQL/MariaDB. Per emulazioni con UNION, controlla righe duplicate e criteri per distinguere un mancato match prima di dichiarare equivalenza.

## Riepilogo ed errori comuni

Non contare la riga artificiale come una prenotazione, non applicare il filtro della parte opzionale nel punto sbagliato e non interpretare NULL come entità reale. Un outer join è corretto se preserva la popolazione richiesta e rappresenta chiaramente l'assenza. Dopo ogni trasformazione controlla sia le righe perse sia i valori aggregati: avere il totale giusto per coincidenza non basta.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 63–71](/sources/sql-source#page=63).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

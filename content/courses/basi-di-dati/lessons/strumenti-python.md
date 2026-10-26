---
{
  "id": "strumenti-python",
  "moduleId": "strumenti",
  "slug": "strumenti-python",
  "title": "Python DB-API: cursor, parametri e commit",
  "mdxPath": "lessons/strumenti-python.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "tools-source",
      "file": "Introduzione MySQL e Dbeaver.pdf",
      "pageStart": 79,
      "pageEnd": 92,
      "section": "Python DB-API: cursor, parametri e commit"
    }
  ],
  "concepts": [
    "Python",
    "DB-API",
    "cursor",
    "commit",
    "parametri"
  ],
  "description": "Percorso ragionato: python db-api: cursor, parametri e commit, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare Python distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 42,
  "prerequisites": [
    "strumenti-jdbc"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/strumenti-python.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e collegamento con JDBC

Le pp. 79–91 presentano accesso MySQL da Python mediante Connector/Python e l'API DB-API. Il driver apre una connessione; un cursor esegue comandi e legge risultati. La struttura concettuale richiama JDBC, ma nomi dei metodi, segnaposto e impostazioni iniziali non coincidono. Conoscere SQL non elimina la necessità di capire il ciclo delle risorse e delle transazioni nel linguaggio ospite.

La p. 81 illustra un'installazione del driver in ambiente virtuale. Si tratta di una procedura esterna e facoltativa per studiare quei programmi, non di una dipendenza di Database Academy. Versione e requisiti stampati nella fonte sono registrati come dati della dispensa; non vengono ripetuti come raccomandazione aggiornata. La piattaforma non apre connessioni MySQL e non esegue Python inviato dall'utente.

## Connessione e durata delle risorse

Host, database, user e password scelgono la destinazione. Il cursor appartiene alla connessione e non è il database stesso. Usare with per le risorse supportate dal driver chiude i relativi oggetti al termine del blocco. Chiusura e conferma delle modifiche sono però azioni diverse: non assumere che un context manager faccia automaticamente commit perché il blocco termina senza errori.

| Concetto | JDBC | Connector/Python illustrato |
|---|---|---|
| Parametro | ? | %s |
| Binding | setString/setObject | execute(sql, parametri) |
| Lettura | ResultSet.next e getter | Iterazione sul cursor |
| Modifiche iniziali | Autocommit normalmente attivo | Autocommit inizialmente disattivo |

Le impostazioni possono essere modificate dal programma. L'autocommit non è una proprietà eterna di Python o Java, e non tutti i comandi DDL seguono le stesse regole transazionali dei dati. Qui si ragiona sulle operazioni DML degli esempi.

## Esempio illustrativo, fuori dal laboratorio

```python
surname = "Neri"
with conn.cursor(dictionary=True) as cur:
    cur.execute(
        "SELECT id, name FROM student WHERE surname = %s",
        (surname,),
    )
    for row in cur:
        print(row["id"], row["name"])
```

Si presume una connessione conn già aperta e student dello schema dimostrativo della fonte. La virgola di (surname,) crea una tupla di un elemento; (surname) è soltanto il valore tra parentesi. Il segnaposto non va racchiuso in apici e non si usa l'operatore Python % per interpolare manualmente la stringa. Passare parametri separati affida al driver il trattamento dei valori.

## Lettura e dati mancanti

Un cursor ordinario restituisce righe come tuple, da leggere per posizione; dictionary=True permette accesso per nome della colonna. fetchone() legge una riga successiva o segnala assenza; fetchall() raccoglie le righe rimanenti. «Rimanenti» è importante: se hai già consumato una riga, non viene automaticamente restituita di nuovo. SQL NULL è rappresentato come None nella normale conversione Python del driver, non come stringa 'NULL'.

Non affermare che ogni driver carichi immediatamente in memoria tutto il risultato: buffer e modalità di fetch possono differire. Per elaborare molti dati, considera dimensione, consumo completo del risultato e durata della connessione. Questa lezione spiega i concetti delle pp. 87–89, senza introdurre un nuovo sistema di esportazione del laboratorio.

## Modifiche, errori ed esercizio guidato

La p. 90 esegue una DELETE parametrizzata e legge rowcount. Con autocommit disattivato, conn.commit() conferma le modifiche; rollback annulla quelle ancora annullabili. Chiudere la connessione senza confermare non è una strategia affidabile per salvare i dati. Gestisci eccezioni del driver e non mostrare una finta riuscita prima che l'operazione richiesta sia effettivamente completata.

Traccia su carta due cancellazioni in una transazione: la prima riesce, la seconda genera errore. Decidi esplicitamente se annullare l'unità o confermare una parte secondo il requisito. Non eseguire questo esperimento sui progressi o sugli originali. Per il binding prova mentalmente surname="D'Angelo": deve restare un valore, senza trasformarsi in sintassi concatenata.

## Riepilogo ed errori comuni

Evita f-string con valori dentro SQL, parametro singolo senza virgola, commit dimenticato e confusione tra cursor chiuso e dati confermati. Le virgolette tipografiche visibili nelle pp. 82–84 e il refuso DATABASET non sono riportati come codice copiabile. Il programma richiede un ambiente esterno; SQL Lab continua a offrire soltanto letture SQLite, senza driver Python e senza rete.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Introduzione MySQL e Dbeaver.pdf, pp. 79–92](/sources/tools-source#page=79).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

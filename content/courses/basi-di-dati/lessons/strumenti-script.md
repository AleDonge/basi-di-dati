---
{
  "id": "strumenti-script",
  "moduleId": "strumenti",
  "slug": "strumenti-script",
  "title": "Connessione, schema e importazione con DBeaver",
  "mdxPath": "lessons/strumenti-script.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "tools-source",
      "file": "Introduzione MySQL e Dbeaver.pdf",
      "pageStart": 51,
      "pageEnd": 63,
      "section": "Connessione, schema e importazione con DBeaver"
    }
  ],
  "concepts": [
    "connessione",
    "driver",
    "script",
    "NorthWind"
  ],
  "description": "Percorso ragionato: connessione, schema e importazione con dbeaver, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare connessione distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 40,
  "prerequisites": [
    "strumenti-ambiente"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/strumenti-script.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Connessione e database attivo

Le pp. 51–55 introducono il client a riga di comando; le pp. 56–63 mostrano DBeaver e il caricamento NorthWind. Una connessione identifica il server e l'utente; il database attivo stabilisce lo spazio in cui vengono risolti i nomi delle tabelle. Una connessione riuscita non dimostra che lo schema richiesto sia già stato creato o popolato. Questi sono controlli distinti.

Il comando di shell mysql -h host -u user -p apre il client e chiede la password. Non è un'istruzione da incollare dentro SELECT o nell'editor SQLite. SHOW DATABASES, CREATE DATABASE e USE sono invece comandi del server MySQL/MariaDB mostrati a p. 52. In SQL Lab vengono rifiutati: il dataset si sceglie dall'interfaccia e l'esploratore sostituisce le richieste amministrative.

## Sequenza illustrativa fuori dal laboratorio

```sql
SHOW DATABASES;
CREATE DATABASE studio_demo;
USE studio_demo;
SHOW TABLES;
```

Sono esempi MySQL/MariaDB da leggere, non eseguibili nel lab protetto. La p. 53 introduce utenti e privilegi; non serve implementare account nella piattaforma per insegnarne il ruolo. GRANT ALL dell'esempio è una concessione ampia sul database indicato, non una regola da applicare a ogni programma reale. Uno schema di esercitazione deve rimanere distinguibile dai dati importanti.

## Dal driver allo script

In DBeaver scegli il tipo di connessione coerente con il server, indica host, porta, database e credenziali e verifica la connessione. Le pp. 57–60 mostrano anche la configurazione delle librerie JAR del driver. Un errore sul driver non è un errore nella SELECT. Usare un driver MySQL non trasforma una connessione SQLite in un server MySQL; il prodotto effettivo determina il dialetto.

La p. 61 crea NorthWind; la p. 62 carica lo script, assegna la connessione attiva ed esegue l'intero script. Distingui esecuzione della singola istruzione da esecuzione del file completo. Prima di avviare uno script controllane il database di destinazione: gli originali forniti contengono istruzioni di creazione e possono contenere DROP. La piattaforma li legge per la conversione senza eseguirli sui progressi personali.

| Controllo | Domanda diagnostica |
|---|---|
| Connessione | Raggiungo il server corretto? |
| Database | Dove verranno create le tabelle? |
| Script | Sto eseguendo tutte le istruzioni necessarie? |
| Struttura | Esistono colonne e chiavi attese? |
| Popolamento | I conteggi coincidono con lo script? |

## NorthWind: schema illustrato e dump effettivo

Il diagramma p. 63 collega ordini, clienti, dipendenti, dettagli, prodotti, categorie, fornitori e spedizionieri. I nomi e le colonne del diagramma non coincidono perfettamente con il dump ricevuto: ad esempio non si inventa una colonna Picture in categories se lo script non la dichiara. Gli otto collegamenti convenzionali sono verificati separatamente e non vengono spacciati per FOREIGN KEY dichiarate nel dump.

La conversione della piattaforma conserva otto tabelle, 3202 record, 77 colonne e nove foto BLOB. Non caricare il dump MySQL direttamente nel motore SQLite aspettandoti comportamento identico. Date, tipi numerici, quoting, indici e comandi amministrativi richiedono trasformazioni registrate nel rapporto. Un'importazione con dati completi non equivale alla riproduzione dell'intero DBMS.

## Esercizio guidato eseguibile

Seleziona NorthWind nel laboratorio e interroga:

```sql
SELECT COUNT(*) AS ordini FROM orders;
```

Il risultato atteso è 830. Controlla poi 2155 righe in order_details e 77 prodotti. Un'anteprima limitata a dieci righe non significa che siano stati importati soltanto dieci record. Per i BLOB la visualizzazione può essere abbreviata, mentre length(Photo) usa il valore conservato intero.

## Riepilogo ed errori comuni

Non confondere mancata importazione con mancata connessione, non usare un diagramma per inventare colonne e non dedurre il conteggio totale dall'anteprima. Verifica destinazione, struttura e dati separatamente. DESCRIBE e LOAD DATA LOCAL INFILE delle pp. 54–55 sono strumenti esterni: la piattaforma offre esploratore e dataset predisposti, senza accesso a file arbitrari o nuovi comandi amministrativi.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Introduzione MySQL e Dbeaver.pdf, pp. 51–63](/sources/tools-source#page=51).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

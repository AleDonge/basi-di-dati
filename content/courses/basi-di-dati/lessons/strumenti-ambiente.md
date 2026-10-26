---
{
  "id": "strumenti-ambiente",
  "moduleId": "strumenti",
  "slug": "strumenti-ambiente",
  "title": "Server, client e installazioni locali",
  "mdxPath": "lessons/strumenti-ambiente.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "tools-source",
      "file": "Introduzione MySQL e Dbeaver.pdf",
      "pageStart": 1,
      "pageEnd": 50,
      "section": "Server, client e installazioni locali"
    }
  ],
  "concepts": [
    "client",
    "server",
    "MySQL",
    "MariaDB",
    "DBeaver"
  ],
  "description": "Percorso ragionato: server, client e installazioni locali, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare client distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 39,
  "prerequisites": [
    "dbms-dati"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/strumenti-ambiente.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Componenti e responsabilità

La dispensa distingue MySQL/MariaDB e DBeaver: il primo è il gestore che conserva dati ed esegue SQL, il secondo è un client grafico che comunica con diversi gestori mediante driver. Installare soltanto DBeaver non crea un server MySQL. Un driver traduce le chiamate del client nel protocollo del prodotto scelto; non converte automaticamente ogni dialetto SQL in un altro.

Le pp. 2–3 presentano MySQL e la nascita del progetto MariaDB. La parentela storica non implica identità attuale di sintassi, impostazioni o comportamento. Nel percorso personale puoi studiare le procedure senza installare entrambi. Database Academy utilizza invece SQLite incorporato nel browser, con dataset già convertiti: per avviare la piattaforma non sono necessari MySQL, MariaDB, DBeaver, account o connessioni remote.

## Leggere le schermate senza trasformarle in obblighi

Le pp. 4–24 illustrano il download e l'installazione Windows di MySQL, poi MySQL Configurator. Sono visibili scelta del percorso dati, rete e porte, credenziali, servizio Windows, permessi e applicazione della configurazione. Le pp. 25–34 mostrano il flusso MariaDB, compresi componenti, password, servizio e porta. Le immagini documentano un ambiente del corso: non sono state rieseguite installazioni sul computer dell'utente.

| Componente | Che cosa decide | Che cosa non decide |
|---|---|---|
| Server | Memorizzazione ed esecuzione | Quale domanda didattica sia corretta |
| Client | Interfaccia delle richieste | Integrità dei dati senza vincoli |
| Driver | Comunicazione con il prodotto | Equivalenza tra dialetti |
| Servizio locale | Avvio del processo server | Apertura obbligatoria alla rete esterna |

Un numero di versione in uno screenshot è un dato della fonte, non una raccomandazione sull'ultima versione disponibile. I percorsi e i pulsanti possono differire. Il corso mostra opzioni di rete, ma un esercizio locale non richiede esporre il server a Internet. Non copiare credenziali dimostrative e non scambiare la password del gestore con un account richiesto dall'app: Database Academy non ha autenticazione.

## DBeaver e configurazione

Le pp. 35–50 mostrano installazione di DBeaver, componenti, cartelle, lingua, aspetto, funzioni opzionali, raccolta di statistiche e database dimostrativo. La schermata di licenza p. 39 riporta Apache License mentre p. 36 parla di GPL: questa incoerenza è registrata, senza ricavare una prescrizione legale dalla lezione. Le opzioni di integrazione AI visibili a p. 48 non sono necessarie e non vengono attivate nella piattaforma.

La schermata p. 49 mostra una scelta sulle statistiche anonime del prodotto esterno. Database Academy non riproduce quella raccolta e non dipende da DBeaver. Studiare un'interfaccia con opzioni online non equivale a introdurre tali servizi nell'app locale. I download e la disponibilità dei driver sono un eventuale passo esterno iniziale, non una dipendenza runtime delle lezioni.

## Esercizio guidato: diagnosticare il componente

Immagina tre casi: DBeaver si apre ma non raggiunge il server; la connessione riesce ma una tabella non esiste; una SELECT restituisce righe inattese. Nel primo verifica processo, host, porta e driver; nel secondo database attivo e importazione; nel terzo schema, dati e logica della query. Cambiare il testo SQL non risolve automaticamente una connessione rifiutata.

Per una prova già disponibile, apri SQL Lab e svolgi questa lettura su Sailors:

```sql
SELECT COUNT(*) AS marinai FROM Sailors;
```

Deve restituire 10 senza contattare un server MySQL. La stessa idea di interrogazione può essere inviata da un client a un server separato, ma qui il motore è incorporato e isolato. Il risultato non verifica l'installazione di DBeaver: verifica il dataset locale della piattaforma.

## Riepilogo ed errori comuni

Non confondere client, server e driver; non installare componenti per correggere un errore di significato della query; non trattare versioni illustrate come aggiornamenti garantiti. Parti dall'architettura, identifica quale componente segnala il problema e scegli una prova piccola. Le procedure del corso sono consultabili pagina per pagina; il laboratorio personale rimane indipendente dalle installazioni esterne.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Introduzione MySQL e Dbeaver.pdf, pp. 1–50](/sources/tools-source#page=1).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

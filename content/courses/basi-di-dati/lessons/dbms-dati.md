---
{
  "id": "dbms-dati",
  "moduleId": "introduzione",
  "slug": "dbms-dati",
  "title": "Dati, DBMS e sistemi di basi di dati",
  "mdxPath": "lessons/dbms-dati.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "intro-source",
      "file": "Argomento01 Basi di Dati e loro utenti.pdf",
      "pageStart": 1,
      "pageEnd": 7,
      "section": "Dati, DBMS e sistemi di basi di dati"
    }
  ],
  "concepts": [
    "database",
    "dbms",
    "linguaggi"
  ],
  "description": "Distingui informazioni, gestore e applicazioni, e segui il percorso di una richiesta.",
  "objectives": [
    "Distinguere database, DBMS e database system.",
    "Riconoscere le responsabilità del gestore.",
    "Classificare le famiglie di linguaggi citate nelle slide."
  ],
  "order": 1,
  "prerequisites": [],
  "relatedLessonIds": [
    "astrazione-indipendenza"
  ],
  "quizPath": "quizzes/dbms-dati.json"
}
---
## Dati, organizzazione e durata

**Dalle slide, rielaborazione — pagine PDF 2–3.** Una base di dati è una raccolta organizzata di informazioni da gestire nel tempo. La definizione più precisa adottata nelle slide lega questa raccolta a un **DBMS**, cioè il software che la gestisce. Organizzazione e persistenza sono essenziali: non basta che molti valori si trovino nello stesso posto, occorre sapere che cosa rappresentano e come possono essere consultati o aggiornati.

Per leggere un insieme di dati devi poter distinguere le entità descritte, riconoscere i loro attributi e capire i collegamenti. Nel caso universitario citato dalle slide, studenti, corsi ed esami non sono tre elenchi isolati: un esame riguarda uno studente e un corso. Perdere questo collegamento rende i singoli valori molto meno utili.

> **Esempio aggiuntivo.** Una segreteria conserva la matricola di Marta, il codice di Basi di Dati e la registrazione dell’esame. Il voto “28” da solo non dice a chi appartenga né a quale attività si riferisca. Matricola, codice e registrazione organizzano il significato del voto. Questi nomi e dati sono inventati per spiegare il concetto, non ripresi da una tabella del docente.

**Applicazione pratica.** Di fronte a un servizio, chiediti quali informazioni devono sopravvivere alla chiusura dell’applicazione. Il carrello temporaneo di una schermata e l’ordine confermato possono avere esigenze diverse. Questo ragionamento precede la scelta della struttura tecnica.

## Database, DBMS e sistema

**Dalle slide — pagina PDF 4.** Il **database** è la raccolta dei dati. Il **Database Management System** è il pacchetto software incaricato di gestirla. Il **database system** comprende DBMS e dati; secondo la convenzione adottata può comprendere anche le applicazioni che interagiscono con essi.

| Termine | Che cosa indica | Esempio aggiuntivo |
|---|---|---|
| Base di dati | Informazioni organizzate e conservate | Studenti e registrazioni degli esami |
| DBMS | Software che gestisce i dati | Il gestore che riceve e controlla le richieste |
| Applicazione | Funzioni offerte all’utente | Il portale per la segreteria |
| Sistema di basi di dati | Insieme dei componenti precedenti secondo il perimetro scelto | L’ambiente complessivo del servizio |

La distinzione aiuta a formulare domande precise. “Il database non risponde” può indicare un problema dell’applicazione, del DBMS o dell’accesso ai dati: non sono automaticamente lo stesso guasto.

## Come attraversa il sistema una richiesta

**Dalle slide — diagramma a pagina PDF 5, controllato visivamente.** Il disegno distingue interfacce utente, elaborazione delle interrogazioni, gestione delle transazioni, accesso alla memoria e dati memorizzati. Include parser, ottimizzatore, gestori dei buffer, dei lock e del recupero. Non serve ancora conoscerne gli algoritmi: il punto è che il DBMS coordina più responsabilità.

**Diagramma aggiuntivo e semplificato:**

```diagram
Utente e applicazione → DBMS: interpreta e coordina → Dati persistenti
```

Immagina di chiedere l’elenco degli esami di Marta. L’applicazione esprime la richiesta, il DBMS la interpreta e determina come accedere ai dati, poi restituisce il risultato. L’utente non deve indicare il settore del disco da leggere. Il diagramma è una guida concettuale e non riproduce tutti i componenti della slide.

## Che cosa deve fornire il gestore

**Dalle slide — pagine PDF 6–7.** Il DBMS deve gestire quantità anche grandi di dati, recupero dopo guasti, accessi concorrenti e linguaggi specializzati. Le famiglie citate sono:

| Famiglia | Scopo |
|---|---|
| DDL | Definire gli schemi che strutturano i dati |
| DML / query language | Modificare ed estrarre i dati |
| DCL | Controllare le autorizzazioni di accesso |
| TCL | Controllare le transazioni, per esempio conferma o annullamento |

Queste etichette classificano compiti, non quattro applicazioni separate. Le slide chiamano **query** una richiesta di accesso e formulazione della risposta; chiamano **transazione** una sequenza atomica di letture e scritture. L’atomicità richiede che una sequenza trattata come unità non lasci modifiche parziali in caso di annullamento. Concorrenza e recupero verranno chiariti nella lezione dedicata, senza anticipare un corso completo sulle transazioni.

## Errori comuni e prova ragionata

- Confondere il software con i dati: il DBMS gestisce la base di dati, non è il suo contenuto.
- Pensare che la sola quantità definisca una base di dati: anche organizzazione e gestione nel tempo contano.
- Attribuire tutta la sicurezza al gestore: la pagina 7 richiama anche la responsabilità delle applicazioni nell’impedire accessi non autorizzati.

**Domanda aperta aggiuntiva.** Nel portale della segreteria, individua una richiesta di sola lettura e un’operazione che cambia i dati. Spiega perché una registrazione parziale dell’esame sarebbe un problema. Non occorre scrivere SQL.

## Riepilogo

Una base di dati conserva informazioni strutturate; il DBMS ne coordina la gestione; l’applicazione offre funzioni agli utenti. Il valore del gestore non si esaurisce nella memorizzazione: include linguaggi, autorizzazioni, concorrenza e recupero. Rivedi le [pagine 2–7 della fonte](/sources/intro-source#page=2) e prova l’autoverifica qui sotto: il risultato del quiz resta distinto dal completamento della lettura.

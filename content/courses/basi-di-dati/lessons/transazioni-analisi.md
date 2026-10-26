---
{
  "id": "transazioni-analisi",
  "moduleId": "introduzione",
  "slug": "transazioni-analisi",
  "title": "Concorrenza, recupero, OLTP e OLAP",
  "mdxPath": "lessons/transazioni-analisi.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "intro-source",
      "file": "Argomento01 Basi di Dati e loro utenti.pdf",
      "pageStart": 14,
      "pageEnd": 18,
      "section": "Concorrenza, recupero, OLTP e OLAP"
    },
    {
      "sourceId": "intro-source",
      "file": "Argomento01 Basi di Dati e loro utenti.pdf",
      "pageStart": 6,
      "pageEnd": 7,
      "section": "Query e transazioni"
    }
  ],
  "concepts": [
    "transazioni",
    "recovery",
    "oltp",
    "olap"
  ],
  "description": "Capisci perché coordinare gli accessi e distinguere operatività da analisi.",
  "objectives": [
    "Spiegare atomicità, concorrenza e recupero a livello introduttivo.",
    "Confrontare le finalità di OLTP e OLAP.",
    "Classificare scenari operativi e analitici."
  ],
  "order": 3,
  "prerequisites": [
    "astrazione-indipendenza"
  ],
  "relatedLessonIds": [
    "utenti-scelte"
  ],
  "quizPath": "quizzes/transazioni-analisi.json"
}
---
## Perché non basta memorizzare

**Dalle slide — pagine PDF 14–15.** Tra i motivi per utilizzare un DBMS ci sono indipendenza dei dati, accesso concorrente, recupero dopo guasti, integrità, sicurezza e amministrazione. Le funzioni del gestore possono ridurre anche il lavoro necessario per costruire applicazioni. Il vantaggio non consiste soltanto nel trovare un posto per i dati, ma nel governare gli accessi e i cambiamenti.

Quando più persone usano gli stessi dati, un’operazione può interferire con un’altra. Un guasto può inoltre arrivare tra due passaggi di un aggiornamento. Le slide introducono questi problemi senza sviluppare qui protocolli o algoritmi: questa lezione mantiene lo stesso confine.

## Transazione, concorrenza e recupero

**Raccordo con pagine PDF 6–7 e 15.** Una transazione è una sequenza di azioni trattata come unità atomica. La concorrenza riguarda l’uso contemporaneo della stessa base di dati; l’isolamento evita interazioni indesiderate; il recupero contribuisce a conservare gli effetti delle operazioni correttamente completate dopo un guasto.

> **Scenario aggiuntivo.** Rimane un posto in un corso a numero limitato. Due studenti tentano l’iscrizione quasi insieme. Se entrambi leggessero “un posto libero” e aggiornassero i dati senza coordinamento, potrebbero essere accettate due iscrizioni. È necessario governare l’interazione, non soltanto salvare ogni singola riga.

**Schema aggiuntivo di una decisione atomica:**

```diagram
Richiesta di iscrizione → Verifiche e aggiornamenti come unità → Conferma completa oppure annullamento
```

Atomicità e permanenza rispondono a domande differenti. La prima riguarda il lasciare o meno effetti parziali; la seconda riguarda ciò che accade agli effetti confermati quando il sistema riparte. Non confondere quindi “il programma ha mostrato una schermata” con “l’operazione è stata confermata e resa persistente”.

## OLTP: far funzionare le operazioni quotidiane

**Dalle slide — pagina PDF 16.** OLTP significa *Online Transaction Processing*. Il carico tipico è formato da molte operazioni brevi: registrare ordini, pagamenti o aggiornamenti. Integrità, coerenza e tempi di risposta rapidi sono centrali. La slide associa a questo scenario schemi normalizzati per ridurre ridondanza; la normalizzazione qui è solo citata, non viene insegnata o aggiunta come nuovo modulo.

**Esempio aggiuntivo.** Registrare l’acquisto di un biglietto richiede di aggiornare dati operativi precisi e recenti. Un utente attende una risposta rapida. Mille registrazioni simili hanno un profilo diverso da un’unica interrogazione che confronta tutti gli acquisti degli ultimi anni.

## OLAP: comprendere i dati attraverso analisi

**Dalle slide — pagina PDF 17.** OLAP significa *Online Analytical Processing*. L’obiettivo è sostenere analisi complesse, reporting e decisioni: aggregare dati, studiare andamenti e interrogare più dimensioni. La slide descrive query meno frequenti ma più complesse e architetture spesso orientate a dati storici e schemi denormalizzati, come lo schema a stella. Anche questi termini rimangono un orientamento, non un’anticipazione della loro progettazione.

| Aspetto | OLTP nelle slide | OLAP nelle slide |
|---|---|---|
| Finalità | Operatività quotidiana | Analisi e reporting |
| Operazioni tipiche | Brevi e frequenti | Complesse e meno frequenti |
| Esigenza centrale | Correttezza e risposta operativa | Aggregazioni e analisi storiche |
| Esempio aggiuntivo | Registrare una vendita | Confrontare vendite annuali per area |

**Come usare il confronto.** Parti dalla domanda dell’utente: “registra questo pagamento” è operativa; “quale area è cresciuta di più negli ultimi tre anni?” è analitica. Una singola organizzazione può avere entrambe le necessità. OLTP e OLAP classificano finalità e carichi, non il valore o la qualità del sistema.

## Strumenti, errori e scelta ragionata

**Dalle slide — pagina PDF 18.** Sono riportati esempi di RDBMS ed ERP per l’operatività e piattaforme di data warehousing e strumenti BI per l’analisi. L’elenco è materiale del corso: non è una raccomandazione di acquisto e non implica che l’app debba usarli. Database Academy rimane locale e senza questi servizi.

**Precisazione aggiuntiva.** Non dedurre che un prodotto possa svolgere soltanto una classe di attività. Il confronto riguarda il carico per cui un sistema è progettato o ottimizzato. Analogamente, una risposta veloce non dimostra da sola che il carico sia OLTP.

**Errori comuni:** attribuire alla recovery il compito di impedire tutte le interferenze; confondere una lettura qualsiasi con un’analisi OLAP; pensare che una transazione sia sempre una sola istruzione o sempre una modifica.

**Domanda aperta.** Per una biblioteca, confronta “registra un prestito” e “calcola i prestiti per genere negli ultimi cinque anni”. Quali esigenze sono comuni e quali cambiano?

## Riepilogo

Il DBMS coordina operazioni concorrenti e gestisce il recupero. OLTP privilegia l’operatività; OLAP sostiene l’analisi. Queste nozioni sono introdotte nelle [pagine 14–18](/sources/intro-source#page=14), con richiamo alle definizioni delle pagine 6–7. Non stai ancora studiando algoritmi di controllo della concorrenza o progettazione di data warehouse.

---
{
  "id": "utenti-scelte",
  "moduleId": "introduzione",
  "slug": "utenti-scelte",
  "title": "Utenti, responsabilità e scelta di un DBMS",
  "mdxPath": "lessons/utenti-scelte.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "intro-source",
      "file": "Argomento01 Basi di Dati e loro utenti.pdf",
      "pageStart": 19,
      "pageEnd": 23,
      "section": "Utenti, responsabilità e scelta di un DBMS"
    }
  ],
  "concepts": [
    "utenti",
    "dba",
    "requisiti"
  ],
  "description": "Collega i ruoli alle responsabilità e valuta quando un gestore è appropriato.",
  "objectives": [
    "Distinguere progettista, amministratore e utilizzatori finali.",
    "Separare sviluppatori di applicazioni e del DBMS.",
    "Valutare vantaggi e costi rispetto ai requisiti."
  ],
  "order": 4,
  "prerequisites": [
    "transazioni-analisi"
  ],
  "relatedLessonIds": [
    "relazioni-domini"
  ],
  "quizPath": "quizzes/utenti-scelte.json"
}
---
## Due gruppi da non confondere

**Dalle slide — pagina PDF 19.** Il corso distingue chi utilizza, amministra e progetta le basi di dati da chi sviluppa il software del DBMS. Il primo gruppo comprende anche chi costruisce applicazioni che accedono ai dati; il secondo costruisce il gestore e i suoi sottosistemi.

> **Esempio aggiuntivo.** Sviluppare il portale di una biblioteca e sviluppare l’ottimizzatore di un DBMS sono attività diverse. Entrambe richiedono software, ma lavorano su livelli e responsabilità differenti. Il programmatore del portale usa il gestore; chi sviluppa il gestore realizza i meccanismi messi a disposizione del portale.

Questa distinzione evita di chiamare “utente” soltanto chi clicca su una pagina. Anche chi amministra autorizzazioni o decide lo schema utilizza il sistema con competenze e obiettivi specifici.

## Amministratore e progettista

**Dalle slide — pagina PDF 20.** Il **Database Administrator**, o DBA, coordina e monitora l’uso della base di dati, gestisce le autorizzazioni, considera risorse hardware e software e controlla l’efficienza operativa. Il **Database Designer** definisce contenuti, schema, vincoli e transazioni previste, raccogliendo le esigenze degli utilizzatori.

| Problema aggiuntivo | Ruolo principalmente coinvolto | Perché |
|---|---|---|
| La segreteria deve poter aggiornare dati che gli studenti vedono soltanto | DBA, nel quadro delle politiche definite | Riguarda accessi e autorizzazioni |
| Ogni iscrizione deve collegare uno studente a un corso esistente | Progettista | Riguarda schema e vincoli |
| Il servizio rallenta sotto carico | DBA con gli altri tecnici | Riguarda monitoraggio e risorse |
| Un modulo non offre una funzione richiesta | Sviluppatore dell’applicazione con progettista e utenti | Riguarda requisiti e implementazione |

La tabella è una spiegazione aggiuntiva, non una ripartizione contrattuale rigida. In un progetto piccolo una persona può ricoprire più ruoli. Le responsabilità restano distinguibili anche quando coincidono le persone.

## Utilizzatori finali

**Dalle slide — pagina PDF 21.** Gli utilizzatori finali consultano dati attraverso interrogazioni e report, e alcuni possono aggiornarli. Gli **occasionali** accedono quando serve, per esempio per leggere dati aggregati. I **parametrici** o non esperti utilizzano tipicamente funzioni predefinite, indicate anche come *canned transactions*.

**Scenario aggiuntivo.** Una persona allo sportello registra un’operazione attraverso campi e pulsanti prestabiliti. Non deve conoscere lo schema né scrivere l’interrogazione. Un responsabile può invece consultare occasionalmente un report. La frequenza o il tipo di interfaccia non stabiliscono da soli i diritti: autorizzazioni e funzioni devono essere coerenti con il ruolo.

```diagram
Necessità degli utenti → Progettazione di schema e funzioni → Applicazioni e amministrazione del servizio
```

Il diagramma è un raccordo didattico aggiuntivo: sottolinea che le scelte tecniche devono partire dalle esigenze, non soltanto dalle capacità del prodotto.

## Quando un DBMS non è la scelta automatica

**Dalle slide — pagine PDF 22–23.** L’adozione ha costi: risorse, configurazione, sicurezza, concorrenza e recupero. Per applicazioni semplici, stabili e senza accesso multiutente, un DBMS general purpose può essere superfluo. Le slide richiamano anche ambienti embedded con risorse limitate, requisiti di tempo reale stringenti e casi in cui uno specifico modello o gestore non supporta dati o operazioni necessari.

**Precisazione aggiuntiva.** Questi sono criteri di valutazione, non divieti universali. Il fatto che una slide menzioni GIS o dati biologici non prova che nessun DBMS possa gestirli. Bisogna verificare il prodotto, il modello, i requisiti e i costi del caso concreto. La lezione non aggiorna l’elenco dei prodotti né attribuisce al docente una regola più generale di quella discussa.

**Applicazione aggiuntiva.** Un elenco personale di pochi dati, usato da una sola persona e quasi mai modificato, richiede una valutazione diversa da un sistema di prenotazioni condiviso. Per scegliere, elenca durata dei dati, frequenza delle modifiche, numero di utilizzatori, vincoli, conseguenze degli errori e risorse disponibili. Poi confronta questi bisogni con ciò che la soluzione offre.

## Errori comuni e domande aperte

- Equiparare DBA e progettista: monitorare il sistema e definire lo schema sono responsabilità diverse.
- Pensare che un utilizzatore non esperto non debba essere protetto da vincoli e autorizzazioni.
- Scegliere il gestore prima di capire requisiti e limiti.

**Prova ragionata aggiuntiva.** Chi consulteresti per capire quali informazioni servono alla biblioteca? Chi coinvolgeresti per definire i vincoli? Chi controllerebbe gli accessi una volta operativo il servizio? Motiva le risposte, ammettendo che i ruoli possano collaborare.

## Riepilogo

Una base di dati è anche un sistema di responsabilità: progettazione, amministrazione, sviluppo e uso finale. Il DBMS va scelto in funzione di esigenze reali, considerando vantaggi e costi. Le definizioni e i criteri qui rielaborati provengono dalle [pagine 19–23](/sources/intro-source#page=19); scenari e tabella di assegnazione sono aggiunte didattiche.

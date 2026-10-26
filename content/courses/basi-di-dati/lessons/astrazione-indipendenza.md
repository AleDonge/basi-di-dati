---
{
  "id": "astrazione-indipendenza",
  "moduleId": "introduzione",
  "slug": "astrazione-indipendenza",
  "title": "Astrazione e indipendenza dei dati",
  "mdxPath": "lessons/astrazione-indipendenza.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "intro-source",
      "file": "Argomento01 Basi di Dati e loro utenti.pdf",
      "pageStart": 8,
      "pageEnd": 13,
      "section": "Astrazione e indipendenza dei dati"
    }
  ],
  "concepts": [
    "astrazione",
    "schema",
    "indipendenza"
  ],
  "description": "Separa viste, struttura logica e memorizzazione, per capire quali cambiamenti si propagano.",
  "objectives": [
    "Descrivere i tre livelli di astrazione.",
    "Distinguere indipendenza logica e fisica.",
    "Riconoscere i limiti della compatibilità fra schema e applicazioni."
  ],
  "order": 2,
  "prerequisites": [
    "dbms-dati"
  ],
  "relatedLessonIds": [
    "transazioni-analisi"
  ],
  "quizPath": "quizzes/astrazione-indipendenza.json"
}
---
## Perché separare la vista dai dettagli

**Dalle slide — pagine PDF 8–9.** Il modello relazionale offre una visione logica dei dati indipendente dalla loro struttura fisica. L’utente descrive le informazioni di interesse con un linguaggio di alto livello; non deve incorporare nel programma la disposizione concreta dei dati su disco. Le slide collegano questo passaggio al lavoro di Codd del 1970.

L’**indipendenza programmi-dati** riduce l’accoppiamento tra un programma e il modo in cui i dati sono organizzati. Se un’applicazione legge direttamente un file con campi a posizioni fisse, cambiare il file può richiedere di cambiare ogni programma che lo legge. Un gestore introduce descrizioni e meccanismi di accesso che rendono possibile una separazione.

> **Analogia aggiuntiva.** Un catalogo di biblioteca ti permette di cercare un libro per titolo senza conoscere lo scaffale prima di iniziare. Spostare gli scaffali non dovrebbe cambiare il modo di formulare la ricerca. L’analogia spiega l’obiettivo dell’astrazione; non descrive l’implementazione di un DBMS.

## I tre livelli di descrizione

**Dalle slide — pagine PDF 12–13, inclusi i diagrammi.** Il livello **esterno** descrive viste per utenti o gruppi; il livello **logico** rappresenta dati e collegamenti nel modello del DBMS; il livello **fisico** descrive la memorizzazione e le strutture di accesso.

| Livello | Domanda a cui risponde | Esempio dalle slide, parafrasato |
|---|---|---|
| Esterno | Quali dati vede questo utilizzatore? | Corsi con docente e numero di iscritti |
| Logico | Quali relazioni e attributi descrivono il dominio? | Students, Courses, Enrolled e altre relazioni |
| Fisico | Come vengono conservati e raggiunti i dati? | File di record e indice B+Tree |

**Rappresentazione aggiuntiva:**

```diagram
Viste esterne: ciò che serve all’utente → Schema logico: struttura condivisa → Schema fisico: file e indici
```

Una vista non va intesa necessariamente come una copia indipendente dei dati. In questo contesto è una descrizione destinata a uno scopo. Il disegno originale della pagina 12 mostra più viste sullo stesso livello logico: diversi utilizzatori possono avere esigenze diverse senza richiedere basi di dati separate.

## Indipendenza fisica

**Dalle slide — pagina PDF 11.** È la capacità di modificare l’organizzazione fisica senza cambiare lo schema logico o le applicazioni che lo usano. Un cambiamento negli indici o nell’archiviazione può migliorare l’accesso senza cambiare il significato di Students.

**Esempio aggiuntivo passo per passo.** Un’applicazione cerca studenti per matricola. All’inizio il DBMS scandisce i dati; successivamente l’amministratore introduce una struttura di accesso più efficiente. La richiesta continua a riferirsi alla matricola. È cambiato il percorso per trovare la risposta, non la domanda logica. Questo esempio non promette che ogni indice renda ogni richiesta più veloce: illustra la separazione dei livelli.

**Applicazione pratica.** Quando valuti una modifica, identifica prima ciò che cambia. Se riguarda collocazione o accesso fisico e gli attributi esposti restano uguali, il caso riguarda l’indipendenza fisica.

## Indipendenza logica e suoi limiti

**Dalle slide — pagina PDF 10.** È la capacità di modificare lo schema logico conservando le viste esterne o le applicazioni che usano la parte non modificata. La condizione finale è decisiva: non significa che qualsiasi cambiamento sia invisibile.

**Esempio aggiuntivo.** Aggiungiamo a Students un recapito opzionale. Un’applicazione che richiede esplicitamente solo matricola e nome può continuare a usare la stessa informazione. Se invece eliminiamo la matricola su cui quella applicazione si basa, non possiamo concludere che funzioni senza adattamenti. L’indipendenza è una proprietà da preservare attraverso un’interfaccia compatibile, non una garanzia magica contro ogni modifica.

Confronta i due casi: aggiungere un attributo modifica lo schema logico; aggiungere un indice modifica l’organizzazione fisica. Entrambi possono lasciare invariata un’applicazione, ma per ragioni diverse.

## Classificare una modifica

**Attività aggiuntiva con soluzione ragionata.** La segreteria vuole mostrare ai docenti soltanto gli iscritti ai loro corsi. Definire quella vista riguarda il livello esterno. Stabilire una relazione Enrolled che collega studenti e corsi riguarda lo schema logico. Scegliere un indice per raggiungere rapidamente le iscrizioni riguarda il livello fisico. Le tre decisioni collaborano e non sono intercambiabili.

**Errori comuni:**

- Chiamare “fisico” qualsiasi cambiamento eseguito sul computer: il criterio è il livello della descrizione, non il dispositivo.
- Confondere una vista esterna con una nuova tabella obbligatoriamente memorizzata.
- Dire che indipendenza logica significa poter cancellare qualunque campo senza conseguenze.

**Domanda aperta.** Un servizio passa a un nuovo sistema di archiviazione e conserva le stesse relazioni visibili. Quale indipendenza cerca di ottenere? Che cosa controlleresti dal punto di vista dell’applicazione?

## Riepilogo

I tre livelli separano bisogni degli utenti, struttura dei dati e memorizzazione. L’indipendenza fisica protegge dal cambiamento del supporto e delle strutture di accesso; quella logica tutela le viste e le applicazioni compatibili con lo schema che evolve. Le [pagine 8–13](/sources/intro-source#page=8) sono il riferimento per definizioni e esempio universitario; analogie e attività di questa lezione sono aggiunte didattiche.

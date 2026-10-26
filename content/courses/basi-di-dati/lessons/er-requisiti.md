---
{
  "id": "er-requisiti",
  "moduleId": "progettazione-er",
  "slug": "er-requisiti",
  "title": "Dai requisiti al modello concettuale",
  "mdxPath": "lessons/er-requisiti.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 2,
      "pageEnd": 9,
      "section": "Dai requisiti al modello concettuale"
    },
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 64,
      "pageEnd": 71,
      "section": "Dai requisiti al modello concettuale"
    },
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 27,
      "pageEnd": 27,
      "section": "Richiamo già discusso nel testo, reso esplicito nei metadati"
    }
  ],
  "concepts": [
    "requisiti",
    "concettuale",
    "progettazione"
  ],
  "description": "Progetta e interpreta: dai requisiti al modello concettuale.",
  "objectives": [
    "Distinguere i concetti e le loro condizioni di applicabilità.",
    "Interpretare la notazione del corso e motivare una scelta progettuale.",
    "Esplicitare ipotesi, controesempi e limiti della verifica automatica."
  ],
  "order": 19,
  "prerequisites": [
    "relazioni-domini"
  ],
  "relatedLessonIds": [
    "er-entita"
  ],
  "quizPath": "quizzes/er-requisiti.json"
}
---
> **Provenienza.** Parafrasi e spiegazioni Database Academy delle pagine citate. Esempi e diagrammi seguenti sono rielaborazioni didattiche needs-review, non nuove affermazioni attribuite al docente. Le ipotesi aggiuntive sono esplicite.

## Definizione e obiettivo

La progettazione concettuale costruisce una rappresentazione dei fatti rilevanti di un mini-mondo, indipendente dalle scelte fisiche del DBMS. Non consiste nel disegnare tabelle SQL prima di aver compreso i requisiti. Le dispense distinguono analisi dei dati, modello concettuale e schema logico; normalizzazione, livello fisico e applicazioni sono fasi successive, soltanto richiamate in queste pagine. Non le presentiamo come già sviluppate dal materiale ER.

Un requisito descrive che cosa deve essere rappresentabile e quali situazioni devono essere ammesse o escluse. La frase “ogni dipendente lavora per un solo dipartimento” contiene sia un concetto di dipendente e dipartimento sia un vincolo. Un diagramma con due rettangoli e un rombo senza quel vincolo perderebbe informazione, anche se fosse graficamente ordinato. Un modello deve poter esprimere i fatti conosciuti, non soltanto offrire un’immagine plausibile dell’azienda.

## Dal testo alle scelte

Nel caso COMPANY delle pp. 7–8, individua i dipartimenti, i progetti, i dipendenti e le persone a carico. Poi separa proprietà e collegamenti. Le ore settimanali dipendono dalla coppia dipendente/progetto: non sono necessariamente una proprietà del solo dipendente. La data da cui un manager dirige un dipartimento dipende dall’incarico. Queste domande sul significato precedono la collocazione degli ovali.

Una procedura utile, proposta nelle pp. 65–71, parte dai sostantivi e dai verbi, ma non si ferma a un’analisi grammaticale. “Indirizzo” può essere un valore semplice oppure un concetto autonomo, a seconda delle richieste. “Gestisce” può descrivere un incarico con proprietà e vincoli diversi da “lavora per”. Chiedi sempre quali distinzioni il cliente vorrà conservare e interrogare.

## Un esempio ragionato

Il diagramma aggiuntivo seguente mostra soltanto un sottoschema COMPANY. Non è una soluzione ufficiale completa. EMPLOYEES è collegata a DEPARTMENTS tramite WORKS_IN; il lato dipendente usa (1,1), cioè partecipazione obbligatoria e massimo uno. PROJECT è un concetto autonomo controllato da un dipartimento. Il minimo del lato dipartimento in WORKS_IN è preso dalla figura a p. 27: non si deve fingere che discenda dalla sola frase di p. 8.

Leggi il disegno come una raccolta di affermazioni verificabili. Per una persona scelta, quanti incarichi WORKS_IN sono consentiti? Una persona può non comparire mai? Il diagramma deve rendere distinguibili questi casi. Se una decisione deriva da una figura successiva o da una scelta della piattaforma, va annotata come tale, invece di attribuirla retroattivamente al requisito iniziale.

## Verifica e raffinamento

Scrivi una tabella di controllo: requisito, elemento che lo rappresenta, vincolo, punto ancora aperto. Nel sottoschema mancano sedi multiple, gestione con data, ore sui progetti, supervisione e familiari. Accorgersene è parte della progettazione, non un difetto da nascondere aggiungendo automaticamente simboli. Per ogni parte mancante chiediti se il subset dell’editor la supporta; quando non lo fa, usa le note e dichiara il limite.

## Errori comuni

Non convertire subito ogni sostantivo in un’entità né ogni verbo in una relazione. Non assegnare partecipazione totale soltanto perché il testo usa il plurale. Non assumere che una figura senza errori strutturali sia equivalente ai requisiti. Nell’ER Lab il salvataggio conserva una bozza e le sue versioni, non la promuove a progetto verificato. Porta il modello a un interlocutore e cerca controesempi: se una situazione ammessa dal cliente non è rappresentabile, occorre raffinare il progetto.

## Diagramma ragionato

```erdiagram
{"schemaVersion": 1, "metadata": {"id": "example-company", "title": "COMPANY: sottoschema ragionato", "revision": 0, "createdAt": "2026-10-25T00:00:00Z", "modifiedAt": "2026-10-25T00:00:00Z", "notation": "unitn-er-v1", "status": "needs-review"}, "semantic": {"entities": [{"id": "emp", "name": "EMPLOYEES", "weak": false}, {"id": "dept", "name": "DEPARTMENTS", "weak": false}, {"id": "project", "name": "PROJECT", "weak": false}], "attributes": [{"id": "a-emp", "name": "ssn", "ownerId": "emp", "domain": "testo"}, {"id": "a-dept", "name": "did", "ownerId": "dept", "domain": "testo"}, {"id": "since", "name": "since", "ownerId": "works", "domain": "data"}, {"id": "a-project", "name": "Codice", "ownerId": "project", "domain": "testo"}], "identifiers": [{"id": "k-emp", "entityId": "emp", "attributeIds": ["a-emp"], "kind": "primary"}, {"id": "k-dept", "entityId": "dept", "attributeIds": ["a-dept"], "kind": "primary"}, {"id": "k-project", "entityId": "project", "attributeIds": ["a-project"], "kind": "primary"}], "relationships": [{"id": "works", "name": "WORKS_IN", "identifying": false}, {"id": "controls", "name": "CONTROLLA", "identifying": false}], "participations": [{"id": "p-works-0", "entityId": "emp", "relationshipId": "works", "role": "", "min": 1, "max": 1}, {"id": "p-works-1", "entityId": "dept", "relationshipId": "works", "role": "", "min": 1, "max": "N"}, {"id": "p-controls-0", "entityId": "dept", "relationshipId": "controls", "role": "", "min": 0, "max": "N"}, {"id": "p-controls-1", "entityId": "project", "relationshipId": "controls", "role": "", "min": 1, "max": 1}], "generalizations": [], "notes": "Sottoschema didattico, non soluzione completa COMPANY. Il collegamento dipartimento/progetto interpreta il requisito a p. 7, mentre minimi ulteriori, sedi, supervisione e ore richiedono raffinamento. Minimo 1 di DEPARTMENTS in WORKS_IN proviene dalla figura p. 27, non si deduce dal solo requisito p. 8."}, "layout": {"positions": {"emp": {"x": 170, "y": 200}, "a-emp": {"x": 170, "y": 100}, "dept": {"x": 800, "y": 200}, "a-dept": {"x": 800, "y": 100}, "works": {"x": 480, "y": 200}, "since": {"x": 480, "y": 80}, "project": {"x": 800, "y": 490}, "a-project": {"x": 800, "y": 390}, "controls": {"x": 480, "y": 490}}, "viewport": {"x": 0, "y": 0, "zoom": 1}}}
```

Il disegno va letto insieme al paragrafo interpretativo: collocazione grafica e semantica sono separate. Le note esplicitano ipotesi e parti non rappresentate.

```diagram
Requisito testuale → Concetti e identità → Associazioni e vincoli dichiarati → Controesempi e revisione con il cliente
```

## Riepilogo


I requisiti definiscono fatti, identità e situazioni ammesse. Il colore è una scelta di presentazione e non sostituisce questa analisi. Un vincolo plausibile ma non giustificato può vietare casi leciti. Annotare ipotesi e chiedere chiarimenti preserva la distinzione tra requisito e scelta. Un modello può avere riferimenti e nomi validi e omettere un requisito intero. La verifica strutturale non valuta la completezza del mini-mondo. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Quale domanda precede la scelta dei simboli?
2. Un vincolo non esplicitato va inventato per completare il disegno?
3. Validità strutturale implica completezza rispetto al cliente?

## Fonti e pratica

[Fonte pp. 2–9](/sources/er-source#page=2). [Fonte pp. 64–71](/sources/er-source#page=64). [Apri ER Lab](/er-lab) e confronta le alternative nelle attività di Practice.

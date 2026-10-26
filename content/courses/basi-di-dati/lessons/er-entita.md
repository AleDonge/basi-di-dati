---
{
  "id": "er-entita",
  "moduleId": "progettazione-er",
  "slug": "er-entita",
  "title": "Entità, attributi e identificatori",
  "mdxPath": "lessons/er-entita.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 10,
      "pageEnd": 16,
      "section": "Entità, attributi e identificatori"
    }
  ],
  "concepts": [
    "entita",
    "attributi",
    "identificatori"
  ],
  "description": "Progetta e interpreta: entità, attributi e identificatori.",
  "objectives": [
    "Distinguere i concetti e le loro condizioni di applicabilità.",
    "Interpretare la notazione del corso e motivare una scelta progettuale.",
    "Esplicitare ipotesi, controesempi e limiti della verifica automatica."
  ],
  "order": 20,
  "prerequisites": [
    "er-requisiti"
  ],
  "relatedLessonIds": [
    "er-associazioni"
  ],
  "quizPath": "quizzes/er-entita.json"
}
---
> **Provenienza.** Parafrasi e spiegazioni Database Academy delle pagine citate. Esempi e diagrammi seguenti sono rielaborazioni didattiche needs-review, non nuove affermazioni attribuite al docente. Le ipotesi aggiuntive sono esplicite.

## Entità, tipo e insieme

Un’entità è un oggetto distinguibile del mini-mondo che vogliamo rappresentare. Il tipo di entità ne descrive lo schema; un insieme di entità contiene gli oggetti presenti a un certo istante. EMPLOYEES nel diagramma è un tipo, mentre John Smith nell’esempio della fonte è un oggetto. Confondere questi livelli porta a creare un rettangolo per ogni persona invece di descrivere la struttura comune.

Un attributo associa a ogni entità un valore del dominio previsto. Il dominio definisce che cosa un valore può significare e come viene rappresentato: data, numero, testo o un insieme specificato di valori. L’editor conserva il dominio come descrizione, senza generare automaticamente tipi SQL o controllare istanze concrete. Un attributo non coincide con il suo valore: SSN è la proprietà, un particolare codice è un valore della proprietà.

## Tipi di attributi e subset

La p. 12 distingue semplici, composti e multivalore, ma dichiara che il corso utilizzerà attributi semplici, discutendo successivamente come rappresentare gli altri casi. Per questo l’editor non introduce doppi ovali o alberi di attributi composti. La distinzione resta importante nello studio: Nome può avere più componenti; una certificazione può avere più valori. Nel subset scelto occorre valutare una riformulazione tramite entità e associazioni, non perdere silenziosamente l’informazione.

## Identificatori e chiavi

Un identificatore è un insieme di attributi che distingue univocamente un’entità dalle altre del tipo. Se due oggetti hanno gli stessi valori per tutti i componenti della chiave, non possono essere due entità distinte in un’istanza valida. Una chiave composta non rende unico ogni componente separatamente: ragione sociale e provincia possono essere necessarie insieme, come nell’esempio della p. 14.

Un tipo può avere più chiavi candidate. La p. 15 sceglie una primaria e la sottolinea. La piattaforma mantiene separati gli oggetti identificatore e attributo: una lista di due componenti rappresenta una chiave composta, mentre due identificatori diversi rappresentano due alternative. Questo evita di confondere “A e B insieme” con “A oppure B”. Il pannello elenca esplicitamente i gruppi; nel disegno sono sottolineati i componenti della primaria.

## Interpretazione del diagramma

Nel diagramma aggiuntivo EMPLOYEES ha ssn come primaria e DEPARTMENTS ha did. Gli ovali sono collegati al proprietario, non fra loro. L’ovale since appartiene invece all’associazione: non deve diventare accidentalmente una componente dell’identità del dipendente. È possibile creare altri candidati nel modello, ma non vengono tutti disegnati come primarie sottolineate. Il fatto che una proprietà sia una chiave è una dichiarazione sui requisiti, non una conseguenza del suo nome “Id”.

## Progettare e controllare

Nell’editor crea un’entità, aggiungi due attributi, torna all’entità e selezionali nello stesso identificatore. Poi elimina uno degli attributi: il controllo segnala un identificatore vuoto se non rimane alcuna componente, oppure una chiave da riesaminare se il significato è cambiato. Il controllo può trovare riferimenti errati, non dimostrare unicità o minimalità su tutte le istanze possibili.

## Errori comuni

Non usare il nome di una persona come chiave senza un requisito che lo garantisca. Non inventare un identificatore del docente per riempire un diagramma: quando la piattaforma propone un codice aggiuntivo, la scelta è indicata nelle note. Non duplicare la primaria di una superclasse in ogni sottoclasse ISA soltanto per ottenere più ovali sottolineati: l’identità viene ereditata. Per le entità deboli il discorso cambia ancora, perché la chiave parziale deve essere combinata con l’identità del proprietario.

## Diagramma ragionato

```erdiagram
{"schemaVersion": 1, "metadata": {"id": "example-works", "title": "Dipendenti e dipartimenti", "revision": 0, "createdAt": "2026-10-25T00:00:00Z", "modifiedAt": "2026-10-25T00:00:00Z", "notation": "unitn-er-v1", "status": "needs-review"}, "semantic": {"entities": [{"id": "emp", "name": "EMPLOYEES", "weak": false}, {"id": "dept", "name": "DEPARTMENTS", "weak": false}], "attributes": [{"id": "a-emp", "name": "ssn", "ownerId": "emp", "domain": "testo"}, {"id": "a-dept", "name": "did", "ownerId": "dept", "domain": "testo"}, {"id": "since", "name": "since", "ownerId": "works", "domain": "data"}], "identifiers": [{"id": "k-emp", "entityId": "emp", "attributeIds": ["a-emp"], "kind": "primary"}, {"id": "k-dept", "entityId": "dept", "attributeIds": ["a-dept"], "kind": "primary"}], "relationships": [{"id": "works", "name": "WORKS_IN", "identifying": false}], "participations": [{"id": "p-works-0", "entityId": "emp", "relationshipId": "works", "role": "", "min": 1, "max": "N"}, {"id": "p-works-1", "entityId": "dept", "relationshipId": "works", "role": "", "min": 1, "max": "N"}], "generalizations": [], "notes": "Adattamento Database Academy del caso p. 27. Non riproduce ogni attributo della figura; SSN e did come identificatori. Nessuna affermazione sulla correttezza completa dei requisiti."}, "layout": {"positions": {"emp": {"x": 170, "y": 200}, "a-emp": {"x": 170, "y": 100}, "dept": {"x": 800, "y": 200}, "a-dept": {"x": 800, "y": 100}, "works": {"x": 480, "y": 200}, "since": {"x": 480, "y": 80}}, "viewport": {"x": 0, "y": 0, "zoom": 1}}}
```

Il disegno va letto insieme al paragrafo interpretativo: collocazione grafica e semantica sono separate. Le note esplicitano ipotesi e parti non rappresentate.

```diagram
Requisito testuale → Concetti e identità → Associazioni e vincoli dichiarati → Controesempi e revisione con il cliente
```

## Riepilogo


Il rettangolo descrive un tipo. Le singole persone costituiscono le sue istanze e non richiedono un rettangolo ciascuna. Una chiave composta rende unica la combinazione; ciascun valore isolato può ripetersi. Due chiavi candidate separate rappresentano una scelta diversa. La p. 12 sceglie attributi semplici per il corso. Composti e multivalore sono riconosciuti, ma richiedono riformulazioni nel subset usato. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Un rettangolo EMPLOYEES rappresenta…
2. Un identificatore composto richiede…
3. Quali attributi usa principalmente il subset del corso?

## Fonti e pratica

[Fonte pp. 10–16](/sources/er-source#page=10). [Apri ER Lab](/er-lab) e confronta le alternative nelle attività di Practice.

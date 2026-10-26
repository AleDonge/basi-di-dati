---
{
  "id": "er-associazioni",
  "moduleId": "progettazione-er",
  "slug": "er-associazioni",
  "title": "Associazioni, ruoli e proprietà del legame",
  "mdxPath": "lessons/er-associazioni.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 17,
      "pageEnd": 22,
      "section": "Associazioni, ruoli e proprietà del legame"
    },
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 30,
      "pageEnd": 30,
      "section": "Associazioni, ruoli e proprietà del legame"
    },
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 59,
      "pageEnd": 59,
      "section": "Richiamo già discusso nel testo, reso esplicito nei metadati"
    }
  ],
  "concepts": [
    "associazioni",
    "ruoli",
    "grado"
  ],
  "description": "Progetta e interpreta: associazioni, ruoli e proprietà del legame.",
  "objectives": [
    "Distinguere i concetti e le loro condizioni di applicabilità.",
    "Interpretare la notazione del corso e motivare una scelta progettuale.",
    "Esplicitare ipotesi, controesempi e limiti della verifica automatica."
  ],
  "order": 21,
  "prerequisites": [
    "er-entita"
  ],
  "relatedLessonIds": [
    "er-vincoli"
  ],
  "quizPath": "quizzes/er-associazioni.json"
}
---
> **Provenienza.** Parafrasi e spiegazioni Database Academy delle pagine citate. Esempi e diagrammi seguenti sono rielaborazioni didattiche needs-review, non nuove affermazioni attribuite al docente. Le ipotesi aggiuntive sono esplicite.

## Definizione formale e intuizione

Un’associazione rappresenta un legame fra due o più entità. Il relationship type descrive nome, partecipanti e vincoli; il relationship set è l’insieme dei legami presenti in un dato istante. Per una binaria fra E e F, un’istanza del legame può essere pensata come una coppia appartenente a un sottoinsieme di E × F. Questo non significa che tutte le coppie possibili esistano: il requisito determina quali fatti verranno registrati.

Il grado riguarda le partecipazioni che descrivono il fatto. Una relazione binaria collega due ruoli; una ternaria descrive un fatto che coinvolge tre ruoli insieme. Nella ricorsiva REPORTS_TO il tipo EMPLOYEES compare due volte, come supervisore e subordinato. Il disegno non richiede due tipi distinti di dipendente: sono diversi i ruoli nel legame, come mostrato dalla p. 30.

## Attributi dell’associazione

La p. 19 assegna since a WORKS_IN. La data descrive quando una persona ha iniziato quel rapporto con quel dipartimento. Assegnarla al dipendente perderebbe la dipendenza dal dipartimento; assegnarla al dipartimento perderebbe quella dalla persona. Per decidere il proprietario di un attributo chiediti: a parità di un solo partecipante, il valore potrebbe cambiare scegliendo l’altro partecipante?

Le pp. 19–20 chiariscono anche un limite: gli attributi descrittivi non aggiungono identità alla relazione. Per la stessa coppia di dipendente e dipartimento non si possono registrare più valori distinti di since come se fossero fatti separati della stessa binaria. Se servono diversi periodi, il problema non si risolve aggiungendo semplicemente from e to: la lezione sulle scelte progettuali affronta il nuovo concetto necessario.

## Diagramma e interpretazione

Il rombo WORKS_IN collega i rettangoli e ha un ovale since. Scegli una coppia concreta di entità: quel singolo legame può avere la propria data. Il diagramma aggiuntivo conserva la distinzione grafica del corso. Nel modello JSON le partecipazioni sono oggetti autonomi, mentre il collegamento dell’attributo al proprietario deriva da ownerId: non si confondono le due specie di linea.

Per una ricorsiva puoi collegare due volte la stessa entità allo stesso rombo e assegnare ruoli diversi. Il pannello delle proprietà mantiene cardinalità separate per ciascun ruolo. L’editor rifiuta come struttura ambigua due partecipazioni ricorsive senza nomi distinguibili; questo non dimostra comunque che l’interpretazione dei ruoli sia corretta rispetto al requisito.

## Binaria o ternaria

L’esempio delle pp. 21 e 59 richiede di registrare dove un impiegato lavora per un dipartimento: persona, dipartimento e sede formano il fatto. Separare soltanto persona/dipartimento e persona/sede può perdere quale sede sia associata a quale dipartimento per quella persona. Non basta osservare tre sostantivi per scegliere una ternaria: nel caso delle polizze le fonti preferiscono invece due fatti binari distinti.

## Errori e applicazione

Crea una nuova associazione, poi aggiungi due partecipazioni usando i menu, senza trascinare linee. Collega un attributo descrittivo selezionando il rombo prima di creare l’ovale. Cambia proprietario nel pannello e chiediti quale affermazione stai modificando. Non usare attributi duplicati per simulare un nuovo evento. Non interpretare il grado come il numero di rettangoli diversi: una relazione ricorsiva usa due ruoli dello stesso tipo. Infine, considera separatamente lo schema e i suoi dati: il validatore vede la struttura dichiarata, non le istanze del relationship set.

## Diagramma ragionato

```erdiagram
{"schemaVersion": 1, "metadata": {"id": "example-works", "title": "Dipendenti e dipartimenti", "revision": 0, "createdAt": "2026-10-25T00:00:00Z", "modifiedAt": "2026-10-25T00:00:00Z", "notation": "unitn-er-v1", "status": "needs-review"}, "semantic": {"entities": [{"id": "emp", "name": "EMPLOYEES", "weak": false}, {"id": "dept", "name": "DEPARTMENTS", "weak": false}], "attributes": [{"id": "a-emp", "name": "ssn", "ownerId": "emp", "domain": "testo"}, {"id": "a-dept", "name": "did", "ownerId": "dept", "domain": "testo"}, {"id": "since", "name": "since", "ownerId": "works", "domain": "data"}], "identifiers": [{"id": "k-emp", "entityId": "emp", "attributeIds": ["a-emp"], "kind": "primary"}, {"id": "k-dept", "entityId": "dept", "attributeIds": ["a-dept"], "kind": "primary"}], "relationships": [{"id": "works", "name": "WORKS_IN", "identifying": false}], "participations": [{"id": "p-works-0", "entityId": "emp", "relationshipId": "works", "role": "", "min": 1, "max": "N"}, {"id": "p-works-1", "entityId": "dept", "relationshipId": "works", "role": "", "min": 1, "max": "N"}], "generalizations": [], "notes": "Adattamento Database Academy del caso p. 27. Non riproduce ogni attributo della figura; SSN e did come identificatori. Nessuna affermazione sulla correttezza completa dei requisiti."}, "layout": {"positions": {"emp": {"x": 170, "y": 200}, "a-emp": {"x": 170, "y": 100}, "dept": {"x": 800, "y": 200}, "a-dept": {"x": 800, "y": 100}, "works": {"x": 480, "y": 200}, "since": {"x": 480, "y": 80}}, "viewport": {"x": 0, "y": 0, "zoom": 1}}}
```

Il disegno va letto insieme al paragrafo interpretativo: collocazione grafica e semantica sono separate. Le note esplicitano ipotesi e parti non rappresentate.

```diagram
Requisito testuale → Concetti e identità → Associazioni e vincoli dichiarati → Controesempi e revisione con il cliente
```

## Riepilogo


since può variare cambiando la coppia dipendente/dipartimento: per questo descrive il legame, non necessariamente la persona isolata. REPORTS_TO usa lo stesso tipo in due ruoli. Distinguere supervisore e subordinato evita di inventare un secondo tipo di persona. Nel modello il legame è identificato dai partecipanti. Una data diversa non crea automaticamente un secondo legame della stessa coppia: servono periodi/eventi distinti. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. since in WORKS_IN descrive…
2. Una relazione ricorsiva richiede…
3. Un attributo descrittivo distingue due istanze della stessa coppia?

## Fonti e pratica

[Fonte pp. 17–22](/sources/er-source#page=17). [Fonte pp. 30–30](/sources/er-source#page=30). [Apri ER Lab](/er-lab) e confronta le alternative nelle attività di Practice.

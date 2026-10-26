---
{
  "id": "er-deboli",
  "moduleId": "progettazione-er",
  "slug": "er-deboli",
  "title": "Entità deboli e identificazione esterna",
  "mdxPath": "lessons/er-deboli.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 31,
      "pageEnd": 33,
      "section": "Entità deboli e identificazione esterna"
    },
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 55,
      "pageEnd": 58,
      "section": "Richiamo già discusso nel testo, reso esplicito nei metadati"
    }
  ],
  "concepts": [
    "deboli",
    "identificazione",
    "chiave-parziale"
  ],
  "description": "Progetta e interpreta: entità deboli e identificazione esterna.",
  "objectives": [
    "Distinguere i concetti e le loro condizioni di applicabilità.",
    "Interpretare la notazione del corso e motivare una scelta progettuale.",
    "Esplicitare ipotesi, controesempi e limiti della verifica automatica."
  ],
  "order": 23,
  "prerequisites": [
    "er-vincoli"
  ],
  "relatedLessonIds": [
    "er-gerarchie"
  ],
  "quizPath": "quizzes/er-deboli.json"
}
---
> **Provenienza.** Parafrasi e spiegazioni Database Academy delle pagine citate. Esempi e diagrammi seguenti sono rielaborazioni didattiche needs-review, non nuove affermazioni attribuite al docente. Le ipotesi aggiuntive sono esplicite.

## Quando l’identità non è locale

Un’entità debole non dispone di una chiave propria sufficiente a distinguerla in tutto il tipo. È identificata combinando una chiave parziale con l’identità di un’entità proprietaria, attraverso un’associazione identificante. La p. 31 introduce questa dipendenza; non basta chiamare un rettangolo “debole” per renderne esplicito il significato. Occorre sapere rispetto a chi l’oggetto sia distinguibile.

L’esempio dei familiari a carico usa il nome del familiare e lo specifico impiegato associato tramite POLICY. Due familiari con lo stesso nome possono appartenere a impiegati diversi senza essere la stessa entità. Se il requisito non garantisce che il nome sia unico per lo stesso proprietario, anche questa chiave parziale va riesaminata: il disegno non può creare un fatto di unicità che il cliente non ha dichiarato.

## Definizione e vincoli

Se W è un tipo debole, P il proprietario e K una chiave parziale, l’identificazione dipende dalla coppia formata dall’identificatore di P e dai valori di K. Nel subset grafico dell’app ogni entità debole deve avere una chiave parziale e un legame identificante con partecipazione (1,1) verso un proprietario distinto. Questa è una restrizione implementativa dichiarata: varianti più complesse di identificazione esterna non vengono certificate.

Il proprietario non deve necessariamente partecipare in modo totale alla stessa associazione. Un impiegato può non avere familiari a carico, mentre un familiare del tipo debole non può essere rappresentato senza il proprietario da cui dipende. La dipendenza di identità è quindi diversa dall’affermazione “ogni impiegato ha un familiare”.

## Notazione e diagramma

La figura p. 32 rende entità debole e relazione identificante con contorni in grassetto e mostra la chiave parziale tratteggiata. L’app conserva questa convenzione: non sostituisce automaticamente i contorni con doppi rettangoli o doppi rombi di altre notazioni. La legenda rende esplicito il significato della sottolineatura tratteggiata.

Nel diagramma aggiuntivo POLICY collega EMPLOYEES e DEPENDENTS e ha un attributo cost. pname è parziale, ssn appartiene al proprietario. Leggi il lato debole come una partecipazione obbligatoria a una singola identificazione. Il costo è una proprietà del legame e non entra automaticamente nella chiave del familiare.

## Un altro esempio e una cautela

La p. 33 separa ORDER e ORDER_DETAILS. Una riga d’ordine dipende dall’ordine e dal prodotto che compare nella riga, nel requisito illustrato. Lo screenshot mostra uno schema logico con simboli diversi dalla notazione concettuale dominante: non è una richiesta di cambiare tutto l’editor. Anche qui la molteplicità delle righe per lo stesso prodotto deve essere chiarita: se il cliente vuole più righe dello stesso prodotto nello stesso ordine, la combinazione mostrata non basta senza un ulteriore criterio distintivo.

## Progettare e correggere

Nell’editor crea proprietario e debole, aggiungi un attributo al debole e dichiaralo parziale. Crea il rombo identificante e collega i due lati. Il validatore segnala assenza di proprietario, riferimenti inesistenti e partecipazione inadeguata nel subset. Non legge istanze né dimostra che due familiari con gli stessi valori siano impossibili.

## Errori comuni

Non assegnare una primaria locale arbitraria e contemporaneamente dichiarare debole il tipo senza motivare il cambiamento. Non trattare la chiave parziale come unica globalmente. Non eliminare il proprietario lasciando un falso diagramma completo: dopo una cancellazione il validatore deve evidenziare le dipendenze mancanti. Infine non confondere dipendenza di esistenza con correttezza semantica di tutta la polizza: le pp. 55–58 discutono ulteriori scelte di modellazione che richiedono ragionamento separato.

## Diagramma ragionato

```erdiagram
{"schemaVersion": 1, "metadata": {"id": "example-weak", "title": "Familiari e identificazione", "revision": 0, "createdAt": "2026-10-25T00:00:00Z", "modifiedAt": "2026-10-25T00:00:00Z", "notation": "unitn-er-v1", "status": "needs-review"}, "semantic": {"entities": [{"id": "emp", "name": "EMPLOYEES", "weak": false}, {"id": "dependent", "name": "DEPENDENTS", "weak": true}], "attributes": [{"id": "a-emp", "name": "ssn", "ownerId": "emp", "domain": "testo"}, {"id": "a-dependent", "name": "pname", "ownerId": "dependent", "domain": "testo"}, {"id": "cost", "name": "cost", "ownerId": "policy", "domain": "numero"}], "identifiers": [{"id": "k-emp", "entityId": "emp", "attributeIds": ["a-emp"], "kind": "primary"}, {"id": "k-dependent", "entityId": "dependent", "attributeIds": ["a-dependent"], "kind": "partial"}], "relationships": [{"id": "policy", "name": "POLICY", "identifying": true}], "participations": [{"id": "p-policy-0", "entityId": "emp", "relationshipId": "policy", "role": "", "min": 0, "max": "N"}, {"id": "p-policy-1", "entityId": "dependent", "relationshipId": "policy", "role": "", "min": 1, "max": 1}], "generalizations": [], "notes": "Rielaborazione della figura p. 32: debole/identificante in grassetto e chiave parziale tratteggiata. Il minimo sul proprietario non viene assunto totale."}, "layout": {"positions": {"emp": {"x": 170, "y": 230}, "a-emp": {"x": 170, "y": 130}, "dependent": {"x": 800, "y": 230}, "a-dependent": {"x": 800, "y": 130}, "policy": {"x": 480, "y": 230}, "cost": {"x": 480, "y": 80}}, "viewport": {"x": 0, "y": 0, "zoom": 1}}}
```

Il disegno va letto insieme al paragrafo interpretativo: collocazione grafica e semantica sono separate. Le note esplicitano ipotesi e parti non rappresentate.

```diagram
Requisito testuale → Concetti e identità → Associazioni e vincoli dichiarati → Controesempi e revisione con il cliente
```

## Riepilogo


Il valore parziale può ripetersi per proprietari diversi. L’identità completa combina proprietario e chiave parziale. Il subset richiede esistenza del proprietario e una sola identificazione del debole. La semantica di modelli di identificazione più complessi resta manuale. La p. 33 contiene una rappresentazione logica diversa, ma la notazione concettuale del percorso conserva i contorni spessi e la chiave parziale tratteggiata. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. La chiave parziale di un familiare identifica…
2. Il subset editoriale adottato per il lato debole usa…
3. La figura p. 33 impone di adottare crow’s foot per tutto il corso?

## Fonti e pratica

[Fonte pp. 31–33](/sources/er-source#page=31). [Apri ER Lab](/er-lab) e confronta le alternative nelle attività di Practice.

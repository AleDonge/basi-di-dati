---
{
  "id": "er-gerarchie",
  "moduleId": "progettazione-er",
  "slug": "er-gerarchie",
  "title": "Generalizzazione, specializzazione e ISA",
  "mdxPath": "lessons/er-gerarchie.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 35,
      "pageEnd": 40,
      "section": "Generalizzazione, specializzazione e ISA"
    },
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 53,
      "pageEnd": 53,
      "section": "Generalizzazione, specializzazione e ISA"
    }
  ],
  "concepts": [
    "isa",
    "disgiunzione",
    "copertura"
  ],
  "description": "Progetta e interpreta: generalizzazione, specializzazione e isa.",
  "objectives": [
    "Distinguere i concetti e le loro condizioni di applicabilità.",
    "Interpretare la notazione del corso e motivare una scelta progettuale.",
    "Esplicitare ipotesi, controesempi e limiti della verifica automatica."
  ],
  "order": 24,
  "prerequisites": [
    "er-deboli"
  ],
  "relatedLessonIds": [
    "er-aggregazione"
  ],
  "quizPath": "quizzes/er-gerarchie.json"
}
---
> **Provenienza.** Parafrasi e spiegazioni Database Academy delle pagine citate. Esempi e diagrammi seguenti sono rielaborazioni didattiche needs-review, non nuove affermazioni attribuite al docente. Le ipotesi aggiuntive sono esplicite.

## Definizione e interpretazione

Una specializzazione suddivide un tipo in sottotipi, ognuno dei quali contiene entità con caratteristiche proprie. Una generalizzazione raccoglie tipi più specifici in un tipo comune. La gerarchia ISA esprime inclusione: ogni entità della sottoclasse è anche entità della superclasse. Non si tratta di una nuova persona collegata a un’altra persona da una normale associazione, ma dello stesso oggetto visto sotto un tipo più specifico.

Se H e C sono sottoclassi di E, si ha H contenuto in E e C contenuto in E. Gli attributi comuni e l’identità appartengono alla superclasse; i sottotipi aggiungono proprietà o partecipazioni specifiche. Le pp. 36–37 usano dipendenti a ore e a contratto: il costo orario riguarda una sottoclasse, mentre SSN continua a identificare l’impiegato.

## Disgiunzione e sovrapposizione

Una gerarchia disgiunta, indicata con D, richiede che le sottoclassi non abbiano entità in comune. O consente invece sovrapposizione. Non significa che tutte le entità debbano appartenere a più sottoclassi: la consente, senza imporla. La p. 38 distingue il caso contratto/ore dal caso contratto/senior e dichiara come default l’assenza di overlap.

Non si può scegliere D soltanto perché i nomi delle classi sembrano diversi. Occorre sapere se il mini-mondo consente lo stesso oggetto in più categorie. Analogamente, due specializzazioni secondo dimensioni diverse non diventano automaticamente una sola classificazione mutuamente esclusiva: anzianità e tipo di rapporto descrivono criteri differenti.

## Copertura e quattro combinazioni

La copertura totale richiede che ogni entità della superclasse sia presente in almeno una delle sottoclassi considerate; quella parziale non lo richiede. La p. 39 usa una linea doppia per la copertura e specifica che il default è parziale. Totale e disgiunta sono condizioni indipendenti: si possono avere tutti e quattro i casi elencati a p. 40.

Una copertura totale e disgiunta assegna ogni entità a esattamente una delle sottoclassi. Totale e sovrapposta consente più appartenenze ma ne richiede almeno una. Parziale e disgiunta consente oggetti fuori da entrambe le sottoclassi, ma nessuno in comune. Parziale e sovrapposta lascia possibili sia oggetti non classificati sia appartenenze multiple.

## Diagramma e uso dell’editor

Il triangolo ISA del diagramma aggiuntivo mantiene la notazione della p. 36, con D e una linea singola verso EMPLOYEE per copertura parziale. I rami raggiungono HOURLY_EMPS e CONTRACT_EMPS. Il pannello permette di scegliere superclasse, sottoclassi, D/O e copertura, senza un comando grafico obbligatorio. Se una classe viene collegata a se stessa o si forma un ciclo fra gerarchie, la struttura è invalida.

L’app non richiede una nuova primaria locale alle sottoclassi perché ereditano l’identità. Deve però esserci una superclasse identificabile. Il controllo dei riferimenti e dei cicli non verifica che le istanze soddisfino davvero D o copertura: questi rimangono vincoli dichiarati da discutere rispetto ai dati.

## Scelte ed errori comuni

La p. 53 usa MANAGERS per collocare il budget complessivo del manager, evitando di ripeterlo su ciascun incarico. Non creare un sottotipo soltanto per ridurre il numero di righe del disegno: deve esprimere una distinzione del mini-mondo. Non scambiare un’associazione con ISA e non trattare l’assenza di cicli come una prova di buona progettazione. Prova quattro versioni della stessa gerarchia e descrivi in parole quali popolazioni ciascuna ammette: è un controllo semantico più utile della sola forma del triangolo.

## Diagramma ragionato

```erdiagram
{"schemaVersion": 1, "metadata": {"id": "example-isa", "title": "Specializzazione degli impiegati", "revision": 0, "createdAt": "2026-10-25T00:00:00Z", "modifiedAt": "2026-10-25T00:00:00Z", "notation": "unitn-er-v1", "status": "needs-review"}, "semantic": {"entities": [{"id": "emp", "name": "EMPLOYEE", "weak": false}, {"id": "hourly", "name": "HOURLY_EMPS", "weak": false}, {"id": "contract", "name": "CONTRACT_EMPS", "weak": false}], "attributes": [{"id": "a-emp", "name": "ssn", "ownerId": "emp", "domain": "testo"}, {"id": "hourly-rate", "name": "hourly_wages", "ownerId": "hourly", "domain": "numero"}, {"id": "contractid", "name": "contractid", "ownerId": "contract", "domain": "testo"}], "identifiers": [{"id": "k-emp", "entityId": "emp", "attributeIds": ["a-emp"], "kind": "primary"}], "relationships": [], "participations": [], "generalizations": [{"id": "isa", "name": "ISA lavoro", "parentId": "emp", "childIds": ["hourly", "contract"], "disjoint": true, "complete": false}], "notes": "Rielaborazione Database Academy delle pp. 35–40; D e copertura parziale sono dichiarati, non verificati su dati. Nessuna nuova chiave primaria locale per le sottoclassi."}, "layout": {"positions": {"emp": {"x": 480, "y": 140}, "a-emp": {"x": 480, "y": 40}, "hourly": {"x": 180, "y": 470}, "contract": {"x": 800, "y": 470}, "isa": {"x": 480, "y": 330}, "hourly-rate": {"x": 170, "y": 590}, "contractid": {"x": 810, "y": 590}}, "viewport": {"x": 0, "y": 0, "zoom": 1}}}
```

Il disegno va letto insieme al paragrafo interpretativo: collocazione grafica e semantica sono separate. Le note esplicitano ipotesi e parti non rappresentate.

```diagram
Requisito testuale → Concetti e identità → Associazioni e vincoli dichiarati → Controesempi e revisione con il cliente
```

## Riepilogo


D vieta appartenenza contemporanea alle sottoclassi; O la permette senza imporla. Nessuna delle due stabilisce il numero di attributi. La copertura totale esclude entità della superclasse fuori da tutte le sottoclassi. L’identità è ereditata e non richiede una primaria diversa. Le pp. 38–39 dichiarano default disgiunto e parziale. Totale e overlap richiedono una scelta ulteriore giustificata dai requisiti. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. D e O descrivono…
2. La copertura totale richiede…
3. I default dichiarati dal corso sono…

## Fonti e pratica

[Fonte pp. 35–40](/sources/er-source#page=35). [Fonte pp. 53–53](/sources/er-source#page=53). [Apri ER Lab](/er-lab) e confronta le alternative nelle attività di Practice.

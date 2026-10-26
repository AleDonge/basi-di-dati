---
{
  "id": "er-aggregazione",
  "moduleId": "progettazione-er",
  "slug": "er-aggregazione",
  "title": "Aggregazione e identità dei fatti",
  "mdxPath": "lessons/er-aggregazione.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 41,
      "pageEnd": 43,
      "section": "Aggregazione e identità dei fatti"
    },
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 60,
      "pageEnd": 63,
      "section": "Aggregazione e identità dei fatti"
    }
  ],
  "concepts": [
    "aggregazione",
    "sponsorizzazione",
    "limiti"
  ],
  "description": "Progetta e interpreta: aggregazione e identità dei fatti.",
  "objectives": [
    "Distinguere i concetti e le loro condizioni di applicabilità.",
    "Interpretare la notazione del corso e motivare una scelta progettuale.",
    "Esplicitare ipotesi, controesempi e limiti della verifica automatica."
  ],
  "order": 25,
  "prerequisites": [
    "er-gerarchie"
  ],
  "relatedLessonIds": [
    "er-scelte"
  ],
  "quizPath": "quizzes/er-aggregazione.json"
}
---
> **Provenienza.** Parafrasi e spiegazioni Database Academy delle pagine citate. Esempi e diagrammi seguenti sono rielaborazioni didattiche needs-review, non nuove affermazioni attribuite al docente. Le ipotesi aggiuntive sono esplicite.

## Perché un legame può diventare un oggetto di discussione

Finora le associazioni collegavano entità. Le pp. 41–43 introducono una situazione diversa: un dipendente può monitorare una specifica sponsorizzazione di un progetto da parte di un dipartimento. Il fatto sponsorizzazione esiste già come relazione tra progetto e dipartimento; il monitoraggio riguarda proprio quel fatto, non soltanto il progetto isolato o il dipartimento isolato.

L’aggregazione permette di trattare la struttura costituita da partecipanti e relazione come un’unità a cui un’altra associazione può riferirsi. Non è una funzione SQL di aggregazione come SUM o COUNT. Il termine riguarda qui il livello concettuale e il modo di distinguere fatti che hanno identità e significato diversi nel mini-mondo.

## Esempio della fonte

SPONSORS collega PROJECTS e DEPARTMENTS e possiede since. MONITORS collega EMPLOYEES a quella sponsorizzazione e possiede until. Un progetto può essere sponsorizzato da più dipartimenti; conoscere solo il progetto non identifica quale sponsorizzazione sia monitorata. Il riquadro tratteggiato della figura raggruppa il sottoschema rilevante per il secondo legame.

Il diagramma aggiuntivo qui sotto è deliberatamente soltanto il sottoschema di partenza. L’ER Lab non supporta il costrutto grafico di aggregazione: non disegna MONITORS fingendo che un semplice collegamento a un rombo equivalga alla notazione del docente. Per il diagramma completo devi consultare le pp. 42 e 61–63; nel laboratorio puoi annotare il ragionamento e conservare una bozza del subset.

## Distinzione dalla ternaria

Una ternaria fra dipendente, progetto e dipartimento registra combinazioni di tre partecipanti. Non è automaticamente equivalente a due fatti distinti, uno dei quali può esistere senza l’altro. Se vuoi conservare una sponsorizzazione anche quando nessuno la monitora, un’unica relazione che richieda un dipendente per ogni tupla può perdere quel fatto. Occorre esplicitare quali istanze debbano poter esistere indipendentemente.

Anche gli attributi contano. since qualifica la sponsorizzazione, until il monitoraggio. Metterli nella stessa ternaria cambia il modo in cui li colleghi alle entità e può confondere dipendenze differenti. La p. 62 osserva che, eliminando una parte dei requisiti, una ternaria può essere adeguata: la scelta non è dogmatica, dipende dall’informazione che serve preservare.

## Il vincolo sul monitor

Le pp. 43 e 63 discutono il requisito “ogni sponsorizzazione monitorata al massimo da un impiegato”. Il limite è sul fatto progetto/dipartimento considerato come unità, non sul progetto globalmente né sul dipartimento globalmente. Una freccia da una singola entità in una ternaria può imporre un vincolo diverso o più forte. Questa è una delle ragioni per non assegnare automaticamente cardinalità leggendo soltanto la vicinanza dei simboli.

## Progettare e verificare manualmente

Scrivi almeno tre situazioni: una sponsorizzazione senza monitoraggio, due sponsorizzazioni dello stesso progetto da dipartimenti diversi, una sponsorizzazione con un monitor. Domandati quali di queste situazioni il requisito ammetta e come il modello le distinguerebbe. Se una proposta permette due monitor per lo stesso fatto quando il testo lo vieta, il problema è semantico anche se ogni nodo ha un nome e ogni linea ha min–max.

## Errori comuni e limite dichiarato

Non chiamare aggregazione una nuova entità senza spiegare che stai introducendo una riformulazione progettuale. Non associare until al progetto soltanto per semplificare il disegno. Non aspettarti che il validatore del subset riconosca la correttezza di un costrutto che non implementa. L’attività guidata conserva note, versioni e riferimenti; il completamento è una revisione manuale, non un esito automatico di equivalenza con il diagramma delle dispense.

## Diagramma ragionato

```erdiagram
{"schemaVersion": 1, "metadata": {"id": "example-aggregation", "title": "Sponsorizzazioni: subset senza aggregazione", "revision": 0, "createdAt": "2026-10-25T00:00:00Z", "modifiedAt": "2026-10-25T00:00:00Z", "notation": "unitn-er-v1", "status": "needs-review"}, "semantic": {"entities": [{"id": "project", "name": "PROJECTS", "weak": false}, {"id": "dept", "name": "DEPARTMENTS", "weak": false}, {"id": "emp", "name": "EMPLOYEES", "weak": false}], "attributes": [{"id": "a-project", "name": "pid", "ownerId": "project", "domain": "testo"}, {"id": "a-dept", "name": "did", "ownerId": "dept", "domain": "testo"}, {"id": "a-emp", "name": "ssn", "ownerId": "emp", "domain": "testo"}, {"id": "since", "name": "since", "ownerId": "sponsors", "domain": "data"}], "identifiers": [{"id": "k-project", "entityId": "project", "attributeIds": ["a-project"], "kind": "primary"}, {"id": "k-dept", "entityId": "dept", "attributeIds": ["a-dept"], "kind": "primary"}, {"id": "k-emp", "entityId": "emp", "attributeIds": ["a-emp"], "kind": "primary"}], "relationships": [{"id": "sponsors", "name": "SPONSORS", "identifying": false}], "participations": [{"id": "p-sponsors-0", "entityId": "project", "relationshipId": "sponsors", "role": "", "min": 0, "max": "N"}, {"id": "p-sponsors-1", "entityId": "dept", "relationshipId": "sponsors", "role": "", "min": 0, "max": "N"}], "generalizations": [], "notes": "L’aggregazione delle pp. 41–43/61–63 non è implementata sul canvas. Questo è solo il sottoschema di partenza: descrivere nelle note MONITORS, until e vincolo su una sponsorizzazione; non sostituire silenziosamente con una ternaria."}, "layout": {"positions": {"project": {"x": 160, "y": 380}, "a-project": {"x": 160, "y": 280}, "dept": {"x": 800, "y": 380}, "a-dept": {"x": 800, "y": 280}, "emp": {"x": 480, "y": 100}, "a-emp": {"x": 480, "y": 0}, "sponsors": {"x": 480, "y": 380}, "since": {"x": 480, "y": 540}}, "viewport": {"x": 0, "y": 0, "zoom": 1}}}
```

Il disegno va letto insieme al paragrafo interpretativo: collocazione grafica e semantica sono separate. Le note esplicitano ipotesi e parti non rappresentate.

```diagram
Requisito testuale → Concetti e identità → Associazioni e vincoli dichiarati → Controesempi e revisione con il cliente
```

## Riepilogo


Una sponsorizzazione può esistere senza monitoraggio e i due fatti hanno proprietà distinte. Una ternaria unica non conserva automaticamente questa indipendenza. Il costrutto non è nel modello editabile: note e fonte permettono lo studio guidato, senza fingere una verifica strutturale di aggregazioni. since descrive la sponsorizzazione e until il monitoraggio di quel fatto. Spostare until sul progetto cambierebbe la dipendenza informativa. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. MONITORS e SPONSORS rappresentano…
2. L’aggregazione è disegnabile nel subset dell’editor?
3. until nel caso discusso appartiene…

## Fonti e pratica

[Fonte pp. 41–43](/sources/er-source#page=41). [Fonte pp. 60–63](/sources/er-source#page=60). [Apri ER Lab](/er-lab) e confronta le alternative nelle attività di Practice.

---
{
  "id": "er-scelte",
  "moduleId": "progettazione-er",
  "slug": "er-scelte",
  "title": "Scelte progettuali, periodi e polizze",
  "mdxPath": "lessons/er-scelte.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 44,
      "pageEnd": 59,
      "section": "Scelte progettuali, periodi e polizze"
    },
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 12,
      "pageEnd": 12,
      "section": "Richiamo già discusso nel testo, reso esplicito nei metadati"
    }
  ],
  "concepts": [
    "modellazione",
    "periodi",
    "polizze"
  ],
  "description": "Progetta e interpreta: scelte progettuali, periodi e polizze.",
  "objectives": [
    "Distinguere i concetti e le loro condizioni di applicabilità.",
    "Interpretare la notazione del corso e motivare una scelta progettuale.",
    "Esplicitare ipotesi, controesempi e limiti della verifica automatica."
  ],
  "order": 26,
  "prerequisites": [
    "er-aggregazione"
  ],
  "relatedLessonIds": [
    "er-requisiti"
  ],
  "quizPath": "quizzes/er-scelte.json"
}
---
> **Provenienza.** Parafrasi e spiegazioni Database Academy delle pagine citate. Esempi e diagrammi seguenti sono rielaborazioni didattiche needs-review, non nuove affermazioni attribuite al docente. Le ipotesi aggiuntive sono esplicite.

## Progettare significa scegliere sotto ipotesi esplicite

La p. 45 sottolinea che lo stesso insieme di requisiti può essere modellato in modi diversi e che ER non esprime tutti i vincoli di dominio. Non esiste quindi una regola puramente grafica che trasformi qualsiasi testo in un unico diagramma corretto. Le scelte devono essere motivate da fatti rappresentabili, vincoli e possibili controesempi. Il validatore strutturale aiuta a evitare incoerenze interne, non sostituisce questa analisi.

Le dispense discutono entità contro attributo, entità contro relazione, grado delle associazioni e aggregazione. Il criterio comune è domandarsi che cosa identifichi un fatto e quali proprietà dipendano da quell’identità. Scegliere una forma solo perché richiede meno simboli può introdurre perdita di informazione o ridondanza.

## Indirizzo come attributo o entità

Le pp. 47–48 propongono INDIRIZZO quando servono più valori oppure componenti interrogabili, nel subset a soli attributi semplici adottato dal corso. Se bastasse un valore atomico e singolo, un attributo potrebbe essere più semplice. Non trasformare questa scelta in una legge universale contro attributi composti: altre varianti di ER li ammettono, come riconosciuto dalla p. 12.

Un codice aggiuntivo per INDIRIZZO può essere una scelta progettuale della piattaforma, ma non va spacciato per una chiave dichiarata nel testo. Chiarisci anche se due persone possano condividere lo stesso indirizzo e come venga stabilita l’identità dell’indirizzo: il solo nome della via non è necessariamente sufficiente.

## Più periodi di lavoro

Le pp. 49–50 mostrano che from e to su WORKS_IN consentono un solo periodo per la coppia dipendente/dipartimento. Il raffinamento introduce Duration e una ternaria: lo stesso dipendente può così comparire con lo stesso dipartimento in più fatti, distinti dal periodo. Nel diagramma aggiuntivo la piattaforma propone PERIODO con IdPeriodo, una scelta supplementare esplicitamente dichiarata nelle note, non un attributo inventato attribuito al docente.

Leggi il nuovo disegno chiedendoti quali tuple distingue. Il periodo non è una semplice etichetta: entra come partecipante nel fatto. Il diagramma non garantisce da solo che la data iniziale preceda quella finale, che due periodi non si sovrappongano o che non esistano periodi identici con codici diversi. Questi vincoli devono essere annotati e verificati separatamente.

## Proprietà del manager o dell’incarico

Le pp. 51–53 discutono un budget complessivo del manager che gestisce più dipartimenti. Ripeterlo su ogni MANAGES crea ridondanza e comunica che sia proprietà della coppia. Una sottoclasse MANAGERS può invece ricevere il budget. La data since può dover tornare sull’incarico se varia per dipartimento: non basta spostare tutti gli attributi nello stesso punto senza analizzarne la dipendenza.

## Polizze: due fatti invece di una ternaria

Le pp. 55–58 richiedono un possessore della polizza e vietano possessori congiunti. I tentativi di imporre vincoli sulla ternaria COVERS possono limitare anche i beneficiari oppure richiedere che ogni polizza ne copra almeno uno. Separare PURCHASER e BENEFICIARY distingue possesso e copertura. Rimangono da discutere l’identità del familiare e la portata della chiave parziale rispetto al precedente caso p. 32.

## Metodo ed errori comuni

Per ogni alternativa scrivi una situazione che deve essere ammessa e una che deve essere vietata. Non trattare il raffinamento come un semplice abbellimento. Non accettare una figura parziale come soluzione completa di COMPANY. Nel laboratorio conserva le ipotesi nelle note, usa le versioni per confrontare le scelte e richiedi chiarimenti quando il testo non giustifica una decisione. Il completamento manuale registra questo lavoro; non dichiara equivalenza semantica generale.

## Diagramma ragionato

```erdiagram
{"schemaVersion": 1, "metadata": {"id": "example-period", "title": "Periodi di collaborazione", "revision": 0, "createdAt": "2026-10-25T00:00:00Z", "modifiedAt": "2026-10-25T00:00:00Z", "notation": "unitn-er-v1", "status": "needs-review"}, "semantic": {"entities": [{"id": "emp", "name": "EMPLOYEES", "weak": false}, {"id": "dept", "name": "DEPARTMENTS", "weak": false}, {"id": "duration", "name": "PERIODO", "weak": false}], "attributes": [{"id": "a-emp", "name": "ssn", "ownerId": "emp", "domain": "testo"}, {"id": "a-dept", "name": "did", "ownerId": "dept", "domain": "testo"}, {"id": "a-duration", "name": "IdPeriodo", "ownerId": "duration", "domain": "testo"}, {"id": "from", "name": "from", "ownerId": "duration", "domain": "data"}, {"id": "to", "name": "to", "ownerId": "duration", "domain": "data"}], "identifiers": [{"id": "k-emp", "entityId": "emp", "attributeIds": ["a-emp"], "kind": "primary"}, {"id": "k-dept", "entityId": "dept", "attributeIds": ["a-dept"], "kind": "primary"}, {"id": "k-duration", "entityId": "duration", "attributeIds": ["a-duration"], "kind": "primary"}], "relationships": [{"id": "works", "name": "WORKS_IN", "identifying": false}], "participations": [{"id": "p-works-0", "entityId": "emp", "relationshipId": "works", "role": "", "min": 1, "max": "N"}, {"id": "p-works-1", "entityId": "dept", "relationshipId": "works", "role": "", "min": 1, "max": "N"}, {"id": "p-duration", "entityId": "duration", "relationshipId": "works", "role": "periodo", "min": 1, "max": 1}], "generalizations": [], "notes": "Adattamento del caso p. 50, con IdPeriodo aggiunto dalla piattaforma come scelta tecnica da discutere. La ternaria consente più tuple per la stessa coppia dipendente/dipartimento con periodi distinti; unicità dei periodi e cronologia non verificate."}, "layout": {"positions": {"emp": {"x": 170, "y": 200}, "a-emp": {"x": 170, "y": 100}, "dept": {"x": 800, "y": 200}, "a-dept": {"x": 800, "y": 100}, "works": {"x": 480, "y": 200}, "duration": {"x": 480, "y": 430}, "a-duration": {"x": 480, "y": 330}, "from": {"x": 250, "y": 450}, "to": {"x": 750, "y": 450}}, "viewport": {"x": 0, "y": 0, "zoom": 1}}}
```

Il disegno va letto insieme al paragrafo interpretativo: collocazione grafica e semantica sono separate. Le note esplicitano ipotesi e parti non rappresentate.

```diagram
Requisito testuale → Concetti e identità → Associazioni e vincoli dichiarati → Controesempi e revisione con il cliente
```

## Riepilogo


La coppia identifica ancora un solo fatto, anche con due attributi temporali. Un concetto di periodo può distinguere più occorrenze sotto ipotesi esplicite. Il totale appartiene al manager: ripeterlo su ogni incarico introduce ridondanza e attribuisce il valore alla coppia sbagliata. Separare proiezioni binarie può perdere quali tre partecipanti formassero insieme un fatto. L’equivalenza dipende dai vincoli, non dal numero di linee. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Per rappresentare più periodi della stessa coppia basta aggiungere from e to alla binaria?
2. Un budget complessivo del manager va ripetuto su ogni incarico?
3. Due relazioni binarie sostituiscono sempre una ternaria?

## Fonti e pratica

[Fonte pp. 44–59](/sources/er-source#page=44). [Apri ER Lab](/er-lab) e confronta le alternative nelle attività di Practice.

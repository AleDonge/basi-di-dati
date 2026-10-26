---
{
  "id": "er-vincoli",
  "moduleId": "progettazione-er",
  "slug": "er-vincoli",
  "title": "Cardinalità, chiave e partecipazione",
  "mdxPath": "lessons/er-vincoli.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 23,
      "pageEnd": 29,
      "section": "Cardinalità, chiave e partecipazione"
    },
    {
      "sourceId": "er-source",
      "file": "Argomento05 Entity Relationship.pdf",
      "pageStart": 34,
      "pageEnd": 34,
      "section": "Cardinalità, chiave e partecipazione"
    }
  ],
  "concepts": [
    "cardinalita",
    "partecipazione",
    "vincoli"
  ],
  "description": "Progetta e interpreta: cardinalità, chiave e partecipazione.",
  "objectives": [
    "Distinguere i concetti e le loro condizioni di applicabilità.",
    "Interpretare la notazione del corso e motivare una scelta progettuale.",
    "Esplicitare ipotesi, controesempi e limiti della verifica automatica."
  ],
  "order": 22,
  "prerequisites": [
    "er-associazioni"
  ],
  "relatedLessonIds": [
    "er-deboli"
  ],
  "quizPath": "quizzes/er-vincoli.json"
}
---
> **Provenienza.** Parafrasi e spiegazioni Database Academy delle pagine citate. Esempi e diagrammi seguenti sono rielaborazioni didattiche needs-review, non nuove affermazioni attribuite al docente. Le ipotesi aggiuntive sono esplicite.

## Due domande indipendenti

Un vincolo massimo risponde a “quante volte può comparire questa entità nel legame?”. Un vincolo minimo risponde a “può non comparire mai?”. Sono domande diverse. Un dipartimento con al massimo un manager non ha necessariamente un manager; per imporne l’esistenza occorre anche la partecipazione totale. Il corso usa la freccia verso il rombo per il massimo uno e una linea in grassetto per il minimo almeno uno.

## Definizione min–max

Per ciascuna entità e ciascun ruolo, si conta il numero delle istanze dell’associazione a cui partecipa. La coppia (min,max) impone un intervallo ammesso per quel conteggio. N indica un massimo non prefissato. (0,N) è il default senza vincoli nella p. 29; (1,1) impone esattamente una partecipazione. Anche limiti finiti diversi da uno e minimi maggiori di uno sono documentati dalla p. 34 e richiedono l’etichetta esplicita.

Il validatore controlla che il minimo sia non negativo, che il massimo finito sia positivo e che il minimo non superi il massimo. Questi sono controlli sulla dichiarazione; non verificano che un insieme di dati reali soddisfi il conteggio. Una cardinalità formalmente valida può ancora essere la cardinalità sbagliata per il requisito.

## Leggere correttamente il lato

Nell’esempio MANAGES della p. 29, (1,1) sul lato DEPARTMENT significa che ogni dipartimento è collegato esattamente a un incarico di gestione. (0,1) sul lato EMPLOYEE consente che un dipendente non gestisca dipartimenti e ne limita a uno gli incarichi. Questi vincoli non vanno trasferiti automaticamente ad altri esempi: le pp. 51–53 discutono proprio un manager che può gestire più dipartimenti.

Nel diagramma WORKS_IN aggiuntivo della lezione, (1,1) sul lato EMPLOYEES impone un solo dipartimento per dipendente. (1,N) sul lato DEPARTMENTS impone almeno un dipendente e consente molti legami. La freccia punta dall’entità al rombo, come nelle pp. 24 e 34: non adottiamo silenziosamente la convenzione di altri standard.

## Relazioni di grado maggiore

La p. 25 formula il vincolo come unicità della comparsa di una certa entità nel relationship set e lo illustra con una ternaria. La frase sull’impiegato e la sede può indurre una lettura diversa, relativa a una coppia già fissata. L’app mantiene esplicito il conteggio per entità/ruolo delle istanze complete e segnala ogni ternaria come aspetto da verificare manualmente. Non promette di esprimere ogni dipendenza funzionale su gruppi di partecipanti.

## Progettare dai requisiti

Scrivi due frasi per ogni partecipazione: “un E può essere assente?” e “un E può comparire con più legami?”. Cerca un controesempio per ciascuna risposta. Se il cliente ammette un reparto appena creato senza personale, minimo uno su quel lato sarebbe eccessivo. Se invece deve esistere sempre un responsabile, massimo uno da solo sarebbe insufficiente. Quando il testo tace, registra il dubbio nelle note.

## Errori comuni

Non confondere partecipazione totale con uno-a-uno; una linea spessa può accompagnare massimo N. Non leggere il massimo della parte opposta come se appartenesse al lato selezionato. Non applicare in automatico ai ruoli ricorsivi la stessa cardinalità: un supervisore può avere molti subordinati, mentre un subordinato può avere un solo supervisore nel requisito considerato. Nell’editor seleziona la singola partecipazione per cambiare min, max e ruolo e controlla contemporaneamente l’etichetta e il pannello.

## Diagramma ragionato

```erdiagram
{"schemaVersion": 1, "metadata": {"id": "example-works-ref", "title": "Dipendenti e dipartimenti", "revision": 0, "createdAt": "2026-10-25T00:00:00Z", "modifiedAt": "2026-10-25T00:00:00Z", "notation": "unitn-er-v1", "status": "needs-review"}, "semantic": {"entities": [{"id": "emp", "name": "EMPLOYEES", "weak": false}, {"id": "dept", "name": "DEPARTMENTS", "weak": false}], "attributes": [{"id": "a-emp", "name": "ssn", "ownerId": "emp", "domain": "testo"}, {"id": "a-dept", "name": "did", "ownerId": "dept", "domain": "testo"}, {"id": "since", "name": "since", "ownerId": "works", "domain": "data"}], "identifiers": [{"id": "k-emp", "entityId": "emp", "attributeIds": ["a-emp"], "kind": "primary"}, {"id": "k-dept", "entityId": "dept", "attributeIds": ["a-dept"], "kind": "primary"}], "relationships": [{"id": "works", "name": "WORKS_IN", "identifying": false}], "participations": [{"id": "p-works-0", "entityId": "emp", "relationshipId": "works", "role": "", "min": 1, "max": 1}, {"id": "p-works-1", "entityId": "dept", "relationshipId": "works", "role": "", "min": 1, "max": "N"}], "generalizations": [], "notes": "Adattamento Database Academy del caso p. 27. Non riproduce ogni attributo della figura; SSN e did come identificatori. Nessuna affermazione sulla correttezza completa dei requisiti."}, "layout": {"positions": {"emp": {"x": 170, "y": 200}, "a-emp": {"x": 170, "y": 100}, "dept": {"x": 800, "y": 200}, "a-dept": {"x": 800, "y": 100}, "works": {"x": 480, "y": 200}, "since": {"x": 480, "y": 80}}, "viewport": {"x": 0, "y": 0, "zoom": 1}}}
```

Il disegno va letto insieme al paragrafo interpretativo: collocazione grafica e semantica sono separate. Le note esplicitano ipotesi e parti non rappresentate.

```diagram
Requisito testuale → Concetti e identità → Associazioni e vincoli dichiarati → Controesempi e revisione con il cliente
```

## Riepilogo


La notazione del corso orienta la freccia dall’entità vincolata al rombo per massimo uno. Non si sostituisce con simboli di altri standard. Si contano i legami della singola entità in quel ruolo: minimo uno e massimo uno. Non si limita a una il numero totale delle entità. La p. 29 non impone obbligatorietà o unicità in assenza di vincoli: minimo zero e massimo N. (1,1) aggiungerebbe due condizioni. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. La freccia di chiave del corso punta…
2. Una partecipazione (1,1) significa…
3. Il default senza vincoli min–max è…

## Fonti e pratica

[Fonte pp. 23–29](/sources/er-source#page=23). [Fonte pp. 34–34](/sources/er-source#page=34). [Apri ER Lab](/er-lab) e confronta le alternative nelle attività di Practice.

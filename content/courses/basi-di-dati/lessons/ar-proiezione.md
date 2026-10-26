---
{
  "id": "ar-proiezione",
  "moduleId": "algebra-relazionale",
  "slug": "ar-proiezione",
  "title": "Proiezione, duplicati e identità",
  "mdxPath": "lessons/ar-proiezione.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "algebra-source",
      "file": "Argomento03 Algebra Relazionale.pdf",
      "pageStart": 13,
      "pageEnd": 20,
      "section": "Proiezione, duplicati e identità"
    },
    {
      "sourceId": "algebra-self-source",
      "file": "Argomento03.1 Algebra Relazionale Autoverifica.pdf",
      "pageStart": 8,
      "pageEnd": 8,
      "section": "Richiamo già discusso nel testo, reso esplicito nei metadati"
    }
  ],
  "concepts": [
    "proiezione",
    "duplicati",
    "chiusura"
  ],
  "description": "Definizioni, esempi ragionati, tabelle e limiti: proiezione, duplicati e identità.",
  "objectives": [
    "Spiegare le definizioni e distinguere schema e istanza.",
    "Applicare la sintassi documentata e controllare le relazioni intermedie.",
    "Riconoscere errori tipici e limiti del subset eseguibile."
  ],
  "order": 11,
  "prerequisites": [
    "ar-selezione"
  ],
  "relatedLessonIds": [
    "ar-insiemi"
  ],
  "quizPath": "quizzes/ar-proiezione.json"
}
---
> **Provenienza.** Parafrasi didattica delle pagine 13–20 di Argomento03. Definizioni e argomenti seguono la fonte; esempi numerici, sintassi del laboratorio, precisazioni e domande sono aggiunte Database Academy da revisionare. Non sono nuove affermazioni attribuite al docente.

## Definizione formale

La proiezione mantiene alcuni attributi di una relazione. Se Y è una lista di attributi distinti presenti nello schema di R, $\pi_Y(R)=\{t[Y]\mid t\in R\}$. La restrizione t[Y] prende soltanto le componenti richieste. Essendo un insieme, il risultato non contiene tuple duplicate. L’ordine delle colonne è quello della lista della proiezione; l’ordine delle tuple non ha significato matematico.

## Intuizione e sintassi

Pensa a una scheda con informazioni che non servono alla domanda. Se chiedi i nomi dei marinai, matricola, età e giudizio non devono necessariamente comparire nella risposta. Scrivi `π_{sname}(Sailors)` oppure `project[sname](Sailors)`. Per nome e giudizio usa `π_{sname,rating}(Sailors)`. La proiezione non filtra una persona perché è troppo giovane: quello è compito della selezione.

## Tabelle prima e dopo

Dati illustrativi aggiuntivi, diversi dall’originale:

| sid | sname | rating |
|---:|---|---:|
| 1 | Ada | 8 |
| 2 | Ada | 8 |
| 3 | Nora | 8 |

Proiezione su sname, rating:

| sname | rating |
|---|---:|
| Ada | 8 |
| Nora | 8 |

Le due Ada erano persone distinte, ma le tuple proiettate sono identiche. Il risultato non può ricordare quale persona avesse prodotto una riga dopo aver eliminato sid. Proiettando anche sid avresti invece tre tuple. Per questo includere una chiave preserva la cardinalità, mentre un elenco senza chiave può ridurla.

## Comporre selezione e proiezione

Per ottenere i nomi dei marinai con età maggiore di 30, valuta prima `σ_{age>30}(Sailors)` e poi proietta sname: `π_{sname}(σ_{age>30}(Sailors))`. Leggi dall’interno verso l’esterno. Nell’albero il primo nodo è la relazione, poi compare il filtro e infine la proiezione. Il risultato della selezione conserva age, quello della proiezione finale no.

Scambiare i due operatori senza controllare gli attributi rende l’espressione priva di significato: `σ_{age>30}(π_{sname}(Sailors))` cerca age dove non esiste più. Una riscrittura valida può mantenere age in una proiezione anticipata, applicare il filtro e infine rimuoverla. Lo stesso controllo è necessario per i campi dei join.

## Proprietà e cautela sulle fonti

La pagina 16 afferma correttamente che la proiezione non è generalmente commutativa; la formula che segue è da leggere con cautela perché può produrre espressioni non definite. La precisazione della piattaforma è questa: $\pi_A(\pi_B(R))=\pi_A(R)$ quando tutti gli attributi di A appartengono a B. Non segue che sia possibile applicare entrambe le proiezioni in qualsiasi ordine. Questa condizione è una spiegazione aggiuntiva, non una correzione attribuita al docente.

## Applicazione ed errori comuni

Esegui `π_{sname}(Sailors)` sullo script ufficiale: dieci marinai diventano nove nomi perché Horatio compare per due sid. Poi proietta sid, sname: tornano dieci tuple. Non aggiungere DISTINCT: la semantica del laboratorio è già insiemistica. Non usare il nome come chiave quando cerchi una persona che abbia due proprietà: prima interseca i sid, poi proietta i nomi. La pagina 8 dell’Autoverifica illustra proprio il rischio degli omonimi. Un risultato apparentemente giusto su pochi dati non rende valida una proiezione anticipata in generale.

## Percorso visivo

```diagram
Relazione di partenza e schema → Controllo delle condizioni dell’operatore → Trasformazione delle tuple → Relazione risultante e controllo del significato
```

## Riepilogo


Proiettando sname da due persone Ada si ottiene una sola tupla Ada: la relazione risultante è un insieme. Una chiave distingue ogni tupla: conservarla impedisce che due tuple diverse diventino identiche nella proiezione. Dopo la proiezione lo schema contiene soltanto sname: non esiste una colonna age nascosta su cui applicare il predicato. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Cosa accade ai duplicati dopo una proiezione?
2. Che cosa succede se una relazione di ingresso è vuota? Lo schema rimane noto?
3. Quale errore mostrerebbe un esempio con omonimi o valori al confine della soglia?

## Fonti e collegamenti

[Apri le pagine 13–20 della fonte](/sources/algebra-source#page=13). [Sperimenta nel laboratorio](/algebra-lab). Gli esercizi in Practice distinguono le verifiche automatiche dalle riflessioni guidate.

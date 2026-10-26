---
{
  "id": "ar-insiemi",
  "moduleId": "algebra-relazionale",
  "slug": "ar-insiemi",
  "title": "Unione, intersezione e differenza",
  "mdxPath": "lessons/ar-insiemi.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "algebra-source",
      "file": "Argomento03 Algebra Relazionale.pdf",
      "pageStart": 21,
      "pageEnd": 25,
      "section": "Unione, intersezione e differenza"
    }
  ],
  "concepts": [
    "unione",
    "intersezione",
    "differenza"
  ],
  "description": "Definizioni, esempi ragionati, tabelle e limiti: unione, intersezione e differenza.",
  "objectives": [
    "Spiegare le definizioni e distinguere schema e istanza.",
    "Applicare la sintassi documentata e controllare le relazioni intermedie.",
    "Riconoscere errori tipici e limiti del subset eseguibile."
  ],
  "order": 12,
  "prerequisites": [
    "ar-proiezione"
  ],
  "relatedLessonIds": [
    "ar-prodotto"
  ],
  "quizPath": "quizzes/ar-insiemi.json"
}
---
> **Provenienza.** Parafrasi didattica delle pagine 21–25 di Argomento03. Definizioni e argomenti seguono la fonte; esempi numerici, sintassi del laboratorio, precisazioni e domande sono aggiunte Database Academy da revisionare. Non sono nuove affermazioni attribuite al docente.

## Definizioni formali e compatibilità

Unione, intersezione e differenza confrontano tuple intere di relazioni compatibili. $R\cup S=\{t\mid t\in R\lor t\in S\}$; $R\cap S=\{t\mid t\in R\land t\in S\}$; $R-S=\{t\mid t\in R\land t\notin S\}$. L’unione combina alternative, l’intersezione richiede entrambe le appartenenze, la differenza esclude un insieme di casi. Non servono molteplicità: ogni tupla compare al massimo una volta.

Compatibilità significa stessa arità e domini compatibili per posizione. Due colonne numeriche possono essere confrontate anche se hanno nomi differenti: le fonti adottano per convenzione i nomi del primo operando. Nel laboratorio questa convenzione è implementata. Non significa che qualsiasi numero abbia lo stesso significato: unire età e codici potrebbe essere formalmente ammesso dai domini ma privo di senso per la domanda. La responsabilità di scegliere gli attributi corretti rimane essenziale.

## Sintassi

Scrivi `R ∪ S`, `R ∩ S`, `R − S`; gli alias ASCII sono UNION, INTERSECT e DIFF. R e S possono essere espressioni complete. Nel lab ∩ lega più di ∪ e −; a pari precedenza si procede da sinistra. Le parentesi rendono esplicita una differenza annidata: `R − (S − T)` non è in generale uguale a `(R − S) − T`.

## Esempio con tabelle prima e dopo

Dati didattici della piattaforma, attributo sid numerico:

| R.sid |
|---:|
| 1 |
| 2 |

| S.sid |
|---:|
| 2 |
| 3 |

I risultati sono:

| R ∪ S: sid |
|---:|
| 1 |
| 2 |
| 3 |

| R ∩ S: sid |
|---:|
| 2 |

| R − S: sid |
|---:|
| 1 |

Invertendo la differenza ottieni 3, non 1. L’elemento 2 nell’unione non compare due volte. Una relazione vuota è compatibile se conserva lo schema corretto: R unito al vuoto resta R, R intersecato al vuoto è vuoto e R meno il vuoto resta R.

## Proprietà e identità

Unione e intersezione sono commutative e associative, come indicato nelle fonti. La differenza non è commutativa. Una identità utile è $R\cap S=R-(R-S)$, purché gli schemi siano compatibili. Puoi verificarla su dati e poi ragionare sulle condizioni di appartenenza: essere in R senza essere tra gli elementi di R fuori da S equivale a essere in entrambi. Il confronto di fixture può suggerire l’identità, ma la spiegazione per appartenenza è ciò che ne giustifica la generalità.

## Applicazione alle prenotazioni

Per una barca rossa **o** verde puoi unire i sid ottenuti dai due percorsi di join. Per una rossa **e** una verde devi intersecare i sid. Solo dopo colleghi Sailors e proietti sname. Intersecare direttamente i nomi può mescolare due omonimi: una Ada ha solo una rossa, l’altra solo una verde, ma il nome appare in entrambi gli insiemi. La fixture aggiuntiva rende visibile questo errore senza alterare lo script ufficiale.

## Errori comuni

Non intersecare tuple con attributi diversi sperando che il sistema indovini quale colonna sia la chiave. Non usare `color='red' AND color='green'` su una singola tupla: un colore non assume contemporaneamente entrambi i valori. Per “nessuna prenotazione”, invece, sottrai i sid prenotanti dall’insieme completo dei marinai, così conservi anche chi non compare mai in Reserves.

## Percorso visivo

```diagram
Relazione di partenza e schema → Controllo delle condizioni dell’operatore → Trasformazione delle tuple → Relazione risultante e controllo del significato
```

## Riepilogo


R−S conserva chi appartiene a R e non a S. L’intersezione conserva invece soltanto chi appartiene a entrambi. Con R={1,2} e S={2,3}, R−S={1}, mentre S−R={3}: invertire gli operandi cambia la risposta. Due omonimi possono soddisfare separatamente le proprietà. Intersecare identificativi richiede che entrambe valgano per la medesima persona. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Quale operazione restituisce gli elementi di R assenti da S?
2. Che cosa succede se una relazione di ingresso è vuota? Lo schema rimane noto?
3. Quale errore mostrerebbe un esempio con omonimi o valori al confine della soglia?

## Fonti e collegamenti

[Apri le pagine 21–25 della fonte](/sources/algebra-source#page=21). [Sperimenta nel laboratorio](/algebra-lab). Gli esercizi in Practice distinguono le verifiche automatiche dalle riflessioni guidate.

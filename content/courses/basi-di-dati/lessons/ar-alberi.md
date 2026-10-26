---
{
  "id": "ar-alberi",
  "moduleId": "algebra-relazionale",
  "slug": "ar-alberi",
  "title": "Composizione, query tree e ottimizzazione",
  "mdxPath": "lessons/ar-alberi.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "algebra-source",
      "file": "Argomento03 Algebra Relazionale.pdf",
      "pageStart": 44,
      "pageEnd": 48,
      "section": "Composizione, query tree e ottimizzazione"
    }
  ],
  "concepts": [
    "composizione",
    "alberi",
    "ottimizzazione"
  ],
  "description": "Definizioni, esempi ragionati, tabelle e limiti: composizione, query tree e ottimizzazione.",
  "objectives": [
    "Spiegare le definizioni e distinguere schema e istanza.",
    "Applicare la sintassi documentata e controllare le relazioni intermedie.",
    "Riconoscere errori tipici e limiti del subset eseguibile."
  ],
  "order": 18,
  "prerequisites": [
    "ar-estensioni"
  ],
  "relatedLessonIds": [
    "ar-selezione"
  ],
  "quizPath": "quizzes/ar-alberi.json"
}
---
> **Provenienza.** Parafrasi didattica delle pagine 44–48 di Argomento03. Definizioni e argomenti seguono la fonte; esempi numerici, sintassi del laboratorio, precisazioni e domande sono aggiunte Database Academy da revisionare. Non sono nuove affermazioni attribuite al docente.

## Espressioni e albero delle operazioni

Una espressione composta definisce un albero: le foglie sono le relazioni iniziali e ogni nodo interno è un operatore. La radice produce la risposta finale. Si valuta dal basso: prima si conoscono i risultati dei figli, poi si applica l’operatore del padre. L’albero chiarisce dipendenze e risultati intermedi, senza pretendere di mostrare l’algoritmo fisico scelto da un DBMS reale. Le pagine 44–48 collegano questa rappresentazione all’ottimizzazione.

## Sintassi e precedenza implementata

Il parser accetta una singola espressione, senza assegnazioni né programmi di istruzioni. Gli operatori unari prendono un figlio tra parentesi: `π_{sname}(σ_{age>30}(Sailors))`. Fra i binari, ×, ⋈ e ÷ hanno la precedenza maggiore; segue ∩, poi ∪ e −. A pari livello l’associazione è a sinistra. Le condizioni hanno un’altra gerarchia: NOT, AND, OR. Le parentesi esplicite sono sempre consigliate quando mischi famiglie di operatori.

## Esempio con risultati prima e dopo

Esempio sintetico:

| Sailors.sid | sname | age |
|---:|---|---:|
| 1 | Ada | 30 |
| 2 | Nora | 31 |

Dopo σ_age>30:

| sid | sname | age |
|---:|---|---:|
| 2 | Nora | 31 |

Dopo π_sname:

| sname |
|---|
| Nora |

I tre schemi non sono intercambiabili. La foglia contiene tutti i dati, la selezione conserva le colonne e riduce le tuple, la proiezione finale conserva soltanto sname. Il laboratorio calcola ogni passaggio e permette di selezionarlo: non legge tabelle precompilate per quell’esempio. Cambiando la soglia cambia il calcolo.

## Anticipare una selezione

La pagina 47 confronta un filtro dopo il join con due filtri sui singoli operandi. Il predicato bid=100 può essere applicato a Reserves, rating>5 a Sailors, e poi il join collega sid. La condizione di applicabilità è fondamentale: il filtro deve dipendere solo dagli attributi di quel lato. Una condizione come `A.age>B.age` dipende da entrambi gli operandi e non può essere spinta interamente su uno solo senza trasformazioni ulteriori.

L’esempio usa la barca 100, assente dallo script ufficiale caricato: il risultato vuoto è coerente con quei dati. Non sostituire 100 con 101 e attribuire la nuova domanda alla fonte. Per studiare l’effetto su cardinalità non nulle puoi modificare il numero come esperimento personale dichiarato.

## Anticipare una proiezione

Eliminare colonne inutili riduce la larghezza delle tuple intermedie, ma devi conservare attributi del join, dei filtri successivi e dell’output. Proiettare soltanto sname prima di collegare sid rompe la dipendenza. Un piano con meno righe intermedie è spesso intuitivamente più conveniente, ma i costi fisici dipendono anche da algoritmi, indici e distribuzione dei dati: il laboratorio non è un ottimizzatore o un cronometro di DBMS.

## Applicazione ed errori comuni

Confronta due espressioni equivalenti nell’editor e ispeziona prima i figli e poi la radice. Annota numero di tuple e attributi. Se differiscono già alla radice, trova il primo nodo in cui hai eliminato un campo o inserito una condizione sbagliata. Se coincidono sul dataset ufficiale, passa alle fixture degli esercizi: omonimi, casi vuoti e prenotazioni ripetute rendono visibili errori nascosti. La coincidenza finita non prova una regola algebrica generale. Una dimostrazione deve spiegare perché ogni tupla appartiene a un lato se e solo se appartiene all’altro, sotto ipotesi di schema esplicite.

## Percorso visivo

```diagram
Relazione di partenza e schema → Controllo delle condizioni dell’operatore → Trasformazione delle tuple → Relazione risultante e controllo del significato
```

## Riepilogo


Le foglie forniscono i dati iniziali; gli operatori interni dipendono dai figli e la radice produce la risposta finale. Eliminare sid prima di collegarlo o age prima del filtro rende i passi successivi non definiti. Servono anche dipendenze intermedie, non solo output finale. Indici, algoritmi e distribuzioni influiscono sui costi. Un albero logico con meno tuple non è una misura universale del tempo fisico. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Che cosa rappresentano le foglie di un query tree?
2. Che cosa succede se una relazione di ingresso è vuota? Lo schema rimane noto?
3. Quale errore mostrerebbe un esempio con omonimi o valori al confine della soglia?

## Fonti e collegamenti

[Apri le pagine 44–48 della fonte](/sources/algebra-source#page=44). [Sperimenta nel laboratorio](/algebra-lab). Gli esercizi in Practice distinguono le verifiche automatiche dalle riflessioni guidate.

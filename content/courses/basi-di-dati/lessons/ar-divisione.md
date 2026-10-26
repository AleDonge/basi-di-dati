---
{
  "id": "ar-divisione",
  "moduleId": "algebra-relazionale",
  "slug": "ar-divisione",
  "title": "Divisione e domande con “tutti”",
  "mdxPath": "lessons/ar-divisione.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "algebra-source",
      "file": "Argomento03 Algebra Relazionale.pdf",
      "pageStart": 38,
      "pageEnd": 39,
      "section": "Divisione e domande con “tutti”"
    }
  ],
  "concepts": [
    "divisione",
    "quantificazione",
    "insiemi"
  ],
  "description": "Definizioni, esempi ragionati, tabelle e limiti: divisione e domande con “tutti”.",
  "objectives": [
    "Spiegare le definizioni e distinguere schema e istanza.",
    "Applicare la sintassi documentata e controllare le relazioni intermedie.",
    "Riconoscere errori tipici e limiti del subset eseguibile."
  ],
  "order": 16,
  "prerequisites": [
    "ar-join"
  ],
  "relatedLessonIds": [
    "ar-estensioni"
  ],
  "quizPath": "quizzes/ar-divisione.json"
}
---
> **Provenienza.** Parafrasi didattica delle pagine 38–39 di Argomento03. Definizioni e argomenti seguono la fonte; esempi numerici, sintassi del laboratorio, precisazioni e domande sono aggiunte Database Academy da revisionare. Non sono nuove affermazioni attribuite al docente.

## Definizione formale

La divisione esprime una richiesta universale. Sia R una relazione su X e Y e S una relazione sul solo insieme di attributi Y. Allora $R\div S=\{x\in\pi_X(R)\mid\forall y\in S,\;(x,y)\in R\}$. Il risultato contiene soltanto gli attributi X: quelli del divisore vengono eliminati. Nel laboratorio i nomi del divisore devono essere un sottoinsieme non ambiguo dei nomi del dividendo e avere gli stessi domini.

## Intuizione e sintassi

Per “marinai che hanno prenotato tutte le barche”, considera le coppie sid, bid presenti in Reserves. Il divisore contiene tutti i bid di Boats. Un sid supera il controllo se nessun bid richiesto manca tra le sue coppie. Scrivi `π_{sid,bid}(Reserves) ÷ π_{bid}(Boats)`. Poi fai join con Sailors per ricavare sname: la divisione da sola restituisce gli identificativi, non i nomi.

Le date delle prenotazioni non entrano nel dividendo: due date per la stessa coppia non devono valere come due barche diverse. Proiettando sid, bid ottieni automaticamente l’insieme delle coppie distinte. La domanda richiede copertura di valori, non un conteggio di righe. Anche una query con lo stesso numero di prenotazioni delle barche potrebbe sbagliare se una barca fosse ripetuta e un’altra assente.

## Tabelle prima e dopo

Dati sintetici:

| R.sid | R.bid |
|---:|---:|
| 1 | 101 |
| 1 | 102 |
| 2 | 101 |
| 3 | 101 |
| 3 | 102 |

| S.bid |
|---:|
| 101 |
| 102 |

Il risultato R ÷ S è:

| sid |
|---:|
| 1 |
| 3 |

Il candidato 2 manca della coppia con 102. Aggiungere un’ulteriore coppia 2,101 non lo aiuterebbe; con semantica insiemistica sarebbe comunque la stessa coppia.

## Divisione come composizione

La divisione non è primitiva: può essere scritta come $\pi_X(R)-\pi_X((\pi_X(R)\times S)-R)$. Il prodotto costruisce tutte le coppie che un candidato dovrebbe avere. Sottrarre R individua quelle mancanti. Proiettare X segnala i candidati incompleti; sottrarli dall’insieme iniziale lascia soltanto quelli completi. Nell’albero della riscrittura ogni insieme intermedio è calcolato davvero: puoi vedere le coppie mancanti invece di accettare la formula come una scorciatoia opaca.

## Relazioni vuote e dominio dei candidati

Se il divisore è vuoto, la condizione universale è soddisfatta da tutti i candidati in π_X(R). Non significa automaticamente tutti i marinai del database: i candidati provengono dal dividendo. Se anche R è vuota, π_X(R) è vuota e il risultato è vuoto. La scelta di partire invece da tutti i Sailors richiede una formulazione diversa. Le fonti non discutono esplicitamente questo caso: la convenzione della piattaforma è dichiarata nel contratto del quesito.

## Applicazione ed errori comuni

Esegui l’esempio guidato e seleziona dividendo, divisore e risultato. Poi prova la riscrittura con prodotto e differenza. Non invertire gli operandi: il divisore deve avere lo schema appropriato. Non sostituire “tutti” con un join semplice, che basta a richiedere almeno una corrispondenza. Le fixture includono copertura completa, parziale e relazioni vuote; il confronto resta comunque una verifica finita, non una dimostrazione generale di equivalenza delle due espressioni inserite dall’utente.

## Percorso visivo

```diagram
Relazione di partenza e schema → Controllo delle condizioni dell’operatore → Trasformazione delle tuple → Relazione risultante e controllo del significato
```

## Riepilogo


Per ogni y del divisore deve esistere (x,y) nel dividendo. Un solo match esprime esistenza, non universalità. Il lab parte dai candidati π_X(R). Sul divisore vuoto tutti questi candidati passano, senza introdurre persone assenti dal dividendo. Ripetere una barca non crea il valore mancante: la proiezione elimina coppie duplicate e la divisione controlla copertura di ciascun bid richiesto. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Cosa richiede la divisione per un candidato?
2. Che cosa succede se una relazione di ingresso è vuota? Lo schema rimane noto?
3. Quale errore mostrerebbe un esempio con omonimi o valori al confine della soglia?

## Fonti e collegamenti

[Apri le pagine 38–39 della fonte](/sources/algebra-source#page=38). [Sperimenta nel laboratorio](/algebra-lab). Gli esercizi in Practice distinguono le verifiche automatiche dalle riflessioni guidate.

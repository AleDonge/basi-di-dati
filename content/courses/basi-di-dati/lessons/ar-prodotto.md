---
{
  "id": "ar-prodotto",
  "moduleId": "algebra-relazionale",
  "slug": "ar-prodotto",
  "title": "Prodotto cartesiano e combinazioni",
  "mdxPath": "lessons/ar-prodotto.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "algebra-source",
      "file": "Argomento03 Algebra Relazionale.pdf",
      "pageStart": 26,
      "pageEnd": 28,
      "section": "Prodotto cartesiano e combinazioni"
    }
  ],
  "concepts": [
    "prodotto",
    "cardinalita",
    "attributi"
  ],
  "description": "Definizioni, esempi ragionati, tabelle e limiti: prodotto cartesiano e combinazioni.",
  "objectives": [
    "Spiegare le definizioni e distinguere schema e istanza.",
    "Applicare la sintassi documentata e controllare le relazioni intermedie.",
    "Riconoscere errori tipici e limiti del subset eseguibile."
  ],
  "order": 13,
  "prerequisites": [
    "ar-insiemi"
  ],
  "relatedLessonIds": [
    "ar-ridenominazione"
  ],
  "quizPath": "quizzes/ar-prodotto.json"
}
---
> **Provenienza.** Parafrasi didattica delle pagine 26–28 di Argomento03. Definizioni e argomenti seguono la fonte; esempi numerici, sintassi del laboratorio, precisazioni e domande sono aggiunte Database Academy da revisionare. Non sono nuove affermazioni attribuite al docente.

## Definizione formale

Il prodotto cartesiano combina ogni tupla di R con ogni tupla di S. Formalmente $R\times S=\{(r,s)\mid r\in R\land s\in S\}$. Se R ha n attributi e S ne ha m, il risultato ne ha n+m; le colonne di R precedono quelle di S. La cardinalità è $|R\times S|=|R|\cdot|S|$. Questa formula riguarda relazioni insiemistiche e tuple combinate distinguibili, con uno schema ben identificato.

## Intuizione e sintassi

Immagina di accostare ogni scheda di un marinaio a ogni scheda di una barca, senza ancora chiederti se esista una prenotazione. Il prodotto descrive possibilità, non fatti documentati. Nel laboratorio `Sailors × Boats` genera quaranta combinazioni: dieci marinai per quattro barche. Sono accettati anche `Sailors PRODUCT Boats` e parentesi attorno agli operandi. Il prodotto precede unione e differenza; a pari livello con join e divisione vale l’associazione a sinistra.

## Tabelle prima e dopo

Esempio aggiuntivo minimale:

| Persone.id | nome |
|---:|---|
| 1 | Ada |
| 2 | Nora |

| Barche.bid |
|---:|
| 101 |
| 102 |

Dopo il prodotto:

| id | nome | bid |
|---:|---|---:|
| 1 | Ada | 101 |
| 1 | Ada | 102 |
| 2 | Nora | 101 |
| 2 | Nora | 102 |

Non è una relazione di prenotazione: nessuna delle quattro righe afferma ancora che la persona abbia prenotato la barca. Per ricostruire quel fatto occorrono Reserves e i confronti sulle chiavi pertinenti.

## Nomi degli attributi

Sailors e Reserves hanno entrambi sid. Un prodotto deve mantenere riconoscibili le due colonne: il laboratorio conserva i qualificatori `Sailors.sid` e `Reserves.sid`. Il riferimento non qualificato sid diventa ambiguo e viene rifiutato. La fonte introduce la rinomina proprio per questo problema; la piattaforma aggiunge i qualificatori come convenzione esplicita della sintassi eseguibile. Con due copie della stessa relazione usa alias distinti, per esempio `ρ_A(Sailors) × ρ_B(Sailors)`. Senza rinomina le due copie avrebbero nomi indistinguibili.

## Dal prodotto al join

Applicare `σ_{Sailors.sid=Reserves.sid}` al prodotto Sailors × Reserves elimina gli accostamenti che collegano persone differenti. Questo è il principio del theta join. Il prodotto intermedio contiene cento coppie sul dataset ufficiale, anche se la selezione finale ne conserva molte meno. Nell’albero puoi confrontare il nodo × e il nodo σ: la differenza rende concreto il ruolo del predicato.

## Applicazione ed errori comuni

Prima di scrivere un prodotto, chiediti quali relazioni stai realmente collegando e quali condizioni distingueranno i fatti dalle combinazioni. Un errore frequente è proiettare i nomi direttamente da un prodotto non filtrato: basta che esista almeno una tupla nell’altra relazione e compariranno persone senza alcun legame. Un altro è usare un prodotto con una relazione vuota aspettandosi che il primo operando rimanga: non esistono coppie e il risultato è vuoto, ma lo schema completo rimane.

Per self-join sul concetto “almeno due barche” confronta bid diversi e sid uguali; confrontare soltanto date diverse permette due prenotazioni della stessa barca. Per evitare blocchi della UI il laboratorio impone limiti anche ai prodotti intermedi: un errore di risorse non viene scambiato per un insieme vuoto o una risposta sbagliata.

## Percorso visivo

```diagram
Relazione di partenza e schema → Controllo delle condizioni dell’operatore → Trasformazione delle tuple → Relazione risultante e controllo del significato
```

## Riepilogo


Ogni tupla del primo operando si combina con ciascuna del secondo: 3×2=6, non 3+2. Non esiste alcuna coppia con una tupla del lato vuoto. I nomi e i domini dello schema combinato restano comunque definiti. Il prodotto combina possibilità; solo Reserves e i predicati sulle chiavi documentano una prenotazione effettiva. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Quante tuple produce un prodotto di relazioni con 3 e 2 tuple?
2. Che cosa succede se una relazione di ingresso è vuota? Lo schema rimane noto?
3. Quale errore mostrerebbe un esempio con omonimi o valori al confine della soglia?

## Fonti e collegamenti

[Apri le pagine 26–28 della fonte](/sources/algebra-source#page=26). [Sperimenta nel laboratorio](/algebra-lab). Gli esercizi in Practice distinguono le verifiche automatiche dalle riflessioni guidate.

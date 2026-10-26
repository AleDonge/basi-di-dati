---
{
  "id": "ar-ridenominazione",
  "moduleId": "algebra-relazionale",
  "slug": "ar-ridenominazione",
  "title": "Ridenominazione e self-join",
  "mdxPath": "lessons/ar-ridenominazione.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "algebra-source",
      "file": "Argomento03 Algebra Relazionale.pdf",
      "pageStart": 28,
      "pageEnd": 30,
      "section": "Ridenominazione e self-join"
    }
  ],
  "concepts": [
    "rinomina",
    "self-join",
    "schema"
  ],
  "description": "Definizioni, esempi ragionati, tabelle e limiti: ridenominazione e self-join.",
  "objectives": [
    "Spiegare le definizioni e distinguere schema e istanza.",
    "Applicare la sintassi documentata e controllare le relazioni intermedie.",
    "Riconoscere errori tipici e limiti del subset eseguibile."
  ],
  "order": 14,
  "prerequisites": [
    "ar-prodotto"
  ],
  "relatedLessonIds": [
    "ar-join"
  ],
  "quizPath": "quizzes/ar-ridenominazione.json"
}
---
> **Provenienza.** Parafrasi didattica delle pagine 28–30 di Argomento03. Definizioni e argomenti seguono la fonte; esempi numerici, sintassi del laboratorio, precisazioni e domande sono aggiunte Database Academy da revisionare. Non sono nuove affermazioni attribuite al docente.

## Definizione formale

La ridenominazione assegna un nome alla relazione o cambia i nomi di alcuni attributi, conservandone domini e valori. Se f è una mappa iniettiva sui nomi che vengono sostituiti, $\rho_f(R)$ contiene le stesse tuple di R sotto lo schema rinominato. “Iniettiva” significa che il risultato deve rimanere interpretabile: non si possono creare due attributi indistinguibili chiamati entrambi id. La cardinalità non cambia.

## Intuizione e notazione della fonte

La pagina 29 propone `ρ(R(F1,…,Fn), E)` e consente associazioni vecchionome → nuovonome oppure posizione → nuovonome. La pagina 30 mostra una rinomina per posizione dopo un prodotto con colonne omonime. Il problema risolto non è il valore ripetuto di un codice: è poter indicare senza dubbio a quale colonna ci riferiamo. Un alias è quindi un’etichetta dello schema, non un nuovo fatto del database.

## Sintassi eseguibile

La piattaforma usa `ρ_{A}(Sailors)` per assegnare un qualificatore A. Usa `ρ_{sid->id}(Sailors)` per rinominare un attributo e `ρ_{A; sid->id,sname->nome}(Sailors)` per fare entrambe le cose. È accettata anche la freccia inversa `id<-sid`, coerente con la scansione. Le sostituzioni si applicano simultaneamente ai nomi di ingresso: una sequenza testuale non va interpretata come più rinomine successive. Il parser non supporta la variante per posizione: va tradotta usando il nome qualificato della colonna.

## Tabelle prima e dopo

Esempio sintetico:

| sid | sname |
|---:|---|
| 1 | Ada |
| 2 | Nora |

Dopo `ρ_{A; sid->id,sname->nome}`:

| A.id | A.nome |
|---:|---|
| 1 | Ada |
| 2 | Nora |

I dati e i tipi sono identici. Il campo sid non è più il nome valido di quella colonna; non c’è una copia nascosta di sid. Se vuoi preservare anche un vecchio nome, serve un altro schema o un’altra espressione: il laboratorio non duplica automaticamente attributi.

## Self-join e confronto di persone

Per confrontare due marinai, costruisci `ρ_A(Sailors) × ρ_B(Sailors)`. A e B hanno gli stessi dati, ma i campi sono distinguibili: `A.age>B.age` ha un significato preciso. La selezione `A.sid!=B.sid` esclude il confronto di una persona con se stessa; non esclude due persone con lo stesso nome, perché sname non è chiave. Se proietti soltanto A.sname alla fine, i nomi ripetuti vengono eliminati secondo la semantica insiemistica.

Per due barche prenotate dalla stessa persona è sufficiente rinominare una copia di Reserves e confrontare `Reserves.sid=A.sid AND Reserves.bid!=A.bid`. Solo dopo proietti il sid della prima copia e lo colleghi a Sailors. Le date diverse non identificano barche diverse. Questo passaggio è centrale nell’ultimo quesito dell’Autoverifica.

## Errori comuni e applicazione

Non usare un alias solo nella condizione senza averlo introdotto: A.sid deve provenire da una rinomina. Non rinominare sid in bid prima di un join naturale senza pensare al significato: il join userà il nuovo nome e potrebbe collegare codici di entità differenti. Non usare una rinomina per “risolvere” domini incompatibili: cambiare nome a una stringa non la rende un numero. Esegui due versioni con alias diversi e confronta schemi e tuple: la scelta del qualificatore non deve cambiare il risultato osservabile, purché tutti i riferimenti vengano aggiornati coerentemente.

## Percorso visivo

```diagram
Relazione di partenza e schema → Controllo delle condizioni dell’operatore → Trasformazione delle tuple → Relazione risultante e controllo del significato
```

## Riepilogo


La rinomina cambia lo schema nominale, conservando valori e cardinalità; non applica un filtro alle tuple. A e B identificano due copie indipendenti della sorgente. Senza qualificatori non si sa quale age appartenga a quale copia. Un nome nuovo non converte il valore: una stringa resta stringa e non diventa compatibile con un dominio numerico. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. La rinomina modifica le tuple della relazione?
2. Che cosa succede se una relazione di ingresso è vuota? Lo schema rimane noto?
3. Quale errore mostrerebbe un esempio con omonimi o valori al confine della soglia?

## Fonti e collegamenti

[Apri le pagine 28–30 della fonte](/sources/algebra-source#page=28). [Sperimenta nel laboratorio](/algebra-lab). Gli esercizi in Practice distinguono le verifiche automatiche dalle riflessioni guidate.

---
{
  "id": "ar-selezione",
  "moduleId": "algebra-relazionale",
  "slug": "ar-selezione",
  "title": "Algebra, chiusura e selezione",
  "mdxPath": "lessons/ar-selezione.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "algebra-source",
      "file": "Argomento03 Algebra Relazionale.pdf",
      "pageStart": 2,
      "pageEnd": 12,
      "section": "Algebra, chiusura e selezione"
    }
  ],
  "concepts": [
    "algebra",
    "selezione",
    "predicati"
  ],
  "description": "Definizioni, esempi ragionati, tabelle e limiti: algebra, chiusura e selezione.",
  "objectives": [
    "Spiegare le definizioni e distinguere schema e istanza.",
    "Applicare la sintassi documentata e controllare le relazioni intermedie.",
    "Riconoscere errori tipici e limiti del subset eseguibile."
  ],
  "order": 10,
  "prerequisites": [
    "relazioni-domini"
  ],
  "relatedLessonIds": [
    "ar-proiezione"
  ],
  "quizPath": "quizzes/ar-selezione.json"
}
---
> **Provenienza.** Parafrasi didattica delle pagine 2–12 di Argomento03. Definizioni e argomenti seguono la fonte; esempi numerici, sintassi del laboratorio, precisazioni e domande sono aggiunte Database Academy da revisionare. Non sono nuove affermazioni attribuite al docente.

## Definizione e significato

L’algebra relazionale descrive una interrogazione come composizione di trasformazioni. Una relazione entra in un operatore e una relazione ne esce: questa **chiusura** consente di annidare le operazioni. Nelle fonti è un linguaggio procedurale: l’espressione indica i passaggi logici, senza essere necessariamente il programma fisico scelto da un DBMS. Studiare l’algebra aiuta a distinguere il risultato desiderato dal costo per ottenerlo.

La selezione conserva le tuple che soddisfano una condizione, senza modificare lo schema. Formalmente $\sigma_F(R)=\{t\in R\mid F(t)\}$. Se R ha gli attributi sid, sname, rating, age, anche il risultato li ha tutti. L’intuizione è un filtro sulle righe: non una scelta delle colonne. La condizione viene valutata separatamente per ogni tupla.

## Sintassi e condizioni

Nel laboratorio scrivi `σ_{age>30}(Sailors)` oppure `select[age>30](Sailors)`. La forma compatta `σ_age>30(Sailors)` è accettata quando la condizione non contiene parentesi. Le graffe delimitano anche formule come `σ_{(age>30 OR rating=10) AND NOT rating<5}(Sailors)`. NOT lega più di AND, AND più di OR; usa parentesi per evitare dubbi. I confronti supportati sono =, !=, <, >, <=, >= e i corrispondenti simboli matematici.

Un attributo può essere confrontato con una costante dello stesso dominio oppure con un altro attributo compatibile. Il laboratorio non trasforma implicitamente il testo `'30'` nel numero 30. Le stringhe richiedono apici singoli: `sname='Horatio'`. Le date sono stringhe ISO con dominio dichiarato date. Il modello classico usato qui non include NULL: non bisogna importare di nascosto la logica a tre valori di SQL.

## Tabelle prima e dopo

Esempio aggiuntivo della piattaforma, non istanza ufficiale:

| sid | sname | age |
|---:|---|---:|
| 1 | Ada | 30 |
| 2 | Nora | 31 |
| 3 | Luca | 45 |

Applicando `σ_{age>30}`:

| sid | sname | age |
|---:|---|---:|
| 2 | Nora | 31 |
| 3 | Luca | 45 |

Ada è esclusa: maggiore è diverso da maggiore o uguale. Gli attributi restano tre e la cardinalità non può aumentare. Se nessuna tupla passa, ottieni una relazione vuota con schema ancora noto, non un errore o un valore NULL.

## Composizione e proprietà

Due selezioni consecutive possono essere unite con AND: $\sigma_A(\sigma_B(R))=\sigma_{A\land B}(R)$. Si possono anche scambiare, purché i predicati siano definiti sullo schema. Non estendere questa regola alla proiezione: eliminare prima age rende impossibile valutare age>30. La validità riguarda i predicati e gli attributi disponibili, non soltanto l’aspetto dei simboli.

## Applicazione ed errori comuni

Esegui nel lab l’esempio “Da Sailors ai nomi”, poi seleziona la foglia e il nodo σ. Confronta conteggi e intestazioni; cambia 30 in 35 e osserva quali righe cambiano. Non confondere SELECT dell’algebra con SELECT di SQL: il secondo combina molte responsabilità. Altri errori frequenti sono usare AND quando si intende OR e scrivere un nome inesistente. Il parser distingue la sintassi dall’errore semantico: una formula può essere ben formata ma riferirsi a un attributo assente.

## Percorso visivo

```diagram
Relazione di partenza e schema → Controllo delle condizioni dell’operatore → Trasformazione delle tuple → Relazione risultante e controllo del significato
```

## Riepilogo


La selezione conserva lo schema e decide quali tuple soddisfano il predicato; scegliere colonne è invece proiezione. Il confronto è stretto: 31>30 è vero, 30>30 è falso. Con >=30 passerebbe anche la tupla sul confine. Ogni tupla deve superare entrambi i filtri: AND esprime questa congiunzione. Proiettare tutte le colonne non applica nessuna condizione. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Quale parte di una relazione modifica la selezione?
2. Che cosa succede se una relazione di ingresso è vuota? Lo schema rimane noto?
3. Quale errore mostrerebbe un esempio con omonimi o valori al confine della soglia?

## Fonti e collegamenti

[Apri le pagine 2–12 della fonte](/sources/algebra-source#page=2). [Sperimenta nel laboratorio](/algebra-lab). Gli esercizi in Practice distinguono le verifiche automatiche dalle riflessioni guidate.

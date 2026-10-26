---
{
  "id": "ar-join",
  "moduleId": "algebra-relazionale",
  "slug": "ar-join",
  "title": "Theta join, equijoin e join naturale",
  "mdxPath": "lessons/ar-join.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "algebra-source",
      "file": "Argomento03 Algebra Relazionale.pdf",
      "pageStart": 31,
      "pageEnd": 37,
      "section": "Theta join, equijoin e join naturale"
    }
  ],
  "concepts": [
    "join",
    "equijoin",
    "join-naturale"
  ],
  "description": "Definizioni, esempi ragionati, tabelle e limiti: theta join, equijoin e join naturale.",
  "objectives": [
    "Spiegare le definizioni e distinguere schema e istanza.",
    "Applicare la sintassi documentata e controllare le relazioni intermedie.",
    "Riconoscere errori tipici e limiti del subset eseguibile."
  ],
  "order": 15,
  "prerequisites": [
    "ar-ridenominazione"
  ],
  "relatedLessonIds": [
    "ar-divisione"
  ],
  "quizPath": "quizzes/ar-join.json"
}
---
> **Provenienza.** Parafrasi didattica delle pagine 31–37 di Argomento03. Definizioni e argomenti seguono la fonte; esempi numerici, sintassi del laboratorio, precisazioni e domande sono aggiunte Database Academy da revisionare. Non sono nuove affermazioni attribuite al docente.

## Definizione del theta join

Il theta join è una selezione sul prodotto: $R\bowtie_F S=\sigma_F(R\times S)$. Ogni coppia di tuple viene mantenuta se soddisfa F. La condizione può confrontare uguaglianze, disuguaglianze e combinazioni logiche. Un **equijoin** è un theta join il cui predicato usa uguaglianze. Nel laboratorio il theta join conserva tutte le colonne, comprese le due copie dei campi confrontati.

La pagina 34 adotta per l’equijoin una convenzione che mostra una sola copia della colonna uguagliata. Per evitare ambiguità, questa piattaforma distingue esplicitamente theta join e naturale: il primo conserva entrambe le colonne; nel secondo i campi comuni compaiono una volta. Se vuoi riprodurre l’output della pagina 34, aggiungi una proiezione esplicita. Questa scelta è documentata e non viene nascosta sotto l’etichetta “stessa sintassi del docente”.

## Join naturale

Il join naturale confronta **tutti** i nomi di attributi comuni e conserva una sola copia di ciascuno. Se R ha sid, sname e S ha sid, bid, ogni risultato richiede che i due sid siano uguali; lo schema è sid, sname, bid. Se non ci sono nomi comuni, il join naturale coincide con il prodotto. Se ci sono nomi comuni con domini incompatibili, il laboratorio segnala un errore anche quando le relazioni sono vuote.

## Sintassi

Usa `Sailors ⋈ Reserves` per il join naturale. Per il theta join scrivi `Sailors ⋈_{Sailors.sid=Reserves.sid} Reserves`. Dopo un theta join sid è ambiguo senza qualificatore. Un alias creato con ρ rende possibili self-join; cambiare solo il qualificatore non cambia i nomi base e quindi non modifica quali campi partecipano a un join naturale. Per cambiare i campi comuni occorre rinominare gli attributi stessi.

## Tabelle prima e dopo

Esempio aggiuntivo:

| sid | sname |
|---:|---|
| 1 | Ada |
| 2 | Nora |
| 3 | Mai |

| sid | bid |
|---:|---:|
| 1 | 101 |
| 1 | 102 |
| 2 | 103 |

Dopo il join naturale:

| sid | sname | bid |
|---:|---|---:|
| 1 | Ada | 101 |
| 1 | Ada | 102 |
| 2 | Nora | 103 |

Mai non compare perché non ha corrispondenze. Ada compare due volte con bid differenti: non sono tuple duplicate. Proiettando soltanto sname, Ada apparirebbe una volta.

## Cardinalità e proprietà

Il risultato contiene al massimo tante tuple quante il prodotto. Se il collegamento dal secondo operando al primo trova al più una tupla, il numero non supera quello del secondo. Con una chiave esterna valida e senza NULL, ogni riferimento trova la sua tupla e la cardinalità può coincidere. Le proprietà di commutatività e associatività richiedono di confrontare schemi e predicati coerenti: non autorizzano a scambiare casualmente nomi di colonna o condizioni.

## Applicazione ed errori comuni

La scansione usa più relazioni con un attributo Nome. Un join naturale tra Dipartimento e Progetto confronterebbe anche i nomi, non soltanto i codici che avevi in mente. Per questo i percorsi della piattaforma su impiegati usano theta join espliciti. Controlla tutti gli attributi comuni prima di scegliere il naturale. Un join errato può restituire zero righe senza errori sintattici: occorrono fixture con corrispondenze e senza corrispondenze per distinguerlo. Il laboratorio mostra le relazioni di entrambi i figli dell’albero per aiutarti a trovare dove le tuple spariscono.

## Percorso visivo

```diagram
Relazione di partenza e schema → Controllo delle condizioni dell’operatore → Trasformazione delle tuple → Relazione risultante e controllo del significato
```

## Riepilogo


Il naturale usa tutti i nomi comuni, non solo una chiave immaginata. Un Nome condiviso può aggiungere un confronto indesiderato. La condizione sui nomi comuni è vacuamente soddisfatta: tutte le coppie passano, quindi si ottiene il prodotto. Il theta join eseguibile mantiene entrambe le colonne. Questa convenzione differisce dalla figura equijoin p. 34; una proiezione può riprodurne lo schema ridotto. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Su quali attributi confronta i valori un join naturale?
2. Che cosa succede se una relazione di ingresso è vuota? Lo schema rimane noto?
3. Quale errore mostrerebbe un esempio con omonimi o valori al confine della soglia?

## Fonti e collegamenti

[Apri le pagine 31–37 della fonte](/sources/algebra-source#page=31). [Sperimenta nel laboratorio](/algebra-lab). Gli esercizi in Practice distinguono le verifiche automatiche dalle riflessioni guidate.

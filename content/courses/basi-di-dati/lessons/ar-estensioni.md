---
{
  "id": "ar-estensioni",
  "moduleId": "algebra-relazionale",
  "slug": "ar-estensioni",
  "title": "Outer join e confini dell’algebra eseguibile",
  "mdxPath": "lessons/ar-estensioni.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "algebra-source",
      "file": "Argomento03 Algebra Relazionale.pdf",
      "pageStart": 40,
      "pageEnd": 43,
      "section": "Outer join e confini dell’algebra eseguibile"
    }
  ],
  "concepts": [
    "outer-join",
    "null",
    "estensioni"
  ],
  "description": "Definizioni, esempi ragionati, tabelle e limiti: outer join e confini dell’algebra eseguibile.",
  "objectives": [
    "Spiegare le definizioni e distinguere schema e istanza.",
    "Applicare la sintassi documentata e controllare le relazioni intermedie.",
    "Riconoscere errori tipici e limiti del subset eseguibile."
  ],
  "order": 17,
  "prerequisites": [
    "ar-divisione"
  ],
  "relatedLessonIds": [
    "ar-alberi"
  ],
  "quizPath": "quizzes/ar-estensioni.json"
}
---
> **Provenienza.** Parafrasi didattica delle pagine 40–43 di Argomento03. Definizioni e argomenti seguono la fonte; esempi numerici, sintassi del laboratorio, precisazioni e domande sono aggiunte Database Academy da revisionare. Non sono nuove affermazioni attribuite al docente.

## Perché serve un’estensione

Un join interno elimina le tuple senza corrispondenza. Le pagine 40–43 introducono gli outer join per conservare anche alcuni di questi fatti. La differenza non è estetica: se cerchi un elenco di tutti i ricercatori, il join interno con Progetti può nascondere quelli assegnati a un codice che non trova un progetto corrispondente. Per evidenziare l’informazione mancante, un outer join riempie con NULL i campi del lato assente.

## Definizione e varianti

Intuitivamente il left outer join aggiunge al join interno ogni tupla sinistra senza corrispondenza, completata con valori mancanti nelle colonne destre. Il right outer join applica la regola simmetrica; il full outer join conserva le tuple non abbinate di entrambi i lati. Indicando con J il join interno e con L le tuple sinistre senza match, il left outer join può essere descritto come l’unione di J con il completamento a NULL di L. Questa è una descrizione dell’estensione, non una formula che il parser classico possa eseguire: NULL non appartiene ai domini classici usati nel laboratorio.

## Sintassi e confini dichiarati

Le fonti impiegano varianti grafiche del simbolo di join. In questa piattaforma **gli outer join non sono implementati nell’evaluator**. Inserire ⟕ o parole come LEFT JOIN nell’editor produce un errore esplicito: non viene simulato silenziosamente un join interno. La lezione li tratta perché compaiono nelle dispense; per studiarli usa le tabelle e ragiona sulle corrispondenze. Anche aggregazioni e outer union, soltanto elencati a pagina 7 senza sviluppo completo, non vengono presentati come operatori eseguibili.

## Tabelle prima e dopo

Esempio didattico aggiuntivo, ispirato al problema delle corrispondenze ma con righe proprie:

| Ricercatori.Nome | CodProgetto |
|---|---|
| Ada | A |
| Nora | B |

| Progetti.CodProgetto | Responsabile |
|---|---|
| A | Rossi |
| C | Verdi |

Left outer join:

| Nome | CodProgetto | Responsabile |
|---|---|---|
| Ada | A | Rossi |
| Nora | B | NULL |

Right outer join:

| Nome | CodProgetto | Responsabile |
|---|---|---|
| Ada | A | Rossi |
| NULL | C | Verdi |

Il full outer join conterrebbe tutte e tre le righe distinte appena mostrate, contando Ada una volta. Nora non viene collegata a Verdi: i due fatti mancanti appartengono a chiavi diverse. Un diagramma di insiemi è una guida intuitiva, non rappresenta da solo tutte le combinazioni e le molteplicità del join.

## NULL e differenza rispetto al vuoto

NULL segnala un valore mancante in una tupla che esiste. Una relazione vuota, invece, non contiene tuple. Un outer join con un lato vuoto può conservare le tuple dell’altro lato se la variante lo richiede; un prodotto o join interno con un lato vuoto non produce coppie. Non trasferire automaticamente a NULL i confronti dei normali valori del laboratorio: una futura estensione dovrebbe definire logica, uguaglianza e deduplicazione prima di poter essere corretta.

## Autoverifica guidata ed errori comuni

Disegna prima il join interno e marca le righe usate. Aggiungi poi soltanto quelle non abbinate del lato richiesto. Controlla se il filtro finale elimina involontariamente le righe con campi mancanti: è un rischio tipico quando si passa a SQL. Non considerare l’assenza di un match una violazione automatica delle fonti: la pagina 43 mostra proprio relazioni non completamente abbinate. L’implementazione attuale si ferma consapevolmente prima di questa estensione, così un risultato incompleto non viene etichettato come corretto.

## Percorso visivo

```diagram
Relazione di partenza e schema → Controllo delle condizioni dell’operatore → Trasformazione delle tuple → Relazione risultante e controllo del significato
```

## Riepilogo


Il left preserva le tuple sinistre senza match, completando le colonne destre con NULL. Il right preserva invece il lato destro. Il parser/evaluator classico non comprende outer join o NULL. Convertirli in inner join perderebbe proprio le tuple che il requisito vuole mantenere. Una tupla con un campo mancante contribuisce alla cardinalità. Una relazione vuota ha cardinalità zero e può mantenere lo stesso schema. La revisione del significato resta distinta dalla sola esecuzione o validazione strutturale.

## Domande di autoverifica

1. Cosa preserva un left outer join?
2. Che cosa succede se una relazione di ingresso è vuota? Lo schema rimane noto?
3. Quale errore mostrerebbe un esempio con omonimi o valori al confine della soglia?

## Fonti e collegamenti

[Apri le pagine 40–43 della fonte](/sources/algebra-source#page=40). [Sperimenta nel laboratorio](/algebra-lab). Gli esercizi in Practice distinguono le verifiche automatiche dalle riflessioni guidate.

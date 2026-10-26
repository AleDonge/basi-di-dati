---
{
  "id": "schema-istanza",
  "moduleId": "modello-relazionale",
  "slug": "schema-istanza",
  "title": "Schema, istanza, grado e cardinalità",
  "mdxPath": "lessons/schema-istanza.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "relational-source",
      "file": "Argomento02 Modello Relazionale.pdf",
      "pageStart": 8,
      "pageEnd": 13,
      "section": "Schema, istanza, grado e cardinalità"
    }
  ],
  "concepts": [
    "schema",
    "istanza",
    "grado",
    "cardinalita"
  ],
  "description": "Leggi una tabella distinguendo la descrizione dai dati attualmente presenti.",
  "objectives": [
    "Distinguere schema e stato.",
    "Calcolare grado e cardinalità.",
    "Spiegare ordine delle tuple e assenza di duplicati nel modello."
  ],
  "order": 6,
  "prerequisites": [
    "relazioni-domini"
  ],
  "relatedLessonIds": [
    "chiavi-vincoli"
  ],
  "quizPath": "quizzes/schema-istanza.json"
}
---
## Una tabella è una rappresentazione

**Dalle slide — pagine PDF 8–10.** Informalmente rappresentiamo una relazione come una tabella: le colonne sono attributi, le righe tuple. Ma bisogna separare la descrizione della struttura dal contenuto attuale. Lo **schema** è il livello intensionale; l’**istanza** o stato è il livello estensionale.

Per capire la differenza, immagina una scheda vuota che stabilisce quali campi compilare. La scheda descrive la forma dei dati; le schede compilate descrivono le informazioni presenti. Questa è un’analogia aggiuntiva: una relazione non è letteralmente una raccolta di moduli cartacei.

## Che cosa dice lo schema

**Dalle slide — pagine PDF 9–10.** Lo schema specifica nome della relazione, nomi degli attributi e relativi domini. L’esempio riportato è:

```text
Students(sid:string, name:string, login:string, age:integer, gpa:real)
```

La scrittura è una notazione di schema, non un’istruzione SQL eseguibile. Dice che ogni tupla deve associare valori ai cinque attributi secondo i domini indicati. L’attributo age ha dominio intero nell’esempio; gpa reale. Non significa che qualsiasi vincolo di significato sia già espresso dal solo tipo.

**Spiegazione aggiuntiva.** Cambiare il numero di studenti modifica il contenuto. Aggiungere un nuovo attributo modifica la descrizione della struttura. Il primo intervento cambia l’istanza; il secondo cambia lo schema. Uno schema vuoto di tuple resta comunque uno schema ben definito.

## Che cosa contiene l’istanza

**Dalle slide — pagine PDF 10–11, tabella controllata visivamente.** L’esempio visuale contiene tre studenti con cinque attributi. Due hanno lo stesso nome, Smith, ma valori diversi negli altri campi. L’uguaglianza di un singolo valore non rende identiche le tuple.

**Tabella aggiuntiva ridotta, con dati inventati:**

| sid | name | login | age | gpa |
|---|---|---|---|---|
| s1 | Anna | anna1 | 20 | 3.2 |
| s2 | Anna | anna2 | 21 | 3.7 |
| s3 | Luca | luca3 | 20 | 3.1 |

La presenza di due Anna è compatibile con il modello: le tuple non sono uguali. Ripetere esattamente tutti e cinque i valori non aggiungerebbe un nuovo elemento all’insieme relazionale. L’ordine visivo delle tre righe non cambia l’istanza.

## Grado e cardinalità

**Dalle slide — pagine PDF 10–11.** Il **grado** o arietà è il numero degli attributi. La **cardinalità** è il numero delle tuple nell’istanza. Nella tabella aggiuntiva il grado è cinque e la cardinalità tre.

$$
\operatorname{grado}(R)=5,\qquad |r(R)|=3.
$$

**Nota di revisione.** La pagina 11 usa una formulazione imprecisa sul “numero di istanze”: il senso coerente con la tabella e con la pagina 7 è il numero di tuple presenti nello stato. Non stiamo contando quanti stati possibili potrebbe avere lo schema.

**Applicazione pratica aggiuntiva.** Se inserisci un quarto studente, il grado resta cinque e la cardinalità diventa quattro. Se cancelli tutte le tuple, la cardinalità diventa zero; non scompaiono automaticamente nome e domini degli attributi. Se aggiungi una colonna, invece, hai cambiato lo schema e quindi il grado.

## Nomi degli attributi e terminologia

**Dalle slide — pagine PDF 9 e 13.** Gli attributi sono identificati da nomi; l’ordine nello schema non ha un significato specifico. Quando leggi una tabella, associa quindi il valore all’intestazione corretta. Una tupla posizionale senza intestazioni richiede invece una convenzione sull’ordine.

| Espressione informale | Espressione formale |
|---|---|
| Tabella | Relazione |
| Intestazione di colonna | Attributo |
| Valori consentiti nella colonna | Dominio |
| Riga | Tupla |
| Definizione della tabella | Schema |
| Tabella popolata | Stato della relazione |

**Schema aggiuntivo:**

```diagram
Schema: nome e attributi con domini → Istanza: insieme di tuple → Nuovo aggiornamento: nuova istanza
```

## Errori comuni e domande aperte

- Chiamare grado il numero delle righe.
- Dedurre che nome sia una chiave soltanto perché oggi non ci sono omonimi.
- Confondere un ordine visuale con una proprietà dell’insieme.
- Pensare che schema e istanza siano due nomi della stessa cosa.

**Attività aggiuntiva.** Descrivi una tabella vuota di libri con codice e titolo. Qual è il grado? Qual è la cardinalità? Che cosa cambia inserendo due libri con lo stesso titolo ma codice diverso? Per stabilire se i codici siano obbligatoriamente diversi servirà un vincolo: lo studierai nella lezione successiva.

## Riepilogo

Lo schema descrive la forma e i domini; lo stato contiene le tuple; grado e cardinalità misurano aspetti diversi. Il modello non ammette tuple duplicate e non assegna significato all’ordine delle righe. Riferimenti: [pagine 8–13](/sources/relational-source#page=8), con la distinzione delle chiavi introdotta a pagina 12 e approfondita nella prossima unità.

---
{
  "id": "relazioni-domini",
  "moduleId": "modello-relazionale",
  "slug": "relazioni-domini",
  "title": "Domini, tuple e relazioni",
  "mdxPath": "lessons/relazioni-domini.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "relational-source",
      "file": "Argomento02 Modello Relazionale.pdf",
      "pageStart": 1,
      "pageEnd": 7,
      "section": "Domini, tuple e relazioni"
    }
  ],
  "concepts": [
    "domini",
    "prodotto-cartesiano",
    "relazione"
  ],
  "description": "Costruisci una relazione a partire dai valori ammissibili e dal prodotto cartesiano.",
  "objectives": [
    "Identificare strutture, operatori e vincoli di un modello.",
    "Costruire un prodotto cartesiano finito.",
    "Distinguere tutte le combinazioni da uno stato della relazione."
  ],
  "order": 5,
  "prerequisites": [
    "utenti-scelte"
  ],
  "relatedLessonIds": [
    "schema-istanza"
  ],
  "quizPath": "quizzes/relazioni-domini.json"
}
---
## Un modello descrive, opera e vincola

**Dalle slide — pagine PDF 2–4.** Un modello dei dati è un insieme di concetti formali per descrivere struttura, collegamenti e vincoli delle informazioni, astraendo dai dettagli della memorizzazione. Non è soltanto una forma grafica: comprende **strutture**, **operatori** e **vincoli**.

Le strutture indicano come rappresentare i dati; gli operatori permettono di consultarli o trasformarli; i vincoli selezionano gli stati ammissibili. Le slide introducono il modello relazionale, proposto da Codd nel 1970 e basato sulla nozione matematica di relazione. Qui costruiamo i concetti di base; il laboratorio di algebra permette di sperimentare queste strutture con il subset dichiarato.

> **Esempio aggiuntivo.** Per descrivere un catalogo puoi usare una struttura con codice e titolo, prevedere un’operazione che cerca i titoli e imporre che i codici siano univoci. Una semplice griglia, senza regole su contenuto e identificazione, non esaurisce il modello.

## Domini e prodotto cartesiano

**Dalle slide — pagina PDF 5.** Un **dominio** è un insieme di valori omogenei, per esempio interi, stringhe o booleani. Dati $n$ domini, il prodotto cartesiano contiene tutte le tuple ordinate che scelgono un valore dal primo dominio, uno dal secondo e così via:

$$
D_1 \times \cdots \times D_n = \{(v_1,\ldots,v_n) \mid v_i \in D_i,\; 1 \le i \le n\}.
$$

L’indice $i$ identifica la posizione del valore. **Nota di revisione:** la riga estratta dalla pagina 5 ha un intervallo di indici malformato; la formula qui esplicita l’intenzione della definizione, non ne riproduce il refuso.

**Esempio dalle slide — pagina PDF 7, rielaborato.** Se $D_1=\{0,1\}$ e $D_2=\{a,b,c\}$, il prodotto contiene sei coppie:

| Primo valore | Secondo valore |
|---|---|
| 0 | a |
| 0 | b |
| 0 | c |
| 1 | a |
| 1 | b |
| 1 | c |

Non stiamo ancora dicendo che tutte queste coppie siano presenti nella base di dati. Il prodotto descrive lo spazio delle possibilità compatibili con i domini. Quando i domini sono finiti, il numero delle combinazioni è il prodotto delle loro cardinalità: in questo caso $2\cdot3=6$. Questo conteggio è un passaggio esplicativo aggiuntivo.

## Una relazione seleziona possibilità

**Dalle slide — pagine PDF 5–7.** Una relazione sui domini considerati è un sottoinsieme del loro prodotto cartesiano:

$$
R \subseteq D_1 \times \cdots \times D_n.
$$

La pagina 6 parla dello **stato** $s(R)$, cioè dell’insieme di tuple effettivamente presenti in un dato momento. Per distinguere il nome dello schema dal contenuto useremo spesso $r(R)$ oppure $s(R)$ per quello stato.

Nell’esempio della pagina 7, lo stato contiene $(0,a)$, $(0,b)$ e $(1,c)$: ha cardinalità tre. Le altre combinazioni sono possibili rispetto ai domini, ma assenti nello stato mostrato. Una tupla con secondo valore $d$, invece, non appartiene neppure al prodotto se $d$ non è nel dominio.

**Diagramma aggiuntivo:**

```diagram
Domini: valori consentiti → Prodotto: tutte le combinazioni → Stato: combinazioni presenti
```

**Applicazione pratica aggiuntiva.** Se un catalogo ammette solo i colori rosso e blu, un oggetto con colore verde viola il dominio scelto. Un oggetto blu assente dal catalogo non viola nulla solo per il fatto di essere assente: appartenenza allo spazio delle possibilità e presenza effettiva sono domande diverse.

## Perché parlare di insieme

**Dalle slide — pagina PDF 6.** L’ordine delle tuple non conta. Scambiare le righe di una rappresentazione non cambia lo stato. La nozione di insieme implica inoltre che una stessa tupla non compaia due volte, proprietà ribadita a pagina 11 nella lezione successiva.

**Precisazione aggiuntiva.** La tupla matematica è ordinata rispetto ai domini; quando usiamo attributi con nome, il collegamento tra nome e valore consente di rappresentare la stessa informazione anche cambiando l’ordine visivo delle colonne. Non si possono invece scambiare i valori lasciando invariati i nomi: cambierebbe il loro significato. Non estendere automaticamente queste proprietà a ogni tabella o risultato SQL: qui stiamo definendo il modello relazionale, non eseguendo SQL.

## Errori comuni e verifica ragionata

- Confondere il dominio con i valori attualmente presenti in una colonna.
- Credere che una relazione debba contenere l’intero prodotto cartesiano.
- Contare due volte la stessa tupla come se fosse un nuovo elemento dell’insieme.

**Attività aggiuntiva.** Su $D_1=\{1,2\}$ e $D_2=\{x,y\}$, scrivi il prodotto e poi uno stato con una sola tupla. Spiega perché $(3,x)$ non può comparire. La risposta deve distinguere possibilità, presenza e validità rispetto ai domini.

## Riepilogo

Il modello comprende strutture, operatori e vincoli. I domini stabiliscono valori ammissibili, il prodotto tutte le combinazioni, una relazione un sottoinsieme e lo stato le tuple presenti. Riferimento: [pagine 1–7](/sources/relational-source#page=1), con definizioni principali alle pagine 5–7. La prossima lezione collega questa descrizione a schemi e tabelle.

---
{
  "id": "integrita-riferimenti",
  "moduleId": "modello-relazionale",
  "slug": "integrita-riferimenti",
  "title": "Integrità referenziale e schema della base di dati",
  "mdxPath": "lessons/integrita-riferimenti.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "relational-source",
      "file": "Argomento02 Modello Relazionale.pdf",
      "pageStart": 20,
      "pageEnd": 27,
      "section": "Integrità referenziale e schema della base di dati"
    }
  ],
  "concepts": [
    "foreign-key",
    "integrita",
    "schema-database"
  ],
  "description": "Segui i collegamenti tra relazioni e valuta la validità dello stato complessivo.",
  "objectives": [
    "Identificare relazioni referenzianti e referenziate.",
    "Valutare una FK semplice, anche autoriferita.",
    "Distinguere vincoli di riga e regole semantiche."
  ],
  "order": 8,
  "prerequisites": [
    "chiavi-vincoli"
  ],
  "relatedLessonIds": [
    "aggiornamenti-integrita"
  ],
  "quizPath": "quizzes/integrita-riferimenti.json"
}
---
## Collegamenti che devono trovare destinazione

**Dalle slide — pagine PDF 20–21.** L’integrità referenziale riguarda il collegamento fra una relazione **referenziante** e una **referenziata**. Nella prima, una chiave esterna o **FK** fa riferimento alla primaria **PK** della seconda. Una tupla referenzia l’altra quando i valori corrispondenti coincidono.

Nell’esempio della pagina 21, Enrolled.sid fa riferimento a Students.sid. Più iscrizioni possono puntare allo stesso studente: il fatto che una FK contenga una matricola non la rende automaticamente univoca nella relazione referenziante.

**Esempio aggiuntivo con dati inventati:**

| Students.sid | nome |
|---|---|
| s1 | Marta |
| s2 | Paolo |

| Enrolled.sid | corso |
|---|---|
| s1 | BD |
| s1 | MAT |
| s2 | BD |

```diagram
Enrolled.sid: s1, s1, s2 → Riferimento per valore → Students.sid: s1, s2
```

Le due occorrenze di s1 in Enrolled non sono un errore: riguardano corsi diversi. Un’iscrizione con sid s9, senza uno studente s9, lascerebbe invece un riferimento senza destinazione.

## NULL e corrispondenza degli attributi

**Dalle slide — pagine PDF 22–23.** La FK può assumere un valore presente nella chiave referenziata, oppure NULL quando ammesso. Non può essere NULL se il suo attributo è anche parte della primaria della relazione referenziante. Le slide osservano inoltre che FK e PK non devono necessariamente avere lo stesso nome e che una relazione può riferirsi a se stessa.

**Precisazione aggiuntiva.** Questa lezione usa FK di un solo attributo negli esempi. Le FK composte richiedono di considerare l’intera corrispondenza fra attributi; i dettagli di gestione dei NULL composti dipendono dalle regole applicate e non vengono dedotti da un solo esempio. Uguali nomi di colonna non creano da soli un vincolo: occorre dichiarare il collegamento.

**Applicazione aggiuntiva.** In Dipendente(id, responsabileId), responsabileId può riferirsi a id della stessa relazione. Il nome diverso non è un problema: conta il riferimento dichiarato. Un dipendente senza responsabile potrebbe avere NULL solo se lo schema lo consente; non si inventa un responsabile inesistente per riempire il campo.

## Leggere uno schema con più riferimenti

**Dalle slide — pagina PDF 24, diagramma COMPANY controllato visivamente.** La figura contiene relazioni come EMPLOYEE, DEPARTMENT, PROJECT, WORKS_ON e altre, collegate da più frecce. Il messaggio didattico è che uno schema può avere più vincoli, anche sulla stessa relazione. Non è un semplice elenco di tabelle indipendenti.

**Metodo aggiuntivo per leggere il disegno:** identifica relazione di partenza, attributi della FK, relazione di arrivo e chiave referenziata. Non dedurre il significato di un legame dalla sola vicinanza grafica. Per esempio, una relazione di partecipazione collega persone e progetti tramite identificatori, non tramite il titolo del progetto visualizzato all’utente.

## Schema e stato dell’intera base di dati

**Dalle slide — pagine PDF 25 e 27.** Lo schema di una base di dati relazionale comprende schemi di relazione e vincoli di integrità:

$$
S=\langle \{R_1,\ldots,R_n\},IC\rangle.
$$

Uno stato della base di dati assegna uno stato a ciascuna relazione e deve soddisfare i vincoli applicabili, compresi quelli che collegano relazioni diverse. **Spiegazione aggiuntiva:** due tabelle possono sembrare ciascuna regolare, considerate da sole, ma il loro insieme può essere invalido perché una FK non trova destinazione. La correttezza globale non si ottiene controllando soltanto i tipi di ogni cella.

## Vincoli semantici e strumenti

**Dalle slide — pagina PDF 26.** La regola sulle ore settimanali complessive di lavoro esemplifica un vincolo legato al significato dell’applicazione. Le slide richiamano strumenti quali trigger, asserzioni e CHECK, osservando che il supporto varia tra DBMS. È una distinzione fra regola concettuale e possibilità di esprimerla concretamente.

**Frammento SQL aggiuntivo illustrativo, non eseguibile nell’app:**

```sql
CREATE TABLE Persona (
  id INTEGER PRIMARY KEY,
  eta INTEGER CHECK (eta >= 18)
);
```

Il frammento sviluppa l’idea del CHECK mostrata a pagina 26 con una tabella semplificata. Non implementa il vincolo aggregato sulle ore: controllare un attributo di una riga non equivale a controllare una somma su più righe. Non certifica la compatibilità di tutti i DBMS o di tutte le loro versioni. SQL Lab è ora disponibile, ma resta in sola lettura: questo DDL non è eseguibile nel laboratorio.

## Errori comuni

- Confondere la ripetizione di una FK con una violazione dell’unicità della PK referenziata.
- Ritenere sufficiente che due colonne abbiano lo stesso nome.
- Pensare che NULL sia sempre ammesso oppure sempre vietato in una FK.
- Credere che un CHECK sulla singola riga risolva qualsiasi vincolo applicativo.

**Attività aggiuntiva.** Aggiungi una quarta iscrizione alla tabella di esempio. Scegline una valida e una con riferimento mancante, spiegando il controllo necessario. Poi valuta perché cancellare Marta può richiedere una decisione sulle sue iscrizioni: è l’argomento della prossima lezione.

## Riepilogo

Riferimenti: [pagine 20–27](/sources/relational-source#page=20). L’integrità referenziale collega valori e chiavi; lo schema complessivo raccoglie tutte le relazioni e i vincoli che ne governano gli stati.

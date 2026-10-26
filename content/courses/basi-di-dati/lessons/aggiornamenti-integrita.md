---
{
  "id": "aggiornamenti-integrita",
  "moduleId": "modello-relazionale",
  "slug": "aggiornamenti-integrita",
  "title": "Aggiornamenti e conservazione dell’integrità",
  "mdxPath": "lessons/aggiornamenti-integrita.md",
  "version": 2,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "relational-source",
      "file": "Argomento02 Modello Relazionale.pdf",
      "pageStart": 28,
      "pageEnd": 37,
      "section": "Aggiornamenti e conservazione dell’integrità"
    }
  ],
  "concepts": [
    "insert",
    "delete",
    "update",
    "azioni-referenziali"
  ],
  "description": "Prevedi violazioni e conseguenze di rifiuto, cascata e assegnazioni sulle FK.",
  "objectives": [
    "Individuare possibili violazioni per INSERT, DELETE e UPDATE.",
    "Distinguere cascata di cancellazione e aggiornamento.",
    "Riconoscere condizioni e limiti di SET NULL e SET DEFAULT."
  ],
  "order": 9,
  "prerequisites": [
    "integrita-riferimenti"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/aggiornamenti-integrita.json"
}
---
## Aggiornare significa cambiare stato

**Dalle slide — pagine PDF 28–29.** Un inserimento, una cancellazione o una modifica trasforma lo stato della base di dati. Il nuovo stato deve continuare a soddisfare i vincoli. Quando una richiesta produrrebbe una violazione, il sistema può rifiutarla o applicare azioni previste per mantenere l’integrità.

**Scenario aggiuntivo.** Usiamo Students(sid, nome) con primaria sid ed Enrolled(sid, corso) con primaria composta (sid, corso) e FK verso Students.sid. Supponiamo che s1 sia uno studente esistente e abbia due iscrizioni. Tutti gli esempi seguenti dichiarano questa situazione iniziale: valutare un’operazione senza conoscere stato e vincoli non basta.

```diagram
Stato valido iniziale → Operazione e controlli sui vincoli → Nuovo stato valido oppure rifiuto
```

Il disegno è una rielaborazione didattica. Non mostra un algoritmo del DBMS né autorizza l’app ad eseguire aggiornamenti SQL.

## INSERT: quattro famiglie di controlli

**Dalle slide — pagine PDF 30–31, esempi e tabelle letti visivamente.** Un inserimento può violare dominio, chiave, integrità dell’entità o integrità referenziale. Nell’esempio del corso compaiono un identificatore già presente, un valore incompatibile con il dominio, un riferimento a uno studente inesistente e una primaria NULL.

| Inserimento aggiuntivo | Perché sarebbe invalido nelle ipotesi indicate |
|---|---|
| Nuovo studente con sid s1 già usato | Duplica la primaria |
| Studente con sid NULL | Non rispetta l’integrità dell’entità |
| Iscrizione di s9, studente inesistente | Non rispetta l’integrità referenziale |
| Valore testuale in un attributo dal dominio numerico | Non appartiene al dominio scelto |

**Come ragionare.** Prima verifica ogni valore rispetto al dominio, poi identifica primaria e vincoli di unicità, controlla la non nullità e infine cerca le destinazioni delle FK. Lo stesso inserimento può violare più di una regola: nominare un errore non prova che sia l’unico.

## DELETE: guardare chi fa riferimento alla riga

**Dalle slide — pagina PDF 32.** Nel quadro dei vincoli relazionali discussi, cancellare una tupla referenziata può lasciare FK senza destinazione. Cancellare una singola iscrizione non produce invece quel problema per il riferimento da Enrolled verso Students, se nessun altro vincolo è coinvolto.

**Esempio aggiuntivo.** Eliminare s1 da Students lasciando in Enrolled le sue due iscrizioni crea riferimenti mancanti. Eliminare una delle iscrizioni di s1 lascia comunque lo studente presente e non crea da solo un riferimento mancante. La direzione del legame conta.

**Precisazione aggiuntiva.** L’affermazione della slide su DELETE riguarda i vincoli relazionali qui elencati. Non è una prova che una cancellazione non possa violare una regola applicativa più ampia, come una quantità minima richiesta dal dominio dell’applicazione.

## UPDATE: il campo modificato conta

**Dalle slide — pagine PDF 33–34.** Cambiare una PK può invalidare i riferimenti esistenti; cambiare una FK può farla puntare a un valore inesistente; modificare un altro attributo può violare dominio, unicità o non nullità. UPDATE può quindi richiedere controlli di più categorie.

**Scenario aggiuntivo.** Se s1 diventa s7 in Students, le iscrizioni che riportano ancora s1 devono essere gestite. Se cambia soltanto il nome, il collegamento tramite sid resta lo stesso, purché non siano violati altri vincoli sul nome. L’identità scelta nello schema evita di dover collegare le righe usando un’informazione descrittiva potenzialmente variabile.

## Rifiutare o propagare

**Dalle slide — pagine PDF 29 e 35–37.** Vengono presentate RESTRICT/NO ACTION, CASCADE, SET NULL e SET DEFAULT. La tabella seguente distingue il caso di cancellazione dall’aggiornamento del valore referenziato.

| Azione concettuale | Effetto da valutare |
|---|---|
| Rifiuto | L’operazione incompatibile non viene applicata |
| Cascata su cancellazione | Si cancellano le righe referenzianti interessate |
| Cascata su aggiornamento | Si propagano i nuovi valori della chiave alle FK |
| SET NULL | Si assegnano NULL alle FK, solo dove ammissibile |
| SET DEFAULT | Si assegnano valori predefiniti, solo se ammessi e validi |

**Precisazione aggiuntiva da revisionare.** A pagina 35 la formulazione di CASCADE accomuna cancellazione e modifica in modo ambiguo. La propagazione di un cambiamento della chiave non va spiegata come una cancellazione automatica delle righe figlie: è distinto il tipo di operazione. Inoltre la pagina 36 raggruppa SET NULL e SET DEFAULT per FK comprese nella PK. NULL viola certamente l’integrità dell’entità in quel caso; un valore di default non è necessariamente NULL e va valutato anche rispetto a riferimenti, unicità e supporto del DBMS. Non trasformiamo la semplificazione della slide in una regola universale.

RESTRICT e NO ACTION sono raggruppati nelle slide come opzioni di rifiuto. **Limite dichiarato:** questa lezione non ne certifica l’identità in ogni DBMS, soprattutto rispetto al momento dei controlli. Anche disponibilità e dettagli di SET DEFAULT richiederanno verifica per il dialetto del laboratorio.

## Leggere il frammento SQL delle slide

**Pagina PDF 37, letta visivamente.** L’esempio associa `ON DELETE CASCADE` e `ON UPDATE NO ACTION` a una FK di Enrolled. L’intenzione è propagare le cancellazioni e impedire aggiornamenti incompatibili. Si nota però `studid` nell’esempio contro `sid` delle tabelle precedenti, e il riferimento non esplicita la colonna di Students.

**Esempio aggiuntivo normalizzato a scopo di lettura, non copia certificata né codice eseguito:**

```sql
CREATE TABLE Iscrizione (
  studente_id INTEGER NOT NULL,
  corso_id INTEGER NOT NULL,
  PRIMARY KEY (studente_id, corso_id),
  FOREIGN KEY (studente_id) REFERENCES Studente(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
```

Presuppone una tabella Studente con primaria id compatibile. Non include una FK verso i corsi, perché il frammento illustra una sola politica. Per renderlo parte di uno schema reale servono tutte le relazioni e i vincoli richiesti. SQL Lab rifiuta questo DDL perché è in sola lettura. Il frammento rimane illustrativo e non certifica il comportamento MySQL/MariaDB.

## Errori comuni

Non pensare che CASCADE significhi sempre cancellare, che SET NULL funzioni su attributi di primaria, che un default sia automaticamente valido o che rifiutare un’operazione equivalga a correggerne i dati. **Attività aggiuntiva:** prova a cancellare idealmente s1 nelle ipotesi iniziali con rifiuto e con cascata. Elenca le righe rimaste in entrambe le relazioni; poi considera l’aggiornamento a s7 e spiega la differenza.

## Riepilogo

Le [pagine 28–37](/sources/relational-source#page=28) spiegano violazioni e opzioni di gestione. Le ambiguità sono registrate anche nel rapporto di revisione. Il principio stabile è controllare lo stato finale e le regole dichiarate, senza indovinare il comportamento di uno specifico motore SQL.

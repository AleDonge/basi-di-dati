---
{
  "id": "chiavi-vincoli",
  "moduleId": "modello-relazionale",
  "slug": "chiavi-vincoli",
  "title": "Chiavi e integrità delle entità",
  "mdxPath": "lessons/chiavi-vincoli.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "relational-source",
      "file": "Argomento02 Modello Relazionale.pdf",
      "pageStart": 14,
      "pageEnd": 19,
      "section": "Chiavi e integrità delle entità"
    },
    {
      "sourceId": "relational-source",
      "file": "Argomento02 Modello Relazionale.pdf",
      "pageStart": 12,
      "pageEnd": 12,
      "section": "Introduzione alle chiavi"
    }
  ],
  "concepts": [
    "chiavi",
    "superchiave",
    "minimalita",
    "null"
  ],
  "description": "Ragiona su identificazione, minimalità e non nullità, anche con chiavi composte.",
  "objectives": [
    "Distinguere superchiave, candidata e primaria.",
    "Verificare la minimalità di una superchiave.",
    "Applicare l’integrità dell’entità a una primaria composta."
  ],
  "order": 7,
  "prerequisites": [
    "schema-istanza"
  ],
  "relatedLessonIds": [
    "integrita-riferimenti"
  ],
  "quizPath": "quizzes/chiavi-vincoli.json"
}
---
## I vincoli selezionano gli stati validi

**Dalle slide — pagine PDF 14–15.** Una base di dati non accetta qualunque insieme di valori. I vincoli determinano quali stati sono ammissibili. Le slide distinguono vincoli impliciti nel modello, vincoli espressi nello schema e vincoli applicativi o semantici. Tra quelli relazionali espliciti compaiono dominio, chiave, integrità delle entità e integrità referenziale.

Il dominio riguarda i valori ammissibili; la chiave riguarda l’identificazione. Sono controlli diversi: due tuple possono avere tutti valori del tipo corretto e tuttavia violare un vincolo di unicità. Per questo non basta dichiarare i domini.

## Superchiavi: distinguere ogni tupla

**Dalle slide — pagine PDF 12 e 16.** Una **superchiave** è un insieme di attributi che distingue qualunque coppia di tuple diverse in ogni stato valido della relazione. Se $SK$ è una superchiave, allora:

$$
\forall t_1,t_2\in r(R),\quad t_1\ne t_2\Rightarrow t_1[SK]\ne t_2[SK].
$$

$t[SK]$ indica i valori della tupla sugli attributi scelti. La definizione richiede una regola che valga nel tempo: l’assenza di duplicati in un campione non è una prova che un attributo debba sempre essere univoco.

> **Esempio aggiuntivo.** Oggi i tre studenti hanno nomi diversi. Domani può iscriversi un omonimo: il nome non diventa una chiave per il solo fatto di essere distinto nel campione. Una matricola assegnata secondo una regola di unicità può invece identificare gli studenti in tutti gli stati ammessi.

## Chiavi candidate e minimalità

**Dalle slide — pagine PDF 16–17.** Una **chiave candidata** è una superchiave minimale: togliendo un qualunque suo attributo, non resta una superchiave. Ogni chiave candidata è quindi una superchiave, mentre una superchiave può includere attributi superflui.

La pagina 17 considera sid e login come due chiavi candidate distinte. L’insieme {sid, name} è una superchiave perché contiene sid, ma non è minimale: togliendo name, sid continua a identificare ogni tupla.

| Insieme, nell’ipotesi della slide | Superchiave? | Candidata? | Motivo |
|---|---|---|---|
| {sid} | Sì | Sì | L’attributo identifica da solo |
| {login} | Sì | Sì | Il login è assunto univoco |
| {sid, name} | Sì | No | name può essere eliminato |
| {name} | Non garantito | Non garantito | Sono ammessi omonimi |

**Precisazione aggiuntiva.** “Minimale” significa priva di attributi eliminabili, non necessariamente della più piccola dimensione fra tutte le chiavi candidate. Una chiave composta può essere candidata anche se esiste un’altra chiave di un solo attributo. La scelta di una chiave primaria è un passaggio successivo.

## Primaria e surrogata

**Dalle slide — pagine PDF 12 e 18.** Se esistono più candidate, una viene scelta come **chiave primaria**, utilizzata per identificare le tuple e consentire riferimenti da altre relazioni. Le slide menzionano anche le chiavi artificiali o surrogate: identificatori convenzionali introdotti per questo scopo.

**Esempio aggiuntivo.** Un archivio di libri può assegnare un codice interno a ogni esemplare. Il titolo non distingue due copie dello stesso libro; il codice può farlo se la sua unicità viene imposta. Non è il fatto di chiamarlo “id” a garantire la proprietà: serve un vincolo coerente e rispettato.

```diagram
Superchiavi: identificano → Candidate: identificano senza attributi superflui → Primaria: candidata scelta
```

Il diagramma rappresenta un processo di selezione concettuale, non una successione di nuovi valori da aggiungere alle tuple.

## Integrità dell’entità e NULL

**Dalle slide — pagina PDF 19.** Nessun attributo della chiave primaria può avere valore NULL. Se la chiave è composta, il divieto vale per ogni componente: non basta che almeno uno sia valorizzato. È possibile imporre anche ad attributi non appartenenti alla primaria di non essere NULL.

**Spiegazione aggiuntiva.** NULL rappresenta qui l’assenza del valore, non un normale identificatore condiviso. Una chiave primaria deve identificare la tupla; un’informazione mancante non può assolvere quel compito. Non stiamo ancora introducendo tutti i comportamenti di NULL nei diversi dialetti SQL.

**Applicazione ragionata.** Per Iscrizione(studente, corso), ipotizza una primaria composta dai due attributi. Due iscrizioni dello stesso studente a corsi diversi possono essere distinte dalla coppia. Una riga con studente mancante non soddisfa l’integrità dell’entità anche se corso è presente. E una ripetizione della stessa coppia viola l’unicità della primaria.

## Errori comuni

Non confondere superchiave con chiave candidata, minimalità con dimensione minima, unicità osservata con vincolo generale, né primaria composta con autorizzazione a lasciare un componente NULL. Prova a spiegare perché aggiungere un attributo a una superchiave non ne elimina la capacità di identificazione, ma può eliminarne la minimalità.

## Riepilogo

Le definizioni provengono dalle [pagine 12 e 14–19](/sources/relational-source#page=12). Una chiave identifica le tuple in ogni stato valido; la primaria aggiunge il ruolo scelto per l’identità e il vincolo di non nullità. La prossima lezione usa queste idee per collegare relazioni.

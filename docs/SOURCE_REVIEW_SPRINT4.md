# Revisione delle fonti ER — Sprint 4

Data: 25 ottobre 2026. Stato editoriale: **needs-review**. Fonte primaria:
`source-material/Argomento05 Entity Relationship.pdf`, 71 pagine, originale invariato.
Checksum SHA-256 registrato nel manifest e nel rapporto di importazione Sprint 4.
L'inventario conserva tutti i 13 originali già presenti; nessun materiale aggiuntivo
è stato presunto disponibile e Book.pdf non è stato estratto.

## Metodo e copertura integrale

Estratto e letto il testo di tutte le pagine con pypdf; renderizzate tutte le 71
pagine con pypdfium2 e controllate visivamente in dodici tavole, comprese formule,
frecce, tratti, sottolineature e diagrammi. Materiale di lavoro non pubblicato in
`tmp/pdfs/sprint4/`. Nessuna pagina risulta completamente illeggibile; alcune
figure dense richiedono interpretazione, registrata sotto senza correggere l'originale.
Numeri di pagina riferiti alla posizione nel PDF, a partire da 1.

| Pagine | Contenuti effettivamente presenti |
| --- | --- |
| 1 | Titolo e ambito della progettazione concettuale |
| 2–6 | Fasi della progettazione, requisiti, modelli e indipendenza dall'implementazione |
| 7–8 | Requisiti testuali COMPANY: dipendenti, dipartimenti, progetti, familiari |
| 9 | Il modello come descrizione del mini-mondo |
| 10–11 | Entità, tipo e insieme di entità; attributi e domini |
| 12 | Attributi semplici, composti e multivalore; scelta esplicita del corso di usare attributi semplici |
| 13–16 | Chiavi, chiavi composte, candidate/primaria e notazione grafica |
| 17–20 | Associazioni, tipi/insiemi, attributi descrittivi; domanda su più periodi WORKS_IN |
| 21–22 | Associazioni ternarie e identificazione delle occorrenze |
| 23–25 | Vincoli di chiave, frecce e limiti delle interpretazioni nelle ternarie |
| 26–27 | Partecipazione totale e combinazione con vincoli di chiave; domanda su WORKS_IN |
| 28–29 | Rapporti di cardinalità e notazione esplicita (min,max) |
| 30 | Associazione ricorsiva REPORTS_TO, ruoli distinti |
| 31–32 | Entità deboli, chiave parziale, proprietario e associazione identificante |
| 33 | Esempio Order/order details con rappresentazione differente, da non usare come nuova notazione generale |
| 34 | Riepilogo frecce, partecipazione e limiti finiti più generali |
| 35–40 | Generalizzazione/specializzazione ISA, ereditarietà, disgiunzione/sovrapposizione, copertura |
| 41–43 | Aggregazione di SPONSORS, collegamento MONITORS e domanda di confronto con ternaria |
| 44–48 | Entità o attributo, dipendenze dai requisiti; domanda sugli indirizzi |
| 49–50 | Associazione binaria/ternaria e periodi di lavoro |
| 51–53 | Ridondanze, attributi e specializzazione dei manager |
| 54–58 | Scelte tra associazioni, polizze, familiari, proprietari e vincoli |
| 59 | Progettazione iterativa |
| 60–63 | Aggregazione/ternaria, ruolo di until e vincoli non automaticamente equivalenti |
| 64–71 | Metodo di progettazione: concetti, nomi, associazioni, chiavi, vincoli, completezza, revisione |

## Convenzioni grafiche adottate

- Entità: rettangolo; attributo: ovale; associazione: rombo (p. 16–22).
- Attributi della chiave primaria sottolineati; chiave composta: più componenti
  dello stesso identificatore (p. 13–16). Le candidate sono registrate nel pannello,
  senza inventare un simbolo grafico ulteriore.
- Freccia **dall'entità verso l'associazione** per il massimo 1 (p. 23–25, 34).
  Non viene invertita seguendo convenzioni di altri strumenti.
- Partecipazione totale: collegamento spesso (p. 26–27), non linea doppia.
- Cardinalità esplicite (min,max) presso la partecipazione; N significa massimo
  non limitato. Il lab le mostra anche quando le slide consentono di ometterle
  per il caso (0,N) (p. 29).
- Entità debole e associazione identificante: contorno spesso; chiave parziale
  con sottolineatura tratteggiata (p. 31–32). Nessun doppio rettangolo automatico.
- ISA: triangolo, D/O, linea doppia verso la superclasse per copertura totale
  (p. 35–40). Distinguerla dalla partecipazione totale alle associazioni.
- Aggregazione: contorno tratteggiato attorno alla struttura aggregata
  (p. 41–43). Studiata nelle lezioni; **non costruibile nell'editor attuale**.

## Ambiguità e scelte prudenti

1. P. 25: una freccia dal singolo partecipante ternario impone un vincolo più
   forte del limite formulato su una coppia. L'editor registra partecipazioni
   per entità e segnala la semantica delle n-arie come revisione manuale; non
   sostiene di rappresentare ogni dipendenza funzionale tra sottoinsiemi.
2. P. 20 e 49–50: più periodi non si ottengono cambiando soltanto l'attributo
   since di una medesima coppia. L'esempio della piattaforma reifica PERIODO e
   aggiunge esplicitamente IdPeriodo, assente come prescrizione nel diagramma.
3. P. 31–32 e 58: il proprietario del familiare dipende dal modello considerato
   (dipendente/polizza). Non si trasferisce automaticamente l'identificazione
   da un esempio all'altro. Il riferimento polizze è un'interpretazione da rivedere.
4. P. 48: la scelta di INDIRIZZO come entità richiede motivazioni dai requisiti;
   CodiceIndirizzo è un'aggiunta della piattaforma, non una chiave prescritta.
5. P. 55–58: il caso delle polizze richiede chiarimenti su co-intestazione,
   beneficiari e identificazione. I controlli non attribuiscono un esito definitivo.
6. P. 43 e 60–63: eliminare until non prova l'equivalenza tra aggregazione e
   ternaria. Il vincolo sulla coppia sponsorizzante resta da esplicitare.
7. COMPANY è un caso ampio: l'attività iniziale ne seleziona un sottoinsieme
   dichiarato. Alcuni vincoli sono tratti dagli esempi successivi e non dedotti
   arbitrariamente dalle sole p. 7–8.

## Lezioni e attività

Otto lezioni: requisiti; entità/attributi/identificatori; associazioni; vincoli;
entità deboli; gerarchie; aggregazione; scelte di progettazione. Ogni lezione
ha riferimenti puntuali, spiegazioni aggiuntive dichiarate, diagramma calcolato
dal modello JSON, esempi, errori, riepilogo e tre domande. Tutte needs-review.

Le dispense non presentano una raccolta separata di esercizi numerati completi.
Cinque attività riprendono domande effettive: periodi (p. 20), WORKS_IN (p. 27),
indirizzi (p. 48), polizze (p. 55–58), aggregazione (p. 43). Due attività sono
**originali Database Academy**: sottoinsieme COMPANY (p. 7–8) e varianti ISA
(p. 35–40). Il testo distingue domanda, contesto e adattamento; suggerimenti,
diagrammi e soluzioni di riferimento sono della piattaforma, needs-review.

## Costrutti esclusi e motivazione

Aggregazione riconosciuta ma non editabile, con attività guidata testuale;
attributi composti/multivalore discussi ma non costruibili nel subset semplice;
nessun vincolo generale tra gruppi di partecipanti, linguaggio di predicati,
conversione automatica in SQL, editor logico o equivalenza semantica. Crow's foot,
UML e doppie forme Chen non sostituiscono la grafica del corso. Non sono introdotti
esame, tutor AI, autenticazione o Sprint 5.

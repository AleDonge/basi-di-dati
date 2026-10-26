# Algebra Lab · Sprint 3

## Perimetro effettivo

Parser dedicato, AST TypeScript e interprete deterministico su relazioni finite.
Nessuna traduzione AI, eval, JavaScript fornito dall'utente o esecuzione SQL.
Operatori eseguibili: selezione, proiezione, ridenominazione, prodotto cartesiano,
unione, differenza, intersezione, join naturale, theta join e divisione.
L'equijoin è un theta join con predicati di uguaglianza.

Non implementati: outer join, outer union, aggregazioni, aritmetica, NULL,
assegnazioni/sequenze di istruzioni, rinomina per posizione, wildcard, ordinamento.
Gli outer join sono trattati nella lezione dedicata; il parser li rifiuta.

## Lettura integrale delle fonti e ambiguità

Letti tutti i testi estraibili e renderizzate/controllate visivamente tutte le
48 pagine di Argomento03, le 10 di Argomento03.1 e la pagina di esercitazione_AR.
La scansione non offre testo utilizzabile: schema, 14 domande e due espressioni
sono trascritti dalla pagina renderizzata. Nessuna parte usata è rimasta illeggibile.
Originali e checksum invariati; Book.pdf non estratto.

| Pagine PDF | Contenuto e destinazione |
|---|---|
| Argomento03, 1 | Titolo e attribuzioni delle slide; nessuna fonte remota scaricata |
| Argomento03, 2–7 | Linguaggi, motivazioni, istanze S1/S2/R1, chiusura e operatori; ar-selezione |
| Argomento03, 8–12 | Predicati, proprietà ed esempi selezione; ar-selezione |
| Argomento03, 13–20 | Proiezione, duplicati, composizione; ar-proiezione |
| Argomento03, 21–25 | Unione, intersezione, differenza e compatibilità; ar-insiemi |
| Argomento03, 26–28 | Prodotto e conflitti di nomi; ar-prodotto |
| Argomento03, 28–30 | Rinomina per nome/posizione e relazione; ar-ridenominazione |
| Argomento03, 31–37 | Theta/equijoin, naturale, cardinalità; ar-join |
| Argomento03, 38–39 | Divisione e copertura universale; ar-divisione |
| Argomento03, 40–43 | Left/right/full outer join, NULL e tabelle; ar-estensioni, solo teoria |
| Argomento03, 44–48 | Alberi, esercizio di interpretazione e ottimizzazione; ar-alberi e due attività guidate |
| Autoverifica, 1–2 | Introduzione, schema e istanza S3/R2/B1; distinta dallo script |
| Autoverifica, 3–4 | Q1 barca 103, due versioni e relazioni intermedie |
| Autoverifica, 5–6 | Q2 rossa, Q3 rossa oppure verde, riscritture |
| Autoverifica, 7–8 | Q4 rossa e verde, Q4bis controesempio sui nomi |
| Autoverifica, 9–10 | Q5 tutte le barche, Q6 almeno due barche distinte |
| esercitazione_AR, 1 | Schema, riferimenti, 14 domande e due interpretazioni |

Precisazioni esplicite della piattaforma, tutte needs-review:

- Argomento03 p. 16: la formula di commutatività della proiezione può lasciare
  espressioni non definite. Si spiega la condizione sicura: π_A(π_B(R))=π_A(R)
  se A è contenuto in B, senza attribuire una formula corretta al docente.
- P. 34: l'equijoin illustrato conserva una sola copia della colonna uguagliata.
  Qui il theta/equijoin conserva entrambe; il naturale fonde i campi comuni.
  Una proiezione esplicita riproduce lo schema mostrato dalla fonte.
- P. 32: commutatività/associatività dei join richiedono schemi e predicati
  aggiornati coerentemente; non autorizzano a cambiare casualmente i confronti.
- P. 38: divisione resa esplicita con quantificazione su tutti gli elementi del
  divisore e candidati π_X(R). Il caso vuoto è una convenzione dichiarata.
- Pp. 45/47: il filtro usa bid=100, assente nello script ufficiale. Non è cambiato
  in 101 nella trascrizione: il risultato vuoto non invalida l'interpretazione.
- Autoverifica p. 10: il self-join è mostrato prima di una rinomina su sei
  posizioni. Un join naturale di una relazione con se stessa non produce sei
  attributi. La traduzione eseguibile usa copie con alias diversi e prodotto o
  theta join esplicito, senza presentare questa scelta come notazione originale.
- Le istanze S1/S2/S3 delle figure non coincidono con lo script Sailors per nomi,
  date e prenotazioni. Il laboratorio usa lo script richiesto, senza alterarlo.
- Scansione: Stipendio >50 milioni al Q1, >60K ai Q9/10; nessuna unità dello
  schema è dichiarata. Dataset illustrativo: stipendi in milioni e bilanci in
  migliaia. Q1/Q6 automatici solo sotto questo contratto esplicito; Q9/Q10 guidati.
- Q10: inclusione dei dipartimenti vuoti non esplicitata. Si discutono verità
  vacua e variante che richiede almeno un impiegato, senza verdetto automatico.
- Q8: “direttori e responsabili” interpretato come unione dei ruoli; dichiarato
  nel contratto, con possibilità di diversa lettura da sottoporre a revisione.
- Seconda interpretazione della scansione: i join naturali confrontano anche
  Nome e Sede. Codice non è confrontato con Dipartimento nel join più esterno;
  Nome/Sede non sono dichiarati chiave. Non si semplifica la domanda a “tutti i
  direttori” o “chi dirige il proprio dipartimento” senza ulteriori ipotesi.

## Grammatica implementata

Una espressione, non un linguaggio di script. Nomi case-sensitive ASCII, con
underscore dopo la prima lettera. Nessun accesso a proprietà JS: il punto indica
soltanto qualificazione di un attributo. Parole degli operatori ASCII non sensibili
alle maiuscole. Gli underscore immediatamente dopo σ/π/ρ/⋈ sono facoltativi.

```ebnf
expression = unionExpr ;
unionExpr  = intersectionExpr, { ("∪" | "UNION" | "−" | "–" | "-" | "DIFF"), intersectionExpr } ;
intersectionExpr = productExpr, { ("∩" | "INTERSECT"), productExpr } ;
productExpr = unary, { ("×" | "PRODUCT" | "÷" | "DIVIDE" | "⋈" | "JOIN"), [joinHeader], unary } ;
unary = relation | "(", expression, ")"
      | ("σ" | "select"), ["_"], header(predicate), "(", expression, ")"
      | ("π" | "project"), ["_"], header(attributes), "(", expression, ")"
      | ("ρ" | "rename"), ["_"], header(rename), "(", expression, ")" ;
joinHeader = ["_"], ("{", predicate, "}" | "[", predicate, "]") ;
attributes = attribute, { ",", attribute } ;
rename = alias | [alias, ";"], mapping, { ",", mapping } ;
mapping = attribute, ("->" | "→"), newName | newName, ("<-" | "←"), attribute ;
predicate = orExpr ;
orExpr = andExpr, { ("OR" | "∨"), andExpr } ;
andExpr = notExpr, { ("AND" | "∧"), notExpr } ;
notExpr = ("NOT" | "¬"), notExpr | "(", predicate, ")" | operand, comparison, operand ;
operand = attribute | number | singleQuotedString ;
comparison = "=" | "!=" | "<>" | "≠" | "<" | ">" | "<=" | ">=" | "≤" | "≥" ;
```

Header unario delimitato da `{…}` o `[…]`; senza delimitatori finisce alla prima
parentesi che apre l'operando. Esempio richiesto supportato:
`π_sname(σ_age>30(Sailors))`. Per parentesi nei predicati usare sempre le graffe.
Header condizionale soltanto per il join; ⋈ senza header è naturale. Le forme
ASCII `select[…]`, `project[…]`, `rename[…]` seguono la stessa grammatica.
Alias e nuovi nomi di attributi sono semplici, senza punto; attributi esistenti
possono essere qualificati. Numeri decimali con segno meno ed esponente; nessuna
aritmetica. Apici singoli raddoppiati per includere un apostrofo, non escape MySQL.

Operatori binari dello stesso livello associativi sintatticamente a sinistra.
La precedenza non attribuisce associatività matematica a differenza o divisione.

Esempi:

```text
π_{sname}(σ_{age>30}(Sailors))
Sailors ⋈ Reserves
Sailors ⋈_{Sailors.sid=Reserves.sid} Reserves
ρ_{A; sid->id,sname->nome}(Sailors)
ρ_{id<-sid}(Sailors)
π_{sid,bid}(Reserves) ÷ π_{bid}(Boats)
```

## Semantica e dataset

Tuple deduplicate all'ingresso e dopo ogni operazione che può introdurre
coincidenze. Ordine delle tuple non significativo; ordine delle colonne definito.
Domini: number (numeri finiti JavaScript/IEEE754), string (confronto esatto,
case-sensitive, nessuna collation MySQL), date (ISO YYYY-MM-DD, confronto
lessicografico coerente con le date normalizzate). Nessun NULL né conversione
implicita tra testo e numeri. Un letterale ISO può confrontarsi con un attributo date.
Non è un sistema di numeri reali a precisione arbitraria o un verificatore di calendari.

Selezione controlla i predicati anche con ingresso vuoto. Proiezione conserva
gli attributi richiesti, senza ripetere lo stesso attributo. Rinomina simultanea
per nomi; duplicati indistinguibili nello schema rifiutati. Prodotto conserva
qualificatori, richiede alias distinguibili per due copie della stessa relazione.
Un riferimento non qualificato ambiguo viene rifiutato, senza scegliere una colonna.

Operazioni insiemistiche: compatibilità per arità e dominio per posizione;
nomi del primo operando, come p. 21. Join naturale: tutti i nomi comuni,
una copia sinistra e colonne destre non comuni; senza nomi comuni è prodotto.
Theta join: conserva tutte le colonne, anche con predicati di uguaglianza.
Divisione: nomi Y del divisore sottoinsieme dello schema del dividendo, domini
uguali; risultato sugli attributi rimanenti X, candidati π_X(R). Divisore vuoto:
tutti i candidati; dividendo vuoto: nessun candidato. Supportate anche relazioni
di grado zero prodotte dalla divisione, non la proiezione con lista vuota.

`npm run algebra:datasets` rigenera JSON da schema/seed Sailors già convertiti
in Sprint 2 usando sqlite3 Python, e costruisce fixture sintetiche separate.
Non cambia originali, dataset SQL o progresso. Sailors ha 10/4/10 tuple e nessun
NULL: compatibile con l'algebra classica. Date normalizzate come nello Sprint 2.

Impiegato, Dipartimento, Progetto e Partecipazione usano lo schema trascritto
dalla scansione (nomi CamelCase mostrati nella UI). Tutte le righe sono sintetiche,
con chiavi e cinque riferimenti controllati nei test. Nessuna istanza ufficiale
è inventata. La fixture Sailors reversed contiene anche copie di tuple per
verificare la normalizzazione insiemistica, non per cambiare il seed ufficiale.

## Esecuzione e visualizzazione

Web Worker distinto da SQL e da IndexedDB, compilato localmente, CSP con
connect-src none e worker-src none. Nessuna rete dal worker o servizio esterno;
il thread principale legge soltanto route locali di dati e riferimenti.
Nessun codice dell'utente viene eseguito: solo nodi AST consentiti.

Limiti: 10.000 caratteri, 2000 token, 128 nodi, 32 livelli dell'albero, 2000 tuple
per relazione, 32 attributi, 100.000 celle complessive delle relazioni intermedie.
Budget interno 250.000 operazioni o circa 1 s, watchdog esterno 5 s per richiesta;
il caricamento del worker ha margine e può dipendere dal dispositivo. Interrompi
termina il worker. Ogni richiesta ne crea uno nuovo. I budget non sono una quota
dell'intero processo browser o una certificazione di sicurezza assoluta.

Ogni nodo conserva schema e tuple effettivamente calcolati; albero navigabile
con pulsanti e sequenza postorder. Tabelle mostrano fino a 200 tuple con avviso,
ma la relazione completa (entro il limite di 2000) viene usata per la verifica.
Oltre i limiti l'operazione fallisce, senza correzione su un risultato troncato.
Notazione KaTeX derivata dall'AST, stringhe escaped e trust=false; non viene
interpretato LaTeX arbitrario dell'utente. Reset azzera espressione e risultati,
conservando dataset e progressi. L'editor textarea supporta simboli, inserimento
alla posizione del cursore, tastiera e schermi piccoli.

## Esercizi e affidabilità della verifica

25 attività, tutte needs-review:

- 6 quesiti Sailors dell'Autoverifica, automatici su 5 fixture ciascuno.
- Q4bis sugli omonimi, guidato.
- 14 quesiti della scansione: 12 automatici su 4 fixture e Q9/Q10 guidati.
- 2 interpretazioni della scansione e 2 attività sugli alberi, guidate.

Totale 18 automatici, 7 guidati. Soluzioni e traduzioni sintattiche della
piattaforma, dichiarate come tali, non soluzioni ufficiali. Il materiale del
docente include esempi di soluzioni nell'Autoverifica, che rimangono riferimenti
da confrontare: non si attribuiscono al docente gli adattamenti eseguibili.

Fixture Sailors: script, casi limite con omonimi/colori/prenotazioni ripetute,
vuoto, nessuna prenotazione, ordine inverso con copie normalizzate. Fixture
Impiegati: demo, confini/omonimi/parità, vuoto, ordine inverso. Sono finite:
condizioni costruite apposta per quei valori possono ancora passare.

Il correttore esegue utente e riferimento da zero per ogni fixture. Confronta
nomi, posizione e domini delle colonne e insieme esatto delle tuple; qualificatori
ignorati nell'output, ordine delle righe ignorato. Nessuna tolleranza numerica o
conversione di tipi nascosta, nessun confronto soltanto testuale delle espressioni.
Sintassi, semantica, risorse e inconclusivo sono distinti. Riferimento fallito o
fixture insufficienti non producono superamento. Esito: “coerente sulle fixture”,
mai “equivalenza dimostrata”. Due omonimi che prenotano separatamente rosso/verde
e risposte accidentalmente giuste sull'originale sono coperti dai test.

Ogni automatico ha due espressioni equivalenti e due errori tipici nei test;
ulteriori 18 risultati attesi, calcolati a mano, controllano i riferimenti senza
usare lo stesso riferimento come unico oracolo. Per diverse attività della
scansione, la seconda espressione usa l'identità insiemistica E ∪ E = E.
I test non certificano tutte le possibili riscritture o tutti i database.

## Progressi e manutenzione

Archivio IndexedDB e backup restano v3: lo store attempts già supporta answer,
exerciseVersion, result, feedback e timestamp necessari all'algebra. Nessun
cambiamento di struttura richiede una migrazione aggiuntiva. Errore semantico
memorizzato come execution con descrizione “Errore semantico”; errore sintattico
come syntax. I tentativi guidati hanno result=guided e non completano verifiche.
Completamento automatico derivato da un passed per la versione corrente.

Testata aggiunta di tentativi a un archivio v3 con SQL/lezioni/cronologia,
conservazione delle versioni, backup/import e conflitti atomici. Le migrazioni
v1/v2 dello Sprint 2 restano testate. Modificare catalogo non cancella record.
Le espressioni libere del laboratorio non hanno una cronologia persistente:
sono salvati i tentativi e le riflessioni degli esercizi richiesti dallo sprint.

Per nuovi contenuti mantenere ID e versioni, validare metadati/fixture, estendere
l'allowlist dei dataset deliberatamente, aggiungere casi positivi e negativi,
aggiornare import manifest e changelog. Nessuna promozione automatica a verified.

Verifica manuale: `docs/SPRINT3_ACCEPTANCE.md`. Sprint 4 non avviato.

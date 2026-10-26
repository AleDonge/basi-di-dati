# Revisione delle fonti · Sprint 1

Stato: **needs-review**. Lettura tecnica eseguita; non approvazione umana dei contenuti.
Numeri riferiti alle pagine fisiche del PDF, non alle etichette stampate sulle slide.

## Metodo e integrità

- Rilevati ancora tutti i 13 originali dell'inventario M0. Nessuna fonte aggiunta o modificata.
- Estratto e letto tutto il testo dei due PDF richiesti (23 + 37 pagine).
- Renderizzate tutte le 60 pagine con PDFium; esaminate le tavole complete,
  controllando a risoluzione maggiore le figure e i frammenti non testuali.
- Non è stata necessaria una ricostruzione di pagine illeggibili: i due PDF sono
  leggibili, con diverse figure/tabelline non contenute nell'estrazione testuale.
- Fonti confrontate mediante SHA-256 nei test: gli originali sono invariati.
- Book.pdf e gli altri materiali non sono stati estratti per produrre le lezioni.

| Fonte | Pagine | SHA-256 |
|---|---:|---|
| Argomento01 Basi di Dati e loro utenti.pdf | 23 | 8f9dbee7feb1028b6da06f2fc65eeaeb31257eb84b1b35e72f0b1d536d87318a |
| Argomento02 Modello Relazionale.pdf | 37 | 1c2ef3bc742ca0fd8d65583b800d51e3705d88f22f2ff6504e1527df64e16a7d |

## Copertura integrale del primo PDF

| Pagine | Argomenti letti | Lezione |
|---|---|---|
| 1–4 | Frontespizio, definizione, esempi, DBMS e sistema | dbms-dati |
| 5 | Diagramma architetturale: interfacce, query engine, memoria, transazioni e recovery | dbms-dati |
| 6–7 | Responsabilità, linguaggi, query e transazioni | dbms-dati; richiamo transazioni-analisi |
| 8–9 | Codd, visione logica, indipendenza programmi-dati | astrazione-indipendenza |
| 10–11 | Indipendenza logica e fisica | astrazione-indipendenza |
| 12–13 | Livelli, diagramma, schema universitario e vista Coursesinfo | astrazione-indipendenza |
| 14–15 | Vantaggi, concorrenza, recupero | transazioni-analisi |
| 16–18 | OLTP/OLAP, confronto e categorie di strumenti | transazioni-analisi |
| 19–21 | Utilizzatori, sviluppatori, DBA, progettista e utenti finali | utenti-scelte |
| 22–23 | Costi, casi semplici, embedded, tempo reale, limiti del modello o prodotto | utenti-scelte |

## Copertura integrale del secondo PDF

| Pagine | Argomenti letti | Lezione |
|---|---|---|
| 1–4 | Frontespizio, modello, strutture/operatori/vincoli, Codd | relazioni-domini |
| 5–7 | Domini, prodotto, relazione, stato ed esempio finito | relazioni-domini |
| 8–11 | Tabelle, schema, istanza, grado, cardinalità, duplicati e ordine | schema-istanza |
| 12–13 | Introduzione alle chiavi, surrogate, terminologia | schema-istanza; chiavi-vincoli |
| 14–15 | Categorie di vincoli e vincoli relazionali espliciti | chiavi-vincoli |
| 16–19 | Superchiavi, minimalità, candidate, primaria, integrità entità | chiavi-vincoli |
| 20–24 | FK/PK, Students/Enrolled, NULL, autoriferimenti, diagramma COMPANY | integrita-riferimenti |
| 25–27 | Schema DB, vincoli semantici, CHECK in immagine, stato valido | integrita-riferimenti |
| 28–30 | Modifiche di stato, politiche, violazioni INSERT | aggiornamenti-integrita |
| 31–34 | Tabelle ed esempi di INSERT, DELETE, UPDATE | aggiornamenti-integrita |
| 35–36 | Azioni referenziali e casi di FK parte della primaria | aggiornamenti-integrita |
| 37 | Frammento SQL in immagine, CASCADE/NO ACTION e nomi attributi | aggiornamenti-integrita |

La copertura descrive ciò che è stato analizzato. Le lezioni riorganizzano il
materiale: non riproducono ogni riga o ogni dato di tutte le tabelle originali.

## Punti da sottoporre alla revisione umana

1. **Argomento02 p. 5:** intervallo di indici nella definizione del prodotto
   malformato; la lezione esplicita `1 ≤ i ≤ n` e segnala la precisazione.
2. **Argomento02 p. 6:** notazioni e uso ripetuto di n possono confondere numero
   di attributi e numero di tuple; nelle lezioni sono distinti e le formule usano
   la relazione come sottoinsieme, senza dedurre obbligo di sottoinsieme proprio.
3. **Argomento02 p. 11:** la formulazione sul numero di istanze per la cardinalità
   è letta coerentemente con l'esempio di p. 7 come numero di tuple dello stato.
4. **Argomento02 p. 12:** riferimento a SSN rispetto ad altri esempi con sid/login;
   la lezione evita di fingere un unico schema identico e usa esempi esplicitati.
5. **Argomento02 pp. 26, 35–37:** strumenti e azioni SQL non certificati per
   uno specifico DBMS/versione. Il codice nelle lezioni è soltanto illustrativo.
6. **Argomento02 p. 35:** la descrizione di CASCADE non distingue chiaramente
   cancellazione e aggiornamento. La lezione li distingue come precisazione aggiunta.
7. **Argomento02 p. 36:** SET NULL e SET DEFAULT sono accomunati nel caso di FK
   parte della primaria. NULL è incompatibile con la primaria; un default non è
   automaticamente NULL o invalido. Occorre verificare dominio, unicità, FK e motore.
8. **Argomento02 p. 37:** `studid` contro `sid` degli esempi precedenti; riferimento
   a Students senza colonna esplicita. Non presentato come script copiabile validato.
9. **Argomento02 p. 32:** il limite sulle violazioni DELETE è spiegato nel quadro
   dei vincoli relazionali discussi, non come teorema su tutte le regole applicative.
10. **Argomento01 p. 23:** esempi di GIS/dati biologici interpretati come criteri
    relativi allo specifico modello/DBMS, non come incapacità universale dei gestori.

## Distinzione delle provenienze

- Definizioni e concetti del corso: etichetta “Dalle slide”, pagina precisa.
- Testo rielaborato: spiegazione didattica collegata alla fonte, mai citazione letterale implicita.
- Analogie, diagrammi, dati sintetici, attività e quiz: aggiunte didattiche dichiarate.
- Precisazioni sui refusi o sui limiti: esplicite, ancora needs-review.

Tutte le nove lezioni e tutti i 27 quesiti restano **needs-review**. Nessuna
informazione è stata contrassegnata automaticamente verified, né dichiarata
contenuto certo dell'esame. I due PDF sono consultabili esclusivamente dal server
locale tramite ID ammessi; non sono copiati in public o caricati online.

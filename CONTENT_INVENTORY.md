# Inventario fonti iniziali

| File | Tipo | Pagine / dimensione | Destinazione | Note |
|---|---|---:|---|---|
| Basi_di_dati_DISI 2026-27.pdf | PDF | 15 pp | contesto corso | verificare indicazioni esame senza inferenze |
| Argomento01 Basi di Dati e loro utenti.pdf | PDF | 23 pp | modulo introduzione | fonte primaria |
| Argomento02 Modello Relazionale.pdf | PDF | 37 pp | modulo modello relazionale | fonte primaria |
| Argomento03 Algebra Relazionale.pdf | PDF | 48 pp | modulo algebra | fonte primaria |
| Argomento03.1 Algebra Relazionale Autoverifica.pdf | PDF | 10 pp | esercizi algebra | Sailors, esempi |
| Argomento04 SQL.pdf | PDF | 91 pp | modulo SQL | fonte primaria |
| Argomento05 Entity Relationship.pdf | PDF | 71 pp | modulo progettazione ER | fonte primaria |
| Introduzione MySQL e Dbeaver.pdf | PDF | 92 pp | laboratorio strumenti | MySQL/MariaDB e DBeaver |
| esercitazione_AR(1).pdf | PDF immagine | 1 p | esercizi algebra | 14 quesiti + 2 interpretazioni; richiede lettura visiva |
| Book.pdf | PDF | 1098 pp | approfondimento opzionale | estrazione testo iniziale vuota; verificare prima di usarlo |
| Schema per generare DB Sailors.txt | SQL testuale | 63 righe | dataset Sailors | 3 tabelle, PK/FK, 10+4+10 record |
| Schema per generare DB NorthWind.txt | dump MySQL | ~3411 righe | dataset NorthWind | conversione esplicita e verificata |
| Esercizi 1 Sailor.txt | esercizi | 35 righe | pratica SQL | 5 query con aggregazioni e HAVING |

## Tracciamento iniziale degli esercizi Sailors
1. Per colore di barca, somma dei rating dei marinai prenotanti, solo colori con rating medio > 7.
2. Giorni con almeno 2 prenotazioni complessive da marinai maggiorenni.
3. Nomi omonimi con differenza tra età massima e minima < 10.
4. Media età e numero marinai per rating > 5, solo gruppi con almeno 2 marinai.
5. Barche (bid, bname) prenotate da marinai con età media > 40, solo barche con almeno 2 prenotazioni.

**Attenzione:** il dataset Sailors originale può non distinguere alcune risposte errate da quelle corrette; aggiungere fixture di valutazione senza alterare il dataset mostrato del docente. Gli esercizi sono trascritti come sintesi: preservare l'enunciato originale nel catalogo finale.

## Stato di copertura
`available` = presente nelle dispense, NON significa che ogni lezione/esercizio sia già verificato. `upcoming` = argomento non ancora documentato. Non aggiungere automaticamente normalizzazione, transazioni o argomenti di esame come se fossero già trattati: attendere fonti nuove.

## Rilevazione effettiva Sprint 0 · 24 ottobre 2026

- Presenti tutti i 13 materiali attesi, con una differenza di nome: `esercitazione_AR.pdf` anziché `esercitazione_AR(1).pdf`. Nessun originale rinominato.
- Conteggi PDF confermati: 1486 pagine totali, di cui 1098 del libro. Libro non estratto; nessuna assunzione su titolo/autore.
- Conteggi testuali effettivi (`splitlines`): Sailors 62, NorthWind 3410, esercizi 34 righe. Le precedenti stime includono diversamente le righe finali.
- Pagina immagine dell’esercitazione controllata visivamente; nessuna trascrizione pubblicata.
- Inventario macchina con dimensioni e SHA-256 in `docs/source-audit.json`; catalogo versionato in `content/courses/basi-di-dati/manifest.json`.
- In M0 tutti i moduli dell’app sono `draft`, con zero lezioni/esercizi pubblicati. Nell’app `available` significherà modulo con almeno una lezione verificata, evitando di confondere presenza della fonte e disponibilità didattica.

## Copertura Sprint 1 · 24 ottobre 2026

I 13 originali sono ancora presenti e hanno checksum invariati. Letti
integralmente Argomento01 (23 pagine) e Argomento02 (37 pagine), comprese figure,
diagrammi e frammenti in immagine. Nove lezioni e 27 quesiti consultabili come
anteprime personali `needs-review`, senza alcuna promozione automatica.

La copertura pagina per pagina e i punti ambigui sono registrati in
`docs/SOURCE_REVIEW_SPRINT1.md`. I moduli restano draft: presenza di anteprime e
lettura completata non equivalgono all'approvazione editoriale. Il libro e gli
altri PDF non sono stati estratti per questo sprint. SQL e algebra eseguibili
restano agli sprint successivi.

## Copertura Sprint 2 · 24 ottobre 2026

Sempre presenti i 13 originali con checksum invariati. Analizzati interamente
i tre TXT richiesti: DDL/seed Sailors, tutti gli statement/valori del dump
NorthWind e cinque enunciati. Parti pertinenti dei due PDF SQL/strumenti e figure
controllate: mappa precisa in `docs/SQL_LAB.md`.

Sailors convertito con 10/4/10 righe, PK/FK e una data ISO normalizzata.
NorthWind: tutte le otto tabelle, 3202 righe, 77 colonne e nove BLOB conservati.
Nessun record o colonna scartato. Le FK non sono dichiarate nel dump: otto
collegamenti convenzionali sono controlli aggiuntivi, non vincoli ufficiali.
DECIMAL/REAL, date e collation non equivalgono integralmente a MySQL/MariaDB.

Cinque esercizi e soluzioni della piattaforma needs-review. Lezioni e quiz dello
Sprint 1 conservati, senza promozioni. Fixture sintetiche separate dall'originale.
SQL Lab eseguibile; algebra resta non implementata. Book.pdf non estratto.

## Copertura Sprint 3 · 24 ottobre 2026

I 13 originali hanno checksum invariati. Letti integralmente e controllati
visivamente Argomento03 (48 pagine), Autoverifica (10) e esercitazione_AR.pdf
(una pagina scansionata: 14 quesiti e due interpretazioni). Nessun tratto usato
è rimasto illeggibile. Mappa e ambiguità in `docs/ALGEBRA_LAB.md`.

Nove lezioni/27 domande nuove, per un totale di 18/54; tutte needs-review.
25 attività di algebra: sei quesiti Sailors e dodici della scansione automatici,
sette attività guidate. Script Sailors invariato; righe Impiegati esclusivamente
sintetiche, distinte dalle fonti ufficiali. Divisione implementata; outer join
trattati teoricamente, non eseguibili. Nessuna promozione a verified.
Manifest v4 e import manifest Sprint 3 registrano aggiunte e hash senza cancellare
ID o progressi. NorthWind resta quello dello Sprint 2; Sprint 4 non avviato.


## Copertura Sprint 4 · 25 ottobre 2026

Tutti i 13 originali ancora presenti e invariati. Argomento05 Entity Relationship.pdf:
71 pagine lette integralmente e controllate visivamente, notazione e ambiguità
registrate in `docs/SOURCE_REVIEW_SPRINT4.md`. Nessuna estrazione di Book.pdf.
Otto lezioni/24 quiz nuovi; totali 26/78, tutti needs-review. Sette attività ER
guidate: cinque adattate da domande effettive delle slide e due originali Database
Academy. Soluzioni aggiuntive needs-review, non attribuite al docente.
Editor con entità/attributi semplici/chiavi/associazioni/cardinalità/deboli/ISA;
aggregazione solo teorica e guidata. Manifest v5 e import Sprint 4, zero ID
rimossi, zero promozioni verified. IndexedDB/backup v4 preservano gli archivi
precedenti. Il perimetro ER richiesto dal proprietario prevale sull'ordine della
vecchia M4 nella roadmap; NorthWind è già nello Sprint 2. Sprint 5 non avviato.


## Copertura Sprint 5 · 25 ottobre 2026

Nessuna fonte o lezione aggiunta/modificata; 13 originali e contenuti degli Sprint
1–4 invariati. Manifest didattico ancora v5, 26 lezioni/78 quiz, zero verified.
Exam Prep usa 115 attività esistenti: 78 quiz, cinque SQL, 25 algebra (18 automatiche,
sette guidate), sette ER guidate. Nessuna prova ufficiale d'esame nell'inventario;
sessioni dichiarate Database Academy. Mancano lezioni SQL dedicate, attività per
strumenti e prove ufficiali. Nessuna attività base; quiz non classificati per difficoltà.
Archivi di correzione locali immutabili con SHA-256, piani e progressi v5 preservati.
Ricerca dei soli contenuti redatti e metadati, libro escluso. Nessun ulteriore sprint.

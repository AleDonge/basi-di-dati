# Revisione fonti SQL e strumenti — Sprint 6

Stato **needs-review**, 25 ottobre 2026. Numeri riferiti alle pagine fisiche PDF.
Inventariati i 13 originali; nessuna fonte presunta, modificata o sostituita.
Book.pdf non estratto né indicizzato. Checksum nel manifest e nel registro protetto
`content/imports/sprint6-protected.json`.

## Metodo

Letto integralmente il testo di Argomento04 (91 pagine) e Introduzione MySQL e
Dbeaver (92 pagine), estratto con pypdf. Renderizzate tutte le **183 pagine** con
PDFium, osservate in 32 tavole numerate; ingranditi anche i riepiloghi dei join,
DDL/vincoli e lo schema NorthWind. File di lavoro in `tmp/pdfs/sprint6/`, esclusi
dall'app. La lettura visiva comprende schermate senza testo estraibile, tabelle,
query in immagine e diagrammi. Nessuna pagina intera è illeggibile; le immagini
dense sono consultabili nell'originale e non vengono ricostruite come script
ufficiali. È revisione tecnica della piattaforma, non approvazione umana.

## Mappa completa: Argomento04 SQL

| Pagine | Contenuto effettivo | Lezione |
|---|---|---|
| 1–3 | Titolo, SQL, DDL/DML | sql-domande |
| 4–8 | Business logic, utenti attivi, abbandono, assunzioni; cenno IA | sql-domande |
| 9–11 | Riferimenti e strumenti, Sailors/NorthWind | sql-domande; strumenti-ambiente |
| 12 | Istanza Sailors in figura | sql-domande; confronto distinto dallo script |
| 13–17 | SELECT/FROM/WHERE, DISTINCT, ordine logico, alias, ORDER BY | sql-select |
| 18–19 | Confronti, BETWEEN, IN, LIKE, NULL, esempi | sql-filtri |
| 20–24 | Estrazione/analisi, COUNT/SUM/AVG/MIN/MAX, DISTINCT | sql-aggregati |
| 25–30 | GROUP BY/HAVING, livelli di aggregazione, valutazione per passi | sql-gruppi |
| 31–40 | Sottoquery, massimi/parità, scalari, IN, indipendenti/correlate, EXISTS | sql-sottoquery |
| 41–42 | ANY/ALL e insieme vuoto | sql-quantificatori, teoria MySQL/MariaDB |
| 43–45 | UNION/ALL, INTERSECT, EXCEPT, posizioni delle sottoquery | sql-insiemi; sql-sottoquery |
| 46–57 | Sottoquery/CTE/tabelle temporanee/viste, durata e limiti | sql-cte |
| 58–62 | Join e prodotto filtrato | sql-join |
| 63–65 | LEFT/RIGHT, conteggi anche zero | sql-outer |
| 66–71 | Anti join e diagrammi riepilogativi | sql-outer |
| 72–76 | CREATE TABLE, vincoli, INSERT | sql-ddl, teoria fuori dal lab |
| 77–84 | Schema, contratto, aggregazioni, riferimenti, sottoquery, insiemi, verifica | sql-domande |
| 85–86 | Separatore ed esempi SELECT/filtro età | sql-select |
| 87–88 | Prenotazioni e barche rosse, duplicati | sql-join |
| 89 | Aritmetica e pattern | sql-filtri |
| 90–91 | Rosso e verde / rosso senza verde | sql-insiemi |

## Mappa completa: Introduzione MySQL e Dbeaver

| Pagine | Contenuto effettivo | Lezione |
|---|---|---|
| 1–3 | Titolo, MySQL client/server, MariaDB | strumenti-ambiente |
| 4–13 | Download e installazione Windows MySQL, schermate | strumenti-ambiente |
| 14–24 | Configurator: dati, rete, account, servizio, permessi, applicazione | strumenti-ambiente |
| 25–34 | Installazione MariaDB, password, servizio, porta | strumenti-ambiente |
| 35–45 | DBeaver, installazione, componenti/cartelle | strumenti-ambiente |
| 46–50 | Lingua, aspetto, funzioni opzionali, statistiche, database demo | strumenti-ambiente |
| 51–55 | CLI, connessione, database, utente/privilegi, tabella, inserimento/file | strumenti-script; sql-ddl |
| 56–60 | Connessione DBeaver e driver JAR | strumenti-script |
| 61–63 | Database, script NorthWind e diagramma | strumenti-script |
| 64–70 | JDBC, URL, driver/classpath, Connection/Properties | strumenti-jdbc |
| 71–74 | Statement/PreparedStatement, DDL e INSERT | strumenti-jdbc |
| 75–78 | ResultSet, query, binding, DELETE | strumenti-jdbc |
| 79–83 | Python DB-API, driver/connessione, errori/chiusura/commit | strumenti-python |
| 84–90 | CREATE/INSERT, parametri, cursor, query e DELETE | strumenti-python |
| 91–92 | Confronto Java/Python e chiusura | strumenti-python |

## Problemi e precisazioni editoriali

| Fonte/pagina | Problema | Trattamento nella piattaforma |
|---|---|---|
| SQL 5 | COUNT(user_id) conta eventi non NULL, non persone uniche | Contratto e identità prima del conteggio; date con orari da precisare |
| SQL 12,19,30 | Istanze illustrate differiscono dallo script; figura con barca 105 o riga aggiuntiva | Nessuna aggiunta al dataset ufficiale |
| SQL 16 | s è alias della tabella ma il richiamo parla di attributo | Distinzione alias sorgente/output |
| SQL 22 | AVG(s.rating) con FROM reserves r | Esempio operativo corretto su Sailors, aggiunta dichiarata |
| SQL 26–28 | Regola GROUP BY rigorosa non coincide con permissività SQLite | Bare columns non certificate dal successo di esecuzione |
| SQL 33,36 | Modello di esecuzione correlata presentato in modo operativo | Dipendenza logica distinta dal piano fisico e dal numero di esecuzioni |
| SQL 41–42 | Quantificatori non disponibili in SQLite; NULL non sviluppati | Tavola di casi e riscrittura limitata a ipotesi esplicite, mai equivalenza generale |
| SQL 49–53 | MONTH senza anno; <2000 in 50/53 contro richiesta >2000 | Non presentate come riscritture equivalenti; correzioni dichiarate |
| SQL 47,56 | Durata tabella temporanea dipende dal prodotto | MySQL: sessione; nessuna cancellazione a ogni commit presunta |
| SQL 57 | Limitazione sulle viste troppo generale | Distinte definizione persistente, materializzazione e costi del piano |
| SQL 60 | LEFT ripetuto nella lista; FULL non portabile al DBMS discusso | Varianti spiegate separatamente; supporto SQLite testato |
| SQL 65 | Conteggio righe di prenotazione descritto come numero di marinai | Distinzione COUNT(r.sid) e COUNT(DISTINCT r.sid) se richieste persone uniche |
| SQL 71 | Venn non esprime molteplicità o schema completo | Affiancate tabelle e casi senza corrispondenza |
| SQL 74–75 | Indici accostati ai vincoli; FK verso Persons(PersonID) con ID nello schema illustrato | Indice distinto da vincolo; niente script copiabile certificato dalla figura |
| SQL 89 | age1=age-5 non è alias portabile | Forma operativa age-5 AS age1 dichiarata |
| SQL 90 | Titolo parla di nomi, query interseca sid | Identità prima dei nomi per non fondere omonimi |
| Strumenti 6–24,68,81 | Versioni e percorsi di schermate | Dati della fonte, nessuna promessa sull'ultima versione o installazione eseguita |
| Strumenti 36/39 | Testo GPL contro schermata Apache License DBeaver | Incoerenza registrata; nessuna prescrizione legale dedotta |
| Strumenti 48–49 | Opzioni AI e statistiche | Non attivate nell'app e non necessarie allo studio |
| Strumenti 63 | Diagramma NorthWind diverso dal dump (es. Picture) | Il dump prevale; FK convenzionali restano aggiunte interpretative |
| Strumenti 67,80 | Indipendenza del codice dal DBMS formulata ampiamente | API comune non rende portabile ogni testo SQL |
| Strumenti 82–84 | Apici tipografici e DATABASET | Non copiati come codice eseguibile |
| Strumenti 83,91 | Chiusura/commit e default autocommit | Chiusura distinta da conferma; impostazioni modificabili, DDL distinto da DML |

Le precisazioni sui comportamenti del motore sono state confrontate con il codice
installato e con [SELECT SQLite](https://www.sqlite.org/lang_select.html),
[sottoquery correlate MySQL](https://dev.mysql.com/doc/refman/8.4/en/correlated-subqueries.html)
e [errori di sottoquery MySQL](https://dev.mysql.com/doc/refman/26.10/en/subquery-errors.html).
Sono riferimenti tecnici aggiuntivi, non materiali attribuiti al docente né risorse
scaricate dall'app durante l'uso. Gli esercizi sono eseguiti sul WASM effettivamente
installato; non è stata eseguita una matrice di versioni MySQL/MariaDB.

## Perimetro e revisione umana

Dodici lezioni SQL e quattro strumenti; tutte needs-review, tre quiz ciascuna.
CTE, insiemi, join, filtri e aggregazioni si esercitano nel lab. DDL/DML, account,
driver, Java/Python e ANY/ALL hanno spiegazioni e attività ragionate ma nessun nuovo
runtime. Le discussioni delle fonti sull'IA non diventano un tutor AI.

La matrice `CONTENT_COVERAGE.md` distingue copertura editoriale da eseguibilità.
Nessuna promessa sulla struttura o completezza dell'esame, nessuna promozione a verified.

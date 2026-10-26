# SQL Lab · Sprint 2

## Motore e architettura

Motore effettivo: SQLite 3.54.1 tramite `@sqlite.org/sqlite-wasm` 3.54.1-build1.
Nessun server MySQL/MariaDB, container, servizio cloud o API AI è necessario.
Monaco e i suoi worker sono compilati localmente; nessuna CDN.

- `SqlExecutionAdapter` separa caricamento, lettura e reset dalla UI.
- `SqliteEngine` usa il parser SQLite tramite prepared statement, un autorizzatore
  con allowlist delle operazioni/funzioni e `sqlite3_stmt_readonly`.
- Il framing lessicale riconosce commenti, stringhe e identificatori; blocca
  statement multipli, NUL e input oltre 20.000 caratteri. Non è il controllo
  strutturale principale: quello è svolto dal parser e dall'autorizzatore SQLite.
- Sono ammesse SELECT e WITH … SELECT. Scritture, DDL, PRAGMA, ATTACH, transazioni,
  accesso allo schema di sistema e funzioni non autorizzate vengono rifiutati.
- Una connessione `:memory:` nuova per ogni query, caricata soltanto con schema e
  seed convertiti. `foreign_keys=ON`, `query_only=ON`, `temp_store=MEMORY` e
  `trusted_schema=OFF`. Nessun riuso del database dei progressi.
- Il worker riceve i byte WASM dal thread principale. Il suo CSP contiene
  `connect-src 'none'` e `worker-src 'none'`; fetch e interfacce di rete vengono
  disabilitati dopo l'inizializzazione. IndexedDB non è disponibile nel worker.
- Le route Next forniscono dati e soluzioni, senza eseguire SQL dell'utente.
  Le soluzioni arrivano soltanto dopo “Verifica” o richiesta esplicita.

## Limiti verificati, senza certificazione assoluta

| Livello | Limite |
|---|---|
| Query | Una sola interrogazione, 20.000 caratteri |
| Tempo SQLite | 1,5 s di default, progress handler ogni 1000 istruzioni |
| Istruzioni | Budget di circa 10 milioni di opcode, anche se prima del timeout |
| Watchdog esterno | Terminazione del worker oltre budget + 1,5 s di margine di caricamento/comunicazione |
| Inizializzazione | Watchdog 10 s |
| Risultato | 500 righe, 64 colonne, 512 KiB circa di valori serializzati |
| Cella | Circa 8 KiB di dati; testi/BLOB grandi mostrati come anteprime dichiarate |
| SQLite | Lunghezza valore 1 MiB, profondità espressioni 100, compound SELECT 20, nessun database allegato o parametro libero |
| Heap SQLite | hard_heap_limit 64 MiB |

Il limite di heap riguarda le allocazioni SQLite, non tutta la memoria JS o
l'intero processo del browser. La visualizzazione di un BLOB grande è limitata,
ma il dato completo rimane nel dataset: `length(Photo)` usa il valore intero.
Un risultato troncato non può produrre un verdetto di correttezza.

Timeout, errore di risorse o pulsante Interrompi chiudono il worker. Una nuova
query lo ricrea; Reset chiude il worker e ricarica l'anteprima. Non elimina
cronologia, completamenti o tentativi. Non esiste una certificazione di sicurezza
assoluta contro difetti di SQLite, WASM o del browser; usare l'app personalmente
sul server loopback come previsto, senza esporla come servizio multiutente.

## Fonti analizzate

Letti e analizzati integralmente i tre file testuali, senza modificarli:
- `Schema per generare DB Sailors.txt`: DDL, 24 righe di dati e due FK.
- `Schema per generare DB NorthWind.txt`: tutte le 3219 istruzioni riconosciute
  dal convertitore (8 CREATE, 8 DROP, 3202 INSERT, un SET), tutti i valori e tipi,
  compresi nove letterali binari esadecimali.
- `Esercizi 1 Sailor.txt`: cinque enunciati originali; nessuna soluzione presente.

Parti pertinenti lette delle dispense:
- `Argomento04 SQL.pdf`, pp. 10–30: strumenti, dataset, SELECT, duplicati,
  filtri, aggregazioni, GROUP BY e HAVING; pp. 58–65: join e alternative;
  pp. 72–84: DDL, vincoli, inserimenti e indicazioni per verificare le query.
- `Introduzione MySQL e Dbeaver.pdf`, pp. 2–3, 26, 36, 52, 54–55, 57, 60–63:
  distinzione client/server, strumenti, comandi e caricamento NorthWind.
- Controllati visivamente schemi/tabelle SQL pp. 12, 14, 16–17, 24, 26,
  28–30, 61, 73–76 e istruzioni/diagramma DBeaver pp. 57, 61–63.

**Differenze delle fonti da non nascondere:** l'istanza Sailors illustrata nelle
slide non coincide in ogni dettaglio con lo script fornito (per esempio nome
della barca 104, maiuscole di nomi; p. 30 mostra anche un'istanza modificata).
Nel laboratorio prevale lo script originale richiesto. Non sono copiati dati
ulteriori dalle immagini. La query esemplificativa a p. 22 ha alias incoerenti
e p. 60 ripete LEFT JOIN: non usate come soluzioni operative certificate.
Book.pdf non è stato estratto.

## Conversione riproducibile

Comando: `npm run sql:convert` (Python standard library, nessuna dipendenza PDF).
Il convertitore accetta soltanto la grammatica riscontrata, fallisce su comandi,
tipi o letterali non riconosciuti e non esegue il dump MySQL. Crea schema e seed
SQLite separati; carica un database temporaneo e confronta ogni campo con i
valori decodificati/normalizzati dell'originale. Verifica integrity_check, chiavi
e conteggi. Il test di riproducibilità ricontrolla gli hash di tutti gli output.

Output per dataset in `content/courses/basi-di-dati/datasets/<id>/`:
`schema.sql`, `seed.sql`, `catalog.json`, `conversion-report.json`.
Il report contiene checksum della fonte, trasformazioni, conteggi, confronti
dei valori, dimensioni e SHA-256 dei BLOB e verifiche aggiuntive dei collegamenti.

### Sailors

| Tabella | Record | Colonne |
|---|---:|---:|
| Sailors | 10 | 4 |
| Boats | 4 | 3 |
| Reserves | 10 | 3 |

PK e FK conservate. Le FK vengono dichiarate nel CREATE perché SQLite non offre
lo stesso ALTER TABLE ADD CONSTRAINT del dump. I genitori vengono popolati prima
delle prenotazioni. Tipi compatibili tramite affinità INT/REAL/TEXT; NOT NULL
esplicito sui componenti di PK. INT evita l'alias rowid/autogenerazione involontaria
di INTEGER PRIMARY KEY per le chiavi senza AUTO_INCREMENT dell'originale.
Data `1998-1-11` normalizzata a `1998-01-11`, registrata nel report, senza cambiare
il giorno rappresentato. Nessun record sintetico nel dataset ufficiale convertito.

### NorthWind

| Tabella | Record | Colonne |
|---|---:|---:|
| categories | 8 | 3 |
| customers | 91 | 13 |
| employees | 9 | 17 |
| order_details | 2155 | 5 |
| orders | 830 | 14 |
| products | 77 | 10 |
| shippers | 3 | 3 |
| suppliers | 29 | 12 |
| **Totale** | **3202** | **77** |

**Importazione dati completa rispetto allo script ricevuto**, non equivalenza
completa del comportamento MySQL. Nessuna riga o colonna eliminata. Nove Photo
binari conservati come BLOB con hash verificati; Image e ImageThumbnail sono
conservate anche quando NULL. PK, chiave UNIQUE e indici KEY tradotti.

Non ci sono dichiarazioni FOREIGN KEY nel dump originale: non vengono inventati
vincoli ufficiali. Otto collegamenti convenzionali (ordini/clienti/dipendenti,
spedizionieri, dettagli/ordini/prodotti, prodotti/categorie/fornitori,
dipendenti/responsabili) sono controllati separatamente: zero riferimenti mancanti.
Il diagramma a p. 63 della dispensa è supporto interpretativo, non una prova che
il dump dichiari tutte quelle FK.

## Compatibilità effettiva

| MySQL/MariaDB | Scelta SQLite / limite |
|---|---|
| INT(n), TINYINT | INT con affinità intera; larghezza e signedness non equivalenti |
| VARCHAR(n), LONGTEXT | TEXT; nessun limite n automaticamente imposto |
| FLOAT, DECIMAL(19,4) | REAL; aritmetica binaria, non decimale esatta |
| DATE, DATETIME | TEXT; date ISO, senza tipo temporale nativo o timezone |
| LONGBLOB, letterali 0x | BLOB con letterali X'…'; nessun binario scartato |
| AUTO_INCREMENT | Non replicato; ID espliciti preservati, lettura soltanto |
| KEY / UNIQUE KEY | CREATE INDEX / UNIQUE |
| Backslash nelle stringhe | Decodifica MySQL, poi quoting SQLite con apici raddoppiati |
| FOREIGN_KEY_CHECKS / DROP | Non eseguiti: si costruisce un DB nuovo |
| SHOW / DESCRIBE / USE | Non supportati nell'editor; usare l'esploratore |
| GROUP BY | SQLite ammette bare columns che MySQL ONLY_FULL_GROUP_BY può rifiutare |
| Collation / LIKE | Non si assume equivalenza di maiuscole, accenti o ordinamento |
| Divisione e funzioni | Semantica SQLite; per frazioni usare cast/REAL quando appropriato |

Il sottoinsieme è dichiarato tramite capabilities e allowlist di funzioni nel
motore. Costrutti MySQL non supportati non vengono tradotti di nascosto. Il
supporto di un operatore SQLite non ne garantisce la disponibilità nel DBMS del corso.

## Esercizi e affidabilità della verifica

I cinque quesiti conservano il testo originale, senza prefissi di commento `#`.
La piattaforma specifica separatamente posizione/numero delle colonne, difficoltà,
argomenti, suggerimenti, interpretazione e soluzione. Tutto rimane needs-review.
La correzione automatica significa confronto deterministico, non approvazione
editoriale o soluzione ufficiale del docente.

Interpretazione degli esercizi 1 e 5: ogni prenotazione pesa una volta nella somma
o media, anche se la stessa persona prenota più volte. È una scelta esplicita
della piattaforma, da revisionare: non si nasconde l'ambiguità dell'enunciato.
L'esercizio 2 conta prenotazioni, il 3 omonimi, il 4 persone per rating.

Cinque fixture per ciascun quesito:
1. Sailors ufficiale convertito.
2. Edges sintetica: 18 anni, età 40, divario 10, rating 5/7, NULL, omonimi,
   più prenotazioni della stessa persona, nomi di barche uguali, barche non prenotate.
3. Stessi valori di edges in ordine di inserimento invertito.
4. Relazioni vuote, schema invariato.
5. Variazione sintetica deterministica con seed 20261024.

Utente e riferimento vengono eseguiti separatamente sullo stesso seed, con DB
nuovi. Confronto per valori e molteplicità (multinsieme), NULL distinto da zero,
testo distinto da numero; interi confrontati esattamente. Valori non interi con
tolleranza relativa 1e-9. Gli alias sono liberi; numero e posizione delle colonne
sono obbligatori. L'ordine delle righe è ignorato nei cinque quesiti perché non
richiesto, ma il comparatore ha test anche per l'ordine obbligatorio.

LIMIT/OFFSET sono disponibili nel laboratorio ma rifiutati nella verifica dei
cinque esercizi: un limite elevato potrebbe passare accidentalmente su fixture
piccole pur non restituendo tutti i gruppi in generale. Query/risultati oltre i
limiti producono esito non conclusivo o errore, mai un superamento parziale.

| Quesito | Errori discriminati, fra gli altri | Limite specifico |
|---|---|---|
| 1 | SUM DISTINCT, soglia >=7, join mancante | Molteplicità per prenotazione scelta dalla piattaforma |
| 2 | >18 invece di >=18, COUNT marinai distinti, minori inclusi | Date normalizzate SQLite, interpretazione per prenotazioni |
| 3 | <=10, omessa verifica omonimi, disuguaglianza invertita | MIN/MAX ignorano NULL; nessuna collation MySQL certificata |
| 4 | >=5, COUNT(age) al posto di COUNT(*), SUM al posto di AVG | Arrotondamenti REAL; persone con età NULL contate |
| 5 | COUNT marinai distinti, >=40, omessa soglia prenotazioni | Media pesata sulle righe di prenotazione |

Per ciascuno sono eseguite due soluzioni con sintassi diversa e tre errori
tipici. Per 2–5 un errore passa sul dataset iniziale ma fallisce sulle fixture.
**Uguaglianza su dati finiti non prova equivalenza generale.** Una query con
bare columns o dipendente da dettagli del motore potrebbe ancora coincidere
sui casi osservati: il feedback non certifica MySQL o correttezza matematica.

## Progressi e backup

IndexedDB v3 aggiunge soltanto sqlHistory. Store e record di v1/v2 preservati.
Tentativi SQL nello store attempts con query, versione esercizio, timestamp,
feedback e stato dettagliato. Il completamento corrente deriva dall'esistenza
di una verifica superata per quella versione, distinto dall'esecuzione libera.
Cronologia libera e tentativi sono visualizzati per gli ultimi 30 record senza
cancellare i precedenti. Reset del DB SQL non li modifica.

Backup v3 contiene anche sqlHistory; importa v1/v2 senza perdita. Fusione atomica
e conferma restano quelle dello Sprint 1. I conflitti di ID bloccano l'importazione.
Nessun contenuto o risultato viene inviato a servizi esterni.

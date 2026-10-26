# Exam Prep — Sprint 5

App 0.6.0. Preparazione personale locale, senza nuove dipendenze, account o servizi.
Nessuna prova ufficiale d'esame è presente nei 13 file inventariati. Le sessioni
sono composizioni Database Academy: non riproducono struttura, voto, durata o
difficoltà dell'esame reale. Non si deducono nuove regole d'esame dalle dispense.

## Analisi iniziale e copertura reale

Letta la documentazione di progetto prima del codice: specifica, AGENTS, inventario,
roadmap, README/avvio, registro degli Sprint 0–4, rapporti delle fonti, contratti
SQL/algebra/ER, guide di accettazione e manutenzione, README/changelog del catalogo.
Verificati manifest v5, file delle attività e correttori effettivamente disponibili.
Tutti i 13 originali ancora presenti e invariati; nessuna nuova estrazione del libro.
Lo Sprint 2 aveva anticipato NorthWind, lo Sprint 4 autorizzato era ER: lo Sprint 5
completa preparazione esame e ricerca, senza riordinare o riscrivere le fonti.

| Modulo | Lezioni / quiz | Pratica disponibile |
| --- | --- | --- |
| Introduzione | 4 / 12 | Quiz |
| Modello relazionale | 5 / 15 | Quiz |
| Algebra | 9 / 27 | 18 automatici su fixture, 7 guidati |
| SQL | 0 / 0 | 5 automatici Sailors; NorthWind solo laboratorio libero |
| ER | 8 / 24 | 7 attività guidate, validatore strutturale |
| Strumenti MySQL/MariaDB/DBeaver | 0 / 0 | Materiale inventariato, nessuna attività Exam Prep |

Totale: **115 attività** (78 quiz, 5 SQL, 25 algebra, 7 ER). Tutte needs-review,
zero nuove verified. Le difficoltà esistenti sono 33 intermedie e 4 avanzate;
i 78 quiz non hanno classificazione editoriale, mostrata come **non-classificato**.
Nessuna attività base: richiederla produce carenza esplicita. La classificazione
già esistente non è una misura calibrata della difficoltà d'esame.

Lacune: lezioni SQL dedicate, attività sugli strumenti, esercizi NorthWind, correzione
semantica ER generale, costrutti algebra fuori dal subset, prove ufficiali. Il ripasso
SQL collega al lab invece di inventare una lezione. Per gli altri moduli collega
alle lezioni disponibili; i collegamenti di algebra/ER sono per modulo e possono
essere più ampi del singolo concetto. Nessuna pretesa di copertura completa dell'esame.

## Generatore e archivi

`lib/exam/generator.ts`: versione 1; seed testuale FNV-1a, xorshift32 con operazioni
intere e Fisher–Yates. Ordinamento iniziale per chiave ASCII, quote esatte per
difficoltà, filtri modulo/tipologia. Nessun duplicato della stessa attività nel
piano; 1–30 attività, timer 0–240 minuti. Quote e totale devono coincidere; carenze
interrompono la generazione senza sostituzioni o domande inventate. Non è imposta
una distribuzione per tipologia: gli elementi sono estratti dal pool selezionato.

`scripts/build-exam-catalog.mjs`, richiamato prima di dev/build, valida i contenuti
e salva un archivio JSON indirizzato da SHA-256 in `content/exam/archives/`.
Contiene copie degli enunciati, riferimenti, opzioni, contratti, soluzioni e fixture.
`current.json` indica il catalogo corrente; **gli archivi precedenti non vengono
cancellati o sovrascritti**. Hash e Zod verificati in lettura. Il manifest didattico
v5 e i suoi ID restano invariati: nessuna nuova domanda è stata generata.

Il piano salvato in IndexedDB contiene configurazione, generatorVersion, archiveId,
ordine e copie pubbliche delle attività. Gli aggiornamenti del catalogo non lo
rigenerano. Per spostare il progetto conservare anche `content/exam/archives/`:
il backup progressi non contiene soluzioni/fixture. Se manca un archivio, le risposte
restano leggibili e la rivalutazione fallisce esplicitamente, senza usare in silenzio
la versione corrente. I motori eseguibili restano quelli installati: non si archiviano
eseguibili storici né si promette identico comportamento dopo future modifiche al motore.

## Sessione e valutazione

Allenamento: feedback su richiesta per singola risposta. Simulazione: nessuna
richiesta di valutazione o invio di soluzioni durante lo stato attivo; correzione
solo dopo conferma o scadenza. La route rifiuta una simulazione attiva e verifica
che gli snapshot corrispondano all'archivio. Non è un sistema anti-cheat: il proprietario
controlla file, browser e API locali e può consultare altre pagine.

Quiz: `gradeQuiz` esistente, confronto esatto delle opzioni. SQL: `gradeSql` e
BrowserSqlAdapter esistenti, fixture isolate e limiti invariati. Algebra: AlgebraAdapter
e relativo worker/correttore esistenti. Nessuna esecuzione SQL lato server e nessuna
alterazione dei correttori. ER: editor con componenti/comandi condivisi dal lab,
`validateEr` e osservazioni di proprietà esistenti; riferimento e feedback dopo
l'invio in allenamento o alla conclusione in simulazione. Algebra guidata: riflessione.

Esiti distinti: risposta corretta/errata (quiz), coerente/non coerente sulle fixture,
completata manualmente, inconclusiva, senza risposta. Sintassi, semantica, cancellazioni,
risorse e timeout mantengono il dettaglio e non producono una coerenza sulle fixture.
La verifica finita non dimostra equivalenza generale; completamento ER non certifica
correttezza semantica. Nessun voto complessivo, soglia d'esame o punteggio arbitrario.
Le soluzioni sono riferimenti Database Academy needs-review, non del docente.

Le risposte sono bloccate alla conclusione; rimangono navigazione e revisione con
fonti e lezioni. Una rivalutazione finale ritenta soltanto risultati mancanti o
inconclusivi; non incrementa artificialmente i quiz già valutati. Il riferimento
è mostrato in un dettaglio espandibile. L'editor SQL Exam Prep è testuale; per
esecuzione libera, Monaco e anteprime usare SQL Lab. Il lab originario resta intatto.

## Timer e persistenza

IndexedDB e backup **v5** aggiungono examPlans, examRuns e studyPlans, senza rimuovere
store precedenti. Import v1–v4 aggiunge array vuoti; vecchi ID/versioni restano.
Piani Exam Prep immutabili e revisioni append-only di risposte e piani di studio;
conflitti immutabili abortiscono l'intera importazione. Scritture di sessione
serializzate e controllo della revisione attesa: due schede non si sovrascrivono.

Le modifiche ravvicinate sono raggruppate per 350 ms, poi le risposte si salvano
automaticamente con stato visibile, evitando una revisione per ogni carattere.
Conclusione e valutazione attendono lo svuotamento del buffer di salvataggio.
Attendere “Risposte salvate in locale” prima di chiudere; in caso di errore compare
un avviso. Le operazioni manuali del piano si salvano al cambio di checkbox o
all'uscita dal campo di giorno/minuti/nota. Nessuna eliminazione automatica dello storico.
Non sono replicati tentativi Exam Prep negli store Practice, per evitare doppio conteggio:
la dashboard avanzata li aggrega, gli storici dei singoli lab restano distinti.

Il timer è una scadenza assoluta salvata; non salva un contatore ogni secondo.
Continua fuori pagina e dopo reload, non ha pausa. Se l'app era chiusa conclude
alla riapertura dopo aver rilevato la scadenza. Alla conclusione congela il residuo.
Il timer non è resistente alla manipolazione dell'orologio del dispositivo.

Backup massimo 5 MB, con anteprima/conferma e fusione conservativa. L'esportazione
ora rifiuta un archivio oltre il limite invece di creare un file non reimportabile;
non tronca o elimina dati. Revisioni numerose/diagrammi grandi possono raggiungere
questo limite: manca il backup suddiviso. Origine, porta e profilo delimitano lo storage.

## Ripasso e statistiche

Regole pubbliche e deterministiche: ultima risposta errata +5 per domanda, ultimo
esercizio del modulo non coerente +3, lettura corrente non completata +2, ultima
visita più vecchia di 7 giorni +1. Ogni suggerimento mostra motivazioni. La visita
è solo una visita, non misura della memoria; i punti ordinano, non danno un voto.
Gli argomenti con segnali di difficoltà mostrano separatamente ultimi quiz errati,
verifiche non coerenti e inconclusive, compreso SQL senza lezioni dedicate.

Dashboard: letture correnti, tentativi/domande quiz uniche, percentuale quiz con
denominatore esplicito, tentativi/esercizi SQL unici, tentativi/attività algebra uniche,
attività ER con almeno un completamento manuale, simulazioni e allenamenti conclusi.
Risultati storici per le versioni salvate, con revisioni deduplicate per sessione,
attività e timestamp della valutazione. Le ripetizioni volontarie contano come
tentativi; una percentuale alta dopo ripetizioni non dimostra padronanza.
Tabella degli ultimi 30 giorni con dati: quiz e fixture separati, date UTC. Nessun
indice aggregato di preparazione o previsione di voto. Attività fuori catalogo restano
nel backup; la classificazione per modulo può non essere disponibile per vecchi ID.

## Ricerca e piano di studio

Ricerca client locale a `/search` e Exam Prep: titoli/testi redatti delle lezioni,
concetti/moduli, sezioni/definizioni, enunciati SQL/algebra/ER, metadati delle fonti.
Accenti e maiuscole normalizzati, tutti i termini richiesti, titolo prioritario,
massimo 40 risultati con contesto e collegamento. Nessuna soluzione quiz indicizzata,
nessun testo integrale PDF e **Book.pdf escluso anche dai risultati delle fonti**.

Piano: data obiettivo scelta dall'utente (oggi–366 giorni), giorni della settimana,
15–240 minuti al giorno, moduli prioritari. Distribuisce 26 lezioni e 37 esercizi,
con stima dichiarata di 30 minuti per unità, frazionabile sui giorni disponibili.
Le letture sono ordinate anche usando i suggerimenti locali; la priorità manuale
prevale. Capacità insufficiente: residui espliciti per tipo, ID e minuti.
Giorno, durata, note e spunta sono modificabili, con nuove revisioni. Le modifiche
manuali possono oltrepassare budget/data: richiedono controllo umano. Nessuna data
ufficiale d'esame dedotta o calendario esterno.

## Verifica e limiti

Procedura in `SPRINT5_ACCEPTANCE.md`, risultati effettivi in IMPLEMENTATION_LOG.md.
Chromium desktop e mobile emulato; niente certificazione Safari/dispositivo fisico.
Nessun servizio esterno o PWA senza server; nessuna AI. Tutti i contenuti restano
da revisione umana. Nessun ulteriore sprint iniziato.

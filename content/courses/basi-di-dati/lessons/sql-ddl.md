---
{
  "id": "sql-ddl",
  "moduleId": "sql",
  "slug": "sql-ddl",
  "title": "Schemi SQL, vincoli e popolamento",
  "mdxPath": "lessons/sql-ddl.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "sql-source",
      "file": "Argomento04 SQL.pdf",
      "pageStart": 72,
      "pageEnd": 76,
      "section": "Schemi SQL, vincoli e popolamento"
    }
  ],
  "concepts": [
    "CREATE TABLE",
    "vincoli",
    "INSERT",
    "tipi"
  ],
  "description": "Percorso ragionato: schemi sql, vincoli e popolamento, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare CREATE TABLE distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 38,
  "prerequisites": [
    "sql-outer"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/sql-ddl.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e confine del laboratorio

Le pp. 72–76 introducono DDL e popolamento. CREATE TABLE definisce attributi, tipi e vincoli; INSERT aggiunge dati a una struttura esistente. Questi comandi sono da studiare e usare soltanto in un DBMS locale separato: SQL Lab ammette letture su dataset predisposti e rifiuta ogni modifica. Il pulsante Reset ripristina il motore effimero, non autorizza ad aggirare la politica di sola lettura.

Un tipo descrive valori e operazioni ammesse secondo il DBMS. VARCHAR(n), INT e DECIMAL hanno regole che non coincidono automaticamente con le affinità SQLite. Nella conversione NorthWind DECIMAL diventa REAL e le date diventano testo ISO: i dati utilizzabili sono conservati, ma non si riproduce ogni controllo del motore originale. Leggere lo schema convertito richiede quindi anche leggere il rapporto di compatibilità.

## Vincoli: domande differenti

| Costrutto | Domanda |
|---|---|
| NOT NULL | Il valore deve essere presente? |
| UNIQUE | Le combinazioni devono essere distinte? |
| PRIMARY KEY | Quale identificatore primario non nullo scegliamo? |
| FOREIGN KEY | Il riferimento deve trovare una destinazione? |
| CHECK | Il predicato sul dato deve essere soddisfatto? |
| DEFAULT | Quale valore usare se non specificato? |

DEFAULT non dimostra che il valore soddisfi gli altri vincoli. Un indice non è automaticamente una regola semantica: CREATE INDEX, elencato insieme ai vincoli nelle slide, può avere uno scopo di accesso. UNIQUE INDEX aggiunge una proprietà differente. Non scegliere vincoli soltanto per rendere il DDL più lungo: ciascuno deve derivare dal requisito.

## Esempio illustrativo, non eseguibile in SQL Lab

```sql
CREATE TABLE IscrizioneDemo (
  studente_id INT NOT NULL,
  corso_id INT NOT NULL,
  voto INT,
  PRIMARY KEY (studente_id, corso_id),
  CHECK (voto >= 18 AND voto <= 30)
);
```

La primaria composta impedisce la ripetizione della stessa coppia, non due corsi diversi dello stesso studente. Non è stato dichiarato alcun riferimento a una tabella Studente o Corso: il frammento illustra primaria e controllo locale e non viene presentato come schema universitario completo. Il nome Demo e i dati dell'attività sono aggiunte della piattaforma.

Un voto NULL può soddisfare il CHECK perché il predicato sconosciuto non equivale a FALSE. Se il requisito esige un voto presente, serve anche NOT NULL. La frase «CHECK impone una condizione» non basta quindi a dedurre obbligatorietà. Per una primaria, tutti i componenti devono essere non NULL nel modello del corso; lo schema convertito rende la non nullità esplicita per evitare particolarità storiche di SQLite.

La figura a p. 75 riferisce Persons(PersonID), mentre gli altri frammenti mostrano ID: il riferimento va controllato contro lo schema effettivo. Non presentiamo questi frammenti come uno script completo verificato.

## Inserire esplicitando le colonne

```sql
INSERT INTO IscrizioneDemo (studente_id, corso_id, voto)
VALUES (1, 10, 28);
```

È ancora codice illustrativo fuori dal lab. La lista delle colonne chiarisce l'associazione con i valori e riduce la dipendenza dall'ordine complessivo dello schema. Senza lista devi fornire i valori nell'ordine previsto e considerare le colonne eventualmente omesse secondo il DBMS. Non scambiare la stringa 'NULL' con il valore SQL NULL; non aggiungere una seconda riga con stessa coppia pensando che il voto diverso cambi la primaria.

## Esercizio guidato e compatibilità

Su carta valuta tre inserimenti: (1,10,28), una seconda (1,10,30) e (1,11,NULL). Il secondo viola l'unicità della coppia; il terzo non viola il CHECK mostrato perché voto non è obbligatorio. Se aggiungessi una FK, controlla prima l'esistenza dei genitori. Non modificare gli script originali per fare la prova; per l'eventuale esecuzione esterna usa un database dimostrativo separato.

## Riepilogo ed errori comuni

Non assumere equivalenza completa tra MySQL e SQLite, non confondere DEFAULT e CHECK, indice e chiave, vincolo di riga e vincolo aggregato. Un CHECK su una sola riga non esprime automaticamente limiti sulla somma di molte righe. Il percorso collega requisiti, dichiarazione e verifica degli stati; non offre un laboratorio DDL/DML né un certificato di portabilità tra motori.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Argomento04 SQL.pdf, pp. 72–76](/sources/sql-source#page=72).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

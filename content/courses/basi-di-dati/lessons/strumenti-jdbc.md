---
{
  "id": "strumenti-jdbc",
  "moduleId": "strumenti",
  "slug": "strumenti-jdbc",
  "title": "JDBC: connessioni, parametri e risultati",
  "mdxPath": "lessons/strumenti-jdbc.md",
  "version": 1,
  "status": "needs-review",
  "sourceRefs": [
    {
      "sourceId": "tools-source",
      "file": "Introduzione MySQL e Dbeaver.pdf",
      "pageStart": 64,
      "pageEnd": 78,
      "section": "JDBC: connessioni, parametri e risultati"
    }
  ],
  "concepts": [
    "JDBC",
    "PreparedStatement",
    "ResultSet",
    "parametri"
  ],
  "description": "Percorso ragionato: jdbc: connessioni, parametri e risultati, esempi, casi limite e compatibilità dichiarata.",
  "objectives": [
    "Spiegare JDBC distinguendo definizione e uso pratico.",
    "Prevedere risultati, casi mancanti ed errori degli esempi.",
    "Riconoscere ciò che è eseguibile in SQLite e ciò che richiede un ambiente esterno."
  ],
  "order": 41,
  "prerequisites": [
    "strumenti-script"
  ],
  "relatedLessonIds": [],
  "quizPath": "quizzes/strumenti-jdbc.json"
}
---
> **Provenienza e revisione.** Rielaborazione Database Academy delle pagine indicate nelle fonti. Spiegazioni, tabelle sintetiche, esempi adattati, esercizi guidati e quiz sono aggiunte della piattaforma, non soluzioni attribuite al docente. Stato: needs-review.

## Definizione e architettura

JDBC è l'API Java per accedere a database, introdotta alle pp. 64–78. Un'applicazione usa interfacce come Connection, Statement e ResultSet; un driver concreto realizza la comunicazione con il DBMS. Connector/J è il driver discusso per MySQL. L'API comune riduce differenze nel codice di accesso, ma non rende portabile ogni testo SQL, tipo o proprietà della connessione.

L'URL jdbc:mysql://host:porta/database identifica protocollo, destinazione e database. Le credenziali vengono fornite separatamente o tramite proprietà. Il driver deve essere disponibile nel classpath o nelle dipendenze del progetto Java. I numeri di versione nella p. 68 descrivono l'esempio della dispensa: non sono qui certificati come ultima versione e non vengono installati dalla piattaforma.

## Ciclo di una richiesta

La connessione rappresenta una sessione con il server. Lo statement descrive o prepara un comando. executeQuery restituisce un ResultSet per una SELECT; executeUpdate restituisce un conteggio per operazioni di modifica appropriate. Il cursore del ResultSet parte prima della prima riga: next() deve riuscire prima di leggere le colonne. Quando next() restituisce false, non resta un'altra riga da elaborare.

| Oggetto | Responsabilità |
|---|---|
| Connection | Sessione e transazioni |
| PreparedStatement | SQL con parametri associati |
| ResultSet | Scorrimento delle righe risultanti |
| Driver | Implementazione del collegamento JDBC |

## Esempio illustrativo Java, fuori da SQL Lab

```java
String sql = "SELECT id, name FROM student WHERE surname = ?";
try (PreparedStatement st = conn.prepareStatement(sql)) {
  st.setString(1, surname);
  try (ResultSet rs = st.executeQuery()) {
    while (rs.next()) {
      System.out.println(rs.getInt("id") + " " + rs.getString("name"));
    }
  }
}
```

L'esempio presuppone una Connection conn aperta e la tabella student delle pp. 72–77. Non è eseguibile nell'editor SQL, non usa lo schema Sailors e non è un nuovo programma fornito dal docente. La forma try-with-resources è una spiegazione aggiuntiva per chiudere risorse anche in caso di eccezione. La connessione va gestita dal livello che ne definisce la durata.

## Parametri: valori, non pezzi di grammatica

Il punto interrogativo è un parametro di valore; setString(1, surname) associa il primo parametro, contando da uno. Non mettere il segnaposto tra apici e non costruire il testo concatenando valori dell'utente. Un cognome con apostrofo deve essere trattato come dato. Un parametro non sostituisce invece un nome di tabella o una clausola ORDER BY completa: la struttura del comando va decisa dal programma.

La preparazione non rende qualsiasi operazione consentita dal requisito e non assegna privilegi nuovi all'utente del database. Previene la confusione tra valori e sintassi quando usata correttamente; non sostituisce validazione applicativa, gestione degli errori e autorizzazioni. Nel laboratorio i parametri non associati sono rifiutati perché l'interfaccia non offre binding: questo non significa che JDBC li rifiuti.

## Risultati, NULL e transazioni

I getter leggono per nome o indice; gli indici JDBC iniziano da uno. Un getter numerico primitivo può restituire zero per SQL NULL: usa wasNull() o una lettura appropriata se la distinzione conta. Non dedurre «valore zero» senza verificare informazione mancante. La SELECT deve mantenere coerente l'ordine delle colonne quando si leggono indici.

Le connessioni JDBC sono normalmente inizialmente in autocommit; se il programma lo disattiva, deve decidere commit o rollback. Non è una proprietà immutabile di ogni sessione. La cancellazione mostrata a p. 78 è una modifica effettiva sul database esterno; non viene eseguita dalla piattaforma e non si prova sugli originali.

## Riepilogo, errori ed esercizio guidato

Traccia il ciclo con zero, una e due righe: quante volte riesce next()? Poi sostituisci surname con un cognome contenente apostrofo e spiega perché il valore rimane un parametro. Distingui errore di driver, connessione e SQL. Non leggere prima di next(), non dimenticare chiusure e non confondere executeQuery con executeUpdate. SQL Lab conserva soltanto il ruolo di ambiente SQL locale: non aggiunge Java, driver o accessi di rete.

## Percorso visivo

```diagram
Domanda e schema → Operazione e ipotesi → Risultato previsto → Prova e controesempi
```

## Fonti e autoverifica

[Introduzione MySQL e Dbeaver.pdf, pp. 64–78](/sources/tools-source#page=64).

Svolgi le tre domande qui sotto dopo aver motivato la risposta. Il completamento della lettura non certifica il superamento del quiz.

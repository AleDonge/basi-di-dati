# ER Lab — modello, interazione e limiti

Sprint 4, versione app 0.5.0. Nessuna dipendenza aggiunta: SVG React locale con
modello semantico dedicato. Evita la traduzione forzata del corso in un modello
grafico generico e mantiene controlli HTML alternativi ai gesti. Nessun servizio esterno.

## Architettura e formati

`lib/er/model.ts`: Zod strict, diagramma **schemaVersion 1**. Semantica separata
da `layout.positions/viewport` e da `metadata` (ID stabile, titolo, revisione,
date, notazione unitn-er-v1, needs-review). Entità, attributi con proprietario e
dominio, identificatori con componenti e tipo primary/candidate/partial,
associazioni, partecipazioni con ruolo/min/max, generalizzazioni con superclasse,
sottoclassi/disgiunzione/copertura; note libere per requisiti non rappresentabili.
Gli ID sono unici nel documento. Le revisioni mantengono gli stessi ID semantici.

Il formato può contenere una bozza strutturalmente incompleta: riferimenti,
nomi e cardinalità sono analizzati dal validatore, senza impedire di salvare il
lavoro da correggere. Tipi, dimensioni, versioni future, campi sconosciuti e ID
duplicati vengono invece rifiutati. JSON diagramma massimo 1 MB; limiti: 60
entità, 150 attributi, 100 identificatori, 60 associazioni, 180 partecipazioni,
30 gerarchie; posizioni finite entro ±5000. `migrateDiagram` riconosce v1 e
rifiuta versioni future; il punto di migrazione è esplicito, senza conversioni inventate.

`commands.ts`: comandi puri, cancellazioni a cascata, storia in memoria di 40
azioni, undo/redo; modificare dopo undo elimina il ramo futuro. Le eliminazioni
prunano i riferimenti e conservano eventuali identificatori incompleti affinché
il validatore segnali la correzione necessaria. La storia non è un archivio permanente.

`components/er/diagram.tsx` disegna soltanto il modello; `canvas.tsx` gestisce
selezione, trascinamento, zoom e panoramica; `properties.tsx` offre nomi,
coordinate e proprietà con controlli HTML. `workspace.tsx` orchestra comandi,
validazioni, versioni, importazione e riferimenti richiesti esplicitamente.
Markdown e JSON restano in `content/courses/basi-di-dati/`, fuori da React.

## Uso e accessibilità

Creare entità/associazioni con i pulsanti, selezionare un proprietario e aggiungere
attributi. Nel pannello di un'entità selezionare uno o più componenti e aggiungere
l'identificatore. Collegare entità e associazione tramite i due menu e il pulsante
di partecipazione; selezionare la partecipazione per modificare ruolo/min/max.
Per ISA scegliere una superclasse e le sottoclassi, quindi D/O e copertura.

Nessuna operazione essenziale richiede trascinamento: selettore degli elementi,
coordinate X/Y, pulsanti di zoom/panoramica e controlli di proprietà sono usabili
da tastiera. I nodi sono selezionabili con Invio/Spazio. Sul mobile il canvas
mantiene una vista ampia scalata; i pannelli si dispongono verticalmente. La
leggibilità di modelli grandi richiede zoom e posizionamento manuale. Nessun
layout automatico o instradamento anticolisione; etichette molto lunghe sono
abbreviate nel canvas e complete nel pannello/titolo accessibile.

## Validazione e feedback

`lib/er/validation.ts` è deterministico. Errori: nomi vuoti, riferimenti mancanti,
identificatori vuoti o su proprietario diverso, primaria mancante nelle entità
forti non sottoclasse, cardinalità negative/invertite, associazioni con meno di
due partecipazioni, ricorsioni prive di ruoli distinti, entità deboli senza chiave
parziale/proprietario identificante obbligatorio, gerarchie cicliche o inconsistenti.
Avvertimenti: nomi duplicati, posizioni mancanti e convenzioni sospette.
Suggerimenti: domini non documentati e diagramma vuoto. Verifiche manuali:
interpretazione dei requisiti, identità debole, ereditarietà e semantica n-aria.

In assenza di errori strutturali mostra:
**Validazione strutturale superata. La correttezza semantica richiede una verifica ulteriore.**
Anche un modello vuoto o incompleto rispetto ai requisiti può non avere errori
strutturali: avvisi e suggerimenti non diventano una certificazione.

`lib/grading/er.ts` osserva soltanto proprietà esplicite dichiarate nell'attività:
nomi di entità, attributi e min/max delle partecipazioni. Il confronto dei nomi
ignora maiuscole/minuscole ma non inferisce sinonimi; modelli alternativi possono
essere validi. Ogni osservazione resta manuale, mai passed/failed. Nessun confronto
del JSON con una soluzione, nessuna equivalenza semantica generale, nessuna AI.

## Persistenza e backup

**Salvataggio esplicito** con “Salva versione ER”, non autosalvataggio del canvas.
Il banner segnala modifiche non salvate; il browser avvisa in uscita/richiesta di
ricaricamento. La navigazione interna non è bloccata: salvare prima di cambiare
pagina. Ogni salvataggio crea una revisione immutabile in IndexedDB v4, store
`erDiagrams`: diagramma, date, esercizio/versione facoltativi, risultato della
validazione e completamento manuale facoltativo. L'assegnazione della revisione
è atomica anche tra schede. Sono mostrati gli ultimi 50 record del contesto;
le versioni precedenti rimangono nel database e nel backup. Nessuna eliminazione
automatica di diagrammi o dei dati precedenti.

Aprire una revisione richiede conferma e la rende modificabile; salvando si crea
la revisione successiva. Reset, importazione e apertura non cancellano l'archivio,
ma sostituiscono l'editor dopo anteprima/conferma esplicita. Importare un diagramma
lo duplica con nuovo ID di documento, evitando sovrascritture accidentali.

Backup progressi v4, massimo 5 MB, contiene letture/quiz/tentativi SQL e algebra,
cronologia SQL e tutte le revisioni ER. Migrazione v1/v2/v3 aggiunge lo store/array
senza cancellare nulla; ID fuori catalogo restano. Importazione atomica per fusione,
con conflitti immutabili e revisioni duplicate rifiutati. La copia JSON di un
diagramma non sostituisce il backup dell'intero archivio. I due formati sono
distinti e validati. Storage legato a origine/porta/profilo: usare sempre
`http://127.0.0.1:3000`. Nessuna sincronizzazione cloud.

## Limiti dichiarati

Aggregazione è studiata e guidata, non editabile; attributi solo semplici.
Non si verificano tutte le dipendenze n-arie, la sufficienza di una chiave nel
mondo reale, la completezza dei requisiti o l'equivalenza di due progetti.
Gli identificatori candidati sono gestiti nel pannello; il canvas sottolinea la
primaria e tratteggia la parziale. Tutte le soluzioni sono aggiunte Database Academy
needs-review. Nessuna conversione ER→SQL o funzionalità dello Sprint 5.

La suite browser usa Chromium desktop e mobile emulato; nessuna prova su telefono
fisico, Safari, lettori di schermo reali o certificazione universale di accessibilità.
Le richieste osservate nei percorsi testati sono esclusivamente locali; il server
locale resta necessario anche senza Internet.

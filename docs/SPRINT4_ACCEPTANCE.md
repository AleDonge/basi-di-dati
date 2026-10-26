# Accettazione manuale Sprint 4

```powershell
npm ci
npm run build
npm start
```

Aprire http://127.0.0.1:3000/er-lab nello stesso profilo usato per gli altri progressi.

1. In Learn aprire le otto lezioni ER. Controllare indice, diagrammi, esempi, quiz
   e collegamenti PDF con pagina precisa. Tutti i contenuti devono dire needs-review.
2. Nel lab creare CLIENTE e ORDINE; aggiungere un attributo a ciascuno e definire
   le chiavi dal pannello dell'entità. Creare EFFETTUA, aggiungere due partecipazioni
   usando i menu, porre CLIENTE (0,N) e ORDINE (1,1). Controllare freccia verso il
   rombo e linea spessa per ORDINE; confrontare la legenda con le dispense.
3. Rinominare, muovere da canvas e coordinate, zoomare, panoramica, annullare e
   ripristinare. Provare tutto con Tab/Invio senza trascinamento, anche su mobile.
4. Validare: verificare il messaggio che richiede revisione semantica. Cancellare
   una chiave o invertire min/max e osservare errori; correggere o annullare.
5. Salvare la versione 1, modificare note e salvare la 2. Ricaricare, aprire la 1
   accettando la sostituzione dell'editor, modificarla e salvare: nuova versione 3,
   nessuna precedente cancellata. Salvare sempre prima della navigazione interna.
6. Esportare il diagramma JSON. Importare un file non valido: lavoro invariato.
   Importare quello valido: anteprima, conferma richiesta, copia con nuovo ID.
   Provare reset e annullamento della conferma; l'archivio deve restare.
7. In Practice aprire le sette attività ER. Distinguere domande delle slide e
   attività originali; controllare suggerimenti, schema iniziale, verifica
   strutturale, proprietà parziali e riferimento solo su richiesta. Il caso
   aggregazione dichiara che il costrutto non è editabile. Il completamento è manuale.
8. Completare una lettura, un quiz e tentativi SQL/algebra. Salvare un diagramma ER;
   in Impostazioni esportare il backup v4. In un profilo browser separato importarlo
   con anteprima e conferma; verificare tutti i dati e modificare ancora il diagramma.
   Non cancellare il proprio archivio senza una copia di backup verificata.
9. Con DevTools/Network controllare assenza di richieste esterne durante questi
   percorsi. Dopo installazione/build provare con Internet disconnesso e server locale acceso.

Verifiche automatizzate (fermare un server precedente sulla porta 3000):

```powershell
npm run lint
npm run typecheck
npm test
npm run test:sql-import
npm run build
npm run test:e2e
```

Le prove di migrazione aprono database isolati v3 e mantengono Learn, quiz, SQL e
algebra, poi ripristinano revisioni ER modificabili. Non toccano il profilo personale.
Risultati effettivamente eseguiti in `IMPLEMENTATION_LOG.md`. Fermarsi allo Sprint 4.

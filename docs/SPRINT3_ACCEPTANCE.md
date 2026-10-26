# Verifica manuale · Sprint 3

Installazione: `npm ci`. Avvio sviluppo: `npm run dev`.
Produzione: `npm run build`, poi `npm start`.
Aprire http://127.0.0.1:3000/algebra-lab con server locale acceso.
Worker e asset sono preparati automaticamente dai pre-script; nessuna CDN.

1. Controllare il subset dichiarato e aprire “Grammatica, precedenza e limiti”.
   Espandere “Schemi e dati iniziali”: Sailors/Boats/Reserves hanno 10/4/10 tuple.
2. Eseguire `π_sname(σ_age>30(Sailors))`, anche con Ctrl/⌘+Invio.
   La notazione matematica deve essere leggibile. Selezionare i nodi:
   Sailors mostra 10 tuple e 4 attributi; σ mostra 7 tuple/4 attributi;
   π mostra 6 nomi distinti. L'albero si legge dalla radice, il calcolo dal basso.
3. Cambiare >30 in >35: eseguire e osservare risultati realmente differenti.
   Selezionare la foglia, verificare che i dati ufficiali non siano cambiati.
4. Eseguire `π_sname(Sailors)`: nove nomi, non dieci, per i due Horatio.
5. Provare unione/differenza/intersezione sui sid, per esempio:
   `π_sid(Sailors) − π_sid(Reserves)` restituisce sei sid senza prenotazioni.
6. Eseguire `Sailors × Boats`: 40 tuple. Provare `Sailors × Sailors`:
   errore semantico; usare `ρ_A(Sailors) × ρ_B(Sailors)` per distinguere le copie.
7. Confrontare `Sailors ⋈ Reserves` e
   `Sailors ⋈_{Sailors.sid=Reserves.sid} Reserves`: stesse coppie, schema diverso;
   il secondo conserva entrambe le colonne sid. Un `π_sid` non qualificato sul
   theta join deve segnalare ambiguità.
8. Scegliere l'esempio guidato divisione: ispezionare il divisore e il dividendo.
   Poi scegliere quello delle due barche: osservare la rinomina e il self-join.
9. Provare `π_sname(Sailors` (sintassi), `σ_{assente=1}(Sailors)` (semantica),
   `Sailors ∪ Boats` (schemi incompatibili), `Sailors ⟕ Boats` (non supportato).
   Nessuno di questi deve produrre un risultato corretto o alterare i dati.
10. `π_age(σ_{age>100}(Sailors))` deve mostrare relazione vuota con schema age.
    Reset algebra azzera espressione/risultati, conservando dati e tentativi.
11. Practice: scegliere Q2 Sailors, provare la risposta errata verde invece di
    rossa. Può coincidere sullo script, ma la fixture aggiuntiva la distingue:

```text
π_{sname}(σ_{color='green'}(Boats) ⋈ Reserves ⋈ Sailors)
```

12. Sostituire green con red, poi “Verifica algebra”: coerente sulle cinque fixture.
    Leggere il limite: non dimostra equivalenza generale. Ricaricare e trovare
    il tentativo con espressione, data ed esito. “Esegui” non salva un superamento.
13. Q4: intersecare prima i sid per non unire persone omonime. Aprire Q4bis e
    confrontare il ragionamento con il riferimento su richiesta.
14. Selezionare Impiegati nel laboratorio. Leggere l'etichetta “righe sintetiche”
    e la convenzione sulle unità. Eseguire `π_{Matricola,Cognome}(Impiegato)`:
    sei persone nella demo. Schema della scansione, dati della piattaforma.
15. Aprire Scheda Q9 o Q10: nessun pulsante di correzione automatica. Scrivere
    una riflessione, salvarla, ricaricare. Il tentativo è guidato e non conta
    fra le verifiche superate. Leggere ambiguità monetarie e dipartimenti vuoti.
16. Aprire una delle 18 lezioni: fonti cliccabili, tabelle, formule, tre quiz,
    riepilogo e riferimenti. Le nove nuove lezioni restano needs-review.
17. Verificare una vecchia lezione e una query SQL. Esportare dalle Impostazioni:
    JSON v3 con tentativi SQL/algebra, quiz, letture e cronologia SQL. Importare
    con anteprima e conferma in un profilo browser separato; non cancellare i dati
    principali. Un conflitto di ID deve bloccare l'import senza sovrascrivere.
18. Ridurre a 390 px: testo e controlli leggibili, tabelle e notazione scorrono
    nel proprio contenitore. Tab esce dall'editor e raggiunge Esegui. I pulsanti
    degli operatori inseriscono alla posizione corrente; albero usabile da tastiera.
19. Network: nessuna origine esterna; worker `/algebra/algebra-worker.js` con
    CSP connect-src none. L'assenza di Internet non deve interrompere il server
    locale, che deve rimanere acceso. Nessuna PWA senza server.
20. Espressioni eccessive falliscono con limite di risorse, senza risultato
    parziale. Interrompi termina il worker; una richiesta successiva ne crea uno
    nuovo. Nei test il watchdog viene verificato anche con un worker volutamente
    bloccato tramite mock, per controllare che la UI recuperi.

Comandi di verifica:

```powershell
npm run lint
npm run typecheck
npm test
npm run test:sql-import
npm run build
npm run test:e2e
npm audit
```

`npm run algebra:datasets` rigenera i dataset JSON senza cambiare originali o
progressi. Test browser in profili isolati; mobile Chromium emulato, nessuna
certificazione Safari/dispositivo fisico. Sprint 4, ER, AI e account esclusi.

# Aggiungere e aggiornare lezioni

Non servono nuovi componenti React per una lezione del formato esistente.

1. Verificare il materiale originale, conservarlo invariato e confrontare checksum
   e inventario. Non estrarre il libro senza uno scopo specifico.
2. Scegliere ID e slug stabili. Nuovi concetti non devono rimpiazzare gli ID di
   lezioni precedenti. Inserire il modulo o usare quello esistente.
3. Creare `lessons/<slug>.md` con frontmatter **JSON** fra due righe `---`.
   La struttura deve corrispondere a `lessonSchema` e alla voce nel manifest.
   Usare come esempio un file attuale, mantenendo tutti i campi:
   id, moduleId, slug, title, mdxPath, version, status, sourceRefs, concepts,
   description, objectives, order, prerequisites, relatedLessonIds, quizPath.
4. Creare `quizzes/<slug>.json` secondo `quizSchema`: lessonId, version, status,
   questions. Ogni domanda ha ID/versione, type (`single`, `multiple`, `true-false`),
   prompt, concepts, sourceRefs, options, correctOptionIds ed explanation.
   Vero/falso richiede gli ID `vero` e `falso`. Il formato selezione singola
   usa pulsanti radio; quello multiplo confronta l'intero insieme delle scelte.
5. Collegare file e pagine PDF esatte (numerazione fisica), distinguere parafrasi,
   esempi aggiunti e punti incerti. Iniziare sempre con `needs-review`.
6. Aggiornare manifest e changelog. Incrementare la versione di un contenuto che
   cambia significato, e quella del quiz/domanda quando cambiano le risposte.
   Non riassegnare un ID di domanda a un concetto diverso. Per modifiche sostanziali
   del quiz aumentare anche la versione della lezione, mantenendo distinguibile lo storico.
7. Registrare importId, checksum, ID aggiunti/aggiornati e reviewStatus nel registro
   di import. Fare un diff dei contenuti, evitando doppioni con le lezioni esistenti.
8. Eseguire lint, typecheck, test, build e test:e2e. I test caricano tutte le lezioni
   e provano risposte corrette, ordine alternativo e errori tipici di tutti i quesiti.
9. Rivedere visivamente formule, tabelle e diagrammi su desktop e mobile.
10. La consultazione locale `needs-review` è un'anteprima per lo studio personale.
    Solo l'approvazione umana consente `verified`. Un modulo diventa `available`
    solo con almeno una lezione verified: non promuoverlo per la sola presenza di PDF.

## Markdown supportato

Paragrafi, titoli di sezione `##` univoci, sottotitoli, elenchi, grassetto, corsivo,
citazioni, tabelle GFM, blocchi di codice SQL/testo e formule `$...$`/`$$...$$` con
KaTeX locale. Titoli `##` in testo semplice garantiscono ancore e indice coerenti.

Un blocco con linguaggio `diagram` contiene un percorso testuale separato da `→`:
il renderer produce caselle e frecce accessibili. Etichettare le rappresentazioni
aggiuntive come tali. Per visualizzazioni più complesse estendere in futuro il
formato in modo controllato, senza introdurre script nel contenuto.

Non sono eseguiti HTML, JSX, JavaScript o MDX. Immagini remote disabilitate, URL
consentiti solo se locali o ancore. I link alle fonti usano `/sources/<id>#page=N`.
La route PDF ammette soltanto le fonti già esaminate; ampliare l'allowlist solo
quando una nuova fonte è effettivamente utilizzata, senza esporre percorsi arbitrari.

## Progressi e compatibilità

I progressi usano la coppia lessonId/lessonVersion; i quiz hanno anche le versioni
del quiz e della domanda. Il catalogo non inizializza né svuota lo storage.
L'aggiunta di una lezione cambia il denominatore del modulo, non i dati esistenti.
Gli ID fuori catalogo e le versioni precedenti restano nel backup e nel database.
Le migrazioni del formato dati devono essere testate prima di incrementare la
versione IndexedDB o il formato di esportazione. Nessuna sovrascrittura completa
è prevista dall'interfaccia di importazione attuale.

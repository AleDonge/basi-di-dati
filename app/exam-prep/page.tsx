import {currentCatalog} from "@/lib/exam/catalog";
import {buildSearchIndex} from "@/lib/search";
import {ExamHub} from "@/components/exam/hub";
import {ExamInsights} from "@/components/exam/insights";
import {StudyPlanner} from "@/components/exam/study-plan";
import {LocalSearch} from "@/components/search";
export const metadata={title:"Exam Prep"};
export default function ExamPrep(){return <><p className="eyebrow">EXAM PREP · PREPARAZIONE PERSONALE</p><h1>Allenati. Osserva. Ripassa.</h1><p className="lead">Sessioni riproducibili sui contenuti disponibili, con risultati distinti e un piano che puoi adattare.</p><div className="notice"><strong>Simulazioni Database Academy, non prove ufficiali</strong><p>Nessuna prova d’esame ufficiale è presente nell’inventario. Queste sessioni non riproducono struttura, durata, difficoltà o voto dell’esame reale. Tutti i contenuti sono needs-review. La coerenza sulle fixture e il completamento manuale non dimostrano correttezza generale.</p></div><nav className="exam-actions" aria-label="Strumenti Exam Prep"><a href="#ricerca">Ricerca locale</a><a href="#piano">Piano di studio</a><a href="#ripasso">Statistiche e ripasso</a></nav><ExamHub catalog={currentCatalog()}/><div id="ripasso"><ExamInsights/></div><LocalSearch index={buildSearchIndex()}/><StudyPlanner/></>;}

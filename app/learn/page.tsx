import { LessonCatalog } from "@/components/lesson/catalog";
import { manifest } from "@/lib/content";
export const metadata = { title: "Learn" };
export default function Learn() { return <><p className="eyebrow">LEARN · IL PERCORSO</p><h1>Impara dalle fonti.</h1><p className="lead">{manifest.lessons.filter(l => l.status !== "draft").length} lezioni su introduzione, modello relazionale, algebra e progettazione ER, con fonti puntuali e autoverifica.</p><div className="notice"><strong>Anteprime personali · needs-review</strong><p>Le lezioni sono consultabili per la revisione e lo studio personale. Nessuna è contrassegnata come verificata. Completare la lettura o un quiz non cambia lo stato editoriale.</p></div><LessonCatalog /></>; }

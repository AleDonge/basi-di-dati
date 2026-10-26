import { ArrowUpRight, BookOpen } from "lucide-react";
import { manifest } from "@/lib/content";
import Link from "next/link";
export function ModuleList() {
  return <div className="module-list">{[...manifest.modules].sort((a, b) => a.order - b.order).map((module, index) => {
    const sources = manifest.sources.filter(s => module.sourceIds.includes(s.id));
    const pages = sources.reduce((n, s) => n + (s.pages ?? 0), 0);
    const lessons = manifest.lessons.filter(l => l.moduleId === module.id && l.status === "verified");
    const previews = manifest.lessons.filter(l => l.moduleId === module.id && l.status === "needs-review");
    return <details className="module" key={module.id}>
      <summary><span className="module-number">{String(index + 1).padStart(2, "0")}</span><span className="module-info"><strong>{module.title}</strong><span>{sources.length} {sources.length === 1 ? "fonte" : "fonti"} · {pages} pagine PDF · {lessons.length} lezioni pubblicate</span></span><span className="module-status">{module.status === "available" ? "Disponibile" : module.status === "upcoming" ? "Non ancora coperto" : previews.length ? "Da revisionare" : "Da preparare"}</span><ArrowUpRight className="module-arrow" size={17} /></summary>
      <div className="module-detail"><p>{module.description}</p><ul>{sources.map(s => <li key={s.id}><BookOpen size={14} /><span>{s.file}</span><span>{s.pages ? `${s.pages} pp.` : `${s.lines} righe`}</span></li>)}</ul>{previews.length > 0 ? <div className="module-previews"><p>{previews.length} anteprime da revisionare:</p>{previews.map(l => <Link key={l.id} href={`/learn/${l.slug}`}>{l.title} →</Link>)}</div> : <p className="muted">Fonti presenti; lezioni ancora da preparare.</p>}</div>
    </details>;
  })}</div>;
}

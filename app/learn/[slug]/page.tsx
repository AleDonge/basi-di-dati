import Link from "next/link";
import { notFound } from "next/navigation";
import { manifest } from "@/lib/content";
import { loadLesson } from "@/lib/content/lessons";
import { publicQuestion } from "@/lib/content/quiz-schema";
import { LessonMarkdown } from "@/components/lesson/markdown";
import { LessonNavigation } from "@/components/lesson/navigation";
import { LessonControls } from "@/components/lesson/controls";
import { LessonQuiz } from "@/components/lesson/quiz";
export function generateStaticParams() { return manifest.lessons.filter(l => l.status !== "draft").map(l => ({ slug: l.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const lesson = manifest.lessons.find(l => l.slug === slug);
  return { title: lesson?.title ?? "Lezione non trovata" };
}
export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const lesson = loadLesson(slug); if (!lesson) notFound();
  const { meta, body, quiz, toc } = lesson;
  const sorted = manifest.lessons.filter(l => l.status !== "draft").toSorted((a,b) => a.order-b.order);
  const index = sorted.findIndex(l => l.id === meta.id);
  const related = meta.relatedLessonIds.map(id => manifest.lessons.find(l => l.id === id)!);
  const prerequisites = meta.prerequisites.map(id => manifest.lessons.find(l => l.id === id)!);
  return <div className="lesson-layout"><LessonNavigation lessons={manifest.lessons} currentId={meta.id} /><article className="lesson-article"><header><p className="eyebrow">LEARN · {manifest.modules.find(m => m.id === meta.moduleId)?.title} · V{meta.version}</p><h1>{meta.title}</h1><p className="lead">{meta.description}</p><div className="notice review-notice"><strong>{meta.status === "verified" ? "Contenuto verificato" : "needs-review · Anteprima da revisionare"}</strong><p>Testo rielaborato dalle fonti citate. Esempi, analogie e precisazioni aggiuntive sono indicati nel testo. Questa lettura non costituisce materiale approvato dal docente.</p></div><LessonControls id={meta.id} version={meta.version} /></header>
    <section className="objectives"><h2>Cosa imparerai</h2><ul>{meta.objectives.map(o => <li key={o}>{o}</li>)}</ul>{prerequisites.length > 0 && <p>Prima di iniziare: {prerequisites.map(p => <Link key={p.id} href={`/learn/${p.slug}`}>{p.title}</Link>)}</p>}</section>
    <details className="lesson-toc-mobile"><summary>Indice dei paragrafi</summary><nav aria-label="Indice compatto della lezione">{toc.map(h => <a key={h.id} href={`#${h.id}`}>{h.title}</a>)}<a href="#fonti">Fonti originali</a><a href="#autoverifica">Autoverifica</a></nav></details>
    <LessonMarkdown body={body} />
    <section id="fonti" className="lesson-sources"><h2>Fonti originali</h2><p>Numerazione delle pagine PDF, dall’inizio del file; può differire dal numero stampato sulla slide. Apertura dal server locale.</p><ul>{meta.sourceRefs.map((ref,i) => <li key={i}><a href={`/sources/${ref.sourceId}#page=${ref.pageStart}`} target="_blank" rel="noreferrer">{ref.file} · pp. {ref.pageStart}–{ref.pageEnd}</a><span>{ref.section}</span></li>)}</ul></section>
    <LessonQuiz questions={quiz.questions.map(publicQuestion)} lesson={{ id: meta.id, slug: meta.slug, version: meta.version }} quizVersion={quiz.version} />
    {related.length > 0 && <section className="related-lessons"><h2>Argomenti correlati</h2>{related.map(l => <Link key={l.id} href={`/learn/${l.slug}`}>{l.title} →</Link>)}</section>}
    <nav className="lesson-pagination" aria-label="Navigazione tra lezioni">{sorted[index-1] && <Link href={`/learn/${sorted[index-1].slug}`}>← {sorted[index-1].title}</Link>}{sorted[index+1] && <Link href={`/learn/${sorted[index+1].slug}`}>{sorted[index+1].title} →</Link>}</nav>
  </article><aside className="lesson-toc"><nav aria-label="Indice della lezione"><h2>IN QUESTA LEZIONE</h2>{toc.map(h => <a key={h.id} href={`#${h.id}`}>{h.title}</a>)}<a href="#fonti">Fonti originali</a><a href="#autoverifica">Autoverifica</a></nav></aside></div>;
}

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { manifest } from "./index";
import { lessonSchema } from "./schemas";
import { quizSchema } from "./quiz-schema";
import { parseLessonFile, tableOfContents } from "./markdown";
const root = join(process.cwd(), "content/courses/basi-di-dati");
export function loadLesson(slug: string) {
  const entry = manifest.lessons.find(l => l.slug === slug);
  if (!entry || entry.status === "draft") return undefined;
  const { metadata, body } = parseLessonFile(readFileSync(join(root, entry.mdxPath), "utf8"));
  const meta = lessonSchema.parse(metadata);
  if (JSON.stringify(meta) !== JSON.stringify(entry)) throw new Error(`Metadati divergenti: ${entry.id}`);
  const quiz = quizSchema.parse(JSON.parse(readFileSync(join(root, entry.quizPath), "utf8")));
  if (quiz.lessonId !== meta.id) throw new Error("Quiz collegato alla lezione errata");
  quiz.questions.forEach(q => q.sourceRefs.forEach(ref => {
    const source = manifest.sources.find(s => s.id === ref.sourceId);
    if (!source || source.file !== ref.file || !ref.pageStart || !ref.pageEnd || ref.pageEnd > (source.pages ?? 0)) throw new Error(`Fonte quiz non valida: ${q.id}`);
  }));
  const toc = tableOfContents(body);
  if (new Set(toc.map(h => h.id)).size !== toc.length) throw new Error("Titoli di sezione duplicati");
  return { meta, body, quiz, toc };
}

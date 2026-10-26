import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { manifest } from "@/lib/content";
import { loadLesson } from "@/lib/content/lessons";
import { parseLessonFile, localContentUrl } from "@/lib/content/markdown";
import { publicQuestion } from "@/lib/content/quiz-schema";
import { gradeQuiz } from "@/lib/grading/quiz";
import { LessonMarkdown } from "@/components/lesson/markdown";

describe("Lezioni e provenienza", () => {
  it("mantiene le nove lezioni precedenti e le nove di algebra e i quiz needs-review", () => {
    expect(manifest.lessons).toHaveLength(42);
    expect(manifest.lessons.every(l => l.status === "needs-review")).toBe(true);
  });
  it.each(manifest.lessons)("carica e valida contenuto, metadati e quiz di $id", meta => {
    const lesson = loadLesson(meta.slug)!;
    expect(lesson.meta).toEqual(meta);
    expect(lesson.body.split(/\s+/).length).toBeGreaterThan(500);
    expect(lesson.quiz.questions).toHaveLength(3);
    expect(lesson.quiz.status).toBe("needs-review");
    expect(lesson.toc.length).toBeGreaterThanOrEqual(6);
    expect(lesson.body).toContain("## Riepilogo");
    expect(lesson.body).toContain("```diagram");
    const html = renderToStaticMarkup(createElement(LessonMarkdown, { body: lesson.body }));
    expect(html).not.toContain("katex-error");
    expect(html).toContain("lesson-diagram");
  });
  it("rifiuta percorsi non in catalogo e frontmatter eseguibile", () => {
    expect(loadLesson("../../Book.pdf")).toBeUndefined();
    expect(() => parseLessonFile("---\n!!js/function function(){}\n---\nTesto")).toThrow();
  });
  it("non esegue HTML e non carica URL o immagini esterne dal Markdown", () => {
    const html = renderToStaticMarkup(createElement(LessonMarkdown, { body: '<script>alert(1)</script>\n\n![spy](https://example.com/x.png)\n\n[x](javascript:alert(1))\n\n[remoto](https://example.com)\n\n[testo locale](/learn/dbms-dati)' }));
    expect(html).not.toContain("<script"); expect(html).not.toContain("<img");
    expect(html).not.toContain("https://"); expect(html).not.toContain("javascript:");
    expect(html).toContain('href="/learn/dbms-dati"');
    for (const url of ["//example.com", "https://example.com", "javascript:alert(1)", "/\\example.com"]) expect(localContentUrl(url)).toBe("");
  });
});
for (const meta of manifest.lessons) {
  const lesson = loadLesson(meta.slug)!;
  describe(`Correzione delle tre domande di ${meta.id}`, () => {
    it.each(lesson.quiz.questions)("$id: corrette, ordine irrilevante, errori tipici e input invalidi", q => {
      expect(gradeQuiz(q, q.correctOptionIds).correct).toBe(true);
      expect(gradeQuiz(q, [...q.correctOptionIds].reverse()).correct).toBe(true);
      const wrong = q.options.find(o => !q.correctOptionIds.includes(o.id))!;
      expect(gradeQuiz(q, [wrong.id]).correct).toBe(false);
      if (q.type === "multiple") {
        expect(gradeQuiz(q, q.correctOptionIds.slice(1)).correct).toBe(false);
        expect(gradeQuiz(q, [...q.correctOptionIds, wrong.id]).correct).toBe(false);
      } else expect(() => gradeQuiz(q, [q.options[0].id, q.options[1].id])).toThrow();
      expect(() => gradeQuiz(q, [])).toThrow();
      expect(() => gradeQuiz(q, ["inesistente"])).toThrow();
      expect(() => gradeQuiz(q, [wrong.id, wrong.id])).toThrow();
      const publicData = publicQuestion(q);
      expect(publicData).not.toHaveProperty("correctOptionIds");
      expect(publicData).not.toHaveProperty("explanation");
    });
  });
}

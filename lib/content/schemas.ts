import { z } from "zod";

export const stableId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const reviewStatus = z.enum(["verified", "draft", "needs-review"]);
export const sourceRefSchema = z.object({
  sourceId: stableId, file: z.string().min(1), pageStart: z.number().int().positive().optional(),
  pageEnd: z.number().int().positive().optional(), section: z.string().min(1).optional(),
}).strict().refine(r => r.pageEnd === undefined || (r.pageStart !== undefined && r.pageEnd >= r.pageStart), "Intervallo di pagine non valido");
export const sourceSchema = z.object({
  id: stableId, file: z.string().min(1), kind: z.enum(["pdf", "sql", "exercises"]),
  bytes: z.number().int().positive(), sha256: z.string().regex(/^[a-f0-9]{64}$/),
  pages: z.number().int().positive().optional(), lines: z.number().int().positive().optional(),
  reviewStatus, notes: z.string(),
}).strict();
export const moduleSchema = z.object({
  id: stableId, courseId: stableId, title: z.string().min(1), order: z.number().int().nonnegative(),
  status: z.enum(["available", "upcoming", "draft"]), prerequisites: z.array(stableId),
  sourceIds: z.array(stableId), description: z.string().min(1),
}).strict();
export const lessonSchema = z.object({
  id: stableId, moduleId: stableId, slug: stableId, title: z.string().min(1),
  mdxPath: z.string().regex(/^lessons\/[a-z0-9-]+\.mdx?$/), version: z.number().int().positive(),
  status: reviewStatus, sourceRefs: z.array(sourceRefSchema).min(1), concepts: z.array(z.string().min(1)),
  description: z.string().min(1), objectives: z.array(z.string().min(1)).min(1),
  order: z.number().int().positive(), prerequisites: z.array(stableId), relatedLessonIds: z.array(stableId),
  quizPath: z.string().regex(/^quizzes\/[a-z0-9-]+\.json$/),
}).strict();
export const exerciseSchema = z.object({
  id: stableId, moduleId: stableId, type: z.enum(["sql", "relational-algebra", "quiz", "er-guided"]),
  difficulty: z.enum(["base", "intermedio", "avanzato"]), prompt: z.string().min(1), datasetId: stableId.optional(),
  expectedColumns: z.array(z.string()).optional(), orderMatters: z.boolean(),
  gradingMode: z.enum(["automatic", "guided", "manual"]), fixtures: z.array(z.string().min(1)),
  solutionPath: z.string().min(1), hints: z.array(z.string()), sourceRefs: z.array(sourceRefSchema).min(1),
  version: z.number().int().positive(), status: reviewStatus,
}).strict().refine(e => e.gradingMode !== "automatic" || e.fixtures.length >= 2, "La correzione automatica richiede almeno due fixture");
export const datasetSchema = z.object({
  id: stableId, dialect: z.enum(["sqlite", "mysql"]), schemaPath: z.string().min(1), seedPath: z.string().min(1),
  fixturePaths: z.array(z.string()), provenance: z.array(sourceRefSchema).min(1), supportedCapabilities: z.array(z.string()),
}).strict();
export const manifestSchema = z.object({
  schemaVersion: z.literal(1), version: z.number().int().positive(),
  course: z.object({ id: stableId, title: z.string().min(1), academicYear: z.string(), sourceRefs: z.array(sourceRefSchema).min(1) }).strict(),
  sources: z.array(sourceSchema), modules: z.array(moduleSchema), lessons: z.array(lessonSchema),
  exercises: z.array(exerciseSchema), datasets: z.array(datasetSchema),
}).strict().superRefine((m, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: "custom", message });
  for (const list of [m.sources, m.modules, m.lessons, m.exercises, m.datasets]) {
    if (new Set(list.map(x => x.id)).size !== list.length) fail("ID duplicati nel catalogo");
  }
  const sources = new Map(m.sources.map(s => [s.id, s]));
  const modules = new Set(m.modules.map(x => x.id));
  const lessons = new Set(m.lessons.map(x => x.id));
  if (new Set(m.lessons.map(x => x.slug)).size !== m.lessons.length) fail("Slug duplicati");
  const datasets = new Set(m.datasets.map(x => x.id));
  const checkRef = (r: z.infer<typeof sourceRefSchema>) => {
    const s = sources.get(r.sourceId);
    if (!s || s.file !== r.file) fail(`Fonte non valida: ${r.sourceId}`);
    if (s?.kind === "pdf" && (!r.pageStart || !r.pageEnd)) fail("Citazione PDF senza pagine");
    if (s?.pages && (r.pageEnd ?? 0) > s.pages) fail("Citazione oltre la fine del PDF");
  };
  m.course.sourceRefs.forEach(checkRef);
  m.modules.forEach(x => {
    if (x.courseId !== m.course.id) fail("Corso sconosciuto");
    x.sourceIds.forEach(id => { if (!sources.has(id)) fail("Fonte del modulo sconosciuta"); });
    x.prerequisites.forEach(id => { if (!modules.has(id) || id === x.id) fail("Prerequisito non valido"); });
    if (x.status === "available" && !m.lessons.some(l => l.moduleId === x.id && l.status === "verified")) fail("Modulo disponibile senza lezioni verificate");
  });
  [...m.lessons, ...m.exercises].forEach(x => {
    if (!modules.has(x.moduleId)) fail("Modulo sconosciuto");
    x.sourceRefs.forEach(checkRef);
  });
  m.exercises.forEach(e => { if (e.datasetId && !datasets.has(e.datasetId)) fail("Dataset sconosciuto"); });
  m.lessons.forEach(l => {
    [...l.prerequisites, ...l.relatedLessonIds].forEach(id => { if (!lessons.has(id) || id === l.id) fail("Collegamento lezione non valido"); });
  });
  m.datasets.forEach(d => d.provenance.forEach(checkRef));
});
export type Manifest = z.infer<typeof manifestSchema>;

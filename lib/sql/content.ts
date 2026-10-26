import { z } from "zod";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { manifest } from "@/lib/content";
import { sourceRefSchema, stableId } from "@/lib/content/schemas";
export const tableSchema = z.object({ name: z.string(), rowCount: z.number().int(), columns: z.array(z.object({ name: z.string(), type: z.string(), notNull: z.boolean(), primaryKey: z.boolean() })), foreignKeys: z.array(z.object({ table: z.string(), column: z.string(), targetColumn: z.string() })), ddl: z.string() });
export const catalogSchema = z.object({ id: z.string(), title: z.string(), dialect: z.literal("sqlite"), source: z.string(), sourceSha256: z.string(), tables: z.array(tableSchema) });
export type SqlCatalog = z.infer<typeof catalogSchema>;
const root = join(process.cwd(), "content/courses/basi-di-dati");
export function loadDataset(id: string) {
  if (!["sailors", "northwind"].includes(id)) throw new Error("Dataset non disponibile");
  const dir = join(root, "datasets", id);
  const catalog = catalogSchema.parse(JSON.parse(readFileSync(join(dir,"catalog.json"),"utf8")));
  return { catalog, fixture: { id, schemaSql: readFileSync(join(dir,"schema.sql"),"utf8"), seedSql: readFileSync(join(dir,"seed.sql"),"utf8"), tables: catalog.tables.map(t => t.name) } };
}
export function loadSqlExercise(id: string) {
  if (!manifest.exercises.some(e => e.id === id && e.type === "sql")) throw new Error("Esercizio non disponibile");
  // All paths below come from the validated local catalog, never directly from the URL.
  const exercise = sqlExerciseSchema.parse(JSON.parse(readFileSync(join(root,"exercises",`${id}.json`),"utf8")));
  const meta = manifest.exercises.find(e => e.id === id && e.type === "sql")!;
  if (exercise.id !== id || exercise.version !== meta.version || exercise.datasetId !== meta.datasetId || exercise.orderMatters !== meta.orderMatters || exercise.solutionPath !== meta.solutionPath || JSON.stringify(exercise.fixtureIds) !== JSON.stringify(meta.fixtures.map(f => f === `datasets/${exercise.datasetId}/seed.sql` ? exercise.datasetId : f.replace(/^fixtures\//, "").replace(/\.sql$/, "")))) throw new Error("Contratto SQL incoerente con il manifest");
  return exercise;
}
export const sqlExerciseSchema = z.object({
  id: z.string(), title: z.string(), version: z.number().int().positive(), status: z.literal("needs-review"),
  originalPrompt: z.string(), datasetId: z.enum(["sailors", "northwind"]), topics: z.array(z.string()), difficulty: z.string(),
  origin: z.enum(["course-question", "platform-activity"]).default("course-question"),
  lessonIds: z.array(stableId).default([]), orderMatters: z.boolean().default(false),
  gradingMode: z.literal("automatic"), fixtureIds: z.array(z.string()).min(2), solutionPath: z.string().regex(/^solutions\/[a-z0-9-]+\.sql$/),
  hints: z.array(z.string()), outputContract: z.array(z.string()), interpretation: z.string(), limitations: z.array(z.string()),
  sourceRefs: z.array(sourceRefSchema),
});
export type SqlExercise = z.infer<typeof sqlExerciseSchema>;
export function loadSolution(exercise: SqlExercise) { return readFileSync(join(root,exercise.solutionPath),"utf8"); }
export function loadGradingFixtures(exercise: SqlExercise) {
  const official = loadDataset(exercise.datasetId).fixture;
  return exercise.fixtureIds.map(id => {
    if(id === exercise.datasetId) return official;
    const dataset = manifest.datasets.find(d => d.id === exercise.datasetId)!;
    if(!dataset.fixturePaths.includes(`fixtures/${id}.sql`) || !/^[a-z0-9-]+$/.test(id)) throw new Error("Fixture sconosciuta");
    return { ...official, id, seedSql: readFileSync(join(root,"fixtures",`${id}.sql`),"utf8") };
  });
}

import raw from "@/content/courses/basi-di-dati/manifest.json";
import { manifestSchema, type Manifest } from "./schemas";
export const manifest = manifestSchema.parse(raw);
export function summarize(catalog: Manifest) {
  return { sources: catalog.sources.length, pages: catalog.sources.reduce((sum, s) => sum + (s.pages ?? 0), 0),
    modules: catalog.modules.length, lessons: catalog.lessons.filter(l => l.status === "verified").length,
    exercises: catalog.exercises.filter(e => e.status === "verified").length };
}

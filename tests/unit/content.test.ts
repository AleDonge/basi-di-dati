import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { manifest, summarize } from "@/lib/content";
import { manifestSchema, sourceRefSchema } from "@/lib/content/schemas";
import { migrateBackup, legacyBackupSchema } from "@/lib/progress/schemas";

describe("Catalogo reale e integrità delle fonti", () => {
  it("valida il manifest iniziale senza lezioni o esercizi fittizi", () => {
    expect(summarize(manifest)).toEqual({ sources: 13, pages: 1486, modules: 6, lessons: 0, exercises: 0 });
    expect(manifest.modules.every(m => m.status === "draft")).toBe(true);
  });
  it.each(manifest.sources)("preserva checksum e dimensione: $file", source => {
    const bytes = readFileSync(`source-material/${source.file}`);
    expect(bytes.length).toBe(source.bytes);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(source.sha256);
  });
  it("rifiuta ID duplicati, riferimenti sconosciuti e disponibilità fittizia", () => {
    const duplicate = structuredClone(manifest); duplicate.modules.push(duplicate.modules[0]);
    expect(manifestSchema.safeParse(duplicate).success).toBe(false);
    const missing = structuredClone(manifest); missing.modules[0].sourceIds = ["missing"];
    expect(manifestSchema.safeParse(missing).success).toBe(false);
    const available = structuredClone(manifest); available.modules[0].status = "available";
    expect(manifestSchema.safeParse(available).success).toBe(false);
  });
  it("rifiuta citazioni invertite o oltre le pagine della fonte", () => {
    expect(sourceRefSchema.safeParse({ sourceId: "source", file: "a.pdf", pageStart: 5, pageEnd: 2 }).success).toBe(false);
    const invalid = structuredClone(manifest); invalid.course.sourceRefs[0].pageEnd = 999;
    expect(manifestSchema.safeParse(invalid).success).toBe(false);
  });
  it("rifiuta chiavi inattese e versioni di schema sconosciute", () => {
    expect(manifestSchema.safeParse({ ...manifest, schemaVersion: 2 }).success).toBe(false);
    expect(manifestSchema.safeParse({ ...manifest, unknown: true }).success).toBe(false);
  });
});
describe("Contratto futuro dei progressi", () => {
  const backup = { schemaVersion: 1, exportedAt: "2026-10-24T12:00:00Z", attempts: [], lessons: [] };
  it("accetta un backup vuoto e tentativi versionati", () => {
    expect(migrateBackup(backup).schemaVersion).toBe(5);
    expect(migrateBackup({ ...backup, attempts: [{ id: "attempt-1", exerciseId: "sql-1", exerciseVersion: 1, answer: "SELECT 1", result: "passed", feedback: "Fixture controllate", attemptedAt: backup.exportedAt }] }).attempts).toHaveLength(1);
  });
  it("rifiuta backup corrotti, timestamp invalidi e versioni non positive", () => {
    expect(legacyBackupSchema.safeParse({ ...backup, schemaVersion: 3 }).success).toBe(false);
    expect(legacyBackupSchema.safeParse({ ...backup, exportedAt: "ieri" }).success).toBe(false);
    expect(legacyBackupSchema.safeParse({ ...backup, lessons: [{ lessonId: "intro", lessonVersion: 0, lastVisitedAt: backup.exportedAt }] }).success).toBe(false);
  });
});

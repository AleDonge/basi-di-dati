import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { openDB, deleteDB } from "idb";
import { importProgress, readProgress, updateLessonProgress, saveQuizAttempt } from "@/lib/progress/db";
import { emptyProgress, parseBackup, type QuizAttempt } from "@/lib/progress/schemas";
import { mergeProgress } from "@/lib/progress/merge";
import { moduleProgress } from "@/lib/progress/selectors";
import { manifest } from "@/lib/content";
const date = "2026-10-24T12:00:00.000Z";
const attempt: QuizAttempt = { id: "attempt-1", lessonId: "dbms-dati", lessonVersion: 1, quizVersion: 1, questionId: "dbms-dati-q1", questionVersion: 1, selectedOptionIds: ["opzione-2"], correct: true, feedback: "Spiegazione", attemptedAt: date };
describe("IndexedDB e migrazioni non distruttive", () => {
  it("salva e recupera lettura e quiz indipendenti, anche dopo riapertura", async () => {
    const name = "test-persistence";
    await deleteDB(name);
    await updateLessonProgress("dbms-dati", 1, true, name);
    await saveQuizAttempt(attempt, name);
    let data = await readProgress(name);
    expect(data.lessons[0].completedAt).toBeTruthy();
    expect(data.quizAttempts).toEqual([attempt]);
    await updateLessonProgress("dbms-dati", 1, false, name);
    data = await readProgress(name);
    expect(data.lessons[0].completedAt).toBeUndefined();
    expect(data.quizAttempts).toEqual([attempt]);
    await deleteDB(name);
  });
  it("migra un database v1 mantenendo data e tentativi", async () => {
    const name = "test-migration"; await deleteDB(name);
    const old = await openDB(name, 1, { upgrade(db) { db.createObjectStore("lessons", { keyPath: "lessonId" }); db.createObjectStore("attempts", { keyPath: "id" }); } });
    const original = { lessonId: "dbms-dati", lessonVersion: 1, completedAt: date, lastVisitedAt: date };
    await old.put("lessons", original);
    await old.put("attempts", { id: "old-1", exerciseId: "old-exercise", exerciseVersion: 1, answer: "risposta", result: "guided", feedback: "Nota", attemptedAt: date });
    old.close();
    const data = await readProgress(name);
    expect(data.lessons).toEqual([original]); expect(data.attempts).toHaveLength(1);
    const upgraded = await openDB(name);
    expect(await upgraded.get("lessons", "dbms-dati")).toEqual(original);
    upgraded.close(); await deleteDB(name);
  });
  it("l’aggiunta di lezioni o versioni non cancella completamenti e tentativi", async () => {
    const name = "test-catalog-growth"; await deleteDB(name);
    await updateLessonProgress("dbms-dati", 1, true, name);
    const before = await readProgress(name);
    const extra = { ...manifest.lessons[0], id: "nuova-lezione", slug: "nuova-lezione" };
    const grown = [...manifest.lessons, extra];
    expect(moduleProgress("introduzione", grown, before)).toMatchObject({ completed: 1, total: 5 });
    await updateLessonProgress("nuova-lezione", 1, undefined, name);
    await updateLessonProgress("dbms-dati", 2, undefined, name);
    const after = await readProgress(name);
    expect(after.lessons.find(l => l.lessonId === "dbms-dati" && l.lessonVersion === 1)).toEqual(before.lessons[0]);
    expect(after.lessons.find(l => l.lessonId === "dbms-dati" && l.lessonVersion === 2)?.completedAt).toBeUndefined();
    expect(moduleProgress("introduzione", manifest.lessons.map(l => l.id === "dbms-dati" ? { ...l, version: 2 } : l), after).completed).toBe(0);
    await deleteDB(name);
  });
  it("se i dati legacy sono invalidi interrompe la migrazione senza cancellarli", async () => {
    const name = "test-invalid-migration"; await deleteDB(name);
    const old = await openDB(name, 1, { upgrade(db) { db.createObjectStore("lessons", { keyPath: "lessonId" }); db.createObjectStore("attempts", { keyPath: "id" }); } });
    const invalid = { lessonId: "preservare", lessonVersion: 0, lastVisitedAt: "data-illeggibile" };
    await old.put("lessons", invalid); old.close();
    await expect(readProgress(name)).rejects.toThrow();
    const unchanged = await openDB(name);
    expect(unchanged.version).toBe(1); expect(await unchanged.get("lessons", "preservare")).toEqual(invalid);
    unchanged.close(); await deleteDB(name);
  });
  it("gestisce scritture concorrenti senza perdere letture diverse", async () => {
    const name = "test-concurrent"; await deleteDB(name);
    await Promise.all([updateLessonProgress("dbms-dati", 1, true, name), updateLessonProgress("schema-istanza", 1, true, name)]);
    expect((await readProgress(name)).lessons.filter(l => l.completedAt)).toHaveLength(2);
    await deleteDB(name);
  });
});
describe("Backup validati, fusione e atomicità", () => {
  it("esegue roundtrip v2, migra v1 e conserva ID fuori catalogo", () => {
    const backup = { ...emptyProgress(), lessons: [{ lessonId: "futura", lessonVersion: 7, lastVisitedAt: date }], quizAttempts: [attempt] };
    expect(parseBackup(JSON.stringify(backup))).toEqual(backup);
    const legacy = { schemaVersion: 1, exportedAt: date, attempts: [], lessons: backup.lessons };
    expect(parseBackup(JSON.stringify(legacy))).toMatchObject({ schemaVersion: 5, lessons: backup.lessons, quizAttempts: [] });
  });
  it("rifiuta JSON corrotti, duplicati, versioni sconosciute e file troppo grandi", () => {
    for (const text of ["{", JSON.stringify({ ...emptyProgress(), schemaVersion: 77 }), JSON.stringify({ ...emptyProgress(), quizAttempts: [attempt, attempt] }), " ".repeat(5 * 1024 * 1024 + 1)]) expect(() => parseBackup(text)).toThrow();
  });
  it("preserva completamenti e ultime visite, deduplica i tentativi identici", () => {
    const local = { ...emptyProgress(), lessons: [{ lessonId: "dbms-dati", lessonVersion: 1, completedAt: date, lastVisitedAt: "2026-10-25T12:00:00.000Z" }], quizAttempts: [attempt] };
    const incoming = { ...emptyProgress(), lessons: [{ lessonId: "dbms-dati", lessonVersion: 1, lastVisitedAt: date }], quizAttempts: [attempt] };
    const merged = mergeProgress(local, incoming);
    expect(merged.lessons).toEqual(local.lessons); expect(merged.quizAttempts).toHaveLength(1);
  });
  it("confronta date senza dipendere dalla presenza dei millisecondi nel JSON", () => {
    const local = { ...emptyProgress(), lessons: [{ lessonId: "dbms-dati", lessonVersion: 1, lastVisitedAt: "2026-10-24T12:00:00Z" }] };
    const incoming = { ...emptyProgress(), lessons: [{ lessonId: "dbms-dati", lessonVersion: 1, lastVisitedAt: "2026-10-24T12:00:00.100Z" }] };
    expect(mergeProgress(local, incoming).lessons[0].lastVisitedAt).toBe(incoming.lessons[0].lastVisitedAt);
  });
  it("importa atomicamente e annulla l’intera fusione in caso di ID in conflitto", async () => {
    const name = "test-atomic-import"; await deleteDB(name);
    await importProgress({ ...emptyProgress(), quizAttempts: [attempt] }, name);
    const conflicting = { ...emptyProgress(), lessons: [{ lessonId: "nuova", lessonVersion: 1, lastVisitedAt: date }], quizAttempts: [{ ...attempt, correct: false }] };
    await expect(importProgress(conflicting, name)).rejects.toThrow("Conflitto");
    const remaining = await readProgress(name);
    expect(remaining.lessons).toEqual([]); expect(remaining.quizAttempts).toEqual([attempt]);
    await importProgress({ ...emptyProgress(), lessons: conflicting.lessons }, name);
    expect((await readProgress(name)).lessons).toEqual(conflicting.lessons);
    await deleteDB(name);
  });
});

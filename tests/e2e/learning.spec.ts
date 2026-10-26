import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { manifest } from "../../lib/content";

test("studio, quiz indipendenti, persistenza e ripristino JSON senza rete esterna", async ({ page }, testInfo) => {
  const external: string[] = []; const errors: string[] = [];
  await page.route("**/*", route => {
    if (new URL(route.request().url()).origin !== "http://127.0.0.1:3000") { external.push(route.request().url()); return route.abort(); }
    return route.continue();
  });
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/learn");
  await page.getByRole("link", { name: /Dati, DBMS e sistemi di basi di dati/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dati, DBMS e sistemi di basi di dati");
  await expect(page.getByText("needs-review · Anteprima da revisionare", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Segna come completata", exact: true })).toBeEnabled();
  await page.screenshot({ path: `docs/screenshots/lesson-${testInfo.project.name}.png`, fullPage: false });
  const first = page.locator(".quiz-card").nth(0);
  await first.getByLabel("La raccolta dei dati", { exact: true }).check();
  await first.getByRole("button", { name: "Verifica risposta", exact: true }).click();
  await expect(first.locator(".quiz-feedback")).toContainText("Da rivedere");
  await expect(first.locator(".quiz-history")).toContainText("1 tentativi");
  await first.getByLabel("Il software che gestisce basi di dati", { exact: true }).check();
  await first.getByRole("button", { name: "Verifica risposta", exact: true }).click();
  await expect(first.locator(".quiz-feedback")).toContainText("Risposta corretta");
  await expect(first.locator(".quiz-history")).toContainText("2 tentativi");
  const tf = page.locator(".quiz-card").nth(1);
  await tf.getByLabel("Falso", { exact: true }).check();
  await tf.getByRole("button", { name: "Verifica risposta", exact: true }).click();
  await expect(tf.locator(".quiz-feedback")).toContainText("Risposta corretta");
  const multi = page.locator(".quiz-card").nth(2);
  await multi.getByLabel("Recupero dopo guasti", { exact: true }).check();
  await multi.getByLabel("Coordinamento degli accessi concorrenti", { exact: true }).check();
  await multi.getByLabel("Supporto a linguaggi di gestione dei dati", { exact: true }).check();
  await multi.getByRole("button", { name: "Verifica risposta", exact: true }).click();
  await expect(multi.locator(".quiz-feedback")).toContainText("Risposta corretta");
  await expect(page.getByRole("button", { name: "Segna come completata", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Segna come completata", exact: true }).click();
  await expect(page.getByRole("button", { name: "Annulla completamento" })).toBeEnabled();
  await page.reload();
  await expect(page.getByRole("button", { name: "Annulla completamento" })).toBeEnabled();
  await expect(first.locator(".quiz-history")).toContainText("2 tentativi");
  await page.goto("/learn/relazioni-domini");
  await expect(page.locator(".katex").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Segna come completata", exact: true })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "1 di 42 letture completate" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Continua: Domini, tuple e relazioni/ })).toBeVisible();
  await page.goto("/settings");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Esporta progressi JSON" }).click();
  const download = await downloadEvent; const backup = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(backup.schemaVersion).toBe(5); expect(backup.quizAttempts).toHaveLength(4);
  expect(backup.lessons.find((l: { lessonId: string }) => l.lessonId === "dbms-dati").completedAt).toBeTruthy();
  await page.evaluate(() => new Promise<void>((resolve,reject) => {
    const request = indexedDB.deleteDatabase("database-academy-progress"); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error);
  }));
  await page.reload();
  await expect(page.getByRole("button", { name: "Esporta progressi JSON" })).toBeEnabled();
  const file = { name: "backup.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(backup)) };
  await page.getByLabel("Importa backup JSON").setInputFiles(file);
  await expect(page.getByRole("heading", { name: "Anteprima importazione" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Conferma importazione" })).toBeDisabled();
  await page.getByRole("button", { name: "Annulla importazione" }).click();
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "0 di 42 letture completate" })).toBeVisible();
  await page.goto("/settings");
  await page.getByLabel("Importa backup JSON").setInputFiles(file);
  await page.getByLabel(/Ho controllato l’anteprima/).check();
  await page.getByRole("button", { name: "Conferma importazione" }).click();
  await expect(page.getByRole("status")).toContainText("Importazione completata");
  await page.goto("/learn/dbms-dati");
  await expect(page.getByRole("button", { name: "Annulla completamento" })).toBeEnabled();
  await expect(first.locator(".quiz-history")).toContainText("2 tentativi");
  await page.getByRole("button", { name: "Annulla completamento" }).click();
  await expect(page.getByRole("button", { name: "Segna come completata", exact: true })).toBeEnabled();
  await expect(first.locator(".quiz-history")).toContainText("2 tentativi");
  expect(external).toEqual([]); expect(errors).toEqual([]);
});

test("backup non validi, migrazione v1, dati fuori catalogo e API protette", async ({ page, request }, testInfo) => {
  await page.goto("/settings");
  await expect(page.getByRole("button", { name: "Esporta progressi JSON" })).toBeEnabled();
  await page.getByLabel("Importa backup JSON").setInputFiles({ name: "rotto.json", mimeType: "application/json", buffer: Buffer.from('{"schemaVersion":999}') });
  await expect(page.locator(".backup-panel [role=alert]")).toContainText("Backup non valido");
  await expect(page.getByRole("heading", { name: "Anteprima importazione" })).not.toBeVisible();
  const legacy = { schemaVersion: 1, exportedAt: "2026-10-24T12:00:00.000Z", attempts: [], lessons: [{ lessonId: "lezione-futura", lessonVersion: 2, completedAt: "2026-10-24T12:00:00.000Z", lastVisitedAt: "2026-10-24T12:00:00.000Z" }] };
  await page.getByLabel("Importa backup JSON").setInputFiles({ name: "v1.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(legacy)) });
  await expect(page.getByText(/1 registrazioni di lezioni non presenti/)).toBeVisible();
  await page.getByLabel(/Ho controllato l’anteprima/).check();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `docs/screenshots/backup-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole("button", { name: "Conferma importazione" }).click();
  await expect(page.getByRole("status")).toContainText("Importazione completata");
  const event = page.waitForEvent("download"); await page.getByRole("button", { name: "Esporta progressi JSON" }).click();
  const restored = JSON.parse(await readFile((await (await event).path())!, "utf8"));
  expect(restored.schemaVersion).toBe(5); expect(restored.lessons).toEqual(legacy.lessons);
  const pdf = await request.get("/sources/intro-source");
  expect(pdf.status()).toBe(200); expect(pdf.headers()["content-type"]).toBe("application/pdf");
  expect((await request.get("/sources/book-source")).status()).toBe(404);
  expect((await request.post("/api/quiz", { data: { lessonSlug: "dbms-dati", questionId: "dbms-dati-q1", selected: ["inesistente"] } })).status()).toBe(400);
  expect((await request.post("/api/quiz", { data: { lessonSlug: "non-esiste", questionId: "domanda", selected: ["opzione-1"] } })).status()).toBe(404);
});

test("tutte le lezioni e gli indici si aprono senza overflow o chiamate esterne", async ({ page }, testInfo) => {
  const external: string[] = []; const errors: string[] = [];
  page.on("request", req => { if (new URL(req.url()).origin !== "http://127.0.0.1:3000") external.push(req.url()); });
  page.on("pageerror", error => errors.push(error.message));
  for (const lesson of manifest.lessons) {
    await page.goto(`/learn/${lesson.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
    await expect(page.getByRole("button", { name: "Segna come completata", exact: true })).toBeEnabled();
    await expect(page.locator(".quiz-card")).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const index = page.locator(".lesson-toc-mobile");
    if (await index.isVisible()) { await index.locator("summary").click(); await expect(index.getByRole("link", { name: "Fonti originali" })).toBeVisible(); }
    if (lesson.id === "schema-istanza") {
      await page.getByRole("heading", { name: "Grado e cardinalità", exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `docs/screenshots/reading-${testInfo.project.name}.png`, fullPage: false });
    }
  }
  expect(external).toEqual([]); expect(errors).toEqual([]);
});

test("IndexedDB negato mostra un errore e non dichiara salvataggi riusciti", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, "indexedDB", { get() { throw new DOMException("IndexedDB non consentito", "SecurityError"); } }); });
  await page.goto("/learn/dbms-dati");
  await expect(page.locator(".storage-error")).toContainText(/IndexedDB|Salvataggio non riuscito/);
  await expect(page.getByRole("button", { name: "Segna come completata", exact: true })).toBeDisabled();
});

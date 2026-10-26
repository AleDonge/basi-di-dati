import { test, expect } from "@playwright/test";

test("dashboard, fonti e navigazione senza chiamate esterne", async ({ page }, testInfo) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3000/")) external.push(request.url()); });
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Uno spazio per capire");
  await expect(page.locator("html")).toHaveAttribute("lang", "it");
  await page.getByRole("main").locator(".module-list summary").filter({ hasText: "Basi di dati e loro utenti" }).click();
  await expect(page.getByRole("main").getByText("Argomento01 Basi di Dati e loro utenti.pdf", { exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `docs/screenshots/dashboard-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole("link", { name: /La biblioteca del corso/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ogni fonte");
  await expect(page.getByRole("main").locator(".source-item")).toHaveCount(13);
  for (const [name, title] of [["Learn", "Impara dalle fonti"], ["Practice", "Metti alla prova"], ["SQL Lab", "Interroga."], ["Algebra Lab", "Una relazione"]]) {
    await page.getByRole("link", { name, exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.goto("/settings");
  await expect(page.getByRole("heading", { name: "Progressi e backup" })).toBeVisible();
  await page.goto("/non-esiste");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Qui non c’è");
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test("salto al contenuto accessibile da tastiera", async ({ page }) => {
  await page.goto("/dashboard");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Vai al contenuto" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

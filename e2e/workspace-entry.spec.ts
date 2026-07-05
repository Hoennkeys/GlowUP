import { expect, test } from "@playwright/test";
import { clearAppStorage, expectWorkspaceEntry, loginAsMember } from "./helpers";

test.beforeEach(async ({ page }) => {
  await clearAppStorage(page);
});

test("exibe tela intermediária de workspace após login", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("E-mail").fill("operacional@demo.com");
  await page.getByLabel("Senha").fill("demo123");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expectWorkspaceEntry(page);
  await expect(page.getByText("Lucas Felipe")).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});

test("botão Entrar leva ao dashboard principal", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("E-mail").fill("operacional@demo.com");
  await page.getByLabel("Senha").fill("demo123");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expectWorkspaceEntry(page);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/t\/demo\/app\/painel/);
  await expect(page.getByRole("heading", { name: /Painel de Campanhas/i })).toBeVisible();
});

test("fluxo completo membro via helper", async ({ page }) => {
  await loginAsMember(page);
  await expect(page).toHaveURL(/\/t\/demo\/app\/painel/);
});

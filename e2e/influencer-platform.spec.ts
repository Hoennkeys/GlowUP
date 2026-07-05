import { test, expect } from "@playwright/test";
import { loginAsOwner } from "./helpers";

const CREATOR_BASE = "/t/demo/app/creator";

test.describe("Plataforma Influenciadores — fluxos core", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsOwner(page);
  });

  test("onboarding — wizard carrega perfil demo", async ({ page }) => {
    await page.goto(`${CREATOR_BASE}/onboarding`);
    await expect(page.getByRole("heading", { name: "Onboarding Creator" })).toBeVisible();
    await expect(page.getByLabel("Nome")).toHaveValue("Ana Creator");
    await expect(page.getByRole("button", { name: "Salvar e continuar" })).toBeVisible();
    await expect(page.getByTestId("onboarding-nav-step-2")).toBeVisible();
    await expect(page.getByTestId("onboarding-nav-step-3")).toBeVisible();
  });

  test("campanhas — listagem e detalhe com timeline", async ({ page }) => {
    await page.goto(`${CREATOR_BASE}/campaigns`);
    await expect(page.getByRole("heading", { name: "Campanhas" })).toBeVisible();
    await expect(page.getByText("Lançamento NovaTech X3").first()).toBeVisible();

    await page.goto(`${CREATOR_BASE}/campaigns/campaign_demo_launch_x3`);
    await expect(page.getByText("Timeline de entregas")).toBeVisible();
  });

  test("perfil — métricas e portfólio", async ({ page }) => {
    await page.goto(`${CREATOR_BASE}/profile/influencer_demo_ana`);
    await expect(page.getByText("Ana Creator").first()).toBeVisible();
    await expect(page.getByText("Métricas por plataforma")).toBeVisible();
    await expect(page.getByText("instagram", { exact: true }).first()).toBeVisible();
  });

  test("inbox — threads unificadas", async ({ page }) => {
    await page.goto(`${CREATOR_BASE}/inbox`);
    await expect(page.getByRole("heading", { name: "Inbox Unificada" })).toBeVisible();
    await expect(page.getByPlaceholder("Buscar conversas...")).toBeVisible();
  });

  test("performance — painel de métricas", async ({ page }) => {
    await page.goto(`${CREATOR_BASE}/performance`);
    await expect(page.getByRole("heading", { name: "Painel de Performance" })).toBeVisible();
    await expect(page.getByText("Alcance", { exact: true }).first()).toBeVisible();
  });
});

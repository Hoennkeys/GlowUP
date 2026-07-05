import { test, expect } from "@playwright/test";
import { loginAsMember } from "./helpers";

test.describe("Plataforma Influenciador — fluxos core (§7)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsMember(page);
  });

  test("onboarding exibe wizard em 3 passos", async ({ page }) => {
    await page.goto("/t/demo/app/creator/onboarding");
    await expect(page.getByRole("heading", { name: "Onboarding Creator" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Perfil" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Redes sociais" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Portfólio" })).toBeVisible();
  });

  test("campanhas lista cards e abre detalhe", async ({ page }) => {
    await page.goto("/t/demo/app/creator/campaigns");
    await expect(page.getByRole("heading", { name: "Campanhas" })).toBeVisible();
    await page.getByRole("link", { name: /Lançamento NovaTech/i }).click();
    await expect(page).toHaveURL(/\/creator\/campaigns\/campaign_demo_launch_x3/);
    await expect(page.getByText("Timeline de entregas")).toBeVisible();
    await expect(page.getByText("Enviar entrega")).toBeVisible();
  });

  test("perfil de influencer carrega métricas", async ({ page }) => {
    await page.goto("/t/demo/app/creator/profile/influencer_demo_ana");
    await expect(page.getByText("Ana Creator")).toBeVisible();
    await expect(page.getByText("Métricas por plataforma")).toBeVisible();
  });

  test("inbox unificada exibe threads", async ({ page }) => {
    await page.goto("/t/demo/app/creator/inbox");
    await expect(page.getByRole("heading", { name: "Inbox Unificada" })).toBeVisible();
  });

  test("painel de performance exibe métricas", async ({ page }) => {
    await page.goto("/t/demo/app/creator/performance?campaignId=campaign_demo_launch_x3");
    await expect(page.getByRole("heading", { name: "Painel de Performance" })).toBeVisible();
    await expect(page.getByText("Alcance")).toBeVisible();
  });
});

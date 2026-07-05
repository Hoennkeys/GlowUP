#!/usr/bin/env npx tsx
/**
 * Job de sincronização de métricas sociais — executar via cron (staging/prod).
 *
 * Uso:
 *   npx tsx scripts/sync-social-metrics.ts
 *   npx tsx scripts/sync-social-metrics.ts --dry-run
 */
import { syncAllPlatformMetrics } from "../integrations/social";

const DEMO_HANDLES = [
  { platform: "instagram" as const, handle: "@anacreator" },
  { platform: "tiktok" as const, handle: "@anacreator" },
  { platform: "youtube" as const, handle: "@anacreator" },
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log(`[sync-social-metrics] Iniciando${dryRun ? " (dry-run)" : ""}…`);

  const metrics = await syncAllPlatformMetrics(DEMO_HANDLES);

  for (const m of metrics) {
    console.log(
      `  ${m.platform.padEnd(10)} ${m.handle.padEnd(16)} ` +
        `${m.seguidores ?? m.inscritos ?? "—"} followers · fetched ${m.fetchedAt}`,
    );
  }

  if (dryRun) {
    console.log("[sync-social-metrics] Dry-run — nenhum dado persistido.");
    return;
  }

  // Placeholder: persistir em TenantCrmSnapshot.influencer.profiles[].metricasSociais
  console.log(`[sync-social-metrics] ${metrics.length} perfis sincronizados (mock persist).`);
}

main().catch((err) => {
  console.error("[sync-social-metrics] Erro:", err);
  process.exit(1);
});

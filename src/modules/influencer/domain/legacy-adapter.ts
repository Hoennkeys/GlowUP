import type { TenantCrmSnapshot } from "@/lib/db/types";
import type { InfluencerPlatformSnapshot } from "../../../../types/influencer-platform";
import { EMPTY_INFLUENCER_SNAPSHOT } from "../../../../types/influencer-platform";
import { buildMockInfluencerForTenant } from "../data/mock-influencer-data";

/**
 * Hidrata snapshot da plataforma de influenciadores.
 * Prioridade: campo persistido → mock enriquecido para demo.
 */
export function hydrateInfluencerPlatform(
  tenantId: string,
  state: Partial<TenantCrmSnapshot>,
): InfluencerPlatformSnapshot {
  if (state.influencer?.profiles.length) {
    return state.influencer;
  }
  return buildMockInfluencerForTenant(tenantId, state);
}

export function mergeInfluencerSnapshot(
  current: InfluencerPlatformSnapshot,
  patch: Partial<InfluencerPlatformSnapshot>,
): InfluencerPlatformSnapshot {
  return {
    profiles: patch.profiles ?? current.profiles,
    entregas: patch.entregas ?? current.entregas,
    checklists: patch.checklists ?? current.checklists,
    contratos: patch.contratos ?? current.contratos,
    paineis: patch.paineis ?? current.paineis,
    pagamentos: patch.pagamentos ?? current.pagamentos,
  };
}

export function emptyInfluencerSnapshot(): InfluencerPlatformSnapshot {
  return structuredClone(EMPTY_INFLUENCER_SNAPSHOT);
}

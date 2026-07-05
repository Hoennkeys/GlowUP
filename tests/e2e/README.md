# E2E Tests

Scripts Playwright para fluxos críticos. Configuração em [`playwright.config.ts`](../playwright.config.ts).

> O plano original referencia `tests/e2e/` — neste repositório os specs ficam em **`e2e/`** (padrão Playwright).

## Specs

| Arquivo                       | Escopo                                                         |
| ----------------------------- | -------------------------------------------------------------- |
| `influencer-platform.spec.ts` | Etapas 7–9 — onboarding, campanhas, perfil, inbox, performance |
| `communications-hub.spec.ts`  | Redirects Communications Hub                                   |
| `multi-portal.spec.ts`        | Portais multi-tenant                                           |
| `workspace-entry.spec.ts`     | Entrada no workspace                                           |
| `sales-focus.spec.ts`         | Fluxos comerciais                                              |
| `chamados-chat.spec.ts`       | Chamados + chat                                                |

## Comandos

```bash
npm run test:e2e                                          # todos
npm run test:e2e -- e2e/influencer-platform.spec.ts       # plataforma influencer
npm run test:all                                            # unit + e2e
```

## CI

O workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) executa `influencer-platform.spec.ts` em cada PR.

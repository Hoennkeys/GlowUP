# Screenshots — Telas Críticas

Pasta reservada para capturas de tela das telas críticas do GlowUP, usadas como referência visual durante a migração para plataforma de influenciadores.

## Como capturar

1. Inicie o app: `npm run dev`
2. Acesse com tenant demo: `http://localhost:3000/t/demo/app/`
3. Login: credenciais em `src/lib/auth/mock-users.ts`

## Telas prioritárias

| Arquivo sugerido           | Rota                                | Descrição                  |
| -------------------------- | ----------------------------------- | -------------------------- |
| `01-login.png`             | `/login`                            | Tela de login split-screen |
| `02-creator-dashboard.png` | `/t/demo/app/creator/`              | Creator Workspace          |
| `03-pipeline-vendas.png`   | `/t/demo/app/funil/pipeline-vendas` | Pipeline de parcerias      |
| `04-inbox.png`             | `/t/demo/app/communications/inbox`  | Inbox unificada            |
| `05-painel.png`            | `/t/demo/app/painel`                | Dashboard de receita       |
| `06-campaigns.png`         | `/t/demo/app/creator/campaigns`     | Lista de campanhas         |
| `07-brand-portal.png`      | `/t/demo/portal/`                   | Portal da marca            |
| `08-configuracoes.png`     | `/t/demo/app/configuracoes`         | Configurações              |

## Status

Screenshots serão adicionados manualmente ou via Playwright visual regression na Etapa de QA.

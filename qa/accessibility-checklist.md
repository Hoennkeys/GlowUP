# Checklist de Acessibilidade — WCAG 2.1 AA

> **Etapa 9** — auditoria manual para fluxos creator/influencer

---

## Fluxos a auditar

- [ ] Onboarding (`/creator/onboarding`) — labels, foco, contraste
- [ ] Campanhas + detalhe + upload
- [ ] Perfil creator
- [ ] Inbox unificada
- [ ] Painel de performance

---

## Critérios WCAG 2.1 AA (amostra)

| Critério | Verificação | Status |
| --- | --- | --- |
| 1.1.1 Conteúdo não textual | Alt text em avatares e previews | ⬜ |
| 1.3.1 Info e relações | Headings hierárquicos (h1 → h2) | ⬜ |
| 1.4.3 Contraste | Texto ≥ 4.5:1, tokens creator | ⬜ |
| 2.1.1 Teclado | Navegação tab em wizard onboarding | ⬜ |
| 2.4.3 Ordem de foco | Modal upload, timeline aprovação | ⬜ |
| 2.4.7 Foco visível | `:focus-visible` nos GlowButton | ⬜ |
| 3.3.2 Labels | GlowInput com label associado | ⬜ |
| 4.1.2 Nome, função, valor | Botões com texto ou aria-label | ⬜ |

---

## Ferramentas recomendadas

- [axe DevTools](https://www.deque.com/axe/devtools/) (Chrome/Firefox)
- Lighthouse Accessibility (Chrome DevTools)
- Navegação apenas por teclado (Tab, Enter, Esc)

---

## Registro de issues

| ID | Página | Severidade | Descrição | Correção |
| --- | --- | --- | --- | --- |
| A11Y-001 | — | — | — | — |

---

## Próximo passo

Sessão de usabilidade com 5–8 creators reais (fora do escopo automatizado) — registrar em `qa/report.md`.

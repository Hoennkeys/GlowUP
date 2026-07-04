# GlowUP Design System — Creator Platform

> Etapa 3 do plano de migração  
> Tokens, guidelines e componentes base para a identidade visual da plataforma de influenciadores.

## Princípios

1. **Visual-first** — conteúdo e mídia em destaque; chrome mínimo
2. **Mobile-first** — layouts responsivos; touch targets ≥ 44px
3. **Energia creator** — cores vibrantes, gradientes suaves, micro-animações
4. **Clareza operacional** — status de campanha e entrega sempre visíveis

## Paleta

| Token                | Hex       | Uso                            |
| -------------------- | --------- | ------------------------------ |
| `primary`            | `#FF4D8A` | CTAs, links, campanhas ativas  |
| `accent`             | `#7C3AED` | Badges, gradientes, highlights |
| `neutral.text`       | `#0F172A` | Texto principal                |
| `neutral.background` | `#F8FAFC` | Fundo de página                |
| `semantic.success`   | `#10B981` | Entrega aprovada, concluído    |
| `semantic.warning`   | `#F59E0B` | Pendente, pausado              |
| `semantic.error`     | `#EF4444` | Rejeitado, erro                |

Fonte canônica: [`tokens.json`](./tokens.json)

## Tipografia

| Escala          | Tamanho | Uso               |
| --------------- | ------- | ----------------- |
| `text-xs`       | 12px    | Labels, meta      |
| `text-sm`       | 14px    | Corpo secundário  |
| `text-base`     | 16px    | Corpo principal   |
| `text-lg`       | 18px    | Subtítulos        |
| `text-xl`–`4xl` | 20–36px | Títulos de página |

**Display:** Inter (semibold/bold para títulos)  
**Body:** Inter (regular/medium para corpo)

Classes utilitárias GlowUP em `src/styles.css`:

- `.glowup-heading` — título de seção
- `.glowup-subheading` — subtítulo muted
- `.glowup-gradient-text` — texto com gradiente brand

## Componentes atômicos (`src/ui/`)

Wrappers sobre shadcn/ui com tokens creator aplicados:

| Componente | Arquivo           | Base shadcn          |
| ---------- | ----------------- | -------------------- |
| GlowAvatar | `glow-avatar.tsx` | Avatar               |
| GlowCard   | `glow-card.tsx`   | Card                 |
| GlowBadge  | `glow-badge.tsx`  | Badge                |
| GlowButton | `glow-button.tsx` | Button               |
| GlowTag    | `glow-tag.tsx`    | Badge (variant tag)  |
| GlowInput  | `glow-input.tsx`  | Input                |
| GlowModal  | `glow-modal.tsx`  | Dialog               |
| GlowPlayer | `glow-player.tsx` | Custom (video/image) |

Import centralizado:

```tsx
import { GlowCard, GlowBadge, GlowButton } from "@/ui";
```

## Componentes de domínio (`src/components/`)

| Componente        | Descrição                                |
| ----------------- | ---------------------------------------- |
| `CardInfluencer`  | Card de perfil com foto, nicho, métricas |
| `CampaignCard`    | Card de campanha com status visual e CTA |
| `MediaUploader`   | Drag-drop, preview, versões              |
| `MediaPlayer`     | Player multimídia (vídeo/imagem)         |
| `Inbox`           | Lista de threads com filtros e tags      |
| `TimelineEntrega` | Timeline de entregas e aprovações        |

## Tom de voz (microcopy)

| Contexto    | Tom                 | Exemplo                                     |
| ----------- | ------------------- | ------------------------------------------- |
| Sucesso     | Celebratório, breve | "Entrega aprovada! 🎉"                      |
| Pendente    | Neutro, orientador  | "Aguardando revisão da marca"               |
| Erro        | Claro, sem culpa    | "Não foi possível enviar. Tente novamente." |
| Empty state | Encorajador         | "Nenhuma campanha ainda — crie a primeira!" |
| CTA         | Ação direta         | "Enviar entrega", "Ver perfil", "Aprovar"   |

**Evitar:** jargão CRM ("lead", "funil", "oportunidade") na UI creator-facing.  
**Preferir:** campanha, parceria, entrega, creator, marca.

## Aplicação dos tokens

### CSS custom properties

Tokens creator registrados em `src/styles.css`:

```css
--creator-primary: oklch(0.68 0.22 350);
--creator-accent: oklch(0.55 0.25 290);
--creator-neutral-text: oklch(0.21 0.03 260);
--creator-neutral-bg: oklch(0.985 0.005 260);
```

Classes Tailwind: `bg-creator-primary`, `text-creator-accent`, etc.

### White-label

Tenants podem sobrescrever `--primary` via `apply-theme.ts`. Tokens `--creator-*` permanecem como identidade da plataforma.

## Storybook

```bash
npm run storybook        # dev server em :6006
npm run build-storybook  # build estático
```

Stories em `storybook/stories/` — componentes atômicos e de domínio.

## Referências

- [`tokens.json`](./tokens.json) — tokens canônicos
- [`src/styles.css`](../src/styles.css) — implementação CSS
- [`src/ui/`](../src/ui/) — componentes base
- [`.cursor/plans/change.plan.md`](../.cursor/plans/change.plan.md) — plano completo

# Storybook — GlowUP Creator Platform

Catálogo visual dos componentes atômicos (`src/ui/`) e de domínio (`src/components/`).

## Comandos

```bash
npm run storybook        # Dev server → http://localhost:6006
npm run build-storybook  # Build estático em storybook-static/
```

> **Nota:** Storybook 8 requer `legacy-peer-deps` com Vite 7 (configurado em `.npmrc`).

## Estrutura

```
storybook/
└── stories/
    ├── ui-atomic.stories.tsx      # GlowBadge, GlowButton, GlowAvatar, GlowCard
    └── domain-influencer.stories.tsx  # CardInfluencer, CampaignCard, Inbox, TimelineEntrega
```

Configuração em `.storybook/main.ts` e `.storybook/preview.ts` (importa `src/styles.css`).

## Stories disponíveis

| Story                              | Componente          |
| ---------------------------------- | ------------------- |
| UI/Atomic/Badges                   | GlowBadge variants  |
| UI/Atomic/Buttons                  | GlowButton variants |
| UI/Atomic/Avatar                   | GlowAvatar sizes    |
| UI/Atomic/Card                     | GlowCard hover      |
| Domain/Influencer/InfluencerCard   | CardInfluencer      |
| Domain/Influencer/Campaign Card    | CampaignCard        |
| Domain/Influencer/InboxPanel       | Inbox               |
| Domain/Influencer/DeliveryTimeline | TimelineEntrega     |

## Adicionar nova story

```tsx
// storybook/stories/my-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "@/components/MyComponent";

const meta: Meta = { title: "Domain/MyComponent", tags: ["autodocs"] };
export default meta;

export const Default: StoryObj = {
  render: () => <MyComponent />,
};
```

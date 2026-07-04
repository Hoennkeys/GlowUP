import type { Meta, StoryObj } from "@storybook/react";
import { GlowBadge, GlowButton, GlowAvatar, GlowCard, GlowCardContent } from "@/ui";

const meta: Meta = {
  title: "UI/Atomic",
  tags: ["autodocs"],
};

export default meta;

export const Badges: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <GlowBadge>Primary</GlowBadge>
      <GlowBadge variant="accent">Accent</GlowBadge>
      <GlowBadge variant="success">Aprovado</GlowBadge>
      <GlowBadge variant="warning">Pendente</GlowBadge>
      <GlowBadge variant="outline">Outline</GlowBadge>
    </div>
  ),
};

export const Buttons: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <GlowButton>Enviar entrega</GlowButton>
      <GlowButton variant="accent">Ver campanha</GlowButton>
      <GlowButton variant="outline">Cancelar</GlowButton>
      <GlowButton variant="ghost">Ver perfil</GlowButton>
    </div>
  ),
};

export const Avatar: StoryObj = {
  render: () => (
    <div className="flex gap-4 items-center">
      <GlowAvatar alt="Ana Creator" fallback="AC" size="lg" ring />
      <GlowAvatar alt="João" fallback="JC" size="md" />
      <GlowAvatar alt="Maria" fallback="M" size="sm" />
    </div>
  ),
};

export const Card: StoryObj = {
  render: () => (
    <GlowCard hover className="w-72">
      <GlowCardContent className="p-4">
        <p className="font-semibold">GlowUP Card</p>
        <p className="text-sm text-muted-foreground mt-1">Hover para elevar</p>
      </GlowCardContent>
    </GlowCard>
  ),
};

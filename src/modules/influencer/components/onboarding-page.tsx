import * as React from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Sparkles, UserPlus, Link2, ImagePlus } from "lucide-react";
import { CardInfluencer } from "@/components/CardInfluencer";
import { GlowButton, GlowCard, GlowCardContent, GlowInput } from "@/ui";
import { useInfluencer } from "../store/influencer-context";

const STEPS = [
  { id: 1, title: "Perfil", icon: UserPlus },
  { id: 2, title: "Redes sociais", icon: Link2 },
  { id: 3, title: "Portfólio", icon: ImagePlus },
] as const;

export function OnboardingPage() {
  const { tenantSlug } = useParams({ from: "/t/$tenantSlug/app/creator/onboarding" });
  const { profiles, atualizarProfile } = useInfluencer();
  const [step, setStep] = React.useState(1);
  const profile = profiles[0];

  const [form, setForm] = React.useState({
    nome: profile?.nome ?? "",
    handle: profile?.handle ?? "",
    nicho: profile?.nicho ?? "",
    bio: profile?.bio ?? "",
  });

  const handleSaveProfile = () => {
    if (!profile) return;
    atualizarProfile(profile.id, {
      nome: form.nome,
      handle: form.handle,
      nicho: form.nicho,
      bio: form.bio,
    });
    setStep(2);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <Sparkles className="h-8 w-8 text-creator-primary mx-auto" />
        <h1 className="text-2xl font-semibold glowup-heading">Onboarding Creator</h1>
        <p className="text-sm text-muted-foreground">
          Configure seu perfil, conecte redes e monte seu portfólio em poucos passos.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              step === s.id
                ? "bg-creator-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.title}
          </button>
        ))}
      </div>

      {step === 1 && profile ? (
        <GlowCard>
          <GlowCardContent className="p-6 space-y-4">
            <GlowInput
              label="Nome"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            />
            <GlowInput
              label="Handle"
              value={form.handle}
              onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))}
              placeholder="@seuhandle"
            />
            <GlowInput
              label="Nicho"
              value={form.nicho ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, nicho: e.target.value }))}
              placeholder="Beauty, Tech, Lifestyle…"
            />
            <GlowInput
              label="Bio"
              value={form.bio ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
            <GlowButton onClick={handleSaveProfile} className="w-full">
              Salvar e continuar
            </GlowButton>
          </GlowCardContent>
        </GlowCard>
      ) : null}

      {step === 2 && profile ? (
        <GlowCard>
          <GlowCardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Conecte suas redes para importar métricas públicas (mock — integração real na etapa 8).
            </p>
            {profile.plataformas.map((p) => (
              <div key={p} className="flex items-center justify-between rounded-lg border p-3">
                <span className="capitalize font-medium">{p}</span>
                <GlowBadgeConnected />
              </div>
            ))}
            <GlowButton onClick={() => setStep(3)} className="w-full">
              Continuar para portfólio
            </GlowButton>
          </GlowCardContent>
        </GlowCard>
      ) : null}

      {step === 3 && profile ? (
        <div className="space-y-4">
          <CardInfluencer
            profile={{ ...profile, ...form }}
            onViewProfile={() => {}}
          />
          <GlowButton asChild className="w-full">
            <Link to="/t/$tenantSlug/app/creator/profile/$profileId" params={{ tenantSlug, profileId: profile.id }}>
              Ver perfil completo
            </Link>
          </GlowButton>
          <GlowButton variant="outline" asChild className="w-full">
            <Link to="/t/$tenantSlug/app/creator/campaigns" params={{ tenantSlug }}>
              Ir para campanhas
            </Link>
          </GlowButton>
        </div>
      ) : null}
    </div>
  );
}

function GlowBadgeConnected() {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
      Conectado (mock)
    </span>
  );
}

import { Badge } from "@/components/ui/badge";

const PIPELINE_STEPS = [
  { label: "Prospecção", value: 34, weightClass: "text-foreground/60 font-semibold" },
  { label: "Qualificação", value: 21, weightClass: "text-foreground/75 font-bold" },
  { label: "Proposta", value: 14, weightClass: "text-foreground/90 font-bold" },
  { label: "Negociação", value: 8, weightClass: "text-foreground font-extrabold" },
  { label: "Fechamento", value: 5, weightClass: "text-primary font-black" }, 
] as const;

// AUMENTADO: Aumentamos a altura para dar muito mais espaço vertical ao gráfico e às caixas
const CHART_HEIGHT = 200; 
const CHART_WIDTH = 500;

export function LoginPipelinePanel() {
  const totalSteps = PIPELINE_STEPS.length;
  
  // Mapeamento dos pontos com calibração de altura para não colarem nas bordas
  const points = PIPELINE_STEPS.map((step, index) => {
    const x = (index / (totalSteps - 1)) * CHART_WIDTH;
    const progressRatio = index / (totalSteps - 1);
    
    // Deixamos uma margem de segurança de 45px no topo e 25px na base para o visual HUD respirar
    const targetHeight = CHART_HEIGHT - 70;
    const y = CHART_HEIGHT - (progressRatio * targetHeight) - 25;
    
    return { 
      x, 
      y, 
      label: step.label, 
      value: step.value,
      weightClass: step.weightClass,
      isFinalObjective: index === totalSteps - 1 
    };
  });

  return (
    <div className="flex h-full flex-col justify-center px-12 py-16 xl:px-20">
      <div className="mx-auto w-full max-w-xl space-y-8"> {/* Aumentado max-w-lg para max-w-xl para dar ganho de largura horizontal */}
        <div className="space-y-4">
          <p className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Pipeline Inteligente
          </p>
          <h2 className="text-4xl leading-tight font-semibold tracking-tight text-balance">
            Seu time fecha mais.{" "}
            <span className="text-primary">Você vê por quê.</span>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Visibilidade total do funil, do primeiro contato ao contrato assinado — integrado ao
            Grafana em tempo real.
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-sidebar-border bg-background/40 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Scanlines cibernéticas de fundo */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0.002)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px]" />

          <div className="flex items-center justify-between relative z-10">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
              Sequência Operacional do Funil
            </p>
            {/* HUD Status */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <span className="text-primary">SYS_READY</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            </div>
          </div>

          {/* Canvas Operacional Expandido */}
          <div className="relative w-full" style={{ height: CHART_HEIGHT }}>
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                
                <filter id="objectiveGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="6" result="blur1" />
                  <feGaussianBlur stdDeviation="2" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Técnico de Projeção Tática */}
              {points.map((pt, i) => (
                <g key={`tactical-grid-${i}`} className="opacity-15">
                  <line
                    x1={pt.x}
                    y1={0}
                    x2={pt.x}
                    y2={CHART_HEIGHT}
                    className="stroke-primary"
                    strokeDasharray="1 5"
                  />
                  <line
                    x1={0}
                    y1={pt.y}
                    x2={CHART_WIDTH}
                    y2={pt.y}
                    className="stroke-primary"
                    strokeDasharray="1 5"
                  />
                </g>
              ))}

              {/* Linhas de Link Independentes */}
              {points.map((pt, i) => {
                if (i === points.length - 1) return null;
                const nextPt = points[i + 1];
                return (
                  <g key={`link-${i}`}>
                    <line
                      x1={pt.x}
                      y1={pt.y}
                      x2={nextPt.x}
                      y2={nextPt.y}
                      className="stroke-primary/20"
                      strokeWidth="1"
                    />
                    <line
                      x1={pt.x}
                      y1={pt.y}
                      x2={nextPt.x}
                      y2={nextPt.y}
                      className="stroke-primary/50"
                      strokeWidth="1.5"
                      strokeDasharray="4 8"
                    />
                  </g>
                );
              })}

              {/* Renderização das Estações Operacionais */}
              {points.map((pt, i) => {
                if (pt.isFinalObjective) {
                  return (
                    <g key={`node-${i}`} className="cursor-pointer" filter="url(#objectiveGlow)">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="14"
                        className="fill-none stroke-primary/30 animate-[spin_8s_linear_infinite]"
                        strokeDasharray="4 4"
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="10"
                        className="fill-none stroke-primary animate-pulse"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        className="fill-primary stroke-background"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${pt.x - 18} ${pt.y} L ${pt.x - 14} ${pt.y} M ${pt.x + 14} ${pt.y} L ${pt.x + 18} ${pt.y} M ${pt.x} ${pt.y - 18} L ${pt.x} ${pt.y - 14} M ${pt.x} ${pt.y + 14} L ${pt.x} ${pt.y + 18}`}
                        className="stroke-primary/60"
                        strokeWidth="1"
                      />
                    </g>
                  );
                }

                return (
                  <g key={`node-${i}`} filter="url(#nodeGlow)">
                    <line
                      x1={pt.x}
                      y1={pt.y + 8}
                      x2={pt.x}
                      y2={CHART_HEIGHT}
                      className="stroke-primary/30"
                      strokeDasharray="2 2"
                    />
                    <rect
                      x={pt.x - 6}
                      y={pt.y - 6}
                      width="12"
                      height="12"
                      rx="2"
                      className="fill-background stroke-primary/70"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="2"
                      className="fill-primary"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* GRID AJUSTADO: caixas redimensionadas com fontes mono calibradas para evitar estouro de string */}
          <div className="grid grid-cols-5 gap-2.5 pt-2 relative z-10">
            {points.map((pt, i) => (
              <div 
                key={pt.label} 
                className={`flex flex-col items-center justify-between p-2 rounded-lg border text-center transition-all min-w-0 ${
                  pt.isFinalObjective 
                    ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]" 
                    : "bg-background/40 border-sidebar-border/50"
                }`}
              >
                {/* Ajustamos o tamanho da fonte da legenda para text-[9px] e tracking-tighter para garantir o enquadramento */}
                <p className={`text-[11px] font-mono tracking-tighter uppercase truncate w-full ${
                  pt.isFinalObjective ? "text-primary font-bold" : "text-muted-foreground/80"
                }`}>
                  {pt.isFinalObjective ? `🎯 Fechamento` : pt.label}
                </p>
                
                {/* Números com ênfase progressiva e espaçamento correto */}
                <div className={`text-base mt-3 tabular-nums tracking-tight whitespace-nowrap ${pt.weightClass} ${
                  pt.isFinalObjective ? "animate-pulse text-lg" : ""
                }`}>
                  {pt.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 border-t border-sidebar-border/60 pt-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center relative z-10">
            <p className="text-base text-muted-foreground">
              <span className="font-semibold text-foreground">R$ 141k</span> volume total no funil
            </p>
            <p className="text-base text-muted-foreground">
              <span className="font-semibold text-foreground">52</span> <span className="text-muted-foreground/80">negócios ativos</span>
            </p>
            <Badge
              variant="outline"
              className="w-fit border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-medium text-success backdrop-blur-sm"
            >
              +28% vs mês anterior
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
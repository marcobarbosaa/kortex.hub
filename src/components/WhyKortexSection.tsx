import { TrendingUp, Settings2, Server, ChevronRight } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

const cards = [
  {
    icon: TrendingUp,
    label: "01",
    title: "Crescimento Estruturado",
    description: "Construímos sistemas, não conteúdo — cada ação é projetada para gerar resultados mensuráveis e escaláveis.",
    accent: "from-orange-500/30 via-orange-500/10 to-transparent",
    glow: "shadow-orange-500/10",
    badge: "ROI comprovado",
  },
  {
    icon: Settings2,
    label: "02",
    title: "Automação Inteligente",
    description: "Fluxos automatizados com CRM e IA que transformam leads em clientes no piloto automático, 24/7.",
    accent: "from-blue-500/30 via-blue-500/10 to-transparent",
    glow: "shadow-blue-500/10",
    badge: "IA integrada",
  },
  {
    icon: Server,
    label: "03",
    title: "Tecnologia Escalável",
    description: "Stack de desenvolvimento moderno que garante velocidade, performance e escalabilidade sem limites.",
    accent: "from-emerald-500/30 via-emerald-500/10 to-transparent",
    glow: "shadow-emerald-500/10",
    badge: "Cloud-native",
  },
];

const WhyKortexSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useStaggerReveal<HTMLDivElement>();

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* background layers */}
      <div className="absolute inset-0 bg-muted/40" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kortex-orange/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative max-w-[1200px] mx-auto">
        <div ref={headerRef} className="text-center mb-20">
          <span className="why-pill">Por que GABS?</span>

          <h2
            className="font-heading text-foreground tracking-[-0.02em] mt-6"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Tudo que você precisa para{" "}
            <span className="text-gradient-orange">escalar seu negócio</span>
          </h2>

          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            Combinamos estratégia, design e tecnologia em um único sistema de crescimento.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`why-card group`}
            >
              {/* Top gradient accent */}
              <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${card.accent} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Glow on hover */}
              <div className={`absolute inset-0 rounded-2xl ${card.glow} shadow-[0_0_0px] group-hover:shadow-[0_0_40px_0px] transition-shadow duration-500 pointer-events-none`} />

              <div className="relative z-10">
                {/* Number + badge row */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono text-muted-foreground/50 tracking-widest">{card.label}</span>
                  <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20">
                    {card.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-foreground/[0.06] border border-foreground/[0.08] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <card.icon className="w-7 h-7 text-kortex-orange" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{card.description}</p>

                <div className="flex items-center gap-1.5 text-xs text-kortex-orange font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Saiba mais <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyKortexSection;

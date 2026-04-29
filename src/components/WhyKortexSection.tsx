import { TrendingUp, Settings2, Server } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

const cards = [
  {
    icon: TrendingUp,
    title: "Crescimento Estruturado",
    description: "Construímos sistemas, não conteúdo — cada ação é projetada para gerar resultados mensuráveis.",
  },
  {
    icon: Settings2,
    title: "Automação Inteligente",
    description: "Fluxos automatizados com CRM e IA que transformam leads em clientes no piloto automático.",
  },
  {
    icon: Server,
    title: "Tecnologia Escalável",
    description: "Stack de desenvolvimento moderno que garante velocidade, performance e escalabilidade.",
  },
];

const WhyKortexSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useStaggerReveal<HTMLDivElement>();

  return (
    <section id="services" className="section-padding bg-[#111111] relative">
      <div className="max-w-[1200px] mx-auto text-center">
        <div ref={headerRef}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 mb-6">
            Por que Kortex?
          </span>

          <h2
            className="font-heading text-foreground tracking-[-0.02em] mb-16"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Tudo que você precisa para escalar sua{" "}
            <span className="text-gradient-orange">presença digital</span>
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group relative bg-foreground/[0.04] border border-foreground/[0.08] rounded-2xl p-8 text-left backdrop-blur-sm hover:-translate-y-1 hover:border-kortex-orange/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-kortex-orange/10 flex items-center justify-center mb-5">
                <card.icon className="w-6 h-6 text-kortex-orange" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3 font-body">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyKortexSection;

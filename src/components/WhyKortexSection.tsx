import { TrendingUp, Settings2, Server, ArrowRight, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const features = [
  {
    tag: "Crescimento",
    title: "Crescimento que você mede, não que você adivinha.",
    description:
      "Nada de ações aleatórias. Cada sistema que construímos é projetado com métricas claras, funis estratégicos e dashboards em tempo real — para que você veja exatamente onde seu dinheiro está gerando resultado.",
    image: "/why-growth.png",
    icon: TrendingUp,
    points: [
      "Funis de vendas com taxa de conversão monitorada",
      "Dashboards personalizados com KPIs do seu negócio",
      "ROI comprovado em cada entrega",
    ],
    accent: "from-orange-500 to-amber-500",
    accentBorder: "border-orange-500/30",
    accentGlow: "shadow-orange-500/20",
  },
  {
    tag: "Automação",
    title: "Seu negócio trabalhando enquanto você dorme.",
    description:
      "Integramos CRM, e-mail marketing, WhatsApp e IA em fluxos que capturam, qualificam e convertem leads no piloto automático. Menos trabalho manual, mais receita previsível.",
    image: "/why-automation.png",
    icon: Settings2,
    points: [
      "Fluxos automatizados de captura e nutrição de leads",
      "Integração com WhatsApp, e-mail e CRM",
      "IA aplicada para respostas e qualificação automática",
    ],
    accent: "from-blue-500 to-cyan-500",
    accentBorder: "border-blue-500/30",
    accentGlow: "shadow-blue-500/20",
  },
  {
    tag: "Tecnologia",
    title: "Construído para escalar, não para quebrar.",
    description:
      "Usamos o mesmo stack de startups do Vale do Silício — React, Next.js, TypeScript, Supabase — para garantir que sua plataforma aguente 10 ou 10.000 usuários sem travar, sem lentidão.",
    image: "/why-tech.png",
    icon: Server,
    points: [
      "Stack moderno: React, Next.js, TypeScript",
      "Infraestrutura cloud-native escalável",
      "Performance otimizada e tempo de carregamento < 2s",
    ],
    accent: "from-emerald-500 to-teal-500",
    accentBorder: "border-emerald-500/30",
    accentGlow: "shadow-emerald-500/20",
  },
];

const WhyKortexSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

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
            Não vendemos promessas.{" "}
            <span className="text-gradient-orange">Entregamos sistemas.</span>
          </h2>

          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            Três pilares que transformam empresas comuns em máquinas de crescimento digital.
          </p>
        </div>

        {/* Alternating Feature Blocks */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            const Icon = feature.icon;

            return (
              <div
                key={feature.tag}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}
              >
                {/* Image */}
                <div
                  className={`relative group ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div
                    className={`relative rounded-3xl overflow-hidden border ${feature.accentBorder} shadow-2xl ${feature.accentGlow} hover:shadow-3xl transition-shadow duration-500`}
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent`}
                    />
                    {/* Floating tag */}
                    <div
                      className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r ${feature.accent} shadow-lg`}
                    >
                      {feature.tag}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      0{index + 1} — {feature.tag}
                    </span>
                  </div>

                  <h3
                    className="font-heading text-foreground tracking-[-0.02em] mb-5"
                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                  >
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground text-[15px] leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  {/* Bullet points */}
                  <div className="space-y-3 mb-8">
                    {feature.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-gradient-to-br ${feature.accent} flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyKortexSection;

import { Shield, Cpu, Gauge, LineChart } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

const trustCards = [
  { icon: Shield, title: "Arquitetura focada em conversão", desc: "Cada componente é otimizado para taxas máximas de conversão." },
  { icon: Cpu, title: "Stack tecnológico moderno", desc: "Next.js, React e sistemas escaláveis em nuvem." },
  { icon: Gauge, title: "Automação e integração", desc: "Fluxos inteligentes que conectam todo seu ecossistema digital." },
  { icon: LineChart, title: "Decisões orientadas por dados", desc: "Analytics e insights que guiam cada iteração." },
];

const AuthoritySection = () => {
  const leftRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useStaggerReveal<HTMLDivElement>();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0d0a12] to-background" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-kortex-orange/5 blur-[120px]" />

      <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={leftRef}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 mb-6">
            Feito para performance
          </span>

          <h2
            className="font-heading text-foreground tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
          >
            Uma estrutura em que você pode{" "}
            <span className="text-gradient-orange">confiar</span>
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed">
            Projetado com os mesmos padrões usados por empresas de tecnologia de alto crescimento. Cada sistema, cada linha de código, cada pixel — engenheirado para resultados.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trustCards.map((card) => (
            <div
              key={card.title}
              className="group bg-foreground/[0.04] border border-foreground/[0.08] rounded-2xl p-6 hover:-translate-y-1 hover:border-kortex-orange/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-kortex-orange/10 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5 text-kortex-orange" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2 font-body">{card.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthoritySection;

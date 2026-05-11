import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Star } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Lucas Ferreira",
    role: "CEO, TechBridge Solutions",
    content: "A GABS transformou completamente nossa presença digital. Em 3 meses, nosso site saiu de 200 visitas/mês para mais de 5.000, e a conversão triplicou.",
    stars: 5,
    avatar: "LF",
    color: "from-orange-500 to-amber-500",
    metric: "+2.400% em tráfego",
  },
  {
    name: "Camila Santos",
    role: "Fundadora, Bloom Educação",
    content: "As automações que eles montaram me devolveram 20 horas por semana. Meu negócio roda sozinho enquanto eu crio conteúdo. Sem exagero algum.",
    stars: 5,
    avatar: "CS",
    color: "from-pink-500 to-rose-500",
    metric: "20h/semana economizadas",
  },
  {
    name: "Roberto Almeida",
    role: "Diretor, Grupo RA Construtora",
    content: "O Web App que eles desenvolveram substituiu 3 ferramentas que a gente pagava separado. Interface limpa e meus funcionários aprenderam em 1 dia.",
    stars: 5,
    avatar: "RA",
    color: "from-blue-500 to-cyan-500",
    metric: "3 ferramentas substituídas",
  },
  {
    name: "Juliana Costa",
    role: "Head de Marketing, Vox Agency",
    content: "A landing page que fizeram para nosso lançamento converteu 12% — o dobro da média do mercado. A equipe é técnica, rápida e entende de negócios.",
    stars: 5,
    avatar: "JC",
    color: "from-violet-500 to-purple-500",
    metric: "12% de conversão",
  },
  {
    name: "Marcos Oliveira",
    role: "Freelancer, Design & Dev",
    content: "Eles entregaram algo que parece um produto de startup do Vale do Silício. Meus clientes ficam impressionados com o painel toda vez que acessam.",
    stars: 5,
    avatar: "MO",
    color: "from-emerald-500 to-teal-500",
    metric: "NPS dos clientes: 97",
  },
  {
    name: "Ana Beatriz Lima",
    role: "Sócia, Clínica Renove",
    content: "Hoje 40% dos nossos agendamentos vêm do site. Eles abriram nossos olhos com o funil automatizado. Resultado real, não promessa.",
    stars: 4,
    avatar: "AL",
    color: "from-fuchsia-500 to-pink-500",
    metric: "40% de leads via site",
  },
];

const TestimonialsSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-kortex-orange/4 blur-[160px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <span className="why-pill">O que dizem nossos clientes</span>

          <h2
            className="font-heading text-foreground tracking-[-0.02em] mt-6"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Resultados que{" "}
            <span className="text-gradient-orange">falam por si</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-lg">
            Empresas reais com resultados reais. Veja o que nossos parceiros têm a dizer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`testimonial-card group relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 cursor-default ${
                active === i
                  ? "border-kortex-orange/30 scale-[1.02] bg-foreground/[0.06]"
                  : "border-foreground/[0.08] bg-foreground/[0.03]"
              }`}
              style={{
                animationDelay: `${i * 80}ms`,
              }}
            >
              {/* Background sweep on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

              {/* Top metric badge */}
              <div className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4 bg-gradient-to-r ${t.color} text-white`}>
                {t.metric}
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3.5 h-3.5 transition-all duration-300 ${
                      idx < t.stars
                        ? "text-amber-400 fill-amber-400"
                        : "text-foreground/10"
                    } ${active === i ? "scale-110" : ""}`}
                    style={{ transitionDelay: `${idx * 30}ms` }}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 relative z-10">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

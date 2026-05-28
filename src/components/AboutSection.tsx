import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Code, Settings, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const team = [
  {
    name: "Criador de Plataformas",
    role: "Web, Apps & Landing Pages",
    description: "Especialista em construir plataformas robustas, escaláveis e de alta performance para web e dispositivos móveis.",
    icon: Code,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Especialista em Sistemas",
    role: "Automações & Integrações",
    description: "Focado em otimizar processos, integrar ferramentas e criar fluxos inteligentes que rodam no piloto automático.",
    icon: Settings,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Diretor de Arte",
    role: "Design UX/UI",
    description: "Responsável por projetar interfaces modernas, intuitivas e imersivas, focadas na melhor experiência do usuário.",
    icon: Palette,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  }
];

const AboutSection = () => {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="sobre" className="section-padding relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="relative max-w-[1200px] mx-auto text-center" ref={revealRef}>
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 mb-6">
          Sobre Nós
        </span>
        
        <h2 className="font-heading text-foreground tracking-[-0.02em] mb-6" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
          Quem constrói o <span className="text-gradient-orange">Ecossistema</span>
        </h2>
        
        <p className="text-muted-foreground max-w-2xl mx-auto mb-16 text-lg">
          Somos um time de especialistas focados em unir código impecável, automações poderosas e um design de ponta para elevar o nível do seu negócio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="border-border bg-card/50 backdrop-blur-sm hover:border-kortex-orange/30 transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${member.bg} border border-white/5`}>
                  <member.icon className={`w-8 h-8 ${member.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1 font-body">{member.name}</h3>
                <p className="text-kortex-orange font-bold text-xs mb-4 uppercase tracking-widest">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

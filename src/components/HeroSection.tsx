import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CyberneticGridShader from "./CyberneticGridShader";

const HeroSection = () => {
  const leftRef = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Cybernetic WebGL Background */}
      <CyberneticGridShader />

      {/* Top/bottom fade for blending into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      <div className="relative max-w-[900px] mx-auto px-6 py-32 flex flex-col items-center text-center w-full z-20">
        <div ref={leftRef} className="space-y-8 flex flex-col items-center">
          <span className="relative overflow-hidden inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 transition-all duration-500 hover:bg-kortex-orange/20 hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--kortex-orange)/0.2)]">
            <div className="absolute inset-0 hero-grid-bg opacity-20 pointer-events-none" />
            <div
              className="absolute top-0 left-0 h-full w-[30px] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(var(--kortex-orange) / 0.5), transparent)",
                animation: "beam-sweep 3s ease-in-out infinite",
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Sistema de Crescimento Digital
            </span>
          </span>

          <h1 className="font-heading leading-[1.1] tracking-[-0.02em] max-w-4xl" style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}>
            <span className="text-gradient-foreground">Páginas que convertem. Sistemas robustos.</span>{" "}
            <span className="text-gradient-orange">Automações inteligentes.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-body">
            Desenvolvemos o ecossistema digital completo para a sua empresa. Da Landing Page focada em vendas ao Web App exclusivo, conectado a automações de CRM que eliminam tarefas manuais e escalam seus resultados.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="hero" size="xl" className="group" onClick={() => navigate('/register')}>
              Comece seu sistema de crescimento 
            </Button>
          </div>

          <p className="text-sm text-muted-foreground flex items-center justify-center gap-3">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-kortex-orange" /> Tecnologia moderna</span>
            <span className="text-border">•</span>
            <span>Stack de alta performance</span>
          </p>
        </div>
      </div>
    </section>
  );
};


export default HeroSection;

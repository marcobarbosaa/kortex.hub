import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HoloSystem from "./HoloSystem";
import CyberneticGridShader from "./CyberneticGridShader";

const HeroSection = () => {
  const leftRef = useScrollReveal<HTMLDivElement>();
  const rightRef = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Cybernetic WebGL Background */}
      <CyberneticGridShader />

      {/* Top/bottom fade for blending into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center w-full">
        <div ref={leftRef} className="space-y-8">
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

          <h1 className="font-heading leading-[1.1] tracking-[-0.02em]" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
            <span className="text-gradient-foreground">Seu negócio não precisa de mais posts. Precisa de um sistema que</span>{" "}
            <span className="text-gradient-orange">realmente escala.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed font-body">
            A Kortex combina estratégia, design e tecnologia para transformar sua presença digital em um motor de crescimento de alta performance — sem achismos ou esforço manual.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="xl" className="group" onClick={() => navigate('/register')}>
              Comece seu sistema de crescimento 
            </Button>
          </div>

          <p className="text-sm text-muted-foreground flex items-center gap-3">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-kortex-orange" /> Tecnologia moderna</span>
            <span className="text-border">•</span>
            <span>Stack de alta performance</span>
          </p>
        </div>

        <div ref={rightRef} className="relative h-[500px] hidden lg:block scale-110 translate-x-10">
          <HoloSystem />
        </div>
      </div>
    </section>
  );
};


export default HeroSection;

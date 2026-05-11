import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Zap, ArrowRight, Users, TrendingUp, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CyberneticGridShader from "./CyberneticGridShader";
import { useEffect, useRef } from "react";

const STATS = [
  { icon: Users, value: "2.400+", label: "Empresas atendidas" },
  { icon: TrendingUp, value: "340%", label: "Crescimento médio" },
  { icon: Star, value: "4.9", label: "Avaliação dos clientes" },
];

const HeroSection = () => {
  const leftRef = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Floating particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 136, 0, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* WebGL grid background */}
      <CyberneticGridShader />

      {/* Canvas particles layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[5] pointer-events-none" />

      {/* Radial glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-kortex-orange/8 blur-[120px] pointer-events-none z-[6]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] pointer-events-none z-[6]" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      {/* Content */}
      <div className="relative max-w-[1000px] mx-auto px-6 py-32 flex flex-col items-center text-center w-full z-20">
        <div ref={leftRef} className="flex flex-col items-center space-y-8">

          {/* Badge */}
          <div className="hero-badge">
            <div className="hero-badge-beam" />
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-kortex-orange" />
              <span>Sistema de Crescimento Digital</span>
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-heading leading-[1.05] tracking-[-0.03em] max-w-[900px]"
            style={{ fontSize: "clamp(2.6rem, 6.5vw, 5rem)" }}>
            <span className="text-gradient-foreground">Páginas que convertem.</span>
            <br />
            <span className="text-gradient-orange hero-text-glow">Automações inteligentes.</span>
          </h1>

          {/* Sub */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-[680px] leading-relaxed">
            Desenvolvemos o ecossistema digital completo para sua empresa escalar — do funil ao Web App, com automação de CRM que trabalha por você.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button
              onClick={() => navigate("/register")}
              className="hero-cta-primary group"
            >
              <span>Comece agora gratuitamente</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a href="#consultancy" className="hero-cta-secondary">
              Consultoria grátis
            </a>
          </div>

          {/* Social proof row */}
          <div className="flex flex-col sm:flex-row items-center gap-8 pt-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <div className="hero-stat-icon">
                  <stat.icon className="w-4 h-4 text-kortex-orange" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-foreground leading-none">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

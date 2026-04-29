import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useNavigate } from "react-router-dom";

const benefits = [
  "Sistema de crescimento estruturado, não ações aleatórias",
  "Rápido, escalável e focado em conversão",
  "Construído para performance a longo prazo",
];

const CTASection = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-kortex-orange/8 blur-[150px]" />

      <div ref={ref} className="relative max-w-[700px] mx-auto text-center">
        <h2
          className="font-heading text-foreground tracking-[-0.02em] mb-8"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
        >
          Pronto para transformar seu negócio em uma{" "}
          <span className="text-gradient-orange">máquina de crescimento?</span>
        </h2>

        <div className="flex flex-col items-center gap-3 mb-10">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-3 text-muted-foreground text-sm">
              <Check className="w-4 h-4 text-kortex-orange flex-shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="hero" size="xl" onClick={() => navigate('/register')}>
            Começar agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

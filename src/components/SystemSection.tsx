import { Layout, Code2, Settings2, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";

const servicesData = [
  {
    title: "LPs & Funis",
    description: "Desenvolvemos Landing Pages de alta performance integradas a funis estratégicos que guiam o cliente desde a descoberta até o checkout.",
    icon: Layout,
    color: "bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
    iconColor: "text-blue-500",
    features: ["Copy focado em vendas", "Tracking avançado", "Otimização de checkout"]
  },
  {
    title: "Web Apps & Sistemas",
    description: "Construímos aplicações robustas e escaláveis, desde painéis administrativos até plataformas SaaS completas com as melhores tecnologias do mercado.",
    icon: Code2,
    color: "bg-orange-500/10 border-orange-500/20 shadow-orange-500/5",
    iconColor: "text-orange-500",
    features: ["Next.js & TypeScript", "Escalabilidade", "UX de alto nível"]
  },
  {
    title: "Automações CRM",
    description: "Integramos todo o seu ecossistema digital para que você ganhe produtividade com fluxos inteligentes que rodam no piloto automático.",
    icon: Settings2,
    color: "bg-red-500/10 border-red-500/20 shadow-red-500/5",
    iconColor: "text-red-500",
    features: ["Integração n8n/Zapier", "Setup de CRM", "Gestão de leads"]
  }
];

const SystemSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const carouselRef = useScrollReveal<HTMLDivElement>();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  const ServiceCard = ({ service, index, isStatic = false }: { service: typeof servicesData[0], index: number, isStatic?: boolean }) => (
    <Card 
      onClick={() => !isStatic && setSelectedService(index)}
      className={`border-2 backdrop-blur-sm transition-all duration-500 ${!isStatic ? 'hover:translate-y-[-8px] cursor-pointer' : ''} ${service.color} h-full`}
    >
      <CardContent className="p-8 flex flex-col h-full text-left">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-background/50 border border-white/5`}>
          <service.icon className={`w-7 h-7 ${service.iconColor}`} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-4 font-body">{service.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
          {service.description}
        </p>
        <ul className="space-y-3">
          {service.features.map((feature, fIndex) => (
            <li key={fIndex} className="flex items-center gap-2 text-xs text-foreground/80 font-medium">
              <CheckCircle2 className={`w-3.5 h-3.5 ${service.iconColor}`} />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-kortex-orange/5 blur-[150px]" />

      <div className="relative max-w-[1200px] mx-auto text-center">
        <div ref={headerRef}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 mb-6">
            Serviços & Soluções
          </span>

          <h2
            className="font-heading text-foreground tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Tudo que você precisa para <span className="text-gradient-orange">dominar o mercado</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto mb-16 text-lg">
            Nossa stack de serviços foi projetada para cobrir todos os pontos de contato da jornada do seu cliente.
          </p>
        </div>

        <div ref={carouselRef} className="px-12 relative min-h-[400px]">
          {selectedService !== null ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="w-full max-w-md">
                <ServiceCard service={servicesData[selectedService]} index={selectedService} isStatic />
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedService(null)}
                className="mt-12 text-muted-foreground hover:text-kortex-orange group gap-2"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Ver todos os serviços
              </Button>
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {servicesData.map((service, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <ServiceCard service={service} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-20px] lg:left-[-40px] bg-kortex-orange/10 border-kortex-orange/20 text-kortex-orange hover:bg-kortex-orange hover:text-white" />
              <CarouselNext className="absolute right-[-20px] lg:right-[-40px] bg-kortex-orange/10 border-kortex-orange/20 text-kortex-orange hover:bg-kortex-orange hover:text-white" />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default SystemSection;

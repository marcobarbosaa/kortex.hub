import { Layout, Code2, Settings2, ArrowLeft, Palette, ArrowRight, PenTool } from "lucide-react";
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
    color: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
    accentColor: "from-blue-500/20",
    image: "/service-lp.png",
    tag: "Alta Conversão",
  },
  {
    title: "Web Apps & Sistemas",
    description: "Construímos aplicações robustas e escaláveis, desde painéis administrativos até plataformas SaaS completas.",
    icon: Code2,
    color: "bg-orange-500/10 border-orange-500/20",
    iconColor: "text-orange-500",
    accentColor: "from-orange-500/20",
    image: "/service-webapp.png",
    tag: "Escalável",
  },
  {
    title: "Automações CRM",
    description: "Integramos todo o seu ecossistema digital para que você ganhe produtividade com fluxos inteligentes que rodam no piloto automático.",
    icon: Settings2,
    color: "bg-red-500/10 border-red-500/20",
    iconColor: "text-red-500",
    accentColor: "from-red-500/20",
    image: "/service-crm.png",
    tag: "Piloto Automático",
  },
  {
    title: "Design UX/UI",
    description: "Criamos interfaces modernas, intuitivas e focadas na experiência do usuário para elevar o valor percebido da sua marca.",
    icon: Palette,
    color: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-500",
    accentColor: "from-purple-500/20",
    image: "/service-design.png",
    tag: "Premium",
  },
  {
    title: "Branding & Logo",
    description: "Desenvolvemos identidades visuais memoráveis, desde a criação do logotipo até o manual da marca completo.",
    icon: PenTool,
    color: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-500",
    accentColor: "from-emerald-500/20",
    image: "/service-branding.png",
    tag: "Identidade Única",
  }
];

const SystemSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const carouselRef = useScrollReveal<HTMLDivElement>();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

  const ServiceCard = ({ service, index, isStatic = false }: { service: typeof servicesData[0], index: number, isStatic?: boolean }) => {
    const Icon = service.icon;
    return (
      <Card
        onClick={() => !isStatic && setSelectedService(index)}
        className={`border-2 backdrop-blur-sm transition-all duration-500 overflow-hidden ${!isStatic ? 'hover:translate-y-[-8px] cursor-pointer hover:shadow-2xl' : ''} ${service.color} h-full`}
      >
        <CardContent className="p-0 flex flex-col h-full text-left">
          {/* Image preview area */}
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={service.image}
              alt={`Exemplo de ${service.title}`}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay at bottom of image */}
            <div className={`absolute inset-0 bg-gradient-to-t ${service.accentColor} via-transparent to-transparent`} />
            {/* Tag badge */}
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-background/80 backdrop-blur-sm border border-white/10 ${service.iconColor}`}>
              {service.tag}
            </div>
          </div>

          {/* Content below image */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background/50 border border-white/5 flex-shrink-0">
                <Icon className={`w-5 h-5 ${service.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground font-body">{service.title}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
              {service.description}
            </p>
            {!isStatic && (
              <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${service.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Ver detalhes <ArrowRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

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
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 group">
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

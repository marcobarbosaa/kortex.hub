import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Layout, Code2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

const services = [
  { id: "lp", name: "LPs & Funis", icon: Layout },
  { id: "web", name: "Web Apps", icon: Code2 },
  { id: "auto", name: "Automações", icon: Settings2 },
];

interface Feature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: Feature[];
  featured: boolean;
  label?: string;
}

const plansByCategory: Record<string, Plan[]> = {
  lp: [
    {
      name: "Starter LP",
      price: "1.497",
      period: "/projeto",
      description: "Ideal para validação rápida de ofertas ou produtos únicos.",
      features: [
        { text: "Landing page de alta conversão", included: true },
        { text: "Copywriting persuasivo", included: true },
        { text: "Setup de GA4 & Pixel", included: true },
        { text: "Mobile first design", included: true },
        { text: "Testes A/B", included: false },
        { text: "Hospedagem inclusa", included: false },
      ],
      featured: false,
    },
    {
      name: "Growth Funil",
      price: "2.997",
      period: "/projeto",
      description: "Funil completo para escalar suas vendas e captura de leads.",
      label: "Mais popular",
      features: [
        { text: "3 Landing pages (Venda/Upsell/Obg)", included: true },
        { text: "Copywriting estratégico", included: true },
        { text: "Integração com CRM/Email", included: true },
        { text: "Dashboard de métricas", included: true },
        { text: "Testes A/B avançados", included: true },
        { text: "Suporte prioritário", included: true },
      ],
      featured: true,
    },
    {
      name: "Elite Ecosystem",
      price: "5.497",
      period: "/projeto",
      description: "Ecossistema completo de páginas e funis contínuos.",
      features: [
        { text: "Páginas ilimitadas", included: true },
        { text: "Estratégia de LTV inclusa", included: true },
        { text: "Design exclusivo e premium", included: true },
        { text: "Otimização de checkout", included: true },
        { text: "Consultoria de funil", included: true },
        { text: "SLA de 24h", included: true },
      ],
      featured: false,
    },
  ],
  web: [
    {
      name: "MVP Express",
      price: "4.997",
      period: "/projeto",
      description: "Transforme sua ideia em um produto funcional em tempo recorde.",
      features: [
        { text: "Desenvolvimento Frontend", included: true },
        { text: "Banco de dados básico", included: true },
        { text: "Autenticação", included: true },
        { text: "Dashboard simples", included: true },
        { text: "API externa", included: false },
        { text: "Escalabilidade auto", included: false },
      ],
      featured: false,
    },
    {
      name: "Full App",
      price: "9.897",
      period: "/projeto",
      description: "Aplicação completa e escalável preparada para o mercado.",
      label: "Tecnologia de ponta",
      features: [
        { text: "Frontend & Backend robusto", included: true },
        { text: "Dashboard avançado", included: true },
        { text: "Integrações de pagamento", included: true },
        { text: "Painel administrativo", included: true },
        { text: "PWA (Mobile Ready)", included: true },
        { text: "Infraestrutura escalável", included: true },
      ],
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      period: "",
      description: "Sistemas complexos sob medida para grandes operações.",
      features: [
        { text: "Arquitetura de microsserviços", included: true },
        { text: "Segurança nível bancário", included: true },
        { text: "Consultoria de CTO as a Service", included: true },
        { text: "Equipe dedicada", included: true },
        { text: "Customização total", included: true },
        { text: "Support 24/7 VIP", included: true },
      ],
      featured: false,
    },
  ],
  auto: [
    {
      name: "Flow Basics",
      price: "1.497",
      period: "/mês",
      description: "Automações essenciais para economizar tempo no dia a dia.",
      features: [
        { text: "Integração CRM x Form", included: true },
        { text: "Automação de Email básica", included: true },
        { text: "Dashboard de leads", included: true },
        { text: "Até 3 fluxos ativos", included: true },
        { text: "IA Generativa no fluxo", included: false },
        { text: "Webhook avançado", included: false },
      ],
      featured: false,
    },
    {
      name: "Scale Automator",
      price: "2.997",
      period: "/mês",
      description: "Sua empresa rodando no piloto automático com inteligência.",
      label: "Produtividade 10x",
      features: [
        { text: "Automações complexas (n8n/Zapier)", included: true },
        { text: "Integração total do ecossistema", included: true },
        { text: "Agentes de IA inclusos", included: true },
        { text: "Gestão automática de vendas", included: true },
        { text: "Fluxos ilimitados", included: true },
        { text: "Consultoria de processos", included: true },
      ],
      featured: true,
    },
    {
      name: "Iron Ops",
      price: "Sob consulta",
      period: "",
      description: "Infraestrutura de operações automatizadas para grandes times.",
      features: [
        { text: "Arquitetura de dados customizada", included: true },
        { text: "BI & Automação combinados", included: true },
        { text: "IA proprietária", included: true },
        { text: "Gerente de automação dedicado", included: true },
        { text: "Custom Nodes & APIs", included: true },
        { text: "SLA de operação crítica", included: true },
      ],
      featured: false,
    },
  ],
};

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState("lp");
  const headerRef = useScrollReveal<HTMLDivElement>();
  const tabsRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useStaggerReveal<HTMLDivElement>(120);
  const navigate = useNavigate();

  const activePlans = plansByCategory[activeTab] || [];

  return (
    <section id="pricing" className="section-padding bg-muted/50 relative overflow-hidden">
      {/* Animated grid */}
      <div className="absolute inset-0 hero-grid-bg opacity-40 pointer-events-none" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-kortex-orange/5 blur-[150px]" />

      <div className="relative max-w-[1200px] mx-auto">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 mb-6">
            Planos
          </span>

          <h2
            className="font-heading text-foreground tracking-[-0.02em] mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Escolha o plano ideal para{" "}
            <span className="text-gradient-orange">seu crescimento</span>
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Soluções modulares que acompanham cada etapa da jornada do seu negócio.
          </p>
        </div>

        {/* Tabs */}
        <div ref={tabsRef} className="flex flex-wrap justify-center gap-2 mb-16 px-4">
          <div className="bg-foreground/[0.03] border border-foreground/[0.06] p-1.5 rounded-2xl flex flex-wrap justify-center gap-1 backdrop-blur-sm">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === service.id
                    ? "bg-kortex-orange text-primary-foreground shadow-lg shadow-kortex-orange/20 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                }`}
              >
                <service.icon className={`w-4 h-4 ${activeTab === service.id ? "text-primary-foreground" : "text-kortex-orange"}`} />
                {service.name}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div 
          key={activeTab} // Use key to re-trigger animations when tab changes
          ref={cardsRef} 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
        >
          {activePlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-500 hover:-translate-y-1 ${
                plan.featured
                  ? "bg-gradient-to-b from-kortex-orange/10 to-foreground/[0.04] border-2 border-kortex-orange/30 scale-[1.02]"
                  : "bg-foreground/[0.04] border border-foreground/[0.08] hover:border-kortex-orange/20"
              }`}
            >
              {plan.label && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-kortex-orange text-primary-foreground whitespace-nowrap">
                  {plan.label}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground font-body mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 h-10 line-clamp-2">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  {plan.price !== "Sob consulta" && <span className="text-sm text-muted-foreground">R$</span>}
                  <span className={`${plan.price === "Sob consulta" ? "text-2xl" : "text-4xl"} font-extrabold text-foreground font-body`}>
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm">
                    {f.included ? (
                      <Check className="w-4 h-4 text-kortex-orange flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    )}
                    <span className={f.included ? "text-muted-foreground" : "text-muted-foreground/40"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "hero" : "outline"}
                className="w-full rounded-full group overflow-hidden"
                onClick={() => navigate('/register')}
              >
                <span className="relative z-10">Contratar Plano</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;


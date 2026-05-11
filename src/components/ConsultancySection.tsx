import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ChevronRight, ChevronLeft, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUESTIONS = [
  {
    id: "segment",
    question: "Qual é o segmento do seu negócio?",
    options: [
      { id: "ecommerce", label: "E-commerce / Loja Online" },
      { id: "saas", label: "SaaS / Tecnologia" },
      { id: "servicos", label: "Prestação de Serviços" },
      { id: "infoprodutos", label: "Infoprodutos / Educação" },
      { id: "industria", label: "Indústria / Manufatura" },
      { id: "outro", label: "Outro" },
    ],
  },
  {
    id: "challenge",
    question: "Qual é o maior desafio da sua empresa hoje?",
    options: [
      { id: "conversao", label: "Baixa conversão de leads" },
      { id: "presenca", label: "Falta de presença digital" },
      { id: "automacao", label: "Processos manuais e lentos" },
      { id: "escala", label: "Dificuldade em escalar" },
      { id: "branding", label: "Marca fraca ou desatualizada" },
      { id: "dados", label: "Falta de dados e métricas" },
    ],
  },
  {
    id: "budget",
    question: "Qual a faixa de investimento que você considera?",
    options: [
      { id: "inicial", label: "Até R$ 2.000 / mês" },
      { id: "crescimento", label: "R$ 2.000 – R$ 5.000 / mês" },
      { id: "escala", label: "R$ 5.000 – R$ 15.000 / mês" },
      { id: "enterprise", label: "Acima de R$ 15.000 / mês" },
    ],
  },
  {
    id: "urgency",
    question: "Quando você precisa disso funcionando?",
    options: [
      { id: "urgente", label: "O mais rápido possível" },
      { id: "30dias", label: "Nos próximos 30 dias" },
      { id: "trimestre", label: "Nos próximos 3 meses" },
      { id: "planejando", label: "Estou apenas pesquisando" },
    ],
  },
];

type Answers = Record<string, string>;

function generateRecommendation(answers: Answers): { title: string; description: string; services: string[] } {
  const { challenge, budget, urgency } = answers;

  let title = "";
  let description = "";
  const services: string[] = [];

  // Challenge-based recommendations
  if (challenge === "conversao") {
    title = "Funil de Conversão Inteligente";
    description = "Seu maior gargalo é converter visitantes em clientes. Recomendamos um sistema de landing pages otimizadas com automação de follow-up para transformar leads frios em compradores.";
    services.push("Landing Pages de Alta Conversão", "Automação de E-mail/WhatsApp", "Tracking e Analytics Avançado");
  } else if (challenge === "presenca") {
    title = "Presença Digital Completa";
    description = "Você precisa existir no digital com força. Um site profissional + estratégia de conteúdo + automação básica vão colocar sua empresa no mapa rapidamente.";
    services.push("Site Institucional Premium", "Identidade Visual Digital", "SEO e Posicionamento");
  } else if (challenge === "automacao") {
    title = "Automação de Processos";
    description = "Processos manuais estão consumindo tempo e dinheiro. Vamos mapear seus fluxos e automatizar tudo que for possível com integrações inteligentes.";
    services.push("Mapeamento de Processos", "Integrações n8n/Zapier", "CRM Automatizado");
  } else if (challenge === "escala") {
    title = "Sistema de Escala Digital";
    description = "Você já tem tração, mas precisa de infraestrutura para crescer sem gargalos. Um Web App personalizado com automações de CRM vai destravar seu crescimento.";
    services.push("Web App Personalizado", "Automação de CRM", "Dashboard de Métricas");
  } else if (challenge === "branding") {
    title = "Redesign de Marca Digital";
    description = "Sua marca precisa de uma nova identidade que transmita profissionalismo e confiança. Vamos redesenhar toda a experiência visual do seu negócio.";
    services.push("Nova Identidade Visual", "Redesign do Site", "Kit de Redes Sociais");
  } else {
    title = "Diagnóstico Personalizado";
    description = "Com base nas suas respostas, identificamos que você precisa de uma análise mais profunda. Nosso time vai montar um plano personalizado para o seu caso.";
    services.push("Consultoria Estratégica", "Diagnóstico Digital", "Plano de Ação Personalizado");
  }

  // Budget modifier
  if (budget === "enterprise") {
    services.push("Gerente de Projeto Dedicado");
  }

  // Urgency modifier
  if (urgency === "urgente") {
    description += " Vamos priorizar seu projeto para entregarmos resultados o mais rápido possível.";
  }

  return { title, description, services };
}

const ConsultancySection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const question = QUESTIONS[currentQuestion];

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const newAnswers = { ...answers, [question.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption("");

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[QUESTIONS[currentQuestion - 1].id] || "");
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setSelectedOption("");
  };

  const recommendation = showResult ? generateRecommendation(answers) : null;

  return (
    <section id="consultancy" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-kortex-orange/5 blur-[150px]" />

      <div className="relative max-w-[700px] mx-auto">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 mb-6">
            Consultoria Grátis
          </span>

          <h2
            className="font-heading text-foreground tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Descubra o que sua empresa{" "}
            <span className="text-gradient-orange">realmente precisa</span>
          </h2>

          <p className="text-muted-foreground text-lg">
            Responda 4 perguntas rápidas e receba uma recomendação personalizada — totalmente grátis.
          </p>
        </div>

        <div className="bg-foreground/[0.04] border border-foreground/[0.08] rounded-2xl p-8 backdrop-blur-sm">
          {!showResult ? (
            <>
              {/* Progress */}
              <div className="flex items-center gap-2 mb-8">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      i < currentQuestion
                        ? "bg-kortex-orange"
                        : i === currentQuestion
                        ? "bg-kortex-orange/50"
                        : "bg-foreground/10"
                    }`}
                  />
                ))}
              </div>

              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
                Pergunta {currentQuestion + 1} de {QUESTIONS.length}
              </p>

              <h3 className="text-xl font-bold text-foreground mb-6 font-body">
                {question.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {question.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      selectedOption === opt.id
                        ? "bg-kortex-orange/15 border-kortex-orange/40 text-foreground shadow-[0_0_15px_hsl(var(--kortex-orange)/0.1)]"
                        : "bg-foreground/[0.02] border-foreground/[0.08] text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {currentQuestion > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                ) : (
                  <div />
                )}
                <Button
                  variant="hero"
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="rounded-full px-8"
                >
                  {currentQuestion < QUESTIONS.length - 1 ? "Próximo" : "Ver Resultado"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-kortex-orange/15 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-kortex-orange" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3 font-body">
                {recommendation?.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-lg mx-auto">
                {recommendation?.description}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {recommendation?.services.map((s) => (
                  <span
                    key={s}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="hero"
                  size="lg"
                  className="rounded-full px-8"
                  onClick={() => window.open("https://wa.me/5500000000000?text=Olá! Fiz a consultoria grátis no site e gostaria de saber mais.", "_blank")}
                >
                  Falar com um especialista
                </Button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Refazer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConsultancySection;

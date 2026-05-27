import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ChevronRight, ChevronLeft, Sparkles, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUESTIONS = [
  {
    id: "segment",
    question: "Qual é o segmento do seu negócio?",
    subtitle: "Selecione um ou mais segmentos que melhor descrevem seu negócio.",
    multiple: true,
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
    id: "description",
    question: "O que você deseja para sua empresa?",
    subtitle: "Fale abertamente sobre seus objetivos e o que você busca.",
    type: "textarea",
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

type Answers = Record<string, string | string[]>;

const ConsultancySection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = QUESTIONS[currentQuestion];

  const handleSelect = (optionId: string) => {
    if (question.multiple) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleNext = () => {
    if (question.type === "textarea") {
      if (!textAnswer.trim()) return;
      const newAnswers = { ...answers, [question.id]: textAnswer };
      setAnswers(newAnswers);
      setTextAnswer("");
    } else {
      if (selectedOptions.length === 0) return;
      const newAnswers = { ...answers, [question.id]: question.multiple ? selectedOptions : selectedOptions[0] };
      setAnswers(newAnswers);
      setSelectedOptions([]);
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      const prevQuestion = QUESTIONS[currentQuestion - 1];
      setCurrentQuestion(currentQuestion - 1);
      
      const prevAnswer = answers[prevQuestion.id];
      if (prevQuestion.type === "textarea") {
        setTextAnswer(prevAnswer as string || "");
      } else {
        setSelectedOptions(Array.isArray(prevAnswer) ? prevAnswer : prevAnswer ? [prevAnswer] : []);
      }
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setSelectedOptions([]);
    setTextAnswer("");
    setContact("");
    setIsSubmitted(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    
    setIsSubmitting(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // SAVE TO LOCAL STORAGE FOR REGISTRATION/ONBOARDING
    localStorage.setItem('kortex_pre_consultancy', JSON.stringify({
      ...answers,
      contact
    }));

    console.log("Lead captured:", { ...answers, contact });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

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
            Responda algumas perguntas rápidas e entraremos em contato com a melhor solução para você.
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

              <h3 className="text-xl font-bold text-foreground mb-2 font-body">
                {question.question}
              </h3>

              {question.subtitle && (
                <p className="text-sm text-muted-foreground mb-6">
                  {question.subtitle}
                </p>
              )}

              {question.type === "textarea" ? (
                <div className="mb-8">
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder={question.placeholder || "Digite aqui..."}
                    className="w-full h-32 bg-foreground/[0.02] border border-foreground/[0.08] rounded-xl p-4 text-sm text-foreground focus:border-kortex-orange/50 outline-none transition-all resize-none"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {question.options?.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      className={`text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        selectedOptions.includes(opt.id)
                          ? "bg-kortex-orange/15 border-kortex-orange/40 text-foreground shadow-[0_0_15px_hsl(var(--kortex-orange)/0.1)]"
                          : "bg-foreground/[0.02] border-foreground/[0.08] text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {opt.label}
                        {question.multiple && selectedOptions.includes(opt.id) && (
                          <div className="w-4 h-4 rounded-full bg-kortex-orange flex items-center justify-center animate-in zoom-in duration-200">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

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
                  disabled={question.type === "textarea" ? !textAnswer.trim() : selectedOptions.length === 0}
                  className="rounded-full px-8"
                >
                  {currentQuestion < QUESTIONS.length - 1 ? "Próximo" : "Finalizar"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
              {!isSubmitted ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-kortex-orange/15 flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-kortex-orange" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3 font-body">
                    Quase lá! Como podemos te contatar?
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-lg mx-auto">
                    Deixe seu WhatsApp ou E-mail abaixo. Nosso time analisará suas respostas e entrará em contato com uma proposta personalizada.
                  </p>

                  <form onSubmit={handleContactSubmit} className="space-y-4 max-w-md mx-auto mb-8">
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="WhatsApp ou E-mail"
                      required
                      className="w-full bg-foreground/[0.02] border border-foreground/[0.08] rounded-xl px-4 py-3 text-sm text-foreground focus:border-kortex-orange/50 outline-none transition-all"
                    />
                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full rounded-full"
                      disabled={isSubmitting || !contact.trim()}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                    </Button>
                  </form>

                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Recomeçar
                  </button>
                </>
              ) : (
                <div className="py-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 font-body">
                    Solicitação Enviada!
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    Obrigado pelo interesse! Nosso time entrará em contato em breve através do contato informado: <strong>{contact}</strong>.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="rounded-full px-8"
                  >
                    Voltar ao início
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConsultancySection;

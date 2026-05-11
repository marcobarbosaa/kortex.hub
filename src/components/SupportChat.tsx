import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, X, Send, Bot } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "support";
  time: string;
}

import { useNavigate } from "react-router-dom";

const intentKnowledge = [
  {
    keywords: ["fatura", "pagamento", "pagar", "boleto", "cartao", "cobrança", "cobranca", "financeiro", "dinheiro"],
    reply: "Para visualizar ou pagar suas faturas, acesse o menu 'Financeiro' na barra lateral. Lá você encontrará todo o histórico de pagamentos e faturas pendentes."
  },
  {
    keywords: ["projeto", "andamento", "status", "prazo", "entreg", "cronograma", "quando"],
    reply: "Você pode acompanhar o status e o cronograma de todos os seus projetos na aba 'Projetos'. Lá detalhamos cada etapa da entrega!"
  },
  {
    keywords: ["relatorio", "resultados", "metricas", "desempenho", "dashboard", "grafico"],
    reply: "Os relatórios de desempenho e métricas principais estão disponíveis na sua 'Visão Geral' (dashboard inicial) e também podem ser baixados na aba de projetos."
  },
  {
    keywords: ["senha", "login", "acesso", "conta", "perfil", "email", "e-mail"],
    reply: "Para alterar seus dados de acesso ou senha, clique na sua foto de perfil no canto superior direito e acesse suas configurações."
  },
  {
    keywords: ["ola", "olá", "oi", "bom dia", "boa tarde", "boa noite", "ajuda", "suporte", "opa"],
    reply: "DYNAMIC_GREETING"
  },
  {
    keywords: ["servico", "serviço", "comprar", "contratar", "upgrade", "plano", "aumentar"],
    reply: "Você pode ver nossos novos serviços e fazer upgrade do seu plano diretamente na aba 'Serviços' ou 'Upgrade' no menu principal."
  }
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getBotReply(userInput: string) {
  const normalized = userInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const intent of intentKnowledge) {
    if (intent.keywords.some(kw => normalized.includes(kw))) {
      if (intent.reply === "DYNAMIC_GREETING") {
        return `Olá! ${getGreeting()}. Como posso te ajudar hoje? (Ex: 'onde vejo minhas faturas?', 'status do projeto', etc)`;
      }
      return intent.reply;
    }
  }
  return null;
}

const now = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export function SupportChat() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: `Olá! 👋 Sou a Sofia, assistente da GABS. Como posso te ajudar?`,
      sender: "support",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [awaitingTransfer, setAwaitingTransfer] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now(),
      text,
      sender: "user",
      time: now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      let reply = "";
      
      if (awaitingTransfer) {
        const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (normalized.includes("sim") || normalized.includes("quero") || normalized.includes("pode") || normalized.includes("por favor") || normalized.includes("falar")) {
          reply = "Perfeito! Estou te redirecionando para a nossa central de Suporte Humano, onde você pode abrir um ticket oficial com a equipe...";
          setTimeout(() => {
            setOpen(false);
            navigate('/cliente/suporte');
          }, 2500);
        } else if (normalized.includes("nao") || normalized.includes("não") || normalized.includes("deixa")) {
          reply = "Tudo bem! Posso te ajudar com mais alguma dúvida então?";
        } else {
          reply = "Desculpe, não entendi. Responda com 'Sim' para falar com um humano ou 'Não' para continuar aqui.";
          // keep awaitingTransfer true
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, text: reply, sender: "support", time: now() },
          ]);
          setTyping(false);
          return;
        }
        setAwaitingTransfer(false);
      } else {
        const botReply = getBotReply(text);
        if (botReply) {
          reply = botReply;
        } else {
          reply = "Desculpe, ainda estou aprendendo e não tenho certeza sobre isso. Gostaria de falar com nossa equipe de suporte humano para resolver isso?";
          setAwaitingTransfer(true);
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: reply, sender: "support", time: now() },
      ]);
      setTyping(false);
    }, 1000 + Math.random() * 500);
  };

  return createPortal(
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[360px] max-h-[520px] flex flex-col rounded-2xl border border-border/50 bg-card shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Sofia</p>
                <p className="text-[10px] text-[hsl(var(--success))]">● Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[380px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.sender === "user"
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-xl px-4 py-2.5 rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border/50 px-3 py-2 flex items-center gap-2 bg-secondary/30">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}

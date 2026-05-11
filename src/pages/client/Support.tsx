import { useState, useEffect } from "react";
import { ClientLayout } from "@/components/ClientLayout";
import {
  MessageSquare, Globe, Calendar, FileText,
  ChevronRight, ArrowUpRight, BadgeCheck, Plus, Loader2, Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const Support = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: tickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['client-tickets', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('client_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createTicket = useMutation({
    mutationFn: async (newTicket: any) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({ ...newTicket, client_id: user!.id })
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-tickets'] });
      toast.success("Ticket aberto com sucesso!");
      setIsModalOpen(false);
    },
    onError: (error) => toast.error(`Erro: ${error.message}`)
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createTicket.mutate({
      subject: fd.get('subject'),
      description: fd.get('description'),
      priority: fd.get('priority'),
      status: 'open'
    });
  };

  return (
    <ClientLayout
      title="Suporte"
      description="Fale com nossa equipe ou consulte as perguntas frequentes."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tickets Section */}
          <div className="glass-card rounded-xl p-5 glow-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Seus Chamados
              </h2>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Novo Chamado
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] w-[95vw] rounded-2xl bg-background border border-border shadow-2xl p-5 sm:p-6 text-foreground max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight text-center sm:text-left">Abrir Novo Chamado</DialogTitle>
                    <p className="text-xs text-muted-foreground mt-1 text-center sm:text-left">
                      Descreva seu problema e nossa equipe responderá o mais rápido possível.
                    </p>
                  </DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4 mt-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Assunto</label>
                      <input 
                        required 
                        name="subject" 
                        className="w-full bg-accent/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all focus:bg-background" 
                        placeholder="Ex: Dúvida sobre fatura" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Prioridade</label>
                      <div className="relative">
                        <select 
                          name="priority" 
                          className="w-full appearance-none bg-accent/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all focus:bg-background"
                        >
                          <option value="low">Baixa - Dúvida geral</option>
                          <option value="medium">Média - Problema que não impede o uso</option>
                          <option value="high">Alta - Sistema fora do ar ou crítico</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                          <ChevronRight className="h-4 w-4 rotate-90" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Descrição</label>
                      <textarea 
                        required 
                        name="description" 
                        rows={4} 
                        className="w-full bg-accent/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all focus:bg-background" 
                        placeholder="Descreva seu problema com o máximo de detalhes..." 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={createTicket.isPending} 
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] mt-4 flex justify-center items-center gap-2"
                    >
                      {createTicket.isPending ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Processando...</>
                      ) : (
                        <><Send className="h-4 w-4" /> Enviar Chamado</>
                      )}
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {isLoadingTickets ? (
                <p className="text-center py-6 text-xs text-muted-foreground">Carregando seus chamados...</p>
              ) : !tickets || tickets.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border/50 rounded-xl">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                  <p className="text-xs text-muted-foreground">Você não tem chamados abertos.</p>
                </div>
              ) : (
                tickets.map((t) => (
                  <div key={t.id} className="group">
                    <div
                      onClick={() => setSelectedTicketId(selectedTicketId === t.id ? null : t.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer transition-all",
                        selectedTicketId === t.id && "bg-muted/30 rounded-b-none border-b-0"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("h-2 w-2 rounded-full",
                          t.status === 'open' ? "bg-primary animate-pulse" : t.status === 'in_progress' ? "bg-warning" : "bg-success"
                        )} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.subject}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {format(new Date(t.created_at), "dd/MM/yyyy HH:mm")} · <span className="capitalize">{t.status === 'open' ? 'Aberto' : t.status === 'in_progress' ? 'Em andamento' : 'Resolvido'}</span>
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", selectedTicketId === t.id && "rotate-90")} />
                    </div>
                    {selectedTicketId === t.id && (
                      <TicketChat ticketId={t.id} initialDescription={t.description} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FAQ accordion */}
          <div className="glass-card rounded-xl p-5 glow-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-primary" /> Perguntas Frequentes
            </h2>
            <div className="space-y-2">
              {[
                { q: "Como acompanho o progresso do meu projeto?", a: "Na seção 'Projetos' você encontra o status, progresso e todas as entregas de cada projeto em tempo real." },
                { q: "Onde baixo meus relatórios e arquivos?", a: "Acesse 'Relatórios' para relatórios mensais ou 'Projetos' para arquivos específicos de cada projeto." },
                { q: "Como atualizo meus dados de pagamento?", a: "Entre na seção 'Financeiro' e clique em 'Alterar método de pagamento' abaixo do seu plano atual." },
              ].map((faq, i) => (
                <div key={i} className="border border-border/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{faq.q}</span>
                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform", openFaq === i && "rotate-90")} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3 pt-0">
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contact channels */}
          <div className="space-y-4">
            {[
              { icon: Globe, label: "E-mail Suporte", desc: "suporte@usegabs.com" },
              { icon: Calendar, label: "Agendar Reunião", desc: "30 ou 60 minutos" },
            ].map((c) => (
              <div key={c.label} className="glass-card rounded-xl p-5 glow-border flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SLA card */}
          <div className="glass-card rounded-xl p-5 glow-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <BadgeCheck className="h-4 w-4 text-success" /> SLA de Suporte
            </h2>
            <div className="space-y-3">
              {[
                { label: "Tempo de resposta", value: "≤ 4h úteis" },
                { label: "Disponibilidade", value: "Seg–Sex, 9h–18h" },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-semibold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

const TicketChat = ({ ticketId, initialDescription }: { ticketId: string, initialDescription: string }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState("");

  const { data: messages, isLoading } = useQuery({
    queryKey: ['ticket-messages', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*, profiles(full_name, avatar_url, role)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (!ticketId) return;

    const channel = supabase.channel(`chat-${ticketId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['ticket-messages', ticketId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketId,
          sender_id: user!.id,
          message: text
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', ticketId] });
      setMsg("");
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    sendMessage.mutate(msg);
  };

  return (
    <div className="glass-card rounded-b-xl border-t border-border/30 -mt-px flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Initial Description */}
        <div className="flex gap-3 max-w-[80%]">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">VC</div>
          <div className="bg-muted/30 rounded-2xl rounded-tl-none p-3">
            <p className="text-xs text-foreground">{initialDescription}</p>
            <p className="text-[8px] text-muted-foreground mt-1 uppercase tracking-wider">Descrição Inicial</p>
          </div>
        </div>

        {/* Messages */}
        {isLoading ? (
          <p className="text-center text-[10px] text-muted-foreground">Carregando mensagens...</p>
        ) : messages?.map((m) => {
          const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
          const isMe = m.sender_id === user?.id;
          return (
            <div key={m.id} className={cn("flex gap-3 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold",
                isMe ? "bg-primary/20 text-primary" : "bg-success/20 text-success"
              )}>
                {isMe ? "VC" : "KX"}
              </div>
              <div className={cn("rounded-2xl p-3",
                isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted/50 text-foreground rounded-tl-none"
              )}>
                <p className="text-xs">{m.message}</p>
                <p className={cn("text-[8px] mt-1 opacity-50", isMe ? "text-right" : "text-left")}>
                  {format(new Date(m.created_at), "HH:mm")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-border/30 flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
        />
        <button
          disabled={sendMessage.isPending || !msg.trim()}
          className="h-9 w-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
};

export default Support;

import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { MessageSquare, Loader2, Send, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  open: "bg-primary/10 text-primary border-primary/20",
  in_progress: "bg-warning/10 text-warning border-warning/20",
  resolved: "bg-success/10 text-success border-success/20",
};

const AdminSupport = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const selectedTicket = tickets?.find(t => t.id === selectedTicketId);

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Ticket List Sidebar */}
        <div className="w-80 border-r border-border/50 flex flex-col bg-[#050505]">
          <div className="p-4 border-b border-border/50">
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Suporte
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Chamados dos Clientes</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Carregando...</div>
            ) : !tickets || tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Nenhum chamado aberto.</div>
            ) : (
              tickets.map((t) => {
                const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={cn(
                      "p-4 border-b border-border/30 cursor-pointer transition-colors hover:bg-muted/30",
                      selectedTicketId === t.id && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-foreground truncate">{t.subject}</p>
                      <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full border", STATUS_COLOR[t.status || 'open'])}>
                        {t.status === 'open' ? 'Aberto' : t.status === 'in_progress' ? 'Andamento' : 'Resolvido'}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2">{profile?.full_name || 'Desconhecido'}</p>
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground/60">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(t.created_at), "dd/MM HH:mm")}</span>
                      <span className={cn("uppercase font-bold", t.priority === 'high' ? "text-destructive" : t.priority === 'medium' ? "text-warning" : "text-muted-foreground")}>
                        {t.priority}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#0A0A0A]">
          {selectedTicket ? (
            <>
              <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/10">
                <div>
                  <h2 className="text-sm font-bold text-foreground">{selectedTicket.subject}</h2>
                  <p className="text-xs text-muted-foreground">Chamado #{selectedTicket.id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TicketStatusSelector ticket={selectedTicket} />
                </div>
              </div>
              <AdminTicketChat ticketId={selectedTicket.id} initialDescription={selectedTicket.description} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 opacity-20" />
              </div>
              <p className="text-sm font-medium">Selecione um chamado</p>
              <p className="text-xs opacity-60 mt-1">Escolha um ticket na lista ao lado para ver a conversa.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const TicketStatusSelector = ({ ticket }: { ticket: any }) => {
  const queryClient = useQueryClient();
  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      const { error } = await supabase.from('support_tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', ticket.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      toast.success("Status atualizado!");
    }
  });

  return (
    <select
      value={ticket.status}
      onChange={(e) => updateStatus.mutate(e.target.value)}
      className="bg-muted/50 border border-border/50 rounded px-2 py-1 text-xs text-foreground outline-none focus:border-primary/50"
    >
      <option value="open">Aberto</option>
      <option value="in_progress">Em Andamento</option>
      <option value="resolved">Resolvido</option>
    </select>
  );
};

const AdminTicketChat = ({ ticketId, initialDescription }: { ticketId: string, initialDescription: string }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState("");

  const { data: messages, isLoading } = useQuery({
    queryKey: ['ticket-messages', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*, profiles(full_name, role)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase
        .from('ticket_messages')
        .insert({ ticket_id: ticketId, sender_id: user!.id, message: text });
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
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Client's Original Message */}
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">CL</div>
          <div className="space-y-1 max-w-[80%]">
            <div className="bg-muted/30 rounded-2xl rounded-tl-none p-4 border border-border/30">
              <p className="text-sm text-foreground leading-relaxed">{initialDescription}</p>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest px-1">Mensagem Inicial do Cliente</p>
          </div>
        </div>

        {/* Thread */}
        {isLoading ? (
          <p className="text-center text-xs text-muted-foreground py-4">Carregando mensagens...</p>
        ) : messages?.map((m) => {
          const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
          const isAdminMsg = profile?.role === 'admin';
          return (
            <div key={m.id} className={cn("flex gap-4", isAdminMsg ? "flex-row-reverse" : "")}>
              <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                isAdminMsg ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted/50 text-muted-foreground"
              )}>
                {isAdminMsg ? "AD" : "CL"}
              </div>
              <div className={cn("space-y-1 max-w-[80%]", isAdminMsg ? "items-end" : "")}>
                <div className={cn("rounded-2xl p-4 shadow-sm",
                  isAdminMsg ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted/50 text-foreground rounded-tl-none border border-border/30"
                )}>
                  <p className="text-sm leading-relaxed">{m.message}</p>
                </div>
                <p className={cn("text-[10px] text-muted-foreground px-1", isAdminMsg ? "text-right" : "")}>
                  {format(new Date(m.created_at), "HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-muted/10 border-t border-border/50 flex gap-3">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Responda ao cliente..."
          className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <button
          disabled={sendMessage.isPending || !msg.trim()}
          className="h-12 w-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
        >
          {sendMessage.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
};

export default AdminSupport;

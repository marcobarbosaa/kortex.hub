import { ClientLayout } from "@/components/ClientLayout";
import { DollarSign, Clock, Star, Receipt, Zap, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const STATUS_LABEL: Record<string, string> = {
  paid: "Paga",
  pending: "Pendente",
  overdue: "Vencida",
};

const Financial = () => {
  const { user } = useAuth();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['client-invoices', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalPaid = invoices?.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0) || 0;
  const totalPending = invoices?.filter(i => i.status === 'pending').reduce((s, i) => s + Number(i.amount), 0) || 0;

  return (
    <ClientLayout
      title="Financeiro"
      description="Histórico de faturas, pagamentos e detalhes do seu plano contratado."
    >
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Investido",
            value: `R$ ${totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            sub: "Faturas pagas",
            icon: DollarSign,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Pendente",
            value: `R$ ${totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            sub: `${invoices?.filter(i => i.status === 'pending').length || 0} fatura(s)`,
            icon: Clock,
            color: "text-warning",
            bg: "bg-warning/10",
          },
          {
            label: "Total de Faturas",
            value: String(invoices?.length || 0),
            sub: "Desde o início",
            icon: Star,
            color: "text-success",
            bg: "bg-success/10",
          },
        ].map((c) => (
          <div key={c.label} className="glass-card rounded-xl p-5 glow-border">
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center mb-3", c.bg)}>
              <c.icon className={cn("h-4 w-4", c.color)} />
            </div>
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
            <p className="text-[11px] text-muted-foreground/60 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <div className="glass-card rounded-xl p-5 glow-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <Receipt className="h-4 w-4 text-primary" /> Histórico de Faturas
        </h2>
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-6">Carregando faturas...</p>
          ) : !invoices || invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhuma fatura encontrada.</p>
          ) : (
            invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0 gap-4">
                <div className="flex items-center gap-3">
                  <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    inv.status === "paid" ? "bg-success/10" : inv.status === "overdue" ? "bg-destructive/10" : "bg-warning/10"
                  )}>
                    <Receipt className={cn("h-4 w-4",
                      inv.status === "paid" ? "text-success" : inv.status === "overdue" ? "text-destructive" : "text-warning"
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Fatura — {format(new Date(inv.created_at), "MMMM yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vencimento: {format(new Date(inv.due_date), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-foreground">
                    R$ {Number(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full",
                    inv.status === "paid" ? "bg-success/10 text-success" :
                    inv.status === "overdue" ? "bg-destructive/10 text-destructive" :
                    "bg-warning/10 text-warning"
                  )}>
                    {STATUS_LABEL[inv.status || 'pending']}
                  </span>
                  {inv.pdf_url && (
                    <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer" title="Baixar PDF" className="text-muted-foreground hover:text-primary transition-colors">
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Plan details */}
      <div className="glass-card rounded-xl p-5 glow-border">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Plano Contratado
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wide">Pro</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Projetos simultâneos", value: "5",              max: "5" },
            { label: "Entregas/mês",          value: "12",             max: "20" },
            { label: "Relatórios",            value: "4",              max: "ilimitado" },
            { label: "Suporte",               value: "Prioritário",    max: "" },
          ].map((f) => (
            <div key={f.label} className="p-3 rounded-lg bg-muted/30">
              <p className="text-sm font-semibold text-foreground">
                {f.value}
                {f.max && f.max !== "ilimitado" && (
                  <span className="text-muted-foreground font-normal text-xs"> /{f.max}</span>
                )}
                {f.max === "ilimitado" && (
                  <span className="text-xs text-muted-foreground font-normal"> / ∞</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
};

export default Financial;

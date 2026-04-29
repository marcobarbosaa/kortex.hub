import { ClientLayout } from "@/components/ClientLayout";
import { RetentionBanner } from "@/components/RetentionBanner";
import {
  Briefcase, CheckCircle2, Clock, TrendingUp, Bell,
  FileText, Calendar, ArrowUpRight, AlertTriangle,
  BadgeCheck, Activity, Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { useAuth } from "@/components/AuthProvider";
import { useOnboardingGuard } from "@/hooks/useOnboardingGuard";

const Overview = () => {
  const { user, profile } = useAuth();
  const { onboardingData } = useOnboardingGuard();

  // Busca projetos do cliente
  const { data: projects } = useQuery({
    queryKey: ['client-overview-projects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Busca faturas do cliente
  const { data: invoices } = useQuery({
    queryKey: ['client-overview-invoices', user?.id],
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

  // Busca tickets do cliente
  const { data: tickets } = useQuery({
    queryKey: ['client-overview-tickets', user?.id],
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

  // Busca campanhas do cliente
  const { data: campaigns } = useQuery({
    queryKey: ['client-overview-campaigns', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
  const pendingInvoices = invoices?.filter(i => i.status === 'pending').length || 0;
  const openTickets = tickets?.filter(t => t.status !== 'resolved').length || 0;

  const nome = profile?.full_name?.split(' ')[0] || 'Cliente';

  // Dados simples para o gráfico baseado nos projetos
  const progressData = [
    { mes: "Projetos", ativos: activeProjects, concluídos: completedProjects },
  ];

  return (
    <ClientLayout
      title={`Olá, ${nome} 👋`}
      description="Acompanhe o progresso dos seus projetos e entregas em tempo real."
    >
      {/* Retention Banner (Etapa 9) */}
      <RetentionBanner />

      {/* Personalized insight based on onboarding goal (Etapa 4) */}
      {onboardingData.mainGoal && (
        <div className="glass-card rounded-xl p-4 glow-border mb-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">🎯 Foco:</span>{' '}
            {onboardingData.mainGoal === 'crescer' && 'Crescer faturamento — acompanhe suas métricas de receita.'}
            {onboardingData.mainGoal === 'organizar' && 'Organizar finanças — mantenha seu fluxo de caixa em dia.'}
            {onboardingData.mainGoal === 'prejuizo' && 'Evitar prejuízo — fique atento aos alertas de gastos.'}
            {onboardingData.mainGoal === 'automatizar' && 'Automatizar processos — descubra as automações disponíveis.'}
          </p>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Projetos Ativos",   value: String(activeProjects),   sub: `${completedProjects} concluído(s)`,      trend: "up",   icon: Briefcase,    color: "text-primary", bg: "bg-primary/10" },
          { label: "Campanhas",         value: String(campaigns?.length || 0), sub: `${campaigns?.filter(c => c.status === 'active').length || 0} ativa(s)`, trend: "up", icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
          { label: "Faturas Pendentes", value: String(pendingInvoices), sub: pendingInvoices > 0 ? "Atenção" : "Tudo em dia",  trend: pendingInvoices > 0 ? "warn" : "up", icon: Clock,   color: pendingInvoices > 0 ? "text-warning" : "text-success", bg: pendingInvoices > 0 ? "bg-warning/10" : "bg-success/10" },
          { label: "Tickets Abertos",   value: String(openTickets),   sub: openTickets > 0 ? "Em andamento" : "Nenhum",        trend: openTickets > 0 ? "warn" : "up",   icon: CheckCircle2,   color: openTickets > 0 ? "text-warning" : "text-success", bg: openTickets > 0 ? "bg-warning/10" : "bg-success/10" },
        ].map((c) => (
          <div key={c.label} className="glass-card rounded-xl p-5 glow-border">
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center mb-3", c.bg)}>
              <c.icon className={cn("h-4 w-4", c.color)} />
            </div>
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
            <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", c.trend === "up" ? "text-success" : "text-warning")}>
              {c.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Recent invoices + tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturas recentes */}
        <div className="glass-card rounded-xl p-5 glow-border">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Receipt className="h-4 w-4 text-primary" /> Últimas Faturas
          </h2>
          <div className="space-y-2">
            {!invoices || invoices.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Nenhuma fatura registrada.</p>
            ) : (
              invoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2.5 group hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0",
                      inv.status === 'paid' ? "bg-success/10" : "bg-warning/10"
                    )}>
                      <Receipt className={cn("h-3.5 w-3.5", inv.status === 'paid' ? "text-success" : "text-warning")} />
                    </div>
                    <div>
                      <p className="text-xs text-foreground font-medium">
                        R$ {Number(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{inv.status === 'paid' ? 'Paga' : 'Pendente'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tickets recentes */}
        <div className="glass-card rounded-xl p-5 glow-border">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-primary" /> Tickets Recentes
          </h2>
          <div className="space-y-2">
            {!tickets || tickets.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Nenhum ticket de suporte.</p>
            ) : (
              tickets.slice(0, 4).map((t) => (
                <div key={t.id} className={cn("flex items-start gap-3 p-3 rounded-lg transition-colors",
                  t.status !== 'resolved' ? "bg-primary/5 border border-primary/10" : "hover:bg-muted/50"
                )}>
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {t.status === 'resolved' ? <Activity className="h-3.5 w-3.5 text-success" /> : <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-xs font-semibold leading-snug", t.status !== 'resolved' ? "text-foreground" : "text-foreground/70")}>
                      {t.subject}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                      {t.status === 'open' ? 'Aberto' : t.status === 'in_progress' ? 'Em andamento' : 'Resolvido'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Overview;

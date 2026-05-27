import { ClientLayout } from "@/components/ClientLayout";
import { RetentionBanner } from "@/components/RetentionBanner";
import {
  Briefcase, CheckCircle2, Clock, TrendingUp, Bell,
  ArrowUpRight, AlertTriangle,
  BadgeCheck, Activity, Receipt, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
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


  return (
    <ClientLayout
      title={`Olá, ${nome} 👋`}
      description="Acompanhe o progresso dos seus projetos e entregas em tempo real."
    >
      {/* Retention Banner (Etapa 9) */}
      <RetentionBanner />

      {/* Personalized insight based on onboarding need */}
      {onboardingData.mainNeed && (
        <div className="glass-card rounded-xl p-5 glow-border mb-6 border-l-4 border-l-primary bg-primary/5">
          <h2 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-primary" /> Seu Foco Principal
          </h2>
          <p className="text-sm text-muted-foreground">
            {onboardingData.mainNeed === 'webapp' && 'Desenvolvimento de Site/App — acompanhe as entregas e o roadmap do seu sistema direto no Cronograma.'}
            {onboardingData.mainNeed === 'automation' && 'Automação de Processos — verifique o status das suas integrações e automações ativas.'}
            {onboardingData.mainNeed === 'funnel' && 'Funil de Vendas — estrutura de alta conversão em desenvolvimento contínuo.'}
            {onboardingData.mainNeed === 'analytics' && 'Dados e Métricas — estruturação de análise de ROI e dashboards.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Pillar 1: Project Progress / Macro */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-xl p-6 glow-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4 relative z-10">
              <Briefcase className="h-5 w-5 text-primary" /> Andamento do Projeto
            </h2>
            
            {projects && projects.length > 0 ? (
              <div className="space-y-4 relative z-10">
                {projects.filter(p => p.status === 'active').length > 0 ? (
                  projects.filter(p => p.status === 'active').slice(0, 1).map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-background/50 border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{p.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{p.status === 'active' ? 'Em andamento' : p.status}</p>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md bg-primary/10 text-primary uppercase">
                          Ativo
                        </span>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex justify-between text-xs font-medium mb-2">
                          <span className="text-muted-foreground">Progresso Estimado</span>
                          <span className="text-primary">Em construção</span>
                        </div>
                        <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-1/2 animate-pulse" />
                        </div>
                      </div>

                      <a href="/cliente/projetos" className="mt-5 w-full block text-center bg-muted/50 hover:bg-muted text-foreground text-xs font-semibold py-2.5 rounded-lg transition-colors border border-border/50">
                        Ver Cronograma Completo
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Você possui projetos, mas nenhum ativo no momento.</p>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-background/50 border border-border/50 text-center relative z-10">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium text-foreground">Configurando ambiente</p>
                <p className="text-xs text-muted-foreground mt-1">Nossa equipe está preparando o cronograma do seu projeto.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Pillars: Financial & Quick Links */}
        <div className="space-y-6">
          
          {/* Quick Links */}
          <div className="glass-card rounded-xl p-6 glow-border">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <ArrowUpRight className="h-4 w-4 text-primary" /> Acessos Rápidos
            </h2>
            <div className="space-y-2">
              <a href="/cliente/suporte" className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors group">
                <span className="text-sm font-medium text-foreground">Suporte Especializado</span>
                <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="/cliente/projetos" className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors group">
                <span className="text-sm font-medium text-foreground">Arquivos e Entregas</span>
                <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Financial Minimal Widget */}
          <div className="glass-card rounded-xl p-6 glow-border">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <Receipt className="h-4 w-4 text-primary" /> Status Financeiro
            </h2>
            
            {!invoices || invoices.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-6 w-6 text-success mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Tudo certo por aqui.</p>
              </div>
            ) : (
              (() => {
                const pending = invoices.find(i => i.status === 'pending');
                if (pending) {
                  return (
                    <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                      <div className="flex items-center gap-2 mb-2 text-warning">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Fatura Pendente</span>
                      </div>
                      <p className="text-xl font-bold text-foreground">
                        R$ {Number(pending.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                        Pagar Agora
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center py-4">
                      <CheckCircle2 className="h-6 w-6 text-success mx-auto mb-2" />
                      <p className="text-xs text-success font-medium">Assinatura em dia</p>
                    </div>
                  );
                }
              })()
            )}
          </div>

        </div>
      </div>
    </ClientLayout>
  );
};

export default Overview;

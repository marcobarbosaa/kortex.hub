import { AdminLayout } from "@/components/AdminLayout";
import { Zap, Search, Bell, Plus, Play, Pause, Mail, MessageSquare, Clock, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";

const automations = [
  { name: "Welcome Email Sequence", client: "Todos os clientes", trigger: "Novo lead capturado", actions: ["Enviar email de boas-vindas", "Aguardar 2 dias", "Enviar case de sucesso", "Aguardar 3 dias", "Enviar oferta"], status: "active", executions: 342, successRate: 98.2, lastRun: "5 min atrás" },
  { name: "Alerta de Churn", client: "Todos os clientes", trigger: "Health score < 50%", actions: ["Notificar gestor", "Criar tarefa de retenção", "Agendar call"], status: "active", executions: 18, successRate: 100, lastRun: "2h atrás" },
  { name: "Relatório Semanal", client: "Todos os clientes", trigger: "Toda segunda, 8h", actions: ["Coletar métricas", "Gerar PDF", "Enviar por email"], status: "active", executions: 96, successRate: 99.1, lastRun: "3d atrás" },
  { name: "Follow-up Proposta", client: "Leads", trigger: "Proposta sem resposta > 3 dias", actions: ["Enviar follow-up email", "Notificar vendedor"], status: "active", executions: 67, successRate: 95.5, lastRun: "1d atrás" },
  { name: "Onboarding Checklist", client: "Novos clientes", trigger: "Contrato assinado", actions: ["Criar workspace", "Enviar checklist", "Agendar kickoff"], status: "paused", executions: 24, successRate: 100, lastRun: "5d atrás" },
  { name: "Social Media Scheduler", client: "Café Artesanal", trigger: "Novo post aprovado", actions: ["Publicar no Instagram", "Publicar no Facebook", "Notificar cliente"], status: "error", executions: 156, successRate: 87.3, lastRun: "12h atrás" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Play }> = {
  active: { label: "Ativa", color: "bg-success/10 text-success", icon: Play },
  paused: { label: "Pausada", color: "bg-warning/10 text-warning", icon: Pause },
  error: { label: "Erro", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};

const stats = [
  { label: "Automações Ativas", value: "4", icon: Zap },
  { label: "Execuções este Mês", value: "703", icon: RefreshCw },
  { label: "Taxa de Sucesso", value: "96.8%", icon: CheckCircle2 },
  { label: "Tempo Economizado", value: "~48h", icon: Clock },
];

const Automations = () => (
  <AdminLayout>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2"><Zap className="h-6 w-6 text-primary" /> Automações</h1>
              <p className="text-sm text-muted-foreground mt-1">Fluxos automatizados para escalar operações.</p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Nova Automação</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-5 glow-border">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><s.icon className="h-4 w-4 text-primary" /></div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {automations.map((a) => {
              const st = statusConfig[a.status];
              return (
                <div key={a.name} className="glass-card rounded-xl p-5 glow-border hover:border-primary/20 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-foreground font-semibold">{a.name}</h3>
                            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}><st.icon className="h-3 w-3" />{st.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.client} • Trigger: {a.trigger}</p>
                        </div>
                      </div>

                      {/* Flow steps */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 ml-11">
                        {a.actions.map((action, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="text-[10px] px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium">{action}</span>
                            {i < a.actions.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/40" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-center shrink-0 ml-11 lg:ml-0">
                      <div>
                        <p className="text-xs text-muted-foreground">Execuções</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{a.executions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sucesso</p>
                        <p className={`text-sm font-semibold mt-0.5 ${a.successRate >= 95 ? "text-success" : a.successRate >= 90 ? "text-warning" : "text-destructive"}`}>{a.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Último run</p>
                        <p className="text-sm font-medium text-muted-foreground mt-0.5">{a.lastRun}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
  </AdminLayout>
);

export default Automations;

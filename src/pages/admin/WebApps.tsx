import { AdminLayout } from "@/components/AdminLayout";
import { Globe, Plus, ExternalLink, MoreVertical, Search, Bell, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Code2, Smartphone, Monitor, Layers } from "lucide-react";

const apps = [
  { name: "Clínica Vida Nova", type: "Landing Page", status: "live", url: "vidanova.com.br", uptime: "99.9%", visits: "12.4k", lastDeploy: "2h atrás", stack: ["React", "Tailwind"] },
  { name: "Tech Solutions Portal", type: "Web App", status: "live", url: "techsolutions.app", uptime: "99.7%", visits: "8.2k", lastDeploy: "1d atrás", stack: ["React", "Node", "PostgreSQL"] },
  { name: "Studio Arquitetura", type: "Landing Page", status: "live", url: "studioarq.com.br", uptime: "100%", visits: "5.6k", lastDeploy: "3d atrás", stack: ["React", "Tailwind"] },
  { name: "Café Artesanal", type: "E-commerce", status: "building", url: "cafeartesanal.com.br", uptime: "—", visits: "—", lastDeploy: "em progresso", stack: ["React", "Stripe", "Supabase"] },
  { name: "Moda Express", type: "Web App", status: "live", url: "modaexpress.app", uptime: "99.5%", visits: "22.1k", lastDeploy: "5h atrás", stack: ["React", "Firebase"] },
  { name: "Fitness Pro", type: "Dashboard", status: "review", url: "fitnesspro.app", uptime: "—", visits: "—", lastDeploy: "em revisão", stack: ["React", "Charts", "Supabase"] },
];

const statusConfig = {
  live: { label: "Online", color: "bg-success/10 text-success", dot: "bg-success" },
  building: { label: "Em desenvolvimento", color: "bg-warning/10 text-warning", dot: "bg-warning" },
  review: { label: "Em revisão", color: "bg-primary/10 text-primary", dot: "bg-primary" },
};

const stats = [
  { label: "Apps em Produção", value: "12", icon: Globe, change: "+2 este mês" },
  { label: "Uptime Médio", value: "99.8%", icon: CheckCircle2, change: "Últimos 30 dias" },
  { label: "Visitas Totais", value: "48.3k", icon: ArrowUpRight, change: "+18% vs mês anterior" },
  { label: "Deploys esta Semana", value: "9", icon: Layers, change: "3 pendentes" },
];

const typeIcons: Record<string, typeof Monitor> = {
  "Landing Page": Monitor,
  "Web App": Code2,
  "E-commerce": Smartphone,
  "Dashboard": Layers,
};

const WebApps = () => {
  return (
    <AdminLayout>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  Web Apps
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Gerencie suas aplicações web e landing pages.</p>
              </div>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" />
                Novo Projeto
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-5 glow-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Apps Grid */}
            <div>
              <h2 className="text-base font-semibold text-foreground mb-4">Todos os Projetos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {apps.map((app) => {
                  const status = statusConfig[app.status as keyof typeof statusConfig];
                  const TypeIcon = typeIcons[app.type] || Globe;
                  return (
                    <div key={app.name} className="glass-card rounded-xl p-5 glow-border hover:border-primary/20 transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <TypeIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">{app.name}</h3>
                            <p className="text-xs text-muted-foreground">{app.type}</p>
                          </div>
                        </div>
                        <button className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>

                      {/* Status & URL */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${app.status === "live" ? "animate-pulse" : ""}`} />
                          {status.label}
                        </span>
                        {app.status === "live" && (
                          <a href="#" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors ml-auto">
                            {app.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-3 py-3 border-t border-border/30">
                        <div>
                          <p className="text-xs text-muted-foreground">Uptime</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{app.uptime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Visitas</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{app.visits}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Deploy</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {app.lastDeploy}
                          </p>
                        </div>
                      </div>

                      {/* Stack */}
                      <div className="flex items-center gap-1.5 mt-3">
                        {app.stack.map((tech) => (
                          <span key={tech} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
        </div>
    </AdminLayout>
  );
};

export default WebApps;

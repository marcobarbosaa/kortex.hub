import { AdminLayout } from "@/components/AdminLayout";
import { Palette, Search, Bell, Plus, Eye, Clock, CheckCircle2, MessageSquare, Image, Type, Layout } from "lucide-react";

const projects = [
  { name: "Identidade Visual — Tech Solutions", type: "Branding", status: "approved", preview: "hsl(210 100% 55%)", deliverables: ["Logo", "Paleta", "Tipografia", "Manual"], progress: 100, comments: 4, updated: "2h atrás" },
  { name: "UI/UX — App Fitness Pro", type: "Interface", status: "in_review", preview: "hsl(145 65% 45%)", deliverables: ["Wireframes", "Design System", "Protótipo"], progress: 85, comments: 12, updated: "5h atrás" },
  { name: "Landing Page — Clínica Vida Nova", type: "Web Design", status: "in_progress", preview: "hsl(38 92% 55%)", deliverables: ["Desktop", "Mobile", "Componentes"], progress: 60, comments: 8, updated: "1d atrás" },
  { name: "Social Media Kit — Café Artesanal", type: "Social", status: "in_progress", preview: "hsl(0 72% 55%)", deliverables: ["Templates Feed", "Stories", "Reels Covers"], progress: 40, comments: 3, updated: "2d atrás" },
  { name: "Rebranding — Studio Arquitetura", type: "Branding", status: "briefing", preview: "hsl(260 60% 55%)", deliverables: ["Moodboard", "Logo Concepts"], progress: 15, comments: 6, updated: "3d atrás" },
  { name: "Dashboard UI — Moda Express", type: "Interface", status: "approved", preview: "hsl(180 60% 45%)", deliverables: ["Dashboard", "Reports", "Settings"], progress: 100, comments: 2, updated: "4d atrás" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  approved: { label: "Aprovado", color: "bg-success/10 text-success" },
  in_review: { label: "Em revisão", color: "bg-warning/10 text-warning" },
  in_progress: { label: "Em andamento", color: "bg-primary/10 text-primary" },
  briefing: { label: "Briefing", color: "bg-muted text-muted-foreground" },
};

const typeIcons: Record<string, typeof Palette> = {
  Branding: Palette, Interface: Layout, "Web Design": Image, Social: Type,
};

const stats = [
  { label: "Projetos Ativos", value: "8" },
  { label: "Aguardando Revisão", value: "3" },
  { label: "Entregues este Mês", value: "5" },
  { label: "Satisfação", value: "96%" },
];

const DesignHub = () => (
  <AdminLayout>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2"><Palette className="h-6 w-6 text-primary" /> Design Hub</h1>
              <p className="text-sm text-muted-foreground mt-1">Projetos de design, identidade visual e interfaces.</p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Novo Projeto</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4 glow-border text-center">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((p) => {
              const st = statusConfig[p.status];
              const TypeIcon = typeIcons[p.type] || Palette;
              return (
                <div key={p.name} className="glass-card rounded-xl overflow-hidden glow-border hover:border-primary/20 transition-all group">
                  {/* Color preview bar */}
                  <div className="h-2 w-full" style={{ background: p.preview }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                          <TypeIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground leading-tight">{p.name}</h3>
                          <p className="text-xs text-muted-foreground">{p.type}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{p.progress}%</span>
                    </div>

                    {/* Deliverables */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.deliverables.map((d) => (
                        <span key={d} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">{d}</span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/30">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{p.comments}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.updated}</span>
                      </div>
                      <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium">
                        <Eye className="h-3 w-3" /> Ver
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
  </AdminLayout>
);

export default DesignHub;

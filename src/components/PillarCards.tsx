import { Brain, Palette, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";

export function PillarCards() {
  const { data: stats } = useQuery({
    queryKey: ['admin-pillar-stats'],
    queryFn: async () => {
      // Contar projetos em análise (paused)
      const { count: projectsPaused } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'paused');

      // Contar projetos ativos
      const { count: projectsActive } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Contar projetos concluídos
      const { count: projectsCompleted } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Contar total de projetos
      const { count: projectsTotal } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      const projectProgress = projectsTotal 
        ? Math.round(((projectsCompleted || 0) / projectsTotal) * 100) 
        : 0;

      return {
        projectsPaused: projectsPaused || 0,
        projectsActive: projectsActive || 0,
        projectsCompleted: projectsCompleted || 0,
        projectsTotal: projectsTotal || 0,
        projectProgress,
      };
    }
  });

  const pillars = [
    {
      icon: Brain,
      title: "Solicitações Pendentes",
      value: String(stats?.projectsPaused || 0),
      label: "projetos em análise",
      progress: stats?.projectsTotal ? Math.round(((stats.projectsPaused) / stats.projectsTotal) * 100) : 0,
    },
    {
      icon: Palette,
      title: "Projetos em Andamento",
      value: String(stats?.projectsActive || 0),
      label: "projetos ativos",
      progress: stats?.projectsTotal ? Math.round(((stats.projectsActive) / stats.projectsTotal) * 100) : 0,
    },
    {
      icon: Settings,
      title: "Projetos Concluídos",
      value: String(stats?.projectsCompleted || 0),
      label: "entregues",
      progress: stats?.projectProgress || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pillars.map((pillar) => (
        <div key={pillar.title} className="glass-card rounded-xl p-5 glow-border group hover:border-primary/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <pillar.icon className="h-4.5 w-4.5 text-primary" />
            </div>
            <h4 className="text-sm font-medium text-foreground">{pillar.title}</h4>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{pillar.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{pillar.label}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Progresso</p>
              <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pillar.progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import { ClientLayout } from "@/components/ClientLayout";
import { Briefcase, ChevronRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const STATUS_COLOR: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  paused: "bg-warning/10 text-warning",
};

const STATUS_LABEL: Record<string, string> = {
  active: "em andamento",
  completed: "concluído",
  paused: "pausado",
};

type Filter = "Todos" | "active" | "completed" | "paused";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "Todos", label: "Todos" },
  { key: "active", label: "Em andamento" },
  { key: "completed", label: "Concluído" },
  { key: "paused", label: "Pausado" },
];

const Projects = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("Todos");

  const { data: projects, isLoading } = useQuery({
    queryKey: ['client-projects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const filtered = filter === "Todos"
    ? projects
    : projects?.filter((p) => p.status === filter);

  return (
    <ClientLayout
      title="Projetos"
      description="Todos os seus projetos ativos e concluídos em um só lugar."
    >
      <div className="space-y-4">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered?.length || 0} projeto(s)
          </span>
        </div>

        {/* Project list */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Carregando projetos...</div>
          ) : !filtered || filtered.length === 0 ? (
            <div className="glass-card rounded-xl p-8 glow-border text-center">
              <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Os projetos criados pela GABS aparecerão aqui.</p>
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id}>
                <div
                  onClick={() => setSelected(selected === p.id ? null : p.id)}
                  className={cn(
                    "glass-card rounded-xl p-5 glow-border cursor-pointer border-l-2 border-l-primary transition-all hover:border-primary/30",
                    selected === p.id && "rounded-b-none border-b-0"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", STATUS_COLOR[p.status || 'active'])}>
                          {STATUS_LABEL[p.status || 'active']}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Criado em {format(new Date(p.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      "h-4 w-4 text-muted-foreground shrink-0 transition-transform mt-1",
                      selected === p.id && "rotate-90"
                    )} />
                  </div>
                </div>

                {/* Expanded detail */}
                {selected === p.id && (
                  <ProjectDetail id={p.id} description={p.description} status={p.status} updatedAt={p.updated_at} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

const ProjectDetail = ({ id, description, status, updatedAt }: { id: string, description: string | null, status: string | null, updatedAt: string }) => {
  const { data: deliverables, isLoading } = useQuery({
    queryKey: ['project-deliverables', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="glass-card rounded-b-xl px-5 pb-5 pt-4 border-t border-border/30 -mt-px space-y-5">
      <p className="text-sm text-muted-foreground">
        {description || "Sem descrição disponível."}
      </p>

      {/* Deliverables */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Entregas & Arquivos</h4>
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Carregando entregas...</p>
        ) : !deliverables || deliverables.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhuma entrega disponível ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {deliverables.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    {d.file_type}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.file_size || 'Link'}</p>
                  </div>
                </div>
                <Download className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/20">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Status</p>
          <p className="text-sm font-medium text-foreground mt-0.5 capitalize">{STATUS_LABEL[status || 'active']}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Última atualização</p>
          <p className="text-sm font-medium text-foreground mt-0.5">
            {format(new Date(updatedAt), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;

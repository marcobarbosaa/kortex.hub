import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Briefcase, Plus, Loader2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { DeliverableManager } from "@/components/admin/DeliverableManager";
import { FileText } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  completed: "Concluído",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-warning/10 text-warning",
  completed: "bg-muted text-muted-foreground",
};

const AdminProjects = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ id: string, name: string } | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: clients } = useQuery({
    queryKey: ['admin-clients-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'client');
      if (error) throw error;
      return data;
    }
  });

  const createProject = useMutation({
    mutationFn: async (newProject: any) => {
      const { data, error } = await supabase.from('projects').insert(newProject).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success("Projeto criado com sucesso!");
      setIsModalOpen(false);
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success("Projeto removido.");
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createProject.mutate({
      name: fd.get('name'),
      client_id: fd.get('client_id'),
      description: fd.get('description'),
      status: fd.get('status'),
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" /> Projetos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie os projetos de seus clientes.
            </p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" /> Novo Projeto
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border-border/50 text-foreground">
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Projeto</label>
                  <input required name="name" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm" placeholder="Ex: Redesign Landing Page" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cliente</label>
                  <select required name="client_id" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm text-foreground">
                    <option value="">Selecione...</option>
                    {clients?.map(c => (
                      <option key={c.id} value={c.id}>{c.full_name || 'Sem nome'}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea name="description" rows={3} className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm resize-none" placeholder="Descreva o projeto..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select required name="status" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm text-foreground">
                    <option value="active">Ativo</option>
                    <option value="paused">Pausado</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>
                <button type="submit" disabled={createProject.isPending} className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors mt-4 flex justify-center items-center">
                  {createProject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar Projeto'}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 glow-border text-center">
            <p className="text-2xl font-bold text-foreground">{projects?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Total de Projetos</p>
          </div>
          <div className="glass-card rounded-xl p-4 glow-border text-center">
            <p className="text-2xl font-bold text-foreground">{projects?.filter(p => p.status === 'active').length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Ativos</p>
          </div>
          <div className="glass-card rounded-xl p-4 glow-border text-center">
            <p className="text-2xl font-bold text-foreground">{projects?.filter(p => p.status === 'completed').length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Concluídos</p>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl p-6 glow-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border/50">
                  <th className="text-left pb-3 font-medium">Projeto</th>
                  <th className="text-left pb-3 font-medium">Cliente</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Criado em</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Carregando...</td></tr>
                ) : !projects || projects.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Nenhum projeto cadastrado.</td></tr>
                ) : (
                  projects.map((p) => {
                    const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
                    return (
                      <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors group">
                        <td className="py-3">
                          <p className="text-foreground font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{p.description || '—'}</p>
                        </td>
                        <td className="py-3 text-muted-foreground">{profile?.full_name || 'Desconhecido'}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[p.status || 'active']}`}>
                            {STATUS_LABEL[p.status || 'active']}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">
                          {format(new Date(p.created_at), "dd MMM yyyy", { locale: ptBR })}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setSelectedProject({ id: p.id, name: p.name })}
                              title="Gerenciar Entregas"
                              className="h-8 w-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteProject.mutate(p.id)}
                              title="Excluir Projeto"
                              className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedProject && (
          <DeliverableManager
            projectId={selectedProject.id}
            projectName={selectedProject.name}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;

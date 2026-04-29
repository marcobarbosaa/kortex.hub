import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Plus, Trash2, Loader2, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeliverableManagerProps {
  projectId: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeliverableManager({ projectId, projectName, isOpen, onClose }: DeliverableManagerProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const { data: deliverables, isLoading } = useQuery({
    queryKey: ['project-deliverables', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isOpen
  });

  const addDeliverable = useMutation({
    mutationFn: async (newDel: any) => {
      const { data, error } = await supabase
        .from('deliverables')
        .insert({ ...newDel, project_id: projectId })
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-deliverables', projectId] });
      toast.success("Entrega adicionada!");
      setIsAdding(false);
    },
    onError: (error) => toast.error(`Erro: ${error.message}`)
  });

  const removeDeliverable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('deliverables').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-deliverables', projectId] });
      toast.success("Entrega removida.");
    },
    onError: (error) => toast.error(`Erro: ${error.message}`)
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addDeliverable.mutate({
      name: fd.get('name'),
      file_type: fd.get('file_type'),
      file_size: fd.get('file_size') || null,
      url: fd.get('url'),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A] border-border/50 text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Entregas: {projectName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {isAdding ? (
            <form onSubmit={handleAdd} className="glass-card p-4 space-y-3 glow-border">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Nome</label>
                  <input required name="name" className="w-full bg-muted/30 border border-border/50 rounded p-1.5 text-xs" placeholder="Ex: Brandbook v1" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Tipo</label>
                  <select name="file_type" className="w-full bg-muted/30 border border-border/50 rounded p-1.5 text-xs text-foreground">
                    <option value="PDF">PDF</option>
                    <option value="Figma">Figma</option>
                    <option value="ZIP">ZIP</option>
                    <option value="Link">Link</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Tamanho (opcional)</label>
                  <input name="file_size" className="w-full bg-muted/30 border border-border/50 rounded p-1.5 text-xs" placeholder="Ex: 4.2 MB" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">URL</label>
                  <input required name="url" className="w-full bg-muted/30 border border-border/50 rounded p-1.5 text-xs" placeholder="https://..." />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-3 py-1.5 rounded text-xs border border-border hover:bg-muted transition-colors">Cancelar</button>
                <button type="submit" disabled={addDeliverable.isPending} className="flex-1 px-3 py-1.5 rounded text-xs bg-primary text-primary-foreground font-bold flex justify-center items-center">
                  {addDeliverable.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Salvar'}
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setIsAdding(true)} className="w-full py-2 border border-dashed border-border/50 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all flex items-center justify-center gap-2">
              <Plus className="h-3 w-3" /> Adicionar nova entrega
            </button>
          )}

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {isLoading ? (
              <p className="text-center py-4 text-xs text-muted-foreground">Carregando...</p>
            ) : deliverables?.length === 0 ? (
              <p className="text-center py-4 text-xs text-muted-foreground">Nenhuma entrega vinculada.</p>
            ) : (
              deliverables?.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {d.file_type}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{d.name}</p>
                      <p className="text-[10px] text-muted-foreground">{d.file_size || 'Link'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={d.url} target="_blank" rel="noreferrer" className="h-7 w-7 rounded flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button onClick={() => removeDeliverable.mutate(d.id)} className="h-7 w-7 rounded flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

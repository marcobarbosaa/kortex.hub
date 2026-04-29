import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { BarChart3, Plus, Play, Pause, Eye, MousePointerClick, DollarSign, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Play }> = {
  active: { label: "Ativa", color: "bg-success/10 text-success", icon: Play },
  paused: { label: "Pausada", color: "bg-warning/10 text-warning", icon: Pause },
  scheduled: { label: "Agendada", color: "bg-primary/10 text-primary", icon: Calendar },
  completed: { label: "Finalizada", color: "bg-muted text-muted-foreground", icon: Eye },
};

const Campaigns = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Busca Campanhas + Dados do Cliente
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Busca Clientes para o select do modal
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

  // Mutação para Criar Nova Campanha
  const createCampaign = useMutation({
    mutationFn: async (newCampaign: any) => {
      const { data, error } = await supabase
        .from('campaigns')
        .insert(newCampaign)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      toast.success("Campanha criada com sucesso!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar: ${error.message}`);
    }
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createCampaign.mutate({
      name: formData.get('name'),
      client_id: formData.get('client_id'),
      platform: formData.get('platform'),
      budget: Number(formData.get('budget')),
      status: 'active'
    });
  };

  const totals = [
    { label: "Campanhas Totais", value: campaigns?.length || 0, icon: Play },
    { label: "Investimento Total", value: `R$ ${campaigns?.reduce((acc, c) => acc + Number(c.budget || 0), 0).toLocaleString('pt-BR') || '0'}`, icon: DollarSign },
    { label: "Gasto Atual", value: `R$ ${campaigns?.reduce((acc, c) => acc + Number(c.spent || 0), 0).toLocaleString('pt-BR') || '0'}`, icon: MousePointerClick },
    { label: "ROAS Médio", value: "N/A", icon: TrendingUp },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" /> Campanhas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Acompanhe e gerencie suas campanhas de marketing.</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" /> Nova Campanha
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border-border/50 text-foreground">
              <DialogHeader>
                <DialogTitle>Criar Nova Campanha</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome da Campanha</label>
                  <input required name="name" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm" placeholder="Ex: Black Friday 2024" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cliente</label>
                  <select required name="client_id" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm text-foreground">
                    <option value="">Selecione um cliente...</option>
                    {clients?.map(c => (
                      <option key={c.id} value={c.id}>{c.full_name || 'Sem nome'}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plataforma</label>
                  <select required name="platform" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm text-foreground">
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="TikTok Ads">TikTok Ads</option>
                    <option value="Multi-canal">Multi-canal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Orçamento (R$)</label>
                  <input required name="budget" type="number" min="0" step="0.01" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm" placeholder="1000.00" />
                </div>
                <button type="submit" disabled={createCampaign.isPending} className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors mt-6 flex justify-center items-center">
                  {createCampaign.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar Campanha'}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {totals.map((t) => (
            <div key={t.label} className="glass-card rounded-xl p-5 glow-border">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <t.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{t.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{t.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Carregando campanhas...</div>
          ) : campaigns?.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Nenhuma campanha cadastrada. Clique em "Nova Campanha" para começar.</div>
          ) : (
            campaigns?.map((c) => {
              // Ajuste de segurança para status desconhecidos
              const st = statusConfig[c.status || 'active'] || statusConfig['active'];
              const progress = c.budget ? Math.min(Math.round(((c.spent || 0) / c.budget) * 100), 100) : 0;
              const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;

              return (
                <div key={c.id} className="glass-card rounded-xl p-5 glow-border hover:border-primary/20 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-foreground font-semibold">{c.name}</h3>
                        <span className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${st.color}`}>
                          <st.icon className="h-3 w-3" />{st.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{profile?.full_name || 'Desconhecido'}</span>
                        <span>•</span>
                        <span>{c.platform}</span>
                        <span>•</span>
                        <span>Início: {format(new Date(c.created_at), "dd MMM", { locale: ptBR })}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-1.5 flex-1 max-w-xs rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{progress}% do budget</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-right shrink-0">
                      <div><p className="text-xs text-muted-foreground">Budget</p><p className="text-sm font-semibold text-foreground">R$ {Number(c.budget).toLocaleString('pt-BR')}</p></div>
                      <div><p className="text-xs text-muted-foreground">Gasto</p><p className="text-sm font-semibold text-foreground">R$ {Number(c.spent).toLocaleString('pt-BR')}</p></div>
                      <div><p className="text-xs text-muted-foreground">Cliques</p><p className="text-sm font-semibold text-foreground">--</p></div>
                      <div><p className="text-xs text-muted-foreground">Conversões</p><p className="text-sm font-semibold text-foreground">--</p></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Campaigns;

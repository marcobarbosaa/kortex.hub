import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Receipt, Plus, Loader2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const STATUS_LABEL: Record<string, string> = {
  paid: "Paga",
  pending: "Pendente",
  overdue: "Vencida",
};
const STATUS_COLOR: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
};

const AdminInvoices = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
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

  const createInvoice = useMutation({
    mutationFn: async (newInvoice: any) => {
      const { data, error } = await supabase.from('invoices').insert(newInvoice).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      toast.success("Fatura criada com sucesso!");
      setIsModalOpen(false);
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      toast.success("Fatura removida.");
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createInvoice.mutate({
      client_id: fd.get('client_id'),
      amount: Number(fd.get('amount')),
      due_date: fd.get('due_date'),
      status: fd.get('status'),
    });
  };

  const totalPaid = invoices?.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0) || 0;
  const totalPending = invoices?.filter(i => i.status === 'pending').reduce((s, i) => s + Number(i.amount), 0) || 0;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" /> Faturas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as faturas de seus clientes.
            </p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" /> Nova Fatura
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border-border/50 text-foreground">
              <DialogHeader>
                <DialogTitle>Criar Nova Fatura</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
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
                  <label className="text-sm font-medium">Valor (R$)</label>
                  <input required name="amount" type="number" min="0" step="0.01" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm" placeholder="4800.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Vencimento</label>
                  <input required name="due_date" type="date" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select required name="status" className="w-full bg-muted/50 border border-border/50 rounded-md p-2 text-sm text-foreground">
                    <option value="pending">Pendente</option>
                    <option value="paid">Paga</option>
                    <option value="overdue">Vencida</option>
                  </select>
                </div>
                <button type="submit" disabled={createInvoice.isPending} className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors mt-4 flex justify-center items-center">
                  {createInvoice.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar Fatura'}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 glow-border text-center">
            <p className="text-2xl font-bold text-foreground">{invoices?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </div>
          <div className="glass-card rounded-xl p-4 glow-border text-center">
            <p className="text-2xl font-bold text-success">R$ {totalPaid.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-muted-foreground mt-1">Receita (Pagas)</p>
          </div>
          <div className="glass-card rounded-xl p-4 glow-border text-center">
            <p className="text-2xl font-bold text-warning">R$ {totalPending.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-muted-foreground mt-1">Pendente</p>
          </div>
          <div className="glass-card rounded-xl p-4 glow-border text-center">
            <p className="text-2xl font-bold text-foreground">{invoices?.filter(i => i.status === 'overdue').length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Vencidas</p>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl p-6 glow-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border/50">
                  <th className="text-left pb-3 font-medium">Cliente</th>
                  <th className="text-left pb-3 font-medium">Valor</th>
                  <th className="text-left pb-3 font-medium">Vencimento</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Criada em</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Carregando...</td></tr>
                ) : !invoices || invoices.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhuma fatura cadastrada.</td></tr>
                ) : (
                  invoices.map((inv) => {
                    const profile = Array.isArray(inv.profiles) ? inv.profiles[0] : inv.profiles;
                    return (
                      <tr key={inv.id} className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors group">
                        <td className="py-3 text-foreground font-medium">{profile?.full_name || 'Desconhecido'}</td>
                        <td className="py-3 text-foreground font-semibold">
                          R$ {Number(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-muted-foreground">{format(new Date(inv.due_date), "dd/MM/yyyy")}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[inv.status || 'pending']}`}>
                            {STATUS_LABEL[inv.status || 'pending']}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">
                          {format(new Date(inv.created_at), "dd MMM yyyy", { locale: ptBR })}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => deleteInvoice.mutate(inv.id)}
                            className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;

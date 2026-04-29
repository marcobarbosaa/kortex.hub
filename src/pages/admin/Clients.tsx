import { AdminLayout } from "@/components/AdminLayout";
import { Users, Search, Bell, Plus, Mail, Phone, Calendar, MoreVertical, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados falsos mantidos apenas para os campos que ainda não existem no banco (MRR, plano, saúde)
const mockStats = { plan: "Growth", mrr: "R$ --", status: "Ativo", health: 85, phone: "Não informado" };

const statusColor: Record<string, string> = {
  "Ativo": "bg-success/10 text-success",
  "Onboarding": "bg-warning/10 text-warning",
  "Em risco": "bg-destructive/10 text-destructive",
};

// Estatísticas podem ser calculadas dinamicamente depois
const defaultStats = [
  { label: "Total de Clientes", value: "0" },
  { label: "MRR Total", value: "R$ 0" },
  { label: "Churn Rate", value: "0%" },
  { label: "NPS Médio", value: "0" },
];

function HealthBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-success" : value >= 60 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

const Clients = () => {
  const { data: clients, isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const totalClients = clients?.length || 0;

  return (
  <AdminLayout>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Clientes</h1>
              <p className="text-sm text-muted-foreground mt-1">Gestão completa da sua base de clientes.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-muted text-foreground px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"><Filter className="h-4 w-4" /> Filtrar</button>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Novo Cliente</button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-4 glow-border text-center">
              <p className="text-2xl font-bold text-foreground">{totalClients}</p>
              <p className="text-xs text-muted-foreground mt-1">Total de Clientes</p>
            </div>
            {defaultStats.slice(1).map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4 glow-border text-center opacity-50">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-xl p-6 glow-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground text-xs border-b border-border/50">
                    <th className="text-left pb-3 font-medium">Cliente</th>
                    <th className="text-left pb-3 font-medium hidden lg:table-cell">Contato</th>
                    <th className="text-left pb-3 font-medium">Plano</th>
                    <th className="text-left pb-3 font-medium">MRR</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                    <th className="text-left pb-3 font-medium">Saúde</th>
                    <th className="text-left pb-3 font-medium hidden md:table-cell">Desde</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        Carregando clientes...
                      </td>
                    </tr>
                  ) : clients?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        Nenhum cliente cadastrado ainda.
                      </td>
                    </tr>
                  ) : clients?.map((c) => (
                    <tr key={c.id} className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors group">
                      <td className="py-3">
                        <p className="text-foreground font-medium">{c.full_name || 'Sem nome'}</p>
                        <p className="text-xs text-muted-foreground">{mockStats.phone}</p>
                      </td>
                      <td className="py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />{c.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{mockStats.plan}</td>
                      <td className="py-3 text-foreground font-semibold">{mockStats.mrr}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[mockStats.status]}`}>
                          {mockStats.status}
                        </span>
                      </td>
                      <td className="py-3"><HealthBar value={mockStats.health} /></td>
                      <td className="py-3 hidden md:table-cell text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {format(new Date(c.created_at), "MMM yyyy", { locale: ptBR })}
                      </td>
                      <td className="py-3">
                        <button className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  </AdminLayout>
  );
};

export default Clients;






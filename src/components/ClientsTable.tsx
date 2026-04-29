import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { useNavigate } from "react-router-dom";

function HealthBar({ value }: { value: number }) {
  const color = value >= 90 ? "bg-success" : value >= 75 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

export function ClientsTable() {
  const navigate = useNavigate();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['dashboard-clients-table'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="glass-card rounded-xl p-6 glow-border">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-foreground font-semibold text-base">Clientes Recentes</h3>
        <button
          onClick={() => navigate('/clients')}
          className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Ver todos →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border/50">
              <th className="text-left pb-3 font-medium">Cliente</th>
              <th className="text-left pb-3 font-medium">E-mail</th>
              <th className="text-left pb-3 font-medium">Status</th>
              <th className="text-left pb-3 font-medium">Saúde</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted-foreground">Carregando...</td>
              </tr>
            ) : clients?.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted-foreground">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            ) : (
              clients?.map((client) => (
                <tr key={client.id} className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="py-3 text-foreground font-medium">{client.full_name || 'Sem nome'}</td>
                  <td className="py-3 text-muted-foreground text-xs">{client.email}</td>
                  <td className="py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-success/10 text-success">
                      Ativo
                    </span>
                  </td>
                  <td className="py-3"><HealthBar value={85} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

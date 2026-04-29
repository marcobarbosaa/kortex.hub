import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function RevenueChart() {
  const { data: chartData } = useQuery({
    queryKey: ['admin-revenue-chart'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('amount, status, due_date, created_at')
        .eq('status', 'paid')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Agrupar faturas por mês
      const monthlyMap = new Map<string, number>();
      data?.forEach((inv) => {
        const monthKey = format(new Date(inv.created_at), 'MMM', { locale: ptBR });
        const current = monthlyMap.get(monthKey) || 0;
        monthlyMap.set(monthKey, current + Number(inv.amount));
      });

      // Se não tiver dados, retorna dados vazios
      if (monthlyMap.size === 0) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
        return meses.map(m => ({ month: m, receita: 0, meta: 0 }));
      }

      return Array.from(monthlyMap.entries()).map(([month, receita]) => ({
        month,
        receita,
        meta: receita * 1.2, // Meta = 120% da receita para referência
      }));
    }
  });

  const data = chartData || [];

  return (
    <div className="glass-card rounded-xl p-6 glow-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-foreground font-semibold text-base">Receita Mensal</h3>
          <p className="text-muted-foreground text-sm mt-0.5">Receita vs Meta</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            Receita
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            Meta
          </div>
        </div>
      </div>
      <div className="h-[280px]">
        {data.length === 0 || data.every(d => d.receita === 0) ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Nenhuma fatura paga registrada ainda. Os dados aparecerão aqui.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210 100% 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(210 100% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="month" stroke="hsl(215 12% 40%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215 12% 40%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220 18% 10%)",
                  border: "1px solid hsl(220 14% 18%)",
                  borderRadius: "8px",
                  color: "hsl(210 20% 95%)",
                  fontSize: 13,
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
              />
              <Area type="monotone" dataKey="meta" stroke="hsl(215 12% 35%)" strokeDasharray="4 4" fillOpacity={0} strokeWidth={1.5} />
              <Area type="monotone" dataKey="receita" stroke="hsl(210 100% 55%)" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

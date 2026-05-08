import { AdminLayout } from "@/components/AdminLayout";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Eye, MousePointerClick, Clock, Target, BarChart3 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";

const trafficData = [
  { day: "Seg", organico: 420, pago: 680 },
  { day: "Ter", organico: 510, pago: 720 },
  { day: "Qua", organico: 480, pago: 850 },
  { day: "Qui", organico: 620, pago: 790 },
  { day: "Sex", organico: 750, pago: 920 },
  { day: "Sáb", organico: 380, pago: 540 },
  { day: "Dom", organico: 290, pago: 410 },
];

const conversionData = [
  { month: "Jan", taxa: 3.2 }, { month: "Fev", taxa: 3.5 }, { month: "Mar", taxa: 3.8 },
  { month: "Abr", taxa: 4.1 }, { month: "Mai", taxa: 4.4 }, { month: "Jun", taxa: 4.8 }, { month: "Jul", taxa: 5.1 },
];



const metrics = [
  { label: "Sessões Totais", value: "32.4k", change: "+14%", trend: "up", icon: Eye },
  { label: "Taxa de Conversão", value: "5.1%", change: "+0.3%", trend: "up", icon: Target },
  { label: "Custo por Lead", value: "R$ 52", change: "-8%", trend: "up", icon: MousePointerClick },
  { label: "Tempo Médio", value: "3m 42s", change: "+12s", trend: "up", icon: Clock },
];

const Performance = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns-performance'],
    queryFn: async () => {
      const { data, error } = await supabase.from('campaigns').select('*');
      if (error) throw error;
      return data;
    }
  });

  const dynamicChannels: Array<{ name: string; spend: string; leads: string; cpl: string; roas: string; trend: string }> = [];
  if (campaigns) {
    const grouped = campaigns.reduce((acc, c) => {
      if (!acc[c.platform]) acc[c.platform] = { spend: 0 };
      acc[c.platform].spend += Number(c.spent || 0);
      return acc;
    }, {} as Record<string, { spend: number }>);

    Object.entries(grouped).forEach(([platform, data]) => {
      dynamicChannels.push({
        name: platform,
        spend: `R$ ${data.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        leads: "Em breve",
        cpl: "Em breve",
        roas: "Em breve",
        trend: "up"
      });
    });
  }

  return (
    <AdminLayout searchPlaceholder="Buscar...">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" /> Performance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Métricas de tráfego, conversão e ROI dos seus canais.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="glass-card rounded-xl p-5 glow-border">
              <div className="flex items-start justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <m.icon className="h-4 w-4 text-primary" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${m.trend === "up" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                  {m.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {m.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6 glow-border">
            <h3 className="text-foreground font-semibold text-base mb-1">Tráfego por Fonte</h3>
            <p className="text-sm text-muted-foreground mb-5">Orgânico vs Pago — última semana</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
                  <XAxis dataKey="day" stroke="hsl(215 12% 40%)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215 12% 40%)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: "8px", color: "hsl(210 20% 95%)", fontSize: 13 }} />
                  <Bar dataKey="organico" fill="hsl(145 65% 45%)" radius={[4, 4, 0, 0]} name="Orgânico" />
                  <Bar dataKey="pago" fill="hsl(210 100% 55%)" radius={[4, 4, 0, 0]} name="Pago" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 glow-border">
            <h3 className="text-foreground font-semibold text-base mb-1">Evolução da Conversão</h3>
            <p className="text-sm text-muted-foreground mb-5">Taxa de conversão mensal</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conversionData}>
                  <defs>
                    <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(210 100% 55%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(210 100% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
                  <XAxis dataKey="month" stroke="hsl(215 12% 40%)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215 12% 40%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: "8px", color: "hsl(210 20% 95%)", fontSize: 13 }} formatter={(v: number) => [`${v}%`, "Conversão"]} />
                  <Area type="monotone" dataKey="taxa" stroke="hsl(210 100% 55%)" fill="url(#convGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 glow-border">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-foreground font-semibold text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Canais de Aquisição</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border/50">
                  <th className="text-left pb-3 font-medium">Canal</th>
                  <th className="text-left pb-3 font-medium">Investimento</th>
                  <th className="text-left pb-3 font-medium">Leads</th>
                  <th className="text-left pb-3 font-medium">CPL</th>
                  <th className="text-left pb-3 font-medium">ROAS</th>
                  <th className="text-left pb-3 font-medium">Tendência</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Carregando dados...</td></tr>
                ) : dynamicChannels.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhuma campanha registrada no sistema.</td></tr>
                ) : dynamicChannels.map((ch) => (
                  <tr key={ch.name} className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="py-3 text-foreground font-medium">{ch.name}</td>
                    <td className="py-3 text-muted-foreground">{ch.spend}</td>
                    <td className="py-3 text-foreground font-medium">{ch.leads}</td>
                    <td className="py-3 text-muted-foreground">{ch.cpl}</td>
                    <td className="py-3 text-foreground font-semibold">{ch.roas}</td>
                    <td className="py-3">
                      {ch.trend === "up" ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
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

export default Performance;

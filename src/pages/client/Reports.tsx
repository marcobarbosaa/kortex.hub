import { ClientLayout } from "@/components/ClientLayout";
import { BarChart3, FileText, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { trafficData } from "./_data";

const reports = [
  { name: "Relatório Mensal – Março 2026",     date: "01 Abr 2026", size: "1.8 MB" },
  { name: "Relatório Mensal – Fevereiro 2026", date: "01 Mar 2026", size: "2.1 MB" },
  { name: "Relatório Mensal – Janeiro 2026",   date: "01 Fev 2026", size: "1.6 MB" },
  { name: "Relatório Anual – 2025",            date: "15 Jan 2026", size: "6.4 MB" },
];

const kpis = [
  { label: "CVR Médio",      value: "3.4%",    delta: "+0.8%",    up: true },
  { label: "CPC Médio",      value: "R$ 1,82", delta: "-R$ 0,30", up: true },
  { label: "ROAS Campanha",  value: "4.8x",    delta: "+0.6x",    up: true },
  { label: "Custo/Lead",     value: "R$ 29,50", delta: "-R$ 4,10", up: true },
];

const Reports = () => (
  <ClientLayout
    title="Relatórios"
    description="Métricas de desempenho e relatórios disponíveis para download."
  >
    {/* Traffic bar chart */}
    <div className="glass-card rounded-xl p-5 glow-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" /> Visitas & Leads Gerados
        </h2>
        <span className="text-xs text-muted-foreground">Últimos 6 meses</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={trafficData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
          <Bar dataKey="visitas" fill="hsl(var(--primary))" opacity={0.85} radius={[4, 4, 0, 0]} name="Visitas" />
          <Bar dataKey="leads"   fill="hsl(var(--success))" opacity={0.85} radius={[4, 4, 0, 0]} name="Leads" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 justify-center">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" /> Visitas
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full bg-success inline-block" /> Leads
        </span>
      </div>
    </div>

    {/* KPI tiles */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className="glass-card rounded-xl p-5 glow-border">
          <p className="text-2xl font-bold text-foreground">{k.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
          <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", k.up ? "text-success" : "text-destructive")}>
            {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {k.delta} vs. mês ant.
          </div>
        </div>
      ))}
    </div>

    {/* Downloadable reports */}
    <div className="glass-card rounded-xl p-5 glow-border">
      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-primary" /> Relatórios para Download
      </h2>
      <div className="space-y-2">
        {reports.map((r) => (
          <div key={r.name} className="flex items-center gap-3 rounded-lg bg-muted/30 px-4 py-3 group hover:bg-muted/60 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.date} · {r.size}</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 shrink-0">
              <Download className="h-3.5 w-3.5" /> Baixar
            </button>
          </div>
        ))}
      </div>
    </div>
  </ClientLayout>
);

export default Reports;

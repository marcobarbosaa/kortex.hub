import { AdminLayout } from "@/components/AdminLayout";
import { MetricCard } from "@/components/MetricCard";
import { RevenueChart } from "@/components/RevenueChart";
import { ClientsTable } from "@/components/ClientsTable";
import { ActivityFeed } from "@/components/ActivityFeed";
import { PillarCards } from "@/components/PillarCards";
import { DollarSign, Users, MousePointerClick, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";

const Dashboard = () => {
  const { profile } = useAuth();

  // Busca contagem de clientes
  const { data: clientCount } = useQuery({
    queryKey: ['admin-dashboard-clients'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');
      if (error) throw error;
      return count || 0;
    }
  });

  // Busca contagem de campanhas ativas
  const { data: activeCampaigns } = useQuery({
    queryKey: ['admin-dashboard-campaigns'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      if (error) throw error;
      return count || 0;
    }
  });

  // Busca total de faturas pagas
  const { data: totalRevenue } = useQuery({
    queryKey: ['admin-dashboard-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'paid');
      if (error) throw error;
      return data?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
    }
  });

  // Busca tickets abertos
  const { data: openTickets } = useQuery({
    queryKey: ['admin-dashboard-tickets'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'in_progress']);
      if (error) throw error;
      return count || 0;
    }
  });

  // Gerar saudação baseada na hora
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const nome = profile?.full_name?.split(' ')[0] || 'Admin';

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {saudacao}, {nome} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aqui está o resumo do seu hub de evolução digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Receita Total"
            value={`R$ ${((totalRevenue || 0) / 1000).toFixed(1)}k`}
            change="--"
            trend="up"
            icon={DollarSign}
          />
          <MetricCard
            title="Clientes Ativos"
            value={String(clientCount ?? 0)}
            change="--"
            trend="up"
            icon={Users}
          />
          <MetricCard
            title="Campanhas Ativas"
            value={String(activeCampaigns ?? 0)}
            change="--"
            trend="up"
            icon={MousePointerClick}
          />
          <MetricCard
            title="Tickets Abertos"
            value={String(openTickets ?? 0)}
            change="--"
            trend={openTickets && openTickets > 5 ? "down" : "up"}
            icon={TrendingUp}
          />
        </div>

        <PillarCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><RevenueChart /></div>
          <ActivityFeed />
        </div>

        <ClientsTable />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

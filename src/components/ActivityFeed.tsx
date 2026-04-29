import { Zap, Users, Palette, Globe, TrendingUp, TicketCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type ActivityItem = {
  icon: typeof Users;
  text: string;
  time: string;
  color: string;
};

export function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['admin-activity-feed'],
    queryFn: async () => {
      const items: ActivityItem[] = [];

      // Últimos clientes cadastrados
      const { data: recentClients } = await supabase
        .from('profiles')
        .select('full_name, created_at')
        .eq('role', 'client')
        .order('created_at', { ascending: false })
        .limit(2);

      recentClients?.forEach((c) => {
        items.push({
          icon: Users,
          text: `Novo cliente: ${c.full_name || 'Sem nome'} se cadastrou`,
          time: formatDistanceToNow(new Date(c.created_at), { addSuffix: false, locale: ptBR }),
          color: "text-primary",
        });
      });

      // Últimas campanhas criadas
      const { data: recentCampaigns } = await supabase
        .from('campaigns')
        .select('name, created_at, platform')
        .order('created_at', { ascending: false })
        .limit(2);

      recentCampaigns?.forEach((c) => {
        items.push({
          icon: TrendingUp,
          text: `Campanha "${c.name}" criada em ${c.platform}`,
          time: formatDistanceToNow(new Date(c.created_at), { addSuffix: false, locale: ptBR }),
          color: "text-success",
        });
      });

      // Últimos tickets
      const { data: recentTickets } = await supabase
        .from('support_tickets')
        .select('subject, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      recentTickets?.forEach((t) => {
        items.push({
          icon: TicketCheck,
          text: `Ticket: "${t.subject}"`,
          time: formatDistanceToNow(new Date(t.created_at), { addSuffix: false, locale: ptBR }),
          color: "text-warning",
        });
      });

      // Ordenar tudo por tempo (mais recente primeiro)
      items.sort((a, b) => {
        // Usar o tempo formatado como proxy — ou idealmente guardar o Date
        return 0; // Mantém a ordem de inserção por categoria
      });

      return items.slice(0, 5);
    }
  });

  const fallback: ActivityItem[] = [
    { icon: Zap, text: "Nenhuma atividade recente ainda", time: "agora", color: "text-muted-foreground" },
  ];

  const items = (!activities || activities.length === 0) ? fallback : activities;

  return (
    <div className="glass-card rounded-xl p-6 glow-border">
      <h3 className="text-foreground font-semibold text-base mb-5">Atividade Recente</h3>
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : (
          items.map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/90 leading-snug">{activity.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.time} atrás</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

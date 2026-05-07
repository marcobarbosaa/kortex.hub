import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Bell, Check, Trash2, Loader2, Info } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationPopover() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('realtime-notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const deleteNotif = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-[#0A0A0A] border-border/50 text-foreground shadow-2xl" align="end">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notificações</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">{unreadCount} novas</span>
          )}
        </div>
        <div className="max-h-[350px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-2">
              <Bell className="h-8 w-8 opacity-20 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "p-4 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors group relative",
                  !n.is_read && "bg-primary/5 border-l-2 border-l-primary"
                )}
              >
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-snug">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-1 uppercase">
                      {format(new Date(n.created_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                <div className="absolute top-4 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead.mutate(n.id)}
                      className="h-6 w-6 rounded bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary flex items-center justify-center transition-colors"
                      title="Marcar como lida"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif.mutate(n.id)}
                    className="h-6 w-6 rounded bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-2 border-t border-border/50 text-center">
          <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">Ver todas as notificações</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

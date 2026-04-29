import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Bell, CheckCheck, Trash2, Filter, BellOff,
  Info, Clock, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const Notifications = () => {
  const queryClient = useQueryClient();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      toast.success("Todas marcadas como lidas.");
    }
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    }
  });

  const deleteNotif = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    }
  });

  const filtered = notifications?.filter(n => !showUnreadOnly || !n.is_read) || [];
  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Notificações
              {unreadCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie as notificações do sistema.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                showUnreadOnly ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Filter className="h-3.5 w-3.5" /> {showUnreadOnly ? 'Todas' : 'Não lidas'}
            </button>
            <button
              onClick={() => markAllRead.mutate()}
              disabled={unreadCount === 0 || markAllRead.isPending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Marcar todas
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <div className="py-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground opacity-20" /></div>
          ) : filtered.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center glow-border">
              <BellOff className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Nenhuma notificação encontrada</p>
            </div>
          ) : (
            filtered.map((n) => {
              const profile = Array.isArray(n.profiles) ? n.profiles[0] : n.profiles;
              return (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markRead.mutate(n.id)}
                  className={cn(
                    "glass-card rounded-xl p-4 glow-border flex items-start gap-4 transition-all hover:border-primary/20 cursor-pointer",
                    !n.is_read && "border-l-2 border-l-primary"
                  )}
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={cn("text-sm font-semibold", n.is_read ? "text-foreground/70" : "text-foreground")}>{n.title}</p>
                      {!n.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                        <Clock className="h-3 w-3" /> {format(new Date(n.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                      </div>
                      {profile && <span className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">Para: {profile.full_name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); deleteNotif.mutate(n.id); }} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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

export default Notifications;

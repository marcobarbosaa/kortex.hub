import { useState, useEffect } from 'react';
import { Bell, TrendingUp, AlertTriangle, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface RetentionAlert {
  id: string;
  icon: typeof Bell;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success';
  action?: string;
  actionUrl?: string;
}

const ALERTS: RetentionAlert[] = [
  {
    id: 'relatorio',
    icon: Bell,
    title: 'Seu relatório semanal está pronto',
    body: 'Confira os insights gerados automaticamente sobre o desempenho do seu negócio.',
    type: 'info',
    action: 'Ver Relatório',
    actionUrl: '/cliente/relatorios',
  },
  {
    id: 'gasto',
    icon: AlertTriangle,
    title: 'Aumento de gastos detectado',
    body: 'Você gastou 35% a mais esta semana comparado à anterior. Verifique suas despesas.',
    type: 'warning',
    action: 'Verificar',
    actionUrl: '/cliente/financeiro',
  },
  {
    id: 'crescimento',
    icon: TrendingUp,
    title: 'Seu faturamento cresceu 12%',
    body: 'Parabéns! Suas receitas estão em tendência de alta no último mês.',
    type: 'success',
  },
];

/**
 * Banner de retenção (Etapa 9).
 * Mostra alertas inteligentes no topo do dashboard para manter o usuário engajado.
 */
export function RetentionBanner() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('kortex_dismissed_alerts');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const visibleAlerts = ALERTS.filter(a => !dismissed.includes(a.id));

  useEffect(() => {
    localStorage.setItem('kortex_dismissed_alerts', JSON.stringify(dismissed));
  }, [dismissed]);

  const handleDismiss = (id: string) => {
    setDismissed(prev => [...prev, id]);
  };

  if (visibleAlerts.length === 0) return null;

  const alert = visibleAlerts[0]; // Show one at a time

  const colors = {
    info: { bg: 'bg-primary/5', border: 'border-l-primary', icon: 'text-primary' },
    warning: { bg: 'bg-warning/5', border: 'border-l-warning', icon: 'text-warning' },
    success: { bg: 'bg-success/5', border: 'border-l-success', icon: 'text-success' },
  };

  const c = colors[alert.type];

  return (
    <div className={cn('rounded-xl p-4 border border-border/30 border-l-4 mb-4 animate-[ob-enter_0.5s_ease-out]', c.bg, c.border)}>
      <div className="flex items-start gap-3">
        <div className={cn('h-8 w-8 rounded-lg bg-background/50 flex items-center justify-center shrink-0 mt-0.5')}>
          <alert.icon className={cn('h-4 w-4', c.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{alert.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{alert.body}</p>
          {alert.action && alert.actionUrl && (
            <button
              onClick={() => navigate(alert.actionUrl!)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              {alert.action} <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
        <button
          onClick={() => handleDismiss(alert.id)}
          className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Check, X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'meta', label: 'Criar primeira meta financeira', done: false },
  { id: 'despesa', label: 'Adicionar uma despesa', done: false },
  { id: 'relatorio', label: 'Gerar um relatório', done: false },
  { id: 'alerta', label: 'Configurar um alerta', done: false },
];

/**
 * Componente de experiência guiada (Etapa 6).
 * Mostra um checklist flutuante no dashboard para guiar o usuário
 * nas primeiras ações e transformá-lo em usuário ativo.
 */
export function GuidedExperience() {
  const [isOpen, setIsOpen] = useState(true);
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const stored = localStorage.getItem('kortex_guided_checklist');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return DEFAULT_CHECKLIST;
  });
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('kortex_guided_dismissed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('kortex_guided_checklist', JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('kortex_guided_dismissed', 'true');
  };

  if (dismissed) return null;

  const completed = items.filter(i => i.done).length;
  const total = items.length;
  const allDone = completed === total;

  return (
    <div className={cn(
      'fixed bottom-20 right-6 z-40 w-72 transition-all duration-300',
      isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
    )}>
      <div className="glass-card rounded-2xl glow-border overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Primeiros Passos</p>
              <p className="text-[10px] text-muted-foreground">{completed}/{total} concluídos</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 pt-3">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="p-3 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs',
                item.done
                  ? 'text-muted-foreground'
                  : 'text-foreground hover:bg-muted/50'
              )}
            >
              <div className={cn(
                'h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all',
                item.done
                  ? 'bg-primary border-primary'
                  : 'border-border'
              )}>
                {item.done && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className={cn(item.done && 'line-through opacity-60')}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* All done message */}
        {allDone && (
          <div className="px-4 pb-4">
            <div className="rounded-lg bg-success/10 p-3 text-center">
              <p className="text-xs font-bold text-success">🎉 Parabéns! Você completou tudo!</p>
              <p className="text-[10px] text-success/70 mt-1">Você agora é um usuário ativo do GABS.</p>
            </div>
          </div>
        )}
      </div>

      {/* Toggle button when minimized */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
        >
          <Lightbulb className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
}

import { useState } from 'react';
import { ClientLayout } from '@/components/ClientLayout';
import { useOnboardingGuard } from '@/hooks/useOnboardingGuard';
import {
  Layout, Code2, Settings2,
  Lock, ChevronRight, Sparkles, Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const ALL_SERVICES = [
  {
    id: 'lps',
    title: 'LPs & Funis',
    description: 'Landing Pages de alta conversão integradas a funis estratégicos que guiam seu cliente até o checkout.',
    icon: Layout,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    free: true,
  },
  {
    id: 'webapps',
    title: 'Web Apps & Sistemas',
    description: 'Aplicações robustas e escaláveis — painéis administrativos, plataformas SaaS e dashboards em tempo real.',
    icon: Code2,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    free: true,
  },
  {
    id: 'automacao',
    title: 'Automações CRM',
    description: 'Integrações inteligentes com n8n, Zapier e CRMs que rodam no piloto automático.',
    icon: Settings2,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    free: true,
  }
];

const Servicos = () => {
  const { onboardingData } = useOnboardingGuard();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<typeof ALL_SERVICES[0] | null>(null);

  const unlocked = onboardingData.servicesUnlocked || 2;
  const isPremium = onboardingData.isPremium;

  const requestService = useMutation({
    mutationFn: async (details: { name: string; description: string }) => {
      const { data, error } = await supabase.from('projects').insert({
        client_id: user!.id,
        name: `[Solicitação] ${selectedService?.title} - ${details.name}`,
        description: details.description,
        status: 'paused',
      }).select();

      if (error) throw error;

      // Notificar o próprio cliente sobre a solicitação
      await supabase.from('notifications').insert({
        user_id: user!.id,
        title: 'Nova Solicitação Recebida',
        message: `Recebemos o seu briefing para "${details.name}". Em breve entraremos em contato.`,
        is_read: false
      });

      return data;
    },
    onSuccess: () => {
      toast.success('Solicitação enviada com sucesso!', {
        description: 'Nossa equipe avaliará o escopo e entrará em contato em breve.'
      });
      setSelectedService(null);
    },
    onError: (err: any) => {
      toast.error('Erro ao enviar solicitação', { description: err.message });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    requestService.mutate({
      name: fd.get('name') as string,
      description: fd.get('description') as string,
    });
  };
  return (
    <ClientLayout
      title="Serviços Kortex"
      description="Explore os módulos disponíveis para o seu negócio."
    >
      {/* Liberação progressiva banner */}
      {!isPremium && (
        <div className="glass-card rounded-xl p-5 glow-border mb-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Descubra mais funcionalidades</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Você tem acesso a {unlocked} de {ALL_SERVICES.length} serviços.
              Use o sistema e desbloqueie novos módulos automaticamente.
            </p>
          </div>
          <button
            onClick={() => navigate('/cliente/upgrade')}
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          >
            <Crown className="h-3.5 w-3.5 inline mr-1.5" />
            Ver Premium
          </button>
        </div>
      )}

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_SERVICES.map((service, idx) => {
          const isLocked = !isPremium && !service.free && idx >= unlocked;
          return (
            <div
              key={service.id}
              className={cn(
                'glass-card rounded-xl glow-border transition-all duration-300 cursor-pointer group relative overflow-hidden',
                isLocked ? 'opacity-60 grayscale-[30%]' : 'hover:scale-[1.02] hover:ring-1 hover:ring-primary/30'
              )}
              onClick={() => !isLocked && setSelectedService(service)}
            >
              {/* Lock overlay */}
              {isLocked && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
                  <div className="text-center">
                    <Lock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">Premium</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/cliente/upgrade'); }}
                      className="mt-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      Desbloquear
                    </button>
                  </div>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', service.bg)}>
                    <service.icon className={cn('h-5 w-5', service.color)} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{service.title}</h3>
                    {service.free && (
                      <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Gratuito</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>

                {!isLocked && (
                  <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                    Explorar <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Briefing */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border-border/50 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              {selectedService && <selectedService.icon className={cn("h-5 w-5", selectedService.color)} />}
              Solicitar {selectedService?.title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Preencha os detalhes básicos para que nossa equipe entenda sua necessidade e monte um escopo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Projeto / Demanda</label>
              <input
                required
                name="name"
                className="w-full bg-muted/50 border border-border/50 rounded-md p-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: Landing Page para Evento"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descreva o que você precisa</label>
              <textarea
                required
                name="description"
                rows={4}
                className="w-full bg-muted/50 border border-border/50 rounded-md p-2.5 text-sm resize-none outline-none focus:ring-1 focus:ring-primary"
                placeholder="Quais são os objetivos principais? Tem alguma referência?"
              />
            </div>
            <button
              type="submit"
              disabled={requestService.isPending}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-primary/90 transition-colors mt-4 flex justify-center items-center gap-2"
            >
              {requestService.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar Solicitação'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
};

export default Servicos;

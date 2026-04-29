import { useState } from 'react';
import { ClientLayout } from '@/components/ClientLayout';
import { useOnboardingGuard } from '@/hooks/useOnboardingGuard';
import {
  Layout, Code2, Settings2, BarChart3, Cpu,
  Lock, ChevronRight, Sparkles, Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

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
  },
  {
    id: 'consultoria',
    title: 'Consultoria Estratégica',
    description: 'Análise profunda do seu negócio com plano de ação personalizado para escalar resultados.',
    icon: BarChart3,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    free: false,
  },
  {
    id: 'ia',
    title: 'IA Avançada',
    description: 'Agentes de IA dedicados, automação generativa e insights preditivos para seu crescimento.',
    icon: Cpu,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    free: false,
  },
];

const Servicos = () => {
  const { onboardingData } = useOnboardingGuard();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unlocked = onboardingData.servicesUnlocked || 2;
  const isPremium = onboardingData.isPremium;

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
          const isExpanded = expandedId === service.id;

          return (
            <div
              key={service.id}
              className={cn(
                'glass-card rounded-xl glow-border transition-all duration-300 cursor-pointer group relative overflow-hidden',
                isLocked ? 'opacity-60 grayscale-[30%]' : 'hover:scale-[1.02]',
                isExpanded && 'ring-1 ring-primary/30'
              )}
              onClick={() => !isLocked && setExpandedId(isExpanded ? null : service.id)}
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
    </ClientLayout>
  );
};

export default Servicos;

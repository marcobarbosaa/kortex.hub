import { ClientLayout } from '@/components/ClientLayout';
import { useOnboardingGuard } from '@/hooks/useOnboardingGuard';
import {
  Check, Crown, Zap, Sparkles, Star
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/client';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Loader2 } from 'lucide-react';

const FREE_FEATURES = [
  'Controle financeiro básico',
  'Até 3 relatórios por mês',
  'Dashboard simplificado',
  '1 conta bancária',
  'Suporte por email',
];

const PREMIUM_FEATURES = [
  'Tudo do plano gratuito',
  'Relatórios ilimitados',
  'IA completa — insights avançados',
  'Automação total de lançamentos',
  'Planejamento estratégico',
  'Analytics preditivo',
  'Contas ilimitadas',
  'Suporte prioritário 24/7',
  'Exportação PDF e Excel',
];

const Upgrade = () => {
  const { onboardingData } = useOnboardingGuard();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      toast.loading('Preparando checkout...', { id: 'checkout' });
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId: 'price_test_123', // Replace with real Stripe Price ID
          email: user?.email,
          mode: 'subscription'
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não retornada.');
      }
    } catch (err: any) {
      toast.error('Erro ao iniciar checkout', { id: 'checkout', description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientLayout
      title="Escolha seu Plano"
      description="Desbloqueie todo o potencial do Kortex para o seu negócio."
    >
      {/* Social proof */}
      <div className="glass-card rounded-xl p-4 glow-border mb-6 flex items-center gap-3">
        <div className="flex -space-x-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
              <Star className="h-3 w-3 text-amber-400" />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">+2.400 empresas</span> já usam o Kortex Premium
        </p>
      </div>

      {/* Insight trigger (Etapa 8: mostrar valor antes de cobrar) */}
      {onboardingData.insightsGenerated > 0 && (
        <div className="glass-card rounded-xl p-5 glow-border mb-6 border-l-4 border-l-amber-500">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Você já gerou {onboardingData.insightsGenerated} insight(s)!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Quer continuar tendo acesso a análises como essas? O plano Premium desbloqueia insights ilimitados.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="glass-card rounded-2xl p-6 glow-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
              <Zap className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Gratuito</h3>
              <p className="text-xs text-muted-foreground">Para começar sem compromisso</p>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-extrabold text-foreground">R$ 0</span>
            <span className="text-sm text-muted-foreground ml-1">/mês</span>
          </div>

          <ul className="space-y-3 mb-6">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <button
            disabled
            className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider bg-muted text-muted-foreground cursor-not-allowed"
          >
            Plano Atual
          </button>
        </div>

        {/* Premium Plan */}
        <div className="glass-card rounded-2xl p-6 glow-border relative overflow-hidden ring-1 ring-primary/20">
          {/* Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold uppercase text-white tracking-wider flex items-center gap-1">
            <Crown className="h-3 w-3" /> Popular
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Premium</h3>
              <p className="text-xs text-muted-foreground">Potência total para seu negócio</p>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-extrabold text-foreground">R$ 49</span>
            <span className="text-sm text-muted-foreground ml-1">/mês</span>
            <p className="text-xs text-success mt-1 font-medium">7 dias grátis para testar</p>
          </div>

          <ul className="space-y-3 mb-6">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </div>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-blue-500 text-white hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Começar Teste Grátis'}
          </button>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Upgrade;

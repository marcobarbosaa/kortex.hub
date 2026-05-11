import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, Rocket, User,
  Wallet, CalendarCheck, TrendingDown, BarChart3, FileText,
  TrendingUp, FolderKanban, ShieldAlert, Cpu,
  ChevronRight, ChevronLeft, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/client';
import CyberneticGridShader from '@/components/CyberneticGridShader';
import './OnboardingFlow.css';

// ── STEP DATA ──
const COMPANY_TYPES = [
  { id: 'mei', label: 'MEI', icon: User },
  { id: 'pequena', label: 'Pequena Empresa', icon: Building2 },
  { id: 'startup', label: 'Startup', icon: Rocket },
  { id: 'freelancer', label: 'Freelancer', icon: Users },
];

const PAIN_POINTS = [
  { id: 'financeiro', label: 'Controle Financeiro', icon: Wallet },
  { id: 'planejamento', label: 'Planejamento', icon: CalendarCheck },
  { id: 'custos', label: 'Redução de Custos', icon: TrendingDown },
  { id: 'fluxo', label: 'Fluxo de Caixa', icon: BarChart3 },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
];

const GOALS = [
  { id: 'crescer', label: 'Crescer Faturamento', icon: TrendingUp },
  { id: 'organizar', label: 'Organizar Finanças', icon: FolderKanban },
  { id: 'prejuizo', label: 'Evitar Prejuízo', icon: ShieldAlert },
  { id: 'automatizar', label: 'Automatizar Processos', icon: Cpu },
];

const STEPS = [
  { key: 'company_type', title: 'Boas-vindas à GABS! 🚀', subtitle: 'Para começarmos nossa parceria, conta pra gente: como você descreve o seu negócio hoje?', options: COMPANY_TYPES },
  { key: 'main_pain', title: 'Onde podemos ajudar?', subtitle: 'Sabemos que crescer dá trabalho. Qual é o maior gargalo que está impedindo você de escalar?', options: PAIN_POINTS },
  { key: 'main_goal', title: 'Seu Objetivo Principal', subtitle: 'Onde você quer chegar nos próximos meses? Nosso time vai focar exatamente nisso.', options: GOALS },
];

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>({});

  // Dynamic Content based on selection
  const getContextualContent = () => {
    const type = selections.company_type;
    switch (type) {
      case 'mei':
        return {
          pain: { title: 'Qual é o maior desafio do seu "corre"?', subtitle: 'Ser MEI é ser herói. Onde a GABS pode tirar um peso das suas costas hoje?' },
          goal: { title: 'Onde você quer chegar?', subtitle: 'Vamos organizar a casa para você focar no que realmente importa: crescer.' },
          verify: { title: 'Quase lá!', subtitle: 'Para garantir a segurança, valide seu negócio com seu CNPJ ou Instagram profissional.' }
        };
      case 'freelancer':
        return {
          pain: { title: 'O que está travando seus jobs?', subtitle: 'Gestão de tempo ou de grana? Conta pra gente qual é o seu maior gargalo.' },
          goal: { title: 'Sua meta como freela', subtitle: 'Quer mais clientes ou mais tempo livre? Vamos traçar esse caminho.' },
          verify: { title: 'Mostre seu trabalho', subtitle: 'Conecte suas redes para validarmos seu perfil de especialista.' }
        };
      case 'startup':
        return {
          pain: { title: 'Qual é o seu blocker para o scaling?', subtitle: 'Product-market fit ou eficiência operacional? Onde atacamos primeiro?' },
          goal: { title: 'Seu North Star Metric', subtitle: 'Qual é o grande objetivo da rodada? Vamos impulsionar sua tração.' },
          verify: { title: 'Verificação de Tração', subtitle: 'Valide sua startup com CNPJ/Instagram e, se tiver, seu repositório principal.' }
        };
      case 'pequena':
        return {
          pain: { title: 'Qual desafio tira o sono da sua empresa?', subtitle: 'Gestão, equipe ou faturamento? Vamos profissionalizar sua operação.' },
          goal: { title: 'Objetivo Estratégico', subtitle: 'Qual é a prioridade para o próximo semestre? Estamos aqui para entregar resultados.' },
          verify: { title: 'Segurança Institucional', subtitle: 'Confirme os dados da sua empresa para liberarmos seu acesso completo.' }
        };
      default:
        return {
          pain: { title: 'Onde podemos ajudar?', subtitle: 'Sabemos que crescer dá trabalho. Qual é o maior gargalo que está impedindo você de escalar?' },
          goal: { title: 'Seu Objetivo Principal', subtitle: 'Onde você quer chegar nos próximos meses? Nosso time vai focar exatamente nisso.' },
          verify: { title: 'Validação', subtitle: 'Só mais um passo para garantirmos a melhor experiência.' }
        };
    }
  };

  const context = getContextualContent();

  const STEPS = [
    { key: 'company_type', title: 'Boas-vindas à GABS! 🚀', subtitle: 'Para começarmos nossa parceria, conta pra gente: como você descreve o seu negócio hoje?', type: 'options', options: COMPANY_TYPES },
    { key: 'main_pain', title: context.pain.title, subtitle: context.pain.subtitle, type: 'options', options: PAIN_POINTS },
    { key: 'main_goal', title: context.goal.title, subtitle: context.goal.subtitle, type: 'options', options: GOALS },
    { key: 'verification', title: context.verify.title, subtitle: context.verify.subtitle, type: 'fields' },
  ];

  const currentStep = STEPS[step];
  
  const handleSelect = (id: string) => {
    setSelections(prev => ({ ...prev, [currentStep.key]: id }));
  };

  const handleInputChange = (field: string, value: string) => {
    setSelections(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep.type === 'options' && !selections[currentStep.key]) {
      toast.error('Selecione uma opção para continuar.');
      return;
    }
    
    if (currentStep.key === 'verification') {
      const type = selections.company_type;
      if (type === 'freelancer') {
        if (!selections.instagram && !selections.github && !selections.linkedin) {
          toast.error('Informe pelo menos uma rede social para verificação.');
          return;
        }
      } else {
        if (!selections.cnpj && !selections.instagram) {
          toast.error('Informe o CNPJ ou Instagram para verificação.');
          return;
        }
      }
    }

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          company_type: selections.company_type,
          main_pain: selections.main_pain,
          main_goal: selections.main_goal,
          verification_cnpj: selections.cnpj || null,
          verification_instagram: selections.instagram || null,
          verification_github: selections.github || null,
          verification_linkedin: selections.linkedin || null,
        }
      });
      if (error) throw error;
      toast.success('Tudo pronto! Seu dashboard já está liberado.');
      navigate('/cliente');
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ob-page">
      <CyberneticGridShader />

      <div className="ob-container">
        <div className="ob-card">
          {/* Header */}
          <header className="ob-header">
            <span className="ob-logo">GABS</span>
            <h1 className="ob-title">{currentStep.title}</h1>
            <p className="ob-subtitle">{currentStep.subtitle}</p>
          </header>

          {/* Progress dots */}
          <div className="ob-progress">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`ob-progress-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
              />
            ))}
          </div>

          <div className="ob-step-label">
            Etapa {step + 1} de {STEPS.length}
          </div>

          {/* Options Step */}
          {currentStep.type === 'options' && (
            <div className="ob-slide-enter" key={step}>
              <div className="ob-option-grid">
                {currentStep.options?.map((opt) => (
                  <div
                    key={opt.id}
                    className={`ob-option ${selections[currentStep.key] === opt.id ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt.id)}
                  >
                    <div className="ob-option-icon">
                      <opt.icon size={18} />
                    </div>
                    <span className="ob-option-label">{opt.label}</span>
                    <div className="ob-check">
                      <Check size={10} color="#fff" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Fields Step */}
          {currentStep.key === 'verification' && (
            <div className="ob-slide-enter space-y-4 py-4">
              {(selections.company_type !== 'freelancer') && (
                <div className="form-group">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">CNPJ (Opcional)</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                    value={selections.cnpj || ''}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram Profissional</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <input
                    type="text"
                    placeholder="seu.perfil"
                    className="w-full bg-secondary/30 border border-border/50 rounded-lg pl-8 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                    value={selections.instagram || ''}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                  />
                </div>
              </div>

              {(selections.company_type === 'freelancer' || selections.company_type === 'startup') && (
                <div className="form-group">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">GitHub (Opcional)</label>
                  <input
                    type="text"
                    placeholder="github.com/usuario"
                    className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                    value={selections.github || ''}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                  />
                </div>
              )}

              {selections.company_type === 'freelancer' && (
                <div className="form-group">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">LinkedIn (Opcional)</label>
                  <input
                    type="text"
                    placeholder="linkedin.com/in/usuario"
                    className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                    value={selections.linkedin || ''}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <footer className="ob-footer">
            {step > 0 && (
              <button className="ob-btn ob-btn-prev" onClick={handlePrev} disabled={isLoading}>
                <ChevronLeft size={15} />
                Voltar
              </button>
            )}
            <button 
              className="ob-btn ob-btn-next" 
              onClick={handleNext} 
              disabled={isLoading || (currentStep.type === 'options' && !selections[currentStep.key])}
            >
              {isLoading
                ? 'Salvando...'
                : step < STEPS.length - 1
                  ? 'Próximo'
                  : 'Acessar meu Dashboard'}
              {!isLoading && <ChevronRight size={15} />}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;

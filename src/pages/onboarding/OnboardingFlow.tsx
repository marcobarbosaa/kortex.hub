import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, Rocket, User,
  Wallet, CalendarCheck, TrendingDown, BarChart3, FileText,
  TrendingUp, FolderKanban, ShieldAlert, Cpu, Layers,
  ChevronRight, ChevronLeft, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/client';
import CyberneticGridShader from '@/components/CyberneticGridShader';
import './OnboardingFlow.css';

// ── STEP DATA ──
const NEEDS = [
  { id: 'webapp', label: 'Site ou Web App', icon: Cpu, desc: 'Sistemas e plataformas robustas' },
  { id: 'automation', label: 'Automação', icon: Rocket, desc: 'Processos e CRM no automático' },
  { id: 'funnel', label: 'Funil de Vendas', icon: BarChart3, desc: 'Páginas de alta conversão' },
  { id: 'analytics', label: 'Dados e Métricas', icon: TrendingUp, desc: 'Dashboards e análise de ROI' },
];

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [didConsultancy, setDidConsultancy] = useState<boolean | null>(null);
  const [selections, setSelections] = useState<Record<string, any>>({
    business_name: '',
    instagram: '',
    linkedin: '',
    github: '',
    need: '',
    segment: [],
    description: '',
    budget: ''
  });

  React.useEffect(() => {
    const checkConsultancy = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const localDataStr = localStorage.getItem('kortex_pre_consultancy');
      let localData = null;
      try {
        if (localDataStr) localData = JSON.parse(localDataStr);
      } catch (e) {}

      const hasConsultancy = !!(user?.user_metadata?.segment || localData?.segment);
      setDidConsultancy(hasConsultancy);

      if (hasConsultancy) {
        setSelections(prev => ({
          ...prev,
          segment: user?.user_metadata?.segment || localData?.segment || [],
          description: user?.user_metadata?.description || localData?.description || '',
          budget: user?.user_metadata?.budget || localData?.budget || '',
          urgency: user?.user_metadata?.urgency || localData?.urgency || '',
        }));
      }
    };
    checkConsultancy();
  }, []);

  // Dynamic Steps based on consultancy
  let STEPS: any[] = [];
  
  if (didConsultancy === false) {
    // Adiciona as perguntas da consultoria no onboarding
    STEPS.push(
      { 
        key: 'need', 
        title: 'O que você precisa hoje? 🚀', 
        subtitle: 'Selecione o foco principal do seu projeto.', 
        type: 'options', 
        options: NEEDS 
      },
      {
        key: 'description',
        title: 'Me conte mais sobre seus objetivos',
        subtitle: 'Como podemos te ajudar a escalar seu negócio?',
        type: 'textarea'
      }
    );
  }

  // Etapas padrões de setup de conta
  STEPS.push(
    { 
      key: 'identity', 
      title: 'Identidade do seu negócio', 
      subtitle: 'Como devemos chamar sua empresa ou projeto no dashboard?', 
      type: 'fields' 
    },
    { 
      key: 'social', 
      title: 'Presença Digital', 
      subtitle: 'Opcional: Compartilhar suas redes nos ajuda a entender seu nicho.', 
      type: 'fields' 
    }
  );

  const currentStep = STEPS[step];
  
  const handleSelect = (id: string) => {
    setSelections(prev => ({ ...prev, [currentStep.key]: id }));
  };

  const handleInputChange = (field: string, value: string) => {
    setSelections(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep.key === 'need' && !selections.need) {
      toast.error('Selecione uma opção para continuar.');
      return;
    }
    
    if (currentStep.key === 'description' && !selections.description) {
      toast.error('Nos conte um pouco sobre seus objetivos.');
      return;
    }
    
    if (currentStep.key === 'identity' && !selections.business_name) {
      toast.error('Informe o nome da sua empresa.');
      return;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado. Faça login novamente.");

      // Atualiza a tabela public.profiles diretamente
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          empresa: selections.business_name,
          main_need: selections.need || null,
          segment: selections.segment || null,
          description: selections.description || null,
          budget: selections.budget || null,
          urgency: selections.urgency || null,
          instagram: selections.instagram || null,
          github: selections.github || null,
          linkedin: selections.linkedin || null,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (profileError) {
        console.error("Erro no profiles update:", profileError);
        // Não jogamos o erro direto ainda, caso a tabela não tenha as colunas a gente avisa
      }

      // Atualiza os metadados do Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          empresa: selections.business_name,
          main_need: selections.need || null,
        }
      });
      
      if (authError) throw authError;
      
      // Limpar o storage
      localStorage.removeItem('kortex_pre_consultancy');
      
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
                    <div className="flex flex-col text-left flex-1">
                      <span className="ob-option-label">{opt.label}</span>
                      <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                    </div>
                    <div className="ob-check">
                      <Check size={10} color="#fff" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Textarea Step */}
          {currentStep?.type === 'textarea' && (
            <div className="ob-slide-enter space-y-4 py-4" key={`ta-${step}`}>
              <div className="form-group">
                <textarea
                  placeholder="Ex: Quero um site para minha agência e automatizar meus leads..."
                  className="w-full h-32 bg-secondary/30 border border-border/50 rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary outline-none transition-colors resize-none"
                  value={selections[currentStep.key] || ''}
                  onChange={(e) => handleInputChange(currentStep.key, e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Identity Step */}
          {currentStep.key === 'identity' && (
            <div className="ob-slide-enter space-y-4 py-4">
              <div className="form-group">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome da Empresa ou Projeto</label>
                <input
                  type="text"
                  placeholder="Ex: Minha Startup"
                  className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                  value={selections.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Social Step */}
          {currentStep.key === 'social' && (
            <div className="ob-slide-enter space-y-4 py-4">
              <div className="form-group">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram (Opcional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <input
                    type="text"
                    placeholder="seu.perfil"
                    className="w-full bg-secondary/30 border border-border/50 rounded-lg pl-8 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                    value={selections.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">LinkedIn (Opcional)</label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/usuario"
                  className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                  value={selections.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">GitHub (Opcional)</label>
                <input
                  type="text"
                  placeholder="github.com/usuario"
                  className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                  value={selections.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                />
              </div>
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
              disabled={
                isLoading || 
                (currentStep?.type === 'options' && !selections[currentStep.key]) ||
                (currentStep?.type === 'textarea' && !selections[currentStep.key])
              }
            >
              {isLoading
                ? 'Salvando...'
                : step < STEPS.length - 1
                  ? 'Próximo'
                  : 'Finalizar Configuração'}
              {!isLoading && <ChevronRight size={15} />}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;

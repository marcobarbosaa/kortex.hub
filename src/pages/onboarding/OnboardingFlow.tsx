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
  { key: 'company_type', title: 'Tipo de Empresa', subtitle: 'Qual o perfil do seu negócio? Isso personaliza toda a experiência.', options: COMPANY_TYPES },
  { key: 'main_pain', title: 'Principal Dor', subtitle: 'Qual desafio tira seu sono hoje? Vamos resolver juntos.', options: PAIN_POINTS },
  { key: 'main_goal', title: 'Seu Objetivo', subtitle: 'O que você quer alcançar com o Kortex?', options: GOALS },
];

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const currentStep = STEPS[step];
  const currentValue = selections[currentStep.key] || '';

  const handleSelect = (id: string) => {
    setSelections(prev => ({ ...prev, [currentStep.key]: id }));
  };

  const handleNext = () => {
    if (!currentValue) {
      toast.error('Selecione uma opção para continuar.');
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
      const { error } = await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          company_type: selections.company_type,
          main_pain: selections.main_pain,
          main_goal: selections.main_goal,
        }
      });
      if (error) throw error;
      toast.success('Perfeito! Vamos configurar seu sistema.');
      navigate('/onboarding/setup');
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
            <span className="ob-logo">KORTEX</span>
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

          {/* Options */}
          <div className="ob-slide-enter" key={step}>
            <div className={`ob-option-grid ${currentStep.options.length > 4 ? '' : ''}`}>
              {currentStep.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`ob-option ${currentValue === opt.id ? 'selected' : ''}`}
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

          {/* Footer */}
          <footer className="ob-footer">
            {step > 0 && (
              <button className="ob-btn ob-btn-prev" onClick={handlePrev} disabled={isLoading}>
                <ChevronLeft size={15} />
                Voltar
              </button>
            )}
            <button className="ob-btn ob-btn-next" onClick={handleNext} disabled={isLoading || !currentValue}>
              {isLoading
                ? 'Salvando...'
                : step < STEPS.length - 1
                  ? 'Próximo'
                  : 'Configurar Sistema'}
              {!isLoading && <ChevronRight size={15} />}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;

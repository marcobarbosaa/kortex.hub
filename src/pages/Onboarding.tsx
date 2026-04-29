import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Target, 
  TrendingUp, 
  Zap, 
  Cpu, 
  Palette, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../integrations/client';
import CyberneticGridShader from '../components/CyberneticGridShader';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    companySize: '',
    currentChallenge: '',
    mainGoal: '',
    otherGoal: ''
  });

  const goals = [
    { id: 'sales', title: 'Escalar Vendas', icon: TrendingUp },
    { id: 'automation', title: 'Automatizar Processos', icon: Cpu },
    { id: 'branding', title: 'Redesign de Marca', icon: Palette },
    { id: 'performance', title: 'Performance Digital', icon: Zap },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.industry || !formData.companySize) {
        toast.error('Por favor, preencha as informações da empresa.');
        return;
      }
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => setStep(1);

  const handleSubmit = async () => {
    if (!formData.mainGoal) {
      toast.error('Por favor, selecione seu objetivo principal.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          industry: formData.industry,
          company_size: formData.companySize,
          main_goal: formData.mainGoal,
          current_challenge: formData.currentChallenge
        }
      });

      if (error) throw error;

      toast.success('Perfil configurado com sucesso! Bem-vindo ao Kortex.');
      navigate('/cliente');
    } catch (error: any) {
      toast.error('Erro ao salvar perfil: ' + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <CyberneticGridShader />
      
      <div className="onboarding-container">
        <div className="onboarding-card">
          <header className="onboarding-header">
            <span className="onboarding-logo">KORTEX</span>
            <h1 className="onboarding-title">
              {step === 1 ? 'Sua Empresa' : 'Seus Objetivos'}
            </h1>
            <p className="onboarding-subtitle">
              {step === 1 
                ? 'Conte-nos um pouco sobre o seu negócio para personalizarmos sua experiência.' 
                : 'O que você deseja alcançar com o sistema Kortex?'}
            </p>
          </header>

          <div className="onboarding-step-indicator">
            <div className={`step-dot ${step === 1 ? 'active' : ''}`} />
            <div className={`step-dot ${step === 2 ? 'active' : ''}`} />
          </div>

          <div className="onboarding-form">
            {step === 1 ? (
              <>
                <div className="form-group">
                  <label>Setor de Atuação</label>
                  <select 
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  >
                    <option value="">Selecione um setor...</option>
                    <option value="tecnologia">Tecnologia / SaaS</option>
                    <option value="ecommerce">E-commerce / Varejo</option>
                    <option value="servicos">Prestação de Serviços</option>
                    <option value="industria">Indústria / Manufatura</option>
                    <option value="educacao">Educação / Infoprodutos</option>
                    <option value="saude">Saúde / Bem-estar</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tamanho da Empresa</label>
                  <select 
                    value={formData.companySize}
                    onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                  >
                    <option value="">Selecione o tamanho...</option>
                    <option value="solo">Individual (Solopreneur)</option>
                    <option value="small">Pequena (2-10 funcionários)</option>
                    <option value="medium">Média (11-50 funcionários)</option>
                    <option value="large">Grande (50+ funcionários)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Qual seu maior desafio hoje?</label>
                  <textarea 
                    rows={3}
                    placeholder="Ex: Baixa conversão, processos manuais, falta de visibilidade..."
                    value={formData.currentChallenge}
                    onChange={(e) => setFormData({...formData, currentChallenge: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <div className="goal-grid">
                {goals.map((goal) => (
                  <div 
                    key={goal.id}
                    className={`goal-option ${formData.mainGoal === goal.id ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, mainGoal: goal.id})}
                  >
                    <div className="goal-icon">
                      <goal.icon size={20} />
                    </div>
                    <span className="goal-title">{goal.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="onboarding-footer">
            {step === 2 && (
              <button 
                className="onboarding-btn onboarding-btn-prev"
                onClick={handlePrev}
                disabled={isLoading}
              >
                <ChevronLeft size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Voltar
              </button>
            )}
            <button 
              className="onboarding-btn onboarding-btn-next"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : step === 1 ? 'Próximo Passo' : 'Finalizar Setup'}
              {!isLoading && <ChevronRight size={16} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

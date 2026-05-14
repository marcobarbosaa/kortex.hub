import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, BarChart3, Layers, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../integrations/client';
import CyberneticGridShader from '../components/CyberneticGridShader';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullname = formData.get('fullname') as string;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullname,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Conta criada com sucesso! Verifique seu e-mail ou faça login.', {
        description: 'Seu perfil foi gerado automaticamente.',
      });
      
      // Se não exigir confirmação de email no painel do Supabase, já podemos redirecionar:
      if (data.session) {
        navigate('/onboarding');
      }

    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Erro ao conectar com ${provider}`);
    }
  };

  const features = [
    { icon: Zap, text: 'Estratégia orientada por dados' },
    { icon: BarChart3, text: 'Dashboard em tempo real' },
    { icon: Layers, text: 'Automação de crescimento' },
    { icon: ShieldCheck, text: 'Segurança e transparência' },
  ];

  return (
    <div className="register-page animate-page-fade">
      {/* ── FULL-SCREEN ANIMATED BACKGROUND ── */}
      <CyberneticGridShader />

      {/* ── Connector line between panels ── */}
      <div className="register-connector" />

      {/* ── LEFT PANEL: Welcome ── */}
      <div className="register-left">
        <div className="register-left-content">
          <div className="register-logo">GABS</div>

          <h1 className="register-welcome-title">
            Bem-vindo ao <span>futuro</span> do seu negócio.
          </h1>
          <p className="register-welcome-sub">
            Crie sua conta e tenha acesso a um sistema de crescimento digital de alta performance — projetado para escalar seus resultados.
          </p>

          <div className="register-features">
            {features.map((f, i) => (
              <div
                key={f.text}
                className="register-feature-pill"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="register-feature-icon">
                  <f.icon />
                </div>
                <span className="register-feature-text">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Form ── */}
      <div className="register-right">
        <form className="register-card" onSubmit={handleRegister}>
          <div className="register-card-header">
            <h2 className="register-card-title">CRIAR CONTA</h2>
            <p className="register-card-sub">Preencha seus dados para começar</p>
          </div>

          <div className="register-form-group">
            <label htmlFor="fullname">Nome completo</label>
            <input type="text" id="fullname" name="fullname" placeholder="Seu nome" required />
          </div>

          <div className="register-form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="seunome@empresa.com" required />
          </div>

          <div className="register-form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="register-submit" disabled={isLoading}>
            {isLoading ? 'Processando...' : 'Iniciar meu projeto'}
          </button>

          <div className="register-divider">
            <span>ou conectar com</span>
          </div>

          <div className="register-social-row">
            <button 
              type="button" 
              className="register-social-btn" 
              onClick={() => handleOAuth('google')}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button 
              type="button" 
              className="register-social-btn" 
              onClick={() => handleOAuth('github')}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="register-footer-links">
            <div className="register-login-prompt">
              <span>Já possui uma conta?</span>
              <button 
                type="button" 
                className="register-login-btn"
                onClick={() => navigate('/login')}
              >
                FAZER LOGIN
              </button>
            </div>

            <button
              type="button"
              className="register-back-link"
              onClick={() => navigate('/')}
            >
              ← Voltar para o site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

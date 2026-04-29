import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Rocket, DollarSign, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/client';
import CyberneticGridShader from '@/components/CyberneticGridShader';
import './SetupInicial.css';

const SetupInicial = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('');
  const [entryType, setEntryType] = useState<'receita' | 'despesa'>('receita');
  const [entryDesc, setEntryDesc] = useState('');
  const [entryValue, setEntryValue] = useState('');
  const [balanceDone, setBalanceDone] = useState(false);
  const [entryDone, setEntryDone] = useState(false);

  const checklist = [
    { label: 'Inserir saldo inicial', done: balanceDone },
    { label: 'Adicionar primeira receita ou despesa', done: entryDone },
    { label: 'Acessar seu dashboard personalizado', done: false },
  ];

  const completedCount = checklist.filter(c => c.done).length;
  const progress = Math.round(((completedCount + 1) / (checklist.length + 1)) * 100);

  const handleSaveBalance = () => {
    const val = parseFloat(balance.replace(/[^\d.,]/g, '').replace(',', '.'));
    if (isNaN(val)) {
      toast.error('Insira um valor válido.');
      return;
    }
    setBalanceDone(true);
    toast.success('Saldo inicial registrado!');
  };

  const handleAddEntry = () => {
    if (!entryDesc.trim() || !entryValue.trim()) {
      toast.error('Preencha descrição e valor.');
      return;
    }
    setEntryDone(true);
    toast.success(`${entryType === 'receita' ? 'Receita' : 'Despesa'} adicionada!`);
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          setup_completed: true,
          setup_balance: balance,
          setup_first_entry: true,
          session_count: 1,
        }
      });
      if (error) throw error;
      toast.success('Conta ativada! Bem-vindo ao Kortex 🚀');
      navigate('/cliente');
    } catch (err: any) {
      toast.error('Erro: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.updateUser({
        data: { setup_completed: true, session_count: 1 }
      });
      navigate('/cliente');
    } catch {
      navigate('/cliente');
    }
  };

  return (
    <div className="setup-page">
      <CyberneticGridShader />

      <div className="setup-container">
        <div className="setup-card">
          {/* Progress Bar */}
          <div className="setup-progress-wrap">
            <div className="setup-progress-header">
              <span className="setup-progress-label">Ativação da conta</span>
              <span className="setup-progress-percent">{progress}%</span>
            </div>
            <div className="setup-progress-bar">
              <div className="setup-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Header */}
          <header className="setup-header">
            <span className="setup-logo">KORTEX</span>
            <h1 className="setup-title">Setup Inicial</h1>
            <p className="setup-subtitle">
              Configure o mínimo para ativar seu sistema e começar a ter insights.
            </p>
          </header>

          {/* Checklist */}
          <div className="setup-checklist">
            {checklist.map((item, i) => (
              <div key={i} className={`setup-check-item ${item.done ? 'done' : ''}`}>
                <div className="setup-check-circle">
                  {item.done && <Check size={12} color="#fff" />}
                </div>
                <span className="setup-check-text">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Balance */}
          {!balanceDone && (
            <div className="setup-field">
              <label>Saldo Inicial (R$)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Ex: 5.000,00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  className="setup-btn-activate"
                  onClick={handleSaveBalance}
                  style={{ width: 'auto', padding: '0.75rem 1.2rem', fontSize: '0.75rem' }}
                >
                  <DollarSign size={14} /> Salvar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: First entry */}
          {balanceDone && !entryDone && (
            <>
              <div className="setup-type-switch">
                <button
                  className={`setup-type-btn ${entryType === 'receita' ? 'active' : ''}`}
                  onClick={() => setEntryType('receita')}
                >
                  + Receita
                </button>
                <button
                  className={`setup-type-btn ${entryType === 'despesa' ? 'active' : ''}`}
                  onClick={() => setEntryType('despesa')}
                >
                  − Despesa
                </button>
              </div>

              <div className="setup-field">
                <label>Descrição</label>
                <input
                  type="text"
                  placeholder={entryType === 'receita' ? 'Ex: Venda de serviço' : 'Ex: Aluguel do escritório'}
                  value={entryDesc}
                  onChange={(e) => setEntryDesc(e.target.value)}
                />
              </div>

              <div className="setup-field">
                <label>Valor (R$)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Ex: 1.200,00"
                    value={entryValue}
                    onChange={(e) => setEntryValue(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    className="setup-btn-activate"
                    onClick={handleAddEntry}
                    style={{ width: 'auto', padding: '0.75rem 1.2rem', fontSize: '0.75rem' }}
                  >
                    <PlusCircle size={14} /> Adicionar
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Final CTA */}
          {(balanceDone && entryDone) && (
            <footer className="setup-footer">
              <button className="setup-btn-activate" onClick={handleFinish} disabled={isLoading}>
                <Rocket size={16} />
                {isLoading ? 'Ativando...' : 'Acessar Meu Dashboard'}
              </button>
            </footer>
          )}

          <button className="setup-skip" onClick={handleSkip}>
            Pular e configurar depois →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupInicial;

import React, { useState } from 'react';
import { useAlunoAuth } from '../../contexts/AlunoAuthContext';
import Spline from '@splinetool/react-spline';
import { Mail, Lock, AlertCircle, GraduationCap } from 'lucide-react';
import './Aluno.css';

const Spline3D = () => {
  return (
    <Spline 
      scene="https://prod.spline.design/bCg0zhxkBYWMr7kc/scene.splinecode"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

const AlunoLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAlunoAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, senha);
    
    if (result.success) {
      window.location.href = '/aluno/dashboard';
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <GraduationCap size={56} color="#4caf50" />
            <h1>BEM VINDO</h1>
            <h2>Área de Moeda</h2>
            <p>Acesse sua conta para continuar</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="auth-input"
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="auth-input"
              />
            </div>

            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" /> Lembrar-me
              </label>
              <a href="#" className="auth-forgot-password">Esqueceu a senha?</a>
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          <div className="auth-footer-link">
            <p>
              Não tem uma conta? <a href="/aluno/cadastro">Cadastre-se</a>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-spline-container">
        <Spline3D />
      </div>
    </div>
  );
};

export default AlunoLogin;
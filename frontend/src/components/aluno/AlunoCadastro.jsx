import React, { useState, useEffect } from 'react';
import { useAlunoAuth } from '../../contexts/AlunoAuthContext';
import { instituicaoService } from '../../services/instituicaoService';
import Spline from '@splinetool/react-spline';
import { GraduationCap, User, Mail, CreditCard, MapPin, Building, BookOpen, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import './Aluno.css';

const Spline3D = () => {
  return (
    <Spline 
      scene="https://prod.spline.design/bCg0zhxkBYWMr7kc/scene.splinecode"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

const AlunoCadastro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    rg: '',
    endereco: '',
    instituicaoId: '',
    curso: '',
    senha: '',
    confirmarSenha: '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { cadastro } = useAlunoAuth();

  useEffect(() => {
    const carregarInstituicoes = async () => {
      const dados = await instituicaoService.listar();
      setInstituicoes(dados);
    };
    carregarInstituicoes();
  }, []);

  const validarCampo = (name, value, senhaAtual = formData.senha) => {
    switch (name) {
      case 'nome': return !value ? 'Nome é obrigatório' : value.length < 3 ? 'Nome muito curto' : '';
      case 'email': return !value ? 'Email é obrigatório' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email inválido' : '';
      case 'cpf': return !value ? 'CPF é obrigatório' : value.replace(/[^\d]/g, '').length !== 11 ? 'CPF deve ter 11 dígitos' : '';
      case 'rg': return !value ? 'RG é obrigatório' : '';
      case 'endereco': return !value ? 'Endereço é obrigatório' : '';
      case 'instituicaoId': return !value ? 'Selecione uma instituição' : '';
      case 'curso': return !value ? 'Curso é obrigatório' : '';
      case 'senha': return !value ? 'Senha é obrigatória' : value.length < 6 ? 'Mínimo 6 caracteres' : '';
      case 'confirmarSenha': return !value ? 'Confirme sua senha' : value !== senhaAtual ? 'As senhas não coincidem' : '';
      default: return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const errorMsg = validarCampo(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validarCampo(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleCPFChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 11) {
      if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
      else if (value.length > 3) value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
      else if (value.length > 0) value = value.replace(/(\d{3})/, '$1');
      
      setFormData(prev => ({ ...prev, cpf: value }));
      setErrors(prev => ({ ...prev, cpf: validarCampo('cpf', value) }));
    }
  };

  const handleRGChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 9) {
      if (value.length > 6) value = value.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
      else if (value.length > 3) value = value.replace(/(\d{2})(\d{3})/, '$1.$2');
      else if (value.length > 0) value = value.replace(/(\d{2})/, '$1');
      
      setFormData(prev => ({ ...prev, rg: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const novosErrors = {};
    Object.keys(formData).forEach(key => {
      const msg = validarCampo(key, formData[key]);
      if (msg) novosErrors[key] = msg;
    });
    
    setErrors(novosErrors);
    setTouched({
      nome: true, email: true, cpf: true, rg: true,
      endereco: true, instituicaoId: true, curso: true,
      senha: true, confirmarSenha: true,
    });
    
    if (Object.keys(novosErrors).length > 0) return;
    
    setLoading(true);
    const { confirmarSenha, ...dadosParaEnviar } = formData;
    const result = await cadastro(dadosParaEnviar);
    
    if (result.success) {
      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => window.location.href = '/aluno/login', 2000);
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
            <h1>CRIAR CONTA</h1>
            <h2>Área do Aluno</h2>
            <p>Preencha os dados abaixo para se cadastrar</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="auth-success">
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-row">
              <div className="auth-col">
                <label className="auth-label"><User size={14} /> Nome Completo *</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} onBlur={handleBlur} placeholder="Digite seu nome" className={`auth-input ${touched.nome && errors.nome ? 'auth-input-error' : ''}`} />
                {touched.nome && errors.nome && <span className="auth-error-text">{errors.nome}</span>}
              </div>
              <div className="auth-col">
                <label className="auth-label"><Mail size={14} /> Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="seu@email.com" className={`auth-input ${touched.email && errors.email ? 'auth-input-error' : ''}`} />
                {touched.email && errors.email && <span className="auth-error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="auth-row">
              <div className="auth-col">
                <label className="auth-label"><CreditCard size={14} /> CPF *</label>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleCPFChange} onBlur={handleBlur} placeholder="123.456.789-00" maxLength={14} className={`auth-input ${touched.cpf && errors.cpf ? 'auth-input-error' : ''}`} />
                {touched.cpf && errors.cpf && <span className="auth-error-text">{errors.cpf}</span>}
              </div>
              <div className="auth-col">
                <label className="auth-label"><CreditCard size={14} /> RG *</label>
                <input type="text" name="rg" value={formData.rg} onChange={handleRGChange} onBlur={handleBlur} placeholder="12.345.678-9" maxLength={12} className={`auth-input ${touched.rg && errors.rg ? 'auth-input-error' : ''}`} />
                {touched.rg && errors.rg && <span className="auth-error-text">{errors.rg}</span>}
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label"><MapPin size={14} /> Endereço *</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} onBlur={handleBlur} placeholder="Rua, número, bairro, cidade - UF" className={`auth-input ${touched.endereco && errors.endereco ? 'auth-input-error' : ''}`} />
              {touched.endereco && errors.endereco && <span className="auth-error-text">{errors.endereco}</span>}
            </div>

            <div className="auth-row">
              <div className="auth-col">
                <label className="auth-label"><Building size={14} /> Instituição *</label>
                <select name="instituicaoId" value={formData.instituicaoId} onChange={handleChange} onBlur={handleBlur} className={`auth-select ${touched.instituicaoId && errors.instituicaoId ? 'auth-input-error' : ''}`}>
                  <option value="">Selecione</option>
                  {instituicoes.map(inst => <option key={inst.id} value={inst.id}>{inst.nome}</option>)}
                </select>
                {touched.instituicaoId && errors.instituicaoId && <span className="auth-error-text">{errors.instituicaoId}</span>}
              </div>
              <div className="auth-col">
                <label className="auth-label"><BookOpen size={14} /> Curso *</label>
                <input type="text" name="curso" value={formData.curso} onChange={handleChange} onBlur={handleBlur} placeholder="Ex: Engenharia de Software" className={`auth-input ${touched.curso && errors.curso ? 'auth-input-error' : ''}`} />
                {touched.curso && errors.curso && <span className="auth-error-text">{errors.curso}</span>}
              </div>
            </div>

            <div className="auth-row">
              <div className="auth-col">
                <label className="auth-label"><Lock size={14} /> Senha *</label>
                <input type="password" name="senha" value={formData.senha} onChange={handleChange} onBlur={handleBlur} placeholder="Mínimo 6 caracteres" className={`auth-input ${touched.senha && errors.senha ? 'auth-input-error' : ''}`} />
                {touched.senha && errors.senha && <span className="auth-error-text">{errors.senha}</span>}
              </div>
              <div className="auth-col">
                <label className="auth-label"><Lock size={14} /> Confirmar Senha *</label>
                <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} onBlur={handleBlur} placeholder="Confirme sua senha" className={`auth-input ${touched.confirmarSenha && errors.confirmarSenha ? 'auth-input-error' : ''}`} />
                {touched.confirmarSenha && errors.confirmarSenha && <span className="auth-error-text">{errors.confirmarSenha}</span>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Cadastrando...' : 'CADASTRAR'}
            </button>
          </form>

          <div className="auth-footer-link">
            <p>Já tem uma conta? <a href="/aluno/login">Faça login</a></p>
          </div>
        </div>
      </div>

      <div className="auth-spline-container">
        <Spline3D />
      </div>
    </div>
  );
};

export default AlunoCadastro;
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AlunoAuthContext = createContext({});

export const useAlunoAuth = () => useContext(AlunoAuthContext);

export const AlunoAuthProvider = ({ children }) => {
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aluno_token');
    const storedAluno = localStorage.getItem('aluno_data');
    
    if (token && storedAluno) {
      setAluno(JSON.parse(storedAluno));
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/aluno/login', { email, senha });
      const { token, aluno } = response.data;
      
      localStorage.setItem('aluno_token', token);
      localStorage.setItem('aluno_data', JSON.stringify(aluno));
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setAluno(aluno);
      
      return { success: true, aluno };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Erro ao fazer login' 
      };
    }
  };

  const cadastro = async (dadosAluno) => {
    try {
      const response = await api.post('/aluno/cadastro', dadosAluno);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Erro ao realizar cadastro' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('aluno_token');
    localStorage.removeItem('aluno_data');
    setAluno(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <AlunoAuthContext.Provider value={{ aluno, login, cadastro, logout, loading }}>
      {children}
    </AlunoAuthContext.Provider>
  );
};

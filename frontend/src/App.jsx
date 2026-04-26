import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AlunoAuthProvider, useAlunoAuth } from './contexts/AlunoAuthContext';
import AlunoLogin from './components/aluno/AlunoLogin';
import AlunoCadastro from './components/aluno/AlunoCadastro';
import AlunoDashboard from './components/aluno/AlunoDashboard';

const PrivateRoute = ({ children }) => {
  const { aluno, loading } = useAlunoAuth();
  if (loading) return <div>Carregando...</div>;
  return aluno ? children : <Navigate to="/aluno/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/aluno/login" element={<AlunoLogin />} />
      <Route path="/aluno/cadastro" element={<AlunoCadastro />} />
      <Route path="/aluno/dashboard" element={
        <PrivateRoute>
          <AlunoDashboard />
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/aluno/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AlunoAuthProvider>
        <AppRoutes />
      </AlunoAuthProvider>
    </BrowserRouter>
  );
}

export default App;
import React from 'react';
import { useAlunoAuth } from '../../contexts/AlunoAuthContext';

const AlunoDashboard = () => {
  const { aluno, logout } = useAlunoAuth();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>💰 Painel do Aluno</h1>
        <button onClick={logout} style={styles.logoutBtn}>Sair</button>
      </div>
      
      <div style={styles.card}>
        <h2>Bem-vindo, {aluno?.nome || 'Aluno'}! 🎓</h2>
        <p><strong>Email:</strong> {aluno?.email}</p>
        <p><strong>Curso:</strong> {aluno?.curso}</p>
        <p><strong>Instituição:</strong> {aluno?.instituicaoNome}</p>
        <hr />
        <h3>💰 Saldo de Moedas: <span style={styles.saldo}>{aluno?.saldoMoedas || 0}</span></h3>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: '#fff',
    color: '#4caf50',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    margin: '2rem',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  saldo: {
    fontSize: '2rem',
    color: '#4caf50',
    fontWeight: 'bold',
  },
};

export default AlunoDashboard;
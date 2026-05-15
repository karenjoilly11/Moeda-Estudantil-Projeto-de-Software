import { api, setToken, setRole, setStoredUser, clearAuth, getStoredUser, getRole } from "@/lib/api";
import type { Aluno, LoginResponse, Vantagem, Transacao } from "@/types/api";

export const alunoService = {
  login: async (email: string, senha: string): Promise<Aluno> => {
    const response = await api.post<LoginResponse>("/aluno/login", { email, senha });
    setToken(response.data.token);
    setRole('aluno');
    setStoredUser(response.data.aluno);
    return response.data.aluno;
  },

  logout: () => {
    clearAuth();
  },

  cadastrar: async (dados: {
    nome: string;
    email: string;
    cpf: string;
    rg: string;
    endereco: string;
    curso: string;
    senha: string;
    instituicaoId: number;
  }): Promise<Aluno> => {
    const response = await api.post<Aluno>("/aluno/cadastro", dados);
    return response.data;
  },

  atualizarPerfil: async (dados: {
    nome: string;
    email: string;
    endereco: string;
    curso: string;
  }): Promise<Aluno> => {
    const aluno = getStoredUser<Aluno>();
    if (!aluno?.id) {
      throw new Error("ID do aluno não encontrado");
    }
    const response = await api.put<Aluno>(`/aluno/perfil/${aluno.id}`, dados);
    return response.data;
  },

  alterarSenha: async (dados: {
    senhaAtual: string;
    novaSenha: string;
  }): Promise<void> => {
    await api.put<void>("/aluno/senha", dados);
  },

  excluirConta: async (alunoId: number): Promise<void> => {
    await api.del<void>(`/aluno/${alunoId}`);
    clearAuth();
  },

  alunoArmazenado: (): Aluno | null => {
    const role = getRole();
    if (role !== 'aluno') return null;
    return getStoredUser<Aluno>();
  },

  atualizarCache: (aluno: Aluno) => {
    setStoredUser(aluno);
  },

  listarVantagens: async (): Promise<Vantagem[]> => {
    const response = await api.get<Vantagem[]>("/vantagem");
    return response.data;
  },

  listarExtrato: async (alunoId: number): Promise<Transacao[]> => {
    const response = await api.get<Transacao[]>(`/transacao/extrato/${alunoId}`);
    return response.data;
  },

  buscarDados: async (alunoId: number): Promise<Aluno> => {
    const response = await api.get<Aluno>(`/aluno/${alunoId}`);
    return response.data;
  },
};

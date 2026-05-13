import { api, setToken, setRole, setStoredUser, clearAuth, getStoredUser, getRole } from "@/lib/api";
import type { Aluno, LoginResponse, Vantagem, Transacao } from "@/types/api";

export const alunoService = {
  login: async (email: string, senha: string): Promise<Aluno> => {
    const resp = await api.post<LoginResponse>("/aluno/login", { email, senha });
    setToken(resp.token);
    setRole('aluno');
    setStoredUser(resp.aluno);
    return resp.aluno;
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
    const response = await api.post("/aluno/cadastro", dados) as { data: Aluno };
    return response.data;
  },

  /**
 * Atualiza perfil do aluno
 */
 atualizarPerfil: async (dados: {
  nome: string;
  email: string;
  endereco: string;
  curso: string;
}): Promise<Aluno> => {
  const aluno = getStoredUser<Aluno>();
  
  if (!aluno?.id) {
    throw new Error("ID do aluno nao encontrado");
  }
  
  const response = await api.put<Aluno>(`/aluno/perfil/${aluno.id}`, dados);
  return response;
},

  /**
   * Altera senha do aluno
   */
  alterarSenha: async (dados: {
    senhaAtual: string;
    novaSenha: string;
  }): Promise<void> => {
    await api.put("/aluno/senha", dados);
  },

  alunoArmazenado: (): Aluno | null => {
    const role = getRole();
    if (role !== 'aluno') return null;
    return getStoredUser<Aluno>();
  },

  atualizarCache: (aluno: Aluno) => {
    setStoredUser(aluno);
  },

  listarVantagens: () => api.get<Vantagem[]>("/vantagem"),

  listarExtrato: (alunoId: number) =>
    api.get<Transacao[]>(`/transacao/extrato/${alunoId}`),

  buscarDados: (alunoId: number) =>
    api.get<Aluno>(`/aluno/${alunoId}`),

  
};

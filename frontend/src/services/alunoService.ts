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

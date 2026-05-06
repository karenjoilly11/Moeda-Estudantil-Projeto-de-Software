import { api, setToken } from "../lib/api";
import type { Aluno, LoginResponse, Vantagem, Transacao } from "../types/api";


export const alunoService = {
  login: async (email: string, senha: string): Promise<Aluno> => {
    const resp = await api.post<LoginResponse>("/aluno/login", { email, senha });
    setToken(resp.token);
    localStorage.setItem("aluno_data", JSON.stringify(resp.aluno));
    return resp.aluno;
  },

  logout: () => {
    setToken(null);
    localStorage.removeItem("aluno_data");
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

  alunoArmazenado: (): Aluno | null => {
    const raw = localStorage.getItem("aluno_data");
    if (!raw) return null;
    try { return JSON.parse(raw) as Aluno; } catch { return null; }
  },

  atualizarCache: (aluno: Aluno) => {
    localStorage.setItem("aluno_data", JSON.stringify(aluno));
  },

  listarVantagens: () => api.get<Vantagem[]>("/vantagem"),

  listarExtrato: (alunoId: number) =>
    api.get<Transacao[]>(`/transacao/extrato/${alunoId}`),
};

import { api } from "@/lib/api";
import type {
  Professor,
  AlunoResumo,
  Transacao,
  EnvioMoedasRequest,
  EnvioMoedasResponse
} from "@/types/api";

export const professorService = {
  buscarAlunos: async (query: string): Promise<AlunoResumo[]> => {
    const response = await api.get<Array<{ id: number; nome: string; email: string }>>(`/professor/alunos/busca?nome=${encodeURIComponent(query)}`);
    return response.data.map((item) => ({
      id: item.id,
      nome: item.nome,
      email: item.email,
      curso: "",
    }));
  },

  listarExtrato: async (): Promise<Transacao[]> => {
    const response = await api.get<Array<{ valor: number; data: string; mensagem: string; aluno: { nome: string } }>>(`/professor/extrato`);
    return response.data.map((item, index) => ({
      id: index,
      data: item.data,
      tipo: "ENVIO" as const,
      valor: item.valor,
      mensagem: item.mensagem,
      alunoNome: item.aluno?.nome || null,
      professorNome: null,
      codigoCupom: null,
      status: null,
    }));
  },

  enviarMoedas: async (data: EnvioMoedasRequest): Promise<EnvioMoedasResponse> => {
    const response = await api.post<EnvioMoedasResponse>("/professor/enviar-moedas", data);
    return response.data;
  },

  buscarDados: async (professorId: number): Promise<Professor> => {
    const response = await api.get<Professor>(`/professor/${professorId}`);
    return response.data;
  },

  listarAlunos: async (_professorId?: number): Promise<AlunoResumo[]> => {
    const response = await api.get<Array<{ id: number; nome: string; email: string; curso?: string }>>(`/professor/alunos`);
    return response.data.map((item) => ({
      id: item.id,
      nome: item.nome,
      email: item.email,
      curso: item.curso || "",
    }));
  },
};

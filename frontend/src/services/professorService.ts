import { api } from "@/lib/api";
import type { 
  Professor, 
  AlunoResumo, 
  Transacao, 
  EnvioMoedasRequest, 
  EnvioMoedasResponse 
} from "@/types/api";

export const professorService = {
  /**
   * Busca alunos por nome (endpoint correto do backend)
   * GET /api/professor/alunos/busca?nome={query}
   */
  buscarAlunos: async (query: string): Promise<AlunoResumo[]> => {
    const response = await api.get<Array<{ id: number; nome: string; email: string }>>(`/professor/alunos/busca?nome=${encodeURIComponent(query)}`);
    // Map response to AlunoResumo format
    return response.map((item) => ({
      id: item.id,
      nome: item.nome,
      email: item.email,
      curso: "", // Backend não retorna curso na busca
    }));
  },

  /**
   * Busca o extrato do professor
   * GET /api/professor/extrato
   */
  listarExtrato: async (): Promise<Transacao[]> => {
    const response = await api.get<Array<{ valor: number; data: string; mensagem: string; aluno: { nome: string } }>>(`/professor/extrato`);
    // Map response to Transacao format
    return response.map((item, index) => ({
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

  /**
   * Envia moedas para um aluno
   * POST /api/professor/enviar-moedas
   */
  enviarMoedas: (data: EnvioMoedasRequest) =>
    api.post<EnvioMoedasResponse>("/professor/enviar-moedas", data),

  /**
   * Busca os dados atualizados do professor
   */
  buscarDados: (professorId: number) =>
    api.get<Professor>(`/professor/${professorId}`),
};

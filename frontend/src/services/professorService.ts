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
   * Lista todos os alunos da mesma instituição do professor
   */
  listarAlunos: (professorId: number) =>
    api.get<AlunoResumo[]>(`/professor/${professorId}/alunos`),

  /**
   * Busca o histórico de transações (envios de moedas) do professor
   */
  listarHistorico: (professorId: number) =>
    api.get<Transacao[]>(`/transacao/extrato/professor/${professorId}`),

  /**
   * Envia moedas para um aluno
   */
  enviarMoedas: (data: EnvioMoedasRequest) =>
    api.post<EnvioMoedasResponse>("/transacao/enviar", data),

  /**
   * Busca os dados atualizados do professor
   */
  buscarDados: (professorId: number) =>
    api.get<Professor>(`/professor/${professorId}`),

  /**
   * Busca alunos por nome ou email
   */
  buscarAlunos: (professorId: number, query: string) =>
    api.get<AlunoResumo[]>(`/professor/${professorId}/alunos?search=${encodeURIComponent(query)}`),
};

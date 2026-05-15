import { api } from "@/lib/api";
import type { CupomValidacao, ResgateResponse } from "@/types/api";

export const transacaoService = {
  resgatar: async (alunoId: number, vantagemId: number): Promise<ResgateResponse> => {
    const response = await api.post<ResgateResponse>("/transacao/resgatar", { alunoId, vantagemId });
    return response.data;
  },

  validarCupom: async (codigo: string): Promise<CupomValidacao> => {
    const response = await api.get<CupomValidacao>(`/transacao/validar/${encodeURIComponent(codigo)}`);
    return response.data;
  },

  utilizarCupom: async (codigo: string): Promise<CupomValidacao> => {
    const response = await api.post<CupomValidacao>(`/transacao/utilizar/${encodeURIComponent(codigo)}`, {});
    return response.data;
  },

  listarExtrato: async (alunoId: number) => {
    const response = await api.get(`/transacao/extrato/${alunoId}`);
    return response.data;
  },
};

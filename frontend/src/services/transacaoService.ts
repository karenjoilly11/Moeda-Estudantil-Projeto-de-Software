import { api } from "@/lib/api";
import type { CupomValidacao, ResgateResponse } from "@/types/api";

export const transacaoService = {
  resgatar: (alunoId: number, vantagemId: number) =>
    api.post<ResgateResponse>("/transacao/resgatar", { alunoId, vantagemId }),

  validarCupom: (codigo: string) =>
    api.get<CupomValidacao>(`/transacao/validar/${encodeURIComponent(codigo)}`),
};

import { api } from "@/lib/api";
import type { 
  Empresa, 
  Vantagem, 
  VantagemCreate, 
  VantagemUpdate,
  CupomValidacao
} from "@/types/api";

export const empresaService = {
  /**
   * Lista todas as vantagens da empresa
   */
  listarVantagens: (empresaId: number) =>
    api.get<Vantagem[]>(`/empresa/${empresaId}/vantagens`),

  /**
   * Cria uma nova vantagem
   */
  criarVantagem: (data: VantagemCreate) =>
    api.post<Vantagem>("/vantagem", data),

  /**
   * Atualiza uma vantagem existente
   */
  atualizarVantagem: (vantagemId: number, data: VantagemUpdate) =>
    api.put<Vantagem>(`/vantagem/${vantagemId}`, data),

  /**
   * Remove uma vantagem
   */
  removerVantagem: (vantagemId: number) =>
    api.del<void>(`/vantagem/${vantagemId}`),

  /**
   * Valida um cupom de resgate
   */
  validarCupom: (codigo: string) =>
    api.get<CupomValidacao>(`/transacao/validar/${encodeURIComponent(codigo)}`),

  /**
   * Utiliza/confirma um cupom
   */
  utilizarCupom: (codigo: string) =>
    api.post<CupomValidacao>(`/transacao/utilizar/${encodeURIComponent(codigo)}`, {}),

  /**
   * Busca os dados atualizados da empresa
   */
  buscarDados: (empresaId: number) =>
    api.get<Empresa>(`/empresa/${empresaId}`),

  /**
   * Lista histórico de cupons utilizados pela empresa
   */
  listarCuponsUtilizados: (empresaId: number) =>
    api.get<CupomValidacao[]>(`/empresa/${empresaId}/cupons`),
};

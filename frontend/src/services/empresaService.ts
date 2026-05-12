import { api } from "@/lib/api";
import type { 
  Empresa, 
  Vantagem, 
  VantagemCreate, 
  VantagemUpdate,
  CupomValidacao
} from "@/types/api";
import { setToken } from "../lib/api";
import { LoginResponse } from "../types/api";

export const empresaService = {
  /**
   * Cadastro de nova empresa
   */
  cadastrar: async (dados: {
    nome: string;
    email: string;
    cnpj: string;
    descricao: string;
    senha: string;
  }): Promise<Empresa> => {
    const response = await api.post<Empresa>("/empresa/cadastro", dados);
    return response;
  },

  /**
   * Login da empresa
   */
  login: async (email: string, senha: string): Promise<Empresa> => {
    const resp = await api.post<LoginResponse>("/empresa/login", { email, senha });
    setToken(resp.token);
    localStorage.setItem("empresa_data", JSON.stringify(resp.empresa));
    return resp.empresa;
  },
  /**
   * Logout da empresa
   */
  logout: () => {
    setToken(null);
    localStorage.removeItem("empresa_data");
  },
  /**
   * Recupera empresa armazenada no cache
   */
  empresaArmazenada: (): Empresa | null => {
    const raw = localStorage.getItem("empresa_data");
    if (!raw) return null;
    try { return JSON.parse(raw) as Empresa; } catch { return null; }
  },
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

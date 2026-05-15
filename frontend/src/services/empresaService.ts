import { api, setToken, clearAuth } from "@/lib/api";
import type {
  Empresa,
  Vantagem,
  VantagemCreate,
  VantagemUpdate,
  CupomValidacao,
  LoginResponse
} from "@/types/api";

export const empresaService = {
  cadastrar: async (dados: {
    nome: string;
    email: string;
    cnpj: string;
    descricao: string;
    senha: string;
  }): Promise<Empresa> => {
    const response = await api.post<Empresa>("/empresa/cadastro", dados);
    return response.data;
  },

  login: async (email: string, senha: string): Promise<Empresa> => {
    const response = await api.post<LoginResponse>("/empresa/login", { email, senha });
    setToken(response.data.token);
    localStorage.setItem("empresa_data", JSON.stringify(response.data.empresa));
    return response.data.empresa;
  },

  logout: () => {
    clearAuth();
    localStorage.removeItem("empresa_data");
  },

  empresaArmazenada: (): Empresa | null => {
    const raw = localStorage.getItem("empresa_data");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Empresa;
    } catch {
      return null;
    }
  },

  buscarDados: async (empresaId: number): Promise<Empresa> => {
    const response = await api.get<Empresa>(`/empresa/${empresaId}`);
    return response.data;
  },

  listarVantagens: async (empresaId: number): Promise<Vantagem[]> => {
    const response = await api.get<Vantagem[]>(`/empresa/${empresaId}/vantagens`);
    return response.data.map((item) => ({
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      foto: item.foto || "",
      custoMoedas: item.custoMoedas,
      estoque: item.estoque,
      categoria: item.categoria,
      instituicaoNome: item.instituicaoNome || "",
      empresaId: item.empresaId,
      instituicaoId: item.instituicaoId,
    }));
  },

  listarCupons: async (empresaId: number): Promise<CupomValidacao[]> => {
    const response = await api.get<CupomValidacao[]>(`/empresa/${empresaId}/cupons`);
    return response.data;
  },

  criarVantagem: async (data: VantagemCreate): Promise<Vantagem> => {
    const response = await api.post<Vantagem>("/vantagem", data);
    return response.data;
  },

  atualizarVantagem: async (vantagemId: number, data: VantagemUpdate): Promise<Vantagem> => {
    const response = await api.put<Vantagem>(`/vantagem/${vantagemId}`, data);
    return response.data;
  },

  removerVantagem: async (vantagemId: number): Promise<void> => {
    await api.del<void>(`/vantagem/${vantagemId}`);
  },

  validarCupom: async (codigo: string): Promise<CupomValidacao> => {
    const response = await api.get<CupomValidacao>(`/transacao/validar/${encodeURIComponent(codigo)}`);
    return response.data;
  },

  utilizarCupom: async (codigo: string): Promise<CupomValidacao> => {
    const response = await api.post<CupomValidacao>(`/transacao/utilizar/${encodeURIComponent(codigo)}`, {});
    return response.data;
  },

  listarCuponsUtilizados: async (empresaId: number): Promise<CupomValidacao[]> => {
    const response = await api.get<CupomValidacao[]>(`/empresa/${empresaId}/cupons`);
    return response.data;
  },

  atualizarPerfil: async (
    empresaId: number,
    dados: {
      nome: string;
      email: string;
      telefone: string;
      endereco: string;
      descricao: string;
    }
  ): Promise<Empresa> => {
    const response = await api.put<Empresa>(`/empresa/perfil/${empresaId}`, dados);
    return response.data;
  },

  excluirConta: async (empresaId: number): Promise<void> => {
    await api.del<void>(`/empresa/${empresaId}`);
    clearAuth();
  },
};

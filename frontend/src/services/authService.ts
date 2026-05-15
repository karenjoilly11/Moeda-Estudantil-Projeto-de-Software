import { api, setToken, setRole, setStoredUser, clearAuth, getToken, getRole, getStoredUser } from "@/lib/api";
import type {
  UserRole,
  Aluno,
  Professor,
  Empresa,
  AuthUser,
  LoginResponse,
  ProfessorLoginResponse,
  EmpresaLoginResponse
} from "@/types/api";

export const authService = {
  loginAluno: async (email: string, senha: string): Promise<AuthUser> => {
    const response = await api.post<LoginResponse>("/aluno/login", { email, senha });
    setToken(response.data.token);
    setRole('aluno');
    setStoredUser(response.data.aluno);
    return {
      id: response.data.aluno.id,
      nome: response.data.aluno.nome,
      email: response.data.aluno.email,
      role: 'aluno',
      data: response.data.aluno
    };
  },

  loginProfessor: async (email: string, senha: string): Promise<AuthUser> => {
    const response = await api.post<ProfessorLoginResponse>("/professor/login", { email, senha });
    setToken(response.data.token);
    setRole('professor');
    setStoredUser(response.data.professor);
    return {
      id: response.data.professor.id,
      nome: response.data.professor.nome,
      email: response.data.professor.email,
      role: 'professor',
      data: response.data.professor
    };
  },

  loginEmpresa: async (email: string, senha: string): Promise<AuthUser> => {
    const response = await api.post<EmpresaLoginResponse>("/empresa/login", { email, senha });
    setToken(response.data.token);
    setRole('empresa');
    setStoredUser(response.data.empresa);
    return {
      id: response.data.empresa.id,
      nome: response.data.empresa.nome,
      email: response.data.empresa.email,
      role: 'empresa',
      data: response.data.empresa
    };
  },

  login: async (email: string, senha: string, role: UserRole): Promise<AuthUser> => {
    switch (role) {
      case 'aluno':
        return authService.loginAluno(email, senha);
      case 'professor':
        return authService.loginProfessor(email, senha);
      case 'empresa':
        return authService.loginEmpresa(email, senha);
      default:
        throw new Error('Role inválido');
    }
  },

  logout: () => {
    clearAuth();
  },

  isAuthenticated: (): boolean => {
    return !!getToken() && !!getRole();
  },

  getStoredAuth: (): AuthUser | null => {
    const token = getToken();
    const role = getRole();
    if (!token || !role) return null;

    const userData = getStoredUser<Aluno | Professor | Empresa>();
    if (!userData) return null;

    return {
      id: userData.id,
      nome: userData.nome,
      email: userData.email,
      role,
      data: userData
    };
  },

  updateStoredUser: (user: Aluno | Professor | Empresa) => {
    setStoredUser(user);
  },

  getAluno: (): Aluno | null => {
    const role = getRole();
    if (role !== 'aluno') return null;
    return getStoredUser<Aluno>();
  },

  getProfessor: (): Professor | null => {
    const role = getRole();
    if (role !== 'professor') return null;
    return getStoredUser<Professor>();
  },

  getEmpresa: (): Empresa | null => {
    const role = getRole();
    if (role !== 'empresa') return null;
    return getStoredUser<Empresa>();
  }
};

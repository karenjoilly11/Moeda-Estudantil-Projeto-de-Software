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
    const resp = await api.post<LoginResponse>("/aluno/login", { email, senha });
    setToken(resp.token);
    setRole('aluno');
    setStoredUser(resp.aluno);
    return {
      id: resp.aluno.id,
      nome: resp.aluno.nome,
      email: resp.aluno.email,
      role: 'aluno',
      data: resp.aluno
    };
  },

  loginProfessor: async (email: string, senha: string): Promise<AuthUser> => {
    const resp = await api.post<ProfessorLoginResponse>("/professor/login", { email, senha });
    setToken(resp.token);
    setRole('professor');
    setStoredUser(resp.professor);
    return {
      id: resp.professor.id,
      nome: resp.professor.nome,
      email: resp.professor.email,
      role: 'professor',
      data: resp.professor
    };
  },

  loginEmpresa: async (email: string, senha: string): Promise<AuthUser> => {
    const resp = await api.post<EmpresaLoginResponse>("/empresa/login", { email, senha });
    setToken(resp.token);
    setRole('empresa');
    setStoredUser(resp.empresa);
    return {
      id: resp.empresa.id,
      nome: resp.empresa.nome,
      email: resp.empresa.email,
      role: 'empresa',
      data: resp.empresa
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

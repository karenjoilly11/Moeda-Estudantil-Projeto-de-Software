import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { UserRole, AuthUser, Aluno, Professor, Empresa } from '@/types/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, senha: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Aluno | Professor | Empresa) => void;
  getAluno: () => Aluno | null;
  getProfessor: () => Professor | null;
  getEmpresa: () => Empresa | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sessão ao iniciar
  useEffect(() => {
    const storedAuth = authService.getStoredAuth();
    if (storedAuth) {
      setUser(storedAuth);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, senha: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const authUser = await authService.login(email, senha, role);
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((userData: Aluno | Professor | Empresa) => {
    authService.updateStoredUser(userData);
    if (user) {
      setUser({
        ...user,
        nome: userData.nome,
        email: userData.email,
        data: userData
      });
    }
  }, [user]);

  const getAluno = useCallback((): Aluno | null => {
    if (user?.role === 'aluno') {
      return user.data as Aluno;
    }
    return null;
  }, [user]);

  const getProfessor = useCallback((): Professor | null => {
    if (user?.role === 'professor') {
      return user.data as Professor;
    }
    return null;
  }, [user]);

  const getEmpresa = useCallback((): Empresa | null => {
    if (user?.role === 'empresa') {
      return user.data as Empresa;
    }
    return null;
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    login,
    logout,
    updateUser,
    getAluno,
    getProfessor,
    getEmpresa
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hooks específicos por role para conveniência
export function useAluno() {
  const { getAluno, updateUser, isAuthenticated, role } = useAuth();
  
  return {
    aluno: getAluno(),
    isAluno: isAuthenticated && role === 'aluno',
    updateAluno: (aluno: Aluno) => updateUser(aluno)
  };
}

export function useProfessor() {
  const { getProfessor, updateUser, isAuthenticated, role } = useAuth();
  
  return {
    professor: getProfessor(),
    isProfessor: isAuthenticated && role === 'professor',
    updateProfessor: (professor: Professor) => updateUser(professor)
  };
}

export function useEmpresa() {
  const { getEmpresa, updateUser, isAuthenticated, role } = useAuth();
  
  return {
    empresa: getEmpresa(),
    isEmpresa: isAuthenticated && role === 'empresa',
    updateEmpresa: (empresa: Empresa) => updateUser(empresa)
  };
}

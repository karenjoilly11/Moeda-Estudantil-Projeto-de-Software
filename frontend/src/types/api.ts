// ============ TIPOS DE USUÁRIO ============

export type UserRole = 'aluno' | 'professor' | 'empresa';

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  curso: string;
  instituicaoNome: string;
  saldoMoedas: number;
}

export interface Professor {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  departamento: string;
  instituicaoNome: string;
  saldoMoedas: number;
}

export interface Empresa {
  id: number;
  nome: string;
  email: string;
  cnpj: string;
}

// ============ AUTH ============

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  aluno: Aluno;
}

export interface ProfessorLoginResponse {
  token: string;
  professor: Professor;
}

export interface EmpresaLoginResponse {
  token: string;
  empresa: Empresa;
}

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  data: Aluno | Professor | Empresa;
}

// ============ PROFESSOR ============

export interface AlunoResumo {
  id: number;
  nome: string;
  email: string;
  curso: string;
}

export interface EnvioMoedasRequest {
  professorId: number;
  alunoId: number;
  quantidade: number;
  mensagem: string;
}

export interface EnvioMoedasResponse {
  transacaoId: number;
  alunoNome: string;
  quantidade: number;
  saldoRestanteProfessor: number;
  dataEnvio: string;
}

// ============ EMPRESA ============

export interface VantagemCreate {
  nome: string;
  descricao: string;
  foto: string;
  custoMoedas: number;
  empresaId: number;
}

export interface VantagemUpdate {
  nome?: string;
  descricao?: string;
  foto?: string;
  custoMoedas?: number;
}

export interface Vantagem {
  id: number;
  nome: string;
  descricao: string;
  foto: string;
  custoMoedas: number;
  instituicaoNome: string;
}

export type TipoTransacao = "ENVIO" | "RESGATE" | "RECEBIMENTO";

export interface Transacao {
  id: number;
  data: string;
  tipo: TipoTransacao;
  valor: number;
  mensagem: string | null;
  alunoNome: string | null;
  professorNome: string | null;
  codigoCupom: string | null;
  status: string | null;
}

export interface ResgateResponse {
  codigoCupom: string;
  vantagemNome: string;
  custoMoedas: number;
  saldoRestante: number;
  dataResgate: string;
}

export interface CupomValidacao {
  codigoCupom: string;
  alunoNome: string | null;
  vantagemNome: string | null;
  custoMoedas: number;
  status: string;
  dataResgate: string;
}

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  curso: string;
  instituicaoNome: string;
  saldoMoedas: number;
}

export interface LoginResponse {
  token: string;
  aluno: Aluno;
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

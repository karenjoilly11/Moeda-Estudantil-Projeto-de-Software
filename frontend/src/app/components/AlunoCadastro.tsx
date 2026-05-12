import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchInput } from "./SketchInput";
import { alunoService } from "../../services/alunoService";
import type { Aluno } from "../../types/api";
import { api } from "../../lib/api";

interface Instituicao {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
}

interface AlunoCadastroProps {
  onCadastroSuccess: (aluno: Aluno) => void;
  onCancel: () => void;
  onLoginClick?: () => void;
}

export function AlunoCadastro({ onCadastroSuccess, onCancel, onLoginClick }: AlunoCadastroProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [endereco, setEndereco] = useState("");
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [instituicaoId, setInstituicaoId] = useState("");
  const [curso, setCurso] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  
const formatarCPF = (value: string): string => {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return cpf.replace(/(\d{3})(\d)/, "$1.$2");
  if (cpf.length <= 9) return cpf.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
};
  

  useEffect(() => {
    const carregarInstituicoes = async () => {
      try {
        const instituicoesData = await api.get<Instituicao[]>('/instituicoes');
        console.log('Instituições carregadas:', instituicoesData);
        setInstituicoes(instituicoesData);
      } catch (err) {
        console.error('Erro ao carregar instituições', err);
      }
    };
    carregarInstituicoes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    const cpfLimpo = cpf.replace(/\D/g, "");

    setCarregando(true);
    try {
      const aluno = await alunoService.cadastrar({
        nome,
        email,
        cpf: cpfLimpo,
        rg,
        endereco,
        curso,
        senha,
        instituicaoId: Number(instituicaoId)
      });
      onCadastroSuccess(aluno);
    } catch (err: any) {
      setErro(err?.message || "Falha no cadastro");
    } finally {
      setCarregando(false);
    }
  };

  const handleLoginClick = () => {
  if (onLoginClick) {
    onLoginClick();
  } else {
    onCancel();
  }
};

  return (
    <div className="min-h-screen bg-[#F5F2E9] flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <SketchCard>
          <div className="p-2">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 bg-[#F2D06B] border-[2.5px] border-black flex items-center justify-center text-xl"
                style={{ borderRadius: "50% 45% 48% 52%" }}
              >
                📝
              </div>
              <div>
                <h1
                  className="text-xl"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  cadastro de aluno
                </h1>
                <p
                  className="text-xs text-gray-600 italic"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  preencha seus dados para começar
                </p>
              </div>
            </div>

            {/* ABAS: Cadastrar | Entrar */}
            <div className="flex border-b-2 border-black mb-6">
              <button
                onClick={handleLoginClick}
                className="flex-1 py-2 text-center text-lg text-gray-500 hover:text-black transition-all"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                Entrar
              </button>
              <button
                className="flex-1 py-2 text-center text-lg border-b-4 border-[#F2D06B] font-bold"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                Cadastrar
              </button>
            </div>


            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              
              <SketchInput
                label="nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)} 
                required
              />
              <SketchInput
                label="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
             
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SketchInput
                label="CPF"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                placeholder="123.456.789-00"
                maxLength={14}
                required
              />
              <SketchInput
                label="RG"
                value={rg}
                onChange={(e) => setRg(e.target.value)}
                required
              />
              </div>
              <SketchInput
                label="endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">instituição de ensino *</label>
                <select
                  value={instituicaoId}
                  onChange={(e) => setInstituicaoId(e.target.value)}
                  required
                  aria-label="Seleção de instituição de ensino"
                  className="w-full p-3 border-2 border-black rounded-lg bg-white"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  <option value="">Selecione sua instituição</option>
                  {instituicoes.map((inst) => (
                    <option key={inst.id} value={inst.id}>{inst.nome}</option>
                  ))}
                </select>
              </div>

              
              <SketchInput
                label="curso"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SketchInput
                label="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <SketchInput
                label="confirmar senha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
              </div>
              {erro && (
                <div className="bg-red-100 border-2 border-red-400 text-red-700 px-3 py-2 text-sm rounded-lg">
                  ⚠ {erro}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <SketchButton variant="outline" type="button" className="flex-1" onClick={onCancel}>
                  voltar
                </SketchButton>
                <SketchButton variant="primary" type="submit" className="flex-1" disabled={carregando}>
                  {carregando ? "cadastrando..." : "cadastrar →"}
                </SketchButton>
              </div>
            </form>
          </div>
        </SketchCard>
      </motion.div>
    </div>
  );
}

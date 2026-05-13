import { useState } from "react";
import { motion } from "motion/react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchInput } from "./SketchInput";
import { empresaService } from "../../services/empresaService";
import type { Empresa } from "../../types/api";

interface EmpresaCadastroProps {
  onCadastroSuccess: (empresa: Empresa) => void;
  onCancel: () => void;
  onLoginClick?: () => void;
}

const formatarCNPJ = (value: string): string => {
  const cnpj = value.replace(/\D/g, "");
  if (cnpj.length <= 2) return cnpj;
  if (cnpj.length <= 5) return cnpj.replace(/(\d{2})(\d)/, "$1.$2");
  if (cnpj.length <= 8) return cnpj.replace(/(\d{2})(\d{3})(\d)/, "$1.$2.$3");
  if (cnpj.length <= 12) return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d)/, "$1.$2.$3/$4");
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export function EmpresaCadastro({ onCadastroSuccess, onCancel, onLoginClick }: EmpresaCadastroProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [descricao, setDescricao] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    const cnpjLimpo = cnpj.replace(/\D/g, "");

    setCarregando(true);
    try {
      const empresa = await empresaService.cadastrar({
  nome,
  email,
  cnpj: cnpjLimpo,
  descricao,
  senha,
});
      onCadastroSuccess(empresa);
    } catch (err: any) {
      setErro(err?.message || "Falha no cadastro");
    } finally {
      setCarregando(false);
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
          <div className="p-4 sm:p-5">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 bg-[#F2D06B] border-[2.5px] border-black flex items-center justify-center text-xl"
                style={{ borderRadius: "50% 45% 48% 52%" }}
              >
                🏢
              </div>
              <div>
                <h1 className="text-xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  Cadastro de Empresa
                </h1>
                <p className="text-xs text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  ofereça vantagens e parcele moedas
                </p>
              </div>
            </div>

            {/* Abas */}
            <div className="flex border-b-2 border-black mb-6">
              <button
                onClick={onLoginClick}
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
                label="nome da empresa"
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
              <SketchInput
                label="CNPJ"
                value={cnpj}
                onChange={(e) => setCnpj(formatarCNPJ(e.target.value))} 
                placeholder="12.345.678/0001-90"
                maxLength={18}
                required
              />
              <SketchInput
                label="descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Breve descrição da empresa"
              />
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

              {erro && (
                <div className="bg-red-100 border-2 border-red-400 text-red-700 px-3 py-2 text-sm rounded-lg">
                  ⚠ {erro}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <SketchButton
                  variant="outline"
                  type="button"
                  className="flex-1 py-2 text-sm"
                  onClick={onCancel}
                >
                  voltar
                </SketchButton>
                <SketchButton
                  variant="primary"
                  type="submit"
                  className="flex-1 py-2 text-sm"
                  disabled={carregando}
                >
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
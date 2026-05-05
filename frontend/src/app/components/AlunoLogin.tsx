import { useState } from "react";
import { motion } from "motion/react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchInput } from "./SketchInput";
import { alunoService } from "@/services/alunoService";
import type { Aluno } from "@/types/api";

interface AlunoLoginProps {
  onLoginSuccess: (aluno: Aluno) => void;
  onCancel: () => void;
}

export function AlunoLogin({ onLoginSuccess, onCancel }: AlunoLoginProps) {
  const [email, setEmail] = useState("aluno.demo@pucminas.br");
  const [senha, setSenha] = useState("aluno@2024");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const aluno = await alunoService.login(email, senha);
      onLoginSuccess(aluno);
    } catch (err: any) {
      setErro(err?.message || "Falha no login");
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
          <div className="p-2">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 bg-[#F2D06B] border-[2.5px] border-black flex items-center justify-center text-2xl"
                style={{ borderRadius: "50% 45% 48% 52%" }}
              >
                🎓
              </div>
              <div>
                <h1
                  className="text-2xl"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  entrar como aluno
                </h1>
                <p
                  className="text-xs text-gray-600 italic"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  acumule moedas e troque por vantagens
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <SketchInput
                label="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@pucminas.br"
                required
              />
              <SketchInput
                label="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
              />

              {erro && (
                <div
                  className="bg-red-100 border-[2px] border-red-400 text-red-700 px-3 py-2 text-sm"
                  style={{
                    borderRadius: "6px 8px 5px 7px",
                    fontFamily: "'Architects Daughter', cursive",
                  }}
                >
                  ⚠ {erro}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <SketchButton
                  variant="outline"
                  type="button"
                  className="flex-1"
                  onClick={onCancel}
                >
                  voltar
                </SketchButton>
                <SketchButton
                  variant="primary"
                  type="submit"
                  className="flex-1"
                  disabled={carregando}
                >
                  {carregando ? "entrando..." : "entrar →"}
                </SketchButton>
              </div>

              <p
                className="text-xs text-center text-gray-500 mt-2 italic"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                seed: aluno.demo@pucminas.br · aluno@2024
              </p>
            </form>
          </div>
        </SketchCard>
      </motion.div>
    </div>
  );
}

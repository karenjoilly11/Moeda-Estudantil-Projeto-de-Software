import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Pencil, Building2, ArrowLeft } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchInput } from "./SketchInput";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/api";


const roleConfig = {
  aluno: {
    title: "Aluno",
    subtitle: "acumule moedas e troque por vantagens",
    icon: GraduationCap,
    color: "#F2D06B",
    iconBg: "#F2D06B",
    iconColor: "#1A1A1A",
    seedEmail: "aluno.demo@pucminas.br",
    seedPassword: "aluno@2024"
  },
  professor: {
    title: "Professor",
    subtitle: "distribua moedas para reconhecer seus alunos",
    icon: Pencil,
    color: "#1A1A1A",
    iconBg: "#FFFFFF",
    iconColor: "#1A1A1A",
    seedEmail: "professor.demo@pucminas.br",
    seedPassword: "professor@2024"
  },
  empresa: {
    title: "Empresa Parceira",
    subtitle: "ofereça vantagens exclusivas para estudantes",
    icon: Building2,
    color: "#4CAF50",
    iconBg: "#4CAF50",
    iconColor: "#FFFFFF",
    seedEmail: "empresa.demo@parceiro.com",
    seedPassword: "empresa@2024"
  }
};

interface LoginScreenProps {
  selectedRole: UserRole;
  onBack: () => void;
  onLoginSuccess: () => void;
  onCadastroClick?: () => void;
}

export function LoginScreen({ selectedRole, onBack, onLoginSuccess, onCadastroClick }: LoginScreenProps) {
  const config = roleConfig[selectedRole];
  const Icon = config.icon;
  const isEmpresa = selectedRole === "empresa";

  const { login } = useAuth();

  const [email, setEmail] = useState(config.seedEmail);
  const [senha, setSenha] = useState(config.seedPassword);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<"entrar" | "cadastrar">("entrar");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      await login(email, senha, selectedRole);
      onLoginSuccess();
    } catch (err: any) {
      setErro(err?.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setCarregando(false);
    }
  };

  const handleAbaEntrar = () => setAbaAtiva("entrar");
  const handleAbaCadastrar = () => onCadastroClick?.();

  return (
    <div className="min-h-screen bg-[#F5F2E9] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedRole}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
        >
          <SketchCard>
            <div className="p-2">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 border-[2.5px] border-black flex items-center justify-center"
                  style={{
                    borderRadius: "50% 45% 48% 52%",
                    backgroundColor: config.iconBg
                  }}
                >
                  <Icon size={24} color={config.iconColor} strokeWidth={2.5} />
                </div>
                <div>
                  <h1
                    className="text-2xl"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    entrar como {config.title.toLowerCase()}
                  </h1>
                  <p
                    className="text-xs text-gray-600 italic"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    {config.subtitle}
                  </p>
                </div>
              </div>

              {isEmpresa ? (
                <div className="flex border-b-2 border-black mb-6">
                  <button
                    onClick={handleAbaEntrar}
                    className={`flex-1 py-2 text-center text-lg transition-all ${
                      abaAtiva === "entrar"
                        ? "border-b-4 border-[#F2D06B] font-bold"
                        : "text-gray-500 hover:text-black"
                    }`}
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleAbaCadastrar}
                    className={`flex-1 py-2 text-center text-lg transition-all ${
                      abaAtiva === "cadastrar"
                        ? "border-b-4 border-[#F2D06B] font-bold"
                        : "text-gray-500 hover:text-black"
                    }`}
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    Cadastrar
                  </button>
                </div>
              ) : (
                <h2 className="text-xl mb-6 text-center" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  entrar como {config.title.toLowerCase()}
                </h2>
              )}

              

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <SketchInput
                  label="email institucional"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
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
                

                {/* Error message */}
                {erro && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border-[2px] border-red-400 text-red-700 px-3 py-2 text-sm"
                    style={{
                      borderRadius: "6px 8px 5px 7px",
                      fontFamily: "'Architects Daughter', cursive",
                    }}
                  >
                    <span className="mr-1">!</span> {erro}
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                  <SketchButton
                    variant="outline"
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={onBack}
                  >
                    <ArrowLeft size={18} />
                    voltar
                  </SketchButton>
                  <SketchButton
                    variant="primary"
                    type="submit"
                    className="flex-1"
                    disabled={carregando}
                  >
                    {carregando ? "entrando..." : "entrar"}
                  </SketchButton>


                </div>

                {/* Seed hint */}
                <p
                  className="text-xs text-center text-gray-500 mt-2 italic"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  seed: {config.seedEmail} / {config.seedPassword}
                </p>
              </form>
            </div>
          </SketchCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

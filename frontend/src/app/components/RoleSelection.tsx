import { GraduationCap, Pencil, Building2 } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { motion } from "motion/react";

interface RoleSelectionProps {
  onSelectRole: (role: "student" | "professor" | "company") => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const roles = [
    {
      id: "student" as const,
      title: "Aluno",
      subtitle: "recebo moedas\ne troco vantagens",
      icon: GraduationCap,
      color: "#F2D06B"
    },
    {
      id: "professor" as const,
      title: "Professor",
      subtitle: "distribuo moedas\npor reconhecimento",
      icon: Pencil,
      color: "#1A1A1A"
    },
    {
      id: "company" as const,
      title: "Empresa",
      subtitle: "ofereço vantagens\npara estudantes",
      icon: Building2,
      color: "#4CAF50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F2E9] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#F2D06B] border-[2.5px] border-black rounded-full flex items-center justify-center"
               style={{ borderRadius: "50% 45% 48% 52%" }}>
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>
            Moeda Estudantil
          </h1>
        </div>
        <p className="text-lg text-[#1A1A1A] italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          Quem é você?
        </p>
        <p className="text-sm text-gray-600 mt-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          Selecione seu perfil para continuar — o formulário se adapta ao seu tipo de conta.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <motion.div
              key={role.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <SketchCard hoverable onClick={() => onSelectRole(role.id)} className="h-full">
                <div className="flex flex-col items-center text-center p-6">
                  <div
                    className="w-20 h-20 mb-6 border-[2.5px] border-black flex items-center justify-center"
                    style={{
                      borderRadius: "50% 45% 48% 52%",
                      backgroundColor: role.color === "#1A1A1A" ? "#FFFFFF" : role.color
                    }}
                  >
                    <Icon size={36} color={role.color === "#F2D06B" ? "#1A1A1A" : role.color} strokeWidth={2.5} />
                  </div>

                  <h2 className="text-2xl mb-3" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    {role.title}
                  </h2>

                  <p className="text-sm text-gray-700 whitespace-pre-line italic"
                     style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    {role.subtitle}
                  </p>
                </div>
              </SketchCard>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-12 text-sm text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
        já tenho conta? <button className="underline font-medium">entrar</button>
      </p>
    </div>
  );
}

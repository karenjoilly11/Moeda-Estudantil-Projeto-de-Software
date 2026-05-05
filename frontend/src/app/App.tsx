import { useEffect, useState } from "react";
import { RoleSelection } from "./components/RoleSelection";
import { StudentDashboard } from "./components/StudentDashboard";
import { ProfessorDashboard } from "./components/ProfessorDashboard";
import { ProfessorClassView } from "./components/ProfessorClassView";
import { CompanyDashboard } from "./components/CompanyDashboard";
import { AlunoLogin } from "./components/AlunoLogin";
import { alunoService } from "@/services/alunoService";
import type { Aluno } from "@/types/api";

type UserRole = "student" | "professor" | "professor-class" | "company" | null;
type StudentStage = "login" | "dashboard";

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [studentStage, setStudentStage] = useState<StudentStage>("login");
  const [aluno, setAluno] = useState<Aluno | null>(null);

  // Restaurar sessão do aluno se existir
  useEffect(() => {
    const stored = alunoService.alunoArmazenado();
    if (stored) {
      setAluno(stored);
    }
  }, []);

  const handleRoleSelection = (role: UserRole) => {
    if (role === "student") {
      // Se já tem sessão de aluno, vai direto pro dashboard
      if (aluno) {
        setStudentStage("dashboard");
      } else {
        setStudentStage("login");
      }
    }
    setUserRole(role);
  };

  const handleLoginSuccess = (a: Aluno) => {
    setAluno(a);
    setStudentStage("dashboard");
  };

  const handleStudentLogout = () => {
    alunoService.logout();
    setAluno(null);
    setStudentStage("login");
    setUserRole(null);
  };

  const handleSaldoUpdate = (novoSaldo: number) => {
    if (!aluno) return;
    const atualizado = { ...aluno, saldoMoedas: novoSaldo };
    setAluno(atualizado);
    alunoService.atualizarCache(atualizado);
  };

  return (
    <div className="size-full">
      {!userRole && <RoleSelection onSelectRole={handleRoleSelection} />}

      {userRole === "student" && studentStage === "login" && (
        <AlunoLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setUserRole(null)}
        />
      )}

      {userRole === "student" && studentStage === "dashboard" && aluno && (
        <StudentDashboard
          aluno={aluno}
          onLogout={handleStudentLogout}
          onSaldoUpdate={handleSaldoUpdate}
        />
      )}

      {userRole === "professor" && <ProfessorDashboard professorName="Costa" />}

      {userRole === "professor-class" && <ProfessorClassView />}

      {userRole === "company" && <CompanyDashboard companyName="Livraria Cultura" />}

      {/* Development Navigation */}
      {userRole && !(userRole === "student" && studentStage === "login") && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          <button
            onClick={() => {
              if (userRole === "student") {
                handleStudentLogout();
              } else {
                setUserRole(null);
              }
            }}
            className="px-4 py-2 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] transition-all"
            style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
          >
            ← Voltar
          </button>
          {userRole === "professor" && (
            <button
              onClick={() => setUserRole("professor-class")}
              className="px-4 py-2 bg-[#F2D06B] border-[2.5px] border-black shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] transition-all text-sm"
              style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
            >
              Ver Turma
            </button>
          )}
          {userRole === "professor-class" && (
            <button
              onClick={() => setUserRole("professor")}
              className="px-4 py-2 bg-[#F2D06B] border-[2.5px] border-black shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] transition-all text-sm"
              style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
            >
              Ver Dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
}

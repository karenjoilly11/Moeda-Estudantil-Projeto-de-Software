import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RoleSelection } from "./components/RoleSelection";
import { LoginScreen } from "./components/LoginScreen";
import { StudentDashboard } from "./components/StudentDashboard";
import { ProfessorDashboard } from "./components/ProfessorDashboard";
import { ProfessorClassView } from "./components/ProfessorClassView";
import { CompanyDashboard } from "./components/CompanyDashboard";
<<<<<<< HEAD
import { useAuth, useAluno, useProfessor, useEmpresa } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/api";
=======
import { AlunoLogin } from "./components/AlunoLogin";
import { AlunoCadastro } from "./components/AlunoCadastro";
import { alunoService } from "../services/alunoService";
import type { Aluno } from "../types/api";
>>>>>>> ac722f3751704692b90b6a120479b89ec52ae609

type AppScreen = "role-selection" | "login" | "dashboard" | "professor-class";

export default function App() {
<<<<<<< HEAD
  const { isAuthenticated, isLoading, role, logout, updateUser } = useAuth();
  const { aluno } = useAluno();
  const { professor } = useProfessor();
  const { empresa } = useEmpresa();
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [screen, setScreen] = useState<AppScreen>("role-selection");
=======
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [studentStage, setStudentStage] = useState<StudentStage>("login");
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
>>>>>>> ac722f3751704692b90b6a120479b89ec52ae609

  // Sincronizar tela com estado de autenticacao
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && role) {
        // Usuario autenticado - vai para dashboard
        setSelectedRole(role);
        setScreen("dashboard");
      } else {
<<<<<<< HEAD
        // Usuario nao autenticado - vai para selecao de role
        setScreen("role-selection");
        setSelectedRole(null);
=======
        setStudentStage("login");
        setMostrarCadastro(false);
>>>>>>> ac722f3751704692b90b6a120479b89ec52ae609
      }
    }
  }, [isAuthenticated, isLoading, role]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F2E9] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div 
            className="w-16 h-16 mx-auto mb-4 bg-[#F2D06B] border-[2.5px] border-black flex items-center justify-center"
            style={{ borderRadius: "50% 45% 48% 52%" }}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-2xl">$</span>
          </motion.div>
          <p style={{ fontFamily: "'Architects Daughter', cursive" }}>
            carregando...
          </p>
        </motion.div>
      </div>
    );
  }

  const handleRoleSelection = (selected: UserRole) => {
    setSelectedRole(selected);
    
    // Se ja esta autenticado com esse role, vai direto pro dashboard
    if (isAuthenticated && role === selected) {
      setScreen("dashboard");
    } else {
      setScreen("login");
    }
  };

<<<<<<< HEAD
  const handleLoginSuccess = () => {
    setScreen("dashboard");
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setScreen("role-selection");
  };

  const handleLogout = () => {
    logout();
    setSelectedRole(null);
    setScreen("role-selection");
=======
  const handleLoginSuccess = (a: Aluno) => {
    setAluno(a);
    setStudentStage("dashboard");
    setMostrarCadastro(false);
  };

  const handleCadastroSuccess = (a: Aluno) => {
  setMostrarCadastro(false);
  setStudentStage("login");
  setAluno(null);
  alert("Cadastro realizado com sucesso! Faça login para continuar.");
};

  const handleStudentLogout = () => {
    alunoService.logout();
    setAluno(null);
    setStudentStage("login");
    setUserRole(null);
    setMostrarCadastro(false);
>>>>>>> ac722f3751704692b90b6a120479b89ec52ae609
  };

  const handleSaldoUpdate = (novoSaldo: number) => {
    if (aluno) {
      updateUser({ ...aluno, saldoMoedas: novoSaldo });
    }
  };

  const renderContent = () => {
    // Role Selection
    if (screen === "role-selection" && !isAuthenticated) {
      return (
        <motion.div
          key="role-selection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <RoleSelection onSelectRole={handleRoleSelection} />
        </motion.div>
      );
    }

    // Login Screen
    if (screen === "login" && selectedRole) {
      return (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <LoginScreen
            selectedRole={selectedRole}
            onBack={handleBackToRoleSelection}
            onLoginSuccess={handleLoginSuccess}
          />
        </motion.div>
      );
    }

    // Dashboards - Protegidos por autenticacao
    if (screen === "dashboard" && isAuthenticated) {
      // Dashboard do Aluno
      if (role === "aluno" && aluno) {
        return (
          <motion.div
            key="student-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StudentDashboard
              aluno={aluno}
              onLogout={handleLogout}
              onSaldoUpdate={handleSaldoUpdate}
            />
          </motion.div>
        );
      }

      // Dashboard do Professor
      if (role === "professor" && professor) {
        return (
          <motion.div
            key="professor-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProfessorDashboard 
              professor={professor}
              onLogout={handleLogout}
            />
          </motion.div>
        );
      }

      // Dashboard da Empresa
      if (role === "empresa" && empresa) {
        return (
          <motion.div
            key="company-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CompanyDashboard 
              empresa={empresa}
              onLogout={handleLogout}
            />
          </motion.div>
        );
      }
    }

    // Professor Class View
    if (screen === "professor-class" && role === "professor" && professor) {
      return (
        <motion.div
          key="professor-class"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ProfessorClassView />
        </motion.div>
      );
    }

    // Fallback - volta para role selection
    return (
      <motion.div
        key="role-selection-fallback"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <RoleSelection onSelectRole={handleRoleSelection} />
      </motion.div>
    );
  };


  return (
    <div className="size-full">
<<<<<<< HEAD
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
=======
      {!userRole && <RoleSelection onSelectRole={handleRoleSelection} />}

      {/* TELA DE LOGIN DO ALUNO */}
      {userRole === "student" && studentStage === "login" && !mostrarCadastro && (
        <AlunoLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setUserRole(null)}
          onCadastroClick={() => setMostrarCadastro(true)}
        />
      )}

      {/* TELA DE CADASTRO DO ALUNO */}
      {userRole === "student" && mostrarCadastro && (
        <AlunoCadastro
          onCadastroSuccess={handleCadastroSuccess}
          onCancel={() => setMostrarCadastro(false)}
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
>>>>>>> ac722f3751704692b90b6a120479b89ec52ae609
    </div>
  );
}

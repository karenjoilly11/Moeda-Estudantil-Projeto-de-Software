import { useState } from "react";
import { RoleSelection } from "./components/RoleSelection";
import { StudentDashboard } from "./components/StudentDashboard";
import { ProfessorDashboard } from "./components/ProfessorDashboard";
import { ProfessorClassView } from "./components/ProfessorClassView";
import { CompanyDashboard } from "./components/CompanyDashboard";

type UserRole = "student" | "professor" | "professor-class" | "company" | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
  };

  return (
    <div className="size-full">
      {!userRole && <RoleSelection onSelectRole={handleRoleSelection} />}

      {userRole === "student" && <StudentDashboard studentName="Marina" />}

      {userRole === "professor" && <ProfessorDashboard professorName="Costa" />}

      {userRole === "professor-class" && <ProfessorClassView />}

      {userRole === "company" && <CompanyDashboard companyName="Livraria Cultura" />}

      {/* Development Navigation */}
      {userRole && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          <button
            onClick={() => setUserRole(null)}
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
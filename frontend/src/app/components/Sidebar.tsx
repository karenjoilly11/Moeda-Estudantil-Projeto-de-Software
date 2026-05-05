import { Package, CheckCircle, BarChart3, User } from "lucide-react";
import { SketchBadge } from "./SketchBadge";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  resgatesToday?: number;
}

export function Sidebar({ activeView, onViewChange, resgatesToday = 43 }: SidebarProps) {
  const menuItems = [
    { id: "minhas-vantagens", label: "minhas vantagens", icon: Package },
    { id: "validacao", label: "validação de cupons", icon: CheckCircle },
    { id: "relatorios", label: "relatórios", icon: BarChart3 },
    { id: "conta", label: "conta", icon: User }
  ];

  return (
    <aside className="w-64 bg-white border-r-[2.5px] border-black min-h-screen p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#F2D06B] border-[2.5px] border-black rounded-full flex items-center justify-center"
               style={{ borderRadius: "50% 45% 48% 52%" }}>
            <span className="text-xl">💰</span>
          </div>
          <div>
            <h2 className="font-medium text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              Moeda
            </h2>
            <h2 className="font-medium text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              Estudantil
            </h2>
          </div>
        </div>
        <p className="text-xs text-gray-500 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          PARCEIRO
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-[#1A1A1A] text-white'
                  : 'hover:bg-[#F5F2E9]'
              }`}
              style={{
                borderRadius: "6px 8px 5px 7px",
                fontFamily: "'Architects Daughter', cursive"
              }}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-[#F5F2E9] border-[2px] border-black"
           style={{ borderRadius: "8px 10px 6px 9px" }}>
        <p className="text-xs text-gray-600 mb-2 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          resgates hoje mês
        </p>
        <p className="text-3xl font-bold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          {resgatesToday}
        </p>
        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          + 12% vs. mês passado
        </p>
      </div>
    </aside>
  );
}

import { useState } from "react";
import { Package, CheckCircle, BarChart3, User, LogOut, Menu, X, Building2 } from "lucide-react";
import { SketchBadge } from "./SketchBadge";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  resgatesToday?: number;
  onLogout?: () => void;
  empresaNome?: string;
}

export function Sidebar({ activeView, onViewChange, resgatesToday = 43, onLogout, empresaNome }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: "minhas-vantagens", label: "minhas vantagens", icon: Package },
    { id: "validacao", label: "validacao de cupons", icon: CheckCircle },
    { id: "relatorios", label: "relatorios", icon: BarChart3 },
    { id: "conta", label: "conta", icon: User }
  ];

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#22C55E] border-[2.5px] border-black rounded-full flex items-center justify-center"
               style={{ borderRadius: "50% 45% 48% 52%" }}>
            <Building2 size={20} className="text-white" />
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
        {empresaNome && (
          <p className="text-sm font-medium mt-2 truncate" style={{ fontFamily: "'Architects Daughter', cursive" }}>
            {empresaNome}
          </p>
        )}
      </div>

      <nav className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-[#1A1A1A] text-white'
                  : 'hover:bg-[#F5F2E9]'
              }`}
              style={{
                borderRadius: "6px 8px 5px 7px",
                fontFamily: "'Architects Daughter', cursive"
              }}
              whileHover={{ x: isActive ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-[#F5F2E9] border-[2px] border-black"
           style={{ borderRadius: "8px 10px 6px 9px" }}>
        <p className="text-xs text-gray-600 mb-2 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          resgates este mes
        </p>
        <p className="text-3xl font-bold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          {resgatesToday}
        </p>
        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          + 12% vs. mes passado
        </p>
      </div>

      {onLogout && (
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-left transition-colors hover:bg-red-100 text-red-600 border-[2px] border-transparent hover:border-red-300"
          style={{
            borderRadius: "6px 8px 5px 7px",
            fontFamily: "'Architects Daughter', cursive"
          }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} />
          <span className="text-sm">sair</span>
        </motion.button>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b-[2.5px] border-black p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22C55E] border-[2.5px] border-black rounded-full flex items-center justify-center"
                 style={{ borderRadius: "50% 45% 48% 52%" }}>
              <Building2 size={20} className="text-white" />
            </div>
            <span className="text-lg" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              ME Parceiro
            </span>
          </div>
          
          <motion.button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 border-[2.5px] border-black bg-white"
            style={{ borderRadius: "6px 8px 5px 7px" }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 h-full w-64 bg-white border-r-[2.5px] border-black p-6 z-50 overflow-y-auto"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r-[2.5px] border-black min-h-screen p-6 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}

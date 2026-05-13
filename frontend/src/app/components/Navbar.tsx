import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, LogOut, Menu, X, GraduationCap, BookOpen, Building2 } from "lucide-react";
import type { UserRole } from "@/types/api";

interface NavbarProps {
  role: UserRole;
  userName: string;
  userEmail?: string;
  onLogout: () => void;
  onEditClick?: () => void;
}

const roleConfig: Record<UserRole, { 
  icon: React.ElementType; 
  label: string; 
  color: string;
  bgColor: string;
}> = {
  aluno: {
    icon: GraduationCap,
    label: "aluno",
    color: "#F2D06B",
    bgColor: "#F2D06B"
  },
  professor: {
    icon: BookOpen,
    label: "professor",
    color: "#1A1A1A",
    bgColor: "#1A1A1A"
  },
  empresa: {
    icon: Building2,
    label: "empresa",
    color: "#22C55E",
    bgColor: "#22C55E"
  }
};

export function Navbar({ role, userName, userEmail, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const config = roleConfig[role];
  const RoleIcon = config.icon;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e Role */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-full"
              style={{ 
                backgroundColor: config.bgColor
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`text-xl font-bold ${role === 'professor' ? 'text-white' : 'text-black'}`}>$</span>
            </motion.div>
            <div className="flex items-center gap-2">
              <span
                className="text-lg sm:text-xl font-semibold hidden sm:inline"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                Moeda Estudantil
              </span>
              <span
                className="text-lg font-semibold sm:hidden"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                ME
              </span>
              <motion.span 
                className="text-xs italic px-2 py-1 border border-gray-300 rounded hidden sm:inline-block"
                style={{ 
                  fontFamily: "'Architects Daughter', cursive",
                  backgroundColor: `${config.bgColor}20`
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {config.label}
              </motion.span>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <div 
                className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-full"
                style={{ 
                  backgroundColor: config.bgColor
                }}
              >
                <RoleIcon size={16} className={role === 'professor' ? 'text-white' : 'text-black'} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  {userName.split(' ')[0]}
                </p>
                {userEmail && (
                  <p className="text-xs text-gray-500 leading-tight truncate max-w-[120px]">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>

            <motion.button 
              onClick={onLogout}
              className="p-2 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-full transition-colors"
              title="Sair"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <LogOut size={20} className="text-gray-600 hover:text-red-600" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden p-2 border border-gray-300 bg-white rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div 
                  className="w-12 h-12 border border-gray-300 flex items-center justify-center rounded-full"
                  style={{ 
                    backgroundColor: config.bgColor
                  }}
                >
                  <RoleIcon size={24} className={role === 'professor' ? 'text-white' : 'text-black'} />
                </div>
                <div>
                  <p className="font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  )}
                  <span 
                    className="text-xs italic px-2 py-0.5 border border-gray-300 inline-block mt-1 rounded"
                    style={{ 
                      backgroundColor: `${config.bgColor}20`,
                      fontFamily: "'Architects Daughter', cursive"
                    }}
                  >
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <motion.button 
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
                whileTap={{ scale: 0.98 }}
              >
                <Bell size={20} />
                <span>Notificacoes</span>
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </motion.button>

              <motion.button 
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition-colors"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={20} />
                <span>Sair da conta</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

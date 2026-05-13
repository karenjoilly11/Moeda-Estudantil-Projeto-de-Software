import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, User, LogOut, Menu, X, GraduationCap, BookOpen, Building2 } from "lucide-react";
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

export function Navbar({ role, userName, userEmail, onLogout, onEditClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const config = roleConfig[role];
  const RoleIcon = config.icon;

  return (
    <header className="bg-white border-b-[2.5px] border-black sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e Role */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 border-[2.5px] border-black flex items-center justify-center"
              style={{ 
                borderRadius: "50% 45% 48% 52%",
                backgroundColor: config.bgColor
              }}
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`text-xl ${role === 'professor' ? 'text-white' : 'text-black'}`}>$</span>
            </motion.div>
            <div className="flex items-center gap-2">
              <span
                className="text-lg sm:text-xl hidden sm:inline"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                Moeda Estudantil
              </span>
              <span
                className="text-lg sm:hidden"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                ME
              </span>
              <motion.span 
                className="text-xs italic px-2 py-1 border-[2px] border-black hidden sm:inline-block"
                style={{ 
                  borderRadius: "4px 6px 3px 5px",
                  fontFamily: "'Architects Daughter', cursive",
                  backgroundColor: `${config.bgColor}30`
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
              className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F2E9] border-[2px] border-black"
                 style={{ borderRadius: "6px 8px 5px 7px" }}>
              <div 
                className="w-8 h-8 border-[2px] border-black flex items-center justify-center"
                style={{ 
                  borderRadius: "50% 45% 48% 52%",
                  backgroundColor: config.bgColor
                }}
              >
                <RoleIcon size={16} className={role === 'professor' ? 'text-white' : 'text-black'} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium leading-tight" style={{ fontFamily: "'Architects Daughter', cursive" }}>
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
              className="p-2 hover:bg-red-100 border-[2px] border-transparent hover:border-red-300 rounded-full transition-colors"
              title="Sair"
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
            >
              <LogOut size={20} className="text-gray-600 hover:text-red-600" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden p-2 border-[2.5px] border-black bg-white"
            style={{ borderRadius: "6px 8px 5px 7px" }}
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
            className="md:hidden border-t-[2.5px] border-black bg-white overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-[#F5F2E9] border-[2px] border-black"
                   style={{ borderRadius: "6px 8px 5px 7px" }}>
                <div 
                  className="w-12 h-12 border-[2.5px] border-black flex items-center justify-center"
                  style={{ 
                    borderRadius: "50% 45% 48% 52%",
                    backgroundColor: config.bgColor
                  }}
                >
                  <RoleIcon size={24} className={role === 'professor' ? 'text-white' : 'text-black'} />
                </div>
                <div>
                  <p className="font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  )}
                  <span 
                    className="text-xs italic px-2 py-0.5 border border-black inline-block mt-1"
                    style={{ 
                      borderRadius: "3px 4px 2px 3px",
                      backgroundColor: `${config.bgColor}30`,
                      fontFamily: "'Architects Daughter', cursive"
                    }}
                  >
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <motion.button 
                className="w-full flex items-center gap-3 p-3 hover:bg-[#F5F2E9] border-[2px] border-black transition-colors"
                style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
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
                className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 border-[2px] border-red-300 text-red-600 transition-colors"
                style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
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

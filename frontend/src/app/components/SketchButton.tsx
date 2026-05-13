import { motion } from "motion/react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface SketchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
}

/**
 * SketchButton - Botao com estilo "Modern Flat"
 * Bordas sutis, sombras suaves, alto contraste
 */
export function SketchButton({ variant = "primary", children, className = "", disabled, ...props }: SketchButtonProps) {
  const baseClasses = "px-6 py-3 font-semibold transition-all duration-150 relative rounded-lg";

  const variantClasses = {
    primary: "bg-[#1A1A1A] text-white border border-gray-900 shadow-sm hover:bg-[#2A2A2A] hover:shadow-md active:shadow-none",
    outline: "bg-white text-[#1A1A1A] border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md active:shadow-none",
    ghost: "bg-transparent text-[#1A1A1A] border border-transparent hover:bg-gray-100"
  };

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed hover:shadow-sm" 
    : "";

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      style={{
        fontFamily: "'Architects Daughter', cursive"
      }}
      whileHover={!disabled ? { 
        scale: 1.02,
        transition: { duration: 0.15 }
      } : undefined}
      whileTap={!disabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}

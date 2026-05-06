import { motion } from "motion/react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface SketchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
}

export function SketchButton({ variant = "primary", children, className = "", disabled, ...props }: SketchButtonProps) {
  const baseClasses = "px-6 py-3 font-medium transition-all duration-150 relative";

  const variantClasses = {
    primary: "bg-[#1A1A1A] text-white border-[2.5px] border-black shadow-[5px_5px_0px_#000000] hover:shadow-[3px_3px_0px_#000000] active:shadow-none active:translate-x-[5px] active:translate-y-[5px]",
    outline: "bg-white text-[#1A1A1A] border-[2.5px] border-black shadow-[5px_5px_0px_#000000] hover:shadow-[3px_3px_0px_#000000] active:shadow-none active:translate-x-[5px] active:translate-y-[5px]",
    ghost: "bg-transparent text-[#1A1A1A] border-[2.5px] border-transparent hover:border-black"
  };

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed hover:shadow-[5px_5px_0px_#000000] active:shadow-[5px_5px_0px_#000000] active:translate-x-0 active:translate-y-0" 
    : "";

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      style={{
        borderRadius: "8px 12px 6px 10px",
        fontFamily: "'Architects Daughter', cursive"
      }}
      whileHover={!disabled ? { 
        scale: 1.02,
        rotateZ: 0.5,
        transition: { duration: 0.15 }
      } : undefined}
      whileTap={!disabled ? { 
        scale: 0.95,
        rotateZ: -0.5,
        transition: { duration: 0.1 }
      } : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}

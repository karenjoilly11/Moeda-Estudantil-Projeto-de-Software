import { motion } from "motion/react";
import { ReactNode } from "react";

interface SketchCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

/**
 * SketchCard - Card com estilo "Modern Flat"
 * Borda sutil de 1px, sombra suave de 2px, alto contraste
 */
export function SketchCard({ children, className = "", hoverable = false, onClick }: SketchCardProps) {
  const baseClasses = "bg-white border border-gray-200 p-4";

  return (
    <motion.div
      className={`${baseClasses} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
      }}
      whileHover={hoverable ? {
        y: -4,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        transition: { duration: 0.2, ease: "easeOut" }
      } : undefined}
      whileTap={onClick ? {
        y: 1,
        scale: 0.99,
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        transition: { duration: 0.1 }
      } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

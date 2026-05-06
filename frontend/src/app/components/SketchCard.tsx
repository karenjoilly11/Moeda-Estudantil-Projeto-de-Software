import { motion } from "motion/react";
import { ReactNode } from "react";

interface SketchCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function SketchCard({ children, className = "", hoverable = false, onClick }: SketchCardProps) {
  const baseClasses = "bg-white border-[2.5px] border-black p-4";

  return (
    <motion.div
      className={`${baseClasses} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        borderRadius: "8px 12px 6px 10px",
        boxShadow: "5px 5px 0px #000000"
      }}
      whileHover={hoverable ? {
        y: -6,
        x: -2,
        rotateZ: 0.5,
        boxShadow: "9px 9px 0px #000000",
        transition: { duration: 0.2, ease: "easeOut" }
      } : undefined}
      whileTap={onClick ? {
        y: 2,
        x: 2,
        scale: 0.98,
        boxShadow: "2px 2px 0px #000000",
        transition: { duration: 0.1 }
      } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

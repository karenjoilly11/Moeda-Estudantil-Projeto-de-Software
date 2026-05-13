import { Coins } from "lucide-react";
import { ReactNode } from "react";

interface SketchBadgeProps {
  children: ReactNode;
  variant?: "gold" | "black" | "white";
  icon?: boolean;
  className?: string;
}

/**
 * SketchBadge - Badge com estilo "Modern Flat"
 * Bordas sutis, cores vibrantes
 */
export function SketchBadge({ children, variant = "gold", icon = false, className = "" }: SketchBadgeProps) {
  const variantClasses = {
    gold: "bg-[#F2D06B] text-[#1A1A1A] border border-amber-400",
    black: "bg-[#1A1A1A] text-white border border-gray-700",
    white: "bg-white text-[#1A1A1A] border border-gray-300"
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold ${variantClasses[variant]} ${className}`}
      style={{
        fontFamily: "'Architects Daughter', cursive"
      }}
    >
      {icon && <Coins size={18} />}
      {children}
    </div>
  );
}

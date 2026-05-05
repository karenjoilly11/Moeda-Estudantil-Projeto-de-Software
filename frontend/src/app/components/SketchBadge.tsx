import { Coins } from "lucide-react";
import { ReactNode } from "react";

interface SketchBadgeProps {
  children: ReactNode;
  variant?: "gold" | "black" | "white";
  icon?: boolean;
  className?: string;
}

export function SketchBadge({ children, variant = "gold", icon = false, className = "" }: SketchBadgeProps) {
  const variantClasses = {
    gold: "bg-[#F2D06B] text-[#1A1A1A] border-[2px] border-black",
    black: "bg-[#1A1A1A] text-white border-[2px] border-black",
    white: "bg-white text-[#1A1A1A] border-[2px] border-black"
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 ${variantClasses[variant]} ${className}`}
      style={{
        borderRadius: "6px 8px 5px 7px",
        fontFamily: "'Architects Daughter', cursive"
      }}
    >
      {icon && <Coins size={18} />}
      {children}
    </div>
  );
}

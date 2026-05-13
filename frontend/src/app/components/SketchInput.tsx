import { InputHTMLAttributes } from "react";

interface SketchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/**
 * SketchInput - Input com estilo "Modern Flat"
 * Bordas sutis, foco destacado, alto contraste
 */
export function SketchInput({ label, className = "", ...props }: SketchInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className="text-[#1A1A1A] italic text-sm font-medium"
          style={{ fontFamily: "'Architects Daughter', cursive" }}
        >
          {label}
        </label>
      )}
      <input
        className={`px-4 py-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#F2D06B] focus:border-transparent transition-all ${className}`}
        style={{
          fontFamily: "'Architects Daughter', cursive"
        }}
        {...props}
      />
    </div>
  );
}

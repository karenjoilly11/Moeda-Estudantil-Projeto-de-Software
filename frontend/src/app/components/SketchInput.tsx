import { InputHTMLAttributes } from "react";

interface SketchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function SketchInput({ label, className = "", ...props }: SketchInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className="text-[#1A1A1A] italic text-sm"
          style={{ fontFamily: "'Architects Daughter', cursive" }}
        >
          {label}
        </label>
      )}
      <input
        className={`px-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B] transition-all ${className}`}
        style={{
          borderRadius: "8px 12px 6px 10px",
          fontFamily: "'Architects Daughter', cursive"
        }}
        {...props}
      />
    </div>
  );
}

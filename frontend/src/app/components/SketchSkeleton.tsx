import { motion } from "motion/react";

interface SketchSkeletonProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button" | "badge";
  width?: string;
  height?: string;
}

export function SketchSkeleton({ 
  className = "", 
  variant = "text",
  width,
  height
}: SketchSkeletonProps) {
  const baseClasses = "bg-[#e8e3d4] animate-pulse";
  
  const variantStyles: Record<string, { className: string; style: React.CSSProperties }> = {
    text: {
      className: `${baseClasses} h-4 w-full`,
      style: { borderRadius: "4px 6px 3px 5px" }
    },
    card: {
      className: `${baseClasses} border-[2.5px] border-[#d4d0c4] p-4`,
      style: { borderRadius: "8px 12px 6px 10px" }
    },
    avatar: {
      className: `${baseClasses} border-[2.5px] border-[#d4d0c4]`,
      style: { borderRadius: "50% 45% 48% 52%" }
    },
    button: {
      className: `${baseClasses} h-12 border-[2.5px] border-[#d4d0c4]`,
      style: { borderRadius: "8px 12px 6px 10px" }
    },
    badge: {
      className: `${baseClasses} h-6 w-20 border-[2px] border-[#d4d0c4]`,
      style: { borderRadius: "10px 14px 8px 12px" }
    }
  };

  const { className: variantClass, style: variantStyle } = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`${variantClass} ${className}`}
      style={{ 
        ...variantStyle,
        width: width || undefined,
        height: height || undefined
      }}
    />
  );
}

// Componentes de skeleton compostos para casos comuns
export function SketchCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`bg-[#e8e3d4] border-[2.5px] border-[#d4d0c4] p-4 animate-pulse ${className}`}
      style={{ borderRadius: "8px 12px 6px 10px", boxShadow: "5px 5px 0px #d4d0c4" }}
    >
      <div className="space-y-3">
        <SketchSkeleton variant="text" width="60%" />
        <SketchSkeleton variant="text" width="100%" />
        <SketchSkeleton variant="text" width="80%" />
      </div>
    </div>
  );
}

export function SketchProductCardSkeleton() {
  return (
    <div 
      className="bg-[#e8e3d4] border-[2.5px] border-[#d4d0c4] overflow-hidden animate-pulse"
      style={{ borderRadius: "8px 12px 6px 10px", boxShadow: "5px 5px 0px #d4d0c4" }}
    >
      {/* Image placeholder */}
      <div className="w-full h-40 bg-[#d4d0c4]" />
      
      <div className="p-4 space-y-3">
        {/* Title */}
        <SketchSkeleton variant="text" width="70%" />
        {/* Description */}
        <SketchSkeleton variant="text" width="100%" />
        <SketchSkeleton variant="text" width="50%" />
        {/* Badge */}
        <div className="flex justify-between items-center pt-2">
          <SketchSkeleton variant="badge" />
          <SketchSkeleton variant="text" width="60px" />
        </div>
      </div>
    </div>
  );
}

export function SketchTransactionSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 animate-pulse">
      <SketchSkeleton variant="avatar" width="40px" height="40px" />
      <div className="flex-1 space-y-2">
        <SketchSkeleton variant="text" width="60%" />
        <SketchSkeleton variant="text" width="40%" height="12px" />
      </div>
      <SketchSkeleton variant="badge" width="50px" />
    </div>
  );
}

export function SketchListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SketchTransactionSkeleton key={i} />
      ))}
    </div>
  );
}

export function SketchVitrineSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SketchProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

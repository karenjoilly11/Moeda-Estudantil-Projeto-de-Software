import { useState, useRef, type ReactNode, type MouseEvent } from "react";
import { motion } from "motion/react";

interface Sketch3DCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  intensity?: number; // 0-1, controla intensidade do efeito 3D
}

export function Sketch3DCard({ 
  children, 
  className = "", 
  onClick,
  disabled = false,
  intensity = 1
}: Sketch3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const maxRotation = 12 * intensity;
  const maxShadowOffset = 12 * intensity;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calcular posicao relativa do mouse (-1 a 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);

    // Aplicar rotacao (invertido para efeito natural)
    setRotateY(relativeX * maxRotation);
    setRotateX(-relativeY * maxRotation);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Calcular sombra dinamica baseada na rotacao
  const shadowX = 5 + (rotateY / maxRotation) * maxShadowOffset;
  const shadowY = 5 + (-rotateX / maxRotation) * maxShadowOffset;
  const shadowBlur = isHovered ? 0 : 0;
  
  return (
    <motion.div
      ref={cardRef}
      className={`bg-white border-[2.5px] border-black p-4 ${onClick && !disabled ? 'cursor-pointer' : ''} ${disabled ? 'opacity-60' : ''} ${className}`}
      style={{
        borderRadius: "8px 12px 6px 10px",
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: isHovered && !disabled ? 1.02 : 1,
        boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px #000000`,
      }}
      transition={{
        rotateX: { duration: 0.1, ease: "easeOut" },
        rotateY: { duration: 0.1, ease: "easeOut" },
        scale: { duration: 0.2 },
        boxShadow: { duration: 0.15 }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={disabled ? undefined : onClick}
      whileTap={onClick && !disabled ? { scale: 0.98 } : undefined}
    >
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

// Variante com destaque de brilho
interface Sketch3DCardGlowProps extends Sketch3DCardProps {
  glowColor?: string;
}

export function Sketch3DCardGlow({ 
  children, 
  className = "", 
  onClick,
  disabled = false,
  intensity = 1,
  glowColor = "#F2D06B"
}: Sketch3DCardGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const maxRotation = 15 * intensity;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);

    setRotateY(relativeX * maxRotation);
    setRotateX(-relativeY * maxRotation);

    // Posicao do brilho
    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x: glowX, y: glowY });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const shadowX = 5 + (rotateY / maxRotation) * 10;
  const shadowY = 5 + (-rotateX / maxRotation) * 10;
  
  return (
    <motion.div
      ref={cardRef}
      className={`bg-white border-[2.5px] border-black p-4 relative overflow-hidden ${onClick && !disabled ? 'cursor-pointer' : ''} ${disabled ? 'opacity-60' : ''} ${className}`}
      style={{
        borderRadius: "8px 12px 6px 10px",
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: isHovered && !disabled ? 1.03 : 1,
        boxShadow: `${shadowX}px ${shadowY}px 0px #000000`,
      }}
      transition={{
        rotateX: { duration: 0.1 },
        rotateY: { duration: 0.1 },
        scale: { duration: 0.2 },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={disabled ? undefined : onClick}
    >
      {/* Glow effect */}
      {isHovered && !disabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor} 0%, transparent 60%)`,
          }}
        />
      )}
      
      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

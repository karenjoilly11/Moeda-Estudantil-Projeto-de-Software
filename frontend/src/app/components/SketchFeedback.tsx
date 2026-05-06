import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

// ============ CONFETE ============

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
  size: number;
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
  duration?: number;
  pieceCount?: number;
}

export function SketchConfetti({ 
  active, 
  onComplete, 
  duration = 2000,
  pieceCount = 30 
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ["#F2D06B", "#1A1A1A", "#F5F2E9", "#e8e3d4", "#FFD93D", "#FF6B6B", "#4ECDC4"];
      const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
        size: Math.random() * 8 + 6
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, pieceCount, onComplete]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ 
                x: `${piece.x}vw`, 
                y: "-10vh",
                rotate: piece.rotation,
                opacity: 1
              }}
              animate={{ 
                y: "110vh",
                rotate: piece.rotation + (Math.random() > 0.5 ? 720 : -720),
                opacity: [1, 1, 0.5, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: "easeIn"
              }}
              className="absolute"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 
                  ? "50% 45% 48% 52%" 
                  : "4px 6px 3px 5px",
                border: "1.5px solid #000"
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ============ CHECK ANIMADO ============

interface SketchCheckProps {
  active: boolean;
  size?: number;
  onComplete?: () => void;
}

export function SketchCheck({ active, size = 80, onComplete }: SketchCheckProps) {
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => onComplete?.(), 1500);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="inline-flex items-center justify-center"
        >
          <div 
            className="bg-[#F2D06B] border-[3px] border-black flex items-center justify-center"
            style={{ 
              width: size, 
              height: size,
              borderRadius: "50% 45% 48% 52%",
              boxShadow: "4px 4px 0px #000"
            }}
          >
            <motion.svg
              width={size * 0.5}
              height={size * 0.5}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M5 13 L10 18 L20 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              />
            </motion.svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ MOEDAS CAINDO ============

interface CoinRainProps {
  active: boolean;
  coinCount?: number;
  onComplete?: () => void;
}

export function SketchCoinRain({ active, coinCount = 8, onComplete }: CoinRainProps) {
  const [coins, setCoins] = useState<number[]>([]);

  useEffect(() => {
    if (active) {
      setCoins(Array.from({ length: coinCount }, (_, i) => i));
      const timer = setTimeout(() => {
        setCoins([]);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [active, coinCount, onComplete]);

  return (
    <AnimatePresence>
      {coins.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {coins.map((id) => (
            <motion.div
              key={id}
              initial={{ 
                x: `${20 + Math.random() * 60}vw`,
                y: "-50px",
                rotate: 0,
                scale: 0.8 + Math.random() * 0.4
              }}
              animate={{ 
                y: "110vh",
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.5 + Math.random() * 0.5,
                delay: Math.random() * 0.3,
                ease: "easeIn"
              }}
              className="absolute text-3xl"
              style={{ fontFamily: "'Architects Daughter', cursive" }}
            >
              <div 
                className="w-10 h-10 bg-[#F2D06B] border-[2px] border-black flex items-center justify-center"
                style={{ borderRadius: "50% 45% 48% 52%" }}
              >
                <span className="text-lg">$</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ============ TOAST DE SUCESSO ============

interface SketchToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
  duration?: number;
}

export function SketchToast({ show, message, type = "success", onClose, duration = 3000 }: SketchToastProps) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => onClose?.(), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const bgColors = {
    success: "bg-[#F2D06B]",
    error: "bg-red-200",
    info: "bg-white"
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "i"
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div 
            className={`${bgColors[type]} border-[2.5px] border-black px-6 py-3 flex items-center gap-3`}
            style={{ 
              borderRadius: "8px 12px 6px 10px",
              boxShadow: "4px 4px 0px #000",
              fontFamily: "'Architects Daughter', cursive"
            }}
          >
            <span className="text-xl">{icons[type]}</span>
            <span className="font-medium">{message}</span>
            {onClose && (
              <button 
                onClick={onClose}
                className="ml-2 hover:rotate-90 transition-transform"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

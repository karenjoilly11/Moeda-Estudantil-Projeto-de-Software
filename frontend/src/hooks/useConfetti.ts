import confetti from "canvas-confetti";
import { useCallback } from "react";

// Cores do tema Moeda Estudantil
const THEME_COLORS = ["#F2D06B", "#1A1A1A", "#F5F2E9", "#FFFFFF"];
const GOLD_COLORS = ["#F2D06B", "#D4AF37", "#FFD700", "#B8860B"];

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
}

export function useConfetti() {
  // Confete padrao - celebracao geral
  const fireConfetti = useCallback((options?: ConfettiOptions) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: THEME_COLORS,
      ticks: 200,
      gravity: 1.2,
      scalar: 1.2,
      shapes: ["circle", "square"] as confetti.Shape[],
    };

    confetti({
      ...defaults,
      ...options,
    });
  }, []);

  // Confete de moedas douradas - para resgates e envios
  const fireGoldCoins = useCallback(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 9999,
      colors: GOLD_COLORS,
      shapes: ["circle"] as confetti.Shape[],
      scalar: 1.5,
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Disparo de dois lados
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  // Confete de sucesso - mais contido
  const fireSuccess = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: GOLD_COLORS,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  // Efeito de "chuva de moedas" - vindo de cima
  const fireCoinRain = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 3,
        angle: 90,
        spread: 55,
        origin: { x: Math.random(), y: -0.1 },
        colors: GOLD_COLORS,
        shapes: ["circle"] as confetti.Shape[],
        gravity: 1.5,
        scalar: 2,
        drift: 0,
        ticks: 300,
      });
    }, 50);
  }, []);

  // Explosao lateral - para sidebar ou acoes laterais
  const fireSideExplosion = useCallback((side: "left" | "right") => {
    confetti({
      particleCount: 80,
      angle: side === "left" ? 60 : 120,
      spread: 55,
      origin: { x: side === "left" ? 0 : 1, y: 0.6 },
      colors: GOLD_COLORS,
      shapes: ["circle", "square"] as confetti.Shape[],
    });
  }, []);

  // Efeito de fogos - para grandes celebracoes
  const fireFireworks = useCallback(() => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: [...THEME_COLORS, ...GOLD_COLORS],
      });
    }, 400);
  }, []);

  return {
    fireConfetti,
    fireGoldCoins,
    fireSuccess,
    fireCoinRain,
    fireSideExplosion,
    fireFireworks,
  };
}

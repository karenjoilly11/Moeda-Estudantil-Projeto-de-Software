import { motion } from "motion/react";

interface SketchEmptyStateProps {
  variant: "coins" | "transactions" | "rewards" | "students" | "search" | "generic";
  title?: string;
  description?: string;
  className?: string;
}

// Desenhos SVG estilo sketch/hand-drawn
const EmptyIllustrations = {
  coins: () => (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mx-auto">
      {/* Cofrinho triste */}
      <motion.ellipse
        cx="60" cy="60" rx="35" ry="25"
        fill="#F5F2E9"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        initial={{ scale: 0.9 }}
        animate={{ scale: [0.9, 1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Slot do cofrinho */}
      <rect x="50" y="33" width="20" height="4" rx="2" fill="#1A1A1A" />
      {/* Olhinhos tristes */}
      <circle cx="48" cy="55" r="3" fill="#1A1A1A" />
      <circle cx="72" cy="55" r="3" fill="#1A1A1A" />
      {/* Boca triste */}
      <motion.path
        d="M52 70 Q60 65 68 70"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        initial={{ d: "M52 70 Q60 65 68 70" }}
        animate={{ d: ["M52 70 Q60 65 68 70", "M52 68 Q60 63 68 68", "M52 70 Q60 65 68 70"] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Patinhas */}
      <ellipse cx="40" cy="82" rx="8" ry="5" fill="#F5F2E9" stroke="#1A1A1A" strokeWidth="2" />
      <ellipse cx="80" cy="82" rx="8" ry="5" fill="#F5F2E9" stroke="#1A1A1A" strokeWidth="2" />
      {/* Moeda caindo */}
      <motion.g
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: [0, -10, 0], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <circle cx="90" cy="25" r="8" fill="#F2D06B" stroke="#1A1A1A" strokeWidth="2" />
        <text x="87" y="29" fontSize="10" fontFamily="'Architects Daughter', cursive">$</text>
      </motion.g>
    </svg>
  ),
  
  transactions: () => (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mx-auto">
      {/* Lista vazia - papel com linhas */}
      <motion.rect
        x="25" y="10" width="70" height="80" rx="4"
        fill="white"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        initial={{ rotate: -2 }}
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "60px 50px" }}
      />
      {/* Linhas */}
      <line x1="35" y1="30" x2="85" y2="30" stroke="#e8e3d4" strokeWidth="2" strokeDasharray="4 2" />
      <line x1="35" y1="45" x2="85" y2="45" stroke="#e8e3d4" strokeWidth="2" strokeDasharray="4 2" />
      <line x1="35" y1="60" x2="85" y2="60" stroke="#e8e3d4" strokeWidth="2" strokeDasharray="4 2" />
      <line x1="35" y1="75" x2="85" y2="75" stroke="#e8e3d4" strokeWidth="2" strokeDasharray="4 2" />
      {/* Carinha na lateral */}
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <circle cx="100" cy="50" r="8" fill="#F2D06B" stroke="#1A1A1A" strokeWidth="2" />
        <text x="97" y="53" fontSize="8">?</text>
      </motion.g>
    </svg>
  ),

  rewards: () => (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mx-auto">
      {/* Caixa de presente vazia */}
      <motion.rect
        x="30" y="35" width="60" height="50" rx="4"
        fill="#F5F2E9"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Tampa */}
      <motion.rect
        x="25" y="25" width="70" height="15" rx="3"
        fill="#F2D06B"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        initial={{ y: 25 }}
        animate={{ y: [25, 20, 25] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Laco */}
      <circle cx="60" cy="32" r="6" fill="#1A1A1A" />
      {/* Linhas indicando vazio dentro */}
      <motion.path
        d="M45 55 Q60 65 75 55"
        stroke="#d4d0c4"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Estrelinhas ao redor */}
      <motion.text
        x="15" y="35" fontSize="12"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        *
      </motion.text>
      <motion.text
        x="100" y="45" fontSize="12"
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
      >
        *
      </motion.text>
    </svg>
  ),

  students: () => (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mx-auto">
      {/* Cadeira vazia */}
      <rect x="35" y="50" width="50" height="35" rx="3" fill="#F5F2E9" stroke="#1A1A1A" strokeWidth="2.5" />
      {/* Encosto */}
      <rect x="40" y="25" width="40" height="30" rx="3" fill="#F5F2E9" stroke="#1A1A1A" strokeWidth="2.5" />
      {/* Mesa na frente */}
      <motion.rect
        x="20" y="70" width="80" height="8" rx="2"
        fill="#F2D06B"
        stroke="#1A1A1A"
        strokeWidth="2"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: [1, 1.01, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Balão de pensamento */}
      <motion.g
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <circle cx="90" cy="20" r="12" fill="white" stroke="#1A1A1A" strokeWidth="2" />
        <circle cx="82" cy="35" r="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <circle cx="76" cy="42" r="2" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <text x="84" y="24" fontSize="12" fontFamily="'Architects Daughter', cursive">?</text>
      </motion.g>
    </svg>
  ),

  search: () => (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mx-auto">
      {/* Lupa */}
      <motion.g
        initial={{ rotate: -10 }}
        animate={{ rotate: [-10, 10, -10], x: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "50px 50px" }}
      >
        <circle cx="50" cy="45" r="25" fill="white" stroke="#1A1A1A" strokeWidth="3" />
        <line x1="68" y1="63" x2="95" y2="90" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
      </motion.g>
      {/* Carinha triste dentro da lupa */}
      <circle cx="42" cy="40" r="3" fill="#1A1A1A" />
      <circle cx="58" cy="40" r="3" fill="#1A1A1A" />
      <path d="M42 55 Q50 50 58 55" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),

  generic: () => (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mx-auto">
      {/* Nuvem vazia */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <ellipse cx="60" cy="50" rx="35" ry="20" fill="white" stroke="#1A1A1A" strokeWidth="2.5" />
        <ellipse cx="40" cy="45" rx="15" ry="12" fill="white" stroke="#1A1A1A" strokeWidth="2" />
        <ellipse cx="80" cy="45" rx="15" ry="12" fill="white" stroke="#1A1A1A" strokeWidth="2" />
        <ellipse cx="60" cy="35" rx="18" ry="15" fill="white" stroke="#1A1A1A" strokeWidth="2" />
      </motion.g>
      {/* Gotinhas */}
      <motion.ellipse
        cx="45" cy="75" rx="3" ry="5"
        fill="#F2D06B"
        initial={{ y: 75, opacity: 1 }}
        animate={{ y: [75, 90], opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.ellipse
        cx="60" cy="78" rx="3" ry="5"
        fill="#F2D06B"
        initial={{ y: 78, opacity: 1 }}
        animate={{ y: [78, 93], opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
      />
      <motion.ellipse
        cx="75" cy="75" rx="3" ry="5"
        fill="#F2D06B"
        initial={{ y: 75, opacity: 1 }}
        animate={{ y: [75, 90], opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
      />
    </svg>
  )
};

const defaultMessages = {
  coins: { title: "cofrinho vazio!", description: "ainda nao tem moedas por aqui..." },
  transactions: { title: "nenhuma transacao", description: "seu extrato esta limpo como uma folha em branco" },
  rewards: { title: "nada por aqui...", description: "as vantagens sumiram! volte mais tarde" },
  students: { title: "turma vazia", description: "cadeiras esperando por alunos" },
  search: { title: "nao encontrado", description: "tente buscar com outras palavras" },
  generic: { title: "esta vazio", description: "nada para mostrar no momento" }
};

export function SketchEmptyState({ 
  variant, 
  title, 
  description,
  className = ""
}: SketchEmptyStateProps) {
  const Illustration = EmptyIllustrations[variant];
  const defaults = defaultMessages[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 px-4 ${className}`}
    >
      <Illustration />
      <h3 
        className="text-xl mt-6 mb-2"
        style={{ fontFamily: "'Architects Daughter', cursive" }}
      >
        {title || defaults.title}
      </h3>
      <p 
        className="text-sm text-gray-500 italic"
        style={{ fontFamily: "'Architects Daughter', cursive" }}
      >
        {description || defaults.description}
      </p>
    </motion.div>
  );
}

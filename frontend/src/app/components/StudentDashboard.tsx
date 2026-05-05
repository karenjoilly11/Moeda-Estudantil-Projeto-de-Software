import { useState } from "react";
import { Coins, Bell, User, Search, ShoppingBag, Sparkles, Star, Package } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { SketchInput } from "./SketchInput";
import { motion, AnimatePresence } from "motion/react";

interface StudentDashboardProps {
  studentName: string;
}

export function StudentDashboard({ studentName }: StudentDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedReward, setSelectedReward] = useState<any>(null);

  const balance = 235;

  const categories = [
    { id: "todos", label: "todos" },
    { id: "ate-30", label: "até 30" },
    { id: "livros", label: "livros" },
    { id: "comida", label: "comida" },
    { id: "cursos", label: "cursos" }
  ];

  const rewards = [
    { id: 1, title: "Vale-livro", partner: "Livraria Cultura", cost: 50, stock: 15, category: "livros", image: "📚" },
    { id: 2, title: "Café gratuito", partner: "Café do Campus", cost: 15, stock: 30, category: "comida", image: "☕" },
    { id: 3, title: "20% off curso", partner: "Alura", cost: 80, stock: 10, category: "cursos", image: "💻" },
    { id: 4, title: "Camiseta", partner: "Loja UFMG", cost: 60, stock: 8, category: "todos", image: "👕" },
    { id: 5, title: "Ingresso cinema", partner: "Cinemark", cost: 40, stock: 20, category: "todos", image: "🎬" },
    { id: 6, title: "Lanche combo", partner: "Subway", cost: 35, stock: 25, category: "comida", image: "🥪" }
  ];

  const transactions = [
    { id: 1, type: "credit", amount: 20, description: "excelente apresentação no seminário", from: "Prof. Silva", date: "hoje - 14:23" },
    { id: 2, type: "debit", amount: -15, description: "resgate: café → Café do Campus", date: "ontem - 09:18" },
    { id: 3, type: "credit", amount: 25, description: "trabalho colaborativo exemplar", from: "Prof. Costa", date: "23/abr - 16:45" },
    { id: 4, type: "debit", amount: -70, description: "resgate: curso", date: "20/abr - 19:22" },
    { id: 5, type: "credit", amount: 30, description: "Pesquisa e solução extra", from: "Prof. Lima", date: "15/abr - 11:33" }
  ];

  const filteredRewards = selectedCategory === "todos"
    ? rewards
    : rewards.filter(r => r.category === selectedCategory || selectedCategory === "ate-30" && r.cost <= 30);

  return (
    <div className="min-h-screen bg-[#F5F2E9]">
      {/* Header */}
      <header className="bg-white border-b-[2.5px] border-black p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F2D06B] border-[2.5px] border-black rounded-full flex items-center justify-center"
                 style={{ borderRadius: "50% 45% 48% 52%" }}>
              <span className="text-xl">💰</span>
            </div>
            <span className="text-xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              Moeda Estudantil
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Greeting Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <SketchCard>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    Olá, {studentName} 👋
                  </h1>
                  <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    seu saldo atual
                  </p>
                </div>
                <SketchBadge variant="gold" icon className="text-3xl px-6 py-3">
                  {balance}
                </SketchBadge>
              </div>
              <p className="text-xs text-gray-500 mt-3" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                + 55 este mês · última recompensa há 3 dias
              </p>
            </SketchCard>
          </motion.div>

          {/* Vitrine Section */}
          <div className="mb-4">
            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              vitrine de vantagens
            </h2>

            {/* Search and Filters */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="buscar vantagens..."
                  className="w-full pl-10 pr-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
                  style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 border-[2.5px] border-black whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#F2D06B]'
                  }`}
                  style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SketchCard hoverable onClick={() => setSelectedReward(reward)}>
                    {/* Image Placeholder */}
                    <div className="w-full h-32 bg-gradient-to-br from-[#F5F2E9] to-[#e8e3d4] border-[2px] border-black mb-3 flex items-center justify-center text-5xl"
                         style={{ borderRadius: "6px 8px 5px 7px" }}>
                      {reward.image}
                    </div>

                    <h3 className="font-medium mb-1" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      {reward.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      {reward.partner}
                    </p>

                    <div className="flex items-center justify-between">
                      <SketchBadge variant="gold" icon className="text-sm">
                        {reward.cost}
                      </SketchBadge>
                      <SketchButton variant="outline" className="text-xs px-3 py-2">
                        resgatar
                      </SketchButton>
                    </div>
                  </SketchCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Extrato */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              extrato — linha do tempo
            </h2>
            <p className="text-xs text-red-500 mb-4 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              vitrine e extrato sempre visíveis - sem abas
            </p>

            <SketchCard className="p-6">
              <div className="space-y-4">
                {transactions.map((trans, index) => (
                  <motion.div
                    key={trans.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0"
                  >
                    <div className={`w-10 h-10 ${trans.type === 'credit' ? 'bg-[#F2D06B]' : 'bg-gray-200'} border-[2px] border-black flex items-center justify-center flex-shrink-0`}
                         style={{ borderRadius: "50% 45% 48% 52%" }}>
                      {trans.type === 'credit' ? (
                        <span className="text-xl">+</span>
                      ) : (
                        <span className="text-xl text-gray-600">-</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {trans.type === 'credit' && trans.from && (
                        <p className="font-medium text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          {trans.from}
                        </p>
                      )}
                      <p className="text-xs text-gray-700 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        {trans.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        {trans.date}
                      </p>
                    </div>

                    <div className={`font-medium flex-shrink-0 ${trans.type === 'credit' ? 'text-green-600' : 'text-gray-600'}`}
                         style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      {trans.amount > 0 ? '+' : ''}{trans.amount}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-4 text-center text-sm underline"
                      style={{ fontFamily: "'Architects Daughter', cursive" }}>
                ver extrato completo →
              </button>
            </SketchCard>
          </motion.div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <SketchCard>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl mb-1" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        VANTAGEM
                      </h3>
                      <div className="text-3xl mb-3">{selectedReward.image}</div>
                    </div>
                    <button
                      onClick={() => setSelectedReward(null)}
                      className="text-2xl leading-none hover:rotate-90 transition-transform"
                    >
                      ×
                    </button>
                  </div>

                  <h2 className="text-2xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    {selectedReward.title} R$50
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    {selectedReward.partner} · campus central
                  </p>

                  <p className="text-sm mb-6" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    Crédito de R$50 para compra de qualquer livro físico ou e-book na rede Livraria Cultura.
                    Validade: 60 dias após resgate.
                  </p>

                  <div className="flex items-center gap-3 mb-6">
                    <SketchBadge variant="gold" icon className="text-lg">
                      {selectedReward.cost} moedas
                    </SketchBadge>
                    <span className="text-xs text-gray-500" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      saldo após resgate: {balance - selectedReward.cost}
                    </span>
                  </div>

                  <div className="border-t-2 border-dashed border-gray-300 pt-4 flex gap-3">
                    <SketchButton variant="outline" className="flex-1" onClick={() => setSelectedReward(null)}>
                      cancelar
                    </SketchButton>
                    <SketchButton variant="primary" className="flex-1">
                      resgatar vantagem →
                    </SketchButton>
                  </div>
                </div>
              </SketchCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { motion } from "motion/react";

interface RewardsTableViewProps {
  onNewReward: () => void;
}

export function RewardsTableView({ onNewReward }: RewardsTableViewProps) {
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const stats = [
    { label: "VANTAGENS ATIVAS", value: 4, variant: "white" as const },
    { label: "RESGATES · MÊS", value: 43, variant: "white" as const },
    { label: "CUPONS PENDENTES", value: 7, variant: "gold" as const },
    { label: "MOEDAS MOVIM. · MÊS", value: "1.840", variant: "white" as const }
  ];

  const filters = [
    { id: "todos", label: "todos" },
    { id: "ativos", label: "ativos" },
    { id: "inativos", label: "inativos" }
  ];

  const rewards = [
    { id: 1, name: "Vale-livro R$50", description: "crédito para qualquer livro", cost: 50, stock: "-", resgates: 23, status: "ativo" },
    { id: 2, name: "Vale-livro R$100", description: "crédito ampliado", cost: 100, stock: "-", resgates: 8, status: "ativo" },
    { id: 3, name: "Audiobook 30 dias", description: "assinatura digital", cost: 35, stock: "-", resgates: 17, status: "ativo" },
    { id: 4, name: "E-book técnico", description: "um título à escolha", cost: 25, stock: "0", resgates: 5, status: "inativo" },
    { id: 5, name: "Combo papelaria", description: "caderno + caneta + marca-texto", cost: 20, stock: 52, resgates: 34, status: "ativo" }
  ];

  return (
    <div className="flex-1 p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              minhas vantagens
            </h1>
            <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              Livraria Cultura · CNPJ 12.345.678/0001-90
            </p>
          </div>
          <SketchButton variant="primary" onClick={onNewReward} className="flex items-center gap-2">
            <Plus size={20} />
            nova vantagem
          </SketchButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <SketchCard className={stat.variant === "gold" ? "bg-[#F2D06B]/20" : ""}>
                <div className="p-4">
                  <p className="text-xs text-gray-600 mb-1 uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    {stat.value}
                  </p>
                </div>
              </SketchCard>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="🔍 buscar..."
              className="w-full pl-10 pr-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
              style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
            />
          </div>

          <div className="flex gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-3 border-[2.5px] border-black transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-white text-[#1A1A1A] hover:bg-[#F2D06B]'
                }`}
                style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <SketchCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-[2.5px] border-black">
                  <th className="text-left p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    VANTAGEM
                  </th>
                  <th className="text-left p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    DESCRIÇÃO
                  </th>
                  <th className="text-center p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    CUSTO
                  </th>
                  <th className="text-center p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    ESTOQUE
                  </th>
                  <th className="text-center p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    RESGATES
                  </th>
                  <th className="text-center p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward, index) => (
                  <motion.tr
                    key={reward.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="border-b border-gray-200 last:border-0 hover:bg-[#F5F2E9] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#F5F2E9] to-[#e8e3d4] border-[2px] border-black flex items-center justify-center text-xl"
                             style={{ borderRadius: "6px 8px 5px 7px" }}>
                          📚
                        </div>
                        <span className="font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          {reward.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        {reward.description}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <SketchBadge variant="gold" className="inline-flex text-sm">
                        💰 {reward.cost}
                      </SketchBadge>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        {reward.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        {reward.resgates}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        className={`px-4 py-2 border-[2.5px] border-black transition-all ${
                          reward.status === 'ativo'
                            ? 'bg-[#1A1A1A] text-white'
                            : 'bg-white text-[#1A1A1A] hover:bg-gray-100'
                        }`}
                        style={{ borderRadius: "20px 22px 18px 21px", fontFamily: "'Architects Daughter', cursive" }}
                      >
                        {reward.status}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SketchCard>
      </motion.div>
    </div>
  );
}

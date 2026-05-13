import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { SketchEmptyState } from "./SketchEmptyState";
import { SketchListSkeleton, SketchProductCardSkeleton } from "./SketchSkeleton";
import { motion } from "motion/react";
import { empresaService } from "@/services/empresaService";
import { ApiError } from "@/lib/api";
import type { Vantagem } from "@/types/api";

interface RewardsTableViewProps {
  empresaId: number;
  onNewReward: () => void;
}

export function RewardsTableView({ empresaId, onNewReward }: RewardsTableViewProps) {
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  // ZERO MOCK: inicializado como array vazio
  const [rewards, setRewards] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = [
    { id: "todos", label: "todos" },
  ];

  useEffect(() => {
    loadRewards();
  }, [empresaId]);

  const loadRewards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await empresaService.listarVantagens(empresaId);
      setRewards(data);
    } catch (err) {
      // ZERO MOCK: nao usar fallback com dados mockados
      setRewards([]);
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Sessao expirada. Faca login novamente.");
        } else if (err.status === 404) {
          // 404 e aceitavel - nenhuma vantagem cadastrada
          setRewards([]);
        } else {
          setError("Erro ao carregar vantagens. Tente novamente.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter(r => {
    const matchesSearch = !searchQuery || 
      r.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const emojiVantagem = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes("livro") || n.includes("caderno")) return "B";
    if (n.includes("voucher") || n.includes("cantina") || n.includes("cafe")) return "C";
    if (n.includes("camiseta")) return "T";
    if (n.includes("curso") || n.includes("extens")) return "K";
    return "G";
  };

  return (
    <div className="flex-1 p-4 sm:p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              minhas vantagens
            </h1>
            <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              Gerencie os beneficios que sua empresa oferece
            </p>
          </div>
          <SketchButton variant="primary" onClick={onNewReward} className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus size={20} />
            nova vantagem
          </SketchButton>
        </div>

        {/* Stats Cards - Dados reais quando disponiveis */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
          >
            <SketchCard className="p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-600 mb-1 uppercase font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                VANTAGENS CADASTRADAS
              </p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                {loading ? "-" : rewards.length}
              </p>
            </SketchCard>
          </motion.div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-100 border-[2px] border-red-400 text-red-700 px-3 py-2 text-sm"
            style={{
              borderRadius: "6px 8px 5px 7px",
              fontFamily: "'Architects Daughter', cursive",
            }}
          >
            ! {error}
          </motion.div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="buscar..."
              className="w-full pl-10 pr-4 py-3 bg-white border-[2px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
              style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 sm:px-4 py-2 sm:py-3 border-[2px] border-black transition-all text-sm whitespace-nowrap ${
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

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SketchProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRewards.length === 0 ? (
          <SketchCard>
            <SketchEmptyState 
              variant={searchQuery ? "search" : "rewards"} 
              title={searchQuery ? "nenhum resultado" : "nenhuma vantagem cadastrada"}
              description={searchQuery ? `nao encontramos "${searchQuery}"` : "cadastre sua primeira vantagem clicando no botao acima"}
            />
          </SketchCard>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SketchCard className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-12 h-12 bg-gradient-to-br from-[#F5F2E9] to-[#e8e3d4] border-[2px] border-black flex items-center justify-center text-xl flex-shrink-0"
                        style={{ borderRadius: "6px 8px 5px 7px" }}
                      >
                        {emojiVantagem(reward.nome)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          {reward.nome}
                        </h3>
                        <p className="text-xs text-gray-600 italic line-clamp-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          {reward.descricao}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <SketchBadge variant="gold" className="text-sm">
                        $ {reward.custoMoedas}
                      </SketchBadge>
                    </div>
                  </SketchCard>
                </motion.div>
              ))}
            </div>

            {/* Desktop Table View */}
            <SketchCard className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-[2px] border-black">
                      <th className="text-left p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        VANTAGEM
                      </th>
                      <th className="text-left p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        DESCRICAO
                      </th>
                      <th className="text-center p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        CUSTO
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRewards.map((reward, index) => (
                      <motion.tr
                        key={reward.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="border-b border-gray-200 last:border-0 hover:bg-[#F5F2E9] transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 bg-gradient-to-br from-[#F5F2E9] to-[#e8e3d4] border-[2px] border-black flex items-center justify-center text-xl"
                              style={{ borderRadius: "6px 8px 5px 7px" }}
                            >
                              {emojiVantagem(reward.nome)}
                            </div>
                            <span className="font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {reward.nome}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600 italic line-clamp-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            {reward.descricao}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <SketchBadge variant="gold" className="inline-flex text-sm">
                            $ {reward.custoMoedas}
                          </SketchBadge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SketchCard>
          </>
        )}
      </motion.div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { SketchInput } from "./SketchInput";
import { SketchEmptyState } from "./SketchEmptyState";
import { SketchProductCardSkeleton } from "./SketchSkeleton";
import { motion, AnimatePresence } from "motion/react";
import { empresaService } from "@/services/empresaService";
import { ApiError } from "@/lib/api";
import type { Vantagem } from "@/types/api";

interface RewardsTableViewProps {
  empresaId: number;
  onNewReward: () => void;
  reloadKey?: number;
  onChanged?: () => void;
}

interface EditState {
  id: number;
  nome: string;
  descricao: string;
  custoMoedas: string;
  estoque: string;
  categoria: string;
  foto: string;
}

export function RewardsTableView({ empresaId, onNewReward, reloadKey, onChanged }: RewardsTableViewProps) {
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [rewards, setRewards] = useState<Vantagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filters = [
    { id: "todos", label: "todos" },
  ];

  const loadRewards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await empresaService.listarVantagens(empresaId);
      setRewards(Array.isArray(data) ? data : []);
    } catch (err) {
      setRewards([]);
      if (err instanceof ApiError) {
        if (err.status === 401) setError("Sessao expirada. Faca login novamente.");
        else if (err.status !== 404) setError("Erro ao carregar vantagens. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    loadRewards();
  }, [loadRewards, reloadKey]);

  const filteredRewards = (rewards || []).filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const startEdit = (r: Vantagem) => {
    setEditing({
      id: r.id,
      nome: r.nome,
      descricao: r.descricao,
      custoMoedas: String(r.custoMoedas),
      estoque: r.estoque != null ? String(r.estoque) : "",
      categoria: r.categoria || "outros",
      foto: r.foto || "",
    });
    setEditError(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setEditError(null);
    const custo = parseFloat(editing.custoMoedas);
    if (!editing.nome.trim()) { setEditError("Nome é obrigatório"); return; }
    if (isNaN(custo) || custo <= 0) { setEditError("Custo deve ser maior que zero"); return; }

    setSubmitting(true);
    try {
      await empresaService.atualizarVantagem(editing.id, {
        nome: editing.nome,
        descricao: editing.descricao || editing.nome,
        foto: editing.foto,
        custoMoedas: custo,
        estoque: editing.estoque ? parseInt(editing.estoque, 10) : undefined,
        categoria: editing.categoria,
        empresaId,
      });
      setEditing(null);
      await loadRewards();
      onChanged?.();
    } catch (err) {
      setEditError(err instanceof ApiError && typeof err.body === "string" ? err.body : "Erro ao atualizar");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!window.confirm("Excluir esta vantagem? Essa ação não pode ser desfeita.")) return;
    setDeletingId(id);
    try {
      await empresaService.removerVantagem(id);
      await loadRewards();
      onChanged?.();
    } catch (err) {
      const msg = err instanceof ApiError && typeof err.body === "string" ? err.body : "Erro ao excluir";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

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
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <SketchCard className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-600 mb-1 uppercase font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              VANTAGENS CADASTRADAS
            </p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              {loading ? "-" : rewards.length}
            </p>
          </SketchCard>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-[2px] border-red-400 text-red-700 px-3 py-2 text-sm" style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}>
            ! {error}
          </div>
        )}

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
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 sm:px-4 py-2 sm:py-3 border-[2px] border-black transition-all text-sm whitespace-nowrap ${selectedFilter === filter.id ? "bg-[#1A1A1A] text-white" : "bg-white text-[#1A1A1A] hover:bg-[#F2D06B]"}`}
                style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (<SketchProductCardSkeleton key={i} />))}
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
          <SketchCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-[2px] border-black">
                    <th className="text-left p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>VANTAGEM</th>
                    <th className="text-left p-4 text-sm uppercase font-semibold hidden md:table-cell" style={{ fontFamily: "'Architects Daughter', cursive" }}>DESCRICAO</th>
                    <th className="text-center p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>CUSTO</th>
                    <th className="text-center p-4 text-sm uppercase font-semibold hidden md:table-cell" style={{ fontFamily: "'Architects Daughter', cursive" }}>ESTOQUE</th>
                    <th className="text-center p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRewards.map((reward) => (
                    <tr key={reward.id} className="border-b border-gray-200 last:border-0 hover:bg-[#F5F2E9] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {reward.foto ? (
                            <img src={reward.foto} alt={reward.nome} className="w-10 h-10 object-cover border-[2px] border-black" style={{ borderRadius: "6px 8px 5px 7px" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-[#F5F2E9] to-[#e8e3d4] border-[2px] border-black flex items-center justify-center text-xl" style={{ borderRadius: "6px 8px 5px 7px" }}>
                              {emojiVantagem(reward.nome)}
                            </div>
                          )}
                          <span className="font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>{reward.nome}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600 italic line-clamp-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>{reward.descricao}</span>
                      </td>
                      <td className="p-4 text-center">
                        <SketchBadge variant="gold" className="inline-flex text-sm">$ {reward.custoMoedas}</SketchBadge>
                      </td>
                      <td className="p-4 text-center hidden md:table-cell">
                        <span className="text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>{reward.estoque ?? "—"}</span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => startEdit(reward)} className="p-2 border-[2px] border-black bg-white hover:bg-[#F2D06B] transition-colors" style={{ borderRadius: "6px 8px 5px 7px" }} title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => confirmDelete(reward.id)} disabled={deletingId === reward.id} className="p-2 border-[2px] border-black bg-white hover:bg-red-200 transition-colors disabled:opacity-50" style={{ borderRadius: "6px 8px 5px 7px" }} title="Excluir">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SketchCard>
        )}
      </motion.div>

      {/* Modal Editar */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <SketchCard>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>Editar Vantagem</h2>
                    <button onClick={() => setEditing(null)} className="text-2xl leading-none hover:rotate-90 transition-transform p-2">x</button>
                  </div>
                  <div className="space-y-4">
                    <SketchInput label="Título" value={editing.nome} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} />
                    <SketchInput label="Descrição" value={editing.descricao} onChange={(e) => setEditing({ ...editing, descricao: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <SketchInput label="Custo (moedas)" type="number" value={editing.custoMoedas} onChange={(e) => setEditing({ ...editing, custoMoedas: e.target.value })} />
                      <SketchInput label="Estoque" type="number" value={editing.estoque} onChange={(e) => setEditing({ ...editing, estoque: e.target.value })} />
                    </div>
                    <SketchInput label="Categoria" value={editing.categoria} onChange={(e) => setEditing({ ...editing, categoria: e.target.value })} />
                    <SketchInput label="URL da imagem" value={editing.foto} onChange={(e) => setEditing({ ...editing, foto: e.target.value })} />
                  </div>
                  {editError && <p className="text-red-600 text-sm mt-4 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>{editError}</p>}
                  <div className="border-t-2 border-dashed border-gray-300 mt-6 pt-6 flex gap-3">
                    <SketchButton variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancelar</SketchButton>
                    <SketchButton variant="primary" className="flex-1" onClick={saveEdit} disabled={submitting}>
                      {submitting ? "Salvando..." : "Salvar"}
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

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchBadge } from "./SketchBadge";
import { SketchEmptyState } from "./SketchEmptyState";
import { empresaService } from "@/services/empresaService";
import { ApiError } from "@/lib/api";
import type { CupomValidacao } from "@/types/api";

interface EmpresaCuponsProps {
  empresaId: number;
}

export function EmpresaCupons({ empresaId }: EmpresaCuponsProps) {
  const [cupons, setCupons] = useState<CupomValidacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await empresaService.listarCupons(empresaId);
      setCupons(data);
    } catch (err) {
      setCupons([]);
      if (err instanceof ApiError) {
        if (err.status === 401) setError("Sessao expirada. Faca login novamente.");
        else if (err.status !== 404) setError("Erro ao carregar cupons.");
      }
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => { load(); }, [load]);

  const formatDate = (s: string) => {
    try {
      return new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    } catch { return s; }
  };

  return (
    <div className="flex-1 p-4 sm:p-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              cupons gerados
            </h1>
            <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              Histórico de resgates das suas vantagens
            </p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 border-[2px] border-black bg-white hover:bg-[#F2D06B] transition-colors text-sm"
            style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
          >
            <RefreshCw size={16} />
            atualizar
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <SketchCard className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-600 mb-1 uppercase font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>TOTAL</p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Architects Daughter', cursive" }}>{loading ? "-" : cupons.length}</p>
          </SketchCard>
          <SketchCard className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-600 mb-1 uppercase font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>UTILIZADOS</p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              {loading ? "-" : cupons.filter((c) => c.status === "UTILIZADO").length}
            </p>
          </SketchCard>
          <SketchCard className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-600 mb-1 uppercase font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>PENDENTES</p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              {loading ? "-" : cupons.filter((c) => c.status === "PENDENTE").length}
            </p>
          </SketchCard>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-[2px] border-red-400 text-red-700 px-3 py-2 text-sm" style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}>
            ! {error}
          </div>
        )}

        {loading ? (
          <SketchCard className="p-8 text-center">
            <p className="italic text-gray-500" style={{ fontFamily: "'Architects Daughter', cursive" }}>carregando...</p>
          </SketchCard>
        ) : cupons.length === 0 ? (
          <SketchCard>
            <SketchEmptyState
              variant="rewards"
              title="nenhum cupom ainda"
              description="quando alunos resgatarem suas vantagens, os cupons aparecerão aqui"
            />
          </SketchCard>
        ) : (
          <SketchCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-[2px] border-black">
                    <th className="text-left p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>CÓDIGO</th>
                    <th className="text-left p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>ALUNO</th>
                    <th className="text-left p-4 text-sm uppercase font-semibold hidden md:table-cell" style={{ fontFamily: "'Architects Daughter', cursive" }}>VANTAGEM</th>
                    <th className="text-center p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>CUSTO</th>
                    <th className="text-center p-4 text-sm uppercase font-semibold" style={{ fontFamily: "'Architects Daughter', cursive" }}>STATUS</th>
                    <th className="text-left p-4 text-sm uppercase font-semibold hidden md:table-cell" style={{ fontFamily: "'Architects Daughter', cursive" }}>DATA</th>
                  </tr>
                </thead>
                <tbody>
                  {cupons.map((c) => (
                    <tr key={c.codigoCupom} className="border-b border-gray-200 last:border-0 hover:bg-[#F5F2E9] transition-colors">
                      <td className="p-4 font-mono text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>{c.codigoCupom}</td>
                      <td className="p-4 text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>{c.alunoNome || "—"}</td>
                      <td className="p-4 text-sm hidden md:table-cell" style={{ fontFamily: "'Architects Daughter', cursive" }}>{c.vantagemNome || "—"}</td>
                      <td className="p-4 text-center">
                        <SketchBadge variant="gold" className="inline-flex text-sm">$ {c.custoMoedas}</SketchBadge>
                      </td>
                      <td className="p-4 text-center">
                        <SketchBadge variant={c.status === "UTILIZADO" ? "black" : "gold"} className="inline-flex text-xs">
                          {c.status}
                        </SketchBadge>
                      </td>
                      <td className="p-4 text-xs hidden md:table-cell" style={{ fontFamily: "'Architects Daughter', cursive" }}>{formatDate(c.dataResgate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SketchCard>
        )}
      </motion.div>
    </div>
  );
}

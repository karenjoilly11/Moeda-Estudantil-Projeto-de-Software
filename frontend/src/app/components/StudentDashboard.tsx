import { useEffect, useMemo, useState } from "react";
import { Search, Copy, Check } from "lucide-react";
import { Sketch3DCard, Sketch3DCardGlow } from "./Sketch3DCard";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { Navbar } from "./Navbar";
import { 
  SketchProductCardSkeleton, 
  SketchListSkeleton 
} from "./SketchSkeleton";
import { motion, AnimatePresence } from "motion/react";
<<<<<<< HEAD
import { alunoService } from "@/services/alunoService";
import { transacaoService } from "@/services/transacaoService";
import { useConfetti } from "@/hooks/useConfetti";
import type {
  Aluno,
  Transacao,
  Vantagem,
  ResgateResponse,
} from "@/types/api";
=======
import { alunoService } from "../../services/alunoService";
import { transacaoService } from "../../services/transacaoService";
import type { Aluno, Transacao, Vantagem, ResgateResponse } from "../../types/api";

>>>>>>> ac722f3751704692b90b6a120479b89ec52ae609

interface StudentDashboardProps {
  aluno: Aluno;
  onLogout?: () => void;
  onSaldoUpdate?: (novoSaldo: number) => void;
}

const formatarData = (iso: string | null) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const emojiVantagem = (nome: string) => {
  const n = nome.toLowerCase();
  if (n.includes("livro") || n.includes("caderno")) return "📚";
  if (n.includes("voucher") || n.includes("cantina") || n.includes("cafe")) return "☕";
  if (n.includes("camiseta")) return "👕";
  if (n.includes("curso") || n.includes("extens")) return "💻";
  return "🎁";
};

export function StudentDashboard({ aluno, onLogout, onSaldoUpdate }: StudentDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReward, setSelectedReward] = useState<Vantagem | null>(null);
  const [copiedCupom, setCopiedCupom] = useState(false);

  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [extrato, setExtrato] = useState<Transacao[]>([]);
  const [carregandoVantagens, setCarregandoVantagens] = useState(true);
  const [carregandoExtrato, setCarregandoExtrato] = useState(true);
  const [erroResgate, setErroResgate] = useState<string | null>(null);
  const [processandoResgate, setProcessandoResgate] = useState(false);
  const [cupomGerado, setCupomGerado] = useState<ResgateResponse | null>(null);

  const { fireGoldCoins, fireSuccess } = useConfetti();

  const balance = aluno.saldoMoedas;

  const carregarVantagens = async () => {
    setCarregandoVantagens(true);
    try {
      const data = await alunoService.listarVantagens();
      setVantagens(data);
    } catch (err) {
      console.error("Erro ao listar vantagens:", err);
    } finally {
      setCarregandoVantagens(false);
    }
  };

  const carregarExtrato = async () => {
    setCarregandoExtrato(true);
    try {
      const data = await alunoService.listarExtrato(aluno.id);
      setExtrato(data);
    } catch (err) {
      console.error("Erro ao carregar extrato:", err);
    } finally {
      setCarregandoExtrato(false);
    }
  };

  useEffect(() => {
    carregarVantagens();
    carregarExtrato();
  }, [aluno.id]);

  const filteredRewards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return vantagens;
    return vantagens.filter(
      (v) =>
        v.nome.toLowerCase().includes(q) ||
        v.descricao.toLowerCase().includes(q) ||
        v.instituicaoNome.toLowerCase().includes(q),
    );
  }, [vantagens, searchQuery]);

  const handleResgatar = async () => {
    if (!selectedReward) return;
    setErroResgate(null);
    setProcessandoResgate(true);
    try {
      const resp = await transacaoService.resgatar(aluno.id, selectedReward.id);
      setCupomGerado(resp);
      setSelectedReward(null);
      onSaldoUpdate?.(resp.saldoRestante);
      carregarExtrato();
      
      // Dispara confete de moedas douradas
      setTimeout(() => {
        fireGoldCoins();
      }, 300);
    } catch (err: any) {
      setErroResgate(err?.message || "Erro ao resgatar");
    } finally {
      setProcessandoResgate(false);
    }
  };

  const copiarCupom = async () => {
    if (cupomGerado?.codigoCupom) {
      try {
        await navigator.clipboard.writeText(cupomGerado.codigoCupom);
        setCopiedCupom(true);
        fireSuccess();
        setTimeout(() => setCopiedCupom(false), 2000);
      } catch {
        // Fallback para navegadores antigos
        const textArea = document.createElement("textarea");
        textArea.value = cupomGerado.codigoCupom;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopiedCupom(true);
        setTimeout(() => setCopiedCupom(false), 2000);
      }
    }
  };

  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <div className="min-h-screen bg-[#F5F2E9]">
      {/* Navbar Dinamica */}
      <Navbar 
        role="aluno"
        userName={aluno.nome}
        userEmail={aluno.email}
        onLogout={handleLogout}
      />

<<<<<<< HEAD
      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
=======
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors" aria-label="Notificações">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors" aria-label="Perfil" title={aluno.email}>
              <User size={20} />
            </button>
            {onLogout && (
              <SketchButton variant="outline" className="text-xs px-3 py-2" onClick={onLogout}>
                sair
              </SketchButton>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
>>>>>>> ac722f3751704692b90b6a120479b89ec52ae609
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Greeting Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <Sketch3DCardGlow glowColor="#F2D06B">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1
                    className="text-2xl sm:text-3xl mb-2"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    Ola, {aluno.nome.split(" ")[0]}!
                  </h1>
                  <p
                    className="text-sm text-gray-600 italic"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    {aluno.curso} - {aluno.instituicaoNome}
                  </p>
                </div>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <SketchBadge variant="gold" icon className="text-2xl sm:text-3xl px-4 sm:px-6 py-2 sm:py-3">
                    {balance}
                  </SketchBadge>
                </motion.div>
              </div>
              <p
                className="text-xs text-gray-500 mt-3"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                seu saldo atual de moedas
              </p>
            </Sketch3DCardGlow>
          </motion.div>

          {/* Vitrine Section */}
          <div className="mb-4">
            <h2
              className="text-xl sm:text-2xl mb-4"
              style={{ fontFamily: "'Architects Daughter', cursive" }}
            >
              vitrine de vantagens
            </h2>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="buscar vantagens..."
                  className="w-full pl-10 pr-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
                  style={{
                    borderRadius: "8px 12px 6px 10px",
                    fontFamily: "'Architects Daughter', cursive",
                  }}
                />
              </div>
            </div>

            {/* Rewards Grid - Skeleton */}
            {carregandoVantagens && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <SketchProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!carregandoVantagens && filteredRewards.length === 0 && (
              <SketchCard className="text-center py-8">
                <p
                  className="text-gray-500 italic"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  nenhuma vantagem encontrada
                </p>
              </SketchCard>
            )}

            {/* Rewards Grid */}
            {!carregandoVantagens && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredRewards.map((reward, index) => {
                  const semSaldo = balance < reward.custoMoedas;
                  return (
                    <motion.div
                      key={reward.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Sketch3DCard
                        onClick={semSaldo ? undefined : () => setSelectedReward(reward)}
                        disabled={semSaldo}
                        intensity={0.8}
                      >
                        <div
                          className="w-full h-28 sm:h-32 bg-gradient-to-br from-[#F5F2E9] to-[#e8e3d4] border-[2px] border-black mb-3 flex items-center justify-center text-4xl sm:text-5xl"
                          style={{ borderRadius: "6px 8px 5px 7px" }}
                        >
                          {emojiVantagem(reward.nome)}
                        </div>

                        <h3
                          className="font-medium mb-1 line-clamp-1"
                          style={{ fontFamily: "'Architects Daughter', cursive" }}
                        >
                          {reward.nome}
                        </h3>
                        <p
                          className="text-xs text-gray-600 mb-3 italic line-clamp-2"
                          style={{ fontFamily: "'Architects Daughter', cursive" }}
                        >
                          {reward.instituicaoNome}
                        </p>

                        <div className="flex items-center justify-between">
                          <SketchBadge variant="gold" icon className="text-sm">
                            {reward.custoMoedas}
                          </SketchBadge>
                          <SketchButton
                            variant="outline"
                            className="text-xs px-3 py-2"
                            disabled={semSaldo}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!semSaldo) setSelectedReward(reward);
                            }}
                          >
                            {semSaldo ? "sem saldo" : "resgatar"}
                          </SketchButton>
                        </div>
                      </Sketch3DCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Extrato */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2
              className="text-xl sm:text-2xl mb-4"
              style={{ fontFamily: "'Architects Daughter', cursive" }}
            >
              extrato
            </h2>

            <SketchCard className="p-4 sm:p-6">
              {carregandoExtrato && <SketchListSkeleton count={5} />}

              {!carregandoExtrato && extrato.length === 0 && (
                <p
                  className="text-sm text-gray-500 italic text-center py-4"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  nenhuma transacao registrada ainda
                </p>
              )}

              {!carregandoExtrato && extrato.length > 0 && (
                <div className="space-y-4">
                  {extrato.map((trans, index) => {
                    const isCredito = trans.tipo === "ENVIO";
                    return (
                      <motion.div
                        key={trans.id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0"
                      >
                        <div
                          className={`w-10 h-10 ${
                            isCredito ? "bg-[#F2D06B]" : "bg-gray-200"
                          } border-[2px] border-black flex items-center justify-center flex-shrink-0`}
                          style={{ borderRadius: "50% 45% 48% 52%" }}
                        >
                          <span className="text-xl">{isCredito ? "+" : "-"}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          {isCredito && trans.professorNome && (
                            <p
                              className="font-medium text-sm"
                              style={{ fontFamily: "'Architects Daughter', cursive" }}
                            >
                              {trans.professorNome}
                            </p>
                          )}
                          <p
                            className="text-xs text-gray-700 italic line-clamp-2"
                            style={{ fontFamily: "'Architects Daughter', cursive" }}
                          >
                            {trans.mensagem}
                          </p>
                          <p
                            className="text-xs text-gray-500 mt-1"
                            style={{ fontFamily: "'Architects Daughter', cursive" }}
                          >
                            {formatarData(trans.data)}
                            {trans.codigoCupom && (
                              <>
                                {" - cupom "}
                                <span className="font-mono text-[10px]">{trans.codigoCupom}</span>
                              </>
                            )}
                          </p>
                        </div>

                        <div
                          className={`font-medium flex-shrink-0 ${
                            isCredito ? "text-green-600" : "text-gray-600"
                          }`}
                          style={{ fontFamily: "'Architects Daughter', cursive" }}
                        >
                          {isCredito ? "+" : "-"}
                          {trans.valor}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </SketchCard>
          </motion.div>
        </div>
      </div>

      {/* Modal de Confirmacao de Resgate */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => !processandoResgate && setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <SketchCard>
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        className="text-lg sm:text-xl mb-1"
                        style={{ fontFamily: "'Architects Daughter', cursive" }}
                      >
                        VANTAGEM
                      </h3>
                      <div className="text-3xl mb-3">{emojiVantagem(selectedReward.nome)}</div>
                    </div>
                    <button
                      onClick={() => !processandoResgate && setSelectedReward(null)}
                      className="text-2xl leading-none hover:rotate-90 transition-transform p-2"
                    >
                      x
                    </button>
                  </div>

                  <h2
                    className="text-xl sm:text-2xl mb-2"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    {selectedReward.nome}
                  </h2>
                  <p
                    className="text-sm text-gray-600 mb-4 italic"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    {selectedReward.instituicaoNome}
                  </p>

                  <p
                    className="text-sm mb-6"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    {selectedReward.descricao}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <SketchBadge variant="gold" icon className="text-base sm:text-lg">
                      {selectedReward.custoMoedas} moedas
                    </SketchBadge>
                    <span
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "'Architects Daughter', cursive" }}
                    >
                      saldo apos resgate: {balance - selectedReward.custoMoedas}
                    </span>
                  </div>

                  {erroResgate && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-100 border-[2px] border-red-400 text-red-700 px-3 py-2 text-sm mb-4"
                      style={{
                        borderRadius: "6px 8px 5px 7px",
                        fontFamily: "'Architects Daughter', cursive",
                      }}
                    >
                      ! {erroResgate}
                    </motion.div>
                  )}

                  <div className="border-t-2 border-dashed border-gray-300 pt-4 flex flex-col sm:flex-row gap-3">
                    <SketchButton
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedReward(null)}
                      disabled={processandoResgate}
                    >
                      cancelar
                    </SketchButton>
                    <SketchButton
                      variant="primary"
                      className="flex-1"
                      onClick={handleResgatar}
                      disabled={processandoResgate}
                    >
                      {processandoResgate ? "processando..." : "resgatar vantagem"}
                    </SketchButton>
                  </div>
                </div>
              </SketchCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Cupom Gerado */}
      <AnimatePresence>
        {cupomGerado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setCupomGerado(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <SketchCard className="bg-[#F2D06B]/30">
                <div className="p-4 sm:p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <h3
                      className="text-xl sm:text-2xl mb-2"
                      style={{ fontFamily: "'Architects Daughter', cursive" }}
                    >
                      resgate confirmado!
                    </h3>
                  </motion.div>
                  <p
                    className="text-sm text-gray-700 mb-4"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    {cupomGerado.vantagemNome}
                  </p>

                  <p
                    className="text-xs text-gray-600 mb-2 italic"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    apresente este codigo no estabelecimento:
                  </p>

                  <motion.button
                    onClick={copiarCupom}
                    className="w-full text-2xl sm:text-3xl tracking-widest py-4 px-6 bg-white border-[2.5px] border-black mb-4 cursor-pointer hover:bg-[#FFF7DD] transition-colors flex items-center justify-center gap-3"
                    style={{
                      borderRadius: "8px 12px 6px 10px",
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 700,
                    }}
                    title="clique para copiar"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cupomGerado.codigoCupom}
                    <AnimatePresence mode="wait">
                      {copiedCupom ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check size={24} className="text-green-600" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy size={20} className="text-gray-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <p
                    className="text-xs text-gray-500 mb-4"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    -{cupomGerado.custoMoedas} moedas - saldo restante:{" "}
                    {cupomGerado.saldoRestante}
                  </p>

                  <SketchButton
                    variant="primary"
                    className="w-full"
                    onClick={() => setCupomGerado(null)}
                  >
                    fechar
                  </SketchButton>
                </div>
              </SketchCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

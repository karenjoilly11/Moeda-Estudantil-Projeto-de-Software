import { useEffect, useMemo, useState } from "react";
import { Bell, User, Search } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { motion, AnimatePresence } from "motion/react";
import { alunoService } from "../../services/alunoService";
import { transacaoService } from "../../services/transacaoService";
import type { Aluno, Transacao, Vantagem, ResgateResponse } from "../../types/api";


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
  if (n.includes("voucher") || n.includes("cantina") || n.includes("café")) return "☕";
  if (n.includes("camiseta")) return "👕";
  if (n.includes("curso") || n.includes("extens")) return "💻";
  return "🎁";
};

export function StudentDashboard({ aluno, onLogout, onSaldoUpdate }: StudentDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReward, setSelectedReward] = useState<Vantagem | null>(null);

  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [extrato, setExtrato] = useState<Transacao[]>([]);
  const [carregandoVantagens, setCarregandoVantagens] = useState(false);
  const [carregandoExtrato, setCarregandoExtrato] = useState(false);
  const [erroResgate, setErroResgate] = useState<string | null>(null);
  const [processandoResgate, setProcessandoResgate] = useState(false);
  const [cupomGerado, setCupomGerado] = useState<ResgateResponse | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (err: any) {
      setErroResgate(err?.message || "Erro ao resgatar");
    } finally {
      setProcessandoResgate(false);
    }
  };

  const copiarCupom = () => {
    if (cupomGerado?.codigoCupom) {
      navigator.clipboard?.writeText(cupomGerado.codigoCupom);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2E9]">
      {/* Header */}
      <header className="bg-white border-b-[2.5px] border-black p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-[#F2D06B] border-[2.5px] border-black rounded-full flex items-center justify-center"
              style={{ borderRadius: "50% 45% 48% 52%" }}
            >
              <span className="text-xl">💰</span>
            </div>
            <span
              className="text-xl"
              style={{ fontFamily: "'Architects Daughter', cursive" }}
            >
              Moeda Estudantil
            </span>
          </div>

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
                  <h1
                    className="text-3xl mb-2"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    Olá, {aluno.nome.split(" ")[0]} 👋
                  </h1>
                  <p
                    className="text-sm text-gray-600 italic"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    {aluno.curso} · {aluno.instituicaoNome}
                  </p>
                </div>
                <SketchBadge variant="gold" icon className="text-3xl px-6 py-3">
                  {balance}
                </SketchBadge>
              </div>
              <p
                className="text-xs text-gray-500 mt-3"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                seu saldo atual de moedas
              </p>
            </SketchCard>
          </motion.div>

          {/* Vitrine Section */}
          <div className="mb-4">
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: "'Architects Daughter', cursive" }}
            >
              vitrine de vantagens
            </h2>

            {/* Search */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
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

            {/* Rewards Grid */}
            {carregandoVantagens && (
              <p
                className="text-sm text-gray-500 italic"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
              >
                carregando vantagens...
              </p>
            )}

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
                    <SketchCard hoverable={!semSaldo} onClick={() => !semSaldo && setSelectedReward(reward)}>
                      <div
                        className="w-full h-32 bg-gradient-to-br from-[#F5F2E9] to-[#e8e3d4] border-[2px] border-black mb-3 flex items-center justify-center text-5xl"
                        style={{ borderRadius: "6px 8px 5px 7px" }}
                      >
                        {emojiVantagem(reward.nome)}
                      </div>

                      <h3
                        className="font-medium mb-1"
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
                    </SketchCard>
                  </motion.div>
                );
              })}
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
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: "'Architects Daughter', cursive" }}
            >
              extrato — linha do tempo
            </h2>

            <SketchCard className="p-6">
              {carregandoExtrato && (
                <p
                  className="text-sm text-gray-500 italic"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  carregando extrato...
                </p>
              )}

              {!carregandoExtrato && extrato.length === 0 && (
                <p
                  className="text-sm text-gray-500 italic text-center py-4"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  nenhuma transação registrada ainda
                </p>
              )}

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
                          className="text-xs text-gray-700 italic"
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
                              {" · cupom "}
                              <span className="font-mono">{trans.codigoCupom}</span>
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
            </SketchCard>
          </motion.div>
        </div>
      </div>

      {/* Modal de Confirmação de Resgate */}
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
                      <h3
                        className="text-xl mb-1"
                        style={{ fontFamily: "'Architects Daughter', cursive" }}
                      >
                        VANTAGEM
                      </h3>
                      <div className="text-3xl mb-3">{emojiVantagem(selectedReward.nome)}</div>
                    </div>
                    <button
                      onClick={() => !processandoResgate && setSelectedReward(null)}
                      className="text-2xl leading-none hover:rotate-90 transition-transform"
                    >
                      ×
                    </button>
                  </div>

                  <h2
                    className="text-2xl mb-2"
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

                  <div className="flex items-center gap-3 mb-4">
                    <SketchBadge variant="gold" icon className="text-lg">
                      {selectedReward.custoMoedas} moedas
                    </SketchBadge>
                    <span
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "'Architects Daughter', cursive" }}
                    >
                      saldo após resgate: {balance - selectedReward.custoMoedas}
                    </span>
                  </div>

                  {erroResgate && (
                    <div
                      className="bg-red-100 border-[2px] border-red-400 text-red-700 px-3 py-2 text-sm mb-4"
                      style={{
                        borderRadius: "6px 8px 5px 7px",
                        fontFamily: "'Architects Daughter', cursive",
                      }}
                    >
                      ⚠ {erroResgate}
                    </div>
                  )}

                  <div className="border-t-2 border-dashed border-gray-300 pt-4 flex gap-3">
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
                      {processandoResgate ? "processando..." : "resgatar vantagem →"}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <SketchCard className="bg-[#F2D06B]/30">
                <div className="p-6 text-center">
                  <h3
                    className="text-2xl mb-2"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    🎉 resgate confirmado!
                  </h3>
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
                    apresente este código no estabelecimento:
                  </p>

                  <button
                    onClick={copiarCupom}
                    className="w-full text-3xl tracking-widest py-4 px-6 bg-white border-[2.5px] border-black mb-4 cursor-pointer hover:bg-[#FFF7DD] transition-colors"
                    style={{
                      borderRadius: "8px 12px 6px 10px",
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 700,
                    }}
                    title="clique para copiar"
                  >
                    {cupomGerado.codigoCupom}
                  </button>

                  <p
                    className="text-xs text-gray-500 mb-4"
                    style={{ fontFamily: "'Architects Daughter', cursive" }}
                  >
                    -{cupomGerado.custoMoedas} moedas · saldo restante:{" "}
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

import { useState, useEffect, useCallback } from "react";
import { Search, Coins, RefreshCw } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { Sketch3DCardGlow } from "./Sketch3DCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { SketchListSkeleton } from "./SketchSkeleton";
import { Navbar } from "./Navbar";
import { motion } from "motion/react";
import { professorService } from "@/services/professorService";
import { useProfessor } from "@/contexts/AuthContext";
import { useConfetti } from "@/hooks/useConfetti";
import type { Professor, AlunoResumo, Transacao } from "@/types/api";

interface ProfessorDashboardProps {
  professor: Professor;
  onLogout: () => void;
}

export function ProfessorDashboard({ professor: initialProfessor, onLogout }: ProfessorDashboardProps) {
  const { updateProfessor } = useProfessor();
  const { fireGoldCoins, fireSuccess } = useConfetti();
  
  // Estado local do professor (pode ser atualizado apos envio de moedas)
  const [professor, setProfessor] = useState<Professor>(initialProfessor);
  
  // Estados de dados
  const [students, setStudents] = useState<AlunoResumo[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transacao[]>([]);
  
  // Estados de loading
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sendingCoins, setSendingCoins] = useState(false);
  
  // Estados do formulario
  const [selectedStudent, setSelectedStudent] = useState<AlunoResumo | null>(null);
  const [amount, setAmount] = useState<number>(20);
  const [reason, setReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const quickAmounts = [5, 10, 20, 30, 50];

  // Carregar historico de transacoes
  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const history = await professorService.listarHistorico(professor.id);
      setRecentTransactions(history.slice(0, 5)); // Ultimas 5
    } catch (err) {
      // Mantem dados vazios como fallback
      setRecentTransactions([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [professor.id]);

  // Buscar alunos
  const searchStudents = useCallback(async (query: string) => {
    if (!query.trim()) {
      setStudents([]);
      return;
    }
    
    setLoadingStudents(true);
    try {
      const results = await professorService.buscarAlunos(professor.id, query);
      setStudents(results);
    } catch (err) {
      // Fallback: dados mockados para demo
      setStudents([
        { id: 1, nome: "Marina Souza", email: "marina@puc.br", curso: "Eng. Computacao" },
        { id: 2, nome: "Marcos Rocha", email: "marcos@puc.br", curso: "Eng. Computacao" },
      ].filter(s => s.nome.toLowerCase().includes(query.toLowerCase())));
    } finally {
      setLoadingStudents(false);
    }
  }, [professor.id]);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      searchStudents(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchStudents]);

  // Carregar historico inicial
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Enviar moedas
  const handleSend = async () => {
    if (!selectedStudent || amount <= 0 || !reason.trim()) return;
    
    setError(null);
    setSuccessMessage(null);
    setSendingCoins(true);
    
    try {
      const response = await professorService.enviarMoedas({
        professorId: professor.id,
        alunoId: selectedStudent.id,
        quantidade: amount,
        mensagem: reason
      });
      
      // Atualizar saldo do professor
      const novoSaldo = response.saldoRestanteProfessor;
      const professorAtualizado = { ...professor, saldoMoedas: novoSaldo };
      setProfessor(professorAtualizado);
      updateProfessor(professorAtualizado);
      
      // Mostrar sucesso
      setSuccessMessage(`${amount} moedas enviadas para ${selectedStudent.nome.split(' ')[0]}!`);
      
      // Dispara confete
      fireGoldCoins();
      
      // Limpar formulario
      setSelectedStudent(null);
      setAmount(20);
      setReason("");
      setSearchQuery("");
      
      // Recarregar historico
      loadHistory();
      
      // Limpar mensagem de sucesso apos 3s
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err?.message || "Erro ao enviar moedas. Tente novamente.");
    } finally {
      setSendingCoins(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return `hoje - ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      if (diffDays === 1) return `ontem - ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2E9]">
      {/* Navbar Dinamica */}
      <Navbar 
        role="professor"
        userName={professor.nome}
        userEmail={professor.email}
        onLogout={onLogout}
      />

<<<<<<< HEAD
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
=======
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors" aria-label="Notificações">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors" aria-label="Perfil">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
>>>>>>> ac722f3751704692b90b6a120479b89ec52ae609
        {/* Greeting */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
            Ola, Prof. {professor.nome.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
            reconheca o esforco dos seus alunos com moedas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main - Nova Distribuicao */}
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl mb-4" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              nova distribuicao
            </h2>

            <Sketch3DCardGlow glowColor="#1A1A1A" intensity={0.5}>
              <div className="p-2 sm:p-4">
                {/* Balance Progress */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <span className="text-sm italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      saldo semestre - 2026.1
                    </span>
                    <SketchBadge variant="gold" icon>
                      {professor.saldoMoedas} disponiveis
                    </SketchBadge>
                  </div>

                  {/* Custom Progress Bar */}
                  <div className="w-full h-6 bg-[#F5F2E9] border-[2.5px] border-black relative overflow-hidden"
                       style={{ borderRadius: "6px 8px 5px 7px" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (professor.saldoMoedas / 1000) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-[#F2D06B]"
                    />
                  </div>
                </div>

                {/* Success message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 bg-green-100 border-[2px] border-green-400 text-green-700 px-4 py-3 text-sm"
                    style={{
                      borderRadius: "6px 8px 5px 7px",
                      fontFamily: "'Architects Daughter', cursive",
                    }}
                  >
                    {successMessage}
                  </motion.div>
                )}

                {/* Error message */}
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

                {/* Step 1: Para Quem */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg mb-3 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    1 - PARA QUEM?
                  </h3>

                  {selectedStudent ? (
                    <SketchCard className="p-4 bg-[#F2D06B]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-[2px] border-black rounded-full flex items-center justify-center"
                               style={{ borderRadius: "50% 45% 48% 52%", fontFamily: "'Architects Daughter', cursive" }}>
                            {selectedStudent.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {selectedStudent.nome}
                            </p>
                            <p className="text-xs text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {selectedStudent.curso}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedStudent(null)}
                          className="text-sm underline"
                          style={{ fontFamily: "'Architects Daughter', cursive" }}
                        >
                          trocar
                        </button>
                      </div>
                    </SketchCard>
                  ) : (
                    <div>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="digite nome ou email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
                          style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                        />
                      </div>

                      {loadingStudents && (
                        <div className="border-[2.5px] border-black bg-white p-4" style={{ borderRadius: "6px 8px 5px 7px" }}>
                          <SketchListSkeleton count={2} />
                        </div>
                      )}

                      {!loadingStudents && searchQuery && students.length > 0 && (
                        <div className="border-[2.5px] border-black bg-white"
                             style={{ borderRadius: "6px 8px 5px 7px" }}>
                          {students.map((student) => (
                            <button
                              key={student.id}
                              onClick={() => {
                                setSelectedStudent(student);
                                setSearchQuery("");
                              }}
                              className="w-full p-3 hover:bg-[#F5F2E9] text-left border-b border-gray-200 last:border-0 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F5F2E9] border-[2px] border-black rounded-full flex items-center justify-center flex-shrink-0"
                                     style={{ borderRadius: "50% 45% 48% 52%", fontFamily: "'Architects Daughter', cursive" }}>
                                  {student.nome.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                    {student.nome}
                                  </p>
                                  <p className="text-xs text-gray-600 truncate" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                    {student.email} - {student.curso}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {!loadingStudents && searchQuery && students.length === 0 && (
                        <p className="text-sm text-gray-500 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          nenhum aluno encontrado
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Step 2: Quantas Moedas */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg mb-3 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    2 - QUANTAS MOEDAS?
                  </h3>

                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <button
                      onClick={() => setAmount(Math.max(5, amount - 5))}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-[2.5px] border-black flex items-center justify-center hover:bg-[#F5F2E9] transition-colors"
                      style={{ borderRadius: "6px 8px 5px 7px" }}
                    >
                      <span className="text-xl sm:text-2xl leading-none">-</span>
                    </button>

                    <div className="flex-1 relative">
                      <Coins className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#F2D06B]" size={20} />
                      <input
                        type="number"
                        aria-label="quantidade de moedas"
                        value={amount}
                        onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full text-center text-2xl sm:text-3xl py-3 pl-10 sm:pl-12 pr-4 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
                        style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                      />
                    </div>

                    <button
                      onClick={() => setAmount(amount + 5)}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-[2.5px] border-black flex items-center justify-center hover:bg-[#F5F2E9] transition-colors"
                      style={{ borderRadius: "6px 8px 5px 7px" }}
                    >
                      <span className="text-xl sm:text-2xl leading-none">+</span>
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {quickAmounts.map(value => (
                      <button
                        key={value}
                        aria-label={`definir ${value} moedas`}
                        onClick={() => setAmount(value)}
                        className={`px-3 sm:px-4 py-2 border-[2.5px] border-black transition-all text-sm sm:text-base ${
                          amount === value
                            ? 'bg-[#1A1A1A] text-white'
                            : 'bg-white text-[#1A1A1A] hover:bg-[#F2D06B]'
                        }`}
                        style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Por Que */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg mb-3 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    3 - POR QUE? <span className="text-xs">(obrigatorio)</span>
                  </h3>

                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
<<<<<<< HEAD
                    placeholder="excelente apresentacao no seminario - clareza e dominio do tema!"
=======
                    aria-label="Motivo do envio"
                    placeholder="excelente apresentação no seminário — clareza e domínio do tema!"
>>>>>>> ac722f3751704692b90b6a120479b89ec52ae609
                    rows={3}
                    className="w-full px-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B] resize-none"
                    style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                  />
                </div>

                {/* Submit Button */}
                <SketchButton
                  variant="primary"
                  className="w-full text-base sm:text-lg py-4"
                  onClick={handleSend}
                  disabled={!selectedStudent || amount === 0 || !reason.trim() || sendingCoins || amount > professor.saldoMoedas}
                >
                  {sendingCoins ? "enviando..." : `enviar moedas para ${selectedStudent?.nome.split(' ')[0] || '...'}`}
                </SketchButton>

                {amount > professor.saldoMoedas && (
                  <p className="text-xs text-center text-red-500 mt-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    saldo insuficiente
                  </p>
                )}
              </div>
            </Sketch3DCardGlow>
          </div>

          {/* Sidebar - Historico */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  historico de envios
                </h2>
                <motion.button 
                  onClick={loadHistory}
                  className="p-2 hover:bg-[#F2D06B] rounded transition-colors border-[2px] border-transparent hover:border-black"
                  title="Atualizar"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <RefreshCw size={16} className={loadingHistory ? "animate-spin" : ""} />
                </motion.button>
              </div>

              <SketchCard className="p-4">
                {loadingHistory ? (
                  <SketchListSkeleton count={5} />
                ) : recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((trans, index) => (
                      <motion.div
                        key={trans.id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="pb-4 border-b border-gray-200 last:border-0"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            {trans.alunoNome || "Aluno"}
                          </p>
                          <SketchBadge variant="gold" className="text-xs px-2 py-0.5">
                            +{trans.valor}
                          </SketchBadge>
                        </div>
                        {trans.mensagem && (
                          <p className="text-xs text-gray-700 italic mb-1 line-clamp-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            &quot;{trans.mensagem}&quot;
                          </p>
                        )}
                        <p className="text-xs text-gray-500" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          {formatDate(trans.data)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic text-center py-4" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    nenhuma distribuicao ainda
                  </p>
                )}
              </SketchCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

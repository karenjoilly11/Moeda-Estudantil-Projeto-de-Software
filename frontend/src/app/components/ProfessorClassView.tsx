import { useState, useEffect } from "react";
import { Bell, User, Search } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { SketchEmptyState } from "./SketchEmptyState";
import { SketchListSkeleton } from "./SketchSkeleton";
import { SketchConfetti, SketchCoinRain, SketchToast } from "./SketchFeedback";
import { motion, AnimatePresence } from "motion/react";
import { professorService } from "@/services/professorService";
import type { Professor, AlunoResumo, EnvioMoedasResponse } from "@/types/api";

interface StudentWithStats extends AlunoResumo {
  received: number;
  lastReceived: string;
}

interface ProfessorClassViewProps {
  professor: Professor;
  onLogout?: () => void;
}

export function ProfessorClassView({ professor, onLogout }: ProfessorClassViewProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentWithStats | null>(null);
  const [quickSendAmount, setQuickSendAmount] = useState(20);
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [saldoProfessor, setSaldoProfessor] = useState(professor.saldoMoedas);
  
  // Feedback states
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCoinRain, setShowCoinRain] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  const filters = [
    { id: "todos", label: "todos" },
    { id: "recebeu-mes", label: "recebeu este mes" },
    { id: "nunca-recebeu", label: "nunca recebeu" }
  ];

  const quickAmounts = [5, 10, 20, 30, 50];

  useEffect(() => {
    loadStudents();
  }, [professor.id]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await professorService.listarAlunos(professor.id);
      // Adiciona dados de recebimento (viria de outro endpoint)
      const studentsWithStats: StudentWithStats[] = data.map((a) => ({
        ...a,
        received: Math.floor(Math.random() * 100),
        lastReceived: Math.random() > 0.3 ? `ha ${Math.floor(Math.random() * 30)} dias` : "-"
      }));
      setStudents(studentsWithStats);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarMoedas = async () => {
    if (!selectedStudent || quickSendAmount <= 0) return;
    
    setSending(true);
    try {
      const resp = await professorService.enviarMoedas({
        professorId: professor.id,
        alunoId: selectedStudent.id,
        quantidade: quickSendAmount,
        mensagem: message || "Reconhecimento pelo bom trabalho!"
      });
      
      setSaldoProfessor(resp.saldoRestanteProfessor);
      setShowCoinRain(true);
      setTimeout(() => setShowConfetti(true), 500);
      setToast({ show: true, message: `${quickSendAmount} moedas enviadas para ${selectedStudent.nome}!`, type: "success" });
      
      // Atualiza o aluno na lista
      setStudents(prev => prev.map(s => 
        s.id === selectedStudent.id 
          ? { ...s, received: s.received + quickSendAmount, lastReceived: "agora" }
          : s
      ));
      
      setSelectedStudent(null);
      setMessage("");
    } catch (error: any) {
      setToast({ show: true, message: error?.message || "Erro ao enviar moedas", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = !searchQuery || 
      s.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === "recebeu-mes") return matchesSearch && s.received > 0;
    if (selectedFilter === "nunca-recebeu") return matchesSearch && s.received === 0;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F2E9]">
      {/* Feedback components */}
      <SketchCoinRain active={showCoinRain} onComplete={() => setShowCoinRain(false)} />
      <SketchConfetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <SketchToast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />

      {/* Header */}
      <header className="bg-white border-b-[2.5px] border-black p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 bg-[#F2D06B] border-[2.5px] border-black rounded-full flex items-center justify-center"
              style={{ borderRadius: "50% 45% 48% 52%" }}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <span className="text-xl">$</span>
            </motion.div>
            <span className="text-xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              Moeda Estudantil - <span className="text-sm italic">professor</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors">
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

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main - Class List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="mb-6">
                <h1 className="text-3xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  turma - {professor.departamento} <SketchBadge variant="white" className="ml-2 text-sm">{students.length} alunos</SketchBadge>
                </h1>
                <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  envio rapido por aluno - clique em qualquer linha para distribuir
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex gap-3 mb-4 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="buscar aluno..."
                    className="w-full pl-10 pr-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
                    style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {filters.map(filter => (
                    <motion.button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`px-4 py-3 border-[2.5px] border-black whitespace-nowrap transition-all ${
                        selectedFilter === filter.id
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-white text-[#1A1A1A] hover:bg-[#F2D06B]'
                      }`}
                      style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
                      whileHover={{ scale: 1.02, rotateZ: 0.5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {filter.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Students Table */}
              <SketchCard>
                {loading ? (
                  <div className="p-4">
                    <SketchListSkeleton count={6} />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <SketchEmptyState 
                    variant={searchQuery ? "search" : "students"}
                    title={searchQuery ? "nenhum aluno encontrado" : undefined}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-[2.5px] border-black">
                          <th className="text-left p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            ALUNO
                          </th>
                          <th className="text-left p-4 text-sm uppercase hidden md:table-cell" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            CURSO
                          </th>
                          <th className="text-center p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            RECEBIDO
                          </th>
                          <th className="text-center p-4 text-sm uppercase hidden sm:table-cell" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            ULTIMO
                          </th>
                          <th className="text-center p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            ACAO
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student, index) => (
                          <motion.tr
                            key={student.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`border-b border-gray-200 last:border-0 transition-colors cursor-pointer ${
                              selectedStudent?.id === student.id ? 'bg-[#F2D06B]/20' : 'hover:bg-[#F5F2E9]'
                            }`}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <motion.div 
                                  className="w-10 h-10 bg-white border-[2px] border-black rounded-full flex items-center justify-center"
                                  style={{ borderRadius: "50% 45% 48% 52%", fontFamily: "'Architects Daughter', cursive" }}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                  {student.nome.charAt(0)}
                                </motion.div>
                                <div>
                                  <span className="font-medium block" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                    {student.nome}
                                  </span>
                                  <span className="text-xs text-gray-500 md:hidden">{student.curso}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <span className="text-sm text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                {student.curso}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <SketchBadge variant="gold" className="inline-flex text-sm">
                                $ {student.received}
                              </SketchBadge>
                            </td>
                            <td className="p-4 text-center hidden sm:table-cell">
                              <span className="text-sm text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                {student.lastReceived}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <SketchButton
                                variant="outline"
                                className="text-xs px-3 py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudent(student);
                                }}
                              >
                                + moedas
                              </SketchButton>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SketchCard>
            </motion.div>
          </div>

          {/* Sidebar - Quick Send */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SketchCard className="sticky top-6">
                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-xs text-gray-600 italic mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      saldo semestre - 2026.1
                    </p>
                    <SketchBadge variant="gold" icon className="text-2xl px-4 py-2">
                      {saldoProfessor} / 1000 disponivel
                    </SketchBadge>
                    <div className="w-full h-4 bg-[#F5F2E9] border-[2px] border-black mt-3 relative overflow-hidden"
                         style={{ borderRadius: "6px 8px 5px 7px" }}>
                      <motion.div
                        className="h-full bg-[#1A1A1A]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((1000 - saldoProfessor) / 1000) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      ja distribuiu {1000 - saldoProfessor} moedas
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedStudent ? (
                      <motion.div
                        key="selected"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <h3 className="text-lg uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          ENVIO RAPIDO
                        </h3>

                        <div className="p-4 bg-[#F5F2E9] border-[2px] border-black"
                             style={{ borderRadius: "6px 8px 5px 7px" }}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-white border-[2px] border-black rounded-full flex items-center justify-center"
                                 style={{ borderRadius: "50% 45% 48% 52%", fontFamily: "'Architects Daughter', cursive" }}>
                              {selectedStudent.nome.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                {selectedStudent.nome}
                              </p>
                              <p className="text-xs text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                {selectedStudent.curso}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {quickAmounts.map(amount => (
                            <motion.button
                              key={amount}
                              onClick={() => setQuickSendAmount(amount)}
                              className={`px-4 py-2 border-[2.5px] border-black transition-all ${
                                quickSendAmount === amount
                                  ? 'bg-[#1A1A1A] text-white'
                                  : 'bg-white text-[#1A1A1A] hover:bg-[#F2D06B]'
                              }`}
                              style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
                              whileHover={{ scale: 1.05, rotateZ: 1 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={amount > saldoProfessor}
                            >
                              $ {amount}
                            </motion.button>
                          ))}
                        </div>

                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="ajudou colegas no laboratorio!"
                          rows={3}
                          className="w-full px-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B] resize-none"
                          style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                        />

                        <SketchButton 
                          variant="primary" 
                          className="w-full"
                          onClick={handleEnviarMoedas}
                          disabled={sending || quickSendAmount > saldoProfessor}
                        >
                          {sending ? "enviando..." : `enviar ${quickSendAmount} moedas`}
                        </SketchButton>

                        <button
                          onClick={() => setSelectedStudent(null)}
                          className="text-sm text-center w-full underline"
                          style={{ fontFamily: "'Architects Daughter', cursive" }}
                        >
                          cancelar
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-8"
                      >
                        <SketchEmptyState 
                          variant="coins"
                          title="selecione um aluno"
                          description="clique na tabela para enviar moedas"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SketchCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

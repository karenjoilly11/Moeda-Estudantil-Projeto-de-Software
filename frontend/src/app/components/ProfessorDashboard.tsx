import { useState } from "react";
import { Bell, User, Search, Coins, ArrowRight } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { SketchInput } from "./SketchInput";
import { motion } from "motion/react";

interface ProfessorDashboardProps {
  professorName: string;
}

export function ProfessorDashboard({ professorName }: ProfessorDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [amount, setAmount] = useState<number>(20);
  const [reason, setReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const semesterBalance = 685;
  const distributed = 315;
  const remaining = semesterBalance - distributed;

  const students = [
    { id: 1, name: "Marina Souza", enrollment: "2024.1234", course: "engenharia da computação - 6º", avatar: "M" },
    { id: 2, name: "Marcos Rocha", enrollment: "2023.6789", course: "eng. comp.", avatar: "M" },
    { id: 3, name: "Maria Santos", enrollment: "2024.9801", course: "eng. comp.", avatar: "M" }
  ];

  const recentTransactions = [
    { id: 1, student: "Marina Souza", amount: 20, date: "2024.1234", reason: "excelente apresentação no seminário", time: "hoje - 14:23" },
    { id: 2, student: "Bruno Lima", amount: 15, date: "2023.8921", reason: "ajudou colegas na laboratório", time: "hoje - 11:05" },
    { id: 3, student: "Carla Ruz", amount: 30, date: "2024.4967", reason: "solução única entrega de prazo", time: "ontem - 16:45" },
    { id: 4, student: "Diego Alves", amount: 10, date: "2022.9123", reason: "perguntas perspicazes em aula", time: "23/abr - 10:11" },
    { id: 5, student: "Eva Pinto", amount: 25, date: "2024.7712", reason: "liderança trabalho em grupo", time: "20/abr - 15:22" }
  ];

  const quickAmounts = [5, 10, 20, 30, 50];

  const filteredStudents = searchQuery
    ? students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.enrollment.includes(searchQuery))
    : students;

  const handleSend = () => {
    if (selectedStudent && amount > 0 && reason.trim()) {
      alert(`Enviando ${amount} moedas para ${selectedStudent.name}!`);
      setSelectedStudent(null);
      setAmount(20);
      setReason("");
      setSearchQuery("");
    }
  };

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
              Moeda Estudantil · <span className="text-sm italic">professor</span>
            </span>
          </div>

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
        {/* Greeting */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-3xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
            Olá, Prof. {professorName} 👋
          </h1>
          <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
            reconheça o esforço dos seus alunos com moedas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main - Nova Distribuição */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              nova distribuição
            </h2>
            <p className="text-xs text-red-500 mb-4 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              uma tarefa, um foco
            </p>

            <SketchCard>
              <div className="p-6">
                {/* Balance Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      saldo semestre · 2026.1
                    </span>
                    <SketchBadge variant="gold" icon>
                      {remaining} / {semesterBalance} disponível
                    </SketchBadge>
                  </div>

                  {/* Custom Progress Bar */}
                  <div className="w-full h-6 bg-[#F5F2E9] border-[2.5px] border-black relative overflow-hidden"
                       style={{ borderRadius: "6px 8px 5px 7px" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(distributed / semesterBalance) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-[#1A1A1A]"
                    />
                  </div>

                  <p className="text-xs text-gray-600 mt-2 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    já distribuiu {distributed} moedas · acaba dia 31/jul
                  </p>
                </div>

                {/* Step 1: Para Quem */}
                <div className="mb-6">
                  <h3 className="text-lg mb-3 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    1 · PARA QUEM?
                  </h3>

                  {selectedStudent ? (
                    <SketchCard className="p-4 bg-[#F2D06B]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white border-[2px] border-black rounded-full flex items-center justify-center"
                               style={{ borderRadius: "50% 45% 48% 52%", fontFamily: "'Architects Daughter', cursive" }}>
                            {selectedStudent.avatar}
                          </div>
                          <div>
                            <p className="font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {selectedStudent.name}
                            </p>
                            <p className="text-xs text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {selectedStudent.enrollment} · {selectedStudent.course}
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
                          placeholder="🔍 digite nome ou matrícula..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
                          style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                        />
                      </div>

                      {searchQuery && (
                        <div className="border-[2.5px] border-black bg-white"
                             style={{ borderRadius: "6px 8px 5px 7px" }}>
                          {filteredStudents.map((student) => (
                            <button
                              key={student.id}
                              onClick={() => setSelectedStudent(student)}
                              className="w-full p-3 hover:bg-[#F5F2E9] text-left border-b border-gray-200 last:border-0 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F5F2E9] border-[2px] border-black rounded-full flex items-center justify-center flex-shrink-0"
                                     style={{ borderRadius: "50% 45% 48% 52%", fontFamily: "'Architects Daughter', cursive" }}>
                                  {student.avatar}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                    {student.name}
                                  </p>
                                  <p className="text-xs text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                    {student.enrollment} · {student.course}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Step 2: Quantas Moedas */}
                <div className="mb-6">
                  <h3 className="text-lg mb-3 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    2 · QUANTAS MOEDAS?
                  </h3>

                  {/* Amount Input with +/- */}
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => setAmount(Math.max(5, amount - 5))}
                      className="w-12 h-12 bg-white border-[2.5px] border-black flex items-center justify-center hover:bg-[#F5F2E9] transition-colors"
                      style={{ borderRadius: "6px 8px 5px 7px" }}
                    >
                      <span className="text-2xl leading-none">−</span>
                    </button>

                    <div className="flex-1 relative">
                      <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F2D06B]" size={24} />
                      <input
                        type="number"
                        aria-label="quantidade de moedas"
                        value={amount}
                        onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full text-center text-3xl py-3 pl-12 pr-4 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
                        style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                      />
                    </div>

                    <button
                      onClick={() => setAmount(amount + 5)}
                      className="w-12 h-12 bg-white border-[2.5px] border-black flex items-center justify-center hover:bg-[#F5F2E9] transition-colors"
                      style={{ borderRadius: "6px 8px 5px 7px" }}
                    >
                      <span className="text-2xl leading-none">+</span>
                    </button>
                  </div>

                  {/* Quick Amounts */}
                  <div className="flex gap-2 flex-wrap">
                    {quickAmounts.map(value => (
                      <button
                        key={value}
                        aria-label={`definir ${value} moedas`}
                        onClick={() => setAmount(value)}
                        className={`px-4 py-2 border-[2.5px] border-black transition-all ${
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

                {/* Step 3: Por Quê */}
                <div className="mb-6">
                  <h3 className="text-lg mb-3 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                    3 · POR QUÊ? <span className="text-xs">(obrigatório)</span>
                  </h3>

                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    aria-label="Motivo do envio"
                    placeholder="excelente apresentação no seminário — clareza e domínio do tema!"
                    rows={3}
                    className="w-full px-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B] resize-none"
                    style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                  />
                </div>

                {/* Submit Button */}
                <SketchButton
                  variant="primary"
                  className="w-full text-lg py-4"
                  onClick={handleSend}
                  disabled={!selectedStudent || amount === 0 || !reason.trim()}
                >
                  enviar moedas para {selectedStudent?.name.split(' ')[0] || '...'} →
                </SketchButton>

                <p className="text-xs text-center text-gray-500 mt-3" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  vão sobrar {selectedStudent ? remaining - amount : remaining} moedas
                </p>
              </div>
            </SketchCard>
          </div>

          {/* Sidebar - Histórico */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl mb-4" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                histórico de envios
              </h2>
              <p className="text-xs text-gray-500 mb-4 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                ver todas
              </p>

              <SketchCard className="p-4">
                <div className="space-y-4">
                  {recentTransactions.map((trans, index) => (
                    <motion.div
                      key={trans.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="pb-4 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          {trans.student}
                        </p>
                        <SketchBadge variant="gold" className="text-xs px-2 py-0.5">
                          +{trans.amount}
                        </SketchBadge>
                      </div>
                      <p className="text-xs text-gray-700 italic mb-1" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        "{trans.reason}"
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        {trans.date} · {trans.time}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <button className="w-full mt-4 text-center text-sm underline"
                        style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  ver últimas distribuições (5)
                </button>
              </SketchCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

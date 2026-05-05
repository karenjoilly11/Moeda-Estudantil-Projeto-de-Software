import { useState } from "react";
import { Bell, User, Search, Coins } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { motion } from "motion/react";

export function ProfessorClassView() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [quickSendAmount, setQuickSendAmount] = useState(20);
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const filters = [
    { id: "todos", label: "todos" },
    { id: "recebeu-mes", label: "recebeu este mês" },
    { id: "nunca-recebeu", label: "nunca recebeu" }
  ];

  const students = [
    { id: 1, name: "Ana Beatriz Silva", enrollment: "2024.1190", received: 35, lastReceived: "há 5 dias", action: "5 moedas" },
    { id: 2, name: "Bruno Lima", enrollment: "2023.8821", received: 95, lastReceived: "hoje", action: "enviando..." },
    { id: 3, name: "Carla Reis", enrollment: "2024.4467", received: 30, lastReceived: "ontem", action: "+ moedas" },
    { id: 4, name: "Diego Alves", enrollment: "2022.9123", received: 10, lastReceived: "23/abr", action: "+ moedas" },
    { id: 5, name: "Eva Pinto", enrollment: "2024.7712", received: 25, lastReceived: "20/abr", action: "+ moedas" },
    { id: 6, name: "Fábio Mendes", enrollment: "2023.3384", received: 0, lastReceived: "-", action: "+ moedas" },
    { id: 7, name: "Gabriela Tavares", enrollment: "2024.5589", received: 40, lastReceived: "15/abr", action: "+ moedas" },
    { id: 8, name: "Henrique Dias", enrollment: "2022.4477", received: 0, lastReceived: "-", action: "+ moedas" }
  ];

  const semesterBalance = 685;
  const quickAmounts = [5, 10, 20, 30, 50];

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
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-[#F5F2E9] rounded-full transition-colors">
              <User size={20} />
            </button>
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
                  turma · ENG-COMP-2026.1 <SketchBadge variant="white" className="ml-2 text-sm">32 alunos</SketchBadge>
                </h1>
                <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  envio rápido por aluno · clique em qualquer linha para distribuir
                </p>
                <p className="text-xs text-red-500 mt-1 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  de turma · envio inline →
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="🔍 buscar aluno..."
                    className="w-full pl-10 pr-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B]"
                    style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                  />
                </div>

                <div className="flex gap-2">
                  {filters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`px-4 py-3 border-[2.5px] border-black whitespace-nowrap transition-all ${
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

              {/* Students Table */}
              <SketchCard>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-[2.5px] border-black">
                        <th className="text-left p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          ALUNO
                        </th>
                        <th className="text-left p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          MATRÍCULA
                        </th>
                        <th className="text-center p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          RECEBIDO
                        </th>
                        <th className="text-center p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          ÚLTIMO
                        </th>
                        <th className="text-center p-4 text-sm uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          AÇÃO
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <motion.tr
                          key={student.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-200 last:border-0 hover:bg-[#F5F2E9] transition-colors cursor-pointer"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white border-[2px] border-black rounded-full flex items-center justify-center"
                                   style={{ borderRadius: "50% 45% 48% 52%", fontFamily: "'Architects Daughter', cursive" }}>
                                {student.name.charAt(0)}
                              </div>
                              <span className="font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                                {student.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {student.enrollment}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <SketchBadge variant="gold" className="inline-flex text-sm">
                              💰 {student.received}
                            </SketchBadge>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-sm text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {student.lastReceived}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(student);
                              }}
                              className={`px-4 py-2 border-[2.5px] border-black transition-all ${
                                student.action === 'enviando...'
                                  ? 'bg-[#1A1A1A] text-white'
                                  : 'bg-white text-[#1A1A1A] hover:bg-[#F2D06B]'
                              }`}
                              style={{ borderRadius: "20px 22px 18px 21px", fontFamily: "'Architects Daughter', cursive" }}
                            >
                              {student.action}
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
                      saldo semestre · 2026.1
                    </p>
                    <SketchBadge variant="gold" icon className="text-2xl px-4 py-2">
                      {semesterBalance} / 1000 disponível
                    </SketchBadge>
                    <div className="w-full h-4 bg-[#F5F2E9] border-[2px] border-black mt-3 relative overflow-hidden"
                         style={{ borderRadius: "6px 8px 5px 7px" }}>
                      <div
                        className="h-full bg-[#1A1A1A]"
                        style={{ width: `${(315 / 1000) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      já distribuiu 315 moedas · acaba dia 31/jul
                    </p>
                  </div>

                  {selectedStudent ? (
                    <div className="space-y-4">
                      <h3 className="text-lg uppercase" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        ENVIO RÁPIDO
                      </h3>

                      <div className="p-4 bg-[#F5F2E9] border-[2px] border-black"
                           style={{ borderRadius: "6px 8px 5px 7px" }}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-white border-[2px] border-black rounded-full flex items-center justify-center"
                               style={{ borderRadius: "50% 45% 48% 52%", fontFamily: "'Architects Daughter', cursive" }}>
                            {selectedStudent.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {selectedStudent.name}
                            </p>
                            <p className="text-xs text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {selectedStudent.enrollment}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {quickAmounts.map(amount => (
                          <button
                            key={amount}
                            onClick={() => setQuickSendAmount(amount)}
                            className={`px-4 py-2 border-[2.5px] border-black transition-all ${
                              quickSendAmount === amount
                                ? 'bg-[#1A1A1A] text-white'
                                : 'bg-white text-[#1A1A1A] hover:bg-[#F2D06B]'
                            }`}
                            style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
                          >
                            💰 {amount}
                          </button>
                        ))}
                      </div>

                      <textarea
                        placeholder="ajudou colegas no laboratório!"
                        rows={3}
                        className="w-full px-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B] resize-none"
                        style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                      />

                      <SketchButton variant="primary" className="w-full">
                        enviar →
                      </SketchButton>

                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="text-sm text-center w-full underline"
                        style={{ fontFamily: "'Architects Daughter', cursive" }}
                      >
                        ver histórico completo
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        Selecione um aluno<br />para envio rápido
                      </p>
                    </div>
                  )}
                </div>
              </SketchCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

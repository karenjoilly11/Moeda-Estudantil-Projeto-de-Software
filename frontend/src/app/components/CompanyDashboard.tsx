import { useState } from "react";
import { Package, Plus } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchInput } from "./SketchInput";
import { Sidebar } from "./Sidebar";
import { CouponValidation } from "./CouponValidation";
import { RewardsTableView } from "./RewardsTableView";
import { motion, AnimatePresence } from "motion/react";

interface CompanyDashboardProps {
  companyName: string;
}

export function CompanyDashboard({ companyName }: CompanyDashboardProps) {
  const [activeView, setActiveView] = useState("minhas-vantagens");
  const [showNewRewardForm, setShowNewRewardForm] = useState(false);
  const [newReward, setNewReward] = useState({
    title: "",
    description: "",
    cost: "",
    stock: "",
    category: "comida"
  });

  const categories = [
    { id: "comida", label: "Comida" },
    { id: "livros", label: "Livros" },
    { id: "cursos", label: "Cursos" },
    { id: "lazer", label: "Lazer" },
    { id: "todos", label: "Outros" }
  ];

  const handleCreateReward = () => {
    if (newReward.title && newReward.cost && newReward.stock) {
      alert(`Vantagem "${newReward.title}" criada com sucesso!`);
      setShowNewRewardForm(false);
      setNewReward({ title: "", description: "", cost: "", stock: "", category: "comida" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2E9] flex">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content Area */}
      <div className="flex-1">
        {activeView === "validacao" && <CouponValidation />}

        {activeView === "minhas-vantagens" && (
          <RewardsTableView onNewReward={() => setShowNewRewardForm(true)} />
        )}

        {activeView === "relatorios" && (
          <div className="p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h1 className="text-3xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                relatórios
              </h1>
              <p className="text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                Análise de performance, tendências e insights sobre suas vantagens.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <SketchCard>
                  <div className="p-6">
                    <h3 className="text-lg mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      📊 Vantagens mais populares
                    </h3>
                    <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      Em breve...
                    </p>
                  </div>
                </SketchCard>

                <SketchCard>
                  <div className="p-6">
                    <h3 className="text-lg mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      📈 Crescimento mensal
                    </h3>
                    <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      Em breve...
                    </p>
                  </div>
                </SketchCard>
              </div>
            </motion.div>
          </div>
        )}

        {activeView === "conta" && (
          <div className="p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h1 className="text-3xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                conta
              </h1>
              <p className="text-gray-600 italic mb-6" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                Gerencie as informações da sua empresa
              </p>

              <SketchCard className="max-w-2xl">
                <div className="p-6 space-y-4">
                  <SketchInput
                    label="Nome da empresa"
                    value={companyName}
                    readOnly
                  />
                  <SketchInput
                    label="CNPJ"
                    value="12.345.678/0001-90"
                    readOnly
                  />
                  <SketchInput
                    label="E-mail de contato"
                    type="email"
                    placeholder="contato@empresa.com"
                  />
                  <SketchInput
                    label="Telefone"
                    placeholder="(31) 99999-9999"
                  />
                </div>
              </SketchCard>
            </motion.div>
          </div>
        )}
      </div>

      {/* Modal - Nova Vantagem */}
      <AnimatePresence>
        {showNewRewardForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewRewardForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <SketchCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      Nova Vantagem
                    </h2>
                    <button
                      onClick={() => setShowNewRewardForm(false)}
                      className="text-2xl leading-none hover:rotate-90 transition-transform"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Title */}
                    <SketchInput
                      label="Título da vantagem"
                      placeholder="Ex: Vale-livro R$50"
                      value={newReward.title}
                      onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                    />

                    {/* Description */}
                    <div>
                      <label className="text-sm italic mb-2 block" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        Descrição
                      </label>
                      <textarea
                        placeholder="Descreva os detalhes da vantagem..."
                        value={newReward.description}
                        onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B] resize-none"
                        style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-sm italic mb-2 block" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        Categoria
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setNewReward({ ...newReward, category: cat.id })}
                            className={`px-4 py-2 border-[2.5px] border-black transition-all ${
                              newReward.category === cat.id
                                ? 'bg-[#1A1A1A] text-white'
                                : 'bg-white text-[#1A1A1A] hover:bg-[#F2D06B]'
                            }`}
                            style={{ borderRadius: "6px 8px 5px 7px", fontFamily: "'Architects Daughter', cursive" }}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Cost */}
                      <SketchInput
                        label="Custo (moedas)"
                        type="number"
                        placeholder="50"
                        value={newReward.cost}
                        onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
                      />

                      {/* Stock */}
                      <SketchInput
                        label="Estoque"
                        type="number"
                        placeholder="10"
                        value={newReward.stock}
                        onChange={(e) => setNewReward({ ...newReward, stock: e.target.value })}
                      />
                    </div>

                    {/* Image Upload Placeholder */}
                    <div>
                      <label className="text-sm italic mb-2 block" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        Imagem da vantagem
                      </label>
                      <div className="w-full h-40 bg-gradient-to-br from-[#F5F2E9] to-[#e8e3d4] border-[2.5px] border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors"
                           style={{ borderRadius: "8px 12px 6px 10px" }}>
                        <Package size={40} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          Clique para fazer upload
                        </p>
                        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                          (PNG, JPG até 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-dashed border-gray-300 mt-6 pt-6 flex gap-3">
                    <SketchButton
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowNewRewardForm(false)}
                    >
                      Cancelar
                    </SketchButton>
                    <SketchButton
                      variant="primary"
                      className="flex-1"
                      onClick={handleCreateReward}
                    >
                      Criar Vantagem →
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

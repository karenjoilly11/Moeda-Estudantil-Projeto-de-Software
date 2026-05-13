import { useState } from "react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchInput } from "./SketchInput";
import { Sidebar } from "./Sidebar";
import { CouponValidation } from "./CouponValidation";
import { RewardsTableView } from "./RewardsTableView";
import { EmpresaCupons } from "./EmpresaCupons";
import { motion, AnimatePresence } from "motion/react";
import { useConfetti } from "@/hooks/useConfetti";
import { empresaService } from "@/services/empresaService";
import { ApiError } from "@/lib/api";
import type { Empresa } from "@/types/api";

interface CompanyDashboardProps {
  empresa: Empresa;
  onLogout: () => void;
}

export function CompanyDashboard({ empresa, onLogout }: CompanyDashboardProps) {

  const [empresaData, setEmpresaData] = useState(empresa);
  const [activeView, setActiveView] = useState("minhas-vantagens");
  const [showNewRewardForm, setShowNewRewardForm] = useState(false);

  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    nome: empresaData.nome,
    email: empresaData.email,
    telefone: empresaData.telefone || "",
    endereco: empresaData.endereco || "",
    descricao: empresaData.descricao || "",
  });

  const [newReward, setNewReward] = useState({
    title: "",
    description: "",
    cost: "",
    stock: "",
    category: "comida",
    imageUrl: "",
  });
  const [reloadKey, setReloadKey] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { fireSuccess } = useConfetti();

  const categories = [
    { id: "comida", label: "Comida" },
    { id: "livros", label: "Livros" },
    { id: "cursos", label: "Cursos" },
    { id: "lazer", label: "Lazer" },
    { id: "outros", label: "Outros" },
  ];

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);
    setSalvando(true);

    try {
      await empresaService.atualizarPerfil(empresaData.id, {
        nome: editForm.nome,
        email: editForm.email,
        telefone: editForm.telefone,
        endereco: editForm.endereco,
        descricao: editForm.descricao,
      });
      
      const empresaAtualizada = { ...empresaData, ...editForm };

localStorage.setItem(
  "empresa_data",
  JSON.stringify(empresaAtualizada)
);

setEditSuccess("Perfil atualizado com sucesso!");

setEmpresaData(empresaAtualizada);

setTimeout(() => {
  setEditando(false);
}, 1500);
    } catch (err: any) {
      setEditError(err?.message || "Erro ao atualizar perfil");
    } finally {
      setSalvando(false);
    }
  };

  // Função para excluir conta
  const handleExcluirConta = async () => {
    const confirmacao = window.confirm(
      "⚠️ ATENÇÃO! ⚠️\n\n" +
      "Você está prestes a EXCLUIR PERMANENTEMENTE sua conta.\n\n" +
      "Isso irá:\n" +
      "• Remover todos os seus dados\n" +
      "• Remover todas as vantagens cadastradas\n" +
      "• Remover histórico de cupons\n" +
      "• Não será possível recuperar\n\n" +
      "Digite 'EXCLUIR' para confirmar:"
    );
    
    if (!confirmacao) return;
    
    const textoConfirmacao = window.prompt(
      "Digite 'EXCLUIR MINHA CONTA' para confirmar a exclusão permanente:"
    );
    
    if (textoConfirmacao !== "EXCLUIR MINHA CONTA") {
      alert("Confirmação incorreta. A exclusão foi cancelada.");
      return;
    }
    
    setSalvando(true);
    
    try {
      await empresaService.excluirConta(empresaData.id);
      
      localStorage.clear();
      alert("✅ Conta excluída com sucesso!");
      
      window.location.href = "/login";
    } catch (err: any) {
      console.error("Erro ao excluir conta:", err);
      alert("❌ Erro ao excluir conta: " + (err.response?.data || err.message));
    } finally {
      setSalvando(false);
    }
  };


  const handleCreateReward = async () => {
    setFormError(null);

    if (!newReward.title.trim()) {
      setFormError("Título da vantagem é obrigatório");
      return;
    }
    const custoNum = parseFloat(newReward.cost);
    if (!newReward.cost || isNaN(custoNum) || custoNum <= 0) {
      setFormError("Custo deve ser um número maior que zero");
      return;
    }

    setSubmitting(true);
    try {
      await empresaService.criarVantagem({
        nome: newReward.title,
        descricao: newReward.description || newReward.title,
        foto: newReward.imageUrl || "",
        custoMoedas: custoNum,
        estoque: newReward.stock ? parseInt(newReward.stock, 10) : undefined,
        categoria: newReward.category,
        empresaId: empresaData.id,
      });
      fireSuccess();
      setShowNewRewardForm(false);
      setNewReward({ title: "", description: "", cost: "", stock: "", category: "comida", imageUrl: "" });
      setReloadKey((k) => k + 1);
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(typeof err.body === "string" ? err.body : "Erro ao criar vantagem");
      } else {
        setFormError("Erro ao criar vantagem. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2E9] flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onLogout={onLogout}
        empresaNome={empresaData.nome}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {activeView === "validacao" && <CouponValidation />}

        {activeView === "minhas-vantagens" && (
          <RewardsTableView
            empresaId={empresaData.id}
            onNewReward={() => setShowNewRewardForm(true)}
            reloadKey={reloadKey}
            onChanged={() => setReloadKey((k) => k + 1)}
          />
        )}

        {activeView === "cupons" && <EmpresaCupons empresaId={empresaData.id} />}

        {activeView === "relatorios" && (
          <div className="p-4 sm:p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h1 className="text-2xl sm:text-3xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                relatorios
              </h1>
              <p className="text-gray-600 italic text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                Analise de performance, tendencias e insights sobre suas vantagens.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <SketchCard>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      Vantagens mais populares
                    </h3>
                    <p className="text-sm text-gray-600 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      Em breve...
                    </p>
                  </div>
                </SketchCard>

                <SketchCard>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      Crescimento mensal
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
  <div className="p-4 sm:p-6">
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl sm:text-3xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          conta
        </h1>
        <button
          onClick={() => setEditando(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F2D06B] hover:bg-[#e8c84a] border-2 border-black rounded-lg transition-all"
          style={{ fontFamily: "'Architects Daughter', cursive" }}
        >
          Editar Perfil
        </button>
      </div>
      <p className="text-gray-600 italic mb-6 text-sm" style={{ fontFamily: "'Architects Daughter', cursive" }}>
        Gerencie as informacoes da sua empresa
      </p>

      <SketchCard className="max-w-2xl">
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Nome da empresa</p>
              <p className="font-medium">{empresaData.nome}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <p className="text-xs text-gray-500">CNPJ</p>
              <p className="font-medium">{empresaData.cnpj || "Não informado"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <p className="text-xs text-gray-500">E-mail</p>
              <p className="font-medium">{empresaData.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="font-medium">{empresaData.telefone || "Não informado"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Endereço</p>
              <p className="font-medium">{empresaData.endereco || "Não informado"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Descrição</p>
              <p className="font-medium">{empresaData.descricao || "Não informada"}</p>
            </div>
          </div>
        </div>
      </SketchCard>
    </motion.div>
  </div>
)}
      </div>

{/* Modal de Edição de Perfil */}
<AnimatePresence>
  {editando && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={() => !salvando && setEditando(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <SketchCard>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                Editar Perfil
              </h2>
              <button
                onClick={() => setEditando(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-3 py-2 text-sm rounded-lg mb-4">
                ⚠ {editError}
              </div>
            )}

            {editSuccess && (
              <div className="bg-green-100 border-2 border-green-400 text-green-700 px-3 py-2 text-sm rounded-lg mb-4">
                ✅ {editSuccess}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <SketchInput
                label="Nome da empresa"
                value={editForm.nome}
                onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                required
              />
              <SketchInput
                label="E-mail"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
              <SketchInput
                label="Telefone"
                value={editForm.telefone}
                onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })}
                placeholder="(31) 99999-9999"
              />
              <SketchInput
                label="Endereço"
                value={editForm.endereco}
                onChange={(e) => setEditForm({ ...editForm, endereco: e.target.value })}
                placeholder="Rua, número, bairro, cidade"
              />
              <div>
                <label className="text-sm italic mb-2 block" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  Descrição
                </label>
                <textarea
                  value={editForm.descricao}
                  onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                  rows={3}
                  placeholder="Descreva sua empresa e as vantagens oferecidas..."
                  className="w-full px-4 py-3 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B] resize-none"
                  style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Architects Daughter', cursive" }}
                />
              </div>

              <div className="flex gap-3 mt-2">
                <SketchButton
                  variant="outline"
                  type="button"
                  className="flex-1"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </SketchButton>
                <SketchButton
                  variant="primary"
                  type="submit"
                  className="flex-1"
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Salvar"}
                </SketchButton>
              </div>
            </form>

            {/* Botão Excluir Conta */}
            <div className="mt-6 pt-4 border-t-2 border-red-200">
              <button
                type="button"
                onClick={handleExcluirConta}
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Architects Daughter', cursive" }}
                disabled={salvando}
              >
                Excluir minha conta
              </button>
            </div>
          </div>
        </SketchCard>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

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
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      Nova Vantagem
                    </h2>
                    <button
                      onClick={() => setShowNewRewardForm(false)}
                      className="text-2xl leading-none hover:rotate-90 transition-transform p-2"
                    >
                      x
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Title */}
                    <SketchInput
                      label="Titulo da vantagem"
                      placeholder="Ex: Vale-livro R$50"
                      value={newReward.title}
                      onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                    />

                    {/* Description */}
                    <div>
                      <label className="text-sm italic mb-2 block" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        Descricao
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
                            className={`px-3 sm:px-4 py-2 border-[2.5px] border-black transition-all text-sm ${
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

                    {/* URL da imagem */}
                    <SketchInput
                      label="URL da imagem (opcional)"
                      placeholder="https://placehold.co/400x300"
                      value={newReward.imageUrl}
                      onChange={(e) => setNewReward({ ...newReward, imageUrl: e.target.value })}
                    />
                    {newReward.imageUrl && (
                      <div className="w-full h-32 flex items-center justify-center bg-[#F5F2E9] border-[2.5px] border-black overflow-hidden"
                           style={{ borderRadius: "8px 12px 6px 10px" }}>
                        <img
                          src={newReward.imageUrl}
                          alt="preview"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    )}
                  </div>

                  {formError && (
                    <p className="text-red-600 text-sm mt-4 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      {formError}
                    </p>
                  )}

                  <div className="border-t-2 border-dashed border-gray-300 mt-6 pt-6 flex flex-col sm:flex-row gap-3">
                    <SketchButton
                      variant="outline"
                      className="flex-1"
                      onClick={() => { setShowNewRewardForm(false); setFormError(null); }}
                    >
                      Cancelar
                    </SketchButton>
                    <SketchButton
                      variant="primary"
                      className="flex-1"
                      onClick={handleCreateReward}
                      disabled={submitting}
                    >
                      {submitting ? "Criando..." : "Criar Vantagem"}
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

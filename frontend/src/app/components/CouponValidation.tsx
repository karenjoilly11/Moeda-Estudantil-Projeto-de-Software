import { useState } from "react";
import { Bell, User, Search } from "lucide-react";
import { SketchCard } from "./SketchCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { motion, AnimatePresence } from "motion/react";

export function CouponValidation() {
  const [couponCode, setCouponCode] = useState("");
  const [validatedCoupon, setValidatedCoupon] = useState<any>(null);

  const recentValidations = [
    { id: 1, code: "A8F2-7K9P", student: "Marina S.", reward: "Vale-livro R$50", time: "14:23 - agora" },
    { id: 2, code: "B12C-3X4M", student: "Bruno L.", reward: "Audiobook 30d", time: "13:56" },
    { id: 3, code: "C44A-922R", student: "Carla R.", reward: "Combo papelaria", time: "11:08" },
    { id: 4, code: "D77B-1HBW", student: "Diego A.", reward: "Vale-livro R$50", time: "ontem - 17:44" },
    { id: 5, code: "E83F-Q05N", student: "Eva P.", reward: "E-book técnico", time: "ontem - 10:17" }
  ];

  const handleValidate = () => {
    if (couponCode.trim()) {
      setValidatedCoupon({
        code: couponCode,
        valid: true,
        student: "Marina Souza",
        enrollment: "2024.1234",
        course: "eng. comp.",
        reward: "Vale-livro R$50",
        cost: 50,
        date: "26/abr - 14:23"
      });
    }
  };

  const handleConfirmValidation = () => {
    alert("Cupom validado com sucesso!");
    setValidatedCoupon(null);
    setCouponCode("");
  };

  return (
    <div className="flex-1 p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl mb-2" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          validação de cupons
        </h1>
        <p className="text-sm text-gray-600 italic mb-6" style={{ fontFamily: "'Architects Daughter', cursive" }}>
          o aluno apresenta o código · você valida na hora
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Validation Area */}
          <div className="lg:col-span-2">
            <p className="text-xs text-red-500 mb-4 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              feedback claro → cupom inválido nunca validado
            </p>

            <SketchCard>
              <div className="p-6">
                <h3 className="text-lg mb-4 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                  código do cupom
                </h3>

                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="A8F2-7K9P"
                  className="w-full text-center text-4xl py-6 px-4 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#F2D06B] mb-6 tracking-wider"
                  style={{ borderRadius: "8px 12px 6px 10px", fontFamily: "'Courier New', monospace", fontWeight: "bold" }}
                  maxLength={9}
                />

                <SketchButton
                  variant="primary"
                  className="w-full text-lg py-4"
                  onClick={handleValidate}
                  disabled={couponCode.length < 9}
                >
                  validar cupom
                </SketchButton>
              </div>
            </SketchCard>

            {/* Validation Result */}
            <AnimatePresence>
              {validatedCoupon && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 0.95 }}
                  className="mt-6"
                >
                  <SketchCard className="bg-[#F2D06B]/30">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <SketchBadge variant="gold" className="mb-2">
                            ✓ CUPOM VÁLIDO
                          </SketchBadge>
                          <p className="text-xs text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            {validatedCoupon.date}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 border-[2px] border-black mb-4"
                           style={{ borderRadius: "6px 8px 5px 7px" }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-[#F5F2E9] border-[2px] border-black rounded-full flex items-center justify-center"
                               style={{ borderRadius: "50% 45% 48% 52%", fontFamily: "'Architects Daughter', cursive" }}>
                            M
                          </div>
                          <div>
                            <p className="font-medium" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {validatedCoupon.student}
                            </p>
                            <p className="text-xs text-gray-600" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                              {validatedCoupon.enrollment} · {validatedCoupon.course}
                            </p>
                          </div>
                        </div>

                        <div className="border-t-2 border-dashed border-gray-300 pt-3">
                          <p className="text-sm font-medium mb-1" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            VANTAGEM
                          </p>
                          <p className="text-lg" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            {validatedCoupon.reward}
                          </p>
                          <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                            {validatedCoupon.cost}💰 · resgatado em {validatedCoupon.date.split(' - ')[0]}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 mb-4 italic" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        baixa registrada · cupom invalidado nesta validação
                      </p>

                      <div className="flex gap-3">
                        <SketchButton
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setValidatedCoupon(null);
                            setCouponCode("");
                          }}
                        >
                          imprimir recibo
                        </SketchButton>
                        <SketchButton
                          variant="primary"
                          className="flex-1"
                          onClick={handleConfirmValidation}
                        >
                          validar próximo →
                        </SketchButton>
                      </div>
                    </div>
                  </SketchCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Validations Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-xl mb-4" style={{ fontFamily: "'Architects Daughter', cursive" }}>
              validações recentes
            </h3>

            <SketchCard className="p-4">
              <div className="space-y-3">
                {recentValidations.map((validation, index) => (
                  <motion.div
                    key={validation.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="pb-3 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-mono text-sm font-bold" style={{ fontFamily: "'Courier New', monospace" }}>
                        {validation.code}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                        {validation.time}
                      </p>
                    </div>
                    <p className="text-xs text-gray-700" style={{ fontFamily: "'Architects Daughter', cursive" }}>
                      {validation.student} · {validation.reward}
                    </p>
                  </motion.div>
                ))}
              </div>
            </SketchCard>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

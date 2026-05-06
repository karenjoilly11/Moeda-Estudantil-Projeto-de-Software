import { useState } from "react";
import { SketchCard } from "./SketchCard";
import { Sketch3DCard } from "./Sketch3DCard";
import { SketchButton } from "./SketchButton";
import { SketchBadge } from "./SketchBadge";
import { motion, AnimatePresence } from "motion/react";
import { transacaoService } from "@/services/transacaoService";
import { useConfetti } from "@/hooks/useConfetti";
import type { CupomValidacao } from "@/types/api";

const formatarData = (iso: string | null) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

interface ValidacaoLocal {
  code: string;
  student: string;
  reward: string;
  time: string;
}

export function CouponValidation() {
  const [couponCode, setCouponCode] = useState("");
  const [validatedCoupon, setValidatedCoupon] = useState<CupomValidacao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [recentes, setRecentes] = useState<ValidacaoLocal[]>([]);

  const { fireSuccess, fireSideExplosion } = useConfetti();

  const handleValidate = async () => {
    if (!couponCode.trim()) return;
    setErro(null);
    setCarregando(true);
    try {
      const resp = await transacaoService.validarCupom(couponCode.trim().toUpperCase());
      setValidatedCoupon(resp);
      
      // Dispara confete de sucesso
      fireSuccess();
      
      setRecentes((prev) =>
        [
          {
            code: resp.codigoCupom,
            student: resp.alunoNome ?? "-",
            reward: resp.vantagemNome ?? "-",
            time: formatarData(resp.dataResgate),
          },
          ...prev,
        ].slice(0, 5),
      );
    } catch (err: any) {
      setValidatedCoupon(null);
      setErro(err?.message || "Cupom invalido");
    } finally {
      setCarregando(false);
    }
  };

  const handleConfirmValidation = () => {
    fireSideExplosion("right");
    setValidatedCoupon(null);
    setCouponCode("");
    setErro(null);
  };

  return (
    <div className="flex-1 p-4 sm:p-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1
          className="text-2xl sm:text-3xl mb-2"
          style={{ fontFamily: "'Architects Daughter', cursive" }}
        >
          validacao de cupons
        </h1>
        <p
          className="text-sm text-gray-600 italic mb-6"
          style={{ fontFamily: "'Architects Daughter', cursive" }}
        >
          o aluno apresenta o codigo - voce valida na hora
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Validation Area */}
          <div className="lg:col-span-2">
            <Sketch3DCard intensity={0.5}>
              <div className="p-2 sm:p-4">
                <h3
                  className="text-base sm:text-lg mb-4 italic"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  codigo do cupom
                </h3>

                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setErro(null);
                  }}
                  placeholder="A8F2-7K9P"
                  className="w-full text-center text-2xl sm:text-4xl py-4 sm:py-6 px-4 bg-white border-[2.5px] border-black outline-none focus:ring-2 focus:ring-[#22C55E] mb-4 tracking-wider"
                  style={{
                    borderRadius: "8px 12px 6px 10px",
                    fontFamily: "'Courier New', monospace",
                    fontWeight: "bold",
                  }}
                  maxLength={12}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleValidate();
                  }}
                />

                {erro && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border-[2px] border-red-400 text-red-700 px-3 py-2 text-sm mb-4"
                    style={{
                      borderRadius: "6px 8px 5px 7px",
                      fontFamily: "'Architects Daughter', cursive",
                    }}
                  >
                    ! {erro}
                  </motion.div>
                )}

                <SketchButton
                  variant="primary"
                  className="w-full text-base sm:text-lg py-4"
                  onClick={handleValidate}
                  disabled={!couponCode.trim() || carregando}
                >
                  {carregando ? "validando..." : "validar cupom"}
                </SketchButton>
              </div>
            </Sketch3DCard>

            {/* Validation Result */}
            <AnimatePresence>
              {validatedCoupon && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 0.95 }}
                  className="mt-6"
                >
                  <SketchCard className="bg-[#22C55E]/20">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-4">
                        <div>
                          <SketchBadge variant="gold" className="mb-2 bg-[#22C55E] text-white">
                            CUPOM VALIDO
                          </SketchBadge>
                          <p
                            className="text-xs text-gray-600"
                            style={{ fontFamily: "'Architects Daughter', cursive" }}
                          >
                            {formatarData(validatedCoupon.dataResgate)}
                          </p>
                        </div>
                        <SketchBadge variant="gold" className="text-xs">
                          {validatedCoupon.status}
                        </SketchBadge>
                      </div>

                      <div
                        className="bg-white p-4 border-[2px] border-black mb-4"
                        style={{ borderRadius: "6px 8px 5px 7px" }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5F2E9] border-[2px] border-black flex items-center justify-center flex-shrink-0"
                            style={{
                              borderRadius: "50% 45% 48% 52%",
                              fontFamily: "'Architects Daughter', cursive",
                            }}
                          >
                            {(validatedCoupon.alunoNome ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium truncate"
                              style={{ fontFamily: "'Architects Daughter', cursive" }}
                            >
                              {validatedCoupon.alunoNome ?? "-"}
                            </p>
                            <p
                              className="text-xs text-gray-600 font-mono truncate"
                              style={{ fontFamily: "'Courier New', monospace" }}
                            >
                              {validatedCoupon.codigoCupom}
                            </p>
                          </div>
                        </div>

                        <div className="border-t-2 border-dashed border-gray-300 pt-3">
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ fontFamily: "'Architects Daughter', cursive" }}
                          >
                            VANTAGEM
                          </p>
                          <p
                            className="text-base sm:text-lg"
                            style={{ fontFamily: "'Architects Daughter', cursive" }}
                          >
                            {validatedCoupon.vantagemNome ?? "-"}
                          </p>
                          <p
                            className="text-xs text-gray-600 mt-1"
                            style={{ fontFamily: "'Architects Daughter', cursive" }}
                          >
                            {validatedCoupon.custoMoedas} moedas - resgatado em{" "}
                            {formatarData(validatedCoupon.dataResgate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <SketchButton
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setValidatedCoupon(null);
                            setCouponCode("");
                          }}
                        >
                          fechar
                        </SketchButton>
                        <SketchButton
                          variant="primary"
                          className="flex-1"
                          onClick={handleConfirmValidation}
                        >
                          validar proximo
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
            <h3
              className="text-lg sm:text-xl mb-4"
              style={{ fontFamily: "'Architects Daughter', cursive" }}
            >
              validacoes recentes
            </h3>

            <SketchCard className="p-4">
              {recentes.length === 0 && (
                <p
                  className="text-xs text-gray-500 italic text-center py-4"
                  style={{ fontFamily: "'Architects Daughter', cursive" }}
                >
                  nenhuma validacao ainda
                </p>
              )}

              <div className="space-y-3">
                {recentes.map((validation, index) => (
                  <motion.div
                    key={`${validation.code}-${index}`}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="pb-3 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p
                        className="font-mono text-sm font-bold truncate flex-1"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        {validation.code}
                      </p>
                      <p
                        className="text-xs text-gray-500 flex-shrink-0 ml-2"
                        style={{ fontFamily: "'Architects Daughter', cursive" }}
                      >
                        {validation.time}
                      </p>
                    </div>
                    <p
                      className="text-xs text-gray-700 truncate"
                      style={{ fontFamily: "'Architects Daughter', cursive" }}
                    >
                      {validation.student} - {validation.reward}
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

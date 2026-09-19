import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Zap,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  CheckCircle2,
  FileText
} from 'lucide-react';
import {
  BRAND_NAME,
  CHECKOUT_URL,
  PRICE_LABEL,
  DEMO_MODE,
} from '../config';
import { track } from '../services/sessionService';
import { Header } from './Header';

interface PaywallScreenProps {
  sessionId: string;
  onViewResult: () => void;
  onSimulateDemoPay: () => void;
}

export const PaywallScreen: React.FC<PaywallScreenProps> = ({
  sessionId,
  onViewResult,
  onSimulateDemoPay,
}) => {
  const handlePayNow = () => {
    track('InitiateCheckout', { sessionId, price: PRICE_LABEL });

    // Redirect to checkout URL with session parameter
    const url = new URL(CHECKOUT_URL, window.location.origin);
    url.searchParams.set('session', sessionId);
    window.location.href = url.toString();
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAF9F6] text-[#1B1B1B]">
      <Header showStartButton={false} />

      <main className="flex-1 px-4 py-8 sm:py-12 safe-area-bottom">
        <div className="mx-auto w-full max-w-[620px]">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-[#E4E7E3] bg-white p-6 sm:p-9 shadow-xs"
          >
            {/* Tag */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EFEA] px-3.5 py-1 text-xs font-semibold text-[#2F5D46]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Análise concluída</span>
              </span>
              <span className="text-[11px] font-mono text-[#5B5F5C]">
                ID: {sessionId.slice(0, 12)}
              </span>
            </div>

            {/* Title & Texts */}
            <h1 className="mt-5 font-serif text-2xl sm:text-3xl font-bold text-[#1B1B1B]">
              Seu resultado está pronto
            </h1>
            <p className="mt-3 text-base sm:text-lg font-medium text-[#1B1B1B]">
              Cobramos um valor simbólico de {PRICE_LABEL} para liberação do resultado.
            </p>
            <p className="mt-1 text-sm text-[#5B5F5C]">
              Clique em PAGAR AGORA e receba o resultado instantaneamente.
            </p>

            {/* Price Highlight Banner */}
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#E8EFEA]/70 p-4 border border-[#2F5D46]/20">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-[#5B5F5C]">
                  Acesso Completo ao Relatório
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2F5D46]">
                  {PRICE_LABEL}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F5D46] bg-white px-2.5 py-1 rounded-full border border-[#2F5D46]/20">
                  <Zap className="h-3 w-3" />
                  <span>Liberação imediata</span>
                </span>
              </div>
            </div>

            {/* Big Pill Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handlePayNow}
                className="w-full min-h-[56px] rounded-full bg-[#2F5D46] px-8 py-4 text-center text-base sm:text-lg font-bold uppercase tracking-wider text-white shadow-md shadow-[#2F5D46]/20 transition-all hover:bg-[#264C39] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
              >
                <Lock className="h-5 w-5" />
                <span>PAGAR AGORA</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* 3 Key Trust Items */}
            <div className="mt-6 space-y-3 border-t border-[#E4E7E3] pt-6">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#1B1B1B]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EFEA] text-[#2F5D46]">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span>Pagamento único de {PRICE_LABEL}</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#1B1B1B]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EFEA] text-[#2F5D46]">
                  <Zap className="h-4 w-4" />
                </div>
                <span>Resultado liberado na hora</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#1B1B1B]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EFEA] text-[#2F5D46]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>Ambiente de pagamento seguro</span>
              </div>
            </div>

            {/* Blurred Preview of the Report Layout */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5B5F5C] mb-2">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Prévia do layout do seu relatório</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#2F5D46]">
                  Bloqueado
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6] p-5 select-none">
                {/* Blurred mockup content (layout only, no real data) */}
                <div className="filter blur-md opacity-45 pointer-events-none space-y-4">
                  <div className="h-6 w-2/3 rounded-md bg-neutral-300" />
                  <div className="h-4 w-1/2 rounded-md bg-neutral-200" />

                  <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
                    <div className="h-5 w-40 rounded bg-[#2F5D46]/40" />
                    <div className="h-3 w-full rounded bg-neutral-200" />
                    <div className="h-2.5 w-full rounded-full bg-neutral-200">
                      <div className="h-2.5 w-3/5 rounded-full bg-[#2F5D46]" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
                    <div className="h-5 w-40 rounded bg-[#2F5D46]/40" />
                    <div className="h-3 w-full rounded bg-neutral-200" />
                    <div className="h-2.5 w-full rounded-full bg-neutral-200">
                      <div className="h-2.5 w-4/5 rounded-full bg-[#2F5D46]" />
                    </div>
                  </div>
                </div>

                {/* Centered lock badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/40 backdrop-blur-[2px]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2F5D46] text-white shadow-md">
                    <Lock className="h-6 w-6" />
                  </div>
                  <span className="mt-2 text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
                    Relatório aguardando liberação
                  </span>
                  <p className="text-[11px] text-[#5B5F5C] text-center mt-1 max-w-[280px]">
                    Todas as 20 respostas já foram contabilizadas e preparadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Discrete link: Já pagou? Ver meu resultado */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onViewResult}
                className="text-xs font-semibold text-[#2F5D46] underline-offset-4 hover:underline transition-colors"
              >
                Já pagou? Ver meu resultado
              </button>
            </div>

            {/* DEMO MODE simulation button */}
            {DEMO_MODE && (
              <div className="mt-5 border-t border-dashed border-amber-300 bg-amber-50/70 p-3.5 rounded-2xl text-center">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Modo de Demonstração Ativo
                </span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Teste o fluxo pós-pagamento sem precisar passar pelo checkout real.
                </p>
                <button
                  type="button"
                  onClick={onSimulateDemoPay}
                  className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-amber-600 bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 active:scale-95 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Simular pagamento (DEMO)</span>
                </button>
              </div>
            )}

            {/* Small Disclaimer */}
            <div className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-[#5B5F5C]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#2F5D46] mt-0.5" />
              <span>
                Indicativo baseado nos critérios do DSM-5. Não é diagnóstico e não substitui consulta com médico especialista.
              </span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

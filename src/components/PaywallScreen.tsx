import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Zap,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  User,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import {
  PRICE_LABEL,
  DEMO_MODE,
} from '../config';
import { track } from '../services/sessionService';
import { Header } from './Header';

interface PaywallScreenProps {
  sessionId: string;
  onPaymentSuccess?: () => void;
  onViewResult: () => void;
  onSimulateDemoPay: () => void;
}

export const PaywallScreen: React.FC<PaywallScreenProps> = ({
  sessionId,
  onPaymentSuccess,
  onViewResult,
  onSimulateDemoPay,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');

  // UI / Checkout flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    paymentId: string | number;
    pixCode: string;
    qrCodeImage?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Formatar Telefone: (99) 99999-9999
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    }
    setPhone(v);
  };

  // Formatar CPF: 999.999.999-99
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) {
      v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
    } else if (v.length > 6) {
      v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    } else if (v.length > 3) {
      v = `${v.slice(0, 3)}.${v.slice(3)}`;
    }
    setDocument(v);
  };

  // Gerar PIX via /api/criar-pix
  const handleGeneratePix = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanDoc = document.replace(/\D/g, '');
    const cleanTel = phone.replace(/\D/g, '');

    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu Nome Completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }
    if (cleanTel.length < 10) {
      setErrorMessage('Por favor, informe um telefone válido com DDD.');
      return;
    }
    if (cleanDoc.length !== 11) {
      setErrorMessage('Por favor, informe um CPF válido com 11 dígitos.');
      return;
    }

    setIsSubmitting(true);
    track('InitiateCheckout', { sessionId, price: PRICE_LABEL, email });

    try {
      const res = await fetch('/api/criar-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: cleanTel,
          document: cleanDoc,
          sessionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Não foi possível gerar a chave Pix. Tente novamente.');
      }

      if (!data.pixCode && !data.paymentId) {
        throw new Error('Retorno da Cakto incompleto. Tente novamente.');
      }

      setPixData({
        paymentId: data.paymentId,
        pixCode: data.pixCode || '',
        qrCodeImage: data.qrCodeImage,
      });
    } catch (err: any) {
      console.error('Erro ao gerar Pix:', err);
      setErrorMessage(err.message || 'Erro ao processar cobrança via Pix.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copiar código Pix
  const handleCopyPix = () => {
    if (!pixData?.pixCode) return;
    navigator.clipboard.writeText(pixData.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Polling a cada 3 segundos em /api/checar-status
  useEffect(() => {
    if (!pixData?.paymentId || isPaidSuccess) return;

    const checkPayment = async () => {
      try {
        setIsCheckingStatus(true);
        const res = await fetch(`/api/checar-status?id=${pixData.paymentId}`);
        if (!res.ok) return;
        const result = await res.json();

        if (result.isPaid) {
          setIsPaidSuccess(true);
          if (pollingRef.current) clearInterval(pollingRef.current);
          track('Purchase', { sessionId, paymentId: pixData.paymentId, price: PRICE_LABEL });
          // Revela na hora o relatório na mesma tela
          setTimeout(() => {
            if (onPaymentSuccess) {
              onPaymentSuccess();
            } else {
              onViewResult();
            }
          }, 800);
        }
      } catch (err) {
        console.warn('Erro na checagem de status:', err);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    // Primeira checagem imediata
    checkPayment();

    // Polling a cada 3 segundos
    pollingRef.current = setInterval(checkPayment, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [pixData, isPaidSuccess, sessionId, onPaymentSuccess, onViewResult]);

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
              Preencha os dados abaixo e pague com Pix para receber o resultado instantaneamente nesta mesma tela.
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

            {/* ERROR ALERT */}
            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* FORMULÁRIO PIX OU ÁREA PIX COPIA E COLA */}
            <div className="mt-6">
              {!pixData ? (
                /* 1. Formulário dos 4 dados obrigatórios Cakto */
                <form onSubmit={handleGeneratePix} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F5C] mb-1.5">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B5F5C]">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Maria da Silva"
                        className="w-full rounded-xl border border-[#E4E7E3] bg-[#FAF9F6] py-3.5 pl-10 pr-4 text-sm font-medium text-[#1B1B1B] transition-colors focus:border-[#2F5D46] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F5C] mb-1.5">
                      E-mail (para envio do comprovante)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B5F5C]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full rounded-xl border border-[#E4E7E3] bg-[#FAF9F6] py-3.5 pl-10 pr-4 text-sm font-medium text-[#1B1B1B] transition-colors focus:border-[#2F5D46] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F5C] mb-1.5">
                        Telefone (com DDD)
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B5F5C]">
                          <Phone className="h-4 w-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="(11) 98765-4321"
                          maxLength={15}
                          className="w-full rounded-xl border border-[#E4E7E3] bg-[#FAF9F6] py-3.5 pl-10 pr-4 text-sm font-medium text-[#1B1B1B] transition-colors focus:border-[#2F5D46] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F5C] mb-1.5">
                        CPF (registro Pix Bacen)
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B5F5C]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={document}
                          onChange={handleDocumentChange}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          className="w-full rounded-xl border border-[#E4E7E3] bg-[#FAF9F6] py-3.5 pl-10 pr-4 text-sm font-medium text-[#1B1B1B] transition-colors focus:border-[#2F5D46] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botão solicitado */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[56px] mt-2 rounded-full bg-[#2F5D46] px-8 py-4 text-center text-base sm:text-lg font-bold uppercase tracking-wider text-white shadow-md shadow-[#2F5D46]/20 transition-all hover:bg-[#264C39] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Gerando Pix Seguro...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>Liberar Relatório por {PRICE_LABEL}</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* 2. Área com Código Pix Copia e Cola gerado e monitoramento */
                <div className="rounded-2xl border-2 border-[#2F5D46]/30 bg-[#FAF9F6] p-5 sm:p-6 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EFEA] text-[#2F5D46] mb-3">
                    <Zap className="h-6 w-6" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1B1B1B]">
                    Chave Pix Gerada com Sucesso!
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#5B5F5C]">
                    Copie a chave Pix abaixo e pague no app do seu banco. A liberação é imediata assim que pagar no app do banco.
                  </p>

                  {/* QR Code Imagem se retornado pela Cakto */}
                  {pixData.qrCodeImage && (
                    <div className="my-4 flex justify-center">
                      <div className="rounded-xl border border-[#E4E7E3] bg-white p-3 shadow-xs">
                        <img
                          src={pixData.qrCodeImage.startsWith('data:') || pixData.qrCodeImage.startsWith('http') ? pixData.qrCodeImage : `data:image/png;base64,${pixData.qrCodeImage}`}
                          alt="QR Code Pix Cakto"
                          className="h-44 w-44 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Caixa Pix Copia e Cola */}
                  {pixData.pixCode && (
                    <div className="mt-4">
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={pixData.pixCode}
                          className="w-full truncate rounded-xl border border-[#E4E7E3] bg-white px-4 py-3 text-xs font-mono text-[#1B1B1B] select-all pr-12 focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="mt-3 w-full min-h-[48px] rounded-full bg-[#2F5D46] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#264C39] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-300" />
                            <span>Código Pix Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copiar Chave Pix</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Status do Polling */}
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#E8EFEA]/80 p-3 text-xs font-medium text-[#2F5D46]">
                    <RefreshCw className={`h-4 w-4 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                    <span>Aguardando confirmação do banco...</span>
                  </div>

                  <p className="mt-2 text-[11px] text-[#5B5F5C]">
                    Esta página atualiza automaticamente assim que o pagamento for aprovado. Não precisa recarregar!
                  </p>

                  <button
                    type="button"
                    onClick={() => setPixData(null)}
                    className="mt-3 text-xs text-[#5B5F5C] hover:text-[#1B1B1B] underline transition-colors"
                  >
                    Alterar dados ou gerar novo Pix
                  </button>
                </div>
              )}
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
                <span>Resultado liberado na hora na mesma tela</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#1B1B1B]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EFEA] text-[#2F5D46]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>Ambiente de pagamento seguro via Cakto</span>
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

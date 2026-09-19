import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  FileCheck2,
  Users
} from 'lucide-react';
import {
  BRAND_NAME,
  PRICE_LABEL,
  SHOW_TESTIMONIALS,
  VIDEO_URL,
} from '../config';
import { Header } from './Header';
import { Footer } from './Footer';

interface LandingScreenProps {
  onStartQuiz: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartQuiz,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyBar(heroBottom < 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: 'O quiz é um diagnóstico?',
      a: 'Não. É um indicativo baseado nos critérios do DSM-5. Só um profissional de saúde qualificado pode diagnosticar.',
    },
    {
      q: 'Quanto custa?',
      a: `Responder ao quiz é grátis. Cobramos um valor simbólico de ${PRICE_LABEL} para liberar o resultado completo.`,
    },
    {
      q: 'Para quais idades?',
      a: 'De 4 a 15 anos.',
    },
    {
      q: 'Meus dados estão seguros?',
      a: 'Usamos as respostas apenas para gerar o resultado, conforme a LGPD.',
    },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-[#FAF9F6] via-[#FAF9F6] to-white text-[#1B1B1B]">
      {/* Fixed Blur Header */}
      <Header onStartQuiz={onStartQuiz} showStartButton={true} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section
          ref={heroRef}
          className="mx-auto max-w-[1100px] px-4 pt-8 pb-16 sm:px-6 sm:pt-14 sm:pb-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E4E7E3] bg-[#E8EFEA]/60 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#2F5D46] uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>QUIZ PARA PAIS E RESPONSÁVEIS · 4 A 15 ANOS</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight text-[#1B1B1B] sm:text-5xl sm:leading-[1.15]">
              Entenda os sinais de{' '}
              <span className="highlight-keyword">
                <span>TDAH</span>
              </span>{' '}
              e{' '}
              <span className="highlight-keyword">
                <span>autismo</span>
              </span>{' '}
              no comportamento de crianças e adolescentes
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#5B5F5C]">
              Um quiz rápido de 20 perguntas, baseado nos critérios do DSM-5, para você organizar o que observa no dia a dia e saber quando procurar um especialista.
            </p>

            {/* Primary Action Button */}
            <div className="mt-8 flex flex-col items-center">
              <button
                type="button"
                onClick={onStartQuiz}
                className="w-full sm:w-auto sm:min-w-[320px] min-h-[56px] rounded-full bg-[#2F5D46] px-8 py-4 text-center text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-md shadow-[#2F5D46]/20 transition-all hover:bg-[#264C39] hover:shadow-lg hover:shadow-[#2F5D46]/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#2F5D46] focus:ring-offset-2 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>INICIAR QUIZ AGORA</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Microtext */}
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-[#5B5F5C]">
                <Clock className="h-3.5 w-3.5 text-[#2F5D46]" />
                <span>Leva cerca de 5 minutos · Responder é grátis · Resultado completo por {PRICE_LABEL}</span>
              </p>
            </div>

            {/* Disclaimer notice */}
            <div className="mt-8 mx-auto max-w-lg rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6] p-4 text-left flex items-start gap-3 text-xs text-[#5B5F5C] shadow-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-[#2F5D46] mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-[#1B1B1B]">Aviso importante:</strong> Este quiz é um indicativo. Não é diagnóstico e não substitui a avaliação de um profissional de saúde.
              </p>
            </div>
          </div>

          {/* Optional Video Section */}
          {VIDEO_URL && (
            <div className="mt-12 mx-auto max-w-2xl">
              <div className="overflow-hidden rounded-2xl border border-[#E4E7E3] bg-black/5 aspect-video flex items-center justify-center shadow-sm">
                <iframe
                  src={VIDEO_URL}
                  title="Vídeo explicativo"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </section>

        {/* SECTION: COMO FUNCIONA */}
        <section className="border-t border-[#E4E7E3] bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
                Passo a passo simples
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#1B1B1B] sm:text-3xl">
                Como funciona
              </h2>
              <p className="mt-2 text-sm text-[#5B5F5C]">
                Três etapas práticas para organizar sua percepção e obter clareza.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="flex flex-col rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6] p-6 sm:p-7 transition-all hover:border-[#2F5D46]/40 hover:shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8EFEA] text-[#2F5D46] font-serif text-xl font-bold">
                  1
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-[#1B1B1B]">
                  Escolha a faixa etária
                </h3>
                <p className="mt-2 text-sm text-[#5B5F5C] leading-relaxed">
                  Selecione entre 4 a 11 anos (fase escolar) ou 12 a 15 anos (adolescência), personalizando o contexto de observação.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6] p-6 sm:p-7 transition-all hover:border-[#2F5D46]/40 hover:shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8EFEA] text-[#2F5D46] font-serif text-xl font-bold">
                  2
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-[#1B1B1B]">
                  Responda 20 perguntas em dois blocos
                </h3>
                <p className="mt-2 text-sm text-[#5B5F5C] leading-relaxed">
                  Avaliação rápida e intuitiva dividida em comunicação social e padrão de atenção/agitação motora nos últimos 6 meses.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6] p-6 sm:p-7 transition-all hover:border-[#2F5D46]/40 hover:shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8EFEA] text-[#2F5D46] font-serif text-xl font-bold">
                  3
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-[#1B1B1B]">
                  Receba o relatório com os próximos passos
                </h3>
                <p className="mt-2 text-sm text-[#5B5F5C] leading-relaxed">
                  Métricas detalhadas por bloco, nível de indicativos e recomendações práticas para orientar sua conversa com especialistas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: O QUE O QUIZ AVALIA */}
        <section className="py-16 sm:py-20 bg-[#FAF9F6]">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
                Fundamentado no DSM-5
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#1B1B1B] sm:text-3xl">
                O que o quiz avalia
              </h2>
              <p className="mt-2 text-sm text-[#5B5F5C]">
                Dois blocos de triagem independentes para separar comportamentos e não confundir sinais clínicos.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Card Block 1 */}
              <div className="rounded-3xl border border-[#E4E7E3] bg-white p-7 sm:p-9 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#E8EFEA] px-3.5 py-1 text-xs font-semibold text-[#2F5D46]">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Bloco 1 · 10 perguntas</span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl sm:text-2xl font-bold text-[#1B1B1B]">
                    Comunicação e comportamento
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#2F5D46]">
                    Sinais relacionados ao espectro do autismo
                  </p>
                  <p className="mt-4 text-sm text-[#5B5F5C] leading-relaxed">
                    Avalia aspectos observáveis de reciprocidade social, contato visual, sensibilidade sensorial (sons, tecidos, luzes), interesses focados e necessidade de rotinas estáveis.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-[#E4E7E3] text-xs text-[#5B5F5C] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2F5D46]" />
                  <span>Pontuação separada de 0 a 30 pontos</span>
                </div>
              </div>

              {/* Card Block 2 */}
              <div className="rounded-3xl border border-[#E4E7E3] bg-white p-7 sm:p-9 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#E8EFEA] px-3.5 py-1 text-xs font-semibold text-[#2F5D46]">
                    <Brain className="h-3.5 w-3.5" />
                    <span>Bloco 2 · 10 perguntas</span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl sm:text-2xl font-bold text-[#1B1B1B]">
                    Atenção e agitação
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#2F5D46]">
                    Sinais relacionados ao TDAH
                  </p>
                  <p className="mt-4 text-sm text-[#5B5F5C] leading-relaxed">
                    Mapeia a sustentação de foco, tendência à dispersão e esquecimentos, capacidade de concluir tarefas, inquietude física, impulsividade verbal e tolerância à espera.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-[#E4E7E3] text-xs text-[#5B5F5C] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2F5D46]" />
                  <span>Pontuação separada de 0 a 30 pontos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: DEPOIMENTOS (RENDERIZAR SOMENTE SE SHOW_TESTIMONIALS === true) */}
        {SHOW_TESTIMONIALS && (
          <section className="border-t border-[#E4E7E3] bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1100px] px-4 sm:px-6 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
                Experiências
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#1B1B1B] sm:text-3xl">
                O que dizem os pais
              </h2>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6] p-6 text-left">
                  <div className="h-10 w-10 rounded-full bg-[#E8EFEA] flex items-center justify-center font-bold text-[#2F5D46]">
                    P
                  </div>
                  <p className="mt-3 text-sm text-[#5B5F5C] italic">
                    Espaço para relato verificado.
                  </p>
                  <p className="mt-3 font-semibold text-xs text-[#1B1B1B]">Responsável</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION: FAQ ACCORDION */}
        <section className="border-t border-[#E4E7E3] bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[760px] px-4 sm:px-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
                Dúvidas comuns
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#1B1B1B] sm:text-3xl">
                Perguntas frequentes
              </h2>
            </div>

            <div className="mt-10 divide-y divide-[#E4E7E3] rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6]">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="transition-colors">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-base font-semibold text-[#1B1B1B] hover:text-[#2F5D46] focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="pr-4">{faq.q}</span>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EFEA] text-[#2F5D46]">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm leading-relaxed text-[#5B5F5C]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="border-t border-[#E4E7E3] bg-[#FAF9F6] py-16 sm:py-20 text-center">
          <div className="mx-auto max-w-xl px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B1B1B]">
              Pronto para começar a triagem?
            </h2>
            <p className="mt-3 text-sm text-[#5B5F5C]">
              Leva apenas 5 minutos. Organize suas observações e tenha um relatório claro para orientar os próximos passos.
            </p>
            <div className="mt-8 flex flex-col items-center">
              <button
                type="button"
                onClick={onStartQuiz}
                className="w-full sm:w-auto sm:min-w-[320px] min-h-[56px] rounded-full bg-[#2F5D46] px-8 py-4 text-center text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-md shadow-[#2F5D46]/20 transition-all hover:bg-[#264C39] hover:shadow-lg hover:shadow-[#2F5D46]/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#2F5D46] focus:ring-offset-2 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>INICIAR QUIZ AGORA</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 text-xs text-[#5B5F5C]">
                Sem cadastro prévio · Responda com calma no seu tempo
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Bar for Mobile (appears after scrolling past hero) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4E7E3] bg-[#FAF9F6]/95 backdrop-blur-md p-3.5 safe-area-bottom sm:hidden shadow-lg"
          >
            <button
              type="button"
              onClick={onStartQuiz}
              className="w-full min-h-[52px] rounded-full bg-[#2F5D46] px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>INICIAR QUIZ AGORA</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer onOpenPrivacy={onOpenPrivacy} onOpenTerms={onOpenTerms} />
    </div>
  );
};

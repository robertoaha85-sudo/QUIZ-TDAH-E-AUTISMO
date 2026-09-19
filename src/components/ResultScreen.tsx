import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Printer,
  Share2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Brain,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { QuizSession } from '../types';
import {
  evaluateBlock1,
  evaluateBlock2,
  RECOMMENDED_PROFESSIONALS,
} from '../utils/evaluation';
import { BRAND_NAME } from '../config';
import { Header } from './Header';
import { Footer } from './Footer';

interface ResultScreenProps {
  session: QuizSession;
  onRetakeQuiz: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  session,
  onRetakeQuiz,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const block1Eval = evaluateBlock1(session.block1Score, session.ageGroup);
  const block2Eval = evaluateBlock2(session.block2Score, session.ageGroup);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('session', session.id);
      navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const ageGroupLabel =
    session.ageGroup === '4-11' ? '4 a 11 anos (Fase escolar)' : '12 a 15 anos (Adolescência)';

  // Helper for badge color according to level
  const getLevelBadge = (level: 'low' | 'moderate' | 'high', label: string) => {
    if (level === 'low') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>{label}</span>
        </span>
      );
    }
    if (level === 'moderate') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-800">
          <Info className="h-3.5 w-3.5 text-amber-600" />
          <span>{label}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3.5 py-1 text-xs font-bold text-rose-800">
        <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
        <span>{label}</span>
      </span>
    );
  };

  // Helper for progress bar color
  const getBarColor = (level: 'low' | 'moderate' | 'high') => {
    if (level === 'low') return 'bg-emerald-600';
    if (level === 'moderate') return 'bg-amber-600';
    return 'bg-rose-600';
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAF9F6] text-[#1B1B1B]">
      {/* Header */}
      <Header showStartButton={false} />

      <main className="flex-1 px-4 py-8 sm:py-12 safe-area-bottom">
        <div className="mx-auto w-full max-w-[760px]">
          {/* Print/Share Action Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2F5D46]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Relatório Liberado</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7E3] bg-white px-3.5 py-2 text-xs font-medium text-[#1B1B1B] shadow-xs hover:bg-[#FAF9F6] active:scale-95 transition-all"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#2F5D46]" />
                    <span>Link copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-[#5B5F5C]" />
                    <span>Compartilhar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#2F5D46] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#264C39] active:scale-95 transition-all"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>

          {/* Title Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-[#E4E7E3] bg-white p-6 sm:p-8 shadow-xs"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
              Relatório de Triagem Comportamental
            </span>
            <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#1B1B1B]">
              Resultado do quiz
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-[#5B5F5C]">
              <span className="rounded-md bg-[#FAF9F6] border border-[#E4E7E3] px-2.5 py-1">
                Faixa etária: <strong className="text-[#1B1B1B]">{ageGroupLabel}</strong>
              </span>
              <span className="rounded-md bg-[#FAF9F6] border border-[#E4E7E3] px-2.5 py-1">
                Data: {new Date(session.completedAt || session.createdAt).toLocaleDateString('pt-BR')}
              </span>
              <span className="rounded-md bg-[#FAF9F6] border border-[#E4E7E3] px-2.5 py-1 font-mono">
                Sessão: {session.id.slice(0, 12)}
              </span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-[#5B5F5C] leading-relaxed border-t border-[#E4E7E3] pt-4">
              Este relatório compila as 20 perguntas respondidas por você, divididas em dois eixos independentes avaliados segundo critérios descritivos do DSM-5. Use estas informações como subsídio para organizar seus apontamentos e dialogar com os profissionais de saúde.
            </p>
          </motion.div>

          {/* EVALUATION BLOCK 1: Comunicação e Comportamento */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mt-6 rounded-3xl border border-[#E4E7E3] bg-white p-6 sm:p-8 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E7E3] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFEA] text-[#2F5D46]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F5D46]">
                    Bloco 1 de 2
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1B1B1B]">
                    {block1Eval.title}
                  </h2>
                </div>
              </div>
              <div>{getLevelBadge(block1Eval.level, block1Eval.levelLabel)}</div>
            </div>

            {/* Score and Visual Bar */}
            <div className="mt-6 rounded-2xl bg-[#FAF9F6] border border-[#E4E7E3] p-5">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B5F5C]">
                  Pontuação obtida
                </span>
                <div className="text-right">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1B1B1B]">
                    {block1Eval.score}
                  </span>
                  <span className="text-sm font-semibold text-[#5B5F5C]"> / 30 pontos</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#E4E7E3]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor(
                    block1Eval.level
                  )}`}
                  style={{ width: `${Math.max(5, block1Eval.percentage)}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] font-semibold text-[#5B5F5C] uppercase tracking-wider">
                <span>0 (Baixo)</span>
                <span>15 (Moderado)</span>
                <span>30 (Elevado)</span>
              </div>
            </div>

            {/* Explanatory Paragraph */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
                Análise explicativa
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#1B1B1B]">
                {block1Eval.summary}
              </p>
            </div>

            {/* Key observations */}
            <div className="mt-5 rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6] p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B5F5C]">
                Pontos de atenção observados
              </h4>
              <ul className="mt-2.5 space-y-2">
                {block1Eval.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#5B5F5C]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2F5D46] mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* EVALUATION BLOCK 2: Atenção e Agitação */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="mt-6 rounded-3xl border border-[#E4E7E3] bg-white p-6 sm:p-8 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E7E3] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFEA] text-[#2F5D46]">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F5D46]">
                    Bloco 2 de 2
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1B1B1B]">
                    {block2Eval.title}
                  </h2>
                </div>
              </div>
              <div>{getLevelBadge(block2Eval.level, block2Eval.levelLabel)}</div>
            </div>

            {/* Score and Visual Bar */}
            <div className="mt-6 rounded-2xl bg-[#FAF9F6] border border-[#E4E7E3] p-5">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B5F5C]">
                  Pontuação obtida
                </span>
                <div className="text-right">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1B1B1B]">
                    {block2Eval.score}
                  </span>
                  <span className="text-sm font-semibold text-[#5B5F5C]"> / 30 pontos</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#E4E7E3]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor(
                    block2Eval.level
                  )}`}
                  style={{ width: `${Math.max(5, block2Eval.percentage)}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] font-semibold text-[#5B5F5C] uppercase tracking-wider">
                <span>0 (Baixo)</span>
                <span>15 (Moderado)</span>
                <span>30 (Elevado)</span>
              </div>
            </div>

            {/* Explanatory Paragraph */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
                Análise explicativa
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#1B1B1B]">
                {block2Eval.summary}
              </p>
            </div>

            {/* Key observations */}
            <div className="mt-5 rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6] p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B5F5C]">
                Pontos de atenção observados
              </h4>
              <ul className="mt-2.5 space-y-2">
                {block2Eval.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#5B5F5C]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2F5D46] mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* SECTION: PRÓXIMOS PASSOS E ESPECIALISTAS */}
          <div className="mt-8 rounded-3xl border border-[#E4E7E3] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-[#2F5D46]">
              <Stethoscope className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Diretrizes de Ação
              </span>
            </div>
            <h2 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-[#1B1B1B]">
              Próximos passos recomendados
            </h2>
            <p className="mt-2 text-sm text-[#5B5F5C] leading-relaxed">
              Diante de pontuações moderadas ou elevadas, ou sempre que você notar prejuízos no rendimento acadêmico, nas relações de amizade ou no bem-estar diário, é prudente buscar orientação com especialistas.
            </p>

            {/* Professionals cards list */}
            <div className="mt-6 space-y-3">
              {RECOMMENDED_PROFESSIONALS.map((prof, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E4E7E3] bg-[#FAF9F6] p-4 transition-all hover:border-[#2F5D46]/40"
                >
                  <h3 className="font-serif text-base font-bold text-[#1B1B1B]">
                    {prof.specialty}
                  </h3>
                  <p className="mt-1 text-xs text-[#5B5F5C] leading-relaxed">
                    {prof.role}
                  </p>
                  <p className="mt-2 text-xs font-medium text-[#2F5D46]">
                    🎯 <strong>Quando procurar:</strong> {prof.whenToConsult}
                  </p>
                </div>
              ))}
            </div>

            {/* What to take to consultation checklist */}
            <div className="mt-8 rounded-2xl border border-[#2F5D46]/20 bg-[#E8EFEA]/50 p-5">
              <h3 className="font-serif text-base font-bold text-[#2F5D46] flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>O que levar para a primeira consulta</span>
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-[#1B1B1B]">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#2F5D46] shrink-0 mt-0.5" />
                  <span>
                    Uma cópia impressa deste relatório com as observações do quiz.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#2F5D46] shrink-0 mt-0.5" />
                  <span>
                    Relatórios ou pareceres pedagógicos dos professores da escola (comportamento e desempenho).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#2F5D46] shrink-0 mt-0.5" />
                  <span>
                    Caderno com anotações de exemplos concretos de situações que chamaram sua atenção nas últimas semanas.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Footer: Retake Quiz */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#E4E7E3] bg-white p-6 shadow-xs print:hidden">
            <div>
              <h3 className="font-serif text-base font-bold text-[#1B1B1B]">
                Deseja refazer a triagem?
              </h3>
              <p className="text-xs text-[#5B5F5C]">
                Você pode reiniciar o questionário para outra criança ou reavaliar com novas observações.
              </p>
            </div>
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="inline-flex items-center gap-2 rounded-full border border-[#2F5D46] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#2F5D46] hover:bg-[#E8EFEA] active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Refazer Quiz</span>
            </button>
          </div>
        </div>
      </main>

      <Footer onOpenPrivacy={onOpenPrivacy} onOpenTerms={onOpenTerms} />
    </div>
  );
};

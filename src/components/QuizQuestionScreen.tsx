import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, ArrowRight, MessageSquare, Brain } from 'lucide-react';
import { Question } from '../types';
import { QUESTION_OPTIONS } from '../data/questions';

interface QuizQuestionScreenProps {
  question: Question;
  currentIndex: number; // 1 to 20
  totalQuestions: number; // 20
  currentAnswer?: number; // 0, 1, 2, 3 or undefined
  onSelectOption: (score: number) => void;
  onBack: () => void;
  onFinishQuiz: () => void;
}

export const QuizQuestionScreen: React.FC<QuizQuestionScreenProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentAnswer,
  onSelectOption,
  onBack,
  onFinishQuiz,
}) => {
  const [selectedScore, setSelectedScore] = useState<number | undefined>(currentAnswer);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync selected score when question changes
  useEffect(() => {
    setSelectedScore(currentAnswer);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, currentAnswer]);

  const handleOptionClick = (score: number) => {
    setSelectedScore(score);

    // If it's question 20 (last question), DO NOT auto-advance.
    if (currentIndex === totalQuestions) {
      onSelectOption(score);
      return;
    }

    // Questions 1 to 19: advance automatically after 250ms
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSelectOption(score);
    }, 250);
  };

  const progressPercent = Math.round((currentIndex / totalQuestions) * 100);
  const isBlock1 = question.blockId === 1;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAF9F6] text-[#1B1B1B]">
      {/* Top Bar with Back Arrow, Question counter and animated progress bar */}
      <header className="sticky top-0 z-40 border-b border-[#E4E7E3] bg-[#FAF9F6]/95 backdrop-blur-md safe-area-top">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#5B5F5C] hover:bg-[#E8EFEA] hover:text-[#1B1B1B] active:scale-95 transition-colors"
            aria-label="Voltar para a pergunta anterior"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div
            className="text-xs font-semibold uppercase tracking-wider text-[#5B5F5C]"
            aria-live="polite"
            aria-atomic="true"
          >
            Pergunta <span className="text-[#1B1B1B] font-bold">{currentIndex}</span> de {totalQuestions}
          </div>

          <div className="text-xs font-bold text-[#2F5D46] w-10 text-right">
            {progressPercent}%
          </div>
        </div>

        {/* Animated slim progress bar */}
        <div
          role="progressbar"
          aria-valuenow={currentIndex}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
          className="h-1 w-full bg-[#E4E7E3]"
        >
          <div
            className="h-full bg-[#2F5D46] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Question Area */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8 sm:py-12 safe-area-bottom">
        <div className="mx-auto w-full max-w-[720px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              {/* Block Badge (distinct colors for Block 1 vs Block 2) */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider border ${
                    isBlock1
                      ? 'border-[#2F5D46]/20 bg-[#E8EFEA] text-[#2F5D46]'
                      : 'border-[#3D6B58]/20 bg-[#E2EBE5] text-[#244A38]'
                  }`}
                >
                  {isBlock1 ? (
                    <MessageSquare className="h-3 w-3" />
                  ) : (
                    <Brain className="h-3 w-3" />
                  )}
                  <span>
                    BLOCO {question.blockId} · {question.blockTitle}
                  </span>
                </span>
              </div>

              {/* Question Text in Playfair serif */}
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-snug text-[#1B1B1B]">
                {question.text}
              </h2>

              {/* Contextual hint */}
              {question.hint && (
                <p className="mt-3 text-xs sm:text-sm text-[#5B5F5C] leading-relaxed">
                  💡 {question.hint}
                </p>
              )}

              {/* Options list */}
              <div
                className="mt-8 space-y-3"
                role="radiogroup"
                aria-label={question.text}
              >
                {QUESTION_OPTIONS.map((opt) => {
                  const isSelected = selectedScore === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleOptionClick(opt.score)}
                      className={`group flex w-full min-h-[58px] sm:min-h-[64px] items-center justify-between rounded-2xl border px-5 py-3.5 text-left transition-all active:scale-[0.99] cursor-pointer outline-none focus:ring-2 focus:ring-[#2F5D46] focus:ring-offset-2 ${
                        isSelected
                          ? 'border-[#2F5D46] bg-[#E8EFEA] text-[#1B1B1B] shadow-xs'
                          : 'border-[#E4E7E3] bg-white text-[#1B1B1B] hover:border-[#2F5D46]/40 hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-medium">
                        {opt.label}
                      </span>

                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? 'border-[#2F5D46] bg-[#2F5D46] text-white'
                            : 'border-[#E4E7E3] bg-white group-hover:border-[#2F5D46]/40'
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Last question explicit finish button */}
              {currentIndex === totalQuestions && selectedScore !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-8"
                >
                  <button
                    type="button"
                    onClick={onFinishQuiz}
                    className="w-full min-h-[56px] rounded-full bg-[#2F5D46] px-8 py-4 text-center text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-md shadow-[#2F5D46]/20 transition-all hover:bg-[#264C39] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>FINALIZAR QUIZ</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

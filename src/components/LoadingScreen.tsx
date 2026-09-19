import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { LOADING_SECONDS, BRAND_NAME } from '../config';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const messages = [
    'Somando as respostas do Bloco 1…',
    'Somando as respostas do Bloco 2…',
    'Organizando o seu relatório…',
    'Quase pronto…',
  ];

  useEffect(() => {
    const startTime = Date.now();
    const durationMs = LOADING_SECONDS * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      // Determine step based on 2.5s intervals (4 steps in 10s)
      const step = Math.min(3, Math.floor(elapsed / 2500));
      setCurrentStepIndex(step);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#FAF9F6] px-4 py-12 text-[#1B1B1B]">
      <div className="w-full max-w-[480px] text-center">
        {/* Brand header */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E4E7E3] bg-[#E8EFEA] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2F5D46]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{BRAND_NAME}</span>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative mx-auto mt-10 flex h-40 w-40 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="transparent"
              stroke="#E4E7E3"
              strokeWidth="8"
            />
            {/* Animated progress circle */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="transparent"
              stroke="#2F5D46"
              strokeWidth="8"
              strokeDasharray={326.7}
              strokeDashoffset={326.7 - (326.7 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-100 ease-linear"
            />
          </svg>

          {/* Center percentage label */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-serif text-3xl font-bold text-[#1B1B1B]">
              {progress}%
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5B5F5C]">
              Processando
            </span>
          </div>
        </div>

        {/* Dynamic Changing Message */}
        <div className="mt-8 min-h-[64px]">
          <motion.p
            key={currentStepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="font-serif text-xl font-bold text-[#1B1B1B]"
          >
            {messages[currentStepIndex]}
          </motion.p>
          <p className="mt-2 text-xs text-[#5B5F5C]">
            Cruzando suas respostas com as diretrizes e critérios clínicos do DSM-5…
          </p>
        </div>

        {/* 4 Steps checklist visual */}
        <div className="mt-8 rounded-2xl border border-[#E4E7E3] bg-white p-5 text-left space-y-3 shadow-xs">
          {messages.map((msg, idx) => {
            const isFinished = currentStepIndex > idx || progress === 100;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-opacity ${
                  isFinished || isCurrent ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    isFinished
                      ? 'bg-[#2F5D46] text-white'
                      : isCurrent
                      ? 'border-2 border-[#2F5D46] bg-white'
                      : 'border border-[#E4E7E3] bg-[#FAF9F6]'
                  }`}
                >
                  {isFinished && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {isCurrent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2F5D46] animate-pulse" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isCurrent ? 'text-[#2F5D46] font-semibold' : 'text-[#1B1B1B]'
                  }`}
                >
                  {msg.replace('…', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

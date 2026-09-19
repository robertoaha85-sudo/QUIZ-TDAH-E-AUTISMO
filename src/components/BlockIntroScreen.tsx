import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, MessageSquare, Brain, Calendar } from 'lucide-react';
import { Header } from './Header';

interface BlockIntroScreenProps {
  blockId: 1 | 2;
  onStart: () => void;
  onBack: () => void;
}

export const BlockIntroScreen: React.FC<BlockIntroScreenProps> = ({
  blockId,
  onStart,
  onBack,
}) => {
  const isBlock1 = blockId === 1;

  const content = isBlock1
    ? {
        label: 'BLOCO 1 de 2',
        title: 'Comunicação e comportamento',
        description:
          'Vamos falar sobre como a criança se comunica, brinca e reage ao ambiente. Responda pensando nos últimos 6 meses.',
        icon: MessageSquare,
        buttonText: 'COMEÇAR BLOCO 1',
        subtitle: '10 perguntas sobre comunicação, interação social e sensibilidade',
      }
    : {
        label: 'BLOCO 2 de 2',
        title: 'Atenção e agitação',
        description:
          'Agora vamos falar sobre atenção, agitação e impulsividade. Responda pensando nos últimos 6 meses.',
        icon: Brain,
        buttonText: 'CONTINUAR PARA O BLOCO 2',
        subtitle: '10 perguntas sobre foco, esquecimento, inquietude e impulsividade',
      };

  const Icon = content.icon;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAF9F6] text-[#1B1B1B]">
      <Header showStartButton={false} />

      <main className="flex-1 flex flex-col justify-center px-4 py-8 sm:py-12 safe-area-bottom">
        <div className="mx-auto w-full max-w-[560px]">
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#5B5F5C] hover:text-[#2F5D46] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>

          {/* Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-[#E4E7E3] bg-white p-7 sm:p-10 shadow-xs text-center"
          >
            {/* Big icon pill */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8EFEA] text-[#2F5D46] shadow-xs">
              <Icon className="h-8 w-8" />
            </div>

            {/* Label */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E4E7E3] bg-[#FAF9F6] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
              {content.label}
            </div>

            {/* Title in Playfair */}
            <h1 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-[#1B1B1B]">
              {content.title}
            </h1>

            {/* Description */}
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#5B5F5C]">
              {content.description}
            </p>

            {/* 6 months reminder pill */}
            <div className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8EFEA]/60 px-4 py-2 text-xs font-medium text-[#2F5D46]">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Critério clínico: considere o padrão habitual dos últimos 6 meses</span>
            </div>

            {/* Action button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={onStart}
                className="w-full min-h-[56px] rounded-full bg-[#2F5D46] px-8 py-4 text-center text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-md shadow-[#2F5D46]/20 transition-all hover:bg-[#264C39] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>{content.buttonText}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

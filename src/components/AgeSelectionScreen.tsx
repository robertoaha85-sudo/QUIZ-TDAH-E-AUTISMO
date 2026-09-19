import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Sparkles, School, GraduationCap } from 'lucide-react';
import { AgeGroup } from '../types';
import { Header } from './Header';

interface AgeSelectionScreenProps {
  initialAgeGroup?: AgeGroup | null;
  onSelect: (ageGroup: AgeGroup) => void;
  onBack: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const AgeSelectionScreen: React.FC<AgeSelectionScreenProps> = ({
  initialAgeGroup = null,
  onSelect,
  onBack,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(initialAgeGroup);
  const [hasConsent, setHasConsent] = useState(false);

  const canContinue = selectedAge !== null && hasConsent;

  const handleContinue = () => {
    if (canContinue && selectedAge) {
      onSelect(selectedAge);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAF9F6] text-[#1B1B1B]">
      <Header showStartButton={false} />

      <main className="flex-1 flex flex-col justify-center px-4 py-8 sm:py-12 safe-area-bottom">
        <div className="mx-auto w-full max-w-[560px]">
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#5B5F5C] hover:text-[#2F5D46] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao início</span>
          </button>

          {/* Title and subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D46]">
              Passo 1 de 3
            </span>
            <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#1B1B1B]">
              Qual é a faixa etária da criança?
            </h1>
            <p className="mt-2 text-sm text-[#5B5F5C]">
              O questionário adequa a análise e as orientações para o momento de vida da criança ou adolescente.
            </p>
          </motion.div>

          {/* Age options cards */}
          <div className="mt-8 space-y-4" role="radiogroup" aria-label="Faixa etária">
            {/* 4 a 11 anos */}
            <div
              role="radio"
              aria-checked={selectedAge === '4-11'}
              tabIndex={0}
              onClick={() => setSelectedAge('4-11')}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setSelectedAge('4-11');
                }
              }}
              className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition-all outline-none focus:ring-2 focus:ring-[#2F5D46] focus:ring-offset-2 min-h-[76px] ${
                selectedAge === '4-11'
                  ? 'border-[#2F5D46] bg-[#E8EFEA] shadow-sm'
                  : 'border-[#E4E7E3] bg-white hover:border-[#2F5D46]/40 hover:bg-[#FAF9F6]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    selectedAge === '4-11'
                      ? 'bg-[#2F5D46] text-white'
                      : 'bg-[#E8EFEA] text-[#2F5D46] group-hover:bg-[#2F5D46]/20'
                  }`}
                >
                  <School className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1B1B1B]">
                    4 a 11 anos
                  </h3>
                  <p className="text-xs font-medium text-[#5B5F5C]">Fase escolar</p>
                </div>
              </div>

              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                  selectedAge === '4-11'
                    ? 'border-[#2F5D46] bg-[#2F5D46] text-white'
                    : 'border-[#E4E7E3] bg-white'
                }`}
              >
                {selectedAge === '4-11' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* 12 a 15 anos */}
            <div
              role="radio"
              aria-checked={selectedAge === '12-15'}
              tabIndex={0}
              onClick={() => setSelectedAge('12-15')}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setSelectedAge('12-15');
                }
              }}
              className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition-all outline-none focus:ring-2 focus:ring-[#2F5D46] focus:ring-offset-2 min-h-[76px] ${
                selectedAge === '12-15'
                  ? 'border-[#2F5D46] bg-[#E8EFEA] shadow-sm'
                  : 'border-[#E4E7E3] bg-white hover:border-[#2F5D46]/40 hover:bg-[#FAF9F6]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    selectedAge === '12-15'
                      ? 'bg-[#2F5D46] text-white'
                      : 'bg-[#E8EFEA] text-[#2F5D46] group-hover:bg-[#2F5D46]/20'
                  }`}
                >
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1B1B1B]">
                    12 a 15 anos
                  </h3>
                  <p className="text-xs font-medium text-[#5B5F5C]">
                    Pré-adolescente e adolescente
                  </p>
                </div>
              </div>

              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                  selectedAge === '12-15'
                    ? 'border-[#2F5D46] bg-[#2F5D46] text-white'
                    : 'border-[#E4E7E3] bg-white'
                }`}
              >
                {selectedAge === '12-15' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* Notice for other ages */}
          <p className="mt-3 text-center text-xs text-[#5B5F5C]/80">
            Menores de 4 anos e maiores de 15: em breve.
          </p>

          {/* Consent Checkbox */}
          <div className="mt-8 rounded-2xl border border-[#E4E7E3] bg-white p-5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasConsent}
                onChange={(e) => setHasConsent(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-[#E4E7E3] text-[#2F5D46] focus:ring-[#2F5D46] accent-[#2F5D46] cursor-pointer"
              />
              <span className="text-xs leading-relaxed text-[#5B5F5C]">
                Sou pai, mãe ou responsável legal e concordo com a{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenPrivacy();
                  }}
                  className="font-medium text-[#2F5D46] underline underline-offset-2 hover:text-[#264C39]"
                >
                  Política de Privacidade
                </button>{' '}
                e os{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenTerms();
                  }}
                  className="font-medium text-[#2F5D46] underline underline-offset-2 hover:text-[#264C39]"
                >
                  Termos de Uso
                </button>
                . Autorizo o uso das respostas apenas para gerar o resultado.
              </span>
            </label>
          </div>

          {/* Continue button */}
          <div className="mt-8">
            <button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className={`w-full min-h-[56px] rounded-full px-8 py-4 text-center text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer ${
                canContinue
                  ? 'bg-[#2F5D46] hover:bg-[#264C39] hover:shadow-lg active:scale-[0.98]'
                  : 'bg-[#5B5F5C]/40 cursor-not-allowed opacity-60 shadow-none'
              }`}
            >
              <span>CONTINUAR</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

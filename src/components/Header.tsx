import React from 'react';
import { BRAND_NAME } from '../config';

interface HeaderProps {
  onStartQuiz?: () => void;
  showStartButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onStartQuiz, showStartButton = true }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E4E7E3] bg-[#FAF9F6]/90 backdrop-blur-md transition-colors safe-area-top">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4 sm:px-6">
        {/* Brand name in Playfair serif */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5D46] text-white shadow-sm">
            <span className="font-serif text-base font-bold leading-none">Q</span>
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-[#1B1B1B] sm:text-xl">
            {BRAND_NAME}
          </span>
        </div>

        {/* Small header action on landing page */}
        {showStartButton && onStartQuiz && (
          <button
            onClick={onStartQuiz}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#2F5D46] px-4 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#264C39] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2F5D46] focus:ring-offset-2"
          >
            Iniciar quiz
          </button>
        )}
      </div>
    </header>
  );
};

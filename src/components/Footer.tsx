import React from 'react';
import { BRAND_NAME, PRIVACY_URL, TERMS_URL, SUPPORT_URL } from '../config';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  return (
    <footer className="w-full border-t border-[#E4E7E3] bg-[#FAF9F6] py-10 safe-area-bottom">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 text-center">
        <p className="font-serif text-base font-bold text-[#1B1B1B]">{BRAND_NAME}</p>
        
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#5B5F5C]">
          Aviso legal: Este aplicativo oferece uma ferramenta de triagem comportamental com caráter puramente informativo e indicativo, baseada em critérios observacionais do DSM-5. Não constitui diagnóstico médico, psicológico ou psiquiátrico e não substitui a consulta presencial com profissionais de saúde qualificados.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#5B5F5C]">
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="hover:text-[#2F5D46] underline-offset-4 hover:underline transition-colors"
          >
            Política de Privacidade
          </button>
          <span className="text-[#E4E7E3]">·</span>
          <button
            type="button"
            onClick={onOpenTerms}
            className="hover:text-[#2F5D46] underline-offset-4 hover:underline transition-colors"
          >
            Termos de Uso
          </button>
          <span className="text-[#E4E7E3]">·</span>
          <a
            href={SUPPORT_URL}
            className="hover:text-[#2F5D46] underline-offset-4 hover:underline transition-colors"
          >
            Suporte e Contato
          </a>
        </div>

        <p className="mt-6 text-[11px] text-[#5B5F5C]/80">
          © {new Date().getFullYear()} {BRAND_NAME}. Todos os direitos reservados. Conforme a LGPD (Lei Geral de Proteção de Dados).
        </p>
      </div>
    </footer>
  );
};

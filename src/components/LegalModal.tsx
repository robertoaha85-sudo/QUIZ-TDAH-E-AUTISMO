import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { BRAND_NAME } from '../config';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="relative flex flex-col w-full max-w-lg max-h-[85dvh] rounded-2xl bg-[#FAF9F6] border border-[#E4E7E3] shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4E7E3] px-6 py-4 bg-white/60">
          <div className="flex items-center gap-2 text-[#2F5D46]">
            {type === 'privacy' ? <ShieldCheck className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            <h3 id="legal-modal-title" className="font-serif text-lg font-bold text-[#1B1B1B]">
              {type === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#5B5F5C] hover:bg-[#E8EFEA] hover:text-[#1B1B1B] transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-[#5B5F5C] leading-relaxed space-y-4">
          {type === 'privacy' ? (
            <>
              <p className="font-semibold text-[#1B1B1B]">
                Compromisso com a LGPD e Proteção dos seus Dados
              </p>
              <p>
                No <strong>{BRAND_NAME}</strong>, a privacidade e a segurança das informações sobre o desenvolvimento de crianças e adolescentes são prioridade absoluta.
              </p>
              <p>
                <strong>1. Dados coletados:</strong> Coletamos unicamente a faixa etária indicada e as respostas selecionadas durante o questionário de 20 perguntas. Não armazenamos nomes completos de menores nem dados clínicos sensíveis vinculados a documentos civis em servidores abertos.
              </p>
              <p>
                <strong>2. Finalidade exclusiva:</strong> As respostas são processadas exclusivamente para calcular a pontuação dos Blocos 1 e 2 e renderizar o relatório indicativo visual.
              </p>
              <p>
                <strong>3. Armazenamento seguro:</strong> O progresso e a sessão são mantidos com segurança e criptografia no seu navegador e não são comercializados com anunciantes ou terceiros.
              </p>
              <p>
                <strong>4. Seus direitos:</strong> Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode a qualquer momento limpar seus dados locais simplesmente reiniciando o teste ou limpando os dados de navegação.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-[#1B1B1B]">
                Termos de Uso do Serviço de Triagem
              </p>
              <p>
                Ao utilizar o <strong>{BRAND_NAME}</strong>, você declara ser pai, mãe ou responsável legal pela criança ou adolescente em questão e concorda com as seguintes condições:
              </p>
              <p>
                <strong>1. Natureza indicativa (Não é Diagnóstico):</strong> Este quiz consiste em uma triagem comportamental baseada nos critérios de observação do DSM-5. Em hipótese alguma substitui consulta, anamnese clínica, exames ou diagnóstico emitido por médicos neurologistas, psiquiatras, neuropsicólogos ou equipe multiprofissional.
              </p>
              <p>
                <strong>2. Responsabilidade do usuário:</strong> O relatório gerado deve ser utilizado como um instrumento de apoio e organização pessoal para conversas com profissionais de saúde e educação.
              </p>
              <p>
                <strong>3. Pagamento e Acesso:</strong> O preenchimento do questionário é gratuito. A taxa de {BRAND_NAME} refere-se à liberação do relatório completo sintetizado e detalhado com orientações e métricas por bloco.
              </p>
              <p>
                <strong>4. Propriedade Intelectual:</strong> Todos os textos, metodologias de cálculo e layouts são protegidos pela legislação de direitos autorais.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E4E7E3] px-6 py-4 bg-[#FAF9F6] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#2F5D46] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#264C39] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

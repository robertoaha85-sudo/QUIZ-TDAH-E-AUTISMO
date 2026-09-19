import { AgeGroup, BlockEvaluation, ScoreLevel } from '../types';

export function calculateScoreLevel(score: number): {
  level: ScoreLevel;
  levelLabel: 'Poucos indicativos' | 'Alguns indicativos' | 'Muitos indicativos';
} {
  if (score <= 9) {
    return { level: 'low', levelLabel: 'Poucos indicativos' };
  }
  if (score <= 19) {
    return { level: 'moderate', levelLabel: 'Alguns indicativos' };
  }
  return { level: 'high', levelLabel: 'Muitos indicativos' };
}

export function evaluateBlock1(score: number, ageGroup: AgeGroup): BlockEvaluation {
  const { level, levelLabel } = calculateScoreLevel(score);
  const percentage = Math.round((score / 30) * 100);

  let summary = '';
  const keyInsights: string[] = [];

  if (level === 'low') {
    summary =
      'As respostas fornecidas indicam baixa frequência de comportamentos atípicos de comunicação social, sensibilidade sensorial ou rigidez de rotina. Os padrões relatados estão, em sua maioria, alinhados com o desenvolvimento neurotípico esperado para a faixa etária.';
    keyInsights.push('Contato visual e reciprocidade social preservados no relato.');
    keyInsights.push('Flexibilidade comportamental diante de alterações normais de rotina.');
    keyInsights.push('Boa capacidade de interação com colegas e familiares.');
  } else if (level === 'moderate') {
    summary =
      'Foram pontuados comportamentos pontuais relacionados à comunicação social, sensibilidades sensoriais ou preferência por previsibilidade. Esses traços podem ser variações do desenvolvimento ou sinais iniciais que merecem monitoramento cuidadoso em parceria com a escola e um profissional de saúde infantil.';
    keyInsights.push('Alguns padrões de rigidez ou sensibilidade sensorial relatados com frequência moderada.');
    keyInsights.push('Necessidade de observar se há prejuízo funcional na escola ou na socialização.');
    keyInsights.push('Recomenda-se registrar em quais momentos os desconfortos ocorrem com maior intensidade.');
  } else {
    summary =
      'O conjunto de respostas aponta para uma concentração significativa de sinais associados ao espectro do autismo (TEA), como desafios na reciprocidade social, padrões repetitivos, sensibilidades sensoriais marcantes ou forte apego a rotinas. Este resultado não constitui diagnóstico, mas é um forte indicativo da importância de buscar uma avaliação especializada formal.';
    keyInsights.push('Sinais frequentes em múltiplas dimensões do comportamento social e sensorial.');
    keyInsights.push('Possível sobrecarga emocional em ambientes com excesso de estímulos.');
    keyInsights.push('Importância de uma avaliação multiprofissional para acolhimento e suporte precoce.');
  }

  return {
    blockId: 1,
    title: 'Comunicação e comportamento',
    condition: 'Sinais relacionados ao espectro do autismo',
    score,
    maxScore: 30,
    percentage,
    level,
    levelLabel,
    summary,
    keyInsights,
  };
}

export function evaluateBlock2(score: number, ageGroup: AgeGroup): BlockEvaluation {
  const { level, levelLabel } = calculateScoreLevel(score);
  const percentage = Math.round((score / 30) * 100);

  let summary = '';
  const keyInsights: string[] = [];

  if (level === 'low') {
    summary =
      'As respostas indicam níveis de atenção, controle inibitório e agitação motora dentro do esperado para o estágio de desenvolvimento relatado. Distrações pontuais são comuns na infância e adolescência e não parecem configurar um padrão persistente de desatenção ou hiperatividade.';
    keyInsights.push('Capacidade satisfatória de sustentar foco em tarefas apropriadas para a idade.');
    keyInsights.push('Controle razoável de impulsos e tolerância à espera de sua vez.');
    keyInsights.push('Inquietação motora dentro de parâmetros normais de energia.');
  } else if (level === 'moderate') {
    summary =
      'Há indicativos intermediários de desatenção, desorganização ou inquietação motora. Em fases de transição escolar ou momentos de cansaço, esses comportamentos podem se acentuar. Vale a pena verificar se tais episódios acontecem em mais de um ambiente (ex.: tanto em casa quanto na escola).';
    keyInsights.push('Dificuldade ocasional para concluir tarefas com muitas etapas.');
    keyInsights.push('Sinais de distração ou esquecimento que afetam a rotina com frequência intermediária.');
    keyInsights.push('Importante verificar a percepção dos professores sobre rendimento e foco em sala.');
  } else {
    summary =
      'As respostas evidenciam um índice elevado de sintomas compatíveis com o perfil de TDAH (Transtorno do Déficit de Atenção com Hiperatividade/Impulsividade). Nota-se impacto expressivo no foco sustentado, na organização e/ou na regulação da agitação física e impulsividade. Uma avaliação clínica detalhada é altamente recomendada para compreender a origem desses desafios e promover estratégias de apoio.';
    keyInsights.push('Desatenção acentuada com impacto direto no cumprimento de tarefas diárias.');
    keyInsights.push('Agitação física ou impulsividade verbal com manifestação frequente.');
    keyInsights.push('Critérios do DSM-5 requerem que os sintomas se manifestem em dois ou mais ambientes.');
  }

  return {
    blockId: 2,
    title: 'Atenção e agitação',
    condition: 'Sinais relacionados ao TDAH (Atenção, Hiperatividade e Impulsividade)',
    score,
    maxScore: 30,
    percentage,
    level,
    levelLabel,
    summary,
    keyInsights,
  };
}

export interface ProfessionalRecommendation {
  specialty: string;
  role: string;
  whenToConsult: string;
}

export const RECOMMENDED_PROFESSIONALS: ProfessionalRecommendation[] = [
  {
    specialty: 'Neuropediatra ou Psiquiatra Infantil',
    role: 'Médicos especialistas responsáveis pelo diagnóstico clínico formal, solicitação de exames diferenciais e condução do plano terapêutico.',
    whenToConsult: 'Primeiro passo médico recomendado quando há pontuações moderadas a altas nos blocos.',
  },
  {
    specialty: 'Neuropsicólogo(a)',
    role: 'Realiza a avaliação neuropsicológica por meio de testes padronizados de memória, atenção, funções executivas e cognição social.',
    whenToConsult: 'Fundamental para mapear potencialidades e fragilidades cognitivas em detalhes.',
  },
  {
    specialty: 'Psicólogo(a) / Terapia Cognitivo-Comportamental (TCC)',
    role: 'Atua no manejo de comportamento, regulação emocional, habilidades sociais e apoio na rotina de estudos.',
    whenToConsult: 'Auxilia no desenvolvimento de autonomia, redução da ansiedade e orientação aos pais.',
  },
  {
    specialty: 'Terapeuta Ocupacional (TO com Integração Sensorial)',
    role: 'Especialista em processamento sensorial, planejamento motor e adaptação de atividades de vida diária.',
    whenToConsult: 'Indicado se houver incômodos com texturas, sons, equilíbrio ou desorganização motora.',
  },
  {
    specialty: 'Fonoaudiólogo(a)',
    role: 'Avalia aspectos da linguagem expressiva, compreensiva, pragmática (uso social da fala) e processamento auditivo central.',
    whenToConsult: 'Recomendado se houver ecolalia, atraso de fala ou dificuldade em manter diálogos recíprocos.',
  },
];

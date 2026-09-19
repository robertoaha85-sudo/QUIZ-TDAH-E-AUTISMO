/**
 * Tipos centrais do Quiz TDAH e Autismo
 */

export type ScreenState =
  | 'landing'
  | 'age'
  | 'intro1'
  | 'quiz'
  | 'intro2'
  | 'loading'
  | 'paywall'
  | 'result';

export type AgeGroup = '4-11' | '12-15';

export interface QuestionOption {
  label: string;
  score: number;
}

export interface Question {
  id: number;
  blockId: 1 | 2;
  blockTitle: string;
  category: string;
  text: string;
  hint?: string;
}

export interface QuizSession {
  id: string;
  ageGroup: AgeGroup;
  answers: Record<number, number>; // questionId -> score (0-3)
  block1Score: number; // 0-30
  block2Score: number; // 0-30
  totalScore: number;  // 0-60
  isPaid: boolean;
  createdAt: string;
  completedAt?: string;
}

export type ScoreLevel = 'low' | 'moderate' | 'high';

export interface BlockEvaluation {
  blockId: 1 | 2;
  title: string;
  condition: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: ScoreLevel;
  levelLabel: 'Poucos indicativos' | 'Alguns indicativos' | 'Muitos indicativos';
  summary: string;
  keyInsights: string[];
}

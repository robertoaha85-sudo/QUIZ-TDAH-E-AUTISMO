import React, { useState, useEffect, useCallback } from 'react';
import { AgeGroup, Question, QuizSession, ScreenState } from './types';
import { QUESTIONS } from './data/questions';
import {
  submitAnswers,
  getResult,
  getCurrentSession,
  saveCurrentSession,
  markSessionAsPaid,
  clearCurrentSession,
} from './services/sessionService';
import { LandingScreen } from './components/LandingScreen';
import { AgeSelectionScreen } from './components/AgeSelectionScreen';
import { BlockIntroScreen } from './components/BlockIntroScreen';
import { QuizQuestionScreen } from './components/QuizQuestionScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { PaywallScreen } from './components/PaywallScreen';
import { ResultScreen } from './components/ResultScreen';
import { LegalModal } from './components/LegalModal';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('landing');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('4-11');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Initialize from URL or saved session
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionParam = urlParams.get('session');
      const path = window.location.pathname;

      if (sessionParam) {
        const found = getResult(sessionParam);
        if (found) {
          setActiveSession(found);
          setCurrentSessionId(found.id);
          setAgeGroup(found.ageGroup);
          setAnswers(found.answers);

          if (found.isPaid || path.includes('resultado')) {
            if (found.isPaid) {
              setScreen('result');
            } else {
              setScreen('paywall');
            }
            return;
          }
        }
      }

      // Check current in-progress local session
      const current = getCurrentSession();
      if (current) {
        setActiveSession(current);
        setCurrentSessionId(current.id);
        setAgeGroup(current.ageGroup);
        setAnswers(current.answers || {});
      }
    } catch {
      // Storage/URL parse safety
    }
  }, []);

  // Update URL helper without page reload
  const updateUrlParam = useCallback((param: string, val: string | null) => {
    try {
      const url = new URL(window.location.href);
      if (val) {
        url.searchParams.set(param, val);
      } else {
        url.searchParams.delete(param);
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore
    }
  }, []);

  // Navigation handlers
  const handleStartFromLanding = () => {
    setScreen('age');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAgeGroup = (selectedAge: AgeGroup) => {
    setAgeGroup(selectedAge);
    setScreen('intro1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBlock1 = () => {
    setCurrentQuestionIndex(1);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBlock2 = () => {
    setCurrentQuestionIndex(11);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (score: number) => {
    const updatedAnswers = { ...answers, [currentQuestionIndex]: score };
    setAnswers(updatedAnswers);

    // If it's question 10, advance to Block 2 Intro
    if (currentQuestionIndex === 10) {
      setScreen('intro2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If questions 1..9 or 11..19, advance to next question
    if (currentQuestionIndex < 20) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuizBack = () => {
    if (currentQuestionIndex === 1) {
      setScreen('intro1');
      return;
    }
    if (currentQuestionIndex === 11) {
      // Back to question 10
      setCurrentQuestionIndex(10);
      return;
    }
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleFinishQuiz = () => {
    // Advance to loading screen and submit answers
    const session = submitAnswers(ageGroup, answers, currentSessionId || undefined);
    setCurrentSessionId(session.id);
    setActiveSession(session);
    updateUrlParam('session', session.id);
    setScreen('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadingComplete = () => {
    setScreen('paywall');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckIfPaid = () => {
    const session = getResult(currentSessionId);
    if (session && session.isPaid) {
      setActiveSession(session);
      setScreen('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('O pagamento ainda não foi identificado. Se você já pagou, aguarde alguns instantes ou recarregue a página.');
    }
  };

  const handleSimulateDemoPay = () => {
    if (currentSessionId) {
      const updated = markSessionAsPaid(currentSessionId);
      if (updated) {
        setActiveSession(updated);
        setScreen('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleRetakeQuiz = () => {
    clearCurrentSession();
    setAnswers({});
    setCurrentQuestionIndex(1);
    setCurrentSessionId('');
    setActiveSession(null);
    updateUrlParam('session', null);
    setScreen('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestion: Question =
    QUESTIONS.find((q) => q.id === currentQuestionIndex) || QUESTIONS[0];

  return (
    <div className="min-h-[100dvh] w-full bg-[#FAF9F6] text-[#1B1B1B]">
      {/* SCREEN 1: LANDING */}
      {screen === 'landing' && (
        <LandingScreen
          onStartQuiz={handleStartFromLanding}
          onOpenPrivacy={() => setLegalModalType('privacy')}
          onOpenTerms={() => setLegalModalType('terms')}
        />
      )}

      {/* SCREEN 2: AGE SELECTION */}
      {screen === 'age' && (
        <AgeSelectionScreen
          initialAgeGroup={ageGroup}
          onSelect={handleSelectAgeGroup}
          onBack={() => setScreen('landing')}
          onOpenPrivacy={() => setLegalModalType('privacy')}
          onOpenTerms={() => setLegalModalType('terms')}
        />
      )}

      {/* SCREEN 3: INTRO BLOCK 1 */}
      {screen === 'intro1' && (
        <BlockIntroScreen
          blockId={1}
          onStart={handleStartBlock1}
          onBack={() => setScreen('age')}
        />
      )}

      {/* SCREEN 4 & 6: QUESTIONS */}
      {screen === 'quiz' && (
        <QuizQuestionScreen
          question={currentQuestion}
          currentIndex={currentQuestionIndex}
          totalQuestions={QUESTIONS.length}
          currentAnswer={answers[currentQuestionIndex]}
          onSelectOption={handleSelectOption}
          onBack={handleQuizBack}
          onFinishQuiz={handleFinishQuiz}
        />
      )}

      {/* SCREEN 5: INTRO BLOCK 2 */}
      {screen === 'intro2' && (
        <BlockIntroScreen
          blockId={2}
          onStart={handleStartBlock2}
          onBack={() => {
            setCurrentQuestionIndex(10);
            setScreen('quiz');
          }}
        />
      )}

      {/* SCREEN 7: LOADING (10 SECONDS) */}
      {screen === 'loading' && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* SCREEN 8: PAYWALL */}
      {screen === 'paywall' && (
        <PaywallScreen
          sessionId={currentSessionId}
          onPaymentSuccess={() => {
            if (currentSessionId) {
              const updated = markSessionAsPaid(currentSessionId);
              if (updated) {
                setActiveSession(updated);
              }
            }
            setScreen('result');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onViewResult={handleCheckIfPaid}
          onSimulateDemoPay={handleSimulateDemoPay}
        />
      )}

      {/* SCREEN 9: RESULT */}
      {screen === 'result' && activeSession && (
        <ResultScreen
          session={activeSession}
          onRetakeQuiz={handleRetakeQuiz}
          onOpenPrivacy={() => setLegalModalType('privacy')}
          onOpenTerms={() => setLegalModalType('terms')}
        />
      )}

      {/* Fallback if result screen reached without session */}
      {screen === 'result' && !activeSession && (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-[#1B1B1B]">
            Nenhuma sessão ativa encontrada
          </h2>
          <p className="mt-2 text-sm text-[#5B5F5C]">
            Por favor, inicie o questionário para calcular seu indicativo.
          </p>
          <button
            type="button"
            onClick={handleRetakeQuiz}
            className="mt-6 rounded-full bg-[#2F5D46] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            Ir para o início
          </button>
        </div>
      )}

      {/* Legal Modal (Privacy & Terms) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}

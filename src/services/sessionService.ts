import { AgeGroup, QuizSession } from '../types';

const STORAGE_KEY_CURRENT = 'quiz_tdah_autismo_current_session';
const STORAGE_KEY_ALL = 'quiz_tdah_autismo_sessions';

// Safe localStorage access
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function getAllSessions(): Record<string, QuizSession> {
  return getFromStorage<Record<string, QuizSession>>(STORAGE_KEY_ALL, {});
}

export function getResult(sessionId: string): QuizSession | null {
  if (!sessionId) return null;
  const all = getAllSessions();
  if (all[sessionId]) {
    return all[sessionId];
  }
  const current = getFromStorage<QuizSession | null>(STORAGE_KEY_CURRENT, null);
  if (current && current.id === sessionId) {
    return current;
  }
  return null;
}

export function getCurrentSession(): QuizSession | null {
  return getFromStorage<QuizSession | null>(STORAGE_KEY_CURRENT, null);
}

export function saveCurrentSession(session: QuizSession): void {
  setToStorage(STORAGE_KEY_CURRENT, session);
  const all = getAllSessions();
  all[session.id] = session;
  setToStorage(STORAGE_KEY_ALL, all);
}

export function submitAnswers(
  ageGroup: AgeGroup,
  answers: Record<number, number>,
  existingSessionId?: string
): QuizSession {
  let block1Score = 0;
  let block2Score = 0;

  for (let i = 1; i <= 10; i++) {
    block1Score += answers[i] || 0;
  }
  for (let i = 11; i <= 20; i++) {
    block2Score += answers[i] || 0;
  }

  const id = existingSessionId || generateSessionId();

  const session: QuizSession = {
    id,
    ageGroup,
    answers,
    block1Score,
    block2Score,
    totalScore: block1Score + block2Score,
    isPaid: false,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  saveCurrentSession(session);
  return session;
}

export function markSessionAsPaid(sessionId: string): QuizSession | null {
  const session = getResult(sessionId);
  if (!session) return null;
  session.isPaid = true;
  saveCurrentSession(session);
  return session;
}

export function clearCurrentSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CURRENT);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Event tracking helper (InitiateCheckout, CompleteQuiz, etc.)
 */
export function track(eventName: string, data?: Record<string, unknown>): void {
  try {
    if (typeof window !== 'undefined') {
      // Custom event dispatch for analytics
      window.dispatchEvent(
        new CustomEvent('analytics_event', {
          detail: { eventName, data, timestamp: Date.now() },
        })
      );
      // Optional support for standard dataLayer or fbq
      if ((window as unknown as { dataLayer?: unknown[] }).dataLayer) {
        (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
          event: eventName,
          ...data,
        });
      }
    }
  } catch {
    // Silently continue
  }
}

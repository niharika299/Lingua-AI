import { recordActivityCompletion, mapNeuroPlaySessionToActivityRecord } from './activityTracker';
import { logDldActivity } from './dldActivityStore';

export interface NeuroPlaySession {
  id: string;
  gameId: string;
  gameName: string;
  completedAt: string; // ISO Date string e.g. "2026-10-01T23:45:00.000Z"
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number; // percentage e.g. 80
  score: number;
  completionStatus: 'completed';
}

export interface WeeklyAchievement {
  id: string;
  title: string;
  description: string;
  currentCount: number;
  requiredCount: number;
  isEarned: boolean;
  emoji: string;
}

const STORAGE_KEY = 'lingua_neuroplay_sessions';

/**
 * Saves a completed game session to localStorage
 */
export function saveNeuroPlaySession(sessionData: {
  gameId: string;
  gameName: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}): NeuroPlaySession {
  const total = Math.max(1, sessionData.totalQuestions);
  const correct = Math.min(total, Math.max(0, sessionData.correctAnswers));
  const incorrect = Math.max(0, total - correct);
  const accuracy = Math.round((correct / total) * 100);

  const newSession: NeuroPlaySession = {
    id: `nps_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    gameId: sessionData.gameId,
    gameName: sessionData.gameName,
    completedAt: new Date().toISOString(),
    totalQuestions: total,
    correctAnswers: correct,
    incorrectAnswers: incorrect,
    accuracy,
    score: sessionData.score,
    completionStatus: 'completed',
  };

  try {
    const existing = getNeuroPlaySessions();
    const updated = [newSession, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Register in unified activity tracker
    const mapped = mapNeuroPlaySessionToActivityRecord(newSession);
    recordActivityCompletion({
      id: mapped.id,
      activityType: mapped.activityType,
      activityName: mapped.activityName,
      category: mapped.category,
      source: 'NeuroPlay',
      score: mapped.score,
      accuracy: mapped.accuracy,
      metadata: mapped.metadata,
    });

    // Log in DLD Centralized Store for Real Live Analytics
    let modality: 'Vocabulary' | 'Phonics' | 'NeuroPlay' | 'Reading' = 'NeuroPlay';
    const nameLower = sessionData.gameName.toLowerCase();
    if (nameLower.includes('vocab') || nameLower.includes('detective') || nameLower.includes('naming')) {
      modality = 'Vocabulary';
    } else if (nameLower.includes('phon') || nameLower.includes('artic') || nameLower.includes('syllable')) {
      modality = 'Phonics';
    } else if (nameLower.includes('read') || nameLower.includes('scan') || nameLower.includes('story')) {
      modality = 'Reading';
    }

    logDldActivity({
      taskName: sessionData.gameName,
      accuracy,
      points: sessionData.score,
      modality,
    });
  } catch (e) {
    console.error('Failed to save NeuroPlay session to storage:', e);
  }

  return newSession;
}

/**
 * Retrieves all stored completed game sessions sorted by newest first
 */
export function getNeuroPlaySessions(): NeuroPlaySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.error('Failed to parse NeuroPlay sessions from storage:', e);
  }
  return [];
}

/**
 * Clears all recorded NeuroPlay sessions
 */
export function clearNeuroPlaySessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear NeuroPlay sessions:', e);
  }
}

/**
 * Calculates current calendar week achievements from real session activity
 */
export function getWeeklyAchievements(): WeeklyAchievement[] {
  const sessions = getNeuroPlaySessions();

  // Calculate start of current local calendar week (Monday at 00:00:00)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday
  const distanceToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMon, 0, 0, 0, 0);

  // Filter sessions in current week
  const currentWeekSessions = sessions.filter((s) => new Date(s.completedAt) >= startOfWeek);

  let vocabCount = 0;
  let storyCount = 0;
  let listeningCount = 0;
  let sentenceCount = 0;
  let practiceCount = currentWeekSessions.length;
  let readingCount = 0;
  let communicationCount = 0;

  currentWeekSessions.forEach((s) => {
    switch (s.gameId) {
      case 'word-match':
      case 'word-detective':
        vocabCount += 1;
        readingCount += 1;
        break;
      case 'listen-choose':
        listeningCount += 1;
        break;
      case 'sentence-builder':
        sentenceCount += 1;
        break;
      case 'story-order':
        storyCount += 1;
        readingCount += 1;
        break;
      case 'social-scene':
        communicationCount += 1;
        break;
      case 'emotion-explorer':
        communicationCount += 1;
        vocabCount += 1;
        break;
      case 'instruction-mission':
        listeningCount += 1;
        sentenceCount += 1;
        break;
      case 'memory-words':
        vocabCount += 1;
        listeningCount += 1;
        break;
      default:
        vocabCount += 1;
        break;
    }
  });

  return [
    {
      id: 'vocab_explorer',
      title: 'Vocabulary Explorer',
      description: 'Complete 5 vocabulary activities this week.',
      currentCount: vocabCount,
      requiredCount: 5,
      isEarned: vocabCount >= 5,
      emoji: '🎯',
    },
    {
      id: 'story_builder',
      title: 'Story Builder',
      description: 'Complete 5 narrative activities this week.',
      currentCount: storyCount,
      requiredCount: 5,
      isEarned: storyCount >= 5,
      emoji: '📚',
    },
    {
      id: 'listening_star',
      title: 'Listening Star',
      description: 'Complete 5 listening activities this week.',
      currentCount: listeningCount,
      requiredCount: 5,
      isEarned: listeningCount >= 5,
      emoji: '👂',
    },
    {
      id: 'sentence_builder',
      title: 'Sentence Builder',
      description: 'Complete 5 sentence activities this week.',
      currentCount: sentenceCount,
      requiredCount: 5,
      isEarned: sentenceCount >= 5,
      emoji: '🧩',
    },
    {
      id: 'practice_champion',
      title: 'Practice Champion',
      description: 'Complete 5 NeuroPlay game sessions this week.',
      currentCount: practiceCount,
      requiredCount: 5,
      isEarned: practiceCount >= 5,
      emoji: '🏆',
    },
    {
      id: 'reading_explorer',
      title: 'Reading Explorer',
      description: 'Complete 5 reading activities this week.',
      currentCount: readingCount,
      requiredCount: 5,
      isEarned: readingCount >= 5,
      emoji: '📖',
    },
    {
      id: 'communication_explorer',
      title: 'Communication Explorer',
      description: 'Complete 5 communication activities this week.',
      currentCount: communicationCount,
      requiredCount: 5,
      isEarned: communicationCount >= 5,
      emoji: '💬',
    },
  ];
}

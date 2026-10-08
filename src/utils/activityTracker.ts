import { getNeuroPlaySessions, NeuroPlaySession } from './neuroplayStorage';

export type ActivityType =
  | 'game'
  | 'reading'
  | 'listening'
  | 'comprehension'
  | 'vocabulary'
  | 'expression'
  | 'storytelling'
  | 'socialCommunication'
  | 'instructionPractice'
  | 'supportTool'
  | 'readAndListen';

export type ActivityCategory =
  | 'Vocabulary'
  | 'Listening'
  | 'Comprehension'
  | 'Reading'
  | 'Expression / Speaking'
  | 'Storytelling'
  | 'Social Communication'
  | 'Following Instructions'
  | 'Support Tools'
  | 'Read & Listen'
  | 'NeuroPlay Games';

export interface ActivityRecord {
  id: string;
  activityType: ActivityType;
  activityName: string;
  category: ActivityCategory;
  source: string; // e.g. "NeuroPlay", "Read & Listen", "Support Tools", "Language Tools", "Book Scanner"
  startedAt?: string;
  completedAt: string;
  durationSeconds?: number;
  completed: boolean;
  score?: number;
  accuracy?: number;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'lingua_activity_records';

/**
 * Retrieves stored activity records sorted newest first.
 * Automatically merges legacy NeuroPlay sessions to ensure no lost history while preventing duplicates.
 */
export function getActivityRecords(): ActivityRecord[] {
  let records: ActivityRecord[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        records = parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse activity records from localStorage:', e);
  }

  // Deduplicate against existing NeuroPlay sessions if they were recorded in neuroplayStorage
  const existingIds = new Set(records.map((r) => r.id));
  const neuroSessions = getNeuroPlaySessions();

  neuroSessions.forEach((session) => {
    if (!existingIds.has(session.id)) {
      const converted = mapNeuroPlaySessionToActivityRecord(session);
      records.push(converted);
      existingIds.add(session.id);
    }
  });

  // Sort newest first
  records.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return records;
}

/**
 * Maps a NeuroPlay session to a unified ActivityRecord
 */
export function mapNeuroPlaySessionToActivityRecord(session: NeuroPlaySession): ActivityRecord {
  let category: ActivityCategory = 'NeuroPlay Games';
  let activityType: ActivityType = 'game';

  switch (session.gameId) {
    case 'word-match':
    case 'word-detective':
    case 'memory-words':
      category = 'Vocabulary';
      activityType = 'vocabulary';
      break;
    case 'listen-choose':
      category = 'Listening';
      activityType = 'listening';
      break;
    case 'sentence-builder':
      category = 'Expression / Speaking';
      activityType = 'expression';
      break;
    case 'story-order':
      category = 'Storytelling';
      activityType = 'storytelling';
      break;
    case 'social-scene':
    case 'emotion-explorer':
      category = 'Social Communication';
      activityType = 'socialCommunication';
      break;
    case 'instruction-mission':
      category = 'Following Instructions';
      activityType = 'instructionPractice';
      break;
    default:
      category = 'NeuroPlay Games';
      activityType = 'game';
      break;
  }

  return {
    id: session.id,
    activityType,
    activityName: session.gameName,
    category,
    source: 'NeuroPlay',
    completedAt: session.completedAt,
    completed: true,
    score: session.score,
    accuracy: session.accuracy,
    metadata: {
      totalQuestions: session.totalQuestions,
      correctAnswers: session.correctAnswers,
      gameId: session.gameId,
    },
  };
}

/**
 * Records a completed activity event in the unified tracking log.
 * Prevents duplicate creation if a record with the same ID already exists.
 */
export function recordActivityCompletion(params: {
  id?: string;
  activityType: ActivityType;
  activityName: string;
  category: ActivityCategory;
  source: string;
  startedAt?: string;
  durationSeconds?: number;
  score?: number;
  accuracy?: number;
  metadata?: Record<string, any>;
}): ActivityRecord {
  const recordId = params.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const completedAt = new Date().toISOString();

  const newRecord: ActivityRecord = {
    id: recordId,
    activityType: params.activityType,
    activityName: params.activityName,
    category: params.category,
    source: params.source,
    startedAt: params.startedAt,
    completedAt,
    durationSeconds: params.durationSeconds,
    completed: true,
    score: typeof params.score === 'number' ? params.score : undefined,
    accuracy: typeof params.accuracy === 'number' ? params.accuracy : undefined,
    metadata: params.metadata,
  };

  try {
    const currentRecords = getActivityRecords();

    // Prevent duplicate entries if ID already recorded
    if (currentRecords.some((r) => r.id === recordId)) {
      return currentRecords.find((r) => r.id === recordId)!;
    }

    const updated = [newRecord, ...currentRecords];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch event so UI subscribers update in real time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lingua_activity_recorded', { detail: newRecord }));
    }
  } catch (e) {
    console.error('Failed to save activity record:', e);
  }

  return newRecord;
}

/**
 * Clears all stored activity records
 */
export function clearActivityRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear activity records:', e);
  }
}

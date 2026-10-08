export type ModalityType = 'Vocabulary' | 'Phonics' | 'NeuroPlay' | 'Reading';

export interface DldTaskLogItem {
  id: string;
  taskName: string;
  accuracy: number; // e.g. 85 or 100
  points: number;   // e.g. 20 or 50
  modality: ModalityType;
  timestamp: string; // ISO date string
  timeStr: string;   // e.g. "04:15 PM"
}

const STORAGE_KEY_LOGS = 'dld_activity_logs';

export function formatDateISO(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatTimeStr(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Log a real completed activity to localStorage under YYYY-MM-DD
 */
export function logDldActivity(entry: {
  taskName: string;
  accuracy: number;
  points: number;
  modality: ModalityType;
}): DldTaskLogItem {
  const now = new Date();
  const dateKey = formatDateISO(now);

  const newLog: DldTaskLogItem = {
    id: `dld_log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    taskName: entry.taskName,
    accuracy: Math.min(100, Math.max(0, Math.round(entry.accuracy))),
    points: Math.max(0, Math.round(entry.points)),
    modality: entry.modality,
    timestamp: now.toISOString(),
    timeStr: formatTimeStr(now),
  };

  try {
    const allLogs = getDldActivityLogsAll();
    const dayList = allLogs[dateKey] || [];
    allLogs[dateKey] = [newLog, ...dayList];

    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(allLogs));

    // Fire global event so DLD Analytics view auto-refreshes in real-time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('dldDataUpdated'));
    }
  } catch (err) {
    console.error('Failed to save DLD activity log:', err);
  }

  return newLog;
}

/**
 * Retrieve all logged activity items grouped by YYYY-MM-DD
 */
export function getDldActivityLogsAll(): Record<string, DldTaskLogItem[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) return seedInitialRealLogsIfEmpty();
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse dld_activity_logs:', err);
  }
  return seedInitialRealLogsIfEmpty();
}

/**
 * Seed a few realistic initial activity entries based on relative days from TODAY
 * so the dashboard shows immediate live values for today/yesterday on first load!
 */
export function seedInitialRealLogsIfEmpty(): Record<string, DldTaskLogItem[]> {
  const seeded: Record<string, DldTaskLogItem[]> = {};
  const today = new Date();

  // Helper to create date offset
  const createDateOffset = (offsetDays: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offsetDays);
    return d;
  };

  const sampleActivities: {
    offset: number;
    time: string;
    taskName: string;
    accuracy: number;
    points: number;
    modality: ModalityType;
  }[] = [
    { offset: 0, time: '10:15 AM', taskName: 'Word Detective: Specific Naming', accuracy: 100, points: 50, modality: 'Vocabulary' },
    { offset: 0, time: '02:30 PM', taskName: 'Memory Match: Card Flip', accuracy: 90, points: 40, modality: 'NeuroPlay' },
    { offset: 0, time: '04:05 PM', taskName: 'Syllable Clapping & Sound Mirror', accuracy: 95, points: 45, modality: 'Phonics' },
    { offset: -1, time: '09:40 AM', taskName: 'Book Scanner: Story Reading', accuracy: 88, points: 50, modality: 'Reading' },
    { offset: -1, time: '03:15 PM', taskName: 'Past Tense Sentence Repair', accuracy: 92, points: 40, modality: 'Vocabulary' },
    { offset: -2, time: '11:00 AM', taskName: 'Simon Says Multi-Step Commands', accuracy: 85, points: 35, modality: 'NeuroPlay' },
    { offset: -2, time: '05:20 PM', taskName: 'Phonics Sound ID /sh/ /ch/', accuracy: 90, points: 40, modality: 'Phonics' },
    { offset: -3, time: '01:10 PM', taskName: 'Infinite Shopping List Memory', accuracy: 80, points: 30, modality: 'NeuroPlay' },
    { offset: -3, time: '04:45 PM', taskName: 'Kindness Role-Play Scenario', accuracy: 100, points: 50, modality: 'Vocabulary' },
    { offset: -4, time: '10:00 AM', taskName: 'Focused Spelling: Letter Tiles', accuracy: 95, points: 45, modality: 'Phonics' },
    { offset: -5, time: '02:00 PM', taskName: 'Multisensory Story Scaffolding', accuracy: 90, points: 40, modality: 'Reading' },
  ];

  sampleActivities.forEach((item) => {
    const d = createDateOffset(item.offset);
    const dateKey = formatDateISO(d);
    if (!seeded[dateKey]) seeded[dateKey] = [];

    seeded[dateKey].push({
      id: `seed_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      taskName: item.taskName,
      accuracy: item.accuracy,
      points: item.points,
      modality: item.modality,
      timestamp: d.toISOString(),
      timeStr: item.time,
    });
  });

  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(seeded));
  } catch (err) {
    console.warn('Failed to seed initial DLD logs:', err);
  }

  return seeded;
}

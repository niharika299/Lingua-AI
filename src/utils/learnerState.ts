export interface SessionRecord {
  id: string;
  module: string;
  focus: string;
  duration: string;
  status: 'Completed' | 'In Progress' | 'Verified';
  statusColor: string;
  timestamp: number;
}

export interface MilestoneRecord {
  id: string;
  timeAgo: string;
  title: string;
  description: string;
  type: 'phonics' | 'vocab' | 'game' | 'scan';
  timestamp: number;
}

export interface LearnerState {
  pagesScanned: number;
  listeningMinutes: number;
  wordsMastered: number;
  neuroplayScore: number;
  streakDays: number;
  speechTherapyRatio: number; // percentage e.g. 45
  listeningRatio: number; // percentage e.g. 35
  phonicsRatio: number; // percentage e.g. 20
  recentActivities: MilestoneRecord[];
  sessions: SessionRecord[];
}

const STORAGE_KEY = 'linguaLearnerState';

const DEFAULT_STATE: LearnerState = {
  pagesScanned: 14,
  listeningMinutes: 42,
  wordsMastered: 28,
  neuroplayScore: 220,
  streakDays: 5,
  speechTherapyRatio: 45,
  listeningRatio: 35,
  phonicsRatio: 20,
  recentActivities: [
    {
      id: 'm1',
      timeAgo: '15 Mins Ago',
      title: 'Level 3 Phonics Completed',
      description: 'Khushi passed sentence rhythm test',
      type: 'phonics',
      timestamp: Date.now() - 15 * 60 * 1000,
    },
    {
      id: 'm2',
      timeAgo: '2 Hours Ago',
      title: 'New Vocabulary Unlocked',
      description: '+8 complex words mastered',
      type: 'vocab',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      id: 'm3',
      timeAgo: 'Yesterday',
      title: 'NeuroPlay Speed Record',
      description: 'Scored 220 pts in visual-auditory sync',
      type: 'game',
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
    },
  ],
  sessions: [
    {
      id: '#LN-2041',
      module: 'Smart OCR Reader',
      focus: 'Visual Dyslexia Support',
      duration: '18 mins',
      status: 'Completed',
      statusColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      timestamp: Date.now() - 18 * 60 * 1000,
    },
    {
      id: '#LN-2038',
      module: 'Audio Verbal Agnosia Lab',
      focus: 'Acoustic Discrimination',
      duration: '24 mins',
      status: 'In Progress',
      statusColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      timestamp: Date.now() - 45 * 60 * 1000,
    },
    {
      id: '#LN-2029',
      module: 'NeuroPlay Engine',
      focus: 'Spatial-Digit Mapping',
      duration: '12 mins',
      status: 'Verified',
      statusColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
    },
  ],
};

export function getLearnerState(): LearnerState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        recentActivities: Array.isArray(parsed?.recentActivities) ? parsed.recentActivities : DEFAULT_STATE.recentActivities,
        sessions: Array.isArray(parsed?.sessions) ? parsed.sessions : DEFAULT_STATE.sessions,
      };
    }
    // Initialize default if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
  } catch (e) {
    console.error('Failed to parse linguaLearnerState:', e);
  }
  return DEFAULT_STATE;
}

export function saveLearnerState(newState: LearnerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lingua_learner_state_updated', { detail: newState }));
    }
  } catch (e) {
    console.error('Failed to save linguaLearnerState:', e);
  }
}

/**
 * Triggers when user scans a book page
 */
export function recordPageScan(title?: string): void {
  const current = getLearnerState();
  const nextScanCount = current.pagesScanned + 1;
  const newSessionId = `#LN-${Math.floor(2000 + Math.random() * 900)}`;

  const newSession: SessionRecord = {
    id: newSessionId,
    module: 'Smart OCR Reader',
    focus: title ? `Scanned: ${title.slice(0, 20)}...` : 'Visual Text Analysis',
    duration: '15 mins',
    status: 'Completed',
    statusColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    timestamp: Date.now(),
  };

  const newMilestone: MilestoneRecord = {
    id: `m_${Date.now()}`,
    timeAgo: 'Just Now',
    title: 'Book Page Analyzed',
    description: `Scanned & processed page ${nextScanCount}`,
    type: 'scan',
    timestamp: Date.now(),
  };

  const updatedState: LearnerState = {
    ...current,
    pagesScanned: nextScanCount,
    sessions: [newSession, ...current.sessions].slice(0, 10),
    recentActivities: [newMilestone, ...current.recentActivities].slice(0, 8),
  };

  saveLearnerState(updatedState);
}

/**
 * Triggers when user listens to speech audio
 */
export function recordListeningMinutes(minutes: number, moduleName: string = 'Adaptive Reader'): void {
  const current = getLearnerState();
  const nextMins = current.listeningMinutes + minutes;

  const newSessionId = `#LN-${Math.floor(2000 + Math.random() * 900)}`;
  const newSession: SessionRecord = {
    id: newSessionId,
    module: moduleName,
    focus: 'Audio Phonics & Narration',
    duration: `${minutes} mins`,
    status: 'Completed',
    statusColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    timestamp: Date.now(),
  };

  const updatedState: LearnerState = {
    ...current,
    listeningMinutes: nextMins,
    listeningRatio: Math.min(50, current.listeningRatio + 1),
    sessions: [newSession, ...current.sessions].slice(0, 10),
  };

  saveLearnerState(updatedState);
}

/**
 * Triggers when user saves/masters a vocabulary word
 */
export function recordWordMastered(word: string): void {
  const current = getLearnerState();
  const nextWords = current.wordsMastered + 1;

  const newMilestone: MilestoneRecord = {
    id: `m_${Date.now()}`,
    timeAgo: 'Just Now',
    title: 'New Vocabulary Unlocked',
    description: `Word Saved: "${word}"`,
    type: 'vocab',
    timestamp: Date.now(),
  };

  const updatedState: LearnerState = {
    ...current,
    wordsMastered: nextWords,
    speechTherapyRatio: Math.min(55, current.speechTherapyRatio + 1),
    recentActivities: [newMilestone, ...current.recentActivities].slice(0, 8),
  };

  saveLearnerState(updatedState);
}

/**
 * Triggers when user plays NeuroPlay and earns points
 */
export function recordNeuroPlayScore(points: number, gameName?: string): void {
  const current = getLearnerState();
  const nextScore = current.neuroplayScore + points;

  const newMilestone: MilestoneRecord = {
    id: `m_${Date.now()}`,
    timeAgo: 'Just Now',
    title: gameName ? `${gameName} Mastered` : 'NeuroPlay Score Boost',
    description: `Earned +${points} pts in cognitive sync`,
    type: 'game',
    timestamp: Date.now(),
  };

  const newSessionId = `#LN-${Math.floor(2000 + Math.random() * 900)}`;
  const newSession: SessionRecord = {
    id: newSessionId,
    module: gameName || 'NeuroPlay Engine',
    focus: 'Spatial-Digit Mapping',
    duration: '10 mins',
    status: 'Verified',
    statusColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    timestamp: Date.now(),
  };

  const updatedState: LearnerState = {
    ...current,
    neuroplayScore: nextScore,
    recentActivities: [newMilestone, ...current.recentActivities].slice(0, 8),
    sessions: [newSession, ...current.sessions].slice(0, 10),
  };

  saveLearnerState(updatedState);
}

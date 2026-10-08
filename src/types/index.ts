export type NavPage =
  | 'home'
  | 'about'
  | 'dashboard'
  | 'read-listen'
  | 'book-scanner'
  | 'language-tools'
  | 'neuroplay'
  | 'community'
  | 'progress'
  | 'dld'
  | 'settings'
  | 'parent-mode'
  | 'teacher-mode'
  | 'neurovani-ai';

export interface ChildProfile {
  name: string;
  age: number;
  readingLevel: 'Early Reader' | 'Developing' | 'Fluent Explorer';
  focusAreas: string[];
  theme: 'default' | 'cream' | 'lavender' | 'contrast';
  useDyslexicFont: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  speechRate: number; // 0.75 to 1.5
  robotVolume?: number; // 0.0 to 1.0 (Robot assistant speaking volume)
  highContrastText?: boolean;
  lineSpacing?: 'normal' | 'relaxed' | 'loose'; // 1.5, 1.8, 2.2 line-height
  appLanguage: string; // 'en', 'hi', 'bn', 'ta', 'te', etc.
}

export interface ScannedPage {
  id: string;
  title: string;
  imageUrl: string;
  extractedText: string;
  simplifiedText?: string;
  translatedText?: string;
  translatedLanguage?: string;
  translations?: Record<string, string>; // langCode -> translatedText
  paragraphs: string[];
  date: string;
  progressPct: number;
  wordCount?: number;
  topic?: string;
  isSample?: boolean;
}

export interface AudiobookItem {
  id: string;
  title: string;
  coverImage?: string;
  pages: ScannedPage[];
  currentPageIndex: number;
  currentAudioPosition?: number;
  playbackSpeed?: number;
  language?: string;
  durationMins?: number;
  lastPlayedDate: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  speechVoiceCode: string; // e.g. 'hi-IN', 'ta-IN', 'en-US'
}


export interface VocabularyWord {
  word: string;
  syllables: string;
  definition: string;
  example: string;
  category?: string;
  visualHint?: string;
  audioPronunciation?: string;
}

export interface BookScanResult {
  extractedText: string;
  readabilityGrade: string;
  simplifiedVersion: string;
  complexityInsights: {
    challenge: string;
    originalSentence: string;
    friendlyFix: string;
  }[];
  vocabularyList: {
    word: string;
    phonetic: string;
    visualHint: string;
    meaning: string;
  }[];
  comprehensionQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    clue: string;
  }[];
}

export interface InstructionStep {
  stepNumber: number;
  temporalMarker: string;
  actionVerb: string;
  directionText: string;
  iconCategory: string;
}

export interface InstructionBreakdownResult {
  title: string;
  totalSteps: number;
  steps: InstructionStep[];
  keyTipForChild: string;
  questionForTeacher?: string;
}

export interface SpeechCoachResult {
  praise: string;
  recastedSentence: string;
  simpleVersion: string;
  expandedVersion: string;
  communicationTip: string;
  followUpQuestion: string;
}

export interface ScreeningReport {
  disclaimer: string;
  executiveSummary: string;
  identifiedStrengths: string[];
  supportPriorityAreas: {
    area: string;
    observedTendency: string;
    recommendedIntervention: string;
  }[];
  homeStrategies: string[];
  classroomAccommodations: string[];
  specialistQuestions: string[];
  date: string;
}

export interface NeuroPlayScore {
  gameId: 'word-bridge' | 'sentence-architect' | 'audio-recall' | 'concept-match';
  gameName: string;
  score: number;
  stars: number;
  lastPlayed: string;
}

export interface SpecialistProfile {
  id: string;
  name: string;
  credentials: string;
  clinic: string;
  location: string;
  focus: string[];
  rating: number;
  telehealth: boolean;
  bio: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  role: 'Parent' | 'SLP / Specialist' | 'Special Educator' | 'Caregiver';
  title: string;
  content: string;
  category: 'IEP & School Advocacy' | 'Home Strategies' | 'Early Identification' | 'Therapy Tips';
  likes: number;
  repliesCount: number;
  date: string;
}

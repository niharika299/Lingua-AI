import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Brain,
  ArrowRight,
  Trophy,
  Flame,
  Target,
  Zap,
  Lock,
  X,
  Star,
  BookOpen,
  Volume2,
  Check,
  ChevronRight,
  ShieldAlert,
  Play,
  Pause,
  Sliders,
  Edit3,
  ChevronDown,
  ChevronUp,
  Languages,
  User,
  Heart,
  Activity,
  Layers,
} from 'lucide-react';
import { NavPage, ChildProfile } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import {
  getNeuroPlaySessions,
  getWeeklyAchievements,
} from '../../utils/neuroplayStorage';
import { getActivityRecords, ActivityRecord } from '../../utils/activityTracker';
import { ParentNeedsAssessment } from '../common/ParentNeedsAssessment';
import { BackNavigationButton } from '../common/BackNavigationButton';

// --- HELPERS FOR PERSONALIZED PRACTICE FOCUS ---
function getParentPrioritiesFromStorage(): string[] {
  try {
    const rawProfile = localStorage.getItem('lingua_parent_support_profile');
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile);
      const topP = parsed?.goalsProfile?.topPriorities || parsed?.topPriorities;
      const mainC = parsed?.goalsProfile?.mainConcerns || parsed?.mainConcerns;
      if (Array.isArray(topP) && topP.length > 0) return topP;
      if (Array.isArray(mainC) && mainC.length > 0) return mainC;
    }

    const rawStep9 = localStorage.getItem('lingua_parent_step9_data');
    if (rawStep9) {
      const parsed = JSON.parse(rawStep9);
      const topP = parsed?.topPriorities;
      const mainC = parsed?.mainConcerns;
      if (Array.isArray(topP) && topP.length > 0) return topP;
      if (Array.isArray(mainC) && mainC.length > 0) return mainC;
    }
  } catch (e) {
    console.error('Error reading parent priorities:', e);
  }
  return [];
}

function checkHasSupportProfile(): boolean {
  try {
    if (localStorage.getItem('lingua_parent_support_profile')) return true;
    if (localStorage.getItem('lingua_parent_assessment_completed') === 'true') return true;
    if (localStorage.getItem('lingua_parent_step9_data')) return true;
  } catch {}
  return false;
}

interface MilestoneBadge {
  id: string;
  title: string;
  emoji: string;
  unlocked: boolean;
  glowColor: string;
  badgeStyle: string;
  description: string;
  unlockedDate?: string;
  progress?: string;
  skillBreakdown?: string;
}

const MILESTONE_BADGES: MilestoneBadge[] = [
  {
    id: 'badge-1',
    title: 'First Words Pioneer',
    emoji: '🌟',
    unlocked: true,
    glowColor: 'amber',
    badgeStyle: 'from-amber-500/20 via-yellow-500/15 to-slate-900/90 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    description: 'Mastered first 20 speech words',
    unlockedDate: 'Oct 2, 2026',
    skillBreakdown: 'Phoneme Articulation +92%, Speed 1.2s',
  },
  {
    id: 'badge-2',
    title: 'Acoustic Ace',
    emoji: '🎧',
    unlocked: true,
    glowColor: 'cyan',
    badgeStyle: 'from-cyan-500/20 via-blue-500/15 to-slate-900/90 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    description: '30+ mins focused active listening',
    unlockedDate: 'Oct 3, 2026',
    skillBreakdown: 'Auditory Discrimination +88%',
  },
  {
    id: 'badge-3',
    title: 'Dyslexia Decoder',
    emoji: '📖',
    unlocked: true,
    glowColor: 'emerald',
    badgeStyle: 'from-emerald-500/20 via-teal-500/15 to-slate-900/90 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    description: 'Scanned & read 10 book pages',
    unlockedDate: 'Oct 4, 2026',
    skillBreakdown: 'Visual OCR Tracking +94%',
  },
  {
    id: 'badge-4',
    title: 'Cognitive Champion',
    emoji: '🧠',
    unlocked: true,
    glowColor: 'purple',
    badgeStyle: 'from-purple-500/20 via-pink-500/15 to-slate-900/90 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    description: 'Scored 200+ in NeuroPlay',
    unlockedDate: 'Oct 5, 2026',
    skillBreakdown: 'Working Memory Index 120',
  },
  {
    id: 'badge-5',
    title: 'Master Orator',
    emoji: '🔒',
    unlocked: false,
    glowColor: 'slate',
    badgeStyle: 'from-slate-800/60 via-slate-900/80 to-slate-950/90 border-slate-700/60 opacity-85',
    description: 'Complete 10 speech sessions',
    progress: '6/10 Sessions Completed',
    skillBreakdown: 'Verbal Expression Scaffolding',
  },
  {
    id: 'badge-6',
    title: 'Vocabulary Titan',
    emoji: '🔒',
    unlocked: false,
    glowColor: 'slate',
    badgeStyle: 'from-slate-800/60 via-slate-900/80 to-slate-950/90 border-slate-700/60 opacity-85',
    description: 'Reach 50 retained words',
    progress: '28/50 Words Retained',
    skillBreakdown: 'Lexical Storage & Recall',
  },
  {
    id: 'badge-7',
    title: 'Phoneme Master',
    emoji: '🎯',
    unlocked: true,
    glowColor: 'violet',
    badgeStyle: 'from-violet-500/20 via-indigo-500/15 to-slate-900/90 border-violet-400/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]',
    description: '90%+ accuracy on consonant blends',
    unlockedDate: 'Sep 28, 2026',
    skillBreakdown: 'Consonant Precision 94%',
  },
  {
    id: 'badge-8',
    title: 'Streak Strategist',
    emoji: '🏆',
    unlocked: true,
    glowColor: 'rose',
    badgeStyle: 'from-rose-500/20 via-pink-500/15 to-slate-900/90 border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    description: 'Maintained 5-day active practice streak',
    unlockedDate: 'Oct 6, 2026',
    skillBreakdown: 'Daily Practice Consistency 100%',
  },
  {
    id: 'badge-9',
    title: 'Fluency Flash',
    emoji: '⚡',
    unlocked: true,
    glowColor: 'amber',
    badgeStyle: 'from-amber-400/20 via-orange-500/15 to-slate-900/90 border-amber-300/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    description: '15 verbal prompts in < 2 seconds',
    unlockedDate: 'Oct 1, 2026',
    skillBreakdown: 'Verbal Reaction Speed 1.4s',
  },
  {
    id: 'badge-10',
    title: 'Syntax Scholar',
    emoji: '🔮',
    unlocked: true,
    glowColor: 'indigo',
    badgeStyle: 'from-indigo-500/20 via-blue-600/15 to-slate-900/90 border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    description: 'Constructed 25 multi-clause sentences',
    unlockedDate: 'Sep 30, 2026',
    skillBreakdown: 'Grammatical Structure 91%',
  },
  {
    id: 'badge-11',
    title: 'Confidence Sentinel',
    emoji: '🛡️',
    unlocked: false,
    glowColor: 'slate',
    badgeStyle: 'from-slate-800/60 via-slate-900/80 to-slate-950/90 border-slate-700/60 opacity-85',
    description: 'Complete 5 storytelling challenges',
    progress: '3/5 Stories Retold',
    skillBreakdown: 'Narrative Coherence Engine',
  },
  {
    id: 'badge-12',
    title: 'Neural Architect',
    emoji: '🚀',
    unlocked: false,
    glowColor: 'slate',
    badgeStyle: 'from-slate-800/60 via-slate-900/80 to-slate-950/90 border-slate-700/60 opacity-85',
    description: 'Unlock Level 5 in Neural Growth',
    progress: '1,420 / 2,000 XP',
    skillBreakdown: 'Overall Developmental Fluency',
  },
];

interface ProgressProps {
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
  profile?: ChildProfile;
}

export const Progress: React.FC<ProgressProps> = ({ onNavigate, onBack, profile }) => {
  const { t } = useTranslation();
  const childName = profile?.name && profile.name !== 'Guest' ? profile.name : 'Khushi';

  // Read holistic activity records and parent support profile priorities
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>(() => getActivityRecords());
  const [parentPriorities, setParentPriorities] = useState<string[]>(() => getParentPrioritiesFromStorage());
  const [hasProfile, setHasProfile] = useState<boolean>(() => checkHasSupportProfile());

  // Badge Filter State ('ALL' | 'UNLOCKED' | 'IN_PROGRESS')
  const [badgeFilter, setBadgeFilter] = useState<'ALL' | 'UNLOCKED' | 'IN_PROGRESS'>('ALL');
  const [selectedBadge, setSelectedBadge] = useState<MilestoneBadge | null>(null);

  // Timeline accordion state
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>('session-1');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Caregiver Hub tab state ('IDENTITY' | 'MULTILINGUAL' | 'SCAFFOLDS')
  const [caregiverTab, setCaregiverTab] = useState<'IDENTITY' | 'MULTILINGUAL' | 'SCAFFOLDS'>('IDENTITY');
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);

  // Quick edit parameter state
  const [speechRate, setSpeechRate] = useState<number>(profile?.speechRate || 1.0);
  const [scaffoldingLevel, setScaffoldingLevel] = useState<string>('Guided High');
  const [phonemeAssist, setPhonemeAssist] = useState<boolean>(true);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => {
      setActivityRecords(getActivityRecords());
      setParentPriorities(getParentPrioritiesFromStorage());
      setHasProfile(checkHasSupportProfile());
    };
    window.addEventListener('lingua_activity_recorded', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('lingua_activity_recorded', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Filtered badges
  const filteredBadges = MILESTONE_BADGES.filter((b) => {
    if (badgeFilter === 'UNLOCKED') return b.unlocked;
    if (badgeFilter === 'IN_PROGRESS') return !b.unlocked;
    return true;
  });

  const unlockedCount = MILESTONE_BADGES.filter((b) => b.unlocked).length;
  const lockedCount = MILESTONE_BADGES.filter((b) => !b.unlocked).length;

  // Handle playing audio sample
  const handlePlayAudioSample = (id: string, textToSpeak: string) => {
    if (playingAudioId === id) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(id);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudioId(null), 2500);
    }
  };

  // Save quick edit parameters
  const handleSaveParameters = () => {
    try {
      const updatedProfile = {
        ...(profile || {}),
        speechRate,
      };
      localStorage.setItem('lingua_profile', JSON.stringify(updatedProfile));
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    } catch (e) {
      console.error('Error saving profile parameters:', e);
    }
  };

  // Radar Chart calculation
  // 5 pillars: 1. Phoneme Precision (88%), 2. Auditory Retention (82%), 3. Word Fluency (94%), 4. Reading Stamina (78%), 5. Expressive Speed (85%)
  const pillars = [
    { label: 'Phoneme Precision', value: 88, desc: 'Consonant & Vowel Articulation' },
    { label: 'Auditory Retention', value: 82, desc: 'Listening Memory Span' },
    { label: 'Word Fluency', value: 94, desc: 'Lexical Vocabulary Retrieval' },
    { label: 'Reading Stamina', value: 78, desc: 'Sustained Phonics Focus' },
    { label: 'Expressive Speed', value: 85, desc: 'Verbal Response Latency' },
  ];

  const radarCX = 140;
  const radarCY = 140;
  const radarR = 100;

  const getPentagonPoints = (rFactor: number) => {
    return pillars.map((_, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const x = radarCX + radarR * rFactor * Math.cos(angle);
      const y = radarCY + radarR * rFactor * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  const vertexCoords = pillars.map((p, i) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const x = radarCX + radarR * (p.value / 100) * Math.cos(angle);
    const y = radarCY + radarR * (p.value / 100) * Math.sin(angle);
    return { x, y, label: p.label, value: p.value };
  });

  const valuePolygonPoints = vertexCoords.map((v) => `${v.x},${v.y}`).join(' ');

  // Interactive Timeline Sessions Stream Data
  const timelineSessions = [
    {
      id: 'session-1',
      title: 'NeuroPlay Word Match & Phonics Lab',
      category: '🎮 NeuroPlay Game',
      timeStr: 'Today, 12:18 PM',
      scoreText: '+120 pts · 100% Accuracy',
      sampleText: 'The bright star shines high in the night sky.',
      breakdown: {
        phonemes: 's-t-a-r (98%), s-k-y (95%)',
        cuesUsed: 'Phonemic color highlighting + 1 audio replay',
        nextRecommendation: 'Advance to multi-clause sentence matching in NeuroPlay.',
      },
    },
    {
      id: 'session-2',
      title: 'Smart OCR Reader - Story Scaffolding',
      category: '📖 Smart OCR Reader',
      timeStr: 'Yesterday, 4:30 PM',
      scoreText: '+95 pts · 92% Accuracy',
      sampleText: 'Khushi read 3 pages from The Magic Treehouse.',
      breakdown: {
        phonemes: 'm-a-g-i-c (90%), t-r-e-e (94%)',
        cuesUsed: 'Guided Line-by-Line Focus & Syllable Spacing',
        nextRecommendation: 'Practice multi-syllable word breakdown in Read & Listen.',
      },
    },
    {
      id: 'session-3',
      title: 'Acoustic Discrimination Lab',
      category: '🎧 Speech Therapy Lab',
      timeStr: 'Oct 4, 2:15 PM',
      scoreText: '+80 pts · 88% Accuracy',
      sampleText: 'Discriminated minimal pairs: /p/ vs /b/ sound cues.',
      breakdown: {
        phonemes: 'pat vs bat (88%), pin vs bin (86%)',
        cuesUsed: 'Visual mouth shape animation & 0.8x slowed audio',
        nextRecommendation: 'Focus on voiced vs voiceless consonant discrimination.',
      },
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Navigation Button */}
      <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="home" label="Back to Home" />

      {/* ========================================================================= */}
      {/* 1. FUTURISTIC GLASSMORPHIC HEADER & LEARNER PROFILE BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 border border-white/20 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Title & Subtext & Quick Stats */}
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Neural Growth Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-md">
                {childName}'s Speech & Cognitive Journey 🚀
              </h1>
              <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                Tracking developmental fluency, vocabulary mastery, and phoneme milestones.
              </p>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-amber-500/40 text-amber-300 text-xs font-extrabold shadow-xs">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>5-Day Streak</span>
              </div>

              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold shadow-xs">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>88.4% Accuracy</span>
              </div>

              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-purple-500/40 text-purple-300 text-xs font-extrabold shadow-xs">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span>12 Milestones Unlocked</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Learner Level Badge & Animated XP Bar */}
          <div className="lg:w-80 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-3.5 shrink-0 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 text-white font-black text-xs shadow-md">
                  L4
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white">Level 4: Fluent Explorer</div>
                  <div className="text-[10px] text-purple-200 font-semibold">Active Speech & Phonics Tier</div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">71% XP</span>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-purple-200">
                <span>XP Progress</span>
                <span className="font-bold text-white">1,420 / 2,000 XP</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950/60 p-0.5 border border-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                  style={{ width: '71%' }}
                />
              </div>
            </div>

            <div className="text-[10px] text-purple-200/80 text-center font-medium">
              580 XP remaining to unlock <span className="font-bold text-white">Level 5: Master Orator</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE 7-DAY STREAK & WEEKLY CALENDAR CARD */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-purple-500/30 text-white shadow-2xl backdrop-blur-lg space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-5">
          {/* Header text */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-400">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Interactive Weekly Active Streak</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              7-Day Practice Consistency Tracker
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Practice daily to build cognitive fluency and retain new vocabulary. Active days boost your XP multiplier!
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={() => onNavigate('neuroplay')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <span>Start Today's NeuroPlay Challenge →</span>
            <Brain className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Circular Ring Meter */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-center gap-5">
            {/* SVG Circular Ring */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400"
                  strokeDasharray="71, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black font-mono text-white">5 / 7</span>
                <span className="text-[9px] font-bold uppercase text-emerald-400">71% Active</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-extrabold text-white">Weekly Goal Progress</div>
              <p className="text-[11px] text-slate-300 leading-normal">
                5 out of 7 days completed this week. You are on track for the <strong className="text-amber-300">Streak Master</strong> badge!
              </p>
            </div>
          </div>

          {/* Right: 7 Circular Glowing Day Nodes */}
          <div className="lg:col-span-8 grid grid-cols-7 gap-2 sm:gap-3">
            {[
              { day: 'Mon', completed: true, isToday: false },
              { day: 'Tue', completed: true, isToday: false },
              { day: 'Wed', completed: true, isToday: false },
              { day: 'Thu', completed: true, isToday: false },
              { day: 'Fri', completed: true, isToday: false },
              { day: 'Sat', completed: false, isToday: true },
              { day: 'Sun', completed: false, isToday: false },
            ].map((node, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 ${
                    node.completed
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.5)]'
                      : node.isToday
                      ? 'bg-purple-600 border-2 border-purple-300 text-white shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse ring-4 ring-purple-500/30'
                      : 'bg-slate-800/80 border border-slate-700 text-slate-500'
                  }`}
                >
                  {node.completed ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : node.isToday ? (
                    <Star className="w-5 h-5 text-amber-300 fill-amber-300 animate-spin-slow" />
                  ) : (
                    <span className="text-xs font-mono font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className={`text-[11px] font-extrabold uppercase ${
                    node.isToday ? 'text-purple-300 font-black' : node.completed ? 'text-emerald-300' : 'text-slate-400'
                  }`}>
                    {node.day}
                  </span>
                  <span className="block text-[9px] font-medium text-slate-400">
                    {node.completed ? 'Done' : node.isToday ? 'Today' : 'Upcoming'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 3D HOLOGRAPHIC BADGES & ACHIEVEMENTS GRID */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 text-white shadow-2xl backdrop-blur-lg space-y-6">
        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-400">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Milestone Badges & Honors</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Holographic Honors & Skill Masteries
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/90 rounded-2xl border border-slate-700/80 self-start sm:self-center">
            <button
              onClick={() => setBadgeFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === 'ALL'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All ({MILESTONE_BADGES.length})
            </button>

            <button
              onClick={() => setBadgeFilter('UNLOCKED')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === 'UNLOCKED'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>

            <button
              onClick={() => setBadgeFilter('IN_PROGRESS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === 'IN_PROGRESS'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              In Progress ({lockedCount})
            </button>
          </div>
        </div>

        {/* 4-Column Badge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-2xl bg-gradient-to-b border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden ${badge.badgeStyle}`}
            >
              {/* Top Row: Emoji & Status Tag */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {badge.unlocked ? badge.emoji : <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                {badge.unlocked ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-2xs">
                    Unlocked ⭐
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-800 text-slate-400 border border-slate-700">
                    Locked
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-white group-hover:text-purple-200 transition-colors">
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-300 leading-snug">
                  {badge.description}
                </p>
              </div>

              {/* Footer info */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                {badge.unlocked ? (
                  <span className="text-emerald-400 font-medium">Earned {badge.unlockedDate}</span>
                ) : (
                  <span className="text-slate-400 font-mono">{badge.progress}</span>
                )}
                <ChevronRight className="w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLEEK MICRO-MODAL FOR BADGE DETAILS */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-purple-500/40 p-6 sm:p-7 text-white shadow-2xl space-y-5 relative overflow-hidden">
            {/* Ambient Background Light */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border border-purple-400/40 flex items-center justify-center text-3xl shadow-lg">
                  {selectedBadge.unlocked ? selectedBadge.emoji : <Lock className="w-6 h-6 text-slate-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{selectedBadge.title}</h3>
                  <span className={`text-[11px] font-bold uppercase ${selectedBadge.unlocked ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {selectedBadge.unlocked ? '⭐ Milestone Achieved' : '🔒 Locked Achievement'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-purple-300 block">Requirement</span>
                <p className="text-xs text-slate-200 font-medium">{selectedBadge.description}</p>
              </div>

              {selectedBadge.unlocked && selectedBadge.unlockedDate && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-400 block">Achievement Date</span>
                  <p className="text-xs text-emerald-200 font-bold">{selectedBadge.unlockedDate}</p>
                </div>
              )}

              {selectedBadge.skillBreakdown && (
                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-purple-300 block">Skill & Neural Impact</span>
                  <p className="text-xs text-purple-200 font-medium">{selectedBadge.skillBreakdown}</p>
                </div>
              )}

              {!selectedBadge.unlocked && selectedBadge.progress && (
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 block">Current Progress</span>
                  <p className="text-xs text-amber-200 font-mono font-bold">{selectedBadge.progress}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedBadge(null);
                onNavigate('neuroplay');
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <span>Practice in NeuroPlay →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COGNITIVE SKILL MATRIX & RADAR ANALYTICS (CORE FEATURE) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 text-white shadow-2xl backdrop-blur-lg space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-400">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Cognitive Skill Radar & Diagnostics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            5-Pillar Developmental Skill Pentagon
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time multi-dimensional assessment evaluating phonemes, listening retention, vocabulary, reading stamina, and expression speed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: SVG Pentagon Skill Radar Matrix */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
              <svg width="280" height="280" viewBox="0 0 280 280" className="overflow-visible">
                <defs>
                  <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.05" />
                  </radialGradient>
                  <linearGradient id="polygonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Grid Web Pentagons (20%, 40%, 60%, 80%, 100%) */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((rFactor) => (
                  <polygon
                    key={rFactor}
                    points={getPentagonPoints(rFactor)}
                    fill={rFactor === 1.0 ? 'url(#radarGlow)' : 'none'}
                    stroke="#334155"
                    strokeWidth={rFactor === 1.0 ? '1.5' : '1'}
                    strokeDasharray={rFactor === 1.0 ? '0' : '3,3'}
                  />
                ))}

                {/* Radial Axis Lines */}
                {pillars.map((_, i) => {
                  const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                  const x = radarCX + radarR * Math.cos(angle);
                  const y = radarCY + radarR * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={radarCX}
                      y1={radarCY}
                      x2={x}
                      y2={y}
                      stroke="#475569"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* User Active Skill Area Polygon */}
                <polygon
                  points={valuePolygonPoints}
                  fill="url(#polygonGradient)"
                  stroke="#C084FC"
                  strokeWidth="2.5"
                  className="filter drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]"
                />

                {/* Glowing Vertex Dots & Values */}
                {vertexCoords.map((v, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r="5"
                      fill="#10B981"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-150"
                    />
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r="10"
                      fill="#10B981"
                      fillOpacity="0.3"
                      className="animate-ping"
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Pillar Legend Pills below Radar */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px]">
              {pillars.map((p) => (
                <div
                  key={p.label}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-medium text-slate-300">{p.label}:</span>
                  <span className="font-mono font-bold text-emerald-300">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: AI Clinical Diagnostic Recommendation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-indigo-950/60 border border-purple-500/30 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-extrabold uppercase">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>AI Clinical Diagnostic Insight</span>
              </div>

              <div className="space-y-2 text-xs leading-relaxed">
                <p className="text-white font-extrabold text-sm">
                  Strongest Pillars: <span className="text-emerald-300">Word Fluency (94%)</span> & <span className="text-purple-300">Phoneme Precision (88%)</span>.
                </p>
                <p className="text-slate-300">
                  {childName} shows rapid lexical recall and clear consonant blend pronunciation. Reading Stamina (78%) can be elevated by practicing multi-syllable phonemes in short 10-minute daily bursts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-400/30 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-purple-300 block">Recommended Focus Target</span>
                  <span className="font-bold text-white">Multi-syllable phoneme blending & auditory recall</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/40 shrink-0">
                  Target +7%
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('neuroplay')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <span>Generate Targeted Practice Plan →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FUTURISTIC CAREGIVER INTELLIGENCE PROFILE */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 text-white shadow-2xl backdrop-blur-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-400">
              <User className="w-4 h-4 text-purple-400" />
              <span>Caregiver Intelligence Profile</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Learner Profile & Support Parameters
            </h2>
          </div>

          <button
            onClick={() => setIsQuickEditOpen(!isQuickEditOpen)}
            className="px-4 py-2 rounded-xl bg-purple-600/30 border border-purple-400/40 hover:bg-purple-600/50 text-purple-200 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition self-start sm:self-center"
          >
            <Edit3 className="w-4 h-4 text-purple-300" />
            <span>{isQuickEditOpen ? 'Close Quick Edit' : 'Edit Parameters ✏️'}</span>
          </button>
        </div>

        {/* Tabbed Interface */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setCaregiverTab('IDENTITY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              caregiverTab === 'IDENTITY'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Learner Identity</span>
          </button>

          <button
            onClick={() => setCaregiverTab('MULTILINGUAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              caregiverTab === 'MULTILINGUAL'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Multilingual Roots</span>
          </button>

          <button
            onClick={() => setCaregiverTab('SCAFFOLDS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              caregiverTab === 'SCAFFOLDS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Priority Scaffolds</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {caregiverTab === 'IDENTITY' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Learner Name</span>
                <span className="font-extrabold text-white text-sm">{childName}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Age & Education</span>
                <span className="font-extrabold text-white text-sm">8 yrs · Primary School</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Reading Level</span>
                <span className="font-extrabold text-emerald-300 text-sm">Developing Phonics</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Modality Preference</span>
                <span className="font-extrabold text-purple-300 text-sm">Multisensory Visual & Audio</span>
              </div>
            </div>
          )}

          {caregiverTab === 'MULTILINGUAL' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Home Primary Language</span>
                <span className="font-extrabold text-amber-300 text-sm">Hindi (हिन्दी)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">School Instruction</span>
                <span className="font-extrabold text-blue-300 text-sm">English (India)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Bilingual Comfort</span>
                <span className="font-extrabold text-emerald-300 text-sm">Balanced Bi-lingual</span>
              </div>
            </div>
          )}

          {caregiverTab === 'SCAFFOLDS' && (
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3 text-xs animate-fade-in">
              <span className="text-[10px] uppercase font-extrabold text-purple-400 block">Active Selected Priority Goals</span>
              <div className="flex flex-wrap gap-2">
                {['Syntax Sequencing', 'Word Finding', 'Auditory Memory', 'Consonant Blends'].map((priority) => (
                  <span
                    key={priority}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold"
                  >
                    🎯 {priority}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Quick Edit Drawer */}
        {isQuickEditOpen && (
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-purple-500/40 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-purple-300 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Adjust Neural Scaffolding Parameters</span>
              </h3>
              {isSavedNotice && (
                <span className="text-xs text-emerald-400 font-bold animate-pulse">
                  ✓ Parameters Saved!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              {/* Speech Speed Slider */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Speech Rate</span>
                  <span className="text-purple-300 font-mono">{speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Scaffolding Level */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-300 font-bold block">Scaffolding Intensity</span>
                <select
                  value={scaffoldingLevel}
                  onChange={(e) => setScaffoldingLevel(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700 text-xs focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="Guided High">Guided High (Visual + Audio Cues)</option>
                  <option value="Moderate">Moderate (Audio Cues Only)</option>
                  <option value="Independent">Independent Challenge</option>
                </select>
              </div>

              {/* Phoneme Color Assist Toggle */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-300 font-bold block">Phoneme Highlight</span>
                  <span className="text-[10px] text-slate-400">Dyslexia color cues</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhonemeAssist(!phonemeAssist)}
                  className={`w-12 h-6 rounded-full transition p-1 cursor-pointer ${
                    phonemeAssist ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      phonemeAssist ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveParameters}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-md cursor-pointer"
            >
              Save Parameter Changes
            </button>
          </div>
        )}
      </div>

      {/* Parent Needs Assessment Form Section Anchor */}
      <div id="parent-assessment">
        <ParentNeedsAssessment childName={childName} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

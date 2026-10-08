import React, { useState, useEffect } from 'react';
import { NavPage, ChildProfile } from '../../types';
import {
  Target,
  Sparkles,
  CheckCircle2,
  Shuffle,
  Trophy,
  ArrowRight,
  Clock,
  Zap,
  Smile,
  Brain,
  BookOpen,
  ScanText,
  Wand2,
  Award,
} from 'lucide-react';

export type MoodFocusLevel = 'GENTLE' | 'BALANCED' | 'HIGH_FOCUS';

export interface AdaptiveMission {
  id: string;
  sectionBadge: 'NeuroPlay' | 'Read & Listen' | 'Speech Lab' | 'Smart Reader' | 'Vocabulary';
  targetPage: NavPage;
  title: string;
  description: string;
  duration: string;
  focusLevel: 'Gentle' | 'Medium' | 'High';
  moodLevel: MoodFocusLevel;
  xpReward: number;
}

const MISSION_DATABASE: AdaptiveMission[] = [
  // Gentle Mood Missions
  {
    id: 'm-gentle-1',
    sectionBadge: 'Read & Listen',
    targetPage: 'read-listen',
    title: 'Story Snapshot & Audio Listen',
    description: 'Listen to 1 short audio story paragraph while following visual highlight cues.',
    duration: '⏱️ 5 Mins',
    focusLevel: 'Gentle',
    moodLevel: 'GENTLE',
    xpReward: 50,
  },
  {
    id: 'm-gentle-2',
    sectionBadge: 'Speech Lab',
    targetPage: 'read-listen',
    title: 'Vowel Stretch Warm-Up',
    description: 'Sing 3 prolonged vowel sounds (/aaa/, /eee/, /ooo/) together with gentle voice pacing.',
    duration: '⏱️ 6 Mins',
    focusLevel: 'Gentle',
    moodLevel: 'GENTLE',
    xpReward: 50,
  },
  {
    id: 'm-gentle-3',
    sectionBadge: 'Smart Reader',
    targetPage: 'book-scanner',
    title: 'Picture Cover Word Tap',
    description: 'Point to 3 colorful animal illustrations on a book cover and name them out loud.',
    duration: '⏱️ 5 Mins',
    focusLevel: 'Gentle',
    moodLevel: 'GENTLE',
    xpReward: 50,
  },
  {
    id: 'm-gentle-4',
    sectionBadge: 'Vocabulary',
    targetPage: 'language-tools',
    title: 'Visual Flashcard Explorer',
    description: 'Explore 2 interactive visual cards with color-coded syllable dots.',
    duration: '⏱️ 6 Mins',
    focusLevel: 'Gentle',
    moodLevel: 'GENTLE',
    xpReward: 50,
  },

  // Balanced Mood Missions
  {
    id: 'm-balanced-1',
    sectionBadge: 'NeuroPlay',
    targetPage: 'neuroplay',
    title: 'Auditory Sequence Recall',
    description: 'Match 3 rhythm beats without visual hints to strengthen acoustic working memory.',
    duration: '⏱️ 10 Mins',
    focusLevel: 'Medium',
    moodLevel: 'BALANCED',
    xpReward: 50,
  },
  {
    id: 'm-balanced-2',
    sectionBadge: 'Read & Listen',
    targetPage: 'read-listen',
    title: 'Multisensory Story Scaffolding',
    description: 'Read 1 story page out loud while tracking synchronized audio highlight pacing.',
    duration: '⏱️ 12 Mins',
    focusLevel: 'Medium',
    moodLevel: 'BALANCED',
    xpReward: 50,
  },
  {
    id: 'm-balanced-3',
    sectionBadge: 'Speech Lab',
    targetPage: 'read-listen',
    title: 'Phoneme Articulation Mirror',
    description: 'Practice the /s/ and /ch/ sound mirror game 3 times with tactile chin-taps.',
    duration: '⏱️ 10 Mins',
    focusLevel: 'Medium',
    moodLevel: 'BALANCED',
    xpReward: 50,
  },
  {
    id: 'm-balanced-4',
    sectionBadge: 'Smart Reader',
    targetPage: 'book-scanner',
    title: 'Real Book Scan & Word Hunt',
    description: 'Scan a page from a physical textbook and tap 3 unfamiliar words to generate instant definitions.',
    duration: '⏱️ 12 Mins',
    focusLevel: 'Medium',
    moodLevel: 'BALANCED',
    xpReward: 50,
  },

  // High Focus Challenge Missions
  {
    id: 'm-high-1',
    sectionBadge: 'NeuroPlay',
    targetPage: 'neuroplay',
    title: 'Dual-Task Memory Sprint',
    description: 'Remember 5 acoustic tones in rapid sequence while selecting matching visual symbols.',
    duration: '⏱️ 15 Mins',
    focusLevel: 'High',
    moodLevel: 'HIGH_FOCUS',
    xpReward: 50,
  },
  {
    id: 'm-high-2',
    sectionBadge: 'Speech Lab',
    targetPage: 'read-listen',
    title: 'Complex Recast Relay',
    description: 'Practice 5 positive recasting sentences with speech pitch and clarity feedback.',
    duration: '⏱️ 18 Mins',
    focusLevel: 'High',
    moodLevel: 'HIGH_FOCUS',
    xpReward: 50,
  },
  {
    id: 'm-high-3',
    sectionBadge: 'Smart Reader',
    targetPage: 'book-scanner',
    title: 'AI Scanned Book Decoding',
    description: 'Scan 2 textbook pages, simplify complex grammar, and answer 3 comprehension prompts.',
    duration: '⏱️ 20 Mins',
    focusLevel: 'High',
    moodLevel: 'HIGH_FOCUS',
    xpReward: 50,
  },
  {
    id: 'm-high-4',
    sectionBadge: 'Vocabulary',
    targetPage: 'language-tools',
    title: 'Dyslexia Text Scaffolding',
    description: 'Read 1 full passage using OpenDyslexic font overlay and line-focus ruler.',
    duration: '⏱️ 15 Mins',
    focusLevel: 'High',
    moodLevel: 'HIGH_FOCUS',
    xpReward: 50,
  },
];

interface DailyAdaptiveMissionsProps {
  onNavigate: (page: NavPage) => void;
  profile: ChildProfile;
}

export const DailyAdaptiveMissions: React.FC<DailyAdaptiveMissionsProps> = ({ onNavigate, profile }) => {
  const [selectedMood, setSelectedMood] = useState<MoodFocusLevel>('BALANCED');
  const [activeMissions, setActiveMissions] = useState<AdaptiveMission[]>([]);
  const [completedMissionIds, setCompletedMissionIds] = useState<Record<string, boolean>>({});
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  // Filter & select initial 3 missions for chosen mood
  useEffect(() => {
    const available = MISSION_DATABASE.filter((m) => m.moodLevel === selectedMood);
    setActiveMissions(available.slice(0, 3));
  }, [selectedMood]);

  // Load completed missions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lingua_completed_adaptive_missions');
      if (saved) {
        setCompletedMissionIds(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Web Audio celebration chime
  const playRewardChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  };

  const handleCompleteTask = (mission: AdaptiveMission) => {
    if (completedMissionIds[mission.id]) return;

    playRewardChime();
    setAnimatingId(mission.id);

    setTimeout(() => {
      setAnimatingId(null);
    }, 1200);

    const updated = { ...completedMissionIds, [mission.id]: true };
    setCompletedMissionIds(updated);

    try {
      localStorage.setItem('lingua_completed_adaptive_missions', JSON.stringify(updated));
    } catch {}
  };

  const handleSwapTask = (indexToSwap: number) => {
    const availablePool = MISSION_DATABASE.filter(
      (m) => m.moodLevel === selectedMood && !activeMissions.some((active) => active.id === m.id)
    );

    if (availablePool.length === 0) {
      // If pool exhausted, reshuffle from mood pool
      const allForMood = MISSION_DATABASE.filter((m) => m.moodLevel === selectedMood);
      const randomNew = allForMood[Math.floor(Math.random() * allForMood.length)];
      setActiveMissions((prev) => {
        const next = [...prev];
        next[indexToSwap] = randomNew;
        return next;
      });
      return;
    }

    const replacement = availablePool[0];
    setActiveMissions((prev) => {
      const next = [...prev];
      next[indexToSwap] = replacement;
      return next;
    });
  };

  const completedCount = activeMissions.filter((m) => !!completedMissionIds[m.id]).length;
  const isAllCompleted = completedCount === 3 && activeMissions.length === 3;

  const getSectionBadgeColor = (badge: AdaptiveMission['sectionBadge']) => {
    switch (badge) {
      case 'NeuroPlay':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';
      case 'Read & Listen':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
      case 'Speech Lab':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20';
      case 'Smart Reader':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
      case 'Vocabulary':
        return 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-md space-y-6 transition-all">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              🎯 Daily Adaptive Missions (Parent-Guided)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
              Parent Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Choose the best activities for today based on {profile.name || 'Khushi'}'s mood and attention level. Complete tasks together to earn XP.
          </p>
        </div>

        {/* Parent Mood Focus Mode Selector Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setSelectedMood('GENTLE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedMood === 'GENTLE'
                ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
            }`}
          >
            <span>🟢 Gentle (5-8m)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMood('BALANCED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedMood === 'BALANCED'
                ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
            }`}
          >
            <span>🔵 Balanced (10-15m)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMood('HIGH_FOCUS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedMood === 'HIGH_FOCUS'
                ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
            }`}
          >
            <span>🟣 High Focus (15-20m)</span>
          </button>
        </div>
      </div>

      {/* 3-Column Multi-Section Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {activeMissions.map((mission, idx) => {
          const isDone = !!completedMissionIds[mission.id];
          const isBouncing = animatingId === mission.id;

          return (
            <div
              key={mission.id}
              className={`relative bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 ${
                isDone
                  ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 bg-emerald-500/5'
                  : 'border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              {/* Confetti Reward Bounce Banner */}
              {isBouncing && (
                <div className="absolute -top-3 right-4 z-20 px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-lg animate-bounce flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                  <span>+50 XP Earned!</span>
                </div>
              )}

              <div className="space-y-3">
                {/* Header Badge & Parent Swap Option */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getSectionBadgeColor(mission.sectionBadge)}`}>
                    {mission.sectionBadge}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSwapTask(idx)}
                    className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Swap task if parent prefers a different exercise"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Swap Task 🔀</span>
                  </button>
                </div>

                {/* Duration & Focus Level */}
                <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    <span>{mission.duration}</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-700 dark:text-slate-300">Focus: {mission.focusLevel}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {mission.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {mission.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                {/* Direct Launch Button */}
                <button
                  type="button"
                  onClick={() => onNavigate(mission.targetPage)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-[1.01] active:scale-95"
                >
                  <span>Start This Activity →</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </button>

                {/* Parent Verification Button */}
                <button
                  type="button"
                  onClick={() => handleCompleteTask(mission)}
                  disabled={isDone}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs cursor-default'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 hover:scale-[1.01] active:scale-95'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Completed Today ✨</span>
                    </>
                  ) : (
                    <>
                      <Trophy className="w-3.5 h-3.5 text-amber-300" />
                      <span>Complete & Earn +50 XP 🏆</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Completion & Streak Progress Bar */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white font-black shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="space-y-1 w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                Today's Missions: [ {completedCount} / 3 Completed ]
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {Math.round((completedCount / 3) * 100)}%
              </span>
            </div>
            {/* Progress Meter Bar */}
            <div className="w-full sm:w-64 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${(completedCount / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bonus Reward Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-800 text-xs font-extrabold text-slate-800 dark:text-slate-200 shadow-2xs self-stretch sm:self-auto justify-center">
          {isAllCompleted ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>🎉 'Focus Champion' Badge Unlocked! (+150 XP Earned Today)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Complete all 3 tasks today to unlock the 'Focus Champion' badge!</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

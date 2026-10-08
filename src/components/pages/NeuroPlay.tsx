import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  Volume2,
  ArrowRight,
  Star,
  Target,
  BookOpen,
  Smile,
  RefreshCw,
  Heart,
  MessageCircle,
  Briefcase,
  GraduationCap,
  User,
  Check,
  X,
  Award,
  Zap,
  Mic,
  FileText,
  ChevronRight,
  Play,
  Pause,
  Layers,
  ListChecks,
  Activity,
  Flame,
  ArrowLeft,
  Gamepad2,
  Volume2 as SoundIcon,
} from 'lucide-react';
import { NavPage, ChildProfile } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { saveNeuroPlaySession, getNeuroPlaySessions } from '../../utils/neuroplayStorage';
import { playSpeech, stopSpeech } from '../../utils/translationService';
import { BackNavigationButton } from '../common/BackNavigationButton';
import { ArcadeGames } from './neuroplay/ArcadeGames';
import { KIDS_ARCADE_GAMES_LIST } from './neuroplay/kidsArcadeData';
import {
  KIDS_VOCAB_QUESTIONS,
  KIDS_COMPREHENSION_TASKS,
  KIDS_GRAMMAR_ROUNDS,
  KIDS_SOCIAL_SCENARIOS,
  KIDS_PHONOLOGY_WORDS,
  KIDS_MEMORY_LISTS,
  KIDS_NARRATIVE_PUZZLES,
} from './neuroplay/kidsTherapyData';
import {
  TEEN_VOCAB_EXERCISES,
  TEEN_SARCASM_EXERCISES,
  TEEN_GRAMMAR_EXERCISES,
  TEEN_SOCIAL_EXERCISES,
  TEEN_PHONOLOGY_EXERCISES,
  TEEN_MEMORY_EXERCISES,
  TEEN_NARRATIVE_EXERCISES,
} from './neuroplay/teensData';
import {
  ADULT_VOCAB_EXERCISES,
  ADULT_DOC_EXERCISES,
  ADULT_EMAIL_EXERCISES,
  ADULT_SOCIAL_EXERCISES,
  ADULT_PHONOLOGY_TERMS,
  ADULT_MEMORY_WORKFLOWS,
  ADULT_DISCOURSE_EXERCISES,
} from './neuroplay/adultsData';

interface NeuroPlayProps {
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
  profile?: ChildProfile;
}

export type AgeTier = 'kids' | 'teens' | 'adults';

export type ClinicalArea =
  | 'hub'
  | 'kids_arcade'
  | 'vocab'
  | 'comprehension'
  | 'grammar'
  | 'social'
  | 'phonology'
  | 'memory'
  | 'discourse';

export const NeuroPlay: React.FC<NeuroPlayProps> = ({ onNavigate, onBack, profile }) => {
  const { t } = useTranslation();

  // Auto-select age tier based on profile age if available
  const initialTier: AgeTier = profile?.age
    ? profile.age < 11
      ? 'kids'
      : profile.age < 18
      ? 'teens'
      : 'adults'
    : 'kids';

  const [activeTier, setActiveTier] = useState<AgeTier>(initialTier);
  const [activeArea, setActiveArea] = useState<ClinicalArea>('hub');
  const [selectedArcadeGameId, setSelectedArcadeGameId] = useState<string | null>(null);

  // Gamification & Session State
  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('lingua_total_xp');
      return stored ? parseInt(stored, 10) : 120;
    } catch {
      return 120;
    }
  });

  const [sessionXpEarned, setSessionXpEarned] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  // Active step counters for modules
  const [exerciseStep, setExerciseStep] = useState<number>(0);

  const addXp = (amount: number, gameName: string) => {
    const newTotal = totalXp + amount;
    setTotalXp(newTotal);
    setSessionXpEarned((prev) => prev + amount);
    try {
      localStorage.setItem('lingua_total_xp', newTotal.toString());
      saveNeuroPlaySession({
        gameId: `${activeTier}_${activeArea}`,
        gameName: `${activeTier.toUpperCase()} - ${gameName}`,
        totalQuestions: 1,
        correctAnswers: 1,
        score: amount,
      });
    } catch (err) {
      console.warn('Storage save notice:', err);
    }
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  };

  const playAudioPrompt = (text: string, lang: string = 'en') => {
    stopSpeech();
    playSpeech(text, lang, 0.9);
  };

  // Reset exercise step when area or tier changes
  useEffect(() => {
    setExerciseStep(0);
    setLastFeedback(null);
  }, [activeArea, activeTier]);

  // Total completed sessions stats
  const sessions = getNeuroPlaySessions();
  const totalCompletedCount = sessions.length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300 min-h-screen bg-slate-50 text-slate-800">
      {/* Back Navigation Button */}
      <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="home" label="Back to Home" />

      {/* Top Header & XP Banner (Crisp Light Theme) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 bg-white p-6 rounded-3xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider mb-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span>CLINICAL SPEECH & COGNITIVE ARENA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            NeuroPlay Cognitive Scaffolding Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
            Evidence-based speech-language pathology interventions for Developmental Language Difference (DLD),
            syntactic processing, and verbal memory across 3 age tiers.
          </p>
        </div>

        {/* Level & XP Capsule */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 via-indigo-50 to-purple-50 border border-amber-200 p-3.5 rounded-2xl shrink-0 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md">
            ⚡
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-700">
              Level {Math.floor(totalXp / 100) + 1} Speech Champion
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {totalXp} Total XP <span className="text-xs font-normal text-slate-500">(+{sessionXpEarned} today)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Notification Popup */}
      {showCelebration && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-white/30 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-6 h-6 text-yellow-300 animate-bounce" />
          <div>
            <div className="font-extrabold text-sm">+20 XP Earned! Excellent Progress!</div>
            <div className="text-[11px] text-emerald-100">Keep up the fantastic effort!</div>
          </div>
        </div>
      )}

      {/* 1. UNIFIED AGE-TIER SWITCHER BAR (Light Pastel Theme) */}
      <div className="p-2 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
        <div className="grid grid-cols-3 w-full gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTier('kids');
              setActiveArea('hub');
            }}
            className={`px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              activeTier === 'kids'
                ? 'bg-amber-500 text-white shadow-md scale-[1.02]'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>🧒 Kids (Ages 5–11)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTier('teens');
              setActiveArea('hub');
            }}
            className={`px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              activeTier === 'teens'
                ? 'bg-indigo-600 text-white shadow-md scale-[1.02]'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>🧑 Teens (Ages 11–18)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTier('adults');
              setActiveArea('hub');
            }}
            className={`px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              activeTier === 'adults'
                ? 'bg-teal-600 text-white shadow-md scale-[1.02]'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>💼 Adults (Ages 18+)</span>
          </button>
        </div>
      </div>

      {/* Back to Arena Hub Button when inside an exercise */}
      {activeArea !== 'hub' && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setActiveArea('hub');
              setSelectedArcadeGameId(null);
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to {activeTier.toUpperCase()} Arena Hub</span>
          </button>

          <span className="text-xs font-bold text-slate-500">
            Current Active Tier: <strong className="text-indigo-600 capitalize">{activeTier}</strong>
          </span>
        </div>
      )}

      {/* =========================================================================
          ARENA HUB: MODULE SELECTION GRID
         ========================================================================= */}
      {activeArea === 'hub' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>
                {activeTier === 'kids' && '🧒 Kids Playful Therapy & Arcade Modules'}
                {activeTier === 'teens' && '🧑 Teen Academic & Abstract Modules'}
                {activeTier === 'adults' && '💼 Adult Workplace Independence Modules'}
              </span>
            </h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Completed Sessions: {totalCompletedCount}
            </span>
          </div>

          {/* Kids Section: First 4 Interactive Games Grid */}
          {activeTier === 'kids' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-amber-500" />
                    <span>Featured Kids Arcade Games</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Playable cognitive training games for visual memory, attention, auditory processing, and pattern recall.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveArea('kids_arcade')}
                  className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs cursor-pointer border border-amber-300 transition-colors"
                >
                  View All Games →
                </button>
              </div>

              {/* 4-Card Grid matching specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {KIDS_ARCADE_GAMES_LIST.slice(0, 4).map((game) => (
                  <div
                    key={game.id}
                    onClick={() => {
                      setActiveArea('kids_arcade');
                      setSelectedArcadeGameId(game.id);
                    }}
                    className={`p-6 rounded-2xl border ${game.borderColor} ${game.colorBg} shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group bg-white`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-3xl flex items-center justify-center shadow-xs">
                          {game.emoji}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {game.categoryTag}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border">
                            {game.levelPill}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                            ⏱️ {game.duration}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            {game.points}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                          {game.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-600 group-hover:text-indigo-700">
                        Play Game →
                      </span>
                      <div className="p-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-xs group-hover:bg-indigo-700 transition-colors flex items-center gap-1">
                        <span>Play Game →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7 Clinical SLP Modules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Vocabulary */}
            <div
              onClick={() => setActiveArea('vocab')}
              className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-xs">
                  🕵️‍♂️
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                    1. Vocabulary & Naming
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeTier === 'kids' && 'Word Detective (Shabd Jasoos) - 6 clue-based naming questions.'}
                    {activeTier === 'teens' && 'Contextual Clue Sentence Puzzles - 6 complex vocabulary drills.'}
                    {activeTier === 'adults' && 'Professional Phrase Substitutions - 8 executive tone drills.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-amber-700">
                <span>Start Module</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Comprehension */}
            <div
              onClick={() => setActiveArea('comprehension')}
              className="p-6 rounded-3xl bg-indigo-50/80 border border-indigo-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-xs">
                  👂
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    2. Comprehension & Rules
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeTier === 'kids' && 'Simon Says Multi-Step Commands - 5 sequential execution tasks.'}
                    {activeTier === 'teens' && 'Sarcasm & Idiom Decoders - 6 pragmatic audio quote drills.'}
                    {activeTier === 'adults' && 'Functional Document Scanners - 8 contract & clause drills.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-indigo-700">
                <span>Start Module</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Grammar */}
            <div
              onClick={() => setActiveArea('grammar')}
              className="p-6 rounded-3xl bg-teal-50/80 border border-teal-200 hover:border-teal-400 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-xs">
                  🧩
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                    3. Grammar & Structure
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeTier === 'kids' && 'Past Tense Sentence Repair - 5 word tile builder rounds.'}
                    {activeTier === 'teens' && 'Conjunction Synthesizer - 6 complex sentence drills.'}
                    {activeTier === 'adults' && 'Corporate Email Editing - 8 precision polishing drills.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-teal-700">
                <span>Start Module</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Social Communication */}
            <div
              onClick={() => setActiveArea('social')}
              className="p-6 rounded-3xl bg-purple-50/80 border border-purple-200 hover:border-purple-400 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-xs">
                  🤝
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                    4. Social Communication
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeTier === 'kids' && 'Polite Role-Play Scenarios - 5 interactive dialogue drills.'}
                    {activeTier === 'teens' && 'Perspective Taking & Empathy - 6 teen conflict dilemmas.'}
                    {activeTier === 'adults' && 'Workplace Mock Drills - 8 de-escalation & feedback drills.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-purple-700">
                <span>Start Module</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 5: Phonology */}
            <div
              onClick={() => setActiveArea('phonology')}
              className="p-6 rounded-3xl bg-rose-50/80 border border-rose-200 hover:border-rose-400 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-xs">
                  🗣️
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
                    5. Phonology & Articulation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeTier === 'kids' && 'Syllable Clapping & Sound Waves - 6 word sound drills.'}
                    {activeTier === 'teens' && 'Morphological Root & Affix - 6 deconstruction drills.'}
                    {activeTier === 'adults' && 'Corporate Multi-Syllabic Terms - 8 articulation drills.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-rose-700">
                <span>Start Module</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 6: Verbal Memory */}
            <div
              onClick={() => setActiveArea('memory')}
              className="p-6 rounded-3xl bg-cyan-50/80 border border-cyan-200 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-xs">
                  🧠
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    6. Verbal Memory
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeTier === 'kids' && 'The Infinite Shopping List - 5 item memory layers.'}
                    {activeTier === 'teens' && 'Audio Note-Taking - 5 science lecture 3-pillar drills.'}
                    {activeTier === 'adults' && 'Executive Workflow Mnemonics - 8 task-coding drills.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-cyan-700">
                <span>Start Module</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 7: Discourse & Narrative */}
            <div
              onClick={() => setActiveArea('discourse')}
              className="p-6 rounded-3xl bg-emerald-50/80 border border-emerald-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-xs">
                  📖
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    7. Discourse & Narrative
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeTier === 'kids' && '4-Card Story Panel Sequencing - 5 story puzzles.'}
                    {activeTier === 'teens' && 'Timed Pitch Structuring - 5 Hook, Conflict, Climax drills.'}
                    {activeTier === 'adults' && 'High-Stakes Escalation Pitch - 8 executive pitch drills.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-emerald-700">
                <span>Start Module</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          KIDS ARCADE LAUNCHER VIEW
         ========================================================================= */}
      {activeTier === 'kids' && activeArea === 'kids_arcade' && (
        <div className="space-y-6">
          {selectedArcadeGameId ? (
            <ArcadeGames
              gameId={selectedArcadeGameId}
              onBackToArcade={() => setSelectedArcadeGameId(null)}
              onAddXp={addXp}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200">
                <div>
                  <span className="text-xs font-black uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    🧒 KIDS VISUAL ARCADE
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Select an Arcade Game (11 Playable)</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveArea('hub')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs cursor-pointer"
                >
                  ← Back to Arena
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {KIDS_ARCADE_GAMES_LIST.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedArcadeGameId(game.id)}
                    className={`p-6 rounded-3xl border ${game.borderColor} ${game.colorBg} shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between group`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{game.emoji}</span>
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-white text-slate-800 border">
                          {game.categoryTag || game.subtitle}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-700">
                          {game.title}
                        </h3>
                        <div className="text-xs font-bold text-amber-800 mb-1">{game.subtitle}</div>
                        <p className="text-xs text-slate-600 font-medium">{game.description}</p>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-amber-700">
                      <span>Play Game Now</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GENERIC MODULE EXERCISE RENDERER (KIDS, TEENS, ADULTS)
         ========================================================================= */}
      {activeArea !== 'hub' && activeArea !== 'kids_arcade' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          {/* Module Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                {activeTier.toUpperCase()} TIER · {activeArea.toUpperCase()} MODULE
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                {activeArea === 'vocab' && 'Vocabulary & Naming Drills'}
                {activeArea === 'comprehension' && 'Comprehension & Rule Exercises'}
                {activeArea === 'grammar' && 'Grammar & Sentence Structure Drills'}
                {activeArea === 'social' && 'Social Communication Scenarios'}
                {activeArea === 'phonology' && 'Phonology & Articulation Practice'}
                {activeArea === 'memory' && 'Verbal Memory & Note-Taking Drills'}
                {activeArea === 'discourse' && 'Discourse & Story Pitching Drills'}
              </h2>
            </div>
          </div>

          {/* KIDS MODULE CONTENT */}
          {activeTier === 'kids' && (
            <div>
              {/* Kids Vocab */}
              {activeArea === 'vocab' && (
                <div className="space-y-6">
                  {(() => {
                    const q = KIDS_VOCAB_QUESTIONS[exerciseStep] || KIDS_VOCAB_QUESTIONS[0];
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Question {exerciseStep + 1} of {KIDS_VOCAB_QUESTIONS.length}</span>
                          <button onClick={() => playAudioPrompt(q.prompt)} className="p-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1">
                            <SoundIcon className="w-4 h-4" /> Listen 🔊
                          </button>
                        </div>
                        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 font-extrabold text-sm text-amber-900">
                          "{q.prompt}"
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  addXp(20, 'Word Detective');
                                  setLastFeedback(q.explanation);
                                  if (exerciseStep < KIDS_VOCAB_QUESTIONS.length - 1) {
                                    setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                                  }
                                } else {
                                  setLastFeedback('Try again! Clue: ' + q.clue);
                                }
                              }}
                              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-amber-500 hover:text-white font-extrabold text-sm text-left transition-all"
                            >
                              {opt.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Kids Comprehension */}
              {activeArea === 'comprehension' && (
                <div className="space-y-6">
                  {(() => {
                    const task = KIDS_COMPREHENSION_TASKS[exerciseStep] || KIDS_COMPREHENSION_TASKS[0];
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Task {exerciseStep + 1} of {KIDS_COMPREHENSION_TASKS.length}</span>
                          <button onClick={() => playAudioPrompt(task.instruction)} className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1">
                            <SoundIcon className="w-4 h-4" /> Listen 🔊
                          </button>
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900">{task.title}</h3>
                        <p className="text-xs font-bold text-slate-600">{task.instruction}</p>
                        <div className="space-y-3">
                          {task.steps.map((st) => (
                            <div key={st.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                              <div>
                                <div className="font-extrabold text-sm text-slate-900">{st.text}</div>
                                <div className="text-xs text-slate-500">{st.detail}</div>
                              </div>
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            addXp(25, task.title);
                            if (exerciseStep < KIDS_COMPREHENSION_TASKS.length - 1) {
                              setExerciseStep((s) => s + 1);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                        >
                          Complete Task → Next Task
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Kids Grammar */}
              {activeArea === 'grammar' && (
                <div className="space-y-6">
                  {(() => {
                    const gr = KIDS_GRAMMAR_ROUNDS[exerciseStep] || KIDS_GRAMMAR_ROUNDS[0];
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Round {exerciseStep + 1} of {KIDS_GRAMMAR_ROUNDS.length}</span>
                          <button onClick={() => playAudioPrompt(gr.explanation)} className="p-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-1">
                            <SoundIcon className="w-4 h-4" /> Listen 🔊
                          </button>
                        </div>
                        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900">
                          <div className="text-xs font-bold uppercase">Broken Phrase:</div>
                          <div className="text-base font-extrabold">"{gr.brokenSentence}"</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-100 border text-xs font-bold text-slate-700">
                          Arrange words into correct past tense: "{gr.targetSentence.join(' ')}"
                        </div>
                        <button
                          onClick={() => {
                            addXp(20, 'Grammar Past Tense');
                            setLastFeedback(gr.explanation);
                            if (exerciseStep < KIDS_GRAMMAR_ROUNDS.length - 1) {
                              setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-teal-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                        >
                          Verify Past Tense →
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Kids Social */}
              {activeArea === 'social' && (
                <div className="space-y-6">
                  {(() => {
                    const sc = KIDS_SOCIAL_SCENARIOS[exerciseStep] || KIDS_SOCIAL_SCENARIOS[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Scenario {exerciseStep + 1} of {KIDS_SOCIAL_SCENARIOS.length}</div>
                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 font-extrabold text-sm text-purple-900">
                          {sc.scenario}
                        </div>
                        <div className="space-y-2">
                          {sc.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isBest) {
                                  addXp(20, 'Kindness Scenario');
                                  setLastFeedback(sc.feedback);
                                  if (exerciseStep < KIDS_SOCIAL_SCENARIOS.length - 1) {
                                    setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                                  }
                                } else {
                                  setLastFeedback('Choose the polite and respectful response!');
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-purple-600 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Kids Phonology */}
              {activeArea === 'phonology' && (
                <div className="space-y-6">
                  {(() => {
                    const ph = KIDS_PHONOLOGY_WORDS[exerciseStep] || KIDS_PHONOLOGY_WORDS[0];
                    return (
                      <div className="space-y-4 text-center">
                        <div className="text-xs font-bold text-slate-500">Word {exerciseStep + 1} of {KIDS_PHONOLOGY_WORDS.length}</div>
                        <div className="text-3xl font-black text-slate-900">{ph.word}</div>
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-extrabold">
                          Syllables: {ph.chunks.join(' - ')} ({ph.syllables} claps)
                        </div>
                        <button
                          onClick={() => {
                            playAudioPrompt(ph.audioPrompt);
                            addXp(20, 'Syllable Clapping');
                            if (exerciseStep < KIDS_PHONOLOGY_WORDS.length - 1) {
                              setTimeout(() => setExerciseStep((s) => s + 1), 1500);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-2 mx-auto"
                        >
                          <SoundIcon className="w-4 h-4" /> Clap & Pronounce 🔊
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Kids Memory */}
              {activeArea === 'memory' && (
                <div className="space-y-6">
                  {(() => {
                    const mem = KIDS_MEMORY_LISTS[exerciseStep] || KIDS_MEMORY_LISTS[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Round {exerciseStep + 1} of {KIDS_MEMORY_LISTS.length}</div>
                        <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-200 font-extrabold text-sm text-cyan-900">
                          {mem.prompt}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {mem.items.map((it, idx) => (
                            <span key={idx} className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-black text-sm text-slate-800 shadow-2xs">
                              {it}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            addXp(20, 'Shopping List Recall');
                            if (exerciseStep < KIDS_MEMORY_LISTS.length - 1) {
                              setExerciseStep((s) => s + 1);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-cyan-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                        >
                          Recalled All Items → Next Round
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Kids Narrative */}
              {activeArea === 'discourse' && (
                <div className="space-y-6">
                  {(() => {
                    const puzzle = KIDS_NARRATIVE_PUZZLES[exerciseStep] || KIDS_NARRATIVE_PUZZLES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Puzzle {exerciseStep + 1} of {KIDS_NARRATIVE_PUZZLES.length}</div>
                        <h3 className="font-extrabold text-base text-slate-900">{puzzle.title}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {puzzle.cards.map((c) => (
                            <div key={c.id} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                              <div className="text-3xl">{c.icon}</div>
                              <div className="text-xs font-extrabold text-emerald-900">{c.text}</div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            addXp(25, puzzle.title);
                            if (exerciseStep < KIDS_NARRATIVE_PUZZLES.length - 1) {
                              setExerciseStep((s) => s + 1);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                        >
                          Story Sequenced → Next Puzzle
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* TEENS MODULE CONTENT (6 EXERCISES PER MODULE) */}
          {activeTier === 'teens' && (
            <div>
              {/* Teen Vocab */}
              {activeArea === 'vocab' && (
                <div className="space-y-6">
                  {(() => {
                    const ex = TEEN_VOCAB_EXERCISES[exerciseStep] || TEEN_VOCAB_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Exercise {exerciseStep + 1} of {TEEN_VOCAB_EXERCISES.length}</div>
                        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 font-extrabold text-sm text-indigo-950">
                          "{ex.sentence}"
                        </div>
                        <div className="text-xs font-bold text-slate-700">{ex.prompt}</div>
                        <div className="space-y-2">
                          {ex.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  addXp(20, 'Teen Vocab Clues');
                                  setLastFeedback(ex.explanation);
                                  if (exerciseStep < TEEN_VOCAB_EXERCISES.length - 1) {
                                    setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                                  }
                                } else {
                                  setLastFeedback('Review the context clues in the sentence.');
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-600 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Teen Comprehension Sarcasm */}
              {activeArea === 'comprehension' && (
                <div className="space-y-6">
                  {(() => {
                    const ex = TEEN_SARCASM_EXERCISES[exerciseStep] || TEEN_SARCASM_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Exercise {exerciseStep + 1} of {TEEN_SARCASM_EXERCISES.length} · {ex.speakerTone}</span>
                          <button onClick={() => playAudioPrompt(ex.quote)} className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1">
                            <SoundIcon className="w-4 h-4" /> Listen Quote 🔊
                          </button>
                        </div>
                        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 font-extrabold text-base text-indigo-950">
                          {ex.quote}
                        </div>
                        <div className="text-xs font-bold text-slate-700">{ex.prompt}</div>
                        <div className="space-y-2">
                          {ex.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  addXp(20, 'Sarcasm Decoder');
                                  setLastFeedback(ex.explanation);
                                  if (exerciseStep < TEEN_SARCASM_EXERCISES.length - 1) {
                                    setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                                  }
                                } else {
                                  setLastFeedback('Look beyond the surface words to the speaker\'s tone.');
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-600 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Teen Grammar Conjunctions */}
              {activeArea === 'grammar' && (
                <div className="space-y-6">
                  {(() => {
                    const ex = TEEN_GRAMMAR_EXERCISES[exerciseStep] || TEEN_GRAMMAR_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Exercise {exerciseStep + 1} of {TEEN_GRAMMAR_EXERCISES.length} · Conjunction: {ex.targetConjunction}</div>
                        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 space-y-1 text-xs font-extrabold">
                          <div>A: "{ex.sentenceA}"</div>
                          <div>B: "{ex.sentenceB}"</div>
                        </div>
                        <div className="text-xs font-bold text-slate-700">{ex.prompt}</div>
                        <div className="space-y-2">
                          {ex.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  addXp(20, 'Conjunction Synthesizer');
                                  setLastFeedback(ex.explanation);
                                  if (exerciseStep < TEEN_GRAMMAR_EXERCISES.length - 1) {
                                    setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                                  }
                                } else {
                                  setLastFeedback('Choose the sentence that correctly uses ' + ex.targetConjunction);
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-teal-600 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Teen Social Empathy */}
              {activeArea === 'social' && (
                <div className="space-y-6">
                  {(() => {
                    const ex = TEEN_SOCIAL_EXERCISES[exerciseStep] || TEEN_SOCIAL_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Dilemma {exerciseStep + 1} of {TEEN_SOCIAL_EXERCISES.length}</div>
                        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 font-extrabold text-sm text-purple-950">
                          {ex.scenario}
                        </div>
                        <div className="space-y-2">
                          {ex.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  addXp(20, 'Teen Empathy Drill');
                                  setLastFeedback(ex.explanation);
                                  if (exerciseStep < TEEN_SOCIAL_EXERCISES.length - 1) {
                                    setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                                  }
                                } else {
                                  setLastFeedback('Consider the long-term impact on friendship and trust.');
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-purple-600 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Teen Phonology Morphological */}
              {activeArea === 'phonology' && (
                <div className="space-y-6">
                  {(() => {
                    const ex = TEEN_PHONOLOGY_EXERCISES[exerciseStep] || TEEN_PHONOLOGY_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Word {exerciseStep + 1} of {TEEN_PHONOLOGY_EXERCISES.length}</div>
                        <div className="text-2xl font-black text-slate-900 text-center p-4 bg-rose-50 rounded-2xl border border-rose-200">
                          {ex.word}
                        </div>
                        <div className="text-xs font-bold text-slate-700">{ex.prompt}</div>
                        <div className="space-y-2">
                          {ex.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  addXp(20, 'Morphology Deconstruction');
                                  setLastFeedback(ex.explanation);
                                  if (exerciseStep < TEEN_PHONOLOGY_EXERCISES.length - 1) {
                                    setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                                  }
                                } else {
                                  setLastFeedback('Identify prefix, root, and suffix clearly.');
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-rose-500 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Teen Memory Audio Lecture */}
              {activeArea === 'memory' && (
                <div className="space-y-6">
                  {(() => {
                    const ex = TEEN_MEMORY_EXERCISES[exerciseStep] || TEEN_MEMORY_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Lecture {exerciseStep + 1} of {TEEN_MEMORY_EXERCISES.length}</span>
                          <button onClick={() => playAudioPrompt(ex.lectureText)} className="p-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center gap-1">
                            <SoundIcon className="w-4 h-4" /> Listen Science Lecture 🔊
                          </button>
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900">{ex.lectureTitle}</h3>
                        <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs font-medium text-cyan-950">
                          {ex.lectureText}
                        </div>
                        <div className="text-xs font-bold text-slate-700">{ex.factsPrompt}</div>
                        <div className="space-y-2">
                          {ex.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  addXp(25, 'Audio Note-Taking');
                                  if (exerciseStep < TEEN_MEMORY_EXERCISES.length - 1) {
                                    setExerciseStep((s) => s + 1);
                                  }
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-cyan-600 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Teen Narrative Pitches */}
              {activeArea === 'discourse' && (
                <div className="space-y-6">
                  {(() => {
                    const ex = TEEN_NARRATIVE_EXERCISES[exerciseStep] || TEEN_NARRATIVE_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Movie Pitch {exerciseStep + 1} of {TEEN_NARRATIVE_EXERCISES.length}</div>
                        <h3 className="font-extrabold text-base text-slate-900">{ex.title}</h3>
                        <div className="space-y-3">
                          {ex.steps.map((st, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                              <span className="text-xs font-black uppercase text-indigo-600 block">{st.label}</span>
                              <span className="text-xs font-bold text-slate-800">{st.text}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            addXp(25, ex.title);
                            if (exerciseStep < TEEN_NARRATIVE_EXERCISES.length - 1) {
                              setExerciseStep((s) => s + 1);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                        >
                          Structured Pitch → Next Pitch
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ADULTS MODULE CONTENT (8 EXERCISES PER MODULE) */}
          {activeTier === 'adults' && (
            <div>
              {/* Adult Vocab Executive */}
              {activeArea === 'vocab' && (
                <div className="space-y-6">
                  {(() => {
                    const ex = ADULT_VOCAB_EXERCISES[exerciseStep] || ADULT_VOCAB_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Exercise {exerciseStep + 1} of {ADULT_VOCAB_EXERCISES.length}</div>
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                          <div className="text-xs font-bold uppercase text-amber-600">Informal Raw Phrase:</div>
                          <div className="text-sm font-extrabold">"{ex.informal}"</div>
                        </div>
                        <div className="text-xs font-bold text-slate-700">Select Executive Tone Substitution:</div>
                        <div className="space-y-2">
                          {ex.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isExecutive) {
                                  addXp(20, 'Executive Tone');
                                  setLastFeedback(ex.explanation);
                                  if (exerciseStep < ADULT_VOCAB_EXERCISES.length - 1) {
                                    setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                                  }
                                } else {
                                  setLastFeedback('Select the phrase that reframes constructively.');
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-amber-500 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Adult Document Scanners */}
              {activeArea === 'comprehension' && (
                <div className="space-y-6">
                  {(() => {
                    const doc = ADULT_DOC_EXERCISES[exerciseStep] || ADULT_DOC_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Document {exerciseStep + 1} of {ADULT_DOC_EXERCISES.length}</div>
                        <h3 className="font-extrabold text-base text-slate-900">{doc.title}</h3>
                        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-950 leading-relaxed">
                          {doc.text}
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold">
                          Core Takeaway: {doc.answer}
                        </div>
                        <button
                          onClick={() => {
                            addXp(20, doc.title);
                            if (exerciseStep < ADULT_DOC_EXERCISES.length - 1) {
                              setExerciseStep((s) => s + 1);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                        >
                          Document Scanned → Next Clause
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Adult Email Editing */}
              {activeArea === 'grammar' && (
                <div className="space-y-6">
                  {(() => {
                    const email = ADULT_EMAIL_EXERCISES[exerciseStep] || ADULT_EMAIL_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Email {exerciseStep + 1} of {ADULT_EMAIL_EXERCISES.length}</div>
                        <div className="p-4 rounded-2xl bg-slate-100 border text-slate-800 text-xs font-bold">
                          Raw Draft: "{email.rawEmail}"
                        </div>
                        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 font-mono text-xs text-teal-950 whitespace-pre-line">
                          {email.polishedEmail}
                        </div>
                        <button
                          onClick={() => {
                            addXp(20, 'Email Polishing');
                            if (exerciseStep < ADULT_EMAIL_EXERCISES.length - 1) {
                              setExerciseStep((s) => s + 1);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-teal-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                        >
                          Polished & Sent → Next Email
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Adult Social Workplace Mock */}
              {activeArea === 'social' && (
                <div className="space-y-6">
                  {(() => {
                    const sc = ADULT_SOCIAL_EXERCISES[exerciseStep] || ADULT_SOCIAL_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Workplace Drill {exerciseStep + 1} of {ADULT_SOCIAL_EXERCISES.length}</div>
                        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 font-extrabold text-sm text-purple-950">
                          {sc.scenario}
                        </div>
                        <div className="space-y-2">
                          {sc.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  addXp(20, 'Workplace Mock Drill');
                                  setLastFeedback(sc.explanation);
                                  if (exerciseStep < ADULT_SOCIAL_EXERCISES.length - 1) {
                                    setTimeout(() => setExerciseStep((s) => s + 1), 1800);
                                  }
                                } else {
                                  setLastFeedback('Choose the response that maintains professional rapport.');
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-purple-600 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Adult Phonology Corporate Terms */}
              {activeArea === 'phonology' && (
                <div className="space-y-6">
                  {(() => {
                    const term = ADULT_PHONOLOGY_TERMS[exerciseStep] || ADULT_PHONOLOGY_TERMS[0];
                    return (
                      <div className="space-y-4 text-center">
                        <div className="text-xs font-bold text-slate-500">Corporate Term {exerciseStep + 1} of {ADULT_PHONOLOGY_TERMS.length}</div>
                        <div className="text-3xl font-black text-slate-900">{term.term}</div>
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-extrabold">
                          Syllable Breakdown: {term.syllables} · {term.stress}
                        </div>
                        <button
                          onClick={() => {
                            playAudioPrompt(term.audioPrompt);
                            addXp(20, 'Corporate Articulation');
                            if (exerciseStep < ADULT_PHONOLOGY_TERMS.length - 1) {
                              setTimeout(() => setExerciseStep((s) => s + 1), 1500);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-2 mx-auto"
                        >
                          <SoundIcon className="w-4 h-4" /> Articulate Term 🔊
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Adult Memory Mnemonics */}
              {activeArea === 'memory' && (
                <div className="space-y-6">
                  {(() => {
                    const mn = ADULT_MEMORY_WORKFLOWS[exerciseStep] || ADULT_MEMORY_WORKFLOWS[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Mnemonic {exerciseStep + 1} of {ADULT_MEMORY_WORKFLOWS.length}</div>
                        <h3 className="font-extrabold text-base text-slate-900">{mn.title}</h3>
                        <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 font-black text-sm">
                          {mn.mnemonic}
                        </div>
                        <div className="text-xs font-bold text-slate-700">{mn.prompt}</div>
                        <div className="space-y-2">
                          {mn.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (opt.isCorrect) {
                                  addXp(20, 'Executive Mnemonic');
                                  if (exerciseStep < ADULT_MEMORY_WORKFLOWS.length - 1) {
                                    setExerciseStep((s) => s + 1);
                                  }
                                }
                              }}
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-cyan-600 hover:text-white font-extrabold text-xs text-left transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Adult Discourse Escalation Pitches */}
              {activeArea === 'discourse' && (
                <div className="space-y-6">
                  {(() => {
                    const pitch = ADULT_DISCOURSE_EXERCISES[exerciseStep] || ADULT_DISCOURSE_EXERCISES[0];
                    return (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-500">Elevator Pitch {exerciseStep + 1} of {ADULT_DISCOURSE_EXERCISES.length}</div>
                        <h3 className="font-extrabold text-base text-slate-900">{pitch.title}</h3>
                        <div className="space-y-3">
                          {pitch.steps.map((st, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                              <span className="text-xs font-black uppercase text-emerald-700 block">{st.label}</span>
                              <span className="text-xs font-bold text-slate-900">{st.text}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            addXp(25, pitch.title);
                            if (exerciseStep < ADULT_DISCOURSE_EXERCISES.length - 1) {
                              setExerciseStep((s) => s + 1);
                            }
                          }}
                          className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                        >
                          Pitch Delivered → Next Pitch
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Feedback banner */}
          {lastFeedback && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-in fade-in">
              {lastFeedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

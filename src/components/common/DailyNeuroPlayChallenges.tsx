import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Zap,
  Star,
  Brain,
  Headphones,
  Target,
  Volume2,
} from 'lucide-react';

export interface NeuroPlayTask {
  id: string;
  category: string;
  title: string;
  description: string;
  xpReward: number;
  iconName: 'target' | 'headphones' | 'brain' | 'volume';
}

const ALL_TASK_POOL: NeuroPlayTask[] = [
  {
    id: 'task-phoneme-matching',
    category: '🎯 Phoneme Matching',
    title: 'Phoneme Matching Challenge',
    description: 'Listen to 3 target words and identify which two start with the same /s/ or /sh/ sound blend.',
    xpReward: 50,
    iconName: 'target',
  },
  {
    id: 'task-auditory-recall',
    category: '🎧 Auditory Recall',
    title: 'Auditory Sequence Recall',
    description: 'Hear a 4-tone acoustic rhythm and repeat the sequence using verbal or clapping cadence.',
    xpReward: 50,
    iconName: 'headphones',
  },
  {
    id: 'task-syllable-tap',
    category: '🧠 Syllable Scaffolding',
    title: 'Rhythmic Syllable Tap',
    description: 'Tap 3 multi-syllable vocabulary words (2 taps per beat) to reinforce phonological memory.',
    xpReward: 50,
    iconName: 'brain',
  },
  {
    id: 'task-sentence-recast',
    category: '🗣️ Expressive Speech',
    title: 'Positive Sentence Recast',
    description: 'Practice expanding 1 short phrase (e.g. "Dog run") into a full sentence ("Yes, the happy dog is running!").',
    xpReward: 50,
    iconName: 'volume',
  },
  {
    id: 'task-working-memory',
    category: '🧠 Working Memory',
    title: 'Vocabulary Memory Anchor',
    description: 'Name 3 animal target words, wait 10 seconds, then recall all 3 in reverse order.',
    xpReward: 50,
    iconName: 'brain',
  },
  {
    id: 'task-rhyme-detective',
    category: '🎯 Rhyme Detective',
    title: 'Phonological Rhyme Match',
    description: 'Find 3 rhyming word pairs ending in "-at" (cat, hat, mat) or "-ing" (ring, sing, wing).',
    xpReward: 50,
    iconName: 'target',
  },
];

export const DailyNeuroPlayChallenges: React.FC = () => {
  const [activeTasks, setActiveTasks] = useState<NeuroPlayTask[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>({});
  const [totalXpEarned, setTotalXpEarned] = useState<number>(0);
  const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null);

  // Load active tasks & completion state from localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('lingua_daily_neuroplay_active_tasks');
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length === 3) {
          setActiveTasks(parsed);
        } else {
          setActiveTasks(ALL_TASK_POOL.slice(0, 3));
        }
      } else {
        setActiveTasks(ALL_TASK_POOL.slice(0, 3));
      }

      const savedCompleted = localStorage.getItem('lingua_daily_neuroplay_completed');
      if (savedCompleted) {
        const parsedComp = JSON.parse(savedCompleted);
        setCompletedTaskIds(parsedComp);

        // Calculate XP
        let sumXp = 0;
        Object.keys(parsedComp).forEach((id) => {
          if (parsedComp[id]) sumXp += 50;
        });
        setTotalXpEarned(sumXp);
      }
    } catch {
      setActiveTasks(ALL_TASK_POOL.slice(0, 3));
    }
  }, []);

  // Save active tasks to localStorage
  const saveTasksToStorage = (tasks: NeuroPlayTask[]) => {
    try {
      localStorage.setItem('lingua_daily_neuroplay_active_tasks', JSON.stringify(tasks));
    } catch {}
  };

  // Play celebration audio tone using Web Audio API
  const playCelebrationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      const now = ctx.currentTime;
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5

      osc2.frequency.setValueAtTime(261.63, now); // C4
      osc2.frequency.exponentialRampToValueAtTime(329.63, now + 0.15); // E4
      osc2.frequency.exponentialRampToValueAtTime(392.00, now + 0.3); // G4

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch {}
  };

  const handleEarnXp = (task: NeuroPlayTask) => {
    if (completedTaskIds[task.id]) return; // Already completed

    playCelebrationChime();
    setAnimatingTaskId(task.id);

    setTimeout(() => {
      setAnimatingTaskId(null);
    }, 1200);

    const updated = { ...completedTaskIds, [task.id]: true };
    setCompletedTaskIds(updated);
    setTotalXpEarned((prev) => prev + task.xpReward);

    try {
      localStorage.setItem('lingua_daily_neuroplay_completed', JSON.stringify(updated));
    } catch {}
  };

  const handleRefreshTasks = () => {
    // Shuffle task pool to pick 3 random tasks
    const shuffled = [...ALL_TASK_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setActiveTasks(selected);
    saveTasksToStorage(selected);
  };

  return (
    <div className="bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5 backdrop-blur-xl border border-purple-200/60 dark:border-purple-800/60 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 transition-all">
      {/* Header Bar with Total XP Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 dark:border-purple-900/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              🎮 Daily NeuroPlay Challenges
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
              Interactive Tasks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Complete today's 3 micro-cognitive exercises to strengthen auditory processing and earn XP!
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          {/* XP Total Meter */}
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center gap-2 shadow-xs">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>⚡ +{totalXpEarned} XP Earned Today</span>
          </div>

          {/* Refresh Tasks Button */}
          <button
            type="button"
            onClick={handleRefreshTasks}
            className="p-2 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white transition-all cursor-pointer"
            title="Refresh Daily Tasks 🎲"
            aria-label="Refresh Daily Tasks"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeTasks.map((task) => {
          const isCompleted = !!completedTaskIds[task.id];
          const isAnimating = animatingTaskId === task.id;

          return (
            <div
              key={task.id}
              className={`relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 ${
                isCompleted
                  ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-purple-200/50 dark:hover:shadow-purple-950/50'
              }`}
            >
              {/* Animated Floating +50 XP Celebration Effect */}
              {isAnimating && (
                <div className="absolute -top-3 right-4 z-20 px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-lg animate-bounce flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                  <span>+50 XP!</span>
                </div>
              )}

              <div className="space-y-3">
                {/* Category Badge & XP Reward Pill */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                    {task.category}
                  </span>
                  <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>50 XP</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {task.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Earn 50 XP Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleEarnXp(task)}
                  disabled={isCompleted}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md cursor-default'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Completed (+50 XP) ✓</span>
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 text-yellow-300" />
                      <span>Earn 50 XP ⭐</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

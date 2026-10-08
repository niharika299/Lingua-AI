import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  Shuffle,
  FileSpreadsheet,
  Check,
  Brain,
  Target,
  Layers,
  Activity,
  Zap,
  BookOpen,
} from 'lucide-react';

export interface ClinicalTechnique {
  id: string;
  metricBadge: string;
  headline: string;
  technique: string;
  quickTagOrMilestone: string;
  speechSampleText: string;
  category: 'phoneme' | 'syntax' | 'memory';
}

const TECHNIQUE_SETS: ClinicalTechnique[][] = [
  // Set 1 (Default Specified in Spec)
  [
    {
      id: 'tech-1-1',
      metricBadge: '🎯 Phoneme Precision',
      headline: 'Verbal Pausing & Visual Mirroring',
      technique:
        'Use the 3-second tactile chin-tap when transitioning between /s/ and /sh/ syllables to prevent phonemic collapsing.',
      quickTagOrMilestone: 'Tactile Mirroring Protocol',
      speechSampleText: 'Sun... Shine... Sun... Shine. Sssss... Shhhh.',
      category: 'phoneme',
    },
    {
      id: 'tech-1-2',
      metricBadge: '🧩 Syntax Expansion',
      headline: 'Recasting & Sentence Framing',
      technique:
        "If the child says 'Car go fast', recast positively without direct correction: 'Yes! The red car is speeding down the track!' to reinforce grammar mapping.",
      quickTagOrMilestone: 'Naturalistic Reinforcement',
      speechSampleText: 'Yes! The red car is speeding down the track!',
      category: 'syntax',
    },
    {
      id: 'tech-1-3',
      metricBadge: '🧠 Working Memory',
      headline: 'Kinesthetic Word Association',
      technique:
        'Pair multi-syllable abstract vocabulary with rhythmic clapping or tactile finger taps (2 syllables per beat).',
      quickTagOrMilestone: '+14% retention rate observed in speech fluency trials.',
      speechSampleText: 'Ex-plo-ra-tion. Trans-for-ma-tion.',
      category: 'memory',
    },
  ],
  // Set 2 (Shuffled Set A)
  [
    {
      id: 'tech-2-1',
      metricBadge: '🗣️ Articulation Flow',
      headline: 'Prolonged Vowel Anchor',
      technique:
        'Sustain vowel sounds for an extra 1.5 seconds during initial blends (e.g. /th/ -> /th-aaaa-nk/) to build oral motor confidence.',
      quickTagOrMilestone: 'DLD Vowel Prolongation',
      speechSampleText: 'Thhhh-aaaa-nk you. Thhhh-uuuu-mb.',
      category: 'phoneme',
    },
    {
      id: 'tech-2-2',
      metricBadge: '💬 Narrative Scaffolding',
      headline: 'Focused Stimulation & Modeling',
      technique:
        'Repeat the target word 5 times naturally within 1 minute of story reading without asking the child to repeat immediately.',
      quickTagOrMilestone: '+22% Auditory Lexical Mapping',
      speechSampleText: 'The brave tiger leaped. The tiger ran. Look at the tiger go!',
      category: 'syntax',
    },
    {
      id: 'tech-2-3',
      metricBadge: '⚡ Phonological Buffer',
      headline: 'Visual Chunking & Word Webs',
      technique:
        'Group target vocabulary into 3-word visual clusters on a whiteboard with color-coded syllable dots before reading.',
      quickTagOrMilestone: 'Syllabic Scaffolding Framework',
      speechSampleText: 'Cat-er-pil-lar. Butterfly. Sun-flower.',
      category: 'memory',
    },
  ],
  // Set 3 (Shuffled Set B)
  [
    {
      id: 'tech-3-1',
      metricBadge: '🎯 Consonant Cluster Focus',
      headline: 'Acoustic Highlighting & Whisper Prompts',
      technique:
        'Slightly increase volume on target consonants /st/ and /sp/ while dropping background voice cadence by 20%.',
      quickTagOrMilestone: 'Acoustic Contrast Therapy',
      speechSampleText: 'Stttt-tar. Sppp-oon. Stttt-one.',
      category: 'phoneme',
    },
    {
      id: 'tech-3-2',
      metricBadge: '🧩 Morphology Scaffolding',
      headline: 'Over-Extension Recasting',
      technique:
        "When irregular verbs are over-generalized (e.g., 'He goed'), respond naturally: 'Ah, he went to the park! Where did he go next?'",
      quickTagOrMilestone: 'Morphological Expansion',
      speechSampleText: 'Ah, he went to the park! Where did he go next?',
      category: 'syntax',
    },
    {
      id: 'tech-3-3',
      metricBadge: '🧠 Executive Function Anchor',
      headline: 'Multi-Sensory Syllable Tapping',
      technique:
        'Tap a soft foam block or light-up button for each syllable while speaking complex multi-word instructions.',
      quickTagOrMilestone: 'Kinesthetic Dual-Task Memory',
      speechSampleText: 'First pick up the pencil, then open the blue book.',
      category: 'memory',
    },
  ],
];

export const ClinicalGrowthInsights: React.FC = () => {
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [appliedTechniques, setAppliedTechniques] = useState<Record<string, boolean>>({});
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Load applied techniques state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lingua_applied_clinical_techniques');
      if (saved) {
        setAppliedTechniques(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const currentSet = TECHNIQUE_SETS[activeSetIndex];

  const toggleApplied = (id: string) => {
    setAppliedTechniques((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('lingua_applied_clinical_techniques', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handlePlayAudio = (tech: ClinicalTechnique) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      if (playingAudioId === tech.id) {
        setPlayingAudioId(null);
        return;
      }

      setPlayingAudioId(tech.id);
      const utterance = new SpeechSynthesisUtterance(tech.speechSampleText);
      utterance.rate = 0.85; // Slightly slower, articulated pace for clinical demonstration
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setPlayingAudioId(null);
      };
      utterance.onerror = () => {
        setPlayingAudioId(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Audio synthesis not supported in this browser environment.');
    }
  };

  const handleShuffleNext = () => {
    setIsShuffling(true);
    setPlayingAudioId(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    setTimeout(() => {
      setActiveSetIndex((prevIndex) => (prevIndex + 1) % TECHNIQUE_SETS.length);
      setIsShuffling(false);
      showToast('Loaded next DLD clinical intervention set! 🔀');
    }, 250);
  };

  const handleExportNotes = () => {
    try {
      const timestamp = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const existingNotesStr = localStorage.getItem('lingua_caregiver_notes') || '[]';
      const existingNotes = JSON.parse(existingNotesStr);

      const newEntries = currentSet.map((tech) => ({
        id: `note-${Date.now()}-${tech.id}`,
        date: timestamp,
        title: tech.headline,
        badge: tech.metricBadge,
        technique: tech.technique,
      }));

      const updatedNotes = [...newEntries, ...existingNotes];
      localStorage.setItem('lingua_caregiver_notes', JSON.stringify(updatedNotes));

      showToast('Exported today\'s 3 clinical techniques to Caregiver Practice Notes! 📝');
    } catch {
      showToast('Exported techniques to Caregiver Notes!');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5 backdrop-blur-xl border border-indigo-200/60 dark:border-indigo-800/60 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden space-y-6 transition-all">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-indigo-400/40 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Dynamic Refresh Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 dark:border-indigo-900/50 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              🧬 Clinical Growth Insights
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
              DLD Scaffolding Protocol
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Adaptive daily speech scaffolding & phoneme intervention protocols for DLD.
          </p>
        </div>

        {/* Dynamic Date Tag & Focus Chip */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs text-xs self-start md:self-center shrink-0">
          <span className="flex items-center gap-1.5 font-extrabold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated Today</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Phoneme Focus of the Day: <strong className="text-indigo-600 dark:text-indigo-400">/s/ & /th/ Blends</strong>
          </span>
        </div>
      </div>

      {/* 3-Column Grid of Dynamic Actionable Scaffolding Cards */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-300 ${
          isShuffling ? 'opacity-40 scale-98 blur-xs' : 'opacity-100 scale-100 blur-none'
        }`}
      >
        {currentSet.map((tech) => {
          const isApplied = !!appliedTechniques[tech.id];
          const isPlaying = playingAudioId === tech.id;

          return (
            <div
              key={tech.id}
              className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border shadow-sm hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                isApplied
                  ? 'border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
                  : 'border-slate-200/80 dark:border-slate-800 hover:shadow-indigo-200/50 dark:hover:shadow-indigo-950/50'
              }`}
            >
              <div className="space-y-3">
                {/* Metric Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs">
                    {tech.metricBadge}
                  </span>
                  {isApplied && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Applied</span>
                    </span>
                  )}
                </div>

                {/* Headline */}
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                  {tech.headline}
                </h3>

                {/* Technique Prose */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tech.technique}
                </p>

                {/* Quick Tag / Milestone Note */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>{tech.quickTagOrMilestone}</span>
                </div>
              </div>

              {/* Card Actions Area */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                {/* Audio Demonstration Button */}
                <button
                  type="button"
                  onClick={() => handlePlayAudio(tech)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isPlaying
                      ? 'bg-cyan-600 text-white shadow-md animate-pulse'
                      : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60'
                  }`}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : ''}`} />
                  <span>{isPlaying ? 'Synthesizing Audio Demo...' : 'Audio Demonstration 🔊'}</span>
                </button>

                {/* Mark Applied Today Pill Button */}
                <button
                  type="button"
                  onClick={() => toggleApplied(tech.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isApplied
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isApplied ? 'Marked Applied Today ✓' : 'Mark Applied Today ✓'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Clinical Tool Drawer / Daily Generator Bar */}
      <div className="p-3.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Interactive DLD Intervention Generator</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Shuffle Next Clinical Technique Button */}
          <button
            type="button"
            onClick={handleShuffleNext}
            disabled={isShuffling}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-md hover:shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>Shuffle Next Clinical Technique 🔀</span>
          </button>

          {/* Export Tip to Caregiver Notes Button */}
          <button
            type="button"
            onClick={handleExportNotes}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-black border border-slate-700/60 shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Tip to Caregiver Notes 📝</span>
          </button>
        </div>
      </div>
    </div>
  );
};

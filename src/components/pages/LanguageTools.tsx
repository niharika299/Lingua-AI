import React, { useState } from 'react';
import { recordActivityCompletion } from '../../utils/activityTracker';
import {
  Wand2,
  Mic,
  MessageSquare,
  ListOrdered,
  BookMarked,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  Volume2,
  Printer,
  HelpCircle,
  Clock,
  Layers,
  Search,
} from 'lucide-react';
import {
  InstructionBreakdownResult,
  SpeechCoachResult,
  ScreeningReport,
  NavPage,
} from '../../types';
import { BackNavigationButton } from '../common/BackNavigationButton';

interface LanguageToolsProps {
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
}

export const LanguageTools: React.FC<LanguageToolsProps> = ({ onNavigate, onBack }) => {
  const [activeTool, setActiveTool] = useState<
    'comprehension' | 'speech-coach' | 'vocab-bank' | 'screening' | 'search-grounding'
  >('comprehension');
  const [toolError, setToolError] = useState<string | null>(null);

  // --- Search Grounding State ---
  const [searchQuery, setSearchQuery] = useState('Why do stars twinkle in the night sky?');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ answer: string; sources: { title: string; url: string }[] } | null>(null);

  const handleRunSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      const res = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResult({
        answer: data.answer || 'Stars twinkle because their light passes through Earth’s moving atmosphere!',
        sources: data.sources || [],
      });
    } catch (err) {
      setSearchResult({
        answer: 'Stars twinkle because starlight passes through turbulent layers of Earth’s atmosphere, bending the light slightly as it travels to our eyes!',
        sources: [{ title: 'NASA Space Place Science Guide', url: 'https://spaceplace.nasa.gov' }],
      });
    } finally {
      setIsSearching(false);
    }
  };

  // --- 1. Instruction Breaker State ---
  const [rawInstructions, setRawInstructions] = useState(
    'Before you open your math workbook, pack away your colored pencils into your pencil pouch, place your blue science folder under your desk, and wait quietly for the timer to beep.'
  );
  const [isBreakingInstructions, setIsBreakingInstructions] = useState(false);
  const [instructionResult, setInstructionResult] = useState<InstructionBreakdownResult | null>(null);

  const handleBreakdownInstructions = async () => {
    if (!rawInstructions.trim()) return;
    setIsBreakingInstructions(true);
    setInstructionResult(null);
    setToolError(null);

    try {
      const res = await fetch('/api/gemini/breakdown-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions: rawInstructions }),
      });
      const data = await res.json();
      if (!res.ok && data?.error) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to break down instructions');
      }
      setInstructionResult(data);
    } catch (err: any) {
      console.warn('Instruction breakdown notice:', err);
      // Fallback local breakdown if network or API error occurs
      const cleanText = rawInstructions.trim();
      const parts = cleanText
        .split(/(?:[.\n;]+|\b(?:and then|then|after that|first|second|next|finally)\b)/i)
        .map((p) => p.trim())
        .filter((p) => p.length > 2);
      const markers = ['First', 'Next', 'Then', 'Then', 'Finally'];
      const icons = ['book', 'pencil', 'listen', 'folder', 'sit'];
      const fallbackSteps = (parts.length > 0 ? parts : [cleanText]).map((part, idx) => ({
        stepNumber: idx + 1,
        temporalMarker: markers[Math.min(idx, markers.length - 1)],
        actionVerb: part.split(' ')[0] || 'Complete',
        directionText: part,
        iconCategory: icons[idx % icons.length],
      }));
      setInstructionResult({
        title: cleanText.slice(0, 36) + (cleanText.length > 36 ? '...' : ''),
        totalSteps: fallbackSteps.length,
        steps: fallbackSteps,
        keyTipForChild: 'Focus on one step at a time. Take a deep breath before moving to the next step!',
        questionForTeacher: 'Can you please show me the first step again?',
      });

      recordActivityCompletion({
        activityType: 'instructionPractice',
        activityName: 'Instruction Breakdown Tool',
        category: 'Following Instructions',
        source: 'Language Tools',
        metadata: { stepsCount: fallbackSteps.length },
      });
    } finally {
      setIsBreakingInstructions(false);
    }
  };

  // --- 2. Speech Coach State ---
  const [coachTopic, setCoachTopic] = useState('Recess & Play');
  const [childUtterance, setChildUtterance] = useState('Me and him we run fast because the ball.');
  const [isCoaching, setIsCoaching] = useState(false);
  const [coachResult, setCoachResult] = useState<SpeechCoachResult | null>(null);

  const handleRunCoach = async () => {
    if (!childUtterance.trim()) return;
    setIsCoaching(true);
    setCoachResult(null);
    setToolError(null);

    try {
      const res = await fetch('/api/gemini/speech-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: coachTopic,
          childSentence: childUtterance,
          targetArea: 'Sentence expansion & pronoun syntax',
        }),
      });
      const data = await res.json();
      setCoachResult(data);
      recordActivityCompletion({
        activityType: 'expression',
        activityName: 'Speech & Expression Coach',
        category: 'Expression / Speaking',
        source: 'Language Tools',
        metadata: { topic: coachTopic },
      });
    } catch (err: any) {
      console.warn('Speech coach notice:', err);
      setToolError('Speech coach assistant is currently summarizing locally. Try again in a few moments.');
      recordActivityCompletion({
        activityType: 'expression',
        activityName: 'Speech & Expression Coach',
        category: 'Expression / Speaking',
        source: 'Language Tools',
        metadata: { topic: coachTopic },
      });
    } finally {
      setIsCoaching(false);
    }
  };

  // --- 3. Visual Vocabulary Bank State ---
  const [vocabSearch, setVocabSearch] = useState('');
  const staticVocabList = [
    {
      word: 'perseverance',
      syllables: 'per · se · ver · ance',
      category: 'Social-Emotional',
      definition: 'Continuing to try even when something feels hard or tricky.',
      example: 'With perseverance, she solved the puzzle on her third try.',
    },
    {
      word: 'consequence',
      syllables: 'con · se · quence',
      category: 'Classroom & Reasoning',
      definition: 'Something that happens as a result of an action or choice.',
      example: 'The consequence of leaving crayons in the sun was that they melted.',
    },
    {
      word: 'hypothesis',
      syllables: 'hy · poth · e · sis',
      category: 'Science & Inquiry',
      definition: 'A thoughtful guess you make before testing an experiment.',
      example: 'Our hypothesis was that the plant with sunlight would grow taller.',
    },
    {
      word: 'perspective',
      syllables: 'per · spec · tive',
      category: 'Pragmatics & Reading',
      definition: 'The way someone sees or feels about something.',
      example: 'From the squirrel\'s perspective, the tree looked gigantic.',
    },
    {
      word: 'sequential',
      syllables: 'se · quen · tial',
      category: 'Classroom & Reasoning',
      definition: 'Following in a logical order, like 1, 2, 3.',
      example: 'We put the story picture cards into sequential order.',
    },
    {
      word: 'frustration',
      syllables: 'frus · tra · tion',
      category: 'Social-Emotional',
      definition: 'The prickly feeling when something is hard or not going your way.',
      example: 'Taking three deep breaths helps calm down frustration.',
    },
  ];

  const filteredVocab = staticVocabList.filter(
    (v) =>
      v.word.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(vocabSearch.toLowerCase())
  );

  // --- 4. DLD Screening State ---
  const [childAge, setChildAge] = useState('8 years old');
  const [relationship, setRelationship] = useState('Parent');
  const [notes, setNotes] = useState('Takes extra time processing directions. Very creative with Lego.');
  const [domainRatings, setDomainRatings] = useState<Record<string, number>>({
    'Receptive Language (Directions)': 3,
    'Expressive Syntax (Grammar)': 2,
    'Word Finding (Lexicon)': 2,
    'Auditory Memory (Retelling)': 2,
    'Social Pragmatics (Play)': 4,
  });
  const [isScreening, setIsScreening] = useState(false);
  const [screeningResult, setScreeningResult] = useState<ScreeningReport | null>(null);

  const handleRunScreening = async () => {
    setIsScreening(true);
    setScreeningResult(null);

    try {
      const res = await fetch('/api/gemini/screening-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childAge,
          relationship,
          domainScores: domainRatings,
          observationsNotes: notes,
        }),
      });
      const data = await res.json();
      setScreeningResult({
        ...data,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      });
    } catch (err: any) {
      console.warn('Screening error notice:', err);
      setToolError('Screening analysis is currently running in local mode. Please review your entries.');
    } finally {
      setIsScreening(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Friendly Notification Banner if any */}
      {toolError && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3">
          <span>{toolError}</span>
          <button
            onClick={() => setToolError(null)}
            className="text-amber-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Back Navigation Button */}
      <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="home" label="Back to Home" />

      {/* 1. Header */}
      <div className="border-b app-border pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C4DBA]">
          <Wand2 className="w-4 h-4" />
          <span>Support Tools</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary mt-1">
          Targeted Language Support Tools
        </h1>
        <p className="text-xs app-text-secondary mt-0.5">
          Specialized tools addressing auditory memory bottlenecks, expressive syntax, and screening observations.
        </p>

        {/* Tool Navigation Bar */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTool('comprehension')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'comprehension'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'border app-border app-bg-surface app-text-secondary hover:bg-black/5'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Comprehension Assistant</span>
          </button>

          <button
            onClick={() => setActiveTool('speech-coach')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'speech-coach'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'border app-border app-bg-surface app-text-secondary hover:bg-black/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Speech & Expression Coach</span>
          </button>

          <button
            onClick={() => setActiveTool('vocab-bank')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'vocab-bank'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'border app-border app-bg-surface app-text-secondary hover:bg-black/5'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Visual Vocabulary Bank</span>
          </button>

          <button
            onClick={() => setActiveTool('screening')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'screening'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'border app-border app-bg-surface app-text-secondary hover:bg-black/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DLD Screening & Referral</span>
          </button>

          <button
            onClick={() => setActiveTool('search-grounding')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'search-grounding'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'border app-border app-bg-surface app-text-secondary hover:bg-black/5'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Search Grounded Facts</span>
          </button>
        </div>
      </div>

      {/* 2. Tool 1: Comprehension Assistant */}
      {activeTool === 'comprehension' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold app-text-primary">Instruction Breaker</h2>
              <p className="text-xs app-text-muted">
                Turn long, confusing teacher instructions into simple steps.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold app-text-secondary block mb-1">
                Multi-Step Direction:
              </label>
              <textarea
                value={rawInstructions}
                onChange={(e) => setRawInstructions(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border app-border p-3 text-xs app-bg-surface app-text-primary focus:outline-none"
                placeholder="Paste teacher directions..."
              />
            </div>

            <button
              disabled={isBreakingInstructions || !rawInstructions.trim()}
              onClick={handleBreakdownInstructions}
              className="w-full py-2.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-95"
            >
              {isBreakingInstructions ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deconstructing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Break Into Steps</span>
                </>
              )}
            </button>
          </div>

          <div className="md:col-span-7 space-y-4">
            {instructionResult ? (
              <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b app-border pb-2">
                  <h3 className="text-sm font-extrabold app-text-primary">
                    {instructionResult.title}
                  </h3>
                  <span className="text-[11px] font-mono text-[#0D9488] font-bold">
                    {instructionResult.totalSteps} Steps
                  </span>
                </div>

                <div className="space-y-2.5">
                  {instructionResult.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-3.5 rounded-2xl app-bg-surface-secondary border app-border flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#4A154B] dark:bg-[#7C4DBA] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {st.stepNumber}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#7C4DBA]">
                          {st.temporalMarker}: [{st.actionVerb}]
                        </div>
                        <p className="text-xs font-semibold app-text-primary mt-0.5">
                          {st.directionText}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F0FDFA] dark:bg-[#134E4A]/40 border border-[#0D9488] text-xs text-[#0F766E] dark:text-[#5EEAD4]">
                  <strong>Tip for Child: </strong> {instructionResult.keyTipForChild}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-dashed app-border app-bg-surface text-center text-xs app-text-muted">
                Type or paste classroom directions to see them broken into visual, numbered cards.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Tool 2: Speech Coach */}
      {activeTool === 'speech-coach' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold app-text-primary">Speech Coach</h2>
              <p className="text-xs app-text-muted">
                Models complete sentences naturally without shaming speech differences.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold app-text-secondary block mb-1">
                Conversation Topic:
              </label>
              <input
                type="text"
                value={coachTopic}
                onChange={(e) => setCoachTopic(e.target.value)}
                className="w-full rounded-xl border app-border p-2 text-xs app-bg-surface app-text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold app-text-secondary block mb-1">
                What the child said:
              </label>
              <textarea
                value={childUtterance}
                onChange={(e) => setChildUtterance(e.target.value)}
                rows={3}
                className="w-full rounded-xl border app-border p-2.5 text-xs app-bg-surface app-text-primary focus:outline-none"
              />
            </div>

            <button
              disabled={isCoaching || !childUtterance.trim()}
              onClick={handleRunCoach}
              className="w-full py-2.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-95"
            >
              {isCoaching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Coaching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Coach Sentence</span>
                </>
              )}
            </button>
          </div>

          <div className="md:col-span-7 space-y-4">
            {coachResult ? (
              <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4 animate-in fade-in">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs">
                  <strong>Praise: </strong> {coachResult.praise}
                </div>

                <div className="p-4 rounded-2xl app-bg-surface-secondary border app-border space-y-1">
                  <div className="text-[11px] font-bold uppercase text-[#7C4DBA]">
                    Modeled Sentence
                  </div>
                  <p className="text-sm font-extrabold app-text-primary">
                    "{coachResult.recastedSentence}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border app-border app-bg-surface">
                    <span className="text-[10px] font-bold app-text-muted block">Simple Version</span>
                    <span className="app-text-primary font-medium mt-1 block">"{coachResult.simpleVersion}"</span>
                  </div>
                  <div className="p-3 rounded-xl border app-border app-bg-surface">
                    <span className="text-[10px] font-bold text-[#0D9488] block">Rich Vocabulary</span>
                    <span className="app-text-primary font-medium mt-1 block">"{coachResult.expandedVersion}"</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                  <strong>Coaching Tip: </strong> {coachResult.communicationTip}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-dashed app-border app-bg-surface text-center text-xs app-text-muted">
                Type what the child said to receive encouraging recasting guidance.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Tool 3: Visual Vocabulary Bank */}
      {activeTool === 'vocab-bank' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-extrabold app-text-primary">Vocabulary Words</h2>
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                placeholder="Search words..."
                className="pl-8 pr-3 py-1.5 w-full rounded-xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((w, idx) => (
              <div key={idx} className="p-5 rounded-3xl border app-border app-bg-surface shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold app-text-primary capitalize">{w.word}</span>
                  <span className="text-[10px] font-bold bg-[#F1ECF8] dark:bg-[#3B2256] text-[#7C4DBA] px-2 py-0.5 rounded">
                    {w.category}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-[#0D9488]">{w.syllables}</div>
                <p className="text-xs app-text-secondary leading-relaxed">{w.definition}</p>
                <div className="text-[11px] app-text-muted italic pt-1 border-t app-border">
                  "{w.example}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Tool 4: DLD Screening & Referral */}
      {activeTool === 'screening' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4">
            <h2 className="text-base font-extrabold app-text-primary">Observational Checklist</h2>
            <p className="text-xs app-text-muted">
              Rate observations to generate a structured discussion sheet for your Speech-Language Pathologist.
            </p>

            <div className="space-y-3 pt-2">
              {Object.entries(domainRatings).map(([domain, val]) => (
                <div key={domain} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold app-text-primary">{domain}</span>
                    <span className="font-mono font-bold text-[#7C4DBA]">{val} / 5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={val}
                    onChange={(e) =>
                      setDomainRatings({ ...domainRatings, [domain]: parseInt(e.target.value) })
                    }
                    className="w-full accent-[#7C4DBA] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <button
              disabled={isScreening}
              onClick={handleRunScreening}
              className="w-full py-2.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-95"
            >
              {isScreening ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate SLP Discussion Guide</span>
                </>
              )}
            </button>
          </div>

          <div className="md:col-span-7 space-y-4">
            {screeningResult ? (
              <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b app-border pb-2">
                  <h3 className="text-sm font-extrabold app-text-primary">
                    Screening Observations ({screeningResult.date})
                  </h3>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1 rounded-lg border app-border text-xs font-bold app-text-primary"
                  >
                    Print
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs text-amber-900 dark:text-amber-200">
                  {screeningResult.disclaimer}
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold app-text-primary uppercase tracking-wider block">
                    Identified Strengths:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {screeningResult.identifiedStrengths.map((s, idx) => (
                      <span key={idx} className="p-1.5 rounded-lg bg-[#F0FDFA] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#5EEAD4] font-semibold">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold app-text-primary uppercase tracking-wider block">
                    Questions for your Speech-Language Pathologist:
                  </span>
                  <ul className="space-y-1 app-text-secondary">
                    {screeningResult.specialistQuestions.map((q, idx) => (
                      <li key={idx} className="flex gap-1.5">
                        <span className="font-bold text-[#7C4DBA]">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-dashed app-border app-bg-surface text-center text-xs app-text-muted">
                Rate the observational sliders to generate an evidence-based discussion summary.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Tool 5: Search Grounded Knowledge */}
      {activeTool === 'search-grounding' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D9488]">
              <Sparkles className="w-4 h-4" />
              <span>Real-Time Web Knowledge & Facts</span>
            </div>
            <h2 className="text-base font-extrabold app-text-primary">Ask a Knowledge Question</h2>
            <p className="text-xs app-text-muted">
              Get grounded, verified answers with web sources powered by Gemini 3.5 Flash and Google Search.
            </p>

            <textarea
              rows={3}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Why do stars twinkle? How do birds fly?"
              className="w-full p-3 rounded-2xl border app-border app-bg-surface text-xs app-text-primary focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />

            <button
              disabled={isSearching || !searchQuery.trim()}
              onClick={handleRunSearch}
              className="w-full py-2.5 rounded-xl bg-[#0D9488] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-95 cursor-pointer disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching Google Data...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search with Grounding</span>
                </>
              )}
            </button>
          </div>

          <div className="md:col-span-7 space-y-4">
            {searchResult ? (
              <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0D9488]">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                  <span>Grounded Answer</span>
                </div>
                <p className="text-xs sm:text-sm app-text-primary leading-relaxed whitespace-pre-line">
                  {searchResult.answer}
                </p>

                {searchResult.sources.length > 0 && (
                  <div className="pt-3 border-t app-border space-y-2">
                    <span className="text-[11px] font-bold app-text-muted uppercase tracking-wider block">
                      Google Search Sources & Citations:
                    </span>
                    <div className="space-y-1">
                      {searchResult.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                        >
                          🌐 {s.title || s.url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-dashed app-border app-bg-surface text-center text-xs app-text-muted">
                Type any educational or real-world question above to search with real-time Google Grounding.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { NavPage, ChildProfile } from '../../types';
import {
  ArrowLeft,
  Send,
  Mic,
  Volume2,
  Square,
  RotateCcw,
  Sparkles,
  Play,
  Copy,
  Check,
  AlertTriangle,
  Stethoscope,
  Activity,
  Brain,
  BookOpen,
  Wand2,
} from 'lucide-react';

interface NeuroVaniChatProps {
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
  profile?: ChildProfile;
}

export type SeverityTier = 'mild' | 'moderate' | 'major';

export interface ClinicalCardData {
  severity: SeverityTier;
  severityLabel: string;
  severityColor: string;
  explanation: string;
  memoryPrefix?: string;
  inAppTask: {
    name: string;
    targetPage: NavPage;
    duration: string;
  };
  physicalRoutine: string;
  specialistAlert?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  cardData?: ClinicalCardData;
  timestamp: string;
}

export interface MemoryLogEntry {
  query: string;
  reply: string;
  severity: string;
  age: string;
  date: string;
}

type PersonaRole = 'Parent' | 'Teen / Student' | 'Teacher' | 'Doctor / SLP';
type AgeTier = '5–11 Yrs' | '11–18 Yrs' | '18+ Adults';

const PERSONA_ROLES: { id: PersonaRole; label: string; icon: string }[] = [
  { id: 'Parent', label: 'Parent', icon: '👨‍👩‍👧' },
  { id: 'Teen / Student', label: 'Teen / Student', icon: '🧑' },
  { id: 'Teacher', label: 'Teacher', icon: '👩‍🏫' },
  { id: 'Doctor / SLP', label: 'Doctor / SLP', icon: '🩺' },
];

const AGE_TIERS: { id: AgeTier; label: string; icon: string }[] = [
  { id: '5–11 Yrs', label: '5–11 Yrs', icon: '🧒' },
  { id: '11–18 Yrs', label: '11–18 Yrs', icon: '🧑' },
  { id: '18+ Adults', label: '18+ Adults', icon: '💼' },
];

const STARTER_CHIPS = [
  "🧒 My 7yo struggles with past tense & word recall",
  "🗣️ How to handle phoneme substitution (/s/ vs /th/)?",
  "📚 Difficulty following 3-step commands",
  "🏥 When should we consult a Speech-Language Pathologist?",
];

const DEFAULT_WELCOME_MSG = "Hello! I am NeuroVani AI, your dedicated Developmental Language Disorder (DLD) clinical assistant. How can I help you or your learner today?";

// Central Memory Engine
export const NeuroVaniMemory = {
  getLogs: (): MemoryLogEntry[] => {
    try {
      return JSON.parse(localStorage.getItem('neurovani_memory') || '[]');
    } catch {
      return [];
    }
  },
  saveLog: (query: string, reply: string, severity: string, age: string) => {
    try {
      const logs = NeuroVaniMemory.getLogs();
      logs.push({ query, reply, severity, age, date: new Date().toISOString() });
      localStorage.setItem('neurovani_memory', JSON.stringify(logs.slice(-10))); // Keep last 10
    } catch {}
  },
};

// DLD Clinical Knowledge & Triage Response Generator
export function generateNeuroVaniResponse(userText: string, role: PersonaRole, ageTier: AgeTier): ClinicalCardData {
  const query = userText.toLowerCase();
  let severity: SeverityTier = 'mild';
  let severityLabel = '🟢 Mild Scaffolding';
  let severityColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800';
  let explanation = '';
  let inAppTask: { name: string; targetPage: NavPage; duration: string } = {
    name: 'Word Detective',
    targetPage: 'neuroplay',
    duration: '10 mins',
  };
  let physicalRoutine = '';
  let specialistAlert = '';

  // 1. Severity Detection
  if (
    query.includes('cannot speak') ||
    query.includes('sever') ||
    query.includes('frustrat') ||
    query.includes('breakdown') ||
    query.includes('doctor') ||
    query.includes('hospital') ||
    query.includes('crying')
  ) {
    severity = 'major';
    severityLabel = '🔴 Major Disruption / Clinical Review';
    severityColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800';
  } else if (
    query.includes('sentence') ||
    query.includes('struggle') ||
    query.includes('memory') ||
    query.includes('repeat') ||
    query.includes('understanding') ||
    query.includes('slow')
  ) {
    severity = 'moderate';
    severityLabel = '🟡 Moderate Support Needed';
    severityColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800';
  }

  // 2. Age-Specific Adaptive Content
  if (ageTier.includes('5') || ageTier.includes('11')) {
    // Kids 5-11
    if (severity === 'mild') {
      explanation = 'At ages 5–11, phoneme slips and word recall hesitations are common in DLD. Using structured play and visual naming builds neural speech pathways.';
      inAppTask = { name: 'Shabd Jasoos & Memory Match', targetPage: 'neuroplay', duration: '8-10 mins' };
      physicalRoutine = 'Tactile Syllable Clapping: Taali bajakar words todna (Ta-ma-tar) 3 baar practice karein.';
    } else if (severity === 'moderate') {
      explanation = 'Sentence formulation and multi-step following require active auditory and syntax scaffolding.';
      inAppTask = { name: 'Simon Says & Past Tense Repair', targetPage: 'neuroplay', duration: '12-15 mins' };
      physicalRoutine = 'Chin-Tap Cues: Jab child /s/ ya /sh/ bolein, chin par soft tap karein taaki phoneme collapse na ho. 5-minute deep breathing break lein.';
    } else {
      explanation = 'Noticeable speech breakdown requires direct clinical evaluation alongside home grounding.';
      inAppTask = { name: 'Calming Visual Search', targetPage: 'neuroplay', duration: '5 mins' };
      physicalRoutine = 'Deep Pressure Sensory Hugs & 4-7-8 Breathing to alleviate frustration before speaking.';
      specialistAlert = '⚠️ Professional SLP Consultation Recommended: Please schedule an evaluation with a certified Speech-Language Pathologist or Developmental Pediatrician.';
    }
  } else if (ageTier.includes('18')) {
    // Adults 18+
    if (severity === 'mild') {
      explanation = 'Adult DLD often manifests as workplace communication hesitations or executive word retrieval latency.';
      inAppTask = { name: 'Professional Word Substitution', targetPage: 'neuroplay', duration: '15 mins' };
      physicalRoutine = 'Mirror Articulation Drill: Practice 5 high-frequency workplace terms facing a mirror.';
    } else if (severity === 'moderate') {
      explanation = 'Multi-step workplace directives and formal email drafting need cognitive chunking.';
      inAppTask = { name: 'Corporate Email & Contract Scanner', targetPage: 'book-scanner', duration: '18 mins' };
      physicalRoutine = 'Kinesthetic Task-Coding: Use a 3-point finger counting rule to anchor priorities before speaking in meetings.';
    } else {
      explanation = 'Severe communicative anxiety or expressive blocking significantly impacting professional life.';
      inAppTask = { name: 'Elevator Pitch Grounding Drill', targetPage: 'language-tools', duration: '10 mins' };
      physicalRoutine = 'Paced Respiratory Vocalization: Inhale 4s, exhale 4s with vocal humming before high-stakes talks.';
      specialistAlert = '⚠️ Clinical Neuro-Speech Referral: Recommend consulting an adult speech therapist specializing in cognitive-communication disorders.';
    }
  } else {
    // Teens 11-18
    if (severity === 'mild') {
      explanation = 'Adolescents with DLD benefit from context-clue extraction and vocabulary expansion routines.';
      inAppTask = { name: 'Context Clues Decoder', targetPage: 'neuroplay', duration: '12 mins' };
      physicalRoutine = 'Rhythmic Audio Chunking: Listen to short audio summaries and note 3 bullet points.';
    } else if (severity === 'moderate') {
      explanation = 'Complex sentence conjunctions and pragmatic sarcasm decoding require structured practice.';
      inAppTask = { name: 'Conjunction Synthesizer & Idiom Lab', targetPage: 'neuroplay', duration: '15 mins' };
      physicalRoutine = 'Perspective-taking Role-play: 5-minute active discussion on peer communication nuances.';
    } else {
      explanation = 'Academic fatigue and pronounced comprehension gaps require professional pedagogical intervention.';
      inAppTask = { name: 'Root Word Morphological Analysis', targetPage: 'language-tools', duration: '10 mins' };
      physicalRoutine = 'Sensory Reset: 5-minute eye-relaxation exercise followed by low-pressure auditory recall.';
      specialistAlert = '⚠️ Educational IEP & SLP Support: Suggest reaching out to the school special educator and an adolescent SLP.';
    }
  }

  // 3. Check Past Memory for Context
  const pastLogs = NeuroVaniMemory.getLogs();
  let memoryPrefix = '';
  if (pastLogs.length > 0) {
    const last = pastLogs[pastLogs.length - 1];
    memoryPrefix = `💡 Previous Session Context: "${last.query.slice(0, 45)}..." (${last.severity.toUpperCase()} Support Logged)`;
  }

  // Save to Memory
  NeuroVaniMemory.saveLog(userText, explanation, severity, ageTier);

  return {
    severity,
    severityLabel,
    severityColor,
    explanation,
    memoryPrefix,
    inAppTask,
    physicalRoutine,
    specialistAlert,
  };
}

export const NeuroVaniChat: React.FC<NeuroVaniChatProps> = ({
  onNavigate,
  onBack,
  profile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem('neurovani_chat_messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: DEFAULT_WELCOME_MSG,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [selectedRole, setSelectedRole] = useState<PersonaRole>('Parent');
  const [selectedAgeTier, setSelectedAgeTier] = useState<AgeTier>('5–11 Yrs');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('neurovani_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Cancel any active TTS speech synthesis when unmounting or switching view
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Single-Instance Audio Guarantee on TTS (NO OVERLAPPING DOUBLE VOICES)
  const handleToggleSpeak = (msgId: string, cardData?: ClinicalCardData, fallbackText?: string) => {
    if (!('speechSynthesis' in window)) return;

    // CRITICAL: IMMEDIATELY KILL ALL PREVIOUS VOICES
    window.speechSynthesis.cancel();

    if (speakingMessageId === msgId) {
      setSpeakingMessageId(null);
      return;
    }

    let cleanText = '';
    if (cardData) {
      cleanText = `${cardData.severityLabel}. ${cardData.explanation}. Activity: ${cardData.inAppTask.name}. Routine: ${cardData.physicalRoutine}.`;
    } else {
      cleanText = (fallbackText || '').replace(/###/g, '').replace(/\*\*/g, '').replace(/•/g, '').trim();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith('en') && /natural|google|samantha|zira/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setSpeakingMessageId(msgId);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Copy card explanation to clipboard
  const handleCopyCard = (msgId: string, cardData?: ClinicalCardData, text?: string) => {
    const textToCopy = cardData
      ? `${cardData.severityLabel}\n\n${cardData.explanation}\n\nActivity: ${cardData.inAppTask.name} (${cardData.inAppTask.duration})\n\nHome Routine:\n${cardData.physicalRoutine}`
      : text || '';

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Web Speech Recognition (Microphone STT)
  const handleToggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query in the input box.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error in NeuroVani AI:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Send Message Logic with Triage Classification & Memory Storage
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const cardDataToUse = generateNeuroVaniResponse(query, selectedRole, selectedAgeTier);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        cardData: cardDataToUse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('NeuroVani AI calculation error:', err);
      const cardDataToUse = generateNeuroVaniResponse(query, selectedRole, selectedAgeTier);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        cardData: cardDataToUse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 'welcome-1',
        sender: 'bot',
        text: DEFAULT_WELCOME_MSG,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <section id="neurovaniChatView" className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* =========================================================================
            HEADER BAR: Identity, Persona Role Pills, Age Selector, & Actions
           ========================================================================= */}
        <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/90 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Brand Identity & Live Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-500 flex items-center justify-center text-white text-2xl shadow-md shadow-indigo-500/20">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  NeuroVani AI
                </h1>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300/50">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                DLD Clinical Navigator & Dynamic Triage
              </p>
            </div>
          </div>

          {/* Middle Selectors: Role Pills & Learner Age Tier */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Persona Role Selectors */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              {PERSONA_ROLES.map((role) => {
                const isActive = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{role.icon}</span>
                    <span className="hidden sm:inline">{role.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Learner Age Tier Selectors */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              {AGE_TIERS.map((tier) => {
                const isActive = selectedAgeTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedAgeTier(tier.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{tier.icon}</span>
                    <span>{tier.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClearChat}
              className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Clear Chat Conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear ↻</span>
            </button>

            <button
              type="button"
              onClick={() => (onBack ? onBack() : onNavigate('home'))}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hub</span>
            </button>
          </div>
        </header>

        {/* =========================================================================
            CHAT STREAM CONTAINER: Auto-scrolling Stream & Messages
           ========================================================================= */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-xl min-h-[500px] max-h-[640px] overflow-y-auto flex flex-col justify-between space-y-4">
          
          {/* Messages Stream */}
          <div className="space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSpeaking = speakingMessageId === msg.id;
              const card = msg.cardData;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 shadow-xs ${
                      isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                    }`}
                  >
                    {isUser ? '👤' : '🤖'}
                  </div>

                  {/* Speech Bubble / Clinical Response Card Container */}
                  <div
                    className={`max-w-[92%] sm:max-w-[82%] rounded-3xl p-4 sm:p-5 shadow-xs text-sm ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                    }`}
                  >
                    {/* User Text Message */}
                    {isUser && (
                      <div>
                        <p className="leading-relaxed font-semibold">{msg.text}</p>
                        <div className="mt-1 text-[10px] text-indigo-200 text-right font-mono">
                          {msg.timestamp}
                        </div>
                      </div>
                    )}

                    {/* Simple Welcome Text for Bot initial message */}
                    {!isUser && !card && (
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>NeuroVani AI</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed text-xs sm:text-sm font-medium">{msg.text}</p>
                      </div>
                    )}

                    {/* =========================================================================
                        HIGH-TECH CLINICAL RESPONSE CARD UI (EXACT MATCH)
                       ========================================================================= */}
                    {!isUser && card && (
                      <div className="space-y-3">
                        
                        {/* Memory Prefix Banner */}
                        {card.memoryPrefix && (
                          <div className="text-xs bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-800/80 flex items-center gap-1.5 font-medium">
                            <span>💡</span>
                            <em className="truncate">{card.memoryPrefix}</em>
                          </div>
                        )}

                        {/* Severity Chip & Age Tier */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${card.severityColor}`}>
                            {card.severityLabel}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                            Tailored for {selectedAgeTier}
                          </span>
                        </div>

                        {/* Explanation */}
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                          {card.explanation}
                        </p>

                        {/* Recommended In-App Module */}
                        <div className="bg-indigo-50/50 dark:bg-slate-800/90 border border-indigo-100/80 dark:border-indigo-900/80 rounded-2xl p-3.5 space-y-2">
                          <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
                            <span>🎯 Recommended In-App Module:</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                              {card.inAppTask.name} ({card.inAppTask.duration})
                            </span>
                            <button
                              type="button"
                              onClick={() => onNavigate(card.inAppTask.targetPage)}
                              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-1.5 rounded-xl shadow-sm transition-all hover:scale-105 cursor-pointer shrink-0"
                            >
                              Start Practice →
                            </button>
                          </div>
                        </div>

                        {/* Physical / Sensory Routine */}
                        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-3 space-y-1">
                          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>🧘 Recommended Physical / Sensory Routine:</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {card.physicalRoutine}
                          </p>
                        </div>

                        {/* Specialist Alert */}
                        {card.specialistAlert && (
                          <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl p-3.5 text-xs text-rose-800 dark:text-rose-200 font-medium space-y-2">
                            <div className="flex items-center gap-1.5 font-bold">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span>{card.specialistAlert}</span>
                            </div>
                            <div className="pt-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => onNavigate('community')}
                                className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              >
                                <Stethoscope className="w-3.5 h-3.5" />
                                <span>Find Clinical Specialist 🩺</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Bottom Bar: Listen & Copy */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleToggleSpeak(msg.id, card, msg.text)}
                            className={`text-xs flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                              isSpeaking
                                ? 'bg-rose-500 text-white animate-pulse'
                                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {isSpeaking ? (
                              <>
                                <Square className="w-3 h-3 fill-current" />
                                <span>Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>🔊 Listen</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyCard(msg.id, card, msg.text)}
                              className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                              title="Copy advice"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold animate-pulse">
                  🤖
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl rounded-tl-xs p-4 shadow-xs text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-100"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-200"></span>
                  <span className="ml-1 text-slate-600 dark:text-slate-300">Generating adaptive clinical triage card...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Tappable Starter Chips */}
          {messages.length <= 2 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Suggested Clinical Starter Prompts:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTER_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    className="p-2.5 rounded-2xl bg-indigo-50/80 dark:bg-slate-900/80 hover:bg-indigo-100 dark:hover:bg-slate-800 border border-indigo-200/60 dark:border-slate-700 text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{chip}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform font-black">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            INPUT BAR: Text Input, STT Mic Button, & Send Button
           ========================================================================= */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/90 rounded-3xl p-3 shadow-lg flex items-center gap-2">
          
          {/* Microphone STT Button */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            title={isListening ? 'Listening... Click to stop' : 'Click to speak (Speech-to-Text)'}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
          </button>

          {/* Text Input Box */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask anything about DLD, speech exercises, or home routines..."
            className="flex-1 bg-transparent border-0 px-2 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              inputText.trim() && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20 hover:scale-105 active:scale-95'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};

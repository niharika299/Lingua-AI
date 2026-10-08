import React, { useState, useEffect, useRef } from 'react';
import { NavPage, ChildProfile } from '../types';
import { Mic, Sparkles, X } from 'lucide-react';

interface VoiceBotNavigatorProps {
  onNavigate?: (page: NavPage) => void;
  embedded?: boolean;
  className?: string;
  profile?: ChildProfile;
  volume?: number;
}

const QUICK_JUMP_TARGETS: { label: string; page: NavPage; icon: string }[] = [
  { label: 'NeuroVani AI', page: 'neurovani-ai', icon: '🤖' },
  { label: 'Home', page: 'home', icon: '🏠' },
  { label: 'Dashboard', page: 'dashboard', icon: '📊' },
  { label: 'Scan Book', page: 'book-scanner', icon: '📖' },
  { label: 'Progress', page: 'progress', icon: '📈' },
  { label: 'Read & Listen', page: 'read-listen', icon: '🎧' },
  { label: 'NeuroPlay', page: 'neuroplay', icon: '🎮' },
  { label: 'Support Tools', page: 'language-tools', icon: '🛠️' },
  { label: 'Community', page: 'community', icon: '👥' },
  { label: 'About', page: 'about', icon: 'ℹ️' },
];

const LANGUAGE_VOICE_MAP: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  ur: 'ur-PK',
  es: 'es-ES',
  fr: 'fr-FR',
};

// Helper to get global robot volume from localStorage if profile prop not supplied
const getStoredRobotVolume = (): number => {
  try {
    const stored = localStorage.getItem('lingua_profile');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed.robotVolume === 'number') {
        return parsed.robotVolume;
      }
    }
  } catch {}
  return 1.0;
};

// Declare SpeechRecognition for Web Speech API TypeScript support
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceBotNavigator: React.FC<VoiceBotNavigatorProps> = ({
  onNavigate,
  embedded = false,
  className = '',
  profile,
  volume: volumeProp,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [botMessage, setBotMessage] = useState<string | null>(null);
  const [showFallbackMenu, setShowFallbackMenu] = useState(false);
  const recognitionRef = useRef<any>(null);

  // High-Quality Natural Voice Selector (Anti-Crack Filter)
  const getSoftestVoice = (langCode: string): SpeechSynthesisVoice | null => {
    if (!('speechSynthesis' in window)) return null;
    const availableVoices = window.speechSynthesis.getVoices();
    if (!availableVoices.length) return null;

    const isHindi = langCode.startsWith('hi');

    if (isHindi) {
      // Specifically Hindi ki premium natural voices ko prioritise karo jo crack nahi hoti
      const hindiVoice = availableVoices.find(v => 
        v.lang.includes('hi') && 
        /natural|google|swara|kalpana|madhur|neerja|online/i.test(v.name)
      );
      if (hindiVoice) return hindiVoice;

      // Fallback standard Hindi
      const fallbackHindi = availableVoices.find(v => v.lang.includes('hi'));
      if (fallbackHindi) return fallbackHindi;
    }

    // Baki languages ke liye smooth soft voices
    const matched = availableVoices.filter(v => v.lang.toLowerCase().startsWith(langCode.slice(0, 2)));
    return matched.find(v => /natural|google|samantha|zira|swara/i.test(v.name)) || matched[0] || availableVoices[0] || null;
  };

  // Populate browser voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Multilingual Speech Synthesis function
  const speakText = (
    message: string,
    callback?: () => void,
    volume?: number,
    lang?: string
  ) => {
    setBotMessage(message);
    setIsSpeaking(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);

      let targetLang = 'en-US';
      if (lang) {
        targetLang = lang;
      } else if (profile?.appLanguage && LANGUAGE_VOICE_MAP[profile.appLanguage]) {
        targetLang = LANGUAGE_VOICE_MAP[profile.appLanguage];
      }

      const softVoice = getSoftestVoice(targetLang);
      if (softVoice) {
        utterance.voice = softVoice;
        utterance.lang = softVoice.lang;
      } else {
        utterance.lang = targetLang;
      }

      // CRITICAL TUNING: Acoustic anti-distortion levels
      utterance.rate = 0.90;    // Calm, smooth delivery
      utterance.pitch = 0.98;   // Natural throat frequency (prevents audio distortion)

      // Set speaking volume from parameter, prop, profile, or stored setting (0.85 max crystal-clear)
      const userVol = volume !== undefined
        ? volume
        : (volumeProp ?? profile?.robotVolume ?? getStoredRobotVolume());

      utterance.volume = Math.max(0, Math.min(0.85, userVol));

      utterance.onend = () => {
        setIsSpeaking(false);
        if (callback) {
          callback();
        }
        setTimeout(() => {
          setBotMessage(null);
          setTranscript('');
        }, 3500);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        if (callback) {
          callback();
        }
        setTimeout(() => {
          setBotMessage(null);
          setTranscript('');
        }, 3500);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
      if (callback) {
        callback();
      }
      setTimeout(() => {
        setBotMessage(null);
        setTranscript('');
      }, 3500);
    }
  };

  // Conversational + Navigation AI Logic (Multilingual: Hindi, Hinglish, English, Spanish, French, etc.)
  const processVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    let speechMessage = '';
    let targetPage: NavPage | null = null;
    let voiceLang = profile?.appLanguage && LANGUAGE_VOICE_MAP[profile.appLanguage] ? LANGUAGE_VOICE_MAP[profile.appLanguage] : 'en-US';

    const isHindi =
      profile?.appLanguage === 'hi' ||
      text.includes('kholo') ||
      text.includes('chalo') ||
      text.includes('khel') ||
      text.includes('namaste') ||
      text.includes('kaise') ||
      text.includes('hai') ||
      text.includes('padho') ||
      text.includes('suno') ||
      text.includes('ghar') ||
      text.includes('kitab') ||
      text.includes('karo') ||
      text.includes('jaana');

    if (isHindi) {
      voiceLang = 'hi-IN';
    }

    // A. Navigation Commands (English + Hindi/Hinglish + Spanish + French)
    if (
      text.includes('home') ||
      text.includes('ghar') ||
      text.includes('inicio') ||
      text.includes('accueil') ||
      text.includes('main')
    ) {
      speechMessage = isHindi ? "Chalo Home screen par chalte hain!" : "Let's go home!";
      targetPage = 'home';
    } else if (
      text.includes('dashboard') ||
      text.includes('panel') ||
      text.includes('tableau')
    ) {
      speechMessage = isHindi ? "Aapka learning dashboard khol rahe hain!" : "Opening your learning dashboard!";
      targetPage = 'dashboard';
    } else if (
      text.includes('scan') ||
      text.includes('book') ||
      text.includes('kitab') ||
      text.includes('pustak') ||
      text.includes('libro') ||
      text.includes('livre') ||
      text.includes('camera')
    ) {
      speechMessage = isHindi ? "Chalo aapki kitab scan karte hain!" : "Let's scan your book!";
      targetPage = 'book-scanner';
    } else if (
      text.includes('progress') ||
      text.includes('pragati') ||
      text.includes('progreso') ||
      text.includes('progrès') ||
      text.includes('score') ||
      text.includes('stats')
    ) {
      speechMessage = isHindi ? "Aapki shandar progress dekhte hain!" : "Checking your great progress!";
      targetPage = 'progress';
    } else if (
      text.includes('read') ||
      text.includes('listen') ||
      text.includes('padho') ||
      text.includes('suno') ||
      text.includes('padhna') ||
      text.includes('sunna') ||
      text.includes('leer') ||
      text.includes('escuchar') ||
      text.includes('lire') ||
      text.includes('écouter')
    ) {
      speechMessage = isHindi ? "Read and Listen mode khol rahe hain!" : "Opening Read and Listen mode!";
      targetPage = 'read-listen';
    } else if (
      text.includes('neuroplay') ||
      text.includes('game') ||
      text.includes('games') ||
      text.includes('khel') ||
      text.includes('khelo') ||
      text.includes('juego') ||
      text.includes('jeu') ||
      text.includes('play')
    ) {
      speechMessage = isHindi ? "Arre wah! Chalo NeuroPlay games khelte hain!" : "Yay! Time to play games in NeuroPlay!";
      targetPage = 'neuroplay';
    } else if (
      text.includes('tools') ||
      text.includes('support') ||
      text.includes('madad') ||
      text.includes('help') ||
      text.includes('herramientas') ||
      text.includes('outils')
    ) {
      speechMessage = isHindi ? "Aapke support tools yahan hain!" : "Here are your support tools!";
      targetPage = 'language-tools';
    } else if (
      text.includes('community') ||
      text.includes('samaj') ||
      text.includes('comunidad') ||
      text.includes('communauté')
    ) {
      speechMessage = isHindi ? "Community se jod rahe hain!" : "Connecting to the community!";
      targetPage = 'community';
    } else if (
      text.includes('about') ||
      text.includes('info') ||
      text.includes('jaankari') ||
      text.includes('lingua')
    ) {
      speechMessage = isHindi ? "Lingua AI ke baare mein sab kuch yahan hai!" : "Here is everything about Lingua AI!";
      targetPage = 'about';
    } 
    // B. Child-Friendly Small Talk (Conversational Mode)
    else if (
      text.includes('hello') ||
      text.includes('hi') ||
      text.includes('namaste') ||
      text.includes('pranam') ||
      text.includes('hola') ||
      text.includes('bonjour')
    ) {
      speechMessage = isHindi
        ? "Namaste! Main Lingua Bot hoon, aapka dost. Aaj aap kahan jana chahte hain?"
        : "Hi there! I am Lingua Bot, your friendly assistant. Where would you like to go today?";
    } else if (
      text.includes('how are you') ||
      text.includes('kaise ho') ||
      text.includes('kaise hain') ||
      text.includes('kya haal') ||
      text.includes('como estas')
    ) {
      speechMessage = isHindi
        ? "Main bilkul badiya aur energized hoon! Aapka kya haal hai?"
        : "I am feeling super energized and ready to practice words with you! How are you?";
    } else if (
      text.includes('what can you do') ||
      text.includes('kya kar sakte') ||
      text.includes('kya kar sakte ho')
    ) {
      speechMessage = isHindi
        ? "Main aapko Dashboard, Book Scanner, NeuroPlay games, ya Progress par le ja sakta hoon! Bas bataiye!"
        : "I can take you to Dashboard, Scan a Book, play games in NeuroPlay, or check your Progress! Just ask me!";
    } else {
      // Live Voice Conversation with model gemini-3.8-live or Google Search Grounding
      const isQuestion = text.includes('why') || text.includes('what') || text.includes('who') || text.includes('where') || text.includes('how') || text.includes('kyun') || text.includes('kya') || text.includes('kahan') || text.includes('kaise');
      
      const endpoint = isQuestion ? '/api/gemini/search-grounding' : '/api/gemini/live-talk';
      const body = isQuestion ? { query: rawText } : { message: rawText };

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          const aiReply = data.answer || data.reply || (isHindi
            ? `Maine suna: "${rawText}". Main aapko Dashboard, Progress, ya NeuroPlay le ja sakta hoon!`
            : `I heard: "${rawText}". I can help you visit Dashboard, Progress, or NeuroPlay!`);
          
          setBotMessage(aiReply);
          speakText(aiReply, () => {
            if (targetPage && onNavigate) {
              onNavigate(targetPage);
            }
          }, undefined, voiceLang);
        })
        .catch(() => {
          speechMessage = isHindi
            ? `Maine suna: "${rawText}". Main aapko Dashboard, Progress, ya NeuroPlay le ja sakta hoon!`
            : `I heard you say "${rawText}". I can help you visit Dashboard, Progress, or NeuroPlay!`;
          speakText(speechMessage, () => {
            if (targetPage && onNavigate) {
              onNavigate(targetPage);
            }
          }, undefined, voiceLang);
        });
      return;
    }

    speakText(speechMessage, () => {
      if (targetPage && onNavigate) {
        onNavigate(targetPage);
      }
    }, undefined, voiceLang);
  };

  // Initialize Speech Engine
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const activeLangCode = profile?.appLanguage && LANGUAGE_VOICE_MAP[profile.appLanguage]
        ? LANGUAGE_VOICE_MAP[profile.appLanguage]
        : 'en-US';

      recognition.lang = activeLangCode;

      recognition.onstart = () => {
        setIsListening(true);
        setShowFallbackMenu(false);
        const startPrompt = profile?.appLanguage === 'hi' 
          ? "Main sun raha hoon! Kuch bhi boliye... 🎙️"
          : "I'm listening! Tell me anything... 🎙️";
        setBotMessage(startPrompt);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const spokenText = event.results[0]?.[0]?.transcript || '';
        if (spokenText) {
          setTranscript(`Suna / You said: "${spokenText}"`);
          processVoiceCommand(spokenText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          speakText("Please click the lock icon 🔒 in your browser URL bar or open app in a new tab to allow microphone!");
        } else {
          setShowFallbackMenu(true);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition initialization error:', err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [profile?.appLanguage]);

  // Toggle Listening safely
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setShowFallbackMenu(true);
      return;
    }

    if (isListening || isSpeaking) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch {}
      setIsListening(false);
      setIsSpeaking(false);
      setBotMessage(null);
    } else {
      setShowFallbackMenu(false);
      setTranscript('');

      try {
        if (!recognitionRef.current) {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;

          const activeLangCode = profile?.appLanguage && LANGUAGE_VOICE_MAP[profile.appLanguage]
            ? LANGUAGE_VOICE_MAP[profile.appLanguage]
            : 'en-US';

          recognition.lang = activeLangCode;

          recognition.onstart = () => {
            setIsListening(true);
            setShowFallbackMenu(false);
            const startPrompt = profile?.appLanguage === 'hi' 
              ? "Main sun raha hoon! Kuch bhi boliye... 🎙️"
              : "I'm listening! Tell me anything... 🎙️";
            setBotMessage(startPrompt);
            setTranscript('');
          };

          recognition.onresult = (event: any) => {
            setIsListening(false);
            const spokenText = event.results[0]?.[0]?.transcript || '';
            if (spokenText) {
              setTranscript(`Suna / You said: "${spokenText}"`);
              processVoiceCommand(spokenText);
            }
          };

          recognition.onerror = (event: any) => {
            console.warn('Speech recognition error:', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
              speakText("Please click the lock icon 🔒 in your browser URL bar or open app in a new tab to allow microphone!");
            } else {
              setShowFallbackMenu(true);
            }
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
        } else {
          const activeLangCode = profile?.appLanguage && LANGUAGE_VOICE_MAP[profile.appLanguage]
            ? LANGUAGE_VOICE_MAP[profile.appLanguage]
            : 'en-US';
          recognitionRef.current.lang = activeLangCode;
        }

        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
        setIsListening(false);
        setShowFallbackMenu(true);
      }
    }
  };

  // Wrapper positioning
  const wrapperClass = embedded
    ? `fixed bottom-6 right-6 z-50 lg:relative lg:bottom-0 lg:right-0 lg:z-auto flex flex-col items-end lg:items-center select-none pointer-events-auto ${className}`
    : `fixed bottom-6 right-6 z-50 flex flex-col items-end select-none pointer-events-auto ${className}`;

  return (
    <div className={wrapperClass}>
      
      {/* Compact & Neat Quick Jump Popover Menu */}
      {showFallbackMenu && (
        <div className="mb-3 w-72 sm:w-80 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Quick Jump
            </span>
            <button
              onClick={() => setShowFallbackMenu(false)}
              aria-label="Close Quick Jump Menu"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Single Short Line at top */}
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-3 leading-tight">
            Choose a section or speak to Lingua Bot 🎙️
          </p>

          {/* Compact 2-Column Button Grid */}
          <div className="grid grid-cols-2 gap-2">
            {QUICK_JUMP_TARGETS.map((target) => (
              <button
                key={target.page}
                onClick={() => {
                  setShowFallbackMenu(false);
                  if (onNavigate) {
                    onNavigate(target.page);
                  }
                }}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/90 hover:bg-teal-50 dark:hover:bg-teal-950/60 border border-slate-200/80 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <span className="text-sm shrink-0">{target.icon}</span>
                <span className="truncate">{target.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Speech Bubble / Status Box only when STT or TTS is active */}
      {!showFallbackMenu && (botMessage || transcript || isListening) && (
        <div className="mb-2.5 max-w-xs p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-teal-500/30 dark:border-teal-500/50 shadow-xl text-slate-800 dark:text-white text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-2 duration-300 relative transition-all">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">{isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Lingua Bot'}</span>
            </div>
            <button
              onClick={() => {
                setBotMessage(null);
                setTranscript('');
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Close message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {transcript && (
            <p className="text-[11px] text-teal-600 dark:text-teal-300 font-semibold italic mb-1 pb-1 border-b border-slate-100 dark:border-slate-800">
              {transcript}
            </p>
          )}

          <p className="leading-snug text-xs sm:text-sm">
            {botMessage || (isListening ? "I'm listening! Tell me anything... 🎙️" : '')}
          </p>

          {/* Speech Bubble Tail Arrow */}
          <div className="absolute -bottom-2 right-8 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-teal-500/30 dark:border-teal-500/50 transform rotate-45" />
        </div>
      )}

      {/* Cute Animated Full-Body Robot Character Button with Floating Hover & Glowing Orb Aura */}
      <div className="relative group animate-float" style={{ animationDuration: '2.8s' }}>
        
        {/* Glowing Orb Aura Effect when Listening or Speaking */}
        {(isListening || isSpeaking) && (
          <>
            <span className="absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 animate-pulse blur-md opacity-80 pointer-events-none" />
            <span className={`absolute -inset-3 rounded-full ${isSpeaking ? 'bg-emerald-400/40 dark:bg-emerald-500/50' : 'bg-teal-400/40 dark:bg-teal-500/50'} animate-ping pointer-events-none motion-reduce:animate-none`} />
          </>
        )}

        <button
          onClick={toggleListening}
          title="Talk to Lingua Bot"
          aria-label="Voice navigation robot assistant"
          className="relative cursor-pointer hover:scale-110 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-3xl p-1"
        >
          {/* Full-Body Robot SVG Graphic */}
          <svg
            viewBox="0 0 80 92"
            className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-xl overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="botBodyGrad" x1="0" y1="0" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
              <linearGradient id="botFaceGrad" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="thrusterGrad" x1="0" y1="0" x2="0" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Hover Thrusters with gentle bounce animation */}
            <g className="animate-bounce">
              <ellipse cx="32" cy="82" rx="4" ry="8" fill="url(#thrusterGrad)" className="animate-pulse" />
              <ellipse cx="48" cy="82" rx="4" ry="8" fill="url(#thrusterGrad)" className="animate-pulse" />
              <circle cx="32" cy="78" r="2" fill="#38BDF8" />
              <circle cx="48" cy="78" r="2" fill="#38BDF8" />
            </g>

            {/* Compact Body */}
            <rect x="22" y="46" width="36" height="28" rx="12" fill="url(#botBodyGrad)" stroke="#FFFFFF" strokeWidth="2" />
            
            {/* Chest Glowing Badge */}
            <circle cx="40" cy="58" r="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <path d="M40 55.5 L41 57.5 L43 58 L41.5 59.5 L42 61.5 L40 60.5 L38 61.5 L38.5 59.5 L37 58 L39 57.5 Z" fill={isListening ? "#F43F5E" : isSpeaking ? "#10B981" : "#38BDF8"} className="animate-pulse" />

            {/* Wave-Animated Arms */}
            {/* Left Arm */}
            <g className="transition-transform origin-top-right">
              <path d="M22 52 C14 54 12 62 16 66" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="16" cy="66" r="3" fill="#38BDF8" />
            </g>
            {/* Right Arm Waving */}
            <g className={isListening || isSpeaking ? "animate-bounce origin-top-left" : "animate-pulse origin-top-left"}>
              <path d="M58 52 C66 50 70 42 66 38" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="66" cy="38" r="3.5" fill={isListening ? "#F43F5E" : isSpeaking ? "#10B981" : "#38BDF8"} />
            </g>

            {/* Antenna Stem & Blinking Light */}
            <rect x="38" y="6" width="4" height="10" rx="2" fill="#06B6D4" />
            <circle cx="40" cy="5" r="4.5" fill={isListening ? "#F43F5E" : isSpeaking ? "#10B981" : "#38BDF8"} className="animate-pulse" />
            <circle cx="40" cy="5" r="2" fill="#FFFFFF" />

            {/* Rounded Head */}
            <rect x="16" y="14" width="48" height="34" rx="16" fill="url(#botBodyGrad)" stroke="#FFFFFF" strokeWidth="2" />
            
            {/* Face Visor Screen */}
            <rect x="21" y="19" width="38" height="24" rx="12" fill="url(#botFaceGrad)" stroke="#38BDF8" strokeWidth="1" />

            {/* Smiling Eyes */}
            <g>
              {/* Left Eye */}
              <circle cx="31" cy="29" r="3.5" fill={isListening ? "#F43F5E" : isSpeaking ? "#10B981" : "#38BDF8"} className={isListening || isSpeaking ? "animate-ping" : ""} />
              <circle cx="32" cy="28" r="1.2" fill="#FFFFFF" />
              {/* Right Eye */}
              <circle cx="49" cy="29" r="3.5" fill={isListening ? "#F43F5E" : isSpeaking ? "#10B981" : "#38BDF8"} className={isListening || isSpeaking ? "animate-ping" : ""} />
              <circle cx="50" cy="28" r="1.2" fill="#FFFFFF" />
            </g>

            {/* Pink Blush Cheeks */}
            <circle cx="26" cy="35" r="2.5" fill="#FB7185" opacity="0.8" />
            <circle cx="54" cy="35" r="2.5" fill="#FB7185" opacity="0.8" />

            {/* Animated Mouth */}
            <path
              d={isSpeaking ? "M35 34 Q40 41 45 34" : "M36 34 Q40 38 44 34"}
              stroke={isSpeaking ? "#10B981" : "#38BDF8"}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              className={isSpeaking ? "animate-pulse" : ""}
            />
          </svg>

          {/* Mic Badge */}
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-300 border border-teal-500/40 flex items-center justify-center shadow-md">
            <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-rose-500 animate-pulse' : isSpeaking ? 'text-emerald-500 animate-pulse' : 'text-teal-600 dark:text-teal-300'}`} />
          </span>
        </button>

        {/* Hover Tooltip */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-slate-800/95 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg hidden sm:block">
          Talk to Lingua Bot ✨
        </div>
      </div>
    </div>
  );
};





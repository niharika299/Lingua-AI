import { SUPPORTED_LANGUAGES, getVoiceForLanguage } from './i18n';

// In-memory cache for translations to make switching between languages instantaneous
const translationCache = new Map<string, string>();

// Global reference for audio element when using neural TTS fallback
let activeAudioElement: HTMLAudioElement | null = null;

// Ensure voices are loaded in modern browsers
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export async function translateContent(
  text: string,
  targetLangCode: string
): Promise<string> {
  if (!text || !text.trim()) return '';
  if (targetLangCode === 'en') return text;

  const targetLang = SUPPORTED_LANGUAGES.find((l) => l.code === targetLangCode);
  const targetLanguageName = targetLang ? targetLang.name : targetLangCode;

  const cacheKey = `${targetLangCode}_${text.trim().slice(0, 120)}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const res = await fetch('/api/gemini/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        targetLanguage: targetLanguageName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.translatedText && data.translatedText.trim()) {
        const cleanTranslation = data.translatedText.trim();
        translationCache.set(cacheKey, cleanTranslation);
        return cleanTranslation;
      }
    }
  } catch (err) {
    console.warn('Translation API warning:', err);
  }

  return text; // Graceful return
}

export function playSpeech(
  textToSpeak: string,
  languageCode: string,
  speed: number = 1.0,
  callbacks?: {
    onBoundary?: (word: string) => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): SpeechSynthesisUtterance | null {
  stopSpeech();

  if (!textToSpeak || !textToSpeak.trim()) return null;

  const targetVoiceCode = getVoiceForLanguage(languageCode);
  const isEnglish = languageCode === 'en' || targetVoiceCode.startsWith('en');

  // Check if browser has a matching speech synthesis voice for this language
  let hasMatchingBrowserVoice = false;
  let matchingVoice: SpeechSynthesisVoice | undefined;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      matchingVoice =
        voices.find((v) => v.lang === targetVoiceCode) ||
        voices.find((v) => v.lang.replace('_', '-').toLowerCase() === targetVoiceCode.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(languageCode.toLowerCase())) ||
        voices.find((v) => v.lang.toLowerCase().includes(languageCode.toLowerCase()));

      if (matchingVoice) {
        hasMatchingBrowserVoice = true;
      }
    }
  }

  // If language is not English and the browser lacks a native voice for it,
  // use Gemini Neural TTS directly so the child actually hears the correct language!
  if (!isEnglish && !hasMatchingBrowserVoice) {
    playGeminiNeuralTts(textToSpeak, languageCode, speed, callbacks);
    return null;
  }

  // Otherwise, use browser SpeechSynthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = Math.max(0.7, Math.min(speed, 1.6));
    utterance.lang = targetVoiceCode;

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    if (callbacks?.onBoundary) {
      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          const spokenWord = textToSpeak.substring(e.charIndex).split(/\s+/)[0];
          callbacks.onBoundary!(spokenWord.replace(/[^a-zA-Z0-9\u0900-\u0D7F]/g, ''));
        }
      };
    }

    utterance.onend = () => {
      if (callbacks?.onEnd) callbacks.onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Browser SpeechSynthesis error, trying Gemini TTS fallback:', e);
      // Fallback to Gemini TTS if browser synthesis failed
      playGeminiNeuralTts(textToSpeak, languageCode, speed, callbacks);
    };

    utterance.rate = Math.max(0.5, Math.min(speed, 2.0));
    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  // Browser lacks SpeechSynthesis entirely: use Gemini TTS
  playGeminiNeuralTts(textToSpeak, languageCode, speed, callbacks);
  return null;
}

// Helper function to speak via browser SpeechSynthesis
function speakWithBrowserFallback(
  textToSpeak: string,
  languageCode: string,
  speed: number = 1.0,
  callbacks?: {
    onBoundary?: (word: string) => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = Math.max(0.6, Math.min(speed, 1.8));
    const targetVoiceCode = getVoiceForLanguage(languageCode);
    utterance.lang = targetVoiceCode;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const match =
        voices.find((v) => v.lang === targetVoiceCode) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(languageCode.toLowerCase()));
      if (match) utterance.voice = match;
    }

    if (callbacks?.onBoundary) {
      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          const spokenWord = textToSpeak.substring(e.charIndex).split(/\s+/)[0];
          callbacks.onBoundary!(spokenWord.replace(/[^a-zA-Z0-9\u0900-\u0D7F]/g, ''));
        }
      };
    }
    utterance.onend = () => {
      if (callbacks?.onEnd) callbacks.onEnd();
    };
    utterance.onerror = (e) => {
      if (callbacks?.onError) callbacks.onError(e);
    };

    window.speechSynthesis.speak(utterance);
  } else if (callbacks?.onError) {
    callbacks.onError('Speech synthesis not available');
  }
}

// Fallback neural speech player using backend Gemini TTS
async function playGeminiNeuralTts(
  text: string,
  languageCode: string,
  speed: number = 1.0,
  callbacks?: {
    onBoundary?: (word: string) => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
) {
  try {
    const res = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.slice(0, 700),
      }),
    });

    if (!res.ok) {
      speakWithBrowserFallback(text, languageCode, speed, callbacks);
      return;
    }

    const data = await res.json();
    if (data.fallbackToBrowser || !data.audioBase64) {
      speakWithBrowserFallback(text, languageCode, speed, callbacks);
      return;
    }

    const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
    audio.playbackRate = Math.max(0.7, Math.min(speed, 1.5));
    activeAudioElement = audio;

    audio.onended = () => {
      activeAudioElement = null;
      if (callbacks?.onEnd) callbacks.onEnd();
    };

    audio.onerror = () => {
      activeAudioElement = null;
      speakWithBrowserFallback(text, languageCode, speed, callbacks);
    };

    await audio.play();
  } catch (err) {
    console.warn('Gemini Neural TTS playback fallback:', err);
    speakWithBrowserFallback(text, languageCode, speed, callbacks);
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (activeAudioElement) {
    activeAudioElement.pause();
    activeAudioElement.currentTime = 0;
    activeAudioElement = null;
  }
}

export function pauseSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
  if (activeAudioElement) {
    activeAudioElement.pause();
  }
}

export function resumeSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
  if (activeAudioElement) {
    activeAudioElement.play().catch(console.warn);
  }
}

export async function explainWord(
  word: string,
  context: string = '',
  targetLangCode: string = 'en'
): Promise<{ word: string; meaning: string; syllables?: string }> {
  const clean = word.replace(/[^a-zA-Z0-9\u0900-\u0D7F]/g, '').trim();
  if (!clean) return { word, meaning: 'An important word.' };

  try {
    const res = await fetch('/api/gemini/explain-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: clean, context }),
    });

    if (res.ok) {
      const data = await res.json();
      let meaning = data.meaning || `${clean}: An important word in this text.`;
      if (targetLangCode !== 'en') {
        meaning = await translateContent(meaning, targetLangCode);
      }
      return {
        word: clean,
        meaning,
        syllables: data.syllables,
      };
    }
  } catch (err) {
    console.warn('Word explanation error:', err);
  }

  return {
    word: clean,
    meaning: `${clean}: An important word from this page.`,
  };
}

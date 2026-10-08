import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, translate, getVoiceForLanguage } from '../utils/i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  supportedLanguages: SupportedLanguage[];
  currentLanguageConfig: SupportedLanguage;
  voiceCode: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const linguaLang = localStorage.getItem('lingua_lang');
      if (linguaLang) return linguaLang;
      const selected = localStorage.getItem('selectedLanguage');
      if (selected) return selected;
      const saved = localStorage.getItem('lingua_app_language');
      if (saved) return saved;
      const profile = localStorage.getItem('lingua_profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        if (parsed?.appLanguage) return parsed.appLanguage;
      }
    } catch {}
    return 'en';
  });

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('lingua_lang', lang);
      localStorage.setItem('selectedLanguage', lang);
      localStorage.setItem('lingua_app_language', lang);
      // Also sync into stored profile so both stay aligned
      const profileStr = localStorage.getItem('lingua_profile');
      if (profileStr) {
        const parsed = JSON.parse(profileStr);
        parsed.appLanguage = lang;
        localStorage.setItem('lingua_profile', JSON.stringify(parsed));
      }
      // Set lang attribute on html tag for accessibility & screen readers
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lingua_lang', language);
      localStorage.setItem('selectedLanguage', language);
      localStorage.setItem('lingua_app_language', language);
      const profileStr = localStorage.getItem('lingua_profile');
      if (profileStr) {
        const parsed = JSON.parse(profileStr);
        if (parsed.appLanguage !== language) {
          parsed.appLanguage = language;
          localStorage.setItem('lingua_profile', JSON.stringify(parsed));
        }
      }
    } catch {}

    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    // Expose updateAppLanguage on window for global execution
    if (typeof window !== 'undefined') {
      (window as any).updateAppLanguage = (langCode: string) => {
        setLanguage(langCode);
      };
    }
  }, [language, setLanguage]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translate(key, language, params);
    },
    [language]
  );

  const currentLanguageConfig = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  const voiceCode = useMemo(() => {
    return getVoiceForLanguage(language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageConfig,
      voiceCode,
    }),
    [language, setLanguage, t, currentLanguageConfig, voiceCode]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    const fallbackLang = 'en';
    return {
      language: fallbackLang,
      setLanguage: () => {},
      t: (key: string, params?: Record<string, string | number>) =>
        translate(key, fallbackLang, params),
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageConfig: SUPPORTED_LANGUAGES[0],
      voiceCode: 'en-US',
    };
  }
  return context;
};

export const useTranslation = useLanguage;

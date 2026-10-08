import React, { useState } from 'react';
import { X, Eye, Sun, Moon, Volume2, VolumeX, BookOpen, Sliders, Type, Check, Sparkles } from 'lucide-react';
import { ChildProfile } from '../../types';
import { SUPPORTED_LANGUAGES, useTranslation } from '../../utils/i18n';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ChildProfile;
  onUpdateProfile: (updated: Partial<ChildProfile>) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const { t, setLanguage } = useTranslation();
  const [activeTab, setActiveTab] = useState<'DISPLAY' | 'READING' | 'AUDIO'>('READING');

  if (!isOpen) return null;

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    onUpdateProfile({ appLanguage: code });
  };

  const lineSpacingMap: Record<string, string> = {
    normal: '1.5',
    relaxed: '1.8',
    loose: '2.2',
  };

  const currentLineHeight = lineSpacingMap[profile.lineSpacing || 'normal'] || '1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-xl rounded-2xl app-bg-surface p-6 shadow-2xl border app-border animate-in fade-in zoom-in-95 duration-150 app-text-primary flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-settings-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b app-border pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1ECF8] dark:bg-[#3B2256] text-[#7C4DBA] dark:text-[#D8B4FE]">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 id="accessibility-settings-title" className="text-lg font-bold app-text-primary">
                {t('accessibility.modalTitle') || 'Accessibility & Reading Preferences'}
              </h2>
              <p className="text-xs app-text-muted">
                {t('accessibility.modalSubtitle') || 'Customize text sizing, themes, reading preferences, line spacing, and speech audio.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 app-text-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 app-bg-surface-secondary rounded-xl border app-border mt-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('READING')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'READING'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'app-text-secondary hover:text-black dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reading Preferences</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DISPLAY')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'DISPLAY'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'app-text-secondary hover:text-black dark:hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Display & Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AUDIO')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'AUDIO'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'app-text-secondary hover:text-black dark:hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio & Speech</span>
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="mt-5 space-y-5 overflow-y-auto pr-1 flex-1">

          {/* ========================================================================= */}
          {/* TAB 1: READING PREFERENCES (NEW CORE FEATURE) */}
          {/* ========================================================================= */}
          {activeTab === 'READING' && (
            <div className="space-y-5 animate-fade-in">
              {/* 1. High-Contrast Text Toggle */}
              <div className="p-4 rounded-xl border app-border app-bg-surface-secondary space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold uppercase tracking-wider app-text-primary block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#7C4DBA]" />
                      <span>High-Contrast Text</span>
                    </label>
                    <p className="text-[11px] app-text-muted leading-relaxed">
                      Darkens text elements and boosts contrast globally for maximum legibility and visual processing ease.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onUpdateProfile({ highContrastText: !profile.highContrastText })}
                    className={`w-12 h-6 rounded-full transition p-1 cursor-pointer shrink-0 ${
                      profile.highContrastText ? 'bg-[#7C4DBA]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    aria-label="Toggle High-Contrast Text"
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        profile.highContrastText ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 2. Global Line Spacing */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider app-text-secondary block mb-2 flex items-center justify-between">
                  <span>Line Spacing (Line Height)</span>
                  <span className="font-mono text-xs text-[#7C4DBA] font-bold">
                    {currentLineHeight}x
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'normal', label: 'Normal', height: '1.5x', desc: 'Standard line height' },
                    { key: 'relaxed', label: 'Relaxed', height: '1.8x', desc: 'Extra breathing room' },
                    { key: 'loose', label: 'Loose', height: '2.2x', desc: 'Max spacing for Dyslexia' },
                  ].map((spacing) => {
                    const isSelected = (profile.lineSpacing || 'normal') === spacing.key;

                    return (
                      <button
                        key={spacing.key}
                        type="button"
                        onClick={() => onUpdateProfile({ lineSpacing: spacing.key as any })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#7C4DBA] bg-[#F9F5FD] dark:bg-[#281B3C] font-bold app-text-primary ring-2 ring-[#7C4DBA]'
                            : 'app-border app-bg-surface app-text-secondary hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold app-text-primary">{spacing.label}</span>
                          <span className="text-[10px] font-mono text-[#7C4DBA] font-bold">{spacing.height}</span>
                        </div>
                        <div className="text-[10px] app-text-muted mt-1 leading-tight">{spacing.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Dyslexic Font Toggle */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider app-text-secondary block mb-2">
                  {t('accessibility.fontStyleTitle')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateProfile({ useDyslexicFont: false })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      !profile.useDyslexicFont
                        ? 'border-[#7C4DBA] bg-[#F9F5FD] dark:bg-[#281B3C] font-bold app-text-primary ring-2 ring-[#7C4DBA]'
                        : 'app-border app-bg-surface app-text-secondary'
                    }`}
                  >
                    <div className="text-xs font-sans font-bold">{t('accessibility.fontModern')}</div>
                    <div className="text-[10px] app-text-muted">{t('accessibility.fontModernSub')}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateProfile({ useDyslexicFont: true })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      profile.useDyslexicFont
                        ? 'border-[#7C4DBA] bg-[#F9F5FD] dark:bg-[#281B3C] font-bold app-text-primary ring-2 ring-[#7C4DBA]'
                        : 'app-border app-bg-surface app-text-secondary'
                    }`}
                  >
                    <div className="text-xs font-opendyslexic font-bold">{t('accessibility.fontDyslexic')}</div>
                    <div className="text-[10px] app-text-muted">{t('accessibility.fontDyslexicSub')}</div>
                  </button>
                </div>
              </div>

              {/* 4. Live Interactive Reading Preview Box */}
              <div className="p-4 rounded-xl border border-[#7C4DBA]/30 bg-[#F9F5FD] dark:bg-[#241734] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#7C4DBA]">
                  <span>Live Reading Preview</span>
                  <span className="font-mono text-[10px]">
                    Size: {profile.fontSize} · Contrast: {profile.highContrastText ? 'High' : 'Normal'}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-lg bg-white dark:bg-slate-900 border app-border text-xs app-text-primary ${
                    profile.useDyslexicFont ? 'font-opendyslexic' : 'font-sans'
                  } ${profile.highContrastText ? 'global-high-contrast' : ''}`}
                  style={{ lineHeight: currentLineHeight }}
                >
                  "Lingua AI provides personalized tools for reading, listening, vocabulary, comprehension, and communication practice. This live preview reflects your selected font size, dyslexic font, high-contrast text, and line spacing."
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DISPLAY & THEME */}
          {/* ========================================================================= */}
          {activeTab === 'DISPLAY' && (
            <div className="space-y-5 animate-fade-in">
              {/* 1. Global Text Size */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider app-text-secondary block mb-2 flex items-center justify-between">
                  <span>{t('accessibility.textSizeGlobal')}</span>
                  <span className="font-mono text-xs text-[#0D9488] font-bold capitalize">{profile.fontSize.replace('-', ' ')}</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 app-bg-surface-secondary rounded-xl border app-border">
                  {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onUpdateProfile({ fontSize: size })}
                      className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                        profile.fontSize === size
                          ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs font-bold'
                          : 'app-text-secondary hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {size === 'extra-large' ? 'XL' : size === 'small' ? t('settings.sizeSmall') : size === 'medium' ? t('settings.sizeMedium') : t('settings.sizeLarge')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Theme & Dark Mode */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider app-text-secondary block mb-2">
                  {t('accessibility.themeTitle')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateProfile({ theme: 'default' })}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      profile.theme === 'default'
                        ? 'border-[#7C4DBA] bg-[#F9F5FD] dark:bg-[#281B3C] ring-2 ring-[#7C4DBA]'
                        : 'app-border app-bg-surface'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-slate-300 bg-[#FAF8F5] flex items-center justify-center text-slate-700">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold app-text-primary">{t('settings.themeDefault')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateProfile({ theme: 'contrast' })}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      profile.theme === 'contrast'
                        ? 'border-[#C084FC] bg-[#1E112E] ring-2 ring-[#C084FC]'
                        : 'app-border app-bg-surface'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-slate-600 bg-[#0F0817] flex items-center justify-center text-[#F8F5FF]">
                      <Moon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold app-text-primary">{t('settings.themeDark')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateProfile({ theme: 'cream' })}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      profile.theme === 'cream'
                        ? 'border-[#7C4DBA] bg-[#FBF7EE] ring-2 ring-[#7C4DBA]'
                        : 'app-border app-bg-surface'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-amber-300 bg-[#FAF6ED]" />
                    <span className="text-xs font-semibold app-text-primary">{t('settings.themeCream')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateProfile({ theme: 'lavender' })}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      profile.theme === 'lavender'
                        ? 'border-[#7C4DBA] bg-[#F5EFFF] ring-2 ring-[#7C4DBA]'
                        : 'app-border app-bg-surface'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-purple-300 bg-[#EFE4FF]" />
                    <span className="text-xs font-semibold app-text-primary">{t('settings.themeLavender')}</span>
                  </button>
                </div>
              </div>

              {/* 3. Language Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider app-text-secondary block mb-2">
                  {t('accessibility.languageTitle')}
                </label>
                <select
                  value={profile.appLanguage || 'en'}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full rounded-xl border app-border p-2.5 text-xs app-bg-surface app-text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C4DBA] cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((sl) => (
                    <option key={sl.code} value={sl.code} className="app-bg-surface app-text-primary">
                      {sl.nativeName} ({sl.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: AUDIO & SPEECH */}
          {/* ========================================================================= */}
          {activeTab === 'AUDIO' && (
            <div className="space-y-5 animate-fade-in">
              {/* 1. Audio Narration Speed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider app-text-secondary">
                    {t('accessibility.speechSpeedTitle')}
                  </label>
                  <span className="text-xs font-mono font-bold text-[#7C4DBA]">
                    {profile.speechRate}x
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 p-1 app-bg-surface-secondary rounded-xl border app-border">
                  {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => onUpdateProfile({ speechRate: rate })}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        profile.speechRate === rate
                          ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs font-bold'
                          : 'app-text-secondary hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Robot Assistant Volume */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider app-text-secondary flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>Robot Speaking Volume</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-[#0D9488]">
                    {Math.round((profile.robotVolume ?? 1.0) * 100)}%
                  </span>
                </div>
                <div className="space-y-2 p-3 app-bg-surface-secondary rounded-xl border app-border">
                  <div className="flex items-center gap-3">
                    <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={profile.robotVolume ?? 1.0}
                      onChange={(e) => onUpdateProfile({ robotVolume: parseFloat(e.target.value) })}
                      className="w-full accent-[#0D9488] cursor-pointer"
                      aria-label="Robot Speaking Volume"
                    />
                    <Volume2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { label: 'Mute', vol: 0 },
                      { label: 'Soft', vol: 0.5 },
                      { label: 'Medium', vol: 0.8 },
                      { label: 'Full', vol: 1.0 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => onUpdateProfile({ robotVolume: preset.vol })}
                        className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          (profile.robotVolume ?? 1.0) === preset.vol
                            ? 'bg-[#0D9488] text-white shadow-xs font-bold'
                            : 'app-text-secondary hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t app-border flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] hover:opacity-90 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            {t('accessibility.applyAndClose') || 'Apply & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Eye,
  Volume2,
  Globe,
  Save,
  Check,
  Shield,
} from 'lucide-react';
import { ChildProfile, NavPage } from '../../types';
import { SUPPORTED_LANGUAGES, useTranslation } from '../../utils/i18n';
import { BackNavigationButton } from '../common/BackNavigationButton';

interface SettingsProps {
  profile: ChildProfile;
  onUpdateProfile: (updated: Partial<ChildProfile>) => void;
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
  onBack,
}) => {
  const { t, setLanguage, language } = useTranslation();
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [readingLevel, setReadingLevel] = useState(profile.readingLevel);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      age: Number(age),
      readingLevel,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    onUpdateProfile({ appLanguage: newLang });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Navigation Button */}
      <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="dashboard" label="Back to Dashboard" />

      {/* Header */}
      <div className="border-b app-border pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C4DBA]">
          <SettingsIcon className="w-4 h-4" />
          <span>{t('settings.badge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary mt-1">
          {t('settings.title')}
        </h1>
        <p className="text-xs app-text-secondary mt-0.5">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* 1. Learner Profile */}
      <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b app-border">
          <User className="w-5 h-5 text-[#7C4DBA]" />
          <h2 className="text-sm font-extrabold app-text-primary">{t('settings.profileTitle')}</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold app-text-secondary block mb-1">
                {t('settings.childName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border app-border p-2.5 text-xs app-bg-surface app-text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold app-text-secondary block mb-1">
                {t('settings.childAge')}
              </label>
              <input
                type="number"
                min="4"
                max="16"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border app-border p-2.5 text-xs app-bg-surface app-text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold app-text-secondary block mb-1">
                {t('settings.readingStage')}
              </label>
              <select
                value={readingLevel}
                onChange={(e: any) => setReadingLevel(e.target.value)}
                className="w-full rounded-xl border app-border p-2.5 text-xs app-bg-surface app-text-primary"
              >
                <option value="Early Reader">{t('settings.stageEarly')}</option>
                <option value="Developing">{t('settings.stageDeveloping')}</option>
                <option value="Fluent Explorer">{t('settings.stageFluent')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:opacity-95 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? t('settings.profileSaved') : t('settings.btnSaveProfile')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Global Text Size & Display */}
      <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b app-border">
          <Eye className="w-5 h-5 text-[#0D9488]" />
          <h2 className="text-sm font-extrabold app-text-primary">{t('settings.displayTitle')}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold app-text-secondary block mb-2">
              {t('settings.textSizeLabel')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: 'small', labelKey: 'settings.sizeSmall' },
                  { id: 'medium', labelKey: 'settings.sizeMedium' },
                  { id: 'large', labelKey: 'settings.sizeLarge' },
                  { id: 'extra-large', labelKey: 'settings.sizeExtraLarge' },
                ] as const
              ).map(({ id, labelKey }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onUpdateProfile({ fontSize: id })}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    profile.fontSize === id
                      ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                      : 'app-border app-bg-surface app-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t(labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold app-text-secondary block mb-2">
              {t('settings.themeLabel')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'default', labelKey: 'settings.themeSoftLight' },
                  { id: 'contrast', labelKey: 'settings.themeDarkMode' },
                  { id: 'cream', labelKey: 'settings.themeCream' },
                  { id: 'lavender', labelKey: 'settings.themeLavender' },
                ] as const
              ).map(({ id, labelKey }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onUpdateProfile({ theme: id })}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    profile.theme === id
                      ? 'border-[#7C4DBA] bg-[#F1ECF8] dark:bg-[#3B2256] text-[#4A154B] dark:text-white ring-2 ring-[#7C4DBA]'
                      : 'app-border app-bg-surface app-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t(labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold app-text-secondary block mb-1">
              {t('settings.appLanguageLabel')}
            </label>
            <p className="text-[11px] app-text-muted mb-2">
              {t('settings.appLanguageHelp')}
            </p>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7C4DBA]" />
              <select
                value={language || profile.appLanguage || 'en'}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full sm:w-64 rounded-xl border app-border p-2.5 text-xs app-bg-surface app-text-primary font-bold cursor-pointer shadow-2xs"
              >
                {SUPPORTED_LANGUAGES.map((sl) => (
                  <option key={sl.code} value={sl.code}>
                    {sl.nativeName} ({sl.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Privacy Notice */}
      <div className="p-5 rounded-2xl bg-[#F0FDFA] dark:bg-[#134E4A]/30 border border-[#0D9488] text-xs text-[#0F766E] dark:text-[#5EEAD4] space-y-1">
        <div className="font-extrabold flex items-center gap-1.5">
          <Shield className="w-4 h-4" />
          <span>{t('settings.privacyTitle')}</span>
        </div>
        <p className="leading-relaxed">
          {t('settings.privacyDesc')}
        </p>
      </div>
    </div>
  );
};

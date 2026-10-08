import React from 'react';
import { NavPage, ChildProfile } from '../../types';
import { ArrowLeft, HeartHandshake, Home, ShieldCheck, Sparkles, CheckCircle2, Calendar, Activity, BookOpen } from 'lucide-react';
import { DailyAdaptiveMissions } from '../common/DailyAdaptiveMissions';
import { useTranslation } from '../../utils/i18n';

interface ParentModeProps {
  onNavigate: (page: NavPage) => void;
  onBack: () => void;
  profile: ChildProfile;
}

export const ParentMode: React.FC<ParentModeProps> = ({ onNavigate, onBack, profile }) => {
  const { t } = useTranslation();

  return (
    <div id="parentModeView" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back') || 'Back'}</span>
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {t('parentMode.title') || 'Parent Mode Hub 🏠'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {t('nav.parentMode') || 'Parent Mode'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t('parentMode.sub') || 'Home Support & Daily Insights'} for {profile.name || 'Learner'}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('progress')}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2 self-start sm:self-center shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Full Progress Hub →</span>
        </button>
      </div>

      {/* Welcome Placeholder & Overview Card */}
      <div className="bg-gradient-to-br from-rose-500/5 via-purple-500/5 to-indigo-500/5 backdrop-blur-xl border border-rose-200/60 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Welcome to Parent Mode
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Welcome to Parent Mode. Specialized home exercises and caregiver controls are being configured for {profile.name || 'Khushi'}. This dedicated view focuses on low-stress home speech routines, family practice logs, and non-diagnostic developmental milestones.
            </p>
          </div>
        </div>

        {/* Home Support Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
              <Calendar className="w-4 h-4" />
              <span>Daily Home Routine</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
              10-minute micro-practice sessions integrated into daily story reading and mealtime conversations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-xs">
              <Activity className="w-4 h-4" />
              <span>Fluency & Confidence</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
              Positive recasting techniques that encourage speech expression without direct correction.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Caregiver Guidance</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
              Clinical support guides and actionable suggestions reviewed by speech professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Parent-Controlled Daily Adaptive Missions */}
      <DailyAdaptiveMissions onNavigate={onNavigate} profile={profile} />
    </div>
  );
};

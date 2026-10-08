import React from 'react';
import { NavPage, ChildProfile } from '../../types';
import { ArrowLeft, GraduationCap, School, Users, FileText, CheckCircle2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface TeacherModeProps {
  onNavigate: (page: NavPage) => void;
  onBack: () => void;
  profile: ChildProfile;
}

export const TeacherMode: React.FC<TeacherModeProps> = ({ onNavigate, onBack, profile }) => {
  const { t } = useTranslation();

  return (
    <div id="teacherModeView" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
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
                {t('teacherMode.title') || 'Teacher & Educator Portal 🎓'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {t('nav.teacherMode') || 'Teacher Mode'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t('teacherMode.sub') || 'IEP milestone tracking, multi-student speech analytics, and classroom tools.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2 self-start sm:self-center shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Main Dashboard →</span>
        </button>
      </div>

      {/* Welcome Placeholder & Overview Card */}
      <div className="bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-cyan-500/5 backdrop-blur-xl border border-blue-200/60 dark:border-blue-900/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Welcome to Teacher Mode
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Welcome to Teacher Mode. Classroom roster and developmental scaffolding logs are being configured. This portal enables educators and speech-language pathologists (SLPs) to align speech practice with Individualized Education Programs (IEPs) and classroom accommodations.
            </p>
          </div>
        </div>

        {/* Educator Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
              <FileText className="w-4 h-4" />
              <span>IEP Milestone Goals</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
              Track phoneme accuracy, sentence complexity, and reading stamina against quarterly IEP goals.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-extrabold text-xs">
              <Users className="w-4 h-4" />
              <span>Multi-Student Roster</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
              Organize student learning groups, assign tailored reading modules, and share SLP progress notes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
              <School className="w-4 h-4" />
              <span>Classroom Accommodations</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
              Export dyslexia visual scaffolding settings, dyslexic font overlays, and audio speed presets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

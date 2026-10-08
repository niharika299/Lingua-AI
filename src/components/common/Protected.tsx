import React, { useEffect } from 'react';
import { Lock, Sparkles, LogIn, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedProps {
  children: React.ReactNode;
  toolName?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export const Protected: React.FC<ProtectedProps> = ({
  children,
  toolName = 'This AI Tool',
  fallbackTitle,
  fallbackDescription,
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal(toolName);
    }
  }, [isAuthenticated, toolName, openAuthModal]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24 text-center animate-in fade-in duration-300">
      <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glowing Background Radial */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon Centerpiece */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 shadow-xl">
          <Lock className="w-10 h-10 text-indigo-400 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900" />
        </div>

        {/* Content */}
        <div className="space-y-3 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Member Authentication Required</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {fallbackTitle || `${toolName} is Locked`}
          </h2>

          <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed font-medium">
            {fallbackDescription ||
              `Please log in or create a free member account to access ${toolName}, save your speech progress, and unlock personalized AI tools.`}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openAuthModal(toolName)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-indigo-400/30"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Unlock {toolName}</span>
          </button>
        </div>

        {/* Footnote */}
        <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Lingua AI protects learner privacy and does not sell personal data.</span>
        </div>
      </div>
    </div>
  );
};

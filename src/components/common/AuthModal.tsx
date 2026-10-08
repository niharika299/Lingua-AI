import React, { useState } from 'react';
import { X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../utils/i18n';

export const AuthModal: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthModalOpen, closeAuthModal, login, loginWithGoogle, authModalTargetTool } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      login(email.trim(), fullName.trim());
    } else {
      let savedName = '';
      try {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.email === email.trim() && parsed.name) {
            savedName = parsed.name;
          }
        }
      } catch {}

      if (!savedName) {
        const emailName = email.split('@')[0];
        savedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      }

      login(email.trim(), savedName);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setErrorMsg('Google Sign-In cancelled or failed');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeAuthModal();
    }
  };

  return (
    <div
      id="authModal"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-amber-100/90 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Form (Inspired by Image 2) */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-amber-50/90 dark:bg-slate-900">
          <div>
            {/* Heading & Subtext */}
            <div className="mb-5">
              <h2
                data-i18n={isSignUp ? 'auth.registerTitle' : 'auth.loginTitle'}
                className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight"
              >
                {isSignUp ? t('auth.registerTitle') : t('auth.loginTitle')}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                {authModalTargetTool ? (
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    Sign in required to access {authModalTargetTool}.
                  </span>
                ) : isSignUp ? (
                  <span data-i18n="auth.registerSubtitle">{t('auth.registerSubtitle')}</span>
                ) : (
                  <span data-i18n="auth.loginSubtitle">{t('auth.loginSubtitle')}</span>
                )}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name Input (Only in Register Mode) */}
              {isSignUp && (
                <div className="space-y-1 animate-in fade-in duration-150">
                  <input
                    type="text"
                    id="regName"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder={t('auth.fullNameLabel')}
                    data-i18n="auth.fullNameLabel"
                    data-i18n-attr="placeholder"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={t('auth.emailLabel')}
                  data-i18n="auth.emailLabel"
                  data-i18n-attr="placeholder"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={t('auth.passwordLabel')}
                  data-i18n="auth.passwordLabel"
                  data-i18n-attr="placeholder"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                data-i18n={isSignUp ? 'auth.btnRegister' : 'auth.btnLogin'}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {isSignUp ? t('auth.btnRegister') : t('auth.btnLogin')}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold">
                <span data-i18n="auth.or" className="bg-amber-50 dark:bg-slate-900 px-3 text-slate-400">
                  {t('auth.or')}
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {/* Official Google G Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span data-i18n="auth.googleLogin">{t('auth.googleLogin')}</span>
            </button>
          </div>

          {/* Bottom Switch Link */}
          <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            {isSignUp ? (
              <span>
                <span data-i18n="auth.haveAccount">{t('auth.haveAccount')}</span>{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  data-i18n="auth.loginLink"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {t('auth.loginLink')}
                </button>
              </span>
            ) : (
              <span>
                <span data-i18n="auth.noAccount">{t('auth.noAccount')}</span>{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  data-i18n="auth.registerLink"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {t('auth.registerLink')}
                </button>
              </span>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Bright Sky-Blue Visual Panel (Reference Image 2 Style) */}
        <div className="hidden md:flex bg-[#38BDF8] rounded-2xl p-6 text-white relative overflow-hidden flex-col justify-between m-3 shadow-inner">
          {/* Animated Floating Speech Bubbles & Fruit/Geometric Icons */}
          <div className="space-y-4 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Lingua AI Speech Hub</span>
            </div>

            {/* Floating Speech Bubbles */}
            <div className="space-y-3 pt-2">
              <div className="bg-white/90 text-slate-800 p-3 rounded-2xl rounded-tl-xs shadow-md text-xs font-extrabold flex items-center gap-2 animate-bounce duration-1000">
                <span className="text-base">💬</span>
                <span>"Welcome to Lingua AI!"</span>
              </div>

              <div className="bg-white/80 text-slate-800 p-2.5 rounded-2xl rounded-tr-xs shadow-md text-[11px] font-bold flex items-center gap-2 ml-4">
                <span className="text-base">📚</span>
                <span>Multi-Sensory Speech Scaffolds</span>
              </div>

              <div className="bg-white/75 text-slate-800 p-2.5 rounded-2xl rounded-bl-xs shadow-md text-[11px] font-bold flex items-center gap-2">
                <span className="text-base">⭐</span>
                <span>Dyslexia & Phonics Support</span>
              </div>
            </div>
          </div>

          {/* Floating Fruit / Geometric Icons Grid */}
          <div className="z-10 pt-6">
            <div className="flex items-center justify-around bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30">
              <span className="text-2xl hover:scale-125 transition-transform">🍎</span>
              <span className="text-2xl hover:scale-125 transition-transform">🚀</span>
              <span className="text-2xl hover:scale-125 transition-transform">🧠</span>
              <span className="text-2xl hover:scale-125 transition-transform">🎧</span>
            </div>
            <p className="text-[10px] text-center text-sky-100 font-semibold mt-2">
              Instant access across all devices
            </p>
          </div>

          {/* Subtle Background Decorative Circles */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-200/20 rounded-full blur-xl pointer-events-none" />
        </div>

      </div>
    </div>
  );
};

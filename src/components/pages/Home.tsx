import React, { useEffect, useRef } from 'react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  ScanText,
  Wand2,
  Volume2,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Camera,
  Heart,
  Users,
  Award,
  BookMarked,
  Layers,
  Globe,
} from 'lucide-react';
import { NavPage, ChildProfile } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface HomeProps {
  onNavigate: (page: NavPage) => void;
  profile?: ChildProfile;
}

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
}

const TextShimmer: React.FC<TextShimmerProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-block bg-gradient-to-r from-slate-700 via-slate-400 to-slate-700 dark:from-slate-300 dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent animate-text-shimmer ${className}`}
    >
      {children}
    </span>
  );
};

export const Home: React.FC<HomeProps> = ({ onNavigate, profile }) => {
  const { t } = useTranslation();
  const childName = profile?.name || 'Leo';

  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const compassNeedleRef = useRef<SVGGElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  // Scroll Progress Tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // RequestAnimationFrame Compass Rotation Loop
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let frameId: number;
    let angle = 0;

    const rotateCompass = () => {
      angle = (angle + 0.35) % 360;
      if (compassNeedleRef.current) {
        compassNeedleRef.current.style.transform = `rotate(${angle}deg)`;
      }
      frameId = requestAnimationFrame(rotateCompass);
    };

    rotateCompass();

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    // Check if prefers-reduced-motion is active
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX1 = targetX;
    let currentY1 = targetY;
    let currentX2 = targetX;
    let currentY2 = targetY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Subtle smooth lerp tracking with slight delay
      currentX1 += (targetX - currentX1) * 0.04;
      currentY1 += (targetY - currentY1) * 0.04;

      currentX2 += (targetX - currentX2) * 0.02;
      currentY2 += (targetY - currentY2) * 0.02;

      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translate3d(${currentX1 - 320}px, ${currentY1 - 320}px, 0)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translate3d(${currentX2 - 280}px, ${currentY2 - 280}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-gradient-to-b from-sky-50 via-teal-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200 space-y-16 pb-16 relative">
      {/* 0. Top Page Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 z-50 transition-all duration-100 ease-out pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Interactive Mouse-Follow Glow Background Effect Layer */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden -z-20 transition-colors duration-200"
      >
        {/* Blob 1: Teal / Cyan Glow */}
        <div
          ref={blob1Ref}
          className="absolute top-0 left-0 w-[40rem] h-[40rem] rounded-full bg-teal-300/20 dark:bg-teal-900/30 blur-3xl transition-transform duration-300 ease-out motion-reduce:transform-none motion-reduce:animate-none opacity-80"
          style={{ transform: 'translate3d(20vw, 15vh, 0)' }}
        />
        {/* Blob 2: Violet / Purple Glow */}
        <div
          ref={blob2Ref}
          className="absolute top-0 left-0 w-[36rem] h-[36rem] rounded-full bg-violet-300/20 dark:bg-purple-900/30 blur-3xl transition-transform duration-500 ease-out motion-reduce:transform-none motion-reduce:animate-none opacity-75"
          style={{ transform: 'translate3d(50vw, 30vh, 0)' }}
        />
      </div>
      {/* Embedded CSS for smooth subtle floating animations with prefers-reduced-motion guard */}
      <style>{`
        @keyframes floatUpAndDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes textShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .animate-float {
            animation: floatUpAndDown 3s ease-in-out infinite;
          }
          .animate-text-shimmer {
            background-size: 200% 100%;
            animation: textShimmer 8s linear infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float {
            animation: none !important;
            transform: none !important;
          }
          .animate-text-shimmer {
            animation: none !important;
            background: none !important;
            color: inherit !important;
          }
        }
      `}</style>

      {/* 1. Hero Section - Matching Reference Design */}
      <section className="relative overflow-hidden pt-6 pb-12 md:pt-10 md:pb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
        
        {/* Soft subtle atmospheric background clouds */}
        <div
          aria-hidden="true"
          className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-tr from-cyan-100/50 via-slate-50 to-purple-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/30 blur-3xl -z-20 rounded-full pointer-events-none opacity-80"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          
          {/* LEFT SIDE ILLUSTRATION: Mother & Child Reading + Floating Speech Bubbles & Books */}
          <div className="hidden lg:flex flex-col gap-3 absolute left-0 xl:left-1 top-2 w-72 text-left pointer-events-none select-none z-10 animate-in fade-in slide-in-from-left-6 duration-1000 motion-reduce:animate-none">
            <div className="relative w-full h-80 flex items-center justify-center">
              
              {/* Detailed Mother & Child SVG Illustration */}
              <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-md overflow-visible" fill="none">
                <defs>
                  <linearGradient id="cloudBg" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="motherShirt" x1="0" y1="0" x2="0" y2="100">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                  <linearGradient id="childShirt" x1="0" y1="0" x2="0" y2="100">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                  <linearGradient id="openBook" x1="0" y1="0" x2="100" y2="0">
                    <stop offset="0%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>

                {/* Background Soft Cloud/Blob */}
                <path d="M 30 120 C 20 60, 90 20, 150 40 C 210 60, 220 130, 180 180 C 140 220, 50 200, 30 120 Z" fill="url(#cloudBg)" />

                {/* Stack of Books at bottom */}
                <rect x="25" y="185" width="80" height="12" rx="4" fill="#3B82F6" />
                <rect x="20" y="197" width="90" height="14" rx="4" fill="#EF4444" />

                {/* Mother Character */}
                <path d="M 65 65 C 55 45, 95 30, 105 55 C 105 75, 75 80, 65 65 Z" fill="#1E1B4B" /> {/* Dark Hair */}
                <circle cx="85" cy="62" r="14" fill="#FDE68A" /> {/* Face */}
                <path d="M 50 120 C 50 85, 110 85, 110 120 Z" fill="url(#motherShirt)" /> {/* Purple Top */}

                {/* Child Character */}
                <path d="M 120 90 C 110 75, 145 65, 150 85 Z" fill="#1E1B4B" /> {/* Hair */}
                <circle cx="132" cy="85" r="12" fill="#FDE68A" /> {/* Face */}
                <path d="M 105 135 C 105 102, 155 102, 155 135 Z" fill="url(#childShirt)" /> {/* Yellow Shirt */}

                {/* Open Book Held Together */}
                <path d="M 80 115 Q 115 105 150 115 V 140 Q 115 130 80 140 Z" fill="url(#openBook)" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="115" y1="110" x2="115" y2="135" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 2" />

                {/* Floating Elements Around */}
                {/* Yellow Lightbulb Idea */}
                <g className="animate-float" style={{ animationDuration: '3s' }}>
                  <circle cx="35" cy="50" r="12" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
                  <text x="35" y="54" textAnchor="middle" fontSize="11">💡</text>
                </g>

                {/* Blue Speech Bubble (...) */}
                <g className="animate-float" style={{ animationDuration: '3.5s', animationDelay: '0.4s' }}>
                  <rect x="165" y="45" width="48" height="28" rx="14" fill="#3B82F6" />
                  <circle cx="181" cy="59" r="2.5" fill="#FFFFFF" />
                  <circle cx="189" cy="59" r="2.5" fill="#FFFFFF" />
                  <circle cx="197" cy="59" r="2.5" fill="#FFFFFF" />
                </g>

                {/* Purple Soundwave Bubble ))) */}
                <g className="animate-float" style={{ animationDuration: '2.8s', animationDelay: '0.8s' }}>
                  <rect x="180" y="95" width="42" height="28" rx="14" fill="#8B5CF6" />
                  <path d="M 194 103 A 6 6 0 0 1 194 115 M 199 100 A 10 10 0 0 1 199 118" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Green Leaf */}
                <g className="animate-float" style={{ animationDuration: '4s' }}>
                  <path d="M 45 150 Q 60 135 65 155 Q 50 170 45 150 Z" fill="#10B981" />
                </g>
              </svg>

            </div>
          </div>

          {/* RIGHT SIDE ILLUSTRATION: Waving White Robot + 4 Floating Action Cards */}
          <div className="hidden lg:flex flex-col gap-3 absolute right-0 xl:right-1 top-0 w-80 text-left pointer-events-none select-none z-10 animate-in fade-in slide-in-from-right-6 duration-1000 motion-reduce:animate-none">
            <div className="relative w-full h-88 flex items-center justify-center">
              
              {/* 4 Floating Action Cards positioned around robot */}
              {/* Card 1: Read (Top Left - Purple) */}
              <div className="absolute top-2 left-2 animate-float p-3 rounded-2xl bg-purple-100/90 dark:bg-purple-950/90 border border-purple-200 dark:border-purple-800 shadow-md flex items-center gap-2.5 w-32" style={{ animationDuration: '3s' }}>
                <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Read</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Books & Stories</div>
                </div>
              </div>

              {/* Card 2: Listen (Top Right - Yellow) */}
              <div className="absolute top-6 right-2 animate-float p-3 rounded-2xl bg-amber-100/90 dark:bg-amber-950/90 border border-amber-200 dark:border-amber-800 shadow-md flex items-center gap-2.5 w-32" style={{ animationDuration: '3.4s', animationDelay: '0.3s' }}>
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Listen</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Audio Sync</div>
                </div>
              </div>

              {/* Card 3: Vocabulary (Middle Left - Green) */}
              <div className="absolute top-36 left-0 animate-float p-3 rounded-2xl bg-emerald-100/90 dark:bg-emerald-950/90 border border-emerald-200 dark:border-emerald-800 shadow-md flex items-center gap-2.5 w-36" style={{ animationDuration: '2.8s', animationDelay: '0.6s' }}>
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  Aa
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Vocabulary</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Word Power</div>
                </div>
              </div>

              {/* Card 4: Communicate (Middle Right - Pink) */}
              <div className="absolute top-32 right-0 animate-float p-3 rounded-2xl bg-pink-100/90 dark:bg-pink-950/90 border border-pink-200 dark:border-pink-800 shadow-md flex items-center gap-2.5 w-36" style={{ animationDuration: '3.2s', animationDelay: '0.9s' }}>
                <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Communicate</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Speech AI</div>
                </div>
              </div>

              {/* Friendly Waving White Robot SVG */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <svg viewBox="0 0 120 130" className="w-32 h-36 animate-float overflow-visible" style={{ animationDuration: '3s' }}>
                  <defs>
                    <linearGradient id="whiteBotGrad" x1="0" y1="0" x2="0" y2="100">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <linearGradient id="botVisor" x1="0" y1="0" x2="0" y2="40">
                      <stop offset="0%" stopColor="#0F172A" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                  </defs>

                  {/* Hover Shadow Glow */}
                  <ellipse cx="60" cy="122" rx="22" ry="5" fill="#38BDF8" opacity="0.3" className="animate-pulse" />

                  {/* Body */}
                  <rect x="36" y="65" width="48" height="42" rx="20" fill="url(#whiteBotGrad)" stroke="#CBD5E1" strokeWidth="2" />
                  <circle cx="60" cy="86" r="7" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                  <circle cx="60" cy="86" r="3.5" fill="#38BDF8" className="animate-ping" />

                  {/* Left Waving Arm */}
                  <g className="animate-bounce" style={{ animationDuration: '2s' }}>
                    <path d="M 36 75 C 20 70, 15 50, 20 40" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" fill="none" />
                    <circle cx="20" cy="40" r="5" fill="#38BDF8" />
                  </g>

                  {/* Right Arm */}
                  <path d="M 84 75 C 95 80, 100 95, 95 100" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <circle cx="95" cy="100" r="4.5" fill="#38BDF8" />

                  {/* Antenna */}
                  <rect x="58" y="10" width="4" height="14" rx="2" fill="#94A3B8" />
                  <circle cx="60" cy="8" r="6" fill="#38BDF8" className="animate-pulse" />
                  <circle cx="60" cy="8" r="2.5" fill="#FFFFFF" />

                  {/* Head */}
                  <rect x="26" y="22" width="68" height="46" rx="23" fill="url(#whiteBotGrad)" stroke="#CBD5E1" strokeWidth="2" />
                  <rect x="32" y="28" width="56" height="34" rx="17" fill="url(#botVisor)" stroke="#38BDF8" strokeWidth="1" />

                  {/* Smiling Eyes */}
                  <circle cx="47" cy="45" r="4.5" fill="#38BDF8" />
                  <circle cx="48" cy="44" r="1.5" fill="#FFFFFF" />
                  <circle cx="73" cy="45" r="4.5" fill="#38BDF8" />
                  <circle cx="74" cy="44" r="1.5" fill="#FFFFFF" />

                  {/* Smile Path */}
                  <path d="M 52 52 Q 60 58 68 52" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />

                  {/* Cheeks */}
                  <circle cx="39" cy="51" r="3" fill="#F472B6" opacity="0.8" />
                  <circle cx="81" cy="51" r="3" fill="#F472B6" opacity="0.8" />
                </svg>
              </div>

            </div>
          </div>

          {/* MAIN CENTERED HERO CONTENT */}
          <div className="space-y-6 text-center max-w-2xl mx-auto z-20 relative">
            
            {/* 1. Centered Soft Purple Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE] dark:bg-purple-950/80 border border-purple-200/80 dark:border-purple-800 text-[#6D28D9] dark:text-purple-300 text-xs sm:text-sm font-bold shadow-2xs mb-1">
              <span>✨</span> <span data-i18n="home.kicker">{t('home.kicker')}</span>
            </div>

            {/* 2. Main Centered Headline */}
            <h1 data-i18n="home.title" className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1E1B4B] dark:text-white leading-[1.12]">
              {t('home.title')}
            </h1>

            {/* 3. Clean Subtext Description */}
            <p data-i18n="home.subtext" className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
              {t('home.subtext')}
            </p>

            {/* 4. Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
              <button
                onClick={() => onNavigate('read-listen')}
                className="px-7 py-3.5 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span data-i18n="home.btnStartLearning">{t('home.btnStartLearning')} →</span>
              </button>

              <button
                onClick={() => onNavigate('book-scanner')}
                className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 font-bold text-sm shadow-2xs transition-all cursor-pointer inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <ScanText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span data-i18n="home.btnScanBook">{t('home.btnScanBook')}</span>
              </button>
            </div>

            {/* 5. Feature Pills directly below buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span data-i18n="home.badgeDld">{t('home.badgeDld')}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs">
                <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span data-i18n="home.badgeCamera">{t('home.badgeCamera')}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs">
                <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span data-i18n="home.badgeMultilingual">{t('home.badgeMultilingual')}</span>
              </div>
            </div>
          </div>

          {/* 5. CENTERED "LANGUAGE PRACTICE" VISUAL CARD (REAL UI COMPONENT) */}
          <div className="pt-8 md:pt-12 max-w-2xl mx-auto relative flex items-center justify-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 motion-reduce:animate-none">
            
            {/* Ambient background glow behind the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 bg-gradient-to-br from-teal-500/15 via-cyan-500/15 to-slate-400/10 dark:from-teal-500/20 dark:via-cyan-500/20 dark:to-slate-800/20 blur-2xl rounded-3xl -z-10 pointer-events-none opacity-80"
            />

            <div className="relative w-full text-left">
              <div className="p-6 sm:p-8 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 transition-all duration-300">
                
                {/* 1. Header & Status */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div className="flex items-center gap-3.5">
                    {/* Soft purple icon badge */}
                    <div className="w-11 h-11 rounded-2xl bg-purple-100/80 dark:bg-purple-950/80 border border-purple-200/60 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Language Practice
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Personalized Learning Hub
                      </p>
                    </div>
                  </div>

                  {/* Soft green Active pill badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
                    Active
                  </span>
                </div>

                {/* 2. Progress Bar */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      Adaptive Learning Modules
                    </span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold">Ready</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full w-4/5 animate-pulse motion-reduce:animate-none" />
                  </div>
                </div>

                {/* 3. Module Cards (3-column grid below the bar) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  
                  {/* Card 1: Read & Listen */}
                  <button
                    onClick={() => onNavigate('read-listen')}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1 space-y-2.5 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 motion-reduce:transform-none"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-300 flex items-center justify-center transition-all duration-300 group-hover:bg-teal-600 group-hover:text-white dark:group-hover:bg-teal-500 dark:group-hover:text-white shadow-2xs">
                      <BookOpen className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        Read & Listen
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">Audio & Sync</div>
                    </div>
                  </button>

                  {/* Card 2: Vocabulary */}
                  <button
                    onClick={() => onNavigate('language-tools')}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1 space-y-2.5 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 motion-reduce:transform-none"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white dark:group-hover:bg-amber-500 dark:group-hover:text-white shadow-2xs">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                        Vocabulary
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">Word Scaffolds</div>
                    </div>
                  </button>

                  {/* Card 3: Communication */}
                  <button
                    onClick={() => onNavigate('neuroplay')}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1 space-y-2.5 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 motion-reduce:transform-none"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-500 dark:group-hover:text-white shadow-2xs">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                        Communication
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">Speech Games</div>
                    </div>
                  </button>

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Five Clickable Core Feature Cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Scan a Page */}
          <button
            onClick={() => onNavigate('book-scanner')}
            className="p-4 rounded-2xl border app-border app-bg-surface hover:border-[#7C4DBA] dark:hover:border-[#A855F7] hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-2 group active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 motion-reduce:transform-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFFB] dark:bg-[#3B2256] text-[#7C4DBA] dark:text-[#D8B4FE] flex items-center justify-center group-hover:scale-110 transition-transform motion-reduce:transform-none">
              <ScanText className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold app-text-primary">
              📷 {t('home.featScan')}
            </span>
          </button>

          {/* Card 2: Listen */}
          <button
            onClick={() => onNavigate('read-listen')}
            className="p-4 rounded-2xl border app-border app-bg-surface hover:border-[#7C4DBA] dark:hover:border-[#A855F7] hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-2 group active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 motion-reduce:transform-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDFA] dark:bg-[#134E4A] text-[#0D9488] dark:text-[#5EEAD4] flex items-center justify-center group-hover:scale-110 transition-transform motion-reduce:transform-none">
              <Volume2 className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold app-text-primary">
              🔊 {t('home.featListen')}
            </span>
          </button>

          {/* Card 3: Understand */}
          <button
            onClick={() => onNavigate('language-tools')}
            className="p-4 rounded-2xl border app-border app-bg-surface hover:border-[#7C4DBA] dark:hover:border-[#A855F7] hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-2 group active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 motion-reduce:transform-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] dark:bg-[#78350F] text-[#D97706] dark:text-[#FCD34D] flex items-center justify-center group-hover:scale-110 transition-transform motion-reduce:transform-none">
              <Wand2 className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold app-text-primary">
              🔎 {t('home.featUnderstand')}
            </span>
          </button>

          {/* Card 4: NeuroPlay */}
          <button
            onClick={() => onNavigate('neuroplay')}
            className="p-4 rounded-2xl border app-border app-bg-surface hover:border-[#7C4DBA] dark:hover:border-[#A855F7] hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-2 group active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 motion-reduce:transform-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFFB] dark:bg-[#3B2256] text-[#7C4DBA] dark:text-[#D8B4FE] flex items-center justify-center group-hover:scale-110 transition-transform motion-reduce:transform-none">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold app-text-primary">
              🎮 {t('home.featNeuroplay')}
            </span>
          </button>

          {/* Card 5: Track Progress */}
          <button
            onClick={() => onNavigate('progress')}
            className="p-4 rounded-2xl border app-border app-bg-surface hover:border-[#7C4DBA] dark:hover:border-[#A855F7] hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-2 group active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 col-span-2 sm:col-span-1 motion-reduce:transform-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] dark:bg-[#064E3B] text-[#059669] dark:text-[#6EE7B7] flex items-center justify-center group-hover:scale-110 transition-transform motion-reduce:transform-none">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold app-text-primary">
              📊 {t('home.featProgress')}
            </span>
          </button>
        </div>
      </section>

      {/* 3. Visual "How Lingua AI Works" Steps */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border app-border app-bg-surface p-6 sm:p-8 shadow-xs text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#7C4DBA] dark:text-[#D8B4FE]">
            <span>{t('home.howItWorks')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center">
            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl app-bg-surface-secondary border app-border space-y-1 transition-transform duration-200 hover:scale-[1.02] motion-reduce:transform-none">
              <div className="w-8 h-8 rounded-full bg-[#4A154B] dark:bg-[#7C4DBA] text-white flex items-center justify-center text-xs font-bold mx-auto mb-1 shadow-2xs">
                1
              </div>
              <div className="text-xs font-extrabold app-text-primary">{t('home.step1Title')}</div>
              <div className="text-[11px] app-text-muted">{t('home.step1Desc')}</div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl app-bg-surface-secondary border app-border space-y-1 transition-transform duration-200 hover:scale-[1.02] motion-reduce:transform-none">
              <div className="w-8 h-8 rounded-full bg-[#0D9488] dark:bg-[#0D9488] text-white flex items-center justify-center text-xs font-bold mx-auto mb-1 shadow-2xs">
                2
              </div>
              <div className="text-xs font-extrabold app-text-primary">{t('home.step2Title')}</div>
              <div className="text-[11px] app-text-muted">{t('home.step2Desc')}</div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-2xl app-bg-surface-secondary border app-border space-y-1 transition-transform duration-200 hover:scale-[1.02] motion-reduce:transform-none">
              <div className="w-8 h-8 rounded-full bg-[#7C4DBA] dark:bg-[#8B5CF6] text-white flex items-center justify-center text-xs font-bold mx-auto mb-1 shadow-2xs">
                3
              </div>
              <div className="text-xs font-extrabold app-text-primary">{t('home.step3Title')}</div>
              <div className="text-[11px] app-text-muted">{t('home.step3Desc')}</div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-2xl app-bg-surface-secondary border app-border space-y-1 transition-transform duration-200 hover:scale-[1.02] motion-reduce:transform-none">
              <div className="w-8 h-8 rounded-full bg-[#D97706] dark:bg-[#D97706] text-white flex items-center justify-center text-xs font-bold mx-auto mb-1 shadow-2xs">
                4
              </div>
              <div className="text-xs font-extrabold app-text-primary">{t('home.step4Title')}</div>
              <div className="text-[11px] app-text-muted">{t('home.step4Desc')}</div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-2xl app-bg-surface-secondary border app-border space-y-1 col-span-2 sm:col-span-1 transition-transform duration-200 hover:scale-[1.02] motion-reduce:transform-none">
              <div className="w-8 h-8 rounded-full bg-[#059669] dark:bg-[#059669] text-white flex items-center justify-center text-xs font-bold mx-auto mb-1 shadow-2xs">
                5
              </div>
              <div className="text-xs font-extrabold app-text-primary">{t('home.step5Title')}</div>
              <div className="text-[11px] app-text-muted">{t('home.step5Desc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What Makes Lingua AI Special Cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl border app-border app-bg-surface space-y-3 hover:border-[#7C4DBA] dark:hover:border-[#A855F7] transition-all duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none">
            <span className="text-3xl block" role="img" aria-label="brain">🧠</span>
            <h3 className="text-sm sm:text-base font-extrabold app-text-primary">{t('home.specialDldTitle')}</h3>
            <p className="text-xs app-text-secondary leading-relaxed">
              {t('home.specialDldDesc')}
            </p>
          </div>

          <div className="p-6 rounded-3xl border app-border app-bg-surface space-y-3 hover:border-[#7C4DBA] dark:hover:border-[#A855F7] transition-all duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none">
            <span className="text-3xl block" role="img" aria-label="globe">🌐</span>
            <h3 className="text-sm sm:text-base font-extrabold app-text-primary">{t('home.specialMultiTitle')}</h3>
            <p className="text-xs app-text-secondary leading-relaxed">
              {t('home.specialMultiDesc')}
            </p>
          </div>

          <div className="p-6 rounded-3xl border app-border app-bg-surface space-y-3 hover:border-[#7C4DBA] dark:hover:border-[#A855F7] transition-all duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none">
            <span className="text-3xl block" role="img" aria-label="sparkles">✨</span>
            <h3 className="text-sm sm:text-base font-extrabold app-text-primary">{t('home.specialChildTitle')}</h3>
            <p className="text-xs app-text-secondary leading-relaxed">
              {t('home.specialChildDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Bottom Aesthetics & Rotating Compass Guide */}
      <section className="mx-auto max-w-xl text-center px-4 pt-2 pb-6 flex flex-col items-center justify-center gap-3">
        <div className="p-3 px-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-teal-500/20 dark:border-teal-500/40 shadow-sm inline-flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0">
            {/* Compass SVG with requestAnimationFrame rotating needle */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-600 dark:text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" className="opacity-40" />
              <g ref={compassNeedleRef} style={{ transformOrigin: '12px 12px' }}>
                <polygon points="12,6 15,12 12,18 9,12" fill="currentColor" opacity="0.85" />
              </g>
            </svg>
          </div>
          <div className="text-left">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
              Guided Language Journey
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              Empowering confident communication for every learner
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  LayoutDashboard,
  ScanText,
  TrendingUp,
  ChevronDown,
  Globe,
  SlidersHorizontal,
  Settings,
  User,
  Power,
  Menu,
  X,
  BookOpen,
  Brain,
  Wand2,
  Users,
  Info,
  HeartHandshake,
  GraduationCap,
  HelpCircle,
  Activity,
  Briefcase,
} from 'lucide-react';
import { Logo } from './Logo';
import { NavPage, ChildProfile } from '../../types';
import { SUPPORTED_LANGUAGES, useTranslation } from '../../utils/i18n';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenAccessibility: () => void;
  profile: ChildProfile;
  onUpdateProfile: (updated: Partial<ChildProfile>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAccessibility,
  profile,
  onUpdateProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout, openAuthModal } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const activeLang = language || 'en';

  // Primary Center Nav Items
  const primaryNavItems: {
    id: NavPage;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', label: t('nav.home') || 'Home', icon: Home },
    { id: 'dashboard', label: t('nav.dashboard') || 'Dashboard', icon: LayoutDashboard },
    { id: 'book-scanner', label: t('nav.scan') || 'Scan a Book', icon: ScanText },
    { id: 'progress', label: t('nav.progress') || 'Progress', icon: TrendingUp },
    { id: 'dld', label: t('nav.dld') || 'DLD', icon: Activity },
  ];

  // Exact 5 "Explore Sections" items specified in request
  const secondaryNavItems: {
    id: NavPage;
    label: string;
    subtitle: string;
    icon: React.FC<{ className?: string }>;
    bgColor: string;
    textColor: string;
  }[] = [
    {
      id: 'read-listen',
      label: t('nav.read') || 'Read & Listen',
      subtitle: t('nav.readSubtitle') || 'Audio Stories',
      icon: BookOpen,
      bgColor: 'bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400 group-hover:text-white',
    },
    {
      id: 'neuroplay',
      label: t('nav.neuroplay') || 'NeuroPlay',
      subtitle: t('nav.neuroplaySubtitle') || 'Brain Games',
      icon: Brain,
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60 group-hover:bg-indigo-600',
      textColor: 'text-indigo-600 dark:text-indigo-400 group-hover:text-white',
    },
    {
      id: 'language-tools',
      label: t('nav.tools') || 'Support Tools',
      subtitle: t('nav.toolsSubtitle') || 'Assistive Tech',
      icon: Wand2,
      bgColor: 'bg-teal-50 dark:bg-teal-950/60 group-hover:bg-teal-600',
      textColor: 'text-teal-600 dark:text-teal-400 group-hover:text-white',
    },
    {
      id: 'community',
      label: t('nav.community') || 'Community',
      subtitle: t('nav.communitySubtitle') || 'Connect & Share',
      icon: Users,
      bgColor: 'bg-purple-50 dark:bg-purple-950/60 group-hover:bg-purple-600',
      textColor: 'text-purple-600 dark:text-purple-400 group-hover:text-white',
    },
    {
      id: 'about',
      label: t('nav.about') || 'About',
      subtitle: t('nav.aboutSubtitle') || 'Our Mission',
      icon: Info,
      bgColor: 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-700',
      textColor: 'text-slate-600 dark:text-slate-300 group-hover:text-white',
    },
  ];

  // Dedicated Roles & Modes items
  const roleModeItems: {
    id: NavPage;
    label: string;
    subtitle: string;
    icon: React.FC<{ className?: string }>;
    bgColor: string;
    textColor: string;
  }[] = [
    {
      id: 'parent-mode',
      label: t('nav.parentMode') || 'Parent Mode',
      subtitle: t('nav.parentModeSub') || 'Home Support & Daily Insights',
      icon: HeartHandshake,
      bgColor: 'bg-rose-50 dark:bg-rose-950/60 group-hover:bg-rose-600',
      textColor: 'text-rose-600 dark:text-rose-400 group-hover:text-white',
    },
    {
      id: 'teacher-mode',
      label: t('nav.teacherMode') || 'Teacher Mode',
      subtitle: t('nav.teacherModeSub') || 'Classroom IEP & Group Progress',
      icon: GraduationCap,
      bgColor: 'bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400 group-hover:text-white',
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setLangDropdownOpen(false);
  };

  const handleSelectLanguage = (code: string) => {
    setLanguage(code);
    onUpdateProfile({ appLanguage: code });
    setLangDropdownOpen(false);
  };

  const isSecondaryActive = [...secondaryNavItems, ...roleModeItems].some((item) => item.id === currentPage);
  const fullDisplayName = user?.name && user.name.trim().length > 0 ? user.name : (profile.name || 'Niharika Dubey');
  const displayName = fullDisplayName.split(' ')[0] || 'Niharika';

  return (
    <header className="sticky top-3 z-50 w-full px-3 sm:px-6 pointer-events-none">
      {/* Floating Bright White Glassmorphic Navbar Container */}
      <div className="pointer-events-auto mx-auto max-w-7xl rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-slate-950/20 px-4 sm:px-8 py-2.5 transition-all duration-300 flex items-center justify-between gap-4 text-slate-800 dark:text-white">
        
        {/* =========================================================================
            ZONE 1: BRAND LOGO & IDENTITY (LEFT)
           ========================================================================= */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-full transition-transform active:scale-95 cursor-pointer group"
            aria-label="Lingua AI Home"
          >
            <Logo size="md" showTagline={false} />
          </button>
        </div>

        {/* =========================================================================
            ZONE 2: SPACED CENTER NAVIGATION LINKS (DESKTOP lg:flex)
           ========================================================================= */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold" aria-label="Main Navigation">
          {primaryNavItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-extrabold px-4.5 py-1.5 rounded-full shadow-sm shadow-indigo-600/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-1.5 rounded-full hover:-translate-y-0.5'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* "More Sections ▾" Interactive Dropdown Menu */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isSecondaryActive || moreDropdownOpen
                  ? 'bg-indigo-600 text-white font-extrabold px-4.5 py-1.5 rounded-full shadow-sm shadow-indigo-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-1.5 rounded-full hover:-translate-y-0.5'
              }`}
              aria-expanded={moreDropdownOpen}
              aria-haspopup="true"
              aria-label="More sections menu"
            >
              <span>More Sections</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Floating White Card */}
            {moreDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-2xl z-50 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                {/* AI CLINICAL ASSISTANT */}
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                    <span>AI CLINICAL ASSISTANT</span>
                    <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">NEW</span>
                  </div>
                  <div
                    className={`dropdown-item cursor-pointer flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                      currentPage === 'neurovani-ai'
                        ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                        : 'hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                    }`}
                    id="navNeuroVaniChatBtn"
                    onClick={() => handleNavClick('neurovani-ai')}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shrink-0 text-base">
                      🤖
                    </div>
                    <div>
                      <div className={`font-bold text-sm flex items-center gap-2 ${currentPage === 'neurovani-ai' ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                        NeuroVani AI <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentPage === 'neurovani-ai' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'}`}>DLD Bot</span>
                      </div>
                      <div className={`text-xs ${currentPage === 'neurovani-ai' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>1:1 Clinical Guidance & Voice Assistant</div>
                    </div>
                  </div>
                </div>

                {/* EXPLORE SECTIONS */}
                <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    EXPLORE SECTIONS
                  </div>
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full group text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors shrink-0 ${isActive ? 'bg-white/20 text-white' : item.bgColor + ' ' + item.textColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left leading-tight">
                          <p className={`font-extrabold text-xs ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{item.label}</p>
                          <p className={`text-[10px] ${isActive ? 'text-indigo-100' : 'text-slate-400'} font-normal`}>{item.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ROLES & MODES */}
                <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    ROLES & MODES
                  </div>
                  {roleModeItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full group text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors shrink-0 ${isActive ? 'bg-white/20 text-white' : item.bgColor + ' ' + item.textColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left leading-tight">
                          <p className={`font-extrabold text-xs ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{item.label}</p>
                          <p className={`text-[10px] ${isActive ? 'text-indigo-100' : 'text-slate-400'} font-normal`}>{item.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* =========================================================================
            ZONE 3: CLEAN & COMPACT RIGHT UTILITIES
           ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* 1. Language Pill [🌐 EN ▾] */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              title="Change Language"
              aria-label="Change Language"
              aria-expanded={langDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="font-mono uppercase text-xs font-black">{activeLang.slice(0, 2)}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 max-h-72 overflow-y-auto rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                  Supported Languages
                </div>
                {SUPPORTED_LANGUAGES.map((sl) => (
                  <button
                    key={sl.code}
                    type="button"
                    onClick={() => handleSelectLanguage(sl.code)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      sl.code === activeLang
                        ? 'bg-indigo-600 text-white font-extrabold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{sl.nativeName}</span>
                    <span className={`text-[10px] ${sl.code === activeLang ? 'text-indigo-100' : 'text-slate-400'}`}>{sl.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Accessibility Circular Icon Button */}
          <button
            type="button"
            onClick={onOpenAccessibility}
            className="w-9 h-9 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition-all shadow-2xs flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            title="Accessibility Options"
            aria-label="Accessibility Options"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </button>

          {/* 3. Settings Circular Icon Button */}
          <button
            type="button"
            onClick={() => handleNavClick('settings')}
            className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
              currentPage === 'settings'
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                : 'border-slate-200/80 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* 4. User Profile Capsule & Rich LinkedIn-style Profile Card Dropdown */}
          <div className="relative" ref={userRef}>
            <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-full p-1 pl-1.5 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal();
                  } else {
                    setUserDropdownOpen(!userDropdownOpen);
                  }
                }}
                className="flex items-center gap-1.5 cursor-pointer focus:outline-none"
                title={`Profile: ${fullDisplayName}`}
              >
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullDisplayName)}`}
                  alt={fullDisplayName}
                  className="w-6 h-6 rounded-full bg-indigo-600 object-cover ring-1 ring-indigo-500 shrink-0"
                />
                <span className="text-xs font-extrabold text-slate-800 dark:text-white max-w-[80px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={logout}
                  className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-rose-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center cursor-pointer ml-0.5"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <Power className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* LinkedIn-style User Dropdown Menu Card (Highlighted in Image 2) */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl backdrop-blur-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Header */}
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullDisplayName)}`}
                    alt={fullDisplayName}
                    className="w-14 h-14 rounded-full bg-indigo-600 object-cover ring-2 ring-indigo-500/30 shrink-0 shadow-xs"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                      {fullDisplayName}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-3 font-medium">
                      Problem solver | Currently pursuing B.tech in CSE (AI/ML) | Learning, building, and growing – one project at a time.
                    </p>

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('dashboard');
                        }}
                        className="px-3.5 py-1 rounded-full border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-xs font-bold transition-colors cursor-pointer"
                      >
                        View profile
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('progress');
                        }}
                        className="px-3.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        Verify now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Section */}
                <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white px-1 mb-1">
                    Account
                  </div>

                  {/* Premium Badge */}
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('language-tools');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 hover:bg-amber-100/80 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      ₹
                    </span>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 truncate">
                      Try now: Premium for ₹0
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('settings');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Settings & Privacy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('about');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Help</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setLangDropdownOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>Language</span>
                  </button>
                </div>

                {/* Manage Section */}
                <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white px-1 mb-1">
                    Manage
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('progress');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-slate-500" />
                    <span>Posts & Activity</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('parent-mode');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>Job Posting Account</span>
                  </button>
                </div>

                {/* Sign Out Footer */}
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (isAuthenticated) {
                        logout();
                      } else {
                        openAuthModal();
                      }
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isAuthenticated ? 'Sign out' : 'Sign in'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile / Tablet Hamburger Button (< 1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full lg:hidden bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-600" /> : <Menu className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          RESPONSIVE MOBILE / TABLET SLIDING FROSTED DRAWER (< 1024px)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden fixed inset-x-3 top-20 z-50 max-w-xl mx-auto rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200 text-slate-900 dark:text-white">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <Logo size="sm" showTagline={false} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Mobile Nav Links */}
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Primary Navigation
            </p>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-black shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* AI Clinical Companion Mobile Link */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleNavClick('neurovani-ai')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 'neurovani-ai'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'bg-indigo-50/80 dark:bg-indigo-950/40 text-slate-800 dark:text-white border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100/80'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shrink-0 text-base shadow-xs">
                🤖
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 font-black">
                  <span>NeuroVani AI</span>
                  <span className="bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-[9px] px-1.5 py-0.5 rounded-full font-bold">DLD Bot</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">1:1 Clinical Guidance & Voice Assistant</p>
              </div>
            </button>
          </div>

          {/* Secondary Mobile Nav Links */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="px-2 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              EXPLORE SECTIONS
            </p>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-black shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-white' : item.bgColor + ' ' + item.textColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-xs">{item.label}</p>
                    <p className="text-[10px] text-slate-500 font-normal">{item.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Roles & Modes Mobile Nav Links */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="px-2 text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              ROLES & MODES
            </p>
            {roleModeItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-black shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-white' : item.bgColor + ' ' + item.textColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-xs">{item.label}</p>
                    <p className="text-[10px] text-slate-500 font-normal">{item.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

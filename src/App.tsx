import React, { useState, useEffect } from 'react';
import { NavPage, ChildProfile, ScannedPage, AudiobookItem } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AccessibilityModal } from './components/common/AccessibilityModal';
import { AuthModal } from './components/common/AuthModal';
import { Protected } from './components/common/Protected';
import { VoiceBotNavigator } from './components/VoiceBotNavigator';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { useTranslation } from './utils/i18n';
import { useAuth } from './context/AuthContext';

// Pages
import { Home } from './components/pages/Home';
import { About } from './components/pages/About';
import { Dashboard } from './components/pages/Dashboard';
import { ReadListen } from './components/pages/ReadListen';
import { BookScanner } from './components/pages/BookScanner';
import { LanguageTools } from './components/pages/LanguageTools';
import { NeuroPlay } from './components/pages/NeuroPlay';
import { Community } from './components/pages/Community';
import { Progress } from './components/pages/Progress';
import { Settings } from './components/pages/Settings';
import { ParentMode } from './components/pages/ParentMode';
import { TeacherMode } from './components/pages/TeacherMode';
import { DldAnalytics } from './components/pages/DldAnalytics';
import { NeuroVaniChat } from './components/pages/NeuroVaniChat';
import { SAMPLE_BOOK_PAGES } from './data/bookLibrary';

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [navHistory, setNavHistory] = useState<NavPage[]>(['home']);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);

  // Learner profile & accessibility state
  const [profile, setProfile] = useState<ChildProfile>(() => {
    try {
      const stored = localStorage.getItem('lingua_profile');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      name: 'Khushi',
      age: 8,
      readingLevel: 'Developing',
      focusAreas: ['Syntax Sequencing', 'Word Finding', 'Auditory Memory'],
      theme: 'default',
      useDyslexicFont: false,
      fontSize: 'medium',
      speechRate: 1.0,
      appLanguage: 'en',
    };
  });

  // Synchronize profile.name dynamically with authenticated user name
  useEffect(() => {
    if (isAuthenticated && user?.name) {
      setProfile((prev) => (prev.name !== user.name ? { ...prev, name: user.name } : prev));
    } else if (!isAuthenticated && profile.name !== 'Guest') {
      setProfile((prev) => ({ ...prev, name: 'Guest' }));
    }
  }, [user, isAuthenticated]);

  // Saved book pages with persistent browser storage (RULE 9 & 11)
  const [savedPages, setSavedPages] = useState<ScannedPage[]>(() => {
    try {
      const stored = localStorage.getItem('lingua_saved_pages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  // Multi-page audiobook with persistent storage (RULE 11)
  const [audiobook, setAudiobook] = useState<AudiobookItem>(() => {
    try {
      const stored = localStorage.getItem('lingua_audiobook');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.pages)) return parsed;
      }
    } catch {}
    return {
      id: 'ab-1',
      title: 'Adventures in Nature & Science',
      pages: SAMPLE_BOOK_PAGES.slice(0, 3),
      currentPageIndex: 0,
      lastPlayedDate: 'Today',
    };
  });

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('lingua_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Persist saved pages
  useEffect(() => {
    try {
      localStorage.setItem('lingua_saved_pages', JSON.stringify(savedPages));
    } catch {}
  }, [savedPages]);

  // Persist audiobook
  useEffect(() => {
    try {
      localStorage.setItem('lingua_audiobook', JSON.stringify(audiobook));
    } catch {}
  }, [audiobook]);

  // Keep HTML root attributes synchronized with centralized typography and theme state (RULE 14 & 15)
  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', profile.fontSize);
    document.documentElement.setAttribute('data-theme', profile.theme);
    if (profile.theme === 'contrast') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Line Spacing Global Setting
    const lineSpacingMap: Record<string, string> = {
      normal: '1.5',
      relaxed: '1.8',
      loose: '2.2',
    };
    const spacingVal = lineSpacingMap[profile.lineSpacing || 'normal'] || '1.5';
    document.documentElement.style.lineHeight = spacingVal;

    // High Contrast Text Global Setting
    if (profile.highContrastText) {
      document.documentElement.classList.add('global-high-contrast');
    } else {
      document.documentElement.classList.remove('global-high-contrast');
    }
  }, [profile.fontSize, profile.theme, profile.lineSpacing, profile.highContrastText]);

  const { language, setLanguage } = useTranslation();

  // Sync profile.appLanguage when language changes in LanguageProvider
  useEffect(() => {
    if (language && profile.appLanguage !== language) {
      setProfile((prev) => ({ ...prev, appLanguage: language }));
    }
  }, [language, profile.appLanguage]);

  const handleUpdateProfile = (updated: Partial<ChildProfile>) => {
    if (updated.appLanguage && updated.appLanguage !== language) {
      setLanguage(updated.appLanguage);
    }
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Sync URL hash (#neurovani-ai, #neurovani-chat-section)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#neurovani-ai' || hash === '#neurovani-chat-section') {
        setCurrentPage('neurovani-ai');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: NavPage) => {
    setNavHistory((prev) => {
      if (prev[prev.length - 1] === page) return prev;
      return [...prev, page];
    });
    setCurrentPage(page);
    if (page === 'neurovani-ai') {
      window.location.hash = 'neurovani-ai';
    } else if (window.location.hash === '#neurovani-ai' || window.location.hash === '#neurovani-chat-section') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop();
      const prevPage = newHistory[newHistory.length - 1] || 'home';
      setNavHistory(newHistory);
      setCurrentPage(prevPage);
    } else {
      setCurrentPage('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut: Pressing Escape triggers back / close action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAccessibilityModalOpen) {
          setIsAccessibilityModalOpen(false);
          return;
        }
        if (currentPage !== 'home') {
          handleBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isAccessibilityModalOpen, navHistory]);

  const handleSavePage = (newPage: ScannedPage) => {
    setSavedPages((prev) => [newPage, ...prev.filter((p) => p.id !== newPage.id)]);
  };

  const handleAddToAudiobook = (newPage: ScannedPage) => {
    setAudiobook((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
  };

  const handleDeletePage = (pageId: string) => {
    setSavedPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  const fontClass = profile.useDyslexicFont ? 'font-opendyslexic' : '';

  return (
    <div className={`min-h-screen flex flex-col app-bg-primary app-text-primary ${fontClass}`}>
      {/* Top Navigation Bar with Language & Accessibility */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home onNavigate={handleNavigate} profile={profile} />
        )}
        {currentPage === 'dashboard' && (
          <Dashboard onNavigate={handleNavigate} onBack={handleBack} profile={profile} />
        )}
        {currentPage === 'book-scanner' && (
          <Protected toolName="Book Scanner & AI Lens">
            <BookScanner
              onNavigate={handleNavigate}
              onBack={handleBack}
              profile={profile}
              onSavePage={handleSavePage}
              onAddToAudiobook={handleAddToAudiobook}
            />
          </Protected>
        )}
        {currentPage === 'read-listen' && (
          <ReadListen
            profile={profile}
            onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
            onNavigate={handleNavigate}
            onBack={handleBack}
            savedPages={savedPages}
            audiobook={audiobook}
            onUpdateAudiobook={setAudiobook}
            onDeletePage={handleDeletePage}
          />
        )}
        {currentPage === 'neuroplay' && (
          <Protected toolName="NeuroPlay Brain Games">
            <NeuroPlay onNavigate={handleNavigate} onBack={handleBack} profile={profile} />
          </Protected>
        )}
        {currentPage === 'language-tools' && (
          <LanguageTools onNavigate={handleNavigate} onBack={handleBack} />
        )}
        {currentPage === 'progress' && (
          <Progress onNavigate={handleNavigate} onBack={handleBack} profile={profile} />
        )}
        {currentPage === 'dld' && (
          <DldAnalytics onNavigate={handleNavigate} onBack={handleBack} />
        )}
        {currentPage === 'community' && (
          <Community onNavigate={handleNavigate} onBack={handleBack} />
        )}
        {currentPage === 'about' && (
          <About onNavigate={handleNavigate} onBack={handleBack} />
        )}
        {currentPage === 'settings' && (
          <Settings
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        )}
        {currentPage === 'parent-mode' && (
          <ParentMode onNavigate={handleNavigate} onBack={handleBack} profile={profile} />
        )}
        {currentPage === 'teacher-mode' && (
          <TeacherMode onNavigate={handleNavigate} onBack={handleBack} profile={profile} />
        )}
        {currentPage === 'neurovani-ai' && (
          <NeuroVaniChat onNavigate={handleNavigate} onBack={handleBack} profile={profile} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Centralized Accessibility & Reader Settings Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Centralized Authentication & Login Modal */}
      <AuthModal />

      {/* Floating AI Voice Assistant Robot for Kids & Teens */}
      <VoiceBotNavigator profile={profile} onNavigate={handleNavigate} />

      {/* Offline Connectivity Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}

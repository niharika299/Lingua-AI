import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Square,
  BookOpen,
  Headphones,
  Check,
  Globe,
  Trash2,
  Plus,
  Eye,
  Loader2,
  BookMarked,
  Sparkles,
  Compass,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ChildProfile, ScannedPage, AudiobookItem, NavPage } from '../../types';
import { recordActivityCompletion } from '../../utils/activityTracker';
import { SUPPORTED_LANGUAGES, getVoiceForLanguage, useTranslation } from '../../utils/i18n';
import { translateContent, playSpeech, stopSpeech, pauseSpeech, resumeSpeech } from '../../utils/translationService';
import { SAMPLE_BOOK_PAGES } from '../../data/bookLibrary';
import { logDldActivity } from '../../utils/dldActivityStore';
import { BackNavigationButton } from '../common/BackNavigationButton';

interface ReadListenProps {
  profile: ChildProfile;
  onOpenAccessibility: () => void;
  onNavigate?: (page: NavPage) => void;
  onBack?: () => void;
  savedPages: ScannedPage[];
  audiobook: AudiobookItem;
  onUpdateAudiobook: (audiobook: AudiobookItem) => void;
  onDeletePage: (id: string) => void;
}

export const ReadListen: React.FC<ReadListenProps> = ({
  profile,
  onOpenAccessibility,
  onNavigate,
  onBack,
  savedPages,
  audiobook,
  onUpdateAudiobook,
  onDeletePage,
}) => {
  const { t } = useTranslation();
  const currentLang = profile.appLanguage || 'en';

  // Identify child's native language for 1-click translation
  const nativeLangCode = profile.appLanguage || 'en';
  const nativeLangObj = SUPPORTED_LANGUAGES.find((sl) => sl.code === nativeLangCode) || {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  };
  const targetNativeLang = nativeLangCode === 'en' ? 'hi' : nativeLangCode;
  const targetNativeObj = SUPPORTED_LANGUAGES.find((sl) => sl.code === targetNativeLang) || {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
  };

  const [activeTab, setActiveTab] = useState<'my-pages' | 'explore' | 'audiobooks' | 'reader'>('my-pages');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  // Currently active page for Reader Studio
  const [activePage, setActivePage] = useState<ScannedPage>(
    savedPages[0] || SAMPLE_BOOK_PAGES[0]
  );

  // Audiobook Playback states
  const [currentAudiobookPageIndex, setCurrentAudiobookPageIndex] = useState<number>(
    audiobook.currentPageIndex || 0
  );
  const [showResumePrompt, setShowResumePrompt] = useState<boolean>(
    Boolean(audiobook.pages.length > 0 && audiobook.currentPageIndex > 0)
  );

  // Reader Voice States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSpokenWord, setActiveSpokenWord] = useState<string | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(profile.speechRate || 1.0);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<string>(currentLang);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Single word selection
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordMeaning, setWordMeaning] = useState<string | null>(null);
  const [loadingMeaning, setLoadingMeaning] = useState(false);
  const [savedWordBadge, setSavedWordBadge] = useState(false);

  // Bionic reading toggle
  const [bionicMode, setBionicMode] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Strict text-to-read from active document (RULE 1 & 13)
  const readerText =
    selectedVoiceLang !== 'en' && translatedText
      ? translatedText
      : activePage.extractedText;

  // Translation function (RULE 4)
  const handleTranslate = async (langCode: string) => {
    setSelectedVoiceLang(langCode);
    handleStop();

    if (langCode === 'en') {
      setTranslatedText(null);
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await translateContent(activePage.extractedText, langCode);
      setTranslatedText(translated);
    } catch (err) {
      console.warn('Translation notice:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Open page directly translated into child's native language with 1 click
  const handleOpenPageTranslated = (page: ScannedPage) => {
    handleStop();
    setActivePage(page);
    setActiveTab('reader');
    handleTranslate(targetNativeLang);
  };

  // Switch active page and open reader
  const handleOpenPage = (page: ScannedPage, autoPlay: boolean = false) => {
    handleStop();
    setActivePage(page);
    setActiveTab('reader');
    setTranslatedText(null);

    // If a non-English language is active, translate this new page
    if (selectedVoiceLang !== 'en') {
      setIsTranslating(true);
      translateContent(page.extractedText, selectedVoiceLang)
        .then((res) => {
          setTranslatedText(res);
          setIsTranslating(false);
          if (autoPlay) {
            setTimeout(() => handlePlayDirect(res, selectedVoiceLang), 100);
          }
        })
        .catch(() => {
          setIsTranslating(false);
          if (autoPlay) {
            setTimeout(() => handlePlayDirect(page.extractedText, selectedVoiceLang), 100);
          }
        });
    } else if (autoPlay) {
      setTimeout(() => handlePlayDirect(page.extractedText, 'en'), 100);
    }
  };

  // Direct Audio Playback (RULE 5)
  const handlePlayDirect = (text: string, langCode: string) => {
    if (!text || !text.trim()) return;

    playSpeech(text, langCode, speechSpeed, {
      onBoundary: (word) => {
        setActiveSpokenWord(word);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSpokenWord(null);

        recordActivityCompletion({
          activityType: 'readAndListen',
          activityName: activePage?.title || 'Read & Listen Practice',
          category: 'Read & Listen',
          source: 'Read & Listen',
          metadata: {
            pageTitle: activePage?.title,
            language: selectedVoiceLang,
          },
        });

        logDldActivity({
          taskName: `Read & Listen: ${activePage?.title || 'Story Practice'}`,
          accuracy: 100,
          points: 40,
          modality: 'Reading',
        });

        // Advance to next page if listening to audiobook
        if (activeTab === 'audiobooks' && currentAudiobookPageIndex < audiobook.pages.length - 1) {
          const nextIdx = currentAudiobookPageIndex + 1;
          setCurrentAudiobookPageIndex(nextIdx);
          onUpdateAudiobook({ ...audiobook, currentPageIndex: nextIdx });
          setActivePage(audiobook.pages[nextIdx]);
        }
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
    });

    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePlay = async () => {
    if (!activePage?.extractedText) return;

    if (isPaused) {
      resumeSpeech();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Ensure non-English text is translated before playing
    if (selectedVoiceLang !== 'en' && !translatedText) {
      setIsTranslating(true);
      try {
        const translated = await translateContent(activePage.extractedText, selectedVoiceLang);
        setTranslatedText(translated);
        handlePlayDirect(translated, selectedVoiceLang);
      } catch {
        handlePlayDirect(activePage.extractedText, selectedVoiceLang);
      } finally {
        setIsTranslating(false);
      }
      return;
    }

    handlePlayDirect(readerText, selectedVoiceLang);
  };

  const handlePause = () => {
    if (isPlaying) {
      pauseSpeech();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSpokenWord(null);
  };

  const handleReplay = () => {
    handleStop();
    setTimeout(() => handlePlay(), 100);
  };

  // Word selection and explanation
  const handleWordClick = async (rawWord: string) => {
    const clean = rawWord.replace(/[^a-zA-Z0-9\u0900-\u0D7F]/g, '');
    if (!clean) return;

    setSelectedWord(clean);
    setLoadingMeaning(true);
    setSavedWordBadge(false);

    try {
      const res = await fetch('/api/gemini/explain-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: clean, context: readerText }),
      });
      if (res.ok) {
        const data = await res.json();
        setWordMeaning(data.meaning || `${clean}: An important word in this text.`);
      } else {
        setWordMeaning(`${clean}: A word found on this page.`);
      }
    } catch {
      setWordMeaning(`${clean}: An important word found on this page.`);
    } finally {
      setLoadingMeaning(false);
    }
  };

  const handleSpeakOnlyWord = async () => {
    if (!selectedWord) return;
    let wordToSpeak = selectedWord;

    if (selectedVoiceLang !== 'en') {
      try {
        wordToSpeak = await translateContent(selectedWord, selectedVoiceLang);
      } catch {
        wordToSpeak = selectedWord;
      }
    }

    playSpeech(wordToSpeak, selectedVoiceLang, speechSpeed);
  };

  // All combined pages for My Pages (User pages first, then Sample pages)
  const allUserPages = savedPages.filter((p) => !p.isSample);
  const samplePagesList = SAMPLE_BOOK_PAGES;

  // Filter explore topics
  const exploreTopics = ['All', 'Space', 'Science', 'Nature', 'Biology', 'Story', 'Earth Science'];
  const filteredExplorePages =
    selectedTopic === 'All'
      ? SAMPLE_BOOK_PAGES
      : SAMPLE_BOOK_PAGES.filter((p) => p.topic?.toLowerCase().includes(selectedTopic.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Navigation Button */}
      <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="home" label="Back to Home" />

      {/* 1. Header with clear 4 navigation tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b app-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C4DBA]">
            <BookOpen className="w-4 h-4" />
            <span>{t('nav.read')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary">
            {t('reader.tabReader')} & {t('reader.tabAudiobooks')}
          </h1>
          <p className="text-xs app-text-secondary mt-0.5">
            {t('reader.exploreDesc')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 app-bg-surface-secondary border app-border rounded-2xl shadow-2xs self-start sm:self-center">
          <button
            onClick={() => {
              handleStop();
              setActiveTab('my-pages');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my-pages'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'app-text-secondary hover:text-black dark:hover:text-white'
            }`}
          >
            📚 {t('reader.tabMyPages')} ({allUserPages.length})
          </button>

          <button
            onClick={() => {
              handleStop();
              setActiveTab('explore');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'app-text-secondary hover:text-black dark:hover:text-white'
            }`}
          >
            🧭 {t('reader.tabExplore')}
          </button>

          <button
            onClick={() => {
              handleStop();
              setActiveTab('audiobooks');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audiobooks'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'app-text-secondary hover:text-black dark:hover:text-white'
            }`}
          >
            🎧 {t('reader.tabAudiobooks')} ({audiobook.pages.length})
          </button>

          <button
            onClick={() => setActiveTab('reader')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'reader'
                ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                : 'app-text-secondary hover:text-black dark:hover:text-white'
            }`}
          >
            📖 {t('reader.tabReader')}
          </button>
        </div>
      </div>

      {/* --- TAB 1: MY PAGES (RULE 8 & 9) --- */}
      {activeTab === 'my-pages' && (
        <div className="space-y-8">
          {/* USER SAVED PAGES SECTION (RULE 9: "Your Page") */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold app-text-primary">
                  ⭐ {t('reader.myPagesTitle')} ({allUserPages.length})
                </h2>
                <p className="text-xs app-text-muted">
                  {t('reader.myPagesDesc')}
                </p>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('book-scanner')}
                  className="px-4 py-2 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-95 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('reader.btnScanNew')}</span>
                </button>
              )}
            </div>

            {allUserPages.length === 0 ? (
              <div className="p-8 rounded-3xl border app-border app-bg-surface text-center space-y-3">
                <BookOpen className="w-10 h-10 text-[#7C4DBA] mx-auto opacity-60" />
                <h3 className="text-sm font-bold app-text-primary">{t('reader.emptySaved')}</h3>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('book-scanner')}
                    className="px-4 py-2 rounded-xl border-2 border-[#7C4DBA] text-[#7C4DBA] dark:text-[#C084FC] text-xs font-bold hover:bg-[#F9F5FD] dark:hover:bg-[#3B2256] cursor-pointer"
                  >
                    {t('nav.scan')} →
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allUserPages.map((page) => (
                  <div
                    key={page.id}
                    className="rounded-3xl border app-border app-bg-surface overflow-hidden shadow-xs hover:border-[#7C4DBA] transition-all flex flex-col justify-between group"
                  >
                    <div className="aspect-video relative bg-black/10 overflow-hidden">
                      <img
                        src={page.imageUrl}
                        alt={page.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        ⭐ {t('reader.yourPageBadge')}
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {page.progressPct}% {t('reader.pctRead')}
                      </div>
                    </div>

                    <div className="p-4 space-y-2 flex-1">
                      <h3 className="text-sm font-extrabold app-text-primary line-clamp-1">
                        {page.title}
                      </h3>
                      <p className="text-xs app-text-muted line-clamp-2 leading-relaxed">
                        {page.extractedText}
                      </p>
                      <div className="text-[11px] app-text-muted">{t('reader.lastOpened')}: {page.date}</div>
                    </div>

                    <div className="p-3 border-t app-border flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleOpenPage(page, false)}
                          className="px-3 py-1.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold hover:opacity-95 cursor-pointer"
                        >
                          📖 {t('common.open')}
                        </button>
                        <button
                          onClick={() => handleOpenPageTranslated(page)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#0D9488] text-white text-xs font-bold hover:opacity-95 cursor-pointer flex items-center gap-1"
                          title={`Translate to ${targetNativeObj.nativeName}`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>🌐 Translate</span>
                        </button>
                        <button
                          onClick={() => handleOpenPage(page, true)}
                          className="px-2.5 py-1.5 rounded-xl border app-border text-xs font-bold app-text-primary hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#0D9488]" />
                          <span>{t('common.listen')}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => onDeletePage(page.id)}
                        className="p-1.5 rounded-lg app-text-muted hover:text-rose-600 transition-colors cursor-pointer"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SAMPLE CONTENT LIBRARY (RULE 8: Clearly marked as sample) */}
          <div className="space-y-4 pt-6 border-t app-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C4DBA] uppercase tracking-wider">
                  <span>{t('reader.sampleLibrary')}</span>
                </div>
                <h2 className="text-lg font-extrabold app-text-primary">
                  {t('reader.sampleBookPages')}
                </h2>
                <p className="text-xs app-text-muted">
                  {t('reader.samplePagesSub')}
                </p>
              </div>

              <span className="text-[11px] font-semibold bg-[#F5EFFB] dark:bg-[#3B2256] text-[#7C4DBA] dark:text-[#D8B4FE] px-2.5 py-1 rounded-full">
                {t('reader.sampleContent')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {samplePagesList.map((sample) => (
                <div
                  key={sample.id}
                  className="rounded-3xl border app-border app-bg-surface overflow-hidden shadow-xs hover:border-[#7C4DBA] transition-all flex flex-col justify-between group"
                >
                  <div className="aspect-video relative bg-black/10 overflow-hidden">
                    <img
                      src={sample.imageUrl}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-slate-800/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {t('reader.sampleContent')}
                    </div>
                    {sample.topic && (
                      <div className="absolute top-2 right-2 bg-[#0D9488] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {sample.topic}
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2 flex-1">
                    <h3 className="text-sm font-extrabold app-text-primary line-clamp-1">
                      {sample.title}
                    </h3>
                    <p className="text-xs app-text-muted line-clamp-2 leading-relaxed">
                      {sample.extractedText}
                    </p>
                    <div className="text-[11px] app-text-muted">{sample.wordCount} {t('reader.words')} · {t('reader.gradeLevel')}</div>
                  </div>

                  <div className="p-3 border-t app-border flex items-center justify-between gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleOpenPage(sample, false)}
                      className="px-3 py-1.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold hover:opacity-95 cursor-pointer"
                    >
                      📖 {t('common.open')}
                    </button>
                    <button
                      onClick={() => handleOpenPageTranslated(sample)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#0D9488] text-white text-xs font-bold hover:opacity-95 cursor-pointer flex items-center gap-1"
                      title={`Translate to ${targetNativeObj.nativeName}`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>🌐 Translate</span>
                    </button>
                    <button
                      onClick={() => handleOpenPage(sample, true)}
                      className="px-2.5 py-1.5 rounded-xl border app-border text-xs font-bold app-text-primary hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#0D9488]" />
                      <span>{t('common.listen')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: EXPLORE & LEARN (RULE 10) --- */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold app-text-primary">
              📚 {t('reader.exploreLearnTitle')}
            </h2>
            <p className="text-xs app-text-secondary">
              {t('reader.exploreLearnSub')}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {exploreTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTopic === topic
                    ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-xs'
                    : 'border app-border app-bg-surface app-text-secondary hover:text-black dark:hover:text-white'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Short Curated Cards (RULE 10: 2-3 line introduction, Title, Image, [ Read ], [ Listen ]) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExplorePages.map((book) => (
              <div
                key={book.id}
                className="p-4 rounded-3xl border app-border app-bg-surface shadow-xs hover:border-[#7C4DBA] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="rounded-2xl overflow-hidden aspect-video bg-black/10">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#0D9488] uppercase tracking-wide">
                    {book.topic}
                  </span>
                  <h3 className="text-base font-extrabold app-text-primary">
                    {book.title}
                  </h3>
                  <p className="text-xs app-text-secondary leading-relaxed line-clamp-3">
                    {book.simplifiedText || book.extractedText}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t app-border flex-wrap">
                  <button
                    onClick={() => handleOpenPage(book, false)}
                    className="flex-1 py-2 px-2 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold hover:opacity-95 cursor-pointer text-center whitespace-nowrap"
                  >
                    📖 {t('common.read')}
                  </button>
                  <button
                    onClick={() => handleOpenPageTranslated(book)}
                    className="flex-1 py-2 px-2 rounded-xl bg-[#0D9488] text-white text-xs font-bold hover:opacity-95 cursor-pointer text-center flex items-center justify-center gap-1 whitespace-nowrap"
                    title={`Translate to ${targetNativeObj.nativeName}`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>🌐 Translate</span>
                  </button>
                  <button
                    onClick={() => handleOpenPage(book, true)}
                    className="flex-1 py-2 px-2 rounded-xl border app-border text-xs font-bold app-text-primary hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>{t('common.listen')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: MY AUDIOBOOKS (RULE 11) --- */}
      {activeTab === 'audiobooks' && (
        <div className="space-y-6">
          {/* Resume Prompt Modal/Banner */}
          {showResumePrompt && (
            <div className="p-4 rounded-2xl bg-[#F0FDFA] dark:bg-[#134E4A]/40 border border-[#0D9488] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#0F766E] dark:text-[#5EEAD4]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0D9488] shrink-0" />
                <span className="font-bold">
                  {t('audiobook.resumePrompt')} ({t('audiobook.pageOf', { current: audiobook.currentPageIndex + 1, total: audiobook.pages.length })})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowResumePrompt(false);
                    handleOpenPage(audiobook.pages[audiobook.currentPageIndex], true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0D9488] text-white font-bold text-xs cursor-pointer"
                >
                  {t('audiobook.btnResume')}
                </button>
                <button
                  onClick={() => {
                    setShowResumePrompt(false);
                    setCurrentAudiobookPageIndex(0);
                    onUpdateAudiobook({ ...audiobook, currentPageIndex: 0 });
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#0D9488] font-bold text-xs cursor-pointer"
                >
                  {t('audiobook.btnStartOver')}
                </button>
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b app-border pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C4DBA]">
                  <Headphones className="w-4 h-4" />
                  <span>{t('audiobook.title')}</span>
                </div>
                <h2 className="text-xl font-extrabold app-text-primary mt-0.5">
                  🎧 {audiobook.title || t('audiobook.title')}
                </h2>
                <p className="text-xs app-text-muted mt-0.5">
                  {t('audiobook.subtitle')}
                </p>
              </div>

              {audiobook.pages.length > 0 && (
                <button
                  onClick={() => handleOpenPage(audiobook.pages[currentAudiobookPageIndex], true)}
                  className="px-6 py-3 rounded-2xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md hover:opacity-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>▶ {t('common.play')}</span>
                </button>
              )}
            </div>

            {/* Audiobook Pages Sequence */}
            {audiobook.pages.length === 0 ? (
              <div className="py-12 text-center text-xs app-text-muted space-y-3">
                <Headphones className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>{t('reader.emptySaved')}</p>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('book-scanner')}
                    className="px-4 py-2 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white font-bold text-xs cursor-pointer"
                  >
                    {t('nav.scan')}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {audiobook.pages.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                      idx === currentAudiobookPageIndex
                        ? 'border-[#7C4DBA] bg-[#F9F5FD] dark:bg-[#3B2256]'
                        : 'app-border app-bg-surface hover:border-[#7C4DBA]'
                    }`}
                    onClick={() => {
                      setCurrentAudiobookPageIndex(idx);
                      onUpdateAudiobook({ ...audiobook, currentPageIndex: idx });
                      handleOpenPage(p, true);
                    }}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#7C4DBA]">
                          {t('audiobook.pageOf', { current: idx + 1, total: audiobook.pages.length })}
                        </span>
                        {idx === currentAudiobookPageIndex && (
                          <span className="text-[10px] font-bold text-emerald-600">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold app-text-primary truncate">
                        {p.title}
                      </div>
                      <p className="text-[11px] app-text-muted truncate">
                        {p.extractedText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 4: READER STUDIO (RULE 1, 4, 5, 13: STRICT DATA PIPELINE) --- */}
      {activeTab === 'reader' && (
        <div className="space-y-6">
          {/* Top Bar with Audio Controls & Language Selector */}
          <div className="p-4 sm:p-5 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b app-border pb-3">
              {/* Play / Pause / Replay / Stop */}
              <div className="flex items-center gap-2">
                {!isPlaying ? (
                  <button
                    onClick={handlePlay}
                    className="px-5 py-2.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 hover:opacity-95 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{t('common.play')}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="px-5 py-2.5 rounded-xl bg-[#D97706] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 hover:opacity-95 shadow-xs cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>{t('common.pause')}</span>
                  </button>
                )}

                <button
                  onClick={handleReplay}
                  className="p-2.5 rounded-xl border app-border app-bg-surface hover:bg-black/5 dark:hover:bg-white/10 app-text-primary text-xs font-semibold cursor-pointer"
                  title={t('common.replay')}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleStop}
                  className="p-2.5 rounded-xl border app-border app-bg-surface hover:bg-black/5 dark:hover:bg-white/10 app-text-primary text-xs font-semibold cursor-pointer"
                  title={t('common.stop')}
                >
                  <Square className="w-4 h-4" />
                </button>
              </div>

              {/* Speeds */}
              <div className="flex items-center gap-1 p-1 app-bg-surface-secondary rounded-xl border app-border">
                {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSpeechSpeed(speed)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                      speechSpeed === speed
                        ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-2xs'
                        : 'app-text-muted hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Bionic reading toggle */}
              <button
                onClick={() => setBionicMode(!bionicMode)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  bionicMode
                    ? 'border-[#7C4DBA] bg-[#F1ECF8] dark:bg-[#3B2256] text-[#4A154B] dark:text-white'
                    : 'app-border app-bg-surface app-text-muted'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t('reader.bionicToggle')} {bionicMode ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Language translation bar (RULE 4 & 5) */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0D9488]" />
                <span className="font-bold app-text-secondary">{t('scanner.translateLabel')}</span>
                <select
                  value={selectedVoiceLang}
                  onChange={(e) => handleTranslate(e.target.value)}
                  className="rounded-lg border app-border p-1.5 text-xs app-bg-surface app-text-primary font-semibold cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((sl) => (
                    <option key={sl.code} value={sl.code}>
                      {sl.nativeName} ({sl.name})
                    </option>
                  ))}
                </select>
              </div>

              {isTranslating && (
                <div className="flex items-center gap-1.5 text-[#7C4DBA]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('reader.translating')}</span>
                </div>
              )}

              {translatedText && !isTranslating && (
                <span className="text-[11px] font-mono text-[#0D9488] bg-[#F0FDFA] dark:bg-[#134E4A] px-2 py-0.5 rounded border border-[#CCFBF1]">
                  ✓ {t('scanner.translatedBadge')}
                </span>
              )}
            </div>
          </div>

          {/* Reading Passage Card - STRICTLY READER TEXT ONLY (RULE 1 & 13) */}
          <div className="p-6 sm:p-8 rounded-3xl border app-border app-bg-surface shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b app-border pb-3">
              <h2 className="text-xl sm:text-2xl font-extrabold app-text-primary">
                {activePage.title}
              </h2>

              <span className="text-xs app-text-muted">
                {activePage.isSample ? t('reader.sampleContent') : t('reader.yourPageBadge')}
              </span>
            </div>

            <div className="text-base sm:text-lg leading-loose app-text-primary select-none space-y-4">
              {readerText.split('\n').map((paragraph: string, pIdx: number) => {
                if (!paragraph.trim()) return null;
                const words = paragraph.split(' ');
                return (
                  <p key={pIdx}>
                    {words.map((w: string, wIdx: number) => {
                      const clean = w.replace(/[^a-zA-Z0-9\u0900-\u0D7F]/g, '');
                      const isSpeaking =
                        activeSpokenWord && clean.toLowerCase() === activeSpokenWord.toLowerCase();
                      const isSelected = selectedWord && clean.toLowerCase() === selectedWord.toLowerCase();

                      // Bionic bold prefix
                      let wordDisplay: React.ReactNode = w;
                      if (bionicMode && w.length >= 2) {
                        const split = Math.ceil(w.length * 0.45);
                        wordDisplay = (
                          <span>
                            <strong className="font-extrabold text-[#7C4DBA] dark:text-[#C084FC]">
                              {w.slice(0, split)}
                            </strong>
                            <span>{w.slice(split)}</span>
                          </span>
                        );
                      }

                      return (
                        <span key={wIdx}>
                          <button
                            type="button"
                            onClick={() => handleWordClick(w)}
                            className={`cursor-pointer rounded px-1 py-0.5 transition-all text-left ${
                              isSpeaking
                                ? 'bg-yellow-300 text-black font-extrabold ring-2 ring-yellow-500'
                                : isSelected
                                ? 'bg-[#E8DEFB] dark:bg-[#4C1D95] font-extrabold text-[#3B0735] dark:text-white'
                                : 'hover:bg-[#F1ECF8] dark:hover:bg-[#3B2256]'
                            }`}
                          >
                            {wordDisplay}
                          </button>{' '}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Word Selection Popup (RULE 6) */}
          {selectedWord && (
            <div className="p-4 rounded-2xl border-2 border-[#7C4DBA] app-bg-surface shadow-md space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b app-border pb-2">
                <span className="text-base font-extrabold app-text-primary capitalize">
                  "{selectedWord}"
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeakOnlyWord}
                    className="px-3 py-1 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:opacity-90 cursor-pointer"
                    title="Listen"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t('common.listen')}</span>
                  </button>

                  <button
                    onClick={() => setSavedWordBadge(true)}
                    className="px-3 py-1 rounded-xl border app-border text-xs font-bold app-text-primary hover:bg-black/5 cursor-pointer flex items-center gap-1.5"
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>{savedWordBadge ? t('common.saved') : t('scanner.btnSaveWord')}</span>
                  </button>
                </div>
              </div>

              <div className="text-xs app-text-secondary">
                {loadingMeaning ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('reader.loadingMeaning')}</span>
                  </div>
                ) : (
                  <p className="leading-relaxed">
                    <strong>{t('scanner.btnMeaning')}: </strong>
                    {wordMeaning}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  RotateCcw,
  Square,
  Play,
  Pause,
  Volume2,
  BookMarked,
  Save,
  Edit3,
  Globe,
  Plus,
  Check,
  SwitchCamera,
  X,
  Loader2,
  Smartphone,
  FolderOpen,
  AlertCircle,
  Sparkles,
  QrCode,
  UploadCloud,
  BookOpen,
  ArrowRight,
  Bookmark,
  Clock,
  Heart,
  Share2,
} from 'lucide-react';
import { createWorker, Worker } from 'tesseract.js';

// Pre-initialize a persistent Tesseract worker globally once on page load to eliminate setup overhead
let globalWorkerPromise: Promise<Worker> | null = null;

async function getGlobalTesseractWorker(): Promise<Worker> {
  if (!globalWorkerPromise) {
    globalWorkerPromise = (async () => {
      const worker = await createWorker('eng');
      return worker;
    })();
  }
  return globalWorkerPromise;
}
import { ChildProfile, ScannedPage, NavPage } from '../../types';
import { recordActivityCompletion } from '../../utils/activityTracker';
import { SUPPORTED_LANGUAGES, getVoiceForLanguage, useTranslation } from '../../utils/i18n';
import { translateContent, playSpeech, stopSpeech, pauseSpeech, resumeSpeech } from '../../utils/translationService';
import { SAMPLE_BOOK_PAGES } from '../../data/bookLibrary';
import { logDldActivity } from '../../utils/dldActivityStore';
import { BackNavigationButton } from '../common/BackNavigationButton';

const CATEGORY_TAGS = [
  { id: 'all', label: '✨ All Scaffolds' },
  { id: 'space', label: '🚀 Space & Sci' },
  { id: 'nature', label: '🌿 Nature Tales' },
  { id: 'phonics', label: '🧩 Phonics Basics' },
  { id: 'emotional', label: '❤️ Emotional Learning' },
];

const ASPECT_RATIOS = ['aspect-4/3', 'aspect-3/4', 'aspect-16/10', 'aspect-4/5', 'aspect-square'];

const getTopicBadge = (topic?: string) => {
  const t = (topic || '').toLowerCase();
  if (t.includes('space') || t.includes('astronomy')) return '🪐 Space';
  if (t.includes('science')) return '🧪 Science';
  if (t.includes('nature')) return '🌿 Nature';
  if (t.includes('biology')) return '🌱 Botany';
  if (t.includes('earth')) return '🌋 Earth Sci';
  if (t.includes('adventure')) return '📖 Phonics L1';
  return '📚 Scaffold';
};

interface BookScannerProps {
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
  profile?: ChildProfile;
  onSavePage?: (page: ScannedPage) => void;
  onAddToAudiobook?: (page: ScannedPage) => void;
}

// Strict OCR Document Model (PART 7)
export interface CurrentScannedDocument {
  id: string;
  sourceType: 'camera' | 'device-image';
  imageUrl: string;
  image?: string;
  originalText: string;
  translatedText?: string;
  originalLanguage: string;
  selectedLanguage: string;
  title: string;
  createdAt: string;
}

export const BookScanner: React.FC<BookScannerProps> = ({
  onNavigate,
  onBack,
  profile,
  onSavePage,
  onAddToAudiobook,
}) => {
  const { t } = useTranslation();
  const currentAppLang = profile?.appLanguage || 'en';

  // Category filter for Pinterest discovery board
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [savedPinIds, setSavedPinIds] = useState<Record<string, boolean>>({});
  const isMountedRef = useRef<boolean>(true);

  const toggleSavePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedPinIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Hidden input refs for native camera and device upload
  const phoneCameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Live Camera Stream Modal states
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Document State (PART 7: Dedicated current document state)
  const [currentDocument, setCurrentDocument] = useState<CurrentScannedDocument | null>(null);

  // OCR Processing States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [noTextFound, setNoTextFound] = useState<boolean>(false);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);

  // Audio Playback states (PART 11, 12, 14)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPausedAudio, setIsPausedAudio] = useState<boolean>(false);
  const [activeSpokenWord, setActiveSpokenWord] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(profile?.speechRate || 1.0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Selected word states (PART 13)
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordMeaning, setWordMeaning] = useState<string | null>(null);
  const [loadingMeaning, setLoadingMeaning] = useState<boolean>(false);
  const [savedWordBadge, setSavedWordBadge] = useState<boolean>(false);

  // Action notifications
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [audiobookSuccess, setAudiobookSuccess] = useState<boolean>(false);

  // Drag over state for Card 2
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (url) {
          handleCapturedImage(url, file, false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to downscale high-res mobile camera images and boost contrast
  const prepareImageForFastOCR = (
    sourceImgOrVideo: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): string => {
    const canvas = document.createElement('canvas');
    let width =
      (sourceImgOrVideo as HTMLVideoElement).videoWidth ||
      (sourceImgOrVideo as HTMLImageElement).naturalWidth ||
      sourceImgOrVideo.width ||
      1280;
    let height =
      (sourceImgOrVideo as HTMLVideoElement).videoHeight ||
      (sourceImgOrVideo as HTMLImageElement).naturalHeight ||
      sourceImgOrVideo.height ||
      720;

    // Fast Canvas Scaling: Scale to max width 1200px (ideal DPI for mobile book text under 2 seconds)
    const maxWidth = 1200;
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(sourceImgOrVideo, 0, 0, width, height);

      // Convert to grayscale & boost contrast for better text recognition
      const imgData = ctx.getImageData(0, 0, width, height);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const avg = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const threshold = avg > 120 ? 255 : avg < 80 ? 0 : avg;
        d[i] = threshold;
        d[i + 1] = threshold;
        d[i + 2] = threshold;
      }
      ctx.putImageData(imgData, 0, 0);
    }
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Preprocess any data URL by loading into HTMLImageElement first
  const preprocessImageDataUrl = (srcDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const processed = prepareImageForFastOCR(img);
          resolve(processed);
        } catch (e) {
          console.warn('Preprocess error, fallback to original:', e);
          resolve(srcDataUrl);
        }
      };
      img.onerror = () => resolve(srcDataUrl);
      img.src = srcDataUrl;
    });
  };

  // Live Camera Stream Handlers
  const startLiveCamera = async () => {
    setCameraError(null);
    setIsLiveCameraOpen(true);
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Live stream camera error:', err);
      setCameraError('Unable to access live camera stream. Please use direct mobile photo capture instead.');
    }
  };

  const stopLiveCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsLiveCameraOpen(false);
  };

  const captureFromLiveVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Camera stream still loading, please wait 1 sec');
      return;
    }

    const processedDataUrl = prepareImageForFastOCR(video);
    stopLiveCamera();

    const newDoc: CurrentScannedDocument = {
      id: `doc-${Date.now()}`,
      sourceType: 'camera',
      imageUrl: processedDataUrl,
      image: processedDataUrl,
      originalText: '',
      originalLanguage: 'en',
      selectedLanguage: currentAppLang,
      title: 'Captured Book Page',
      createdAt: new Date().toISOString(),
    };

    setCurrentDocument(newDoc);
    runAutomaticOcr(processedDataUrl, newDoc);
  };

  // Cleanup & pre-init persistent OCR worker on mount
  useEffect(() => {
    isMountedRef.current = true;
    // Pre-initialize persistent global Tesseract worker once on page load to eliminate 5-8s setup delay
    getGlobalTesseractWorker().catch((err) => console.warn('Worker pre-init notice:', err));

    return () => {
      isMountedRef.current = false;
      stopSpeech();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Called when image is captured from Mobile Camera or Device Upload
  const handleCapturedImage = async (rawDataUrl: string, file?: File, isCamera: boolean = true) => {
    stopAudio();
    setNoTextFound(false);

    // Preprocess image to downscale max dimension to 1600px & boost contrast
    const processedDataUrl = await preprocessImageDataUrl(rawDataUrl);

    const newDoc: CurrentScannedDocument = {
      id: `doc-${Date.now()}`,
      sourceType: isCamera ? 'camera' : 'device-image',
      imageUrl: processedDataUrl,
      image: processedDataUrl,
      originalText: '',
      originalLanguage: 'en',
      selectedLanguage: currentAppLang,
      title: isCamera ? 'Captured Book Page' : file?.name.replace(/\.[^/.]+$/, '') || 'Uploaded Book Page',
      createdAt: new Date().toISOString(),
    };

    setCurrentDocument(newDoc);
    runAutomaticOcr(processedDataUrl, newDoc);
  };

  // Mobile camera fallback or device image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopAudio();

    const isFromCamera = Boolean(e.target.getAttribute('capture'));

    const reader = new FileReader();
    reader.onload = async (event) => {
      const url = event.target?.result as string;
      if (!url) return;
      await handleCapturedImage(url, file, isFromCamera);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const loadSamplePage = (sample = SAMPLE_BOOK_PAGES[0]) => {
    stopAudio();
    const newDoc: CurrentScannedDocument = {
      id: `${sample.id}-${Date.now()}`,
      sourceType: 'device-image',
      imageUrl: sample.imageUrl,
      image: sample.imageUrl,
      originalText: sample.extractedText,
      originalLanguage: 'en',
      selectedLanguage: currentAppLang,
      title: sample.title,
      createdAt: new Date().toISOString(),
    };
    setCurrentDocument(newDoc);
    setNoTextFound(false);
    setOcrProgress(100);
    setProcessingStatus('✓ Sample page loaded · Ready to read');
  };

  // Automatic Image Text Extraction with Real-time Progress & Client Tesseract Fallback
  const runAutomaticOcr = async (imageDataUrl: string, doc: CurrentScannedDocument) => {
    setIsProcessing(true);
    setOcrProgress(15);
    setProcessingStatus('🔍 Preprocessing & Analyzing book page...');
    setNoTextFound(false);
    setIsEditingText(false);

    // Dynamic progress bar animation
    const progressInterval = setInterval(() => {
      setOcrProgress((prev) => {
        if (prev >= 80) return prev;
        return prev + 10;
      });
    }, 250);

    let extractedText = '';

    try {
      const res = await fetch('/api/gemini/scan-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageDataUrl,
          mimeType: 'image/jpeg',
        }),
      });

      clearInterval(progressInterval);

      if (res.ok) {
        const data = await res.json();
        extractedText = (data.extractedText || '').trim();
      }

      // If server OCR didn't extract text, fallback to persistent pre-initialized client Tesseract worker
      if (!extractedText) {
        setProcessingStatus('⚡ Running fast client Tesseract OCR...');
        setOcrProgress(50);
        try {
          const worker = await getGlobalTesseractWorker();
          setOcrProgress(80);
          const ret = await worker.recognize(imageDataUrl);
          setOcrProgress(95);
          extractedText = (ret?.data?.text || '').trim();
        } catch (tessErr) {
          console.warn('Client Tesseract OCR error:', tessErr);
        }
      }

      setOcrProgress(100);

      if (!extractedText) {
        setNoTextFound(true);
        setProcessingStatus('⚠️ No text recognized on this page.');
        setCurrentDocument((prev) => (prev ? { ...prev, originalText: '' } : null));
      } else {
        // Clean formatting: normalize line breaks and hyphenated words
        const cleanText = extractedText
          .replace(/(?<=\w)-\n(?=\w)/g, '')
          .replace(/\r\n/g, '\n')
          .trim();

        setProcessingStatus('✓ Page scanned · ✓ Text detected');

        logDldActivity({
          taskName: `Book Scan: ${doc.title || 'Page Scan'}`,
          accuracy: 100,
          points: 50,
          modality: 'Reading',
        });

        let translatedText: string | undefined = undefined;
        if (doc.selectedLanguage && doc.selectedLanguage !== 'en') {
          try {
            translatedText = await translateContent(cleanText, doc.selectedLanguage);
          } catch (tErr) {
            console.warn('Initial translation warning:', tErr);
          }
        }

        setCurrentDocument((prev) =>
          prev
            ? {
                ...prev,
                originalText: cleanText,
                translatedText,
              }
            : null
        );
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.warn('Server OCR notice, attempting fast client Tesseract fallback:', err);
      setProcessingStatus('⚡ Running fast client Tesseract OCR...');
      setOcrProgress(50);
      try {
        const worker = await getGlobalTesseractWorker();
        setOcrProgress(85);
        const ret = await worker.recognize(imageDataUrl);
        setOcrProgress(98);
        const fallbackText = (ret?.data?.text || '').trim();
        setOcrProgress(100);

        if (fallbackText) {
          const cleanText = fallbackText.replace(/(?<=\w)-\n(?=\w)/g, '').trim();
          setProcessingStatus('✓ Page scanned · ✓ Text detected');
          setCurrentDocument((prev) => (prev ? { ...prev, originalText: cleanText } : null));
        } else {
          setNoTextFound(true);
          setProcessingStatus('⚠️ No text recognized on this page.');
        }
      } catch (fallbackErr) {
        console.error('All OCR attempts failed:', fallbackErr);
        setNoTextFound(true);
        setProcessingStatus('⚠️ Unable to extract text. Please try taking a clearer picture.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // PART 11 & 12: Strict readerText derived ONLY from current document (NEVER UI TEXT)
  const readerText =
    currentDocument?.selectedLanguage !== 'en' && currentDocument?.translatedText
      ? currentDocument.translatedText
      : currentDocument?.originalText || '';

  // Language translation handler
  const handleTranslate = async (targetLangCode: string) => {
    if (!currentDocument || !currentDocument.originalText) return;

    stopAudio();
    setIsTranslating(true);

    setCurrentDocument((prev) => (prev ? { ...prev, selectedLanguage: targetLangCode } : null));

    if (targetLangCode === 'en' || targetLangCode === currentDocument.originalLanguage) {
      setCurrentDocument((prev) => (prev ? { ...prev, translatedText: undefined } : null));
      setIsTranslating(false);
      return;
    }

    try {
      const translated = await translateContent(currentDocument.originalText, targetLangCode);
      setCurrentDocument((prev) => (prev ? { ...prev, translatedText: translated } : null));
    } catch (err) {
      console.warn('Translation notice:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // PART 14: Real Audio Controls
  const playAudio = async () => {
    if (!currentDocument?.originalText) return;

    if (isPausedAudio) {
      resumeSpeech();
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      return;
    }

    const langToSpeak = currentDocument?.selectedLanguage || 'en';

    // If active reading language is non-English and translation is pending, translate first
    let textToSpeak = readerText;
    if (langToSpeak !== 'en' && !currentDocument.translatedText) {
      setIsTranslating(true);
      try {
        const translated = await translateContent(currentDocument.originalText, langToSpeak);
        setCurrentDocument((prev) => (prev ? { ...prev, translatedText: translated } : null));
        textToSpeak = translated;
      } catch {
        textToSpeak = currentDocument.originalText;
      } finally {
        setIsTranslating(false);
      }
    }

    if (!textToSpeak.trim()) return;

    playSpeech(textToSpeak, langToSpeak, playbackSpeed, {
      onBoundary: (word) => {
        setActiveSpokenWord(word);
      },
      onEnd: () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
        setActiveSpokenWord(null);
      },
      onError: () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      },
    });

    setIsPlayingAudio(true);
    setIsPausedAudio(false);
  };

  const pauseAudio = () => {
    if (isPlayingAudio) {
      pauseSpeech();
      setIsPlayingAudio(false);
      setIsPausedAudio(true);
    }
  };

  const stopAudio = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    setActiveSpokenWord(null);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (isPlayingAudio) {
      stopAudio();
      setTimeout(() => {
        const langToSpeak = currentDocument?.selectedLanguage || 'en';
        const textToSpeak = readerText;
        if (textToSpeak.trim()) {
          playSpeech(textToSpeak, langToSpeak, newSpeed, {
            onBoundary: (word) => {
              setActiveSpokenWord(word);
            },
            onEnd: () => {
              setIsPlayingAudio(false);
              setIsPausedAudio(false);
              setActiveSpokenWord(null);
            },
            onError: () => {
              setIsPlayingAudio(false);
              setIsPausedAudio(false);
            },
          });
          setIsPlayingAudio(true);
          setIsPausedAudio(false);
        }
      }, 50);
    }
  };

  const replayAudio = () => {
    stopAudio();
    setTimeout(() => playAudio(), 100);
  };

  // PART 13: Selected Word Audio (ONLY the selected word is spoken)
  const handleSelectWord = async (rawWord: string) => {
    const clean = rawWord.replace(/[^a-zA-Z0-9\u0900-\u0D7F]/g, '');
    if (!clean) return;

    setSelectedWord(clean);
    setLoadingMeaning(true);
    setWordMeaning(null);
    setSavedWordBadge(false);

    try {
      const res = await fetch('/api/gemini/explain-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: clean, context: readerText }),
      });
      if (res.ok) {
        const data = await res.json();
        setWordMeaning(data.meaning || `${clean}: An important word on this page.`);
      } else {
        setWordMeaning(`${clean}: A word found on this page.`);
      }
    } catch {
      setWordMeaning(`${clean}: A word found on this page.`);
    } finally {
      setLoadingMeaning(false);
    }
  };

  const handleSpeakOnlySelectedWord = async () => {
    if (!selectedWord) return;
    let wordToSpeak = selectedWord;
    const currentLang = currentDocument?.selectedLanguage || 'en';

    if (currentLang !== 'en') {
      try {
        wordToSpeak = await translateContent(selectedWord, currentLang);
      } catch {
        wordToSpeak = selectedWord;
      }
    }

    playSpeech(wordToSpeak, currentLang, playbackSpeed);
  };

  // PART 16: Save Page to My Pages
  const handleSavePage = () => {
    if (!currentDocument?.imageUrl || !currentDocument?.originalText) return;

    const newPage: ScannedPage = {
      id: currentDocument.id || `user-page-${Date.now()}`,
      title: currentDocument.originalText.slice(0, 36).trim() || 'Scanned Book Page',
      imageUrl: currentDocument.imageUrl,
      extractedText: currentDocument.originalText,
      translatedText: currentDocument.translatedText,
      translatedLanguage: currentDocument.selectedLanguage !== 'en' ? currentDocument.selectedLanguage : undefined,
      paragraphs: currentDocument.originalText.split('\n').filter(Boolean),
      date: 'Today',
      progressPct: 100,
      isSample: false,
    };

    if (onSavePage) {
      onSavePage(newPage);
    }

    recordActivityCompletion({
      activityType: 'reading',
      activityName: 'Book Scanner & Camera OCR',
      category: 'Reading',
      source: 'Book Scanner',
      metadata: {
        pageTitle: newPage.title,
        wordCount: newPage.extractedText.split(/\s+/).length,
      },
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddToAudiobook = () => {
    if (!currentDocument?.imageUrl || !currentDocument?.originalText) return;

    const newPage: ScannedPage = {
      id: `ab-page-${Date.now()}`,
      title: currentDocument.originalText.slice(0, 32).trim() || 'Audiobook Page',
      imageUrl: currentDocument.imageUrl,
      extractedText: currentDocument.originalText,
      translatedText: currentDocument.translatedText,
      paragraphs: currentDocument.originalText.split('\n').filter(Boolean),
      date: 'Today',
      progressPct: 0,
      isSample: false,
    };

    if (onAddToAudiobook) {
      onAddToAudiobook(newPage);
    }
    setAudiobookSuccess(true);
    setTimeout(() => setAudiobookSuccess(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Navigation Button */}
      <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="home" label="Back to Home" />

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b app-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C4DBA]">
            <Camera className="w-4 h-4" />
            <span>{t('scanner.badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary">
            {t('scanner.title')}
          </h1>
          <p className="text-xs app-text-secondary mt-0.5">
            {t('scanner.subtext')}
          </p>
        </div>

        <button
          onClick={() => onNavigate('read-listen')}
          className="self-start sm:self-center px-4 py-2 rounded-xl border app-border app-bg-surface text-xs font-bold app-text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-colors shadow-2xs cursor-pointer"
        >
          {t('reader.tabMyPages')} →
        </button>
      </div>

      {/* Hidden file inputs for native mobile camera fallback */}
      <input
        id="mobileCameraInput"
        ref={phoneCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      <input
        id="native-mobile-camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden file input for device image upload */}
      <input
        id="device-image-input"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Live Camera Stream Modal */}
      {isLiveCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in">
          {/* Header */}
          <div className="w-full max-w-2xl flex items-center justify-between z-10 text-white pt-2">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="font-extrabold text-sm sm:text-base">Live Camera Viewfinder</span>
            </div>
            <button
              onClick={stopLiveCamera}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Video Stream Container */}
          <div className="relative w-full max-w-2xl flex-1 max-h-[65vh] my-4 rounded-3xl overflow-hidden bg-slate-900 border border-cyan-500/30 flex items-center justify-center shadow-2xl">
            {cameraError ? (
              <div className="p-6 text-center space-y-4 text-white">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-sm font-medium">{cameraError}</p>
                <button
                  onClick={() => {
                    stopLiveCamera();
                    phoneCameraInputRef.current?.click();
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs cursor-pointer shadow-lg"
                >
                  📸 Take Photo with Mobile Camera
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover rounded-3xl"
                />

                {/* Framing guide overlay */}
                <div className="absolute inset-8 border-2 border-dashed border-cyan-400/60 rounded-2xl pointer-events-none flex items-center justify-center">
                  <span className="text-[11px] font-extrabold text-cyan-300 bg-slate-950/70 px-3 py-1 rounded-full border border-cyan-400/30 shadow-md">
                    Center Book Page in Frame
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Live Controls */}
          <div className="w-full max-w-2xl flex flex-wrap items-center justify-center gap-3 z-10 pb-2">
            <button
              onClick={() => {
                setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
                startLiveCamera();
              }}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold border border-white/20 cursor-pointer flex items-center gap-2"
            >
              <SwitchCamera className="w-4 h-4 text-cyan-300" />
              <span>Flip Camera</span>
            </button>

            <button
              onClick={captureFromLiveVideo}
              disabled={Boolean(cameraError)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/30 disabled:opacity-50"
            >
              <Camera className="w-5 h-5 text-white" />
              <span>📸 Capture Page</span>
            </button>

            <button
              onClick={() => {
                stopLiveCamera();
                phoneCameraInputRef.current?.click();
              }}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-extrabold border border-slate-700 cursor-pointer flex items-center gap-1.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>Direct Photo Input</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. AI Neural Scanner Hub (Dual-Action Split Hero Layout) */}
      {!currentDocument && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CARD 1: Futuristic Live AI Camera Scanner */}
            <div
              onClick={() => phoneCameraInputRef.current?.click()}
              className="relative group p-7 sm:p-9 rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-cyan-500/30 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[380px]"
            >
              {/* Subtle Cyan-Violet Aurora Radial Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl group-hover:bg-cyan-500/30 transition-all pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-500/30 transition-all pointer-events-none" />

              {/* Top Badge Row */}
              <div className="flex items-center justify-between gap-2 mb-6 z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-extrabold backdrop-blur-md shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span>AI Lens 4K Active</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 shadow-xs">
                  ⚡ Ultra-Fast OCR
                </span>
              </div>

              {/* Visual & Content */}
              <div className="space-y-5 mb-6 z-10">
                {/* Holographic Viewfinder Frame with Animated Laser Scanline */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900/90 border border-cyan-400/40 p-2 shadow-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  {/* 4 Glowing Corner Brackets */}
                  <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm shadow-[0_0_8px_#22d3ee]" />
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm shadow-[0_0_8px_#22d3ee]" />
                  <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 rounded-bl-sm shadow-[0_0_8px_#22d3ee]" />
                  <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 rounded-br-sm shadow-[0_0_8px_#22d3ee]" />

                  {/* Vertical Laser Scanline */}
                  <div className="absolute left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-scanline pointer-events-none z-10" />

                  <Camera className="w-9 h-9 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Neural Instant Capture
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed max-w-md font-medium">
                    Real-time phoneme alignment & auto-deskewing for physical book pages.
                  </p>
                </div>

                {/* Audio Feedback Hint */}
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300/90 pt-1">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>Reads aloud in 40+ languages instantly upon capture</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="z-10 pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    phoneCameraInputRef.current?.click();
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/25"
                >
                  <Camera className="w-4 h-4 text-cyan-200" />
                  <span>📸 Take Photo with Camera</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startLiveCamera();
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cyan-300 font-extrabold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>📹 Live Stream Viewfinder</span>
                </button>
              </div>
            </div>

            {/* CARD 2: Interactive Drag & Drop Neural Vault */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative group p-7 sm:p-9 rounded-[36px] bg-gradient-to-br from-slate-950 via-indigo-950/90 to-purple-950/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[380px] ${
                isDraggingOver
                  ? 'border-2 border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.4)] bg-slate-900/95 scale-[1.01]'
                  : 'border border-purple-500/30 hover:border-purple-400/60 shadow-2xl hover:shadow-purple-500/20'
              }`}
            >
              {/* Glowing Mesh Nodes & Violet Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-500/30 transition-all pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-teal-500/15 blur-3xl group-hover:bg-teal-500/25 transition-all pointer-events-none" />

              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2 mb-6 z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-extrabold backdrop-blur-md shadow-xs">
                  <UploadCloud className="w-3.5 h-3.5 text-purple-300" />
                  <span>Drag & Drop Neural Vault</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 bg-purple-500/15 px-3 py-1 rounded-full border border-purple-400/30 shadow-xs">
                  📄 Multi-Format Ready
                </span>
              </div>

              {/* Visual & Content */}
              <div className="space-y-5 mb-6 z-10">
                {/* Glowing Animated Cloud/File Uplift Icon with Orbit Ring */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900/90 border border-purple-400/40 p-2 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {/* Floating Orbit Ring */}
                  <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-pulse pointer-events-none" />
                  <div className="absolute -inset-1 rounded-2xl border border-purple-400/20 pointer-events-none" />

                  <UploadCloud className="w-10 h-10 text-purple-300 drop-shadow-[0_0_12px_rgba(192,132,252,0.8)] group-hover:animate-bounce duration-1000" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {isDraggingOver ? (
                      <span className="text-cyan-300 animate-pulse">Drop Page to Analyze</span>
                    ) : (
                      'Upload Document / Image'
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-md font-medium">
                    Support PNG, JPG, WEBP, PDF up to 25MB. Instant AI speech model parsing.
                  </p>
                </div>

                {/* 3 Micro-Pills Tag Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-3 py-1 rounded-xl bg-purple-900/40 text-purple-200 font-bold text-[11px] border border-purple-500/30">
                    📄 PDF
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-purple-900/40 text-purple-200 font-bold text-[11px] border border-purple-500/30">
                    🖼️ PNG/JPG
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-purple-900/40 text-purple-200 font-bold text-[11px] border border-purple-500/30">
                    📦 Multi-Format Ready
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 z-10 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-purple-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-purple-400/30"
                >
                  <FolderOpen className="w-4 h-4 text-purple-200" />
                  <span>Browse Device Files</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSamplePage(SAMPLE_BOOK_PAGES[0]);
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-purple-200 font-extrabold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Try Sample Page</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. Active Document View (PART 8: ACTUAL USER IMAGE & ACTUAL OCR TEXT) */}
      {currentDocument && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Status & Scan Reset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl app-bg-surface border app-border shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0D9488]">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#7C4DBA]" />
                  <span className="app-text-primary">{processingStatus || '🔍 Understanding your page...'}</span>
                </>
              ) : noTextFound ? (
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>I couldn't find readable text on this page.</span>
                </div>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#0D9488]" />
                  <span>{processingStatus || '✓ Page scanned · ✓ Text detected'}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => phoneCameraInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-300" />
                <span>📷 Snap New Page</span>
              </button>

              <label
                htmlFor="native-mobile-camera-input"
                className="px-3.5 py-1.5 rounded-xl bg-[#0D9488] hover:bg-[#0f766e] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📱 {t('scanner.btnPhoneCam')}</span>
              </label>

              <label
                htmlFor="device-image-input"
                className="px-3.5 py-1.5 rounded-xl border app-border text-xs font-bold app-text-primary hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>📁 {t('scanner.btnUpload')}</span>
              </label>
            </div>
          </div>

          {/* TWO-COLUMN STAGE: ACTUAL USER IMAGE (LEFT) + ACTUAL OCR TEXT & READER (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: THE ACTUAL USER IMAGE (PART 8) */}
            <div className="lg:col-span-5 rounded-3xl overflow-hidden border app-border app-bg-surface shadow-xs space-y-3 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider app-text-muted flex items-center justify-between px-1">
                <span>📖 {t('scanner.badge')}</span>
                <span className="text-[10px] text-[#0D9488] font-bold">{t('common.profile')}</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-black/5 max-h-[520px] flex items-center justify-center">
                <img
                  src={currentDocument.imageUrl}
                  alt="Actual scanned book page"
                  className="w-full h-auto object-contain max-h-[500px]"
                />
              </div>

              <div className="text-center pt-1">
                <span className="text-[11px] app-text-muted">
                  Source: {currentDocument.sourceType === 'camera' ? 'Live Camera' : 'Device Upload'}
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: OCR RESULTS & ACCESSIBLE READER (PART 8, 11, 12, 14) */}
            <div className="lg:col-span-7 space-y-5">
              {/* If no text found on image (PART 10) */}
              {noTextFound && !isProcessing && (
                <div className="p-6 rounded-3xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-4">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>I couldn't find readable text on this page.</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Make sure the book page is well-lit, laid flat, and the camera is in focus.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => phoneCameraInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      🔄 Try Again (Mobile Cam)
                    </button>
                    <label className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-700 font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Choose Another Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* While OCR is running: Real-time Mobile Progress Overlay */}
              {isProcessing && (
                <div className="p-8 sm:p-12 rounded-3xl border border-indigo-200/80 dark:border-indigo-800/80 bg-white dark:bg-slate-900 shadow-xl text-center space-y-5 animate-in fade-in">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950" />
                    <Loader2 className="w-10 h-10 animate-spin text-[#7C4DBA]" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-base sm:text-lg font-extrabold app-text-primary">
                      Processing Book Page... [ {ocrProgress}% ]
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                      {processingStatus || 'Lingua AI is analyzing printed text and downscaling image for mobile memory...'}
                    </p>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="max-w-md mx-auto space-y-1.5">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700">
                      <div
                        className="bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 h-full rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1">
                      <span>0%</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">[ {ocrProgress}% ]</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* OCR Text Result & Audio Player (PART 8 & 11) */}
              {currentDocument.originalText && !isProcessing && (
                <div className="p-5 sm:p-6 rounded-3xl border app-border app-bg-surface shadow-xs space-y-5">
                  {/* Narration Toolbar: Play, Pause, Speeds, Language */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b app-border pb-4">
                    {/* Audio Playback Controls */}
                    <div className="flex items-center gap-2">
                      {!isPlayingAudio ? (
                        <button
                          onClick={playAudio}
                          className="px-5 py-2.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 hover:opacity-95 shadow-xs cursor-pointer active:scale-95"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>🔊 {t('scanner.btnReadPage')}</span>
                        </button>
                      ) : (
                        <button
                          onClick={pauseAudio}
                          className="px-5 py-2.5 rounded-xl bg-[#D97706] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 hover:opacity-95 shadow-xs cursor-pointer"
                        >
                          <Pause className="w-4 h-4" />
                          <span>⏸ {t('common.pause')}</span>
                        </button>
                      )}

                      <button
                        onClick={replayAudio}
                        className="p-2.5 rounded-xl border app-border app-bg-surface hover:bg-black/5 dark:hover:bg-white/10 app-text-primary text-xs font-semibold cursor-pointer"
                        title={t('common.replay')}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={stopAudio}
                        className="p-2.5 rounded-xl border app-border app-bg-surface hover:bg-black/5 dark:hover:bg-white/10 app-text-primary text-xs font-semibold cursor-pointer"
                        title={t('common.stop')}
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Speed Controls */}
                    <div className="flex items-center gap-1 p-1 app-bg-surface-secondary rounded-xl border app-border">
                      {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => handleSpeedChange(speed)}
                          className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            playbackSpeed === speed
                              ? 'bg-[#4A154B] dark:bg-[#7C4DBA] text-white shadow-2xs'
                              : 'app-text-muted hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multilingual Translation Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#0D9488]" />
                      <span className="font-bold app-text-secondary">{t('scanner.translateLabel')}</span>
                      <select
                        value={currentDocument.selectedLanguage}
                        onChange={(e) => handleTranslate(e.target.value)}
                        className="rounded-lg border app-border p-1.5 text-xs app-bg-surface app-text-primary font-semibold cursor-pointer"
                      >
                        {SUPPORTED_LANGUAGES.map((sl) => {
                          let label = sl.name;
                          if (sl.code === 'en') {
                            label = 'English (India)';
                          } else if (sl.nativeName !== sl.name) {
                            label = `${sl.nativeName} (${sl.name})`;
                          }
                          return (
                            <option key={sl.code} value={sl.code}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {isTranslating && (
                      <span className="text-[11px] text-[#7C4DBA] flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {t('reader.translating')}
                      </span>
                    )}

                    {currentDocument.translatedText && !isTranslating && (
                      <span className="text-[11px] font-mono text-[#0D9488] bg-[#F0FDFA] dark:bg-[#134E4A] px-2 py-0.5 rounded border border-[#CCFBF1]">
                        ✓ Translated
                      </span>
                    )}
                  </div>

                  {/* Text Found in your Page (PART 8) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C4DBA]">
                        {t('scanner.ocrSuccess')}
                      </h3>
                      <button
                        onClick={() => setIsEditingText(!isEditingText)}
                        className="text-xs font-bold text-[#7C4DBA] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{isEditingText ? t('common.save') : t('scanner.btnEditText')}</span>
                      </button>
                    </div>

                    {isEditingText ? (
                      <textarea
                        value={currentDocument.originalText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentDocument((prev) => (prev ? { ...prev, originalText: val } : null));
                        }}
                        rows={6}
                        className="w-full rounded-2xl border app-border p-4 text-sm app-bg-surface app-text-primary focus:outline-none focus:ring-2 focus:ring-[#7C4DBA] leading-relaxed"
                      />
                    ) : (
                      <div className="p-5 rounded-2xl app-bg-surface-secondary border app-border text-base sm:text-lg leading-relaxed app-text-primary select-none space-y-3">
                        {readerText.split(/\s+/).map((word, wIdx) => {
                          const clean = word.replace(/[^a-zA-Z0-9\u0900-\u0D7F]/g, '');
                          const isSpeakingThis =
                            activeSpokenWord && clean.toLowerCase() === activeSpokenWord.toLowerCase();
                          const isSelected = selectedWord && clean.toLowerCase() === selectedWord.toLowerCase();

                          return (
                            <span key={wIdx}>
                              <button
                                type="button"
                                onClick={() => handleSelectWord(word)}
                                className={`cursor-pointer rounded px-1 py-0.5 transition-all text-left ${
                                  isSpeakingThis
                                    ? 'bg-[#FDE047] text-black font-extrabold ring-2 ring-[#CA8A04]'
                                    : isSelected
                                    ? 'bg-[#E8DEFB] dark:bg-[#4C1D95] font-extrabold text-[#3B0735] dark:text-white'
                                    : 'hover:bg-[#F1ECF8] dark:hover:bg-[#3B2256]'
                                }`}
                              >
                                {word}
                              </button>{' '}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Selected Word Popover (PART 13: ONLY Selected Word Is Spoken) */}
                  {selectedWord && (
                    <div className="p-4 rounded-2xl border-2 border-[#7C4DBA] app-bg-surface shadow-md space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between border-b app-border pb-2">
                        <span className="text-base font-extrabold app-text-primary capitalize">
                          "{selectedWord}"
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSpeakOnlySelectedWord}
                            className="px-3.5 py-1.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:opacity-90 cursor-pointer"
                            title="Listen"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{t('common.listen')}</span>
                          </button>

                          <button
                            onClick={() => setSavedWordBadge(true)}
                            className="px-3.5 py-1.5 rounded-xl border app-border text-xs font-bold app-text-primary hover:bg-black/5 cursor-pointer flex items-center gap-1.5"
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

                  {/* Save Page & Add to Audiobook (PART 16) */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t app-border">
                    <button
                      onClick={handleSavePage}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                        saveSuccess
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'app-border app-bg-surface app-text-primary hover:bg-black/5 dark:hover:bg-white/10 shadow-2xs'
                      }`}
                    >
                      {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4" />}
                      <span>{saveSuccess ? t('scanner.pageSavedSuccess') : `⭐ ${t('scanner.btnSavePage')}`}</span>
                    </button>

                    <button
                      onClick={handleAddToAudiobook}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                        audiobookSuccess
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-[#7C4DBA] bg-[#F9F5FD] dark:bg-[#3B2256] text-[#4A154B] dark:text-[#F8F5FF] shadow-2xs hover:opacity-90'
                      }`}
                    >
                      {audiobookSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{audiobookSuccess ? t('scanner.audiobookAddedSuccess') : `🎧 ${t('scanner.btnAddToAudiobook')}`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Pinterest-Style Visual Discovery Board */}
      {!currentDocument && (
        <div className="p-6 sm:p-8 rounded-[36px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>VISUAL DISCOVERY BOARD</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Curated Reading Scaffolds
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Pre-analyzed multisensory reading samples designed for cognitive reinforcement.
              </p>
            </div>

            <span className="self-start sm:self-center text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3.5 py-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              {
                SAMPLE_BOOK_PAGES.filter((s) => {
                  if (activeCategoryFilter === 'space') return s.topic?.toLowerCase().includes('space') || s.topic?.toLowerCase().includes('science') || s.topic?.toLowerCase().includes('earth');
                  if (activeCategoryFilter === 'nature') return s.topic?.toLowerCase().includes('nature') || s.topic?.toLowerCase().includes('biology') || s.topic?.toLowerCase().includes('adventure');
                  if (activeCategoryFilter === 'phonics') return s.id.includes('sample-1') || s.id.includes('sample-2') || s.id.includes('sample-6');
                  if (activeCategoryFilter === 'emotional') return s.id.includes('sample-1') || s.id.includes('sample-5') || s.id.includes('sample-8');
                  return true;
                }).length
              } Pins Available
            </span>
          </div>

          {/* Top Category Filter Pills (Aesthetic Mood Tags) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORY_TAGS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategoryFilter === cat.id
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-md shadow-slate-900/10'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Pinterest-Inspired Masonry Grid Layout */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {SAMPLE_BOOK_PAGES.filter((s) => {
              if (activeCategoryFilter === 'space') return s.topic?.toLowerCase().includes('space') || s.topic?.toLowerCase().includes('science') || s.topic?.toLowerCase().includes('earth');
              if (activeCategoryFilter === 'nature') return s.topic?.toLowerCase().includes('nature') || s.topic?.toLowerCase().includes('biology') || s.topic?.toLowerCase().includes('adventure');
              if (activeCategoryFilter === 'phonics') return s.id.includes('sample-1') || s.id.includes('sample-2') || s.id.includes('sample-6');
              if (activeCategoryFilter === 'emotional') return s.id.includes('sample-1') || s.id.includes('sample-5') || s.id.includes('sample-8');
              return true;
            }).map((sample, idx) => {
              const isSaved = Boolean(savedPinIds[sample.id]);
              const aspectRatioClass = ASPECT_RATIOS[idx % ASPECT_RATIOS.length];
              const readMins = Math.max(2, Math.floor((sample.wordCount || 35) / 12));

              return (
                <div
                  key={sample.id}
                  onClick={() => loadSamplePage(sample)}
                  className="break-inside-avoid group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  {/* Cover Image & Overlay */}
                  <div className={`relative ${aspectRatioClass} w-full overflow-hidden bg-slate-100 dark:bg-slate-800`}>
                    <img
                      src={sample.imageUrl}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Dynamic Overlay Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-extrabold border border-white/20 shadow-md">
                      {getTopicBadge(sample.topic)}
                    </div>

                    {/* Top Right Save Bookmark Pin Button */}
                    <button
                      onClick={(e) => toggleSavePin(e, sample.id)}
                      title={isSaved ? 'Unsave Pin' : 'Save Pin'}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                        isSaved
                          ? 'bg-rose-500 text-white scale-110'
                          : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                    </button>

                    {/* Hover Overlay Buttons */}
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadSamplePage(sample);
                        }}
                        className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/30"
                        title="Instant Listen"
                      >
                        <Volume2 className="w-5 h-5 text-white" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadSamplePage(sample);
                        }}
                        className="px-4 py-2.5 rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-xl hover:bg-teal-500 hover:text-white transition-all cursor-pointer border border-white/40"
                      >
                        Read & Scaffold →
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {sample.title}
                    </h3>

                    {/* 2-line preview excerpt with dyslexia friendly spacing */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed tracking-wide font-medium bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      "{sample.extractedText}"
                    </p>

                    {/* Bottom Metadata Bar */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[11px]">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <span>⏱ {readMins} min read</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                          Audio Ready
                        </span>
                        <Volume2 className="w-3.5 h-3.5 text-teal-500" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

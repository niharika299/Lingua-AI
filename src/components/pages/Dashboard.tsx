import React, { useState } from 'react';
import {
  BookOpen,
  Headphones,
  Star,
  Brain,
  Download,
  Flame,
  Sparkles,
  ScanText,
  Target,
  Clock,
  Award,
  MoreHorizontal,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
} from 'lucide-react';
import { NavPage, ChildProfile } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { getNeuroPlaySessions } from '../../utils/neuroplayStorage';
import { getLearnerState } from '../../utils/learnerState';
import { useAuth } from '../../context/AuthContext';
import { BackNavigationButton } from '../common/BackNavigationButton';
import { generateProgressReportPDF } from '../../utils/pdfGenerator';

interface DashboardProps {
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
  profile?: ChildProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onBack, profile }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const childName = (isAuthenticated && user?.name) ? user.name : (profile?.name && profile.name !== 'Guest' ? profile.name : 'Learner');

  const [graphFilter, setGraphFilter] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [hoveredMonth, setHoveredIndex] = useState<number | null>(5); // Default to June
  const [downloadNotice, setDownloadNotice] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Read real completed sessions & learner state
  const sessions = getNeuroPlaySessions();
  const totalGamePoints = sessions.reduce((sum, s) => sum + s.score, 0);
  const neuroplayScore = Math.max(220, 120 + totalGamePoints);
  const learnerState = getLearnerState();

  // Dual Curve Graph Data (Jan to Jun)
  const monthsData = [
    { label: 'Jan', listening: 62, speaking: 50 },
    { label: 'Feb', listening: 74, speaking: 62 },
    { label: 'Mar', listening: 68, speaking: 58 },
    { label: 'Apr', listening: 82, speaking: 72 },
    { label: 'May', listening: 78, speaking: 81 },
    { label: 'Jun', listening: 88.4, speaking: 84 },
  ];

  // SVG dimensions for Dual Curve
  const svgW = 550;
  const svgH = 220;
  const padL = 35;
  const padR = 15;
  const padT = 25;
  const padB = 35;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const bottomY = svgH - padB;

  const getPoints = (key: 'listening' | 'speaking') => {
    return monthsData.map((d, i) => {
      const x = padL + (i / (monthsData.length - 1)) * chartW;
      const val = d[key];
      const y = bottomY - (val / 100) * chartH;
      return { x, y, val, label: d.label };
    });
  };

  const listeningPts = getPoints('listening');
  const speakingPts = getPoints('speaking');

  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (!pts.length) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    return d;
  };

  const listeningLine = buildSmoothPath(listeningPts);
  const listeningArea = `${listeningLine} L ${listeningPts[listeningPts.length - 1].x},${bottomY} L ${listeningPts[0].x},${bottomY} Z`;

  const speakingLine = buildSmoothPath(speakingPts);
  const speakingArea = `${speakingLine} L ${speakingPts[speakingPts.length - 1].x},${bottomY} L ${speakingPts[0].x},${bottomY} Z`;

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const state = getLearnerState();
      await generateProgressReportPDF(childName, {
        pagesScanned: state.pagesScanned || 14,
        listeningMinutes: state.listeningMinutes || 42,
        wordsMastered: state.wordsMastered || 28,
        neuroplayScore: state.neuroplayScore || neuroplayScore,
      });
      setDownloadNotice(true);
      setTimeout(() => setDownloadNotice(false), 3500);
    } catch (err) {
      console.error('Error generating report PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Session Data Table rows
  const tableData = [
    {
      id: '#LN-2041',
      module: 'Smart OCR Reader',
      focus: 'Visual Dyslexia Support',
      duration: '18 mins',
      status: 'Completed',
      statusColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      id: '#LN-2038',
      module: 'Audio Verbal Agnosia Lab',
      focus: 'Acoustic Discrimination',
      duration: '24 mins',
      status: 'In Progress',
      statusColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    {
      id: '#LN-2029',
      module: 'NeuroPlay Engine',
      focus: 'Spatial-Digit Mapping',
      duration: '12 mins',
      status: 'Verified',
      statusColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
  ];

  const filteredRows = tableData.filter(
    (row) =>
      row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.focus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 text-slate-800 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Top Back Navigation Button */}
        <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="home" label="Back to Home" />

        {/* Top Header / Greeting Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEURAL LEARNING PLATFORM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Hello, {childName}! ✨
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your adaptive neural speech & language learning journey is on track today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 font-bold text-xs shadow-xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>🔥 5-Day Neural Streak</span>
            </div>
          </div>
        </div>

        {/* 1. Top Metric Cards (4 Gradient Pill Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Purple Gradient */}
          <div
            onClick={() => onNavigate('book-scanner')}
            className="p-6 rounded-[28px] bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center justify-between group"
          >
            <div className="space-y-1">
              <div data-i18n="dashboard.cardPagesCount" className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('dashboard.cardPagesCount')}</div>
              <div data-i18n="dashboard.cardPagesSub" className="text-xs font-medium text-purple-100/90">{t('dashboard.cardPagesSub')}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Card 2: Blue Gradient */}
          <div
            onClick={() => onNavigate('read-listen')}
            className="p-6 rounded-[28px] bg-gradient-to-r from-blue-500 via-cyan-600 to-blue-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center justify-between group"
          >
            <div className="space-y-1">
              <div data-i18n="dashboard.cardMinsCount" className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('dashboard.cardMinsCount')}</div>
              <div data-i18n="dashboard.cardMinsSub" className="text-xs font-medium text-blue-100/90">{t('dashboard.cardMinsSub')}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Card 3: Red/Coral Gradient */}
          <div
            onClick={() => onNavigate('language-tools')}
            className="p-6 rounded-[28px] bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center justify-between group"
          >
            <div className="space-y-1">
              <div data-i18n="dashboard.cardWordsCount" className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('dashboard.cardWordsCount')}</div>
              <div data-i18n="dashboard.cardWordsSub" className="text-xs font-medium text-rose-100/90">{t('dashboard.cardWordsSub')}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Card 4: Orange Gradient */}
          <div
            onClick={() => onNavigate('neuroplay')}
            className="p-6 rounded-[28px] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center justify-between group"
          >
            <div className="space-y-1">
              <div data-i18n="dashboard.cardPtsCount" className="text-2xl sm:text-3xl font-extrabold tracking-tight">{neuroplayScore} Pts</div>
              <div data-i18n="dashboard.cardPtsSub" className="text-xs font-medium text-amber-100/90">{t('dashboard.cardPtsSub')}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* 2. Middle Row: Wave Analytics Chart (Left) + Donut Modality Chart (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Wave Analytics Card */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none space-y-6 flex flex-col justify-between">
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 data-i18n="dashboard.chartTitle" className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {t('dashboard.chartTitle')}
                </h2>
                <p data-i18n="dashboard.chartSubtitle" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('dashboard.chartSubtitle')}
                </p>
              </div>

              {/* Time Filter Controls */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-[11px] font-bold border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-center">
                {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((filter) => {
                  const filterKeyMap: Record<string, string> = {
                    DAILY: 'dashboard.tabDaily',
                    WEEKLY: 'dashboard.tabWeekly',
                    MONTHLY: 'dashboard.tabMonthly',
                    YEARLY: 'dashboard.tabYearly',
                  };
                  return (
                    <button
                      key={filter}
                      onClick={() => setGraphFilter(filter)}
                      data-i18n={filterKeyMap[filter]}
                      className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                        graphFilter === filter
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {t(filterKeyMap[filter])}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Left Stats + Right Dual Wave Chart */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Stats */}
              <div className="md:col-span-5 space-y-5 md:border-r md:border-slate-100 dark:md:border-slate-800 md:pr-4">
                <div className="space-y-1">
                  <span data-i18n="dashboard.comprehensionAccuracy" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {t('dashboard.comprehensionAccuracy')}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                    88.4%
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>↑ +4.2% from last month</span>
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span data-i18n="dashboard.totalPractices" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {t('dashboard.totalPractices')}
                  </span>
                  <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                    48 Sessions
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleDownloadReport}
                    disabled={isDownloading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95 w-full disabled:opacity-80"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : downloadNotice ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>✓ PDF Downloaded!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span data-i18n="dashboard.downloadReport">{t('dashboard.downloadReport')}</span>
                      </>
                    )}
                  </button>
                  {downloadNotice && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 animate-in fade-in flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PDF progress report saved to your Downloads!</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Dual Wave SVG Chart */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center justify-end gap-4 text-[11px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                    <span data-i18n="dashboard.legendListening" className="text-slate-600 dark:text-slate-300">{t('dashboard.legendListening')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span data-i18n="dashboard.legendSpeaking" className="text-slate-600 dark:text-slate-300">{t('dashboard.legendSpeaking')}</span>
                  </div>
                </div>

                <div className="relative w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto min-w-[380px] overflow-visible">
                    <defs>
                      <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="amberAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.20" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {[0, 25, 50, 75, 100].map((val) => {
                      const y = bottomY - (val / 100) * chartH;
                      return (
                        <g key={val}>
                          <line
                            x1={padL}
                            y1={y}
                            x2={svgW - padR}
                            y2={y}
                            stroke="currentColor"
                            className="text-slate-100 dark:text-slate-800"
                            strokeWidth="1"
                          />
                          <text
                            x={padL - 6}
                            y={y + 3}
                            textAnchor="end"
                            className="text-[9px] font-mono fill-slate-400 select-none"
                          >
                            {val}%
                          </text>
                        </g>
                      );
                    })}

                    <path d={listeningArea} fill="url(#purpleAreaGrad)" />
                    <path d={speakingArea} fill="url(#amberAreaGrad)" />

                    <path
                      d={listeningLine}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d={speakingLine}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {listeningPts.map((pt, i) => {
                      const spPt = speakingPts[i];
                      const isSelected = hoveredMonth === i;

                      return (
                        <g
                          key={i}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredIndex(i)}
                        >
                          {isSelected && (
                            <line
                              x1={pt.x}
                              y1={padT}
                              x2={pt.x}
                              y2={bottomY}
                              stroke="#8b5cf6"
                              strokeDasharray="3 3"
                              strokeWidth="1.5"
                            />
                          )}

                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isSelected ? 5 : 3.5}
                            className="fill-purple-600 stroke-white stroke-2 shadow-xs"
                          />

                          <circle
                            cx={spPt.x}
                            cy={spPt.y}
                            r={isSelected ? 5 : 3.5}
                            className="fill-amber-500 stroke-white stroke-2 shadow-xs"
                          />

                          <text
                            x={pt.x}
                            y={bottomY + 18}
                            textAnchor="middle"
                            className={`text-[10px] font-bold select-none ${
                              isSelected ? 'fill-indigo-600 dark:fill-indigo-400 font-extrabold' : 'fill-slate-400'
                            }`}
                          >
                            {pt.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Donut Modality Chart Card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none space-y-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 data-i18n="dashboard.modalityTitle" className="text-sm font-bold text-slate-900 dark:text-white">
                {t('dashboard.modalityTitle')}
              </h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Center Circular Donut Chart */}
            <div className="relative flex items-center justify-center my-2">
              <svg viewBox="0 0 160 160" className="w-44 h-44 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="16"
                />
                
                {/* Speech Therapy (45% -> Purple) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="16"
                  strokeDasharray="169.6 207.4"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Guided Listening (35% -> Yellow/Amber) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="16"
                  strokeDasharray="132.0 245.0"
                  strokeDashoffset="-169.6"
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Phonics Reading (20% -> Coral/Red) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="16"
                  strokeDasharray="75.4 301.6"
                  strokeDashoffset="-301.6"
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Donut Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                  82%
                </span>
                <span data-i18n="dashboard.overallFluency" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  {t('dashboard.overallFluency')}
                </span>
              </div>
            </div>

            {/* Bottom Legend */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span data-i18n="dashboard.speechTherapy" className="font-medium text-slate-700 dark:text-slate-300">{t('dashboard.speechTherapy')}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">45%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span data-i18n="dashboard.guidedListening" className="font-medium text-slate-700 dark:text-slate-300">{t('dashboard.guidedListening')}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">35%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span data-i18n="dashboard.phonicsReading" className="font-medium text-slate-700 dark:text-slate-300">{t('dashboard.phonicsReading')}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Sub-Metrics Row (4 Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Accuracy</div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Phoneme Accuracy: 94%
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Consistency</div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Streak Record: 5 Days
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Fluency Latency</div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Response Speed: 1.2s
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Language Level</div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Mastery Level: Advanced
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Row: Recent Milestones (Left) & Speech & Reading Sessions Table (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Bottom Left: Recent Milestones Activity Feed */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Milestones
              </h3>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Live Feed
              </span>
            </div>

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 leading-tight">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Level 3 Phonics Completed
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">15 Mins Ago</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Khushi passed sentence rhythm test
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Star className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 leading-tight">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      New Vocabulary Unlocked
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">2 Hours Ago</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    +8 complex words mastered
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 leading-tight">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      NeuroPlay Speed Record
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Yesterday</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Scored 220 pts in visual-auditory sync
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right: Speech & Reading Sessions Data Table */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Sessions Overview
              </h3>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search session..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36 sm:w-44"
                  />
                </div>
                <button className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                  <Filter className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-3">Session ID</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Clinical Focus</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.id}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                          {row.module}
                        </td>
                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                          {row.focus}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                          {row.duration}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${row.statusColor}`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                        No sessions found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Showing 1 to {filteredRows.length} of {tableData.length} entries</span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-xs">
                  {currentPage}
                </span>
                <button
                  disabled={currentPage === 3}
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Primary Action Modules Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick Practice Launchpad
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('book-scanner')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 shadow-xs hover:shadow-md transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ScanText className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">OCR Scanner</div>
                <div className="text-[10px] text-slate-500">Scan & Listen</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('read-listen')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs hover:shadow-md transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">Adaptive Reader</div>
                <div className="text-[10px] text-slate-500">Audio Scaffolds</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('language-tools')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 shadow-xs hover:shadow-md transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">Speech Lab</div>
                <div className="text-[10px] text-slate-500">Recasts & Phonics</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('neuroplay')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 shadow-xs hover:shadow-md transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">NeuroPlay</div>
                <div className="text-[10px] text-slate-500">Cognitive Games</div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};






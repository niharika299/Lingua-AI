import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingUp,
  Award,
  CheckCircle2,
  Brain,
  Activity,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Info,
  Clock,
  ArrowUpRight,
  FileSpreadsheet,
  FileText,
  Printer,
  ShieldCheck,
  User,
  Zap,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { NavPage, ChildProfile } from '../../types';
import { BackNavigationButton } from '../common/BackNavigationButton';
import { useTranslation } from '../../utils/i18n';
import {
  getDldActivityLogsAll,
  formatDateISO,
  DldTaskLogItem,
  ModalityType,
} from '../../utils/dldActivityStore';

interface DldAnalyticsProps {
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
  profile?: ChildProfile;
}

// Helper: Get Monday date for any weekOffset from REAL system date
function getMondayForOffset(offset: number): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon...
  const diffToMonday = (day === 0 ? -6 : 1 - day) + offset * 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export const DldAnalytics: React.FC<DldAnalyticsProps> = ({
  onNavigate,
  onBack,
  profile,
}) => {
  const { t } = useTranslation();
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [allLogs, setAllLogs] = useState<Record<string, DldTaskLogItem[]>>({});
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const reportContainerRef = useRef<HTMLDivElement>(null);

  // Reload logs from localStorage
  const refreshLogs = () => {
    const data = getDldActivityLogsAll();
    setAllLogs(data);
  };

  // On Mount + Listen to Live Activity Events
  useEffect(() => {
    refreshLogs();

    const handleUpdate = () => refreshLogs();
    window.addEventListener('dldDataUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('dldDataUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute 7 days for the active week based on REAL date math & weekOffset
  const weekInfo = useMemo(() => {
    const monday = getMondayForOffset(weekOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const todayIso = formatDateISO(new Date());
    let autoTodayIdx = 0;

    const days: {
      dateIso: string;
      dayName: string;
      formattedDate: string;
      isToday: boolean;
      items: DldTaskLogItem[];
      tasksCount: number;
      totalPoints: number;
      avgAccuracy: number;
      primaryModality: string;
    }[] = [];

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = formatDateISO(d);
      const isToday = iso === todayIso;
      if (isToday) autoTodayIdx = i;

      const items = allLogs[iso] || [];
      const tasksCount = items.length;
      const totalPoints = items.reduce((acc, it) => acc + (it.points || 0), 0);
      const avgAccuracy =
        tasksCount > 0
          ? Math.round(items.reduce((acc, it) => acc + (it.accuracy || 0), 0) / tasksCount)
          : 0;

      const modalityCounts: Record<string, number> = {};
      items.forEach((it) => {
        modalityCounts[it.modality] = (modalityCounts[it.modality] || 0) + 1;
      });
      let primaryModality = 'General Practice';
      let maxC = 0;
      Object.entries(modalityCounts).forEach(([m, c]) => {
        if (c > maxC) {
          maxC = c;
          primaryModality = m;
        }
      });

      const fDate = `${monthNames[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;

      days.push({
        dateIso: iso,
        dayName: dayNames[i],
        formattedDate: fDate,
        isToday,
        items,
        tasksCount,
        totalPoints,
        avgAccuracy,
        primaryModality,
      });
    }

    const startStr = days[0].formattedDate;
    const endStr = days[6].formattedDate;
    const year = monday.getFullYear();

    return {
      monday,
      sunday,
      days,
      startIso: days[0].dateIso,
      endIso: days[6].dateIso,
      rangeLabel: `${startStr} – ${endStr}, ${year}`,
      autoTodayIdx,
    };
  }, [weekOffset, allLogs]);

  // Auto select today on initial load when weekOffset === 0
  useEffect(() => {
    if (weekOffset === 0) {
      setSelectedDayIndex(weekInfo.autoTodayIdx);
    } else {
      setSelectedDayIndex(0);
    }
  }, [weekOffset, weekInfo.autoTodayIdx]);

  const selectedDay = weekInfo.days[selectedDayIndex] || weekInfo.days[0];

  // Weekly Aggregates
  const weeklyTotalTasks = weekInfo.days.reduce((acc, d) => acc + d.tasksCount, 0);
  const weeklyTotalPoints = weekInfo.days.reduce((acc, d) => acc + d.totalPoints, 0);

  const activeDaysWithTasks = weekInfo.days.filter((d) => d.tasksCount > 0);
  const weeklyAvgAccuracy =
    activeDaysWithTasks.length > 0
      ? Math.round(
          activeDaysWithTasks.reduce((acc, d) => acc + d.avgAccuracy, 0) / activeDaysWithTasks.length
        )
      : 0;

  // Compute Practice Share Modality Percentages for the Week
  const modalityShares = useMemo(() => {
    let totalItems = 0;
    const counts: Record<ModalityType, number> = {
      Vocabulary: 0,
      Phonics: 0,
      NeuroPlay: 0,
      Reading: 0,
    };

    weekInfo.days.forEach((d) => {
      d.items.forEach((it) => {
        totalItems++;
        counts[it.modality] = (counts[it.modality] || 0) + 1;
      });
    });

    if (totalItems === 0) {
      return {
        Vocabulary: 25,
        Phonics: 25,
        NeuroPlay: 25,
        Reading: 25,
        totalItems: 0,
      };
    }

    return {
      Vocabulary: Math.round((counts.Vocabulary / totalItems) * 100),
      Phonics: Math.round((counts.Phonics / totalItems) * 100),
      NeuroPlay: Math.round((counts.NeuroPlay / totalItems) * 100),
      Reading: Math.round((counts.Reading / totalItems) * 100),
      totalItems,
    };
  }, [weekInfo]);

  // Direct Download PDF Generation Engine matching exact specification
  const downloadClinicalPDFReport = async () => {
    const btn = document.getElementById('downloadPdfBtn');
    const originalText = btn ? btn.innerHTML : '📄 Download Visual Report (PDF)';
    if (btn) btn.innerHTML = '⏳ Generating PDF...';
    setIsGeneratingPdf(true);

    try {
      const jsPdfClass = (window as any).jspdf?.jsPDF || jsPDF;
      const doc = new jsPdfClass('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;

      const todayStr = new Date().toISOString().split('T')[0];
      const learnerName = profile?.name && profile.name !== 'Guest' ? profile.name : 'Learner';

      // Sanitization callback to strip oklab/oklch colors for html2canvas
      const sanitizeColors = (clonedDoc: Document) => {
        const styleElements = clonedDoc.querySelectorAll('style');
        styleElements.forEach((styleEl) => {
          if (styleEl.textContent && /okl(ab|ch)/i.test(styleEl.textContent)) {
            styleEl.textContent = styleEl.textContent.replace(/okl(ab|ch)\([^)]+\)/gi, '#4f46e5');
          }
        });
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((node) => {
          const htmlEl = node as HTMLElement;
          if (htmlEl.style && htmlEl.style.cssText && /okl(ab|ch)/i.test(htmlEl.style.cssText)) {
            htmlEl.style.cssText = htmlEl.style.cssText.replace(/okl(ab|ch)\([^)]+\)/gi, '#4f46e5');
          }
        });
      };

      // 1. HEADER & BRANDING
      doc.setFillColor(79, 70, 229); // Indigo #4f46e5
      doc.rect(margin, 12, contentWidth, 26, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.text('LINGUA AI · DLD Clinical Growth & Fluency Report', margin + 6, 21);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(224, 231, 255);
      doc.text(
        `Learner: ${learnerName} | Selected Week: ${weekInfo.rangeLabel}`,
        margin + 6,
        29
      );
      doc.text(
        `Certified Pediatric Speech-Language Analytics | Report Date: ${todayStr}`,
        margin + 6,
        34
      );

      let currentY = 44;

      // 2. WEEKLY SUMMARY KPI CAPSULES
      doc.setFillColor(248, 250, 252); // Light slate #f8fafc
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, currentY, contentWidth, 20, 'FD');

      const colW = contentWidth / 3;

      // KPI 1
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('REAL TASKS COMPLETED', margin + 6, currentY + 7);
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(`${weeklyTotalTasks} Tasks`, margin + 6, currentY + 15);

      // KPI 2
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('LIVE AVERAGE ACCURACY', margin + colW + 6, currentY + 7);
      doc.setFontSize(13);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text(`${weeklyAvgAccuracy}%`, margin + colW + 6, currentY + 15);

      // KPI 3
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('LIVE POINTS EARNED', margin + colW * 2 + 6, currentY + 7);
      doc.setFontSize(13);
      doc.setTextColor(217, 119, 6); // Amber
      doc.text(`${weeklyTotalPoints} XP`, margin + colW * 2 + 6, currentY + 15);

      currentY += 26;

      // 3. PRACTICE SHARE MODALITY BREAKDOWN
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Practice Share Modality Breakdown', margin, currentY);
      currentY += 4;

      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 14, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);

      const modW = contentWidth / 4;
      doc.text(`Vocabulary: ${modalityShares.Vocabulary}%`, margin + 4, currentY + 8.5);
      doc.text(`Phonics: ${modalityShares.Phonics}%`, margin + modW + 4, currentY + 8.5);
      doc.text(`NeuroPlay: ${modalityShares.NeuroPlay}%`, margin + modW * 2 + 4, currentY + 8.5);
      doc.text(`Reading: ${modalityShares.Reading}%`, margin + modW * 3 + 4, currentY + 8.5);

      currentY += 19;

      // 4. 7-DAY VISUAL ACCURACY & POINTS TREND CHART
      const barChartEl = document.getElementById('dldBarChart');
      if (barChartEl) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(30, 41, 59);
        doc.text('7-Day Live Accuracy & Points Trend', margin, currentY);
        currentY += 4;

        try {
          let barImg: string | null = null;
          if (barChartEl instanceof HTMLCanvasElement) {
            barImg = barChartEl.toDataURL('image/png', 1.0);
          } else {
            const barCanvas = await html2canvas(barChartEl as HTMLElement, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff',
              logging: false,
              onclone: sanitizeColors,
            });
            barImg = barCanvas.toDataURL('image/png', 0.95);
          }

          if (barImg) {
            const chartHeight = 50;
            doc.addImage(barImg, 'PNG', margin, currentY, contentWidth, chartHeight);
            currentY += chartHeight + 8;
          }
        } catch (e) {
          console.warn('Chart capture warning, continuing with PDF table:', e);
        }
      }

      // 5. 7-DAY BREAKDOWN TABLE
      if (currentY > 230) {
        doc.addPage();
        currentY = 15;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`Weekly Day-by-Day Performance (${weekInfo.rangeLabel})`, margin, currentY);
      currentY += 5;

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);

      const colX = [margin + 3, margin + 35, margin + 70, margin + 105, margin + 140];
      doc.text('DATE / DAY', colX[0], currentY + 4.8);
      doc.text('TASKS LOGGED', colX[1], currentY + 4.8);
      doc.text('AVG ACCURACY', colX[2], currentY + 4.8);
      doc.text('POINTS EARNED', colX[3], currentY + 4.8);
      doc.text('PRIMARY MODALITY', colX[4], currentY + 4.8);
      currentY += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      weekInfo.days.forEach((dayItem, idx) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 15;
        }

        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, currentY, contentWidth, 6.5, 'F');
        }

        doc.setTextColor(51, 65, 85);
        const dayLabel = `${dayItem.dayName} (${dayItem.formattedDate})`;
        doc.text(dayLabel, colX[0], currentY + 4.5);
        doc.text(`${dayItem.tasksCount} Tasks`, colX[1], currentY + 4.5);
        doc.text(`${dayItem.avgAccuracy}%`, colX[2], currentY + 4.5);
        doc.text(`+${dayItem.totalPoints} XP`, colX[3], currentY + 4.5);
        doc.text(dayItem.primaryModality, colX[4], currentY + 4.5);
        currentY += 6.5;
      });

      // 6. SELECTED DAY SESSIONS DETAIL LOG
      if (selectedDay && selectedDay.items.length > 0) {
        currentY += 4;
        if (currentY > 240) {
          doc.addPage();
          currentY = 15;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(`Selected Day Logs: ${selectedDay.dayName}, ${selectedDay.formattedDate}`, margin, currentY);
        currentY += 5;

        selectedDay.items.forEach((item) => {
          if (currentY > 275) {
            doc.addPage();
            currentY = 15;
          }
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(71, 85, 105);
          doc.text(
            `• [${item.timeStr || 'Log'}] ${item.taskName} (${item.modality}): ${item.accuracy}% Accuracy, +${item.points} XP`,
            margin + 3,
            currentY
          );
          currentY += 4.5;
        });
      }

      // 7. FOOTER
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Certified Lingua AI Pediatric Speech-Language Analytics · Non-Diagnostic Protocol', margin, 288);

      // 8. DIRECT DOWNLOAD FILE
      doc.save(`LinguaAI_DLD_Report_${todayStr}.pdf`);
    } catch (error: any) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed: ' + (error?.message || error));
    } finally {
      setIsGeneratingPdf(false);
      if (btn) btn.innerHTML = originalText;
    }
  };

  // CSV Export Engine
  const handleExportCsv = () => {
    const headers = ['Date', 'Day', 'Tasks_Completed', 'Average_Accuracy_Percent', 'Points_Earned', 'Primary_Focus_Area'];
    const rows = weekInfo.days.map((d) => [
      d.dateIso,
      d.dayName,
      d.tasksCount,
      `${d.avgAccuracy}%`,
      d.totalPoints,
      `"${d.primaryModality}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileName = `DLD_Weekly_Report_${weekInfo.startIso}_to_${weekInfo.endIso}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="dld-section" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300 min-h-screen bg-slate-50 text-slate-800">
      {/* Back Navigation Button */}
      <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="home" label="Back to Home" />

      {/* Printable Report Wrapper Container */}
      <div id="dldExportableReport" ref={reportContainerRef} className="p-4 sm:p-6 rounded-3xl bg-slate-50 space-y-8">
        {/* Clinical Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 bg-white p-6 rounded-3xl shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>LIVE DLD CLINICAL ANALYTICS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              DLD Clinical Growth & Fluency Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Real-time developmental speech metrics, live session accuracy, and automated clinical record tracking for{' '}
              <strong className="text-indigo-700">{profile?.name || 'Learner'}</strong>.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-auto">
            <button
              id="downloadPdfBtn"
              type="button"
              data-action="download-pdf"
              onClick={downloadClinicalPDFReport}
              disabled={isGeneratingPdf}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-105 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>{isGeneratingPdf ? '⏳ Generating Visual PDF...' : '📄 Download Visual Report (PDF)'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* 1. DYNAMIC REAL-TIME CALENDAR DATE NAVIGATOR */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <button
            type="button"
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-2 transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>◀ Prev Week</span>
          </button>

          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <span>Week: </span>
            <span id="dldActiveWeekRange">{weekInfo.rangeLabel}</span>
            {weekOffset === 0 && (
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                Current Live Week
              </span>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-center">
            {weekOffset !== 0 && (
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs cursor-pointer shadow-xs hover:bg-indigo-700 flex items-center gap-1"
              >
                <span>Today</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-2 transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>Next Week ▶</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekly Summary Metric Capsules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-indigo-50/80 border border-indigo-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
              🎯
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Real Tasks Completed</div>
              <div className="text-2xl font-black text-slate-900">{weeklyTotalTasks} Tasks</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
              📈
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Average Accuracy</div>
              <div className="text-2xl font-black text-emerald-900">{weeklyAvgAccuracy}%</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
              ⚡
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Points Earned</div>
              <div className="text-2xl font-black text-slate-900">{weeklyTotalPoints} XP</div>
            </div>
          </div>
        </div>

        {/* 2. DYNAMIC VISUAL PROGRESS CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: 7-Day Interactive Accuracy & Points Bar/Line Chart */}
          <div id="dldBarChart" className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span>7-Day Live Accuracy & Points Trend</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Click or tap any day bar to view logged clinical activities.</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Dynamic Real Data
              </span>
            </div>

            {/* Interactive Bar Chart Visualization */}
            <div className="space-y-4">
              <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-slate-200 pb-2">
                {weekInfo.days.map((item, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  const hasTasks = item.tasksCount > 0;
                  const heightPct = hasTasks ? Math.max(15, item.avgAccuracy) : 8;

                  return (
                    <div
                      key={item.dateIso}
                      onClick={() => setSelectedDayIndex(idx)}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                    >
                      {/* Points Tag on Top */}
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border ${
                          hasTasks
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : 'text-slate-400 bg-slate-100 border-slate-200'
                        }`}
                      >
                        +{item.totalPoints}
                      </span>

                      {/* Bar Container */}
                      <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl h-full flex items-end p-1 relative overflow-hidden">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-t from-indigo-600 to-indigo-500 shadow-md scale-105'
                              : hasTasks
                              ? 'bg-gradient-to-t from-indigo-300 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-600'
                              : 'bg-slate-300'
                          }`}
                        />
                      </div>

                      {/* Day & Date Label */}
                      <div className="text-center">
                        <div className={`text-xs font-black ${item.isToday ? 'text-indigo-600 underline' : 'text-slate-700'}`}>
                          {item.dayName} {item.isToday && '⭐'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold">{item.formattedDate.split(' ')[1]}</div>
                        <div className={`text-[10px] font-extrabold ${hasTasks ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {hasTasks ? `${item.avgAccuracy}%` : '0%'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Selected Day Summary Badge */}
              <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-indigo-950 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                    {selectedDay.dayName}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold flex items-center gap-2">
                      <span>{selectedDay.dayName}, {selectedDay.formattedDate} Summary</span>
                      {selectedDay.isToday && (
                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase">Today</span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-700">
                      <strong>{selectedDay.tasksCount} Tasks Logged</strong> · <strong>{selectedDay.totalPoints} XP</strong> ·{' '}
                      <strong>{selectedDay.avgAccuracy}% Avg Accuracy</strong>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
                  Primary Modality: {selectedDay.primaryModality}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Practice Share Donut Ring Chart */}
          <div id="dldPieChart" className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-indigo-600" />
                <span>Practice Share Modality</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Live Weekly Share</span>
            </div>

            {/* Visual Donut Ring Representation */}
            <div className="flex flex-col items-center justify-center space-y-4 my-2">
              <div className="relative w-40 h-40 rounded-full border-[14px] border-indigo-500 flex items-center justify-center shadow-inner bg-slate-50">
                <div className="absolute inset-0 rounded-full border-[14px] border-emerald-400 border-t-transparent border-r-transparent border-b-transparent transform rotate-45" />
                <div className="absolute inset-0 rounded-full border-[14px] border-amber-400 border-t-transparent border-r-transparent border-l-transparent transform -rotate-45" />
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-900">{modalityShares.totalItems}</div>
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase">Sessions Logged</div>
                </div>
              </div>

              {/* Category Share Legend */}
              <div className="w-full space-y-2 text-xs font-bold">
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-100">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span>Vocabulary & Naming</span>
                  </span>
                  <span>{modalityShares.Vocabulary}%</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 text-rose-900 border border-rose-100">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span>Phonics & Articulation</span>
                  </span>
                  <span>{modalityShares.Phonics}%</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-100">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
                    <span>NeuroPlay Games</span>
                  </span>
                  <span>{modalityShares.NeuroPlay}%</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-50 text-cyan-900 border border-cyan-100">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" />
                    <span>Reading & Book Lens</span>
                  </span>
                  <span>{modalityShares.Reading}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SELECTED DAY CLINICAL SESSIONS LOG TABLE */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Selected Day Completed Activity Logs ({selectedDay.formattedDate})</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {selectedDay.items.length} {selectedDay.items.length === 1 ? 'Session' : 'Sessions'} Logged
            </span>
          </div>

          {selectedDay.items.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-extrabold text-slate-700">No activities logged for {selectedDay.formattedDate}</div>
              <p className="text-xs text-slate-500">
                Complete a NeuroPlay game, Word Detective activity, or Book Scan to log real results!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Time</th>
                    <th className="p-3.5">Task / Activity Title</th>
                    <th className="p-3.5">Modality Domain</th>
                    <th className="p-3.5">Accuracy %</th>
                    <th className="p-3.5 rounded-r-xl">Points Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {selectedDay.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-500">{item.timeStr || '10:00 AM'}</td>
                      <td className="p-3.5 font-extrabold text-slate-900">{item.taskName}</td>
                      <td className="p-3.5 font-bold">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {item.modality}
                        </span>
                      </td>
                      <td className="p-3.5 font-extrabold text-emerald-600">{item.accuracy}%</td>
                      <td className="p-3.5 font-black text-amber-600">+{item.points} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stamp & Certification Area for PDF export */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-semibold gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Lingua AI Pediatric Speech-Language Analytics</span>
            </div>
            <div>
              Learner ID: <strong className="text-slate-800">LNG-DLD-2026-0811</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

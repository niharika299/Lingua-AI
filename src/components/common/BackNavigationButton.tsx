import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { NavPage } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface BackNavigationButtonProps {
  onBack?: () => void;
  onNavigate?: (page: NavPage) => void;
  targetPage?: NavPage;
  label?: string;
  className?: string;
}

export const BackNavigationButton: React.FC<BackNavigationButtonProps> = ({
  onBack,
  onNavigate,
  targetPage = 'home',
  label,
  className = '',
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate(targetPage);
    }
  };

  const defaultText =
    targetPage === 'dashboard'
      ? t('common.backToDashboard') || 'Back to Dashboard'
      : t('common.backToHome') || 'Back to Home';
  const displayLabel = label || defaultText;

  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className="back-nav-btn group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
        title="Go back (Esc)"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:-translate-x-1" />
        <span>← {displayLabel}</span>
      </button>
    </div>
  );
};

import React from 'react';
import { Logo } from './Logo';
import { NavPage } from '../../types';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md text-[#64748B] dark:text-slate-400 pb-16 lg:pb-10 pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200/80 dark:border-slate-800/80">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <Logo size="md" showTagline />
            <p data-i18n="footer.mission" className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed pt-1">
              {t('footer.mission')}
            </p>
            <div className="pt-2 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span data-i18n="footer.clinicalPrinciples">{t('footer.clinicalPrinciples')}</span>
            </div>
          </div>

          {/* Column 2: Tools & Features */}
          <div>
            <h4 data-i18n="footer.colTools" className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              {t('footer.colTools')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#64748B] dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('read-listen')}
                  data-i18n="footer.linkReadListen"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left font-medium"
                >
                  {t('footer.linkReadListen')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('book-scanner')}
                  data-i18n="footer.linkScanner"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left font-medium"
                >
                  {t('footer.linkScanner')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('language-tools')}
                  data-i18n="footer.linkTools"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left font-medium"
                >
                  {t('footer.linkTools')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('neuroplay')}
                  data-i18n="footer.linkNeuroplay"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left font-medium"
                >
                  {t('footer.linkNeuroplay')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Support */}
          <div>
            <h4 data-i18n="footer.colCommunity" className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              {t('footer.colCommunity')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#64748B] dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  data-i18n="footer.linkDashboard"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left font-medium"
                >
                  {t('footer.linkDashboard')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('progress')}
                  data-i18n="footer.linkProgress"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left font-medium"
                >
                  {t('footer.linkProgress')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('community')}
                  data-i18n="footer.linkSpecialists"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left font-medium"
                >
                  {t('footer.linkSpecialists')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  data-i18n="footer.linkAbout"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left font-medium"
                >
                  {t('footer.linkAbout')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Ethical Notice Box */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span data-i18n="footer.ethicalNoticeTitle">{t('footer.ethicalNoticeTitle')}</span>
            </div>
            <p data-i18n="footer.ethicalNoticeText" className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed">
              {t('footer.ethicalNoticeText')}
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] dark:text-slate-400 gap-4">
          <div className="text-center sm:text-left font-medium">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium">
            <button onClick={() => onNavigate('about')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {t('footer.linkClinical')}
            </button>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <button onClick={() => onNavigate('settings')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {t('footer.linkAccessibility')}
            </button>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {t('footer.linkPrivacy')}
            </button>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <button onClick={() => onNavigate('community')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {t('footer.linkContact')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};



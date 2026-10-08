import React from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md border border-slate-700 animate-slide-up">
      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span>Offline Mode Active — Core UI & Translations cached via Workbox.</span>
    </div>
  );
};

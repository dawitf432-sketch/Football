import React from 'react';
import { useOnlineStatus } from '../../lib/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-sm bg-amber-500/90 text-black px-3.5 py-2 text-xs font-bold shadow-xl border border-amber-400 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
      <WifiOff className="w-4 h-4 text-black" />
      <span>Offline Mode — Cached drills and dossier are active.</span>
    </div>
  );
};

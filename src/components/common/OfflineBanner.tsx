import React from "react";
import { WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { useOfflineStatus } from "../../lib/offlineSync";

export default function OfflineBanner() {
  const { isOffline, queueCount, isSyncing, syncNotice, triggerManualSync } = useOfflineStatus();

  if (!isOffline && !syncNotice && !isSyncing) {
    return null;
  }

  if (syncNotice) {
    return (
      <div className="bg-[#00ff88]/15 border-b border-[#00ff88]/40 px-4 py-2 text-center text-xs font-mono font-bold text-[#00ff88] flex items-center justify-center gap-2 sticky top-0 z-[100] backdrop-blur-md transition-all">
        <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
        <span>{syncNotice}</span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="bg-[#00d4ff]/15 border-b border-[#00d4ff]/40 px-4 py-2 text-center text-xs font-mono font-bold text-[#00d4ff] flex items-center justify-center gap-2 sticky top-0 z-[100] backdrop-blur-md">
        <RefreshCw className="w-4 h-4 text-[#00d4ff] animate-spin" />
        <span>Synchronizing offline updates with cloud database...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#ffaa00]/15 border-b border-[#ffaa00]/40 px-4 py-2 text-center text-xs font-mono font-bold text-[#ffaa00] flex items-center justify-center gap-2.5 sticky top-0 z-[100] backdrop-blur-md">
      <WifiOff className="w-4 h-4 text-[#ffaa00]" />
      <span>Offline Mode Active • Training catalog & local progress cached</span>
      {queueCount > 0 && (
        <span className="bg-[#ffaa00]/30 px-2 py-0.5 rounded-sm text-[10px] text-white">
          {queueCount} update{queueCount > 1 ? "s" : ""} pending sync
        </span>
      )}
      <button
        onClick={triggerManualSync}
        className="ml-2 underline text-[11px] hover:text-white cursor-pointer"
      >
        Retry Sync
      </button>
    </div>
  );
}

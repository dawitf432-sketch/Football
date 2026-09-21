import React, { useState } from 'react';
import { usePWAInstall } from '../../lib/usePWAInstall';
import { Download, Smartphone, X, Share2, PlusSquare, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'compact' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'navbar',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledNotice(true);
        setTimeout(() => setInstalledNotice(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // Only render if installable or on iOS
  if (!isInstallable && !isIOS && !installedNotice) {
    return null;
  }

  if (installedNotice) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff88]/20 border border-[#00ff88]/40 text-[#00ff88] text-xs font-bold rounded-sm">
        <Check className="w-3.5 h-3.5" /> Installed
      </div>
    );
  }

  return (
    <>
      {variant === 'banner' ? (
        <div className={`p-4 bg-gradient-to-r from-[#071329] to-[#0a1c38] border border-[#00ff88]/30 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold uppercase text-white tracking-wide">Install Pro Football Class App</div>
              <div className="text-xs text-gray-400">Add to home screen for offline training access, push briefs, and zero browser frame.</div>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-4 py-2 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            {isIOS ? 'Install on iOS' : 'Install PWA'}
          </button>
        </div>
      ) : variant === 'compact' ? (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00ff88]/40 text-xs font-bold text-gray-300 hover:text-white rounded-sm transition-all cursor-pointer ${className}`}
          title="Install Web App"
        >
          <Download className="w-3.5 h-3.5 text-[#00ff88]" />
          <span>App</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00ff88]/40 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-all cursor-pointer ${className}`}
          title="Install Progressive Web App"
        >
          <Download className="w-3.5 h-3.5 text-[#00ff88]" />
          <span>{isIOS ? 'Install App' : 'Get App'}</span>
        </button>
      )}

      {/* iOS Safari Guided Install Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-sm bg-[#0a0f1d] border border-white/20 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold uppercase text-white tracking-wide">Install on iOS</h3>
                <p className="text-[11px] text-gray-400">Run Pro Football Class from your Home Screen</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-300 bg-white/5 p-4 rounded-sm border border-white/10">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 text-[#00ff88]">1</div>
                <div>Tap the <strong className="text-white">Share</strong> icon <Share2 className="w-3.5 h-3.5 inline text-[#00b8ff] mx-0.5" /> in Safari's bottom toolbar.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 text-[#00ff88]">2</div>
                <div>Scroll down and select <strong className="text-white">Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-[#00ff88] mx-0.5" />.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 text-[#00ff88]">3</div>
                <div>Tap <strong className="text-white">Add</strong> at top right to launch full-screen.</div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

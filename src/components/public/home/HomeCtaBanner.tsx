import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Key, Download } from "lucide-react";
import { PWAInstallButton } from "../../common/PWAInstallButton";

export default function HomeCtaBanner() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#02050e] to-[#050a1c] border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#00ff88]/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center p-8 sm:p-12 rounded-sm bg-[#050a1a] border border-[#00ff88]/30 shadow-[0_0_50px_rgba(0,255,136,0.08)]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-white/5 border border-white/10 text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
          <span>Professional Talent Development & Scouting Gateway</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-mono mb-4 leading-tight">
          Step Onto The Professional Football Pathway
        </h2>

        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Whether you are an aspiring athlete aiming for European academies, a UEFA coach managing team rosters, or an accredited club scout inspecting verified match film — Pro Football Class is your unified platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/access"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-mono text-xs uppercase font-black tracking-wider transition-all shadow-[0_0_25px_rgba(0,255,136,0.3)]"
          >
            <Key className="w-4 h-4 text-black" />
            <span>Activate Access Key / Login</span>
          </Link>

          <PWAInstallButton
            variant="button"
            className="w-full sm:w-auto border-white/20 hover:border-[#00d4ff] text-white"
          />

          <Link
            to="/academy"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-sm bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 font-mono text-xs uppercase font-bold tracking-wider transition-all"
          >
            <span>Explore 5 Pillars</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00ff88]" />
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>
            <span>FIFA Safeguarding Compliant</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"></span>
            <span>Offline-Ready PWA Application</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>
            <span>Encrypted Video Pipeline</span>
          </span>
        </div>
      </div>
    </section>
  );
}

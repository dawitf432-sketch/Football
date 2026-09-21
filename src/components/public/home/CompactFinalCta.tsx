import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Key } from "lucide-react";
import { PWAInstallButton } from "../../common/PWAInstallButton";

export default function CompactFinalCta() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#02050e] to-[#040817] border-b border-white/10">
      <div className="max-w-3xl mx-auto text-center p-6 sm:p-8 rounded-sm bg-[#050a1a] border border-[#00ff88]/30 shadow-[0_0_35px_rgba(0,255,136,0.06)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3 h-3 text-[#00ff88]" />
          <span>Accredited Pathway Portal</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono mb-2">
          Step Onto The Professional Pathway
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mb-6">
          Access UEFA certified training drills, upload verified match footage, and connect directly with accredited club scouts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
          <Link
            to="/access"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-mono font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,255,136,0.25)] active:scale-95"
          >
            <Key className="w-3.5 h-3.5 text-black" />
            <span>Get Started</span>
          </Link>

          <PWAInstallButton
            variant="button"
            className="w-full sm:w-auto border-white/20 hover:border-[#00d4ff] text-white"
          />
        </div>
      </div>
    </section>
  );
}

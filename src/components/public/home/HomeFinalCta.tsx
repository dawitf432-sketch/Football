import { Link } from "react-router-dom";
import { ArrowRight, Key, ShieldCheck } from "lucide-react";
import { PWAInstallButton } from "../../common/PWAInstallButton";

export default function HomeFinalCta() {
  return (
    <section className="py-12 md:py-16 bg-[#02050e] border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-6 sm:p-10 rounded-sm bg-[#050a1a] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3 h-3 text-[#00ff88]" />
            <span>Join Pro Football Class</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white font-mono mb-3">
            Ready to Accelerate Your Development?
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mb-7 leading-relaxed">
            Activate your athlete access key, execute certified UEFA academy micro-cycles, and build a verified developmental track record.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
            <Link
              to="/access"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,255,136,0.25)]"
            >
              <Key className="w-3.5 h-3.5 text-black" />
              <span>Get Started</span>
            </Link>

            <PWAInstallButton
              variant="button"
              className="w-full sm:w-auto border-white/20 hover:border-[#00d4ff] text-white"
            />
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-5 text-[11px] font-mono text-gray-400">
            <span>UEFA & FIFA Benchmark</span>
            <span>•</span>
            <span>Offline-Ready PWA</span>
            <span>•</span>
            <span>Direct Scout Access</span>
          </div>
        </div>
      </div>
    </section>
  );
}

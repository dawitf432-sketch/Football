import { Link } from "react-router-dom";
import { ArrowRight, Key, ShieldCheck } from "lucide-react";
import { PWAInstallButton } from "../../common/PWAInstallButton";

export default function HomeFinalCta() {
  return (
    <section className="py-16 md:py-24 bg-[#0a0f1d] border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#11182c] border border-slate-800 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Join Pro Football Class</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-white font-display tracking-tight mb-3">
            Ready to Accelerate Your Development?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Activate your athlete access key, execute certified UEFA academy micro-cycles, and build a verified developmental track record.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
            <Link
              to="/access"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>Get Started</span>
            </Link>

            <PWAInstallButton
              variant="button"
              className="w-full sm:w-auto border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs uppercase tracking-wider"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              UEFA Academy Benchmark
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Offline-Ready PWA
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Direct Club Scouting
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

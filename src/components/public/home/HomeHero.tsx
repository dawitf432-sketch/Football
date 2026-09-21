import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, ChevronRight, Award, Compass, Users } from "lucide-react";
import { BrandLogo } from "../../common/BrandLogo";

interface HomeHeroProps {
  stats?: {
    trainingDrills: number;
    verifiedAthletes: number;
    certifiedCoaches: number;
    accreditedScouts: number;
  };
}

export default function HomeHero({ stats }: HomeHeroProps) {
  const data = stats || {
    trainingDrills: 260,
    verifiedAthletes: 280,
    certifiedCoaches: 42,
    accreditedScouts: 19,
  };

  return (
    <section className="relative pt-24 md:pt-32 pb-14 md:pb-20 bg-[#0a0f1d] border-b border-slate-800/80 overflow-hidden">
      {/* Refined subtle ambient spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Official Accreditation Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 mb-6 shadow-sm">
            <BrandLogo size="sm" showSubtitle={false} />
            <span className="h-3 w-px bg-slate-700"></span>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              UEFA & FIFA Academy Benchmark
            </span>
          </div>

          {/* Main Headline - High-End Athletic Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight font-display leading-[1.1] mb-5">
            Elite Football Development{" "}
            <span className="text-emerald-400 block sm:inline">
              & Scouting Network
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
            A unified digital academy providing structured European-standard drills, physical performance tracking, and direct connectivity between rising talent, certified coaches, and accredited club scouts.
          </p>

          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-12">
            <Link
              to="/access"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/academy"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 font-semibold text-xs uppercase tracking-wider border border-slate-700 transition-colors"
            >
              <span>Explore Curriculum</span>
            </Link>
          </div>

          {/* Responsive 4-Item Stats Bar with Refined Contrast */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-[#11182c] border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {data.trainingDrills}+
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Academy Drills
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#11182c] border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">
                {data.verifiedAthletes}+
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Verified Athletes
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#11182c] border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-display">
                {data.certifiedCoaches}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                UEFA Coaches
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#11182c] border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">
                {data.accreditedScouts}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Scout Network
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

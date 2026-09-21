import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
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
    <section className="relative pt-24 md:pt-28 pb-12 md:pb-16 bg-[#030611] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo & Category Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 mb-5">
            <BrandLogo size="sm" showSubtitle={false} />
            <span className="h-3 w-px bg-white/20"></span>
            <span className="text-[11px] font-mono font-bold text-[#00ff88] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
              UEFA & FIFA Benchmark
            </span>
          </div>

          {/* Main Headline - Clean, responsive typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-mono tracking-tight leading-tight mb-4">
            Elite Football Development{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00f0ff] to-[#00b8ff]">
              & Scouting Network
            </span>
          </h1>

          {/* Short Description */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto mb-7">
            A unified digital academy providing structured UEFA-standard drills, physical performance tracking, and direct connectivity between talent, coaches, and accredited club scouts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-10">
            <Link
              to="/access"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,255,136,0.25)]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>

            <Link
              to="/academy"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-wider border border-white/15 transition-all hover:border-[#00d4ff]/40"
            >
              <span>Explore Academy</span>
            </Link>
          </div>

          {/* Responsive 4-Item Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
            <div className="p-3 rounded-sm bg-[#050a1a] border border-white/5 text-center">
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {data.trainingDrills}+
              </div>
              <div className="text-[11px] font-mono text-gray-400 uppercase mt-0.5">
                Academy Drills
              </div>
            </div>

            <div className="p-3 rounded-sm bg-[#050a1a] border border-white/5 text-center">
              <div className="text-xl sm:text-2xl font-black text-[#00ff88] font-mono">
                {data.verifiedAthletes}+
              </div>
              <div className="text-[11px] font-mono text-gray-400 uppercase mt-0.5">
                Verified Athletes
              </div>
            </div>

            <div className="p-3 rounded-sm bg-[#050a1a] border border-white/5 text-center">
              <div className="text-xl sm:text-2xl font-black text-[#00d4ff] font-mono">
                {data.certifiedCoaches}
              </div>
              <div className="text-[11px] font-mono text-gray-400 uppercase mt-0.5">
                UEFA Coaches
              </div>
            </div>

            <div className="p-3 rounded-sm bg-[#050a1a] border border-white/5 text-center">
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {data.accreditedScouts}
              </div>
              <div className="text-[11px] font-mono text-gray-400 uppercase mt-0.5">
                Scout Network
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

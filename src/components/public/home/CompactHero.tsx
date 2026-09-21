import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { BrandLogo } from "../../common/BrandLogo";

interface CompactHeroProps {
  stats?: {
    trainingDrills: number;
    verifiedAthletes: number;
    certifiedCoaches: number;
    accreditedScouts: number;
  };
}

export default function CompactHero({ stats }: CompactHeroProps) {
  const defaultStats = stats || {
    trainingDrills: 260,
    verifiedAthletes: 280,
    certifiedCoaches: 42,
    accreditedScouts: 19,
  };

  return (
    <section className="relative pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#030611] border-b border-white/10">
      {/* Background Subtle Stadium Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#00ff88]/15 via-[#00d4ff]/10 to-transparent blur-3xl opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Brand Crest & Verification Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
          <BrandLogo size="sm" showSubtitle={false} />
          <span className="h-3 w-px bg-white/20"></span>
          <span className="text-[11px] font-mono font-bold text-[#00ff88] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
            UEFA & FIFA Compliant
          </span>
        </div>

        {/* Strong Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-mono leading-[1.08] mb-4">
          The Pathway To{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00f0ff] to-[#00b8ff] drop-shadow-[0_0_30px_rgba(0,255,136,0.3)]">
            Professional Football
          </span>
        </h1>

        {/* Short Subtitle */}
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-7 font-sans">
          Structured UEFA curriculum, authenticated match film evaluation, and verified club scout discovery in one unified sports-tech platform.
        </p>

        {/* CTAs: Get Started & Explore Academy */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
          <Link
            to="/access"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-mono font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,255,136,0.3)] active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>

          <Link
            to="/academy"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-wider border border-white/15 transition-all hover:border-[#00d4ff]/40"
          >
            <span>Explore Academy</span>
          </Link>
        </div>

        {/* Compact Key Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto pt-5 border-t border-white/10">
          <div className="p-2.5 rounded-sm bg-black/30 border border-white/5">
            <div className="text-lg sm:text-xl font-black text-white font-mono">{defaultStats.trainingDrills}+</div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Academy Drills</div>
          </div>
          <div className="p-2.5 rounded-sm bg-black/30 border border-white/5">
            <div className="text-lg sm:text-xl font-black text-[#00ff88] font-mono">{defaultStats.verifiedAthletes}+</div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Verified Athletes</div>
          </div>
          <div className="p-2.5 rounded-sm bg-black/30 border border-white/5">
            <div className="text-lg sm:text-xl font-black text-[#00d4ff] font-mono">{defaultStats.certifiedCoaches}</div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">UEFA Coaches</div>
          </div>
          <div className="p-2.5 rounded-sm bg-black/30 border border-white/5">
            <div className="text-lg sm:text-xl font-black text-white font-mono">{defaultStats.accreditedScouts}</div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Scout Network</div>
          </div>
        </div>
      </div>
    </section>
  );
}

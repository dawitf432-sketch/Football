import { Link } from "react-router-dom";
import { ArrowRight, Play, Shield, Sparkles, TrendingUp, Award, Users, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

interface HeroSectionProps {
  stats?: {
    trainingDrills: number;
    verifiedAthletes: number;
    certifiedCoaches: number;
    accreditedScouts: number;
    activeScholars: number;
  };
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const { t } = useLanguage();

  const handleExploreClick = () => {
    const el = document.getElementById("academy");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#03060f]"
    >
      {/* Background Graphic Elements & Dynamic Glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top cyan/emerald spotlight radial gradients */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#00ff88]/15 via-[#00b8ff]/10 to-transparent blur-3xl opacity-60"></div>
        {/* Subtle Pitch Grass Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        {/* Football stadium floodlight accent */}
        <div className="absolute -top-40 right-[-10%] w-[500px] h-[500px] bg-[#00ff88]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00b8ff]/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Copy & CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-white/90 text-xs font-mono font-semibold tracking-wider mb-6 shadow-inner backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-[1.02] mb-6 font-mono">
              <span>{t.hero.headlineStart}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00f0ff] to-[#00b8ff] drop-shadow-[0_0_35px_rgba(0,255,136,0.3)]">
                {t.hero.headlineHighlight}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed mb-8 sm:mb-10 text-balance">
              {t.hero.subheadline}
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12">
              <Link
                to="/access"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,255,136,0.35)] hover:shadow-[0_0_35px_rgba(0,255,136,0.55)] active:scale-95"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <button
                onClick={handleExploreClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-sm bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-sm sm:text-base uppercase tracking-wider transition-all cursor-pointer hover:border-white/30 active:scale-95"
              >
                <span>{t.hero.secondaryCta}</span>
                <Play className="w-4 h-4 text-[#00b8ff] fill-current" />
              </button>
            </div>

            {/* Key Assurance Features List */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#00ff88]" /> Verified UEFA Curriculum
              </span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#00ff88]" /> Anti-Scam Scout Network
              </span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#00ff88]" /> FIFA Child Protection Standard
              </span>
            </div>
          </div>

          {/* Football-Tech Interactive Hero Graphic & Real-Time Metrics (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Surrounding Tech Glow border */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#0e172a] to-[#080d1a] border border-white/10 p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Football match visualization banner */}
                <div className="relative h-56 rounded-xl overflow-hidden mb-6 border border-white/10 group">
                  <img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop"
                    alt="Pro Football Player Training"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/40 to-transparent"></div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono font-bold text-[#00ff88] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping"></span>
                    LIVE TALENT RADAR
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#00ff88] text-black font-black flex items-center justify-center text-xs">
                        94
                      </div>
                      <div>
                        <div className="font-bold">Elite Pathway Matchday</div>
                        <div className="text-[10px] text-gray-400">Scouted & Benchmark Recorded</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-[#00b8ff]/20 text-[#00b8ff] border border-[#00b8ff]/30 px-2 py-0.5 rounded-sm">
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* 4 Interactive KPI Tickers */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-lg bg-black/50 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="text-2xl font-black text-white font-mono flex items-center gap-1.5">
                      {stats?.trainingDrills ?? 260}+
                      <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {t.hero.statTraining}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-black/50 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="text-2xl font-black text-[#00ff88] font-mono flex items-center gap-1.5">
                      {stats?.verifiedAthletes ?? 280}+
                      <Users className="w-4 h-4 text-[#00b8ff]" />
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {t.hero.statDevelopment}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-black/50 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="text-2xl font-black text-white font-mono flex items-center gap-1.5">
                      {stats?.certifiedCoaches ?? 42}+
                      <Award className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {t.hero.statCoaches}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-black/50 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="text-2xl font-black text-[#00b8ff] font-mono flex items-center gap-1.5">
                      {stats?.activeScholars ?? 8}
                      <Sparkles className="w-4 h-4 text-[#00ff88]" />
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {t.hero.statScouts}
                    </div>
                  </div>
                </div>

                {/* Quick Access ID Direct link notice */}
                <div className="p-3 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">Have your official Access ID?</span>
                  <Link
                    to="/access"
                    className="text-[#00ff88] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Activate Now <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

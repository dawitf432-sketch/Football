import { Link } from "react-router-dom";
import { ArrowRight, Video, Compass, Gauge, ChevronRight } from "lucide-react";

export default function HomeDevelopmentOverview() {
  const areas = [
    {
      title: "Video-Analyzed Technical Drills",
      category: "260+ DRILLS & SESSIONS",
      icon: Video,
      desc: "Structured micro-cycles covering tight-space ball control, first-touch variations, directional turns, and striking technique with step-by-step coaching cues.",
      link: "/training",
      linkText: "Browse Training Library",
      badgeColor: "text-[#00ff88]",
      tag: "TECHNICAL",
    },
    {
      title: "Position-Specific Intelligence",
      category: "ALL 4 PITCH ZONES",
      icon: Compass,
      desc: "Tailored tactical modules designed for Goalkeepers, Center-Backs, Full-Backs, Central Midfielders, Wingers, and Strikers facing modern match scenarios.",
      link: "/positions",
      linkText: "Explore Position Profiles",
      badgeColor: "text-[#00d4ff]",
      tag: "TACTICAL",
    },
    {
      title: "Biometric & Physical Standards",
      category: "VERIFIED BENCHMARKS",
      icon: Gauge,
      desc: "Standardized testing for 0-30m sprint velocity, agility t-tests, and Yo-Yo intermittent endurance recovery benchmarks aligned with professional club standards.",
      link: "/athleticism",
      linkText: "View Athletic Benchmarks",
      badgeColor: "text-[#00ff88]",
      tag: "PHYSICAL",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#030611] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold text-[#00d4ff] uppercase tracking-wider mb-1">
              Development Core
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono">
              Comprehensive Training Overview
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Targeted athletic and tactical preparation designed to bridge the gap between youth football and professional competition.
            </p>
          </div>

          <Link
            to="/training"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00d4ff] hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            <span>Explore All 260+ Drills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="p-5 rounded-sm bg-[#050a1a] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono font-bold ${area.badgeColor}`}>
                      {area.category}
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-white/5 text-gray-400 px-2 py-0.5 rounded-sm">
                      {area.tag}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <Icon className={`w-4 h-4 ${area.badgeColor}`} />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                    {area.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {area.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5">
                  <Link
                    to={area.link}
                    className="inline-flex items-center justify-between w-full text-xs font-mono text-gray-300 group-hover:text-white transition-colors"
                  >
                    <span>{area.linkText}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#00ff88]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight, Video, Compass, Gauge } from "lucide-react";

export default function HomeDevelopmentOverview() {
  const areas = [
    {
      title: "Video-Analyzed Technical Drills",
      category: "260+ DRILLS & SESSIONS",
      icon: Video,
      desc: "Structured micro-cycles covering tight-space ball control, first-touch variations, directional turns, and striking technique with step-by-step coaching cues.",
      link: "/training",
      linkText: "Browse Training Library",
      badgeColor: "text-emerald-400",
      tag: "TECHNICAL",
    },
    {
      title: "Position-Specific Intelligence",
      category: "ALL 4 PITCH ZONES",
      icon: Compass,
      desc: "Tailored tactical modules designed for Goalkeepers, Center-Backs, Full-Backs, Central Midfielders, Wingers, and Strikers facing modern match scenarios.",
      link: "/positions",
      linkText: "Explore Position Profiles",
      badgeColor: "text-sky-400",
      tag: "TACTICAL",
    },
    {
      title: "Biometric & Physical Standards",
      category: "VERIFIED BENCHMARKS",
      icon: Gauge,
      desc: "Standardized testing for 0-30m sprint velocity, agility t-tests, and Yo-Yo intermittent endurance recovery benchmarks aligned with professional club standards.",
      link: "/athleticism",
      linkText: "View Athletic Benchmarks",
      badgeColor: "text-amber-400",
      tag: "PHYSICAL",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#0a0f1d] border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1.5">
              Development Core
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white font-display tracking-tight">
              Comprehensive Training Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              Targeted athletic and tactical preparation designed to bridge the gap between grassroots development and professional competition.
            </p>
          </div>

          <Link
            to="/training"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            <span>Explore All 260+ Drills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="p-6 rounded-xl bg-[#11182c] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-semibold tracking-wider ${area.badgeColor}`}>
                      {area.category}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                      {area.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className={`w-5 h-5 ${area.badgeColor}`} />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors font-display">
                    {area.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {area.desc}
                  </p>
                </div>

                <Link
                  to={area.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 group-hover:text-emerald-400 transition-colors pt-4 border-t border-slate-800/80"
                >
                  <span>{area.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

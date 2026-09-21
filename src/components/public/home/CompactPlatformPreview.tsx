import { Link } from "react-router-dom";
import { ArrowRight, Target, Activity, Video, Trophy, ChevronRight } from "lucide-react";

export default function CompactPlatformPreview() {
  const steps = [
    {
      step: "01",
      name: "TRAIN",
      tagline: "5-Pillar Curriculum",
      desc: "UEFA technical ball mastery, tactical scanning, and position-specific micro-cycles.",
      icon: Target,
      color: "text-[#00ff88]",
      border: "border-[#00ff88]/30",
      link: "/academy",
    },
    {
      step: "02",
      name: "TRACK",
      tagline: "Biometric Passport",
      desc: "0-30m acceleration velocity, Yo-Yo recovery, and tamper-proof development logs.",
      icon: Activity,
      color: "text-[#00d4ff]",
      border: "border-[#00d4ff]/30",
      link: "/athleticism",
    },
    {
      step: "03",
      name: "SHOWCASE",
      tagline: "Verified Match Film",
      desc: "Scout-grade video reels reviewed and authenticated by certified academy staff.",
      icon: Video,
      color: "text-[#00ff88]",
      border: "border-[#00ff88]/30",
      link: "/showcase",
    },
    {
      step: "04",
      name: "DISCOVER",
      tagline: "Trials & Contracts",
      desc: "Direct evaluation by European club scouts, university combines, and scholarship trusts.",
      icon: Trophy,
      color: "text-[#00d4ff]",
      border: "border-[#00d4ff]/30",
      link: "/scholarships",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#02050e] border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Compact Workflow Header */}
        <div className="text-center mb-8">
          <span className="text-[11px] font-mono font-bold text-[#00ff88] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-sm border border-white/10">
            Platform Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono mt-3">
            TRAIN <span className="text-[#00ff88]">→</span> TRACK{" "}
            <span className="text-[#00d4ff]">→</span> SHOWCASE{" "}
            <span className="text-[#00ff88]">→</span> DISCOVER
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-lg mx-auto">
            From grassroots execution to international professional discovery in four disciplined stages.
          </p>
        </div>

        {/* 4 Connected Cards in Single Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.link}
                className={`p-4 rounded-sm bg-[#050a1a] border ${item.border} hover:border-white/40 transition-all flex flex-col justify-between group hover:-translate-y-0.5`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-black text-gray-500 group-hover:text-white transition-colors">
                      STEP {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                  </div>

                  <div className="text-sm font-black font-mono text-white mb-0.5 group-hover:text-[#00ff88] transition-colors">
                    {item.name}
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 mb-2">
                    {item.tagline}
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400 group-hover:text-white">
                  <span>Explore Stage</span>
                  <ChevronRight className="w-3 h-3 text-[#00ff88]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

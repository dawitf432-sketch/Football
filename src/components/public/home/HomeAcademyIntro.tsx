import { Link } from "react-router-dom";
import { ArrowRight, Target, ShieldCheck, Zap, Apple, Brain, ChevronRight } from "lucide-react";

export default function HomeAcademyIntro() {
  const pillars = [
    {
      step: "01",
      title: "Technical Mastery",
      tag: "BALL MASTERY",
      icon: Target,
      color: "text-[#00ff88]",
      desc: "First-touch precision, close control in tight spaces, and bilateral passing accuracy.",
    },
    {
      step: "02",
      title: "Tactical Intelligence",
      tag: "SPATIAL IQ",
      icon: ShieldCheck,
      color: "text-[#00d4ff]",
      desc: "Pre-orientation scanning, transition pressing triggers, and spatial awareness.",
    },
    {
      step: "03",
      title: "Athleticism",
      tag: "SPEED & POWER",
      icon: Zap,
      color: "text-[#00ff88]",
      desc: "0-30m acceleration velocity, change-of-direction biomechanics, and aerobic recovery.",
    },
    {
      step: "04",
      title: "Match Nutrition",
      tag: "FUEL & RECOVERY",
      icon: Apple,
      color: "text-[#00d4ff]",
      desc: "Pre-match glycogen loading, fluid hydration osmolarity, and muscular repair.",
    },
    {
      step: "05",
      title: "Elite Mindset",
      tag: "PSYCHOLOGY",
      icon: Brain,
      color: "text-[#00ff88]",
      desc: "High-pressure decision-making, error recovery anchors, and mental resilience.",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#02050e] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-1">
              Methodology
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono">
              The 5-Pillar Development Framework
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Structured developmental curriculum used by European first-team academies to build complete football athletes.
            </p>
          </div>

          <Link
            to="/academy"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00ff88] hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            <span>View Full Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Responsive 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-4 rounded-sm bg-[#050a1a] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-gray-500">
                      PILLAR {p.step}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-sm">
                      {p.tag}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <Icon className={`w-4 h-4 ${p.color}`} />
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-[#00ff88] transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <Link
                  to="/academy"
                  className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400 group-hover:text-white"
                >
                  <span>Explore Drills</span>
                  <ChevronRight className="w-3 h-3 text-[#00ff88]" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

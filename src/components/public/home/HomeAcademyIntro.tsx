import { Link } from "react-router-dom";
import { ArrowRight, Target, ShieldCheck, Zap, Apple, Brain } from "lucide-react";

export default function HomeAcademyIntro() {
  const pillars = [
    {
      step: "01",
      title: "Technical Mastery",
      tag: "BALL MASTERY",
      icon: Target,
      color: "text-emerald-400",
      desc: "First-touch precision, close control under pressure, and bilateral passing accuracy.",
    },
    {
      step: "02",
      title: "Tactical Intelligence",
      tag: "SPATIAL IQ",
      icon: ShieldCheck,
      color: "text-sky-400",
      desc: "Pre-orientation scanning, transition pressing triggers, and spatial awareness.",
    },
    {
      step: "03",
      title: "Athleticism",
      tag: "SPEED & POWER",
      icon: Zap,
      color: "text-amber-400",
      desc: "0-30m sprint velocity, change-of-direction biomechanics, and aerobic recovery.",
    },
    {
      step: "04",
      title: "Match Nutrition",
      tag: "FUEL & RECOVERY",
      icon: Apple,
      color: "text-emerald-400",
      desc: "Pre-match glycogen loading, fluid hydration osmolarity, and muscular repair.",
    },
    {
      step: "05",
      title: "Elite Mindset",
      tag: "PSYCHOLOGY",
      icon: Brain,
      color: "text-purple-400",
      desc: "High-pressure decision-making, error recovery anchors, and mental resilience.",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#0a0f1d] border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
              Development Methodology
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white font-display tracking-tight">
              The 5-Pillar Development Framework
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              Structured developmental curriculum modeled after top European first-team academies to cultivate complete football athletes.
            </p>
          </div>

          <Link
            to="/academy"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            <span>View Full Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Responsive 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-5 rounded-xl bg-[#11182c] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      PILLAR {p.step}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                      {p.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className={`w-5 h-5 ${p.color}`} />
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors font-display">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Explore drills</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

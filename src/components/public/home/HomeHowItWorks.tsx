import { Link } from "react-router-dom";
import { Key, Target, TrendingUp, Trophy } from "lucide-react";

export default function HomeHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Activate Access Key",
      desc: "Enroll with a verified student or coach access ID to configure your athlete passport, position, and physical baseline.",
      icon: Key,
      color: "text-emerald-400",
    },
    {
      num: "02",
      title: "Execute Daily Drills",
      desc: "Follow structured academy training sessions covering ball mastery, spatial scanning, and game-speed repetitions.",
      icon: Target,
      color: "text-sky-400",
    },
    {
      num: "03",
      title: "Log Biometric Progress",
      desc: "Record sprint velocities, stamina test levels, and course completions to build a verified development dossier.",
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      num: "04",
      title: "Connect & Advance",
      desc: "Share certified development metrics directly with UEFA coaches, team rosters, and accredited club scouts.",
      icon: Trophy,
      color: "text-amber-400",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#0a0f1d] border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
            Athlete Pathway
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white font-display tracking-tight">
            How Pro Football Class Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            A clear, merit-based developmental pathway from structured training to verified professional opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-xl bg-[#11182c] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-extrabold font-display text-slate-600 group-hover:text-slate-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 font-display">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Standardized Milestone</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

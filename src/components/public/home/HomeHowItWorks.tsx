import { Link } from "react-router-dom";
import { Key, Target, TrendingUp, Trophy, ArrowRight } from "lucide-react";

export default function HomeHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Activate Access Key",
      desc: "Enroll with a unique student or coach access ID to configure your athlete passport, position, and physical baseline.",
      icon: Key,
      color: "text-[#00ff88]",
    },
    {
      num: "02",
      title: "Execute Daily Drills",
      desc: "Follow structured academy training sessions covering ball mastery, spatial scanning, and game-speed repetitions.",
      icon: Target,
      color: "text-[#00d4ff]",
    },
    {
      num: "03",
      title: "Log Biometric Progress",
      desc: "Record sprint velocities, stamina test levels, and course completions to build a verified development dossier.",
      icon: TrendingUp,
      color: "text-[#00ff88]",
    },
    {
      num: "04",
      title: "Connect & Advance",
      desc: "Share certified development metrics directly with UEFA coaches, team rosters, and accredited club scouts.",
      icon: Trophy,
      color: "text-[#00d4ff]",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#02050e] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[11px] font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-1">
            Athlete Journey
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono">
            How Pro Football Class Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            A clear, merit-based developmental pathway from individual training to professional opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-5 rounded-sm bg-[#050a1a] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-white/20 group-hover:text-white transition-colors">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${step.color}`} />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>
                  <span>Standardized Step</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

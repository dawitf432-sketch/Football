import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Dumbbell, LineChart, Award, Video, Compass, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function AcademySection() {
  const { t } = useLanguage();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const stepIcons = [
    <Dumbbell className="w-6 h-6 text-[#00ff88]" />,
    <LineChart className="w-6 h-6 text-[#00b8ff]" />,
    <Award className="w-6 h-6 text-yellow-400" />,
    <Video className="w-6 h-6 text-[#ff0055]" />,
    <Compass className="w-6 h-6 text-[#00ff88]" />
  ];

  const stepDetails = [
    {
      action: "Systematic Drills & UEFA Coaching",
      highlights: ["17 core positional & athletic categories", "Multi-angle HD execution guides", "Tactical IQ scenarios & decision drills"]
    },
    {
      action: "Biometric & Fitness Benchmarking",
      highlights: ["Standardized 30m sprint & agility testing", "Beep test stamina progression curve", "Quarterly coach evaluation reports"]
    },
    {
      action: "Tamper-Proof Player Passport",
      highlights: ["Verified height, weight & preferred foot", "Position-specific attribute spider chart", "Academic transcripts & youth credentials"]
    },
    {
      action: "Admin-Approved Match Highlights",
      highlights: ["Standardized video format (90s - 3min)", "High-intensity game situations only", "Direct timestamping of key actions"]
    },
    {
      action: "Global Recruitment Bridge",
      highlights: ["Monitored scout contact requests", "Direct applications to residential academies", "Full academic & athletic scholarships"]
    }
  ];

  return (
    <section id="academy" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050812] relative overflow-hidden border-t border-white/5">
      {/* Subtle Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00b8ff]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00ff88]/10 text-[#00ff88] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#00ff88]/20">
            <Sparkles className="w-3.5 h-3.5" />
            {t.academy.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.academy.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.academy.subtitle}
          </p>
        </div>

        {/* Pathway Visual Breadcrumb Bar */}
        <div className="mb-14 hidden lg:flex items-center justify-between relative">
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-white/10 z-0"></div>
          {t.academy.steps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`relative z-10 flex flex-col items-center gap-2 group cursor-pointer transition-all ${
                  isActive ? "scale-105" : "opacity-75 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-all border ${
                    isActive
                      ? "bg-[#00ff88] text-black border-[#00ff88] shadow-[0_0_25px_rgba(0,255,136,0.5)]"
                      : "bg-[#0a0e1c] text-white border-white/20 hover:border-white/50"
                  }`}
                >
                  {step.step}
                </div>
                <span
                  className={`text-xs font-extrabold uppercase tracking-wider ${
                    isActive ? "text-[#00ff88]" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* 5 Step Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {t.academy.steps.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            return (
              <div
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-6 rounded-sm cursor-pointer transition-all duration-300 relative border flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#0a0e1e] border-[#00ff88]/60 shadow-[0_0_20px_rgba(0,255,136,0.15)]"
                    : "bg-[#080c18] border-white/10 hover:border-white/25 hover:bg-[#0c1224]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-mono font-black text-white/30">{step.step}</span>
                    <div className="p-2 rounded-sm bg-white/5 border border-white/10">
                      {stepIcons[idx]}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00b8ff] mb-1 block">
                    {step.tag}
                  </span>
                  <h3 className="text-lg font-black uppercase text-white tracking-wide mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? "text-[#00ff88]" : "text-gray-500"}>
                    {isSelected ? "ACTIVE PHASE" : "EXPLORE PHASE"}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-[#00ff88]" : "text-gray-500"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Drawer for Selected Step */}
        <div className="p-6 sm:p-8 rounded-sm bg-gradient-to-r from-[#0c1326] to-[#080d1a] border border-[#00ff88]/30 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2">
                Phase {t.academy.steps[activeStepIndex].step}: {t.academy.steps[activeStepIndex].tag}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                {t.academy.steps[activeStepIndex].title} — {stepDetails[activeStepIndex].action}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {t.academy.steps[activeStepIndex].desc}
              </p>

              {/* Highlights checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {stepDetails[activeStepIndex].highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-300 bg-black/40 p-3 rounded-sm border border-white/5">
                    <CheckCircle className="w-4 h-4 text-[#00ff88] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-black/50 border border-white/10 rounded-sm text-center">
              <div className="w-12 h-12 rounded-full bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center mb-4">
                {stepIcons[activeStepIndex]}
              </div>
              <h4 className="text-sm font-bold uppercase text-white mb-2">
                Ready to begin this stage?
              </h4>
              <p className="text-xs text-gray-400 mb-5">
                Join our academy network to begin tracking and unlocking your player passport.
              </p>
              <Link
                to="/access"
                className="w-full py-2.5 px-4 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wide text-center transition-colors"
              >
                {t.hero.primaryCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

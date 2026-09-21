import React, { useState } from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import AcademySection from "../../components/public/AcademySection";
import PlayerDevelopmentSection from "../../components/public/PlayerDevelopmentSection";
import { ShieldCheck, Award, Dumbbell, Compass, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function AcademyPage() {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      title: "1. Technical Mastery",
      icon: <Target className="w-5 h-5 text-[#00ff88]" />,
      desc: "Ball manipulation under high press, first-touch orientation, 1v1 separation, and 360° passing execution.",
      metrics: ["1,500 touches/session standard", "Weak-foot parity >= 85%", "Rapid-fire scanning drills"],
    },
    {
      title: "2. Tactical Cognition",
      icon: <Compass className="w-5 h-5 text-[#00d4ff]" />,
      desc: "Positional intelligence, spatial overload exploitation, blindside runs, and defensive pressing triggers.",
      metrics: ["Game model video breakdowns", "Decision-making speed tests", "Half-space occupation drills"],
    },
    {
      title: "3. Elite Athleticism",
      icon: <Dumbbell className="w-5 h-5 text-yellow-400" />,
      desc: "Explosive deceleration, top-end sprint mechanics, rotational core power, and aerobic capacity.",
      metrics: ["10m/30m electronic gates", "Yo-Yo Intermittent test", "Counter-movement jump height"],
    },
    {
      title: "4. Cognitive & Mindset",
      icon: <Award className="w-5 h-5 text-purple-400" />,
      desc: "Clutch composure, emotional regulation after mistakes, leadership voice, and matchday visualization.",
      metrics: ["Post-match reflection logs", "Heart-rate variability recovery", "Pressure penalty protocols"],
    },
    {
      title: "5. Pathway & Safeguarding",
      icon: <ShieldCheck className="w-5 h-5 text-[#00ff88]" />,
      desc: "FIFA-aligned background verified scouting, tamper-proof athletic passports, and academic integration.",
      metrics: ["Direct scout contact gates", "Accredited scholarship trials", "Zero-exploitation monitoring"],
    },
  ];

  return (
    <PublicPageLayout
      title="Pro Football Academy Curriculum"
      badge="UEFA & FIFA Aligned"
      subtitle="A structured 5-pillar development methodology combining European elite academy standards with modern sports science."
      breadcrumbs={[{ label: "Academy" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Enroll Athlete <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-12">
        {/* Interactive 5-Pillar Tabs */}
        <div className="bg-[#060b18] border border-white/10 rounded-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white font-mono">
                The 5 Pillars of Player Development
              </h2>
              <p className="text-xs text-gray-400">Click a pillar to inspect curriculum standards</p>
            </div>
            <span className="text-xs font-mono text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-1 rounded-sm border border-[#00ff88]/20">
              Pillar 0{activePillar + 1} / 05
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {pillars.map((pillar, idx) => (
              <button
                key={idx}
                onClick={() => setActivePillar(idx)}
                className={`flex items-center gap-2 p-3 text-left rounded-sm border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activePillar === idx
                    ? "bg-[#00ff88]/15 border-[#00ff88] text-white shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                {pillar.icon}
                <span className="truncate">{pillar.title.split(". ")[1]}</span>
              </button>
            ))}
          </div>

          <div className="p-5 bg-black/40 border border-white/5 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-base font-bold text-white uppercase font-mono">
                {pillars[activePillar].icon}
                <span>{pillars[activePillar].title}</span>
              </div>
              <p className="text-sm text-gray-300 max-w-2xl">{pillars[activePillar].desc}</p>
            </div>

            <div className="space-y-1.5 w-full md:w-72 shrink-0 bg-white/[0.03] p-3 rounded-sm border border-white/10">
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#00ff88]">
                Key Benchmarks
              </div>
              {pillars[activePillar].metrics.map((m, i) => (
                <div key={i} className="text-xs text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Existing Academy Step Progression Section */}
        <div className="rounded-sm overflow-hidden border border-white/10">
          <AcademySection />
        </div>

        {/* Holistic Progress Radar & Safeguarding */}
        <div className="rounded-sm overflow-hidden border border-white/10">
          <PlayerDevelopmentSection />
        </div>

        {/* In-app PWA install prompt banner */}
        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

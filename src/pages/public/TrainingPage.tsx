import React, { useState } from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import TrainingSection, { TRAINING_CATEGORIES, TrainingCategory } from "../../components/public/TrainingSection";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, Flame, Filter } from "lucide-react";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function TrainingPage() {
  const [activeGroup, setActiveGroup] = useState<string>("ALL");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("ALL");

  const groups = [
    { id: "ALL", label: "All Curricula" },
    { id: "TECHNICAL", label: "Technical Mastery" },
    { id: "POSITIONAL", label: "Tactical & Positional" },
    { id: "ATHLETICISM", label: "Athletic Conditioning" },
    { id: "LIFESTYLE", label: "Mindset & Nutrition" },
  ];

  const filteredCategories = TRAINING_CATEGORIES.filter((cat) => {
    const matchGroup = activeGroup === "ALL" || cat.group === activeGroup;
    const matchDiff = activeDifficulty === "ALL" || cat.difficulty === activeDifficulty;
    return matchGroup && matchDiff;
  });

  return (
    <PublicPageLayout
      title="Complete Training Curriculum"
      badge="17 Specialized Disciplines"
      subtitle="Explore 260+ structured drills covering every technical touch, tactical responsibility, athletic attribute, and professional standard."
      breadcrumbs={[{ label: "Training" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Start Training <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#060b18] border border-white/10 rounded-sm">
          {/* Group Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {groups.map((grp) => (
              <button
                key={grp.id}
                onClick={() => setActiveGroup(grp.id)}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeGroup === grp.id
                    ? "bg-[#00ff88] text-black font-extrabold shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Filter className="w-3.5 h-3.5 text-[#00ff88]" />
            <span>Tier:</span>
            <select
              value={activeDifficulty}
              onChange={(e) => setActiveDifficulty(e.target.value)}
              className="bg-black/60 border border-white/20 text-white rounded-sm px-2.5 py-1 text-xs focus:outline-none focus:border-[#00ff88]"
            >
              <option value="ALL">All Levels</option>
              <option value="FOUNDATION">Foundation</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ELITE PRO">Elite Pro</option>
            </select>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 bg-gradient-to-b from-[#0a1124] to-[#050813] border border-white/10 hover:border-[#00ff88]/50 rounded-sm transition-all group flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-gray-300">
                    {cat.group}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-sm font-bold ${
                      cat.difficulty === "ELITE PRO"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : cat.difficulty === "INTERMEDIATE"
                        ? "bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20"
                        : "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20"
                    }`}
                  >
                    {cat.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white uppercase font-mono tracking-tight group-hover:text-[#00ff88] transition-colors flex items-center justify-between">
                  {cat.nameEn}
                  <span className="text-xs font-mono text-gray-500">{cat.drillsCount} Drills</span>
                </h3>

                <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {cat.taglineEn}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500">
                    Syllabus Highlights:
                  </div>
                  {cat.curriculumEn.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#00ff88] shrink-0 mt-0.5" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  to="/access"
                  className="text-xs font-bold uppercase text-[#00ff88] hover:text-[#00e67a] flex items-center gap-1 font-mono tracking-wider"
                >
                  Unlock Modules <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] font-mono text-gray-500">{cat.nameAm}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Existing Interactive Curriculum Section */}
        <div className="rounded-sm overflow-hidden border border-white/10">
          <TrainingSection />
        </div>

        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

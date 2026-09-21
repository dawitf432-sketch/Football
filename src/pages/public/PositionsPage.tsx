import React from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import PositionsSection from "../../components/public/PositionsSection";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Shield, Zap, Target } from "lucide-react";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function PositionsPage() {
  const positionCategories = [
    { code: "GK", title: "Goalkeepers", roles: "Sweeper Keeper, Shot Stopper", color: "text-amber-400" },
    { code: "DEF", title: "Defenders", roles: "Center Back (CB), Inverted Fullback (LB/RB)", color: "text-[#00d4ff]" },
    { code: "MID", title: "Midfielders", roles: "Defensive Mid (CDM), Box-to-Box (CM), Advanced Playmaker (CAM)", color: "text-[#00ff88]" },
    { code: "WING", title: "Wingers", roles: "Inverted Winger (RW/LW), Touchline Crosser", color: "text-purple-400" },
    { code: "ATT", title: "Attackers", roles: "Target Center-Forward (ST), False 9, Second Striker", color: "text-red-400" },
  ];

  return (
    <PublicPageLayout
      title="Positional Mastery & Tactical Pitch"
      badge="All 11 Tactical Roles"
      subtitle="Master the precise biomechanics, tactical decision matrices, and pro-scouting requirements for every position on the pitch."
      breadcrumbs={[{ label: "Positions" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Select Your Position <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Quick Position Roles Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {positionCategories.map((pos) => (
            <div
              key={pos.code}
              className="p-3.5 bg-[#060b18] border border-white/10 rounded-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-black font-mono ${pos.color}`}>{pos.code}</span>
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-tight">{pos.title}</div>
              <div className="text-[11px] text-gray-400 mt-1 line-clamp-1">{pos.roles}</div>
            </div>
          ))}
        </div>

        {/* Existing Interactive Pitch & Position Detail Explorer */}
        <div className="rounded-sm overflow-hidden border border-white/10">
          <PositionsSection />
        </div>

        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

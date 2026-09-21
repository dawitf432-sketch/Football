import React from "react";
import { Star, Eye, Send, PlayCircle, ShieldCheck, Activity, Award } from "lucide-react";
import { PlayerPublicProfile } from "../../../types";

export function getCountryFlag(country: string): string {
  const c = (country || "").toLowerCase();
  if (c.includes("ethiop") || c === "et") return "🇪🇹";
  if (c.includes("brit") || c.includes("united king") || c.includes("england") || c === "gb" || c === "uk") return "🇬🇧";
  if (c.includes("ghana") || c === "gh") return "🇬🇭";
  if (c.includes("brazil") || c === "br") return "🇧🇷";
  if (c.includes("nigeria") || c === "ng") return "🇳🇬";
  if (c.includes("germany") || c === "de") return "🇩🇪";
  if (c.includes("france") || c === "fr") return "🇫🇷";
  if (c.includes("spain") || c === "es") return "🇪🇸";
  if (c.includes("senegal") || c === "sn") return "🇸🇳";
  if (c.includes("kenya") || c === "ke") return "🇰🇪";
  if (c.includes("united states") || c.includes("usa") || c === "us") return "🇺🇸";
  return "🌍";
}

export function getPositionColor(position: string): { bg: string; text: string; border: string } {
  const p = (position || "").toLowerCase();
  if (p.includes("goal") || p === "gk") {
    return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" };
  }
  if (p.includes("def") || p === "cb" || p === "rb" || p === "lb") {
    return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" };
  }
  if (p.includes("mid") || p === "cm" || p === "cdm" || p === "cam") {
    return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" };
  }
  if (p.includes("wing") || p === "lw" || p === "rw") {
    return { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" };
  }
  // Striker / Forward
  return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" };
}

interface ScoutPlayerCardProps {
  key?: React.Key;
  player: PlayerPublicProfile;
  isShortlisted: boolean;
  onToggleShortlist: (player: PlayerPublicProfile) => void;
  onViewProfile: (player: PlayerPublicProfile) => void;
  onRequestContact: (player: PlayerPublicProfile) => void;
}

export default function ScoutPlayerCard({
  player,
  isShortlisted,
  onToggleShortlist,
  onViewProfile,
  onRequestContact
}: ScoutPlayerCardProps) {
  const flag = getCountryFlag(player.country);
  const posStyle = getPositionColor(player.position);
  const overallSkill = player.skills?.overall || 80;
  const overallAthleticism = player.athleticism?.overall || 80;

  return (
    <div className="bg-[#0b1326] border border-white/10 hover:border-[#00f59b]/50 rounded-lg p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_0_25px_rgba(0,245,155,0.08)] group relative">
      {/* Header Bar */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" title={player.country}>{flag}</span>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight leading-tight group-hover:text-[#00f59b] transition-colors">
                {player.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                <span>{player.country}</span>
                <span>•</span>
                <span>{player.age} yrs</span>
                <span>•</span>
                <span>{player.preferredFoot} Foot</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleShortlist(player)}
            title={isShortlisted ? "Remove from Shortlist" : "Save to Shortlist"}
            className={`p-2 rounded-md transition-colors ${
              isShortlisted
                ? "bg-[#00f59b]/20 text-[#00f59b] border border-[#00f59b]/40"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            <Star className={`w-4 h-4 ${isShortlisted ? "fill-[#00f59b]" : ""}`} />
          </button>
        </div>

        {/* Position & Development Level Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
            {player.position}
          </span>
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-white/5 text-gray-300 border border-white/10">
            {player.developmentLevel}
          </span>
          {player.approvedShowcaseCount !== undefined && player.approvedShowcaseCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
              <PlayCircle className="w-3 h-3" /> {player.approvedShowcaseCount} Reels
            </span>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 bg-[#070d18] p-3 rounded-md border border-white/5 mb-4">
          <div>
            <div className="flex justify-between items-center text-[11px] text-gray-400 mb-1">
              <span>Technical</span>
              <span className="font-bold text-white font-mono">{overallSkill}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-[#00f59b] h-full rounded-full" 
                style={{ width: `${Math.min(overallSkill, 100)}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[11px] text-gray-400 mb-1">
              <span>Athleticism</span>
              <span className="font-bold text-white font-mono">{overallAthleticism}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-[#00e5ff] h-full rounded-full" 
                style={{ width: `${Math.min(overallAthleticism, 100)}%` }} 
              />
            </div>
          </div>

          <div className="col-span-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Development Index</span>
            <div className="flex items-center gap-1.5 font-bold text-[#00f59b]">
              <Activity className="w-3.5 h-3.5" />
              <span>{player.developmentProgress}%</span>
            </div>
          </div>
        </div>

        {/* Highlight Skills Chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">
            Dribble {player.skills?.dribbling || 80}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">
            Pace {player.athleticism?.pace || 84}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">
            Pass {player.skills?.passing || 80}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">
            Vision {player.skills?.vision || 82}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
        <button
          onClick={() => onViewProfile(player)}
          className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-gray-300" /> View Profile
        </button>
        <button
          onClick={() => onRequestContact(player)}
          className="w-full py-2 px-3 bg-[#00f59b]/10 hover:bg-[#00f59b]/20 border border-[#00f59b]/30 rounded text-xs font-semibold text-[#00f59b] flex items-center justify-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5" /> Inquire
        </button>
      </div>
    </div>
  );
}

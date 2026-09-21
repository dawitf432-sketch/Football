import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Globe, Filter, Lock, ShieldCheck, ArrowRight, UserCheck, Eye } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function ScoutingSection() {
  const { language, t } = useLanguage();
  const [selectedPosition, setSelectedPosition] = useState("ALL");
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [selectedAge, setSelectedAge] = useState("ALL");

  // Anonymized sample talent profiles (safeguarded per FIFA standards)
  const sampleTalents = [
    {
      id: "PFC-TL-01",
      alias: "Talent Prospect #104",
      position: "Right Winger / Inside Forward",
      ageBracket: "U18 (17 yrs)",
      country: "Ethiopia",
      region: "East Africa",
      preferredFoot: "Left",
      sprintFly30m: "3.98s",
      verifiedBadges: ["30m Speed Benchmark", "1v1 Dribble Mastery"],
      evaluationScore: 92
    },
    {
      id: "PFC-TL-02",
      alias: "Talent Prospect #218",
      position: "Central Defensive Midfielder",
      ageBracket: "U19 (18 yrs)",
      country: "Ghana",
      region: "West Africa",
      preferredFoot: "Right",
      sprintFly30m: "4.12s",
      verifiedBadges: ["Scanning Rate 0.7/s", "Line-Breaker Pass"],
      evaluationScore: 89
    },
    {
      id: "PFC-TL-03",
      alias: "Talent Prospect #309",
      position: "Sweeper Keeper",
      ageBracket: "U17 (16 yrs)",
      country: "Kenya",
      region: "East Africa",
      preferredFoot: "Both",
      sprintFly30m: "4.20s",
      verifiedBadges: ["Cross Claim 78%", "Distribution 86%"],
      evaluationScore: 91
    },
    {
      id: "PFC-TL-04",
      alias: "Talent Prospect #441",
      position: "Centre Forward / Poacher",
      ageBracket: "U18 (17 yrs)",
      country: "Nigeria",
      region: "West Africa",
      preferredFoot: "Right",
      sprintFly30m: "4.02s",
      verifiedBadges: ["Shot Conversion 24%", "Near-Post Finishing"],
      evaluationScore: 94
    }
  ];

  const filteredTalents = sampleTalents.filter((item) => {
    if (selectedPosition !== "ALL" && !item.position.toLowerCase().includes(selectedPosition.toLowerCase())) return false;
    if (selectedCountry !== "ALL" && item.country !== selectedCountry) return false;
    if (selectedAge !== "ALL" && !item.ageBracket.includes(selectedAge)) return false;
    return true;
  });

  return (
    <section id="scouting" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050812] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00b8ff]/10 text-[#00b8ff] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#00b8ff]/20">
            <Search className="w-3.5 h-3.5" />
            {t.scouting.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.scouting.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.scouting.subtitle}
          </p>
        </div>

        {/* Discovery Filter Console */}
        <div className="p-6 rounded-sm bg-[#080d1a] border border-white/10 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-4">
            <Filter className="w-4 h-4 text-[#00b8ff]" />
            {t.scouting.filtersTitle}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1.5">
                {t.scouting.positionFilter}
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00b8ff]"
              >
                <option value="ALL">All Positions</option>
                <option value="winger">Winger / Wide Attacker</option>
                <option value="midfielder">Midfielder (CDM / CM)</option>
                <option value="keeper">Goalkeeper (GK)</option>
                <option value="forward">Centre Forward / Striker</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1.5">
                {t.scouting.countryFilter}
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00b8ff]"
              >
                <option value="ALL">All Countries</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="Nigeria">Nigeria</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1.5">
                {t.scouting.ageFilter}
              </label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00b8ff]"
              >
                <option value="ALL">All Age Brackets</option>
                <option value="U17">U17 (15 - 16 yrs)</option>
                <option value="U18">U18 (17 yrs)</option>
                <option value="U19">U19 (18 yrs)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Talent Radar Results Grid (Anonymized & Protected) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {filteredTalents.map((talent) => (
            <div
              key={talent.id}
              className="p-6 rounded-sm bg-[#080d1a] border border-white/10 hover:border-[#00b8ff]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-sm">
                    {talent.id}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#00ff88]">
                    <span className="text-gray-400">Score:</span> {talent.evaluationScore}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  {talent.alias}
                </h3>
                <div className="text-xs text-[#00b8ff] font-medium mb-3">
                  {talent.position}
                </div>

                <div className="space-y-1.5 text-xs text-gray-300 font-mono mb-4 pt-3 border-t border-white/5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bracket:</span>
                    <span>{talent.ageBracket}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Origin:</span>
                    <span>{talent.country} ({talent.region})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">30m Sprint:</span>
                    <span className="text-[#00ff88]">{talent.sprintFly30m}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {talent.verifiedBadges.map((badge, i) => (
                    <span key={i} className="text-[10px] bg-black/60 text-gray-300 px-2 py-0.5 rounded-sm border border-white/5">
                      ✓ {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Locked dossier contact button */}
              <Link
                to="/access"
                state={{ defaultTab: "LOGIN" }}
                className="w-full py-2.5 px-3 rounded-sm bg-white/5 hover:bg-[#00b8ff] text-gray-300 hover:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-[#00b8ff]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Scout Dossier Locked</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Scout Access Protected Banner */}
        <div className="p-6 sm:p-8 rounded-sm bg-gradient-to-r from-[#0c1426] via-[#090e1a] to-[#0c1426] border border-[#00b8ff]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#00b8ff]/20 text-[#00b8ff] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase text-white font-mono mb-1">
                Are You An Accredited Scout Or Club Director?
              </h3>
              <p className="text-xs text-gray-300 max-w-xl">
                {t.scouting.restrictedNotice}
              </p>
            </div>
          </div>

          <Link
            to="/access"
            state={{ defaultTab: "LOGIN" }}
            className="shrink-0 px-6 py-3 rounded-sm bg-[#00b8ff] hover:bg-[#00a3e0] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,184,255,0.3)]"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.scouting.scoutLoginCta}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

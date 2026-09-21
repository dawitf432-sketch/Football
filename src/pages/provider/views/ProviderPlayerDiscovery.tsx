import React, { useEffect, useState } from "react";
import { 
  Compass, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Star, 
  PlayCircle, 
  Send, 
  Activity, 
  ShieldCheck, 
  Award,
  ChevronDown
} from "lucide-react";
import { PlayerPublicProfile } from "../../../types";
import { providerService } from "../services/providerService";

interface ProviderPlayerDiscoveryProps {
  providerId: string;
  onOpenPlayerModal: (player: PlayerPublicProfile) => void;
  onSendMessage: (player: { userId: string; name: string }) => void;
}

const POSITIONS = ["ALL", "Goalkeeper", "Defender", "Midfielder", "Winger", "Striker"];
const FOOT_OPTIONS = ["ALL", "Right", "Left", "Both"];
const DEV_LEVELS = ["ALL", "Grassroots", "Youth Elite", "Pre-Pro", "First Team Ready"];

export default function ProviderPlayerDiscovery({
  providerId,
  onOpenPlayerModal,
  onSendMessage
}: ProviderPlayerDiscoveryProps) {
  const [players, setPlayers] = useState<PlayerPublicProfile[]>([]);
  const [shortlistMap, setShortlistMap] = useState<Record<string, string>>({}); // playerId -> shortlistDocId
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("ALL");
  const [selectedFoot, setSelectedFoot] = useState("ALL");
  const [selectedDevLevel, setSelectedDevLevel] = useState("ALL");
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [minAge, setMinAge] = useState<number>(14);
  const [maxAge, setMaxAge] = useState<number>(22);

  const loadData = async () => {
    setLoading(true);
    const [allTalents, slList] = await Promise.all([
      providerService.getDiscoverablePlayers({
        country: selectedCountry,
        position: selectedPosition,
        preferredFoot: selectedFoot,
        developmentLevel: selectedDevLevel,
        minAge,
        maxAge,
        searchQuery
      }),
      providerService.getShortlist(providerId)
    ]);

    setPlayers(allTalents);

    const sMap: Record<string, string> = {};
    slList.forEach(item => {
      sMap[item.playerId] = item.id;
    });
    setShortlistMap(sMap);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedPosition, selectedFoot, selectedDevLevel, selectedCountry, minAge, maxAge]);

  const handleToggleShortlist = async (player: PlayerPublicProfile) => {
    const pId = player.userId || player.id;
    const existingDocId = shortlistMap[pId];

    if (existingDocId) {
      // Remove
      await providerService.removeFromShortlist(existingDocId);
      const copy = { ...shortlistMap };
      delete copy[pId];
      setShortlistMap(copy);
    } else {
      // Add
      const newDocId = await providerService.addToShortlist(providerId, player);
      setShortlistMap({ ...shortlistMap, [pId]: newDocId });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#00ff88]" />
            Discover Eligible Football Talent
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Search verified youth players with high academic discipline and elite football potential. Only discoverable candidates are displayed.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#0b1326] px-3.5 py-2 rounded-xl border border-white/10">
          <span>Eligible Prospects: <strong className="text-[#00ff88]">{players.length}</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b1326] border border-white/10 p-4 sm:p-5 rounded-2xl space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") loadData(); }}
            placeholder="Search by player name, location, country, bio keywords..."
            className="w-full bg-[#070d18] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
          />
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Position */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Position</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full bg-[#070d18] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff88]"
            >
              {POSITIONS.map(p => (
                <option key={p} value={p}>{p === "ALL" ? "All Positions" : p}</option>
              ))}
            </select>
          </div>

          {/* Preferred Foot */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Preferred Foot</label>
            <select
              value={selectedFoot}
              onChange={(e) => setSelectedFoot(e.target.value)}
              className="w-full bg-[#070d18] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff88]"
            >
              {FOOT_OPTIONS.map(f => (
                <option key={f} value={f}>{f === "ALL" ? "All Feet" : f}</option>
              ))}
            </select>
          </div>

          {/* Development Level */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Development Level</label>
            <select
              value={selectedDevLevel}
              onChange={(e) => setSelectedDevLevel(e.target.value)}
              className="w-full bg-[#070d18] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff88]"
            >
              {DEV_LEVELS.map(d => (
                <option key={d} value={d}>{d === "ALL" ? "All Levels" : d}</option>
              ))}
            </select>
          </div>

          {/* Age Bracket */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">
              Age Range: <strong className="text-white">{minAge} - {maxAge}y</strong>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={12}
                max={25}
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-1/2 bg-[#070d18] border border-white/10 rounded-xl px-2 py-1.5 text-center text-white focus:outline-none focus:border-[#00ff88]"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min={12}
                max={25}
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-1/2 bg-[#070d18] border border-white/10 rounded-xl px-2 py-1.5 text-center text-white focus:outline-none focus:border-[#00ff88]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">Scanning talent database...</div>
      ) : players.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-[#0b1326] rounded-2xl border border-white/10 p-8 space-y-3">
          <Compass className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Discoverable Players Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your position or age filters to broaden your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((p) => {
            const pId = p.userId || p.id;
            const isShortlisted = !!shortlistMap[pId];

            return (
              <div
                key={pId}
                className="bg-[#0b1326] border border-white/10 hover:border-white/25 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:translate-y-[-2px]"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Avatar, Name, Shortlist Toggle */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-blue-500/20 border border-[#00ff88]/30 flex items-center justify-center font-black text-[#00ff88] text-base">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-[#00ff88] transition-colors">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span>{p.location || p.country}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleShortlist(p)}
                      className={`p-2 rounded-xl transition-all ${
                        isShortlisted
                          ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                          : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                      }`}
                      title={isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
                    >
                      <Star className={`w-4 h-4 ${isShortlisted ? "fill-black" : ""}`} />
                    </button>
                  </div>

                  {/* Attributes & Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30">
                      {p.position}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-300">
                      {p.age} Years Old
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Foot: {p.preferredFoot || "Right"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {p.developmentLevel || "Youth Elite"}
                    </span>
                  </div>

                  {/* Bio Excerpt */}
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {p.bio || "Grassroots prospect with confirmed academic standing and dedication to elite development."}
                  </p>

                  {/* Technical & Athletic Index Progress */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                    <div className="bg-[#070d18] p-2.5 rounded-xl border border-white/5">
                      <div className="text-gray-400 flex items-center justify-between">
                        <span>Skills Index</span>
                        <strong className="text-[#00ff88]">{p.skills?.overall || 82}</strong>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-[#00ff88]"
                          style={{ width: `${p.skills?.overall || 82}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-[#070d18] p-2.5 rounded-xl border border-white/5">
                      <div className="text-gray-400 flex items-center justify-between">
                        <span>Athletic Pace</span>
                        <strong className="text-[#00b8ff]">{p.athleticism?.pace || 85}</strong>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-[#00b8ff]"
                          style={{ width: `${p.athleticism?.pace || 85}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2">
                  <button
                    onClick={() => onOpenPlayerModal(p)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-colors text-center"
                  >
                    View Dossier
                  </button>

                  <button
                    onClick={() => onSendMessage({ userId: pId, name: p.name })}
                    className="p-2 bg-[#00ff88]/15 hover:bg-[#00ff88]/25 text-[#00ff88] rounded-xl border border-[#00ff88]/30 transition-colors"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

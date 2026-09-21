import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  Loader2, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Sparkles,
  Award,
  Check
} from "lucide-react";
import { PlayerPublicProfile, ShortlistItem } from "../../../types";
import { scoutService } from "../services/scoutService";
import ScoutPlayerCard from "../components/ScoutPlayerCard";
import ScoutPlayerProfileModal from "../components/ScoutPlayerProfileModal";
import ScoutContactModal from "../components/ScoutContactModal";

interface ScoutDiscoverProps {
  user: any;
  scoutProfile: any;
  onRefreshStats?: () => void;
}

const POSITIONS = ["All", "Goalkeeper", "Defender", "Midfielder", "Winger", "Striker"];
const PREFERRED_FEET = ["All", "Right", "Left", "Both"];
const DEV_LEVELS = ["All", "Academy", "Youth Elite", "Pre-Pro", "First Team Ready"];

export default function ScoutDiscover({ user, scoutProfile, onRefreshStats }: ScoutDiscoverProps) {
  const [players, setPlayers] = useState<PlayerPublicProfile[]>([]);
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Advanced Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedFoot, setSelectedFoot] = useState("All");
  const [selectedDevLevel, setSelectedDevLevel] = useState("All");
  const [locationTerm, setLocationTerm] = useState("");
  const [minAge, setMinAge] = useState<number>(15);
  const [maxAge, setMaxAge] = useState<number>(23);
  const [minSkill, setMinSkill] = useState<number>(0);
  const [minAthleticism, setMinAthleticism] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modals
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState<PlayerPublicProfile | null>(null);
  const [selectedPlayerForContact, setSelectedPlayerForContact] = useState<PlayerPublicProfile | null>(null);

  // Verification status check
  const isVerified = scoutProfile?.verificationStatus === "VERIFIED" || user?.verificationStatus === "VERIFIED";

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [discoverable, sList] = await Promise.all([
        scoutService.getDiscoverablePlayers(),
        scoutService.getScoutShortlist(user.uid)
      ]);
      setPlayers(discoverable);
      setShortlist(sList);
    } catch (err) {
      console.error("Error loading discovery data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Distinct countries available
  const availableCountries = useMemo(() => {
    const list = Array.from(new Set(players.map(p => p.country).filter(Boolean)));
    return ["All", ...list];
  }, [players]);

  // Filter logic
  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      // Name filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(term);
        const matchesBio = player.bio?.toLowerCase().includes(term);
        if (!matchesName && !matchesBio) return false;
      }

      // Position filter
      if (selectedPosition !== "All") {
        if (!player.position.toLowerCase().includes(selectedPosition.toLowerCase())) {
          return false;
        }
      }

      // Country filter
      if (selectedCountry !== "All") {
        if (player.country !== selectedCountry) return false;
      }

      // Foot filter
      if (selectedFoot !== "All") {
        if (player.preferredFoot.toLowerCase() !== selectedFoot.toLowerCase()) return false;
      }

      // Dev Level filter
      if (selectedDevLevel !== "All") {
        if (player.developmentLevel !== selectedDevLevel) return false;
      }

      // Location filter
      if (locationTerm.trim()) {
        if (!player.location?.toLowerCase().includes(locationTerm.toLowerCase())) {
          return false;
        }
      }

      // Age range filter
      if (player.age < minAge || player.age > maxAge) {
        return false;
      }

      // Min Skill filter
      const skillOverall = player.skills?.overall || 0;
      if (skillOverall < minSkill) {
        return false;
      }

      // Min Athleticism filter
      const athOverall = player.athleticism?.overall || 0;
      if (athOverall < minAthleticism) {
        return false;
      }

      return true;
    });
  }, [
    players, 
    searchTerm, 
    selectedPosition, 
    selectedCountry, 
    selectedFoot, 
    selectedDevLevel, 
    locationTerm, 
    minAge, 
    maxAge, 
    minSkill, 
    minAthleticism
  ]);

  const handleToggleShortlist = async (player: PlayerPublicProfile) => {
    const existing = shortlist.find(s => s.playerId === player.id);
    if (existing) {
      await scoutService.removeFromShortlist(existing.id);
      setShortlist(prev => prev.filter(s => s.id !== existing.id));
    } else {
      const added = await scoutService.addToShortlist(user.uid, player, "Scouted prospect.");
      setShortlist(prev => [...prev, added]);
    }
    if (onRefreshStats) onRefreshStats();
  };

  const handleSaveNotes = async (playerId: string, notes: string) => {
    const existing = shortlist.find(s => s.playerId === playerId);
    if (existing) {
      await scoutService.updateShortlistNotes(existing.id, notes);
      setShortlist(prev => prev.map(s => s.id === existing.id ? { ...s, notes } : s));
    } else {
      const targetPlayer = players.find(p => p.id === playerId);
      if (targetPlayer) {
        const added = await scoutService.addToShortlist(user.uid, targetPlayer, notes);
        setShortlist(prev => [...prev, added]);
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedPosition("All");
    setSelectedCountry("All");
    setSelectedFoot("All");
    setSelectedDevLevel("All");
    setLocationTerm("");
    setMinAge(15);
    setMaxAge(23);
    setMinSkill(0);
    setMinAthleticism(0);
  };

  const hasActiveFilters = 
    searchTerm !== "" || 
    selectedPosition !== "All" || 
    selectedCountry !== "All" || 
    selectedFoot !== "All" || 
    selectedDevLevel !== "All" || 
    locationTerm !== "" || 
    minAge > 15 || 
    maxAge < 23 || 
    minSkill > 0 || 
    minAthleticism > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Verification Check */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Player Discovery Database
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Search, filter, and analyze discoverable academy talents with verified technical metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isVerified ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#00f59b]/10 border border-[#00f59b]/30 text-[#00f59b] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Accredited Scout Access</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Verification Pending</span>
            </div>
          )}

          <button
            onClick={loadData}
            title="Reload database"
            className="p-2 bg-[#0b1326] hover:bg-white/5 border border-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#00f59b]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Unverified Scout Notice Banner if not verified */}
      {!isVerified && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-300">Scout Verification Pending Review</h4>
              <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                Full player scouting reports and official inquiry submissions require an accredited scout license. You can request fast-track verification directly from your Scout Profile.
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              await scoutService.updateScoutProfile(user.uid, { verificationStatus: "VERIFIED" });
              window.location.reload();
            }}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider rounded-md transition-colors shrink-0 shadow-sm"
          >
            Authorize Verified Mode
          </button>
        </div>
      )}

      {/* Search & Main Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prospects by player name, style, or tactical keyword..."
              className="w-full pl-10 pr-10 py-3 bg-[#0b1326] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f59b] transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Advanced Filter Toggle Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-3 rounded-lg border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              showAdvancedFilters || hasActiveFilters
                ? "bg-[#00f59b]/10 border-[#00f59b] text-[#00f59b]"
                : "bg-[#0b1326] border-white/10 text-gray-300 hover:border-white/20"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Advanced Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#00f59b] animate-pulse" />
            )}
          </button>
        </div>

        {/* Position Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPosition === pos
                  ? "bg-[#00f59b] text-black shadow-[0_0_12px_rgba(0,245,155,0.25)]"
                  : "bg-[#0b1326] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Advanced Filters Drawer Panel */}
        {showAdvancedFilters && (
          <div className="bg-[#0b1326] border border-white/10 rounded-xl p-5 space-y-4 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#00f59b]" /> Advanced Scouting Parameters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-400 hover:underline font-medium"
                >
                  Reset all filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Country Filter */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Country / Nationality</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#070d18] border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#00f59b]"
                >
                  {availableCountries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Preferred Foot */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Preferred Foot</label>
                <select
                  value={selectedFoot}
                  onChange={(e) => setSelectedFoot(e.target.value)}
                  className="w-full bg-[#070d18] border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#00f59b]"
                >
                  {PREFERRED_FEET.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Development Level */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Development Level</label>
                <select
                  value={selectedDevLevel}
                  onChange={(e) => setSelectedDevLevel(e.target.value)}
                  className="w-full bg-[#070d18] border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#00f59b]"
                >
                  {DEV_LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Location Term */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">City / Location</label>
                <input
                  type="text"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  placeholder="e.g. Addis Ababa, London..."
                  className="w-full bg-[#070d18] border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#00f59b]"
                />
              </div>

              {/* Age Range Slider */}
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center text-xs text-gray-400 mb-1.5 font-medium">
                  <span>Age Bracket</span>
                  <span className="text-white font-mono">{minAge} - {maxAge} years</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-500">Min Age</span>
                    <input
                      type="range"
                      min="14"
                      max="24"
                      value={minAge}
                      onChange={(e) => setMinAge(Number(e.target.value))}
                      className="w-full accent-[#00f59b]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">Max Age</span>
                    <input
                      type="range"
                      min="15"
                      max="25"
                      value={maxAge}
                      onChange={(e) => setMaxAge(Number(e.target.value))}
                      className="w-full accent-[#00f59b]"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Skill Threshold */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
                  <span>Min Technical Score</span>
                  <span className="text-white font-mono">{minSkill > 0 ? `${minSkill}+` : "Any"}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={minSkill}
                  onChange={(e) => setMinSkill(Number(e.target.value))}
                  className="w-full accent-[#00f59b]"
                />
              </div>

              {/* Athleticism Threshold */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
                  <span>Min Athleticism Score</span>
                  <span className="text-white font-mono">{minAthleticism > 0 ? `${minAthleticism}+` : "Any"}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={minAthleticism}
                  onChange={(e) => setMinAthleticism(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/5 pb-2">
        <div>
          Showing <span className="text-white font-bold">{filteredPlayers.length}</span> discoverable prospect{filteredPlayers.length === 1 ? '' : 's'}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-[#00f59b] hover:underline"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* Player Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 space-y-3">
          <Loader2 className="w-8 h-8 text-[#00f59b] animate-spin" />
          <p className="text-sm">Querying verified scouting database...</p>
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="bg-[#0b1326] border border-white/10 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-gray-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No prospects match your search criteria</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting position filters, expanding the age bracket, or resetting your technical skill thresholds.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map(player => (
            <ScoutPlayerCard
              key={player.id}
              player={player}
              isShortlisted={shortlist.some(s => s.playerId === player.id)}
              onToggleShortlist={handleToggleShortlist}
              onViewProfile={(p) => setSelectedPlayerForProfile(p)}
              onRequestContact={(p) => setSelectedPlayerForContact(p)}
            />
          ))}
        </div>
      )}

      {/* Dossier Modal */}
      {selectedPlayerForProfile && (
        <ScoutPlayerProfileModal
          player={selectedPlayerForProfile}
          isShortlisted={shortlist.some(s => s.playerId === selectedPlayerForProfile.id)}
          shortlistNotes={shortlist.find(s => s.playerId === selectedPlayerForProfile.id)?.notes || ""}
          onClose={() => setSelectedPlayerForProfile(null)}
          onToggleShortlist={handleToggleShortlist}
          onSaveNotes={handleSaveNotes}
          onRequestContact={(p) => {
            setSelectedPlayerForProfile(null);
            setSelectedPlayerForContact(p);
          }}
        />
      )}

      {/* Contact Inquiry Modal */}
      {selectedPlayerForContact && (
        <ScoutContactModal
          player={selectedPlayerForContact}
          scoutUser={user}
          onClose={() => setSelectedPlayerForContact(null)}
          onSuccess={() => {
            if (onRefreshStats) onRefreshStats();
          }}
        />
      )}
    </div>
  );
}

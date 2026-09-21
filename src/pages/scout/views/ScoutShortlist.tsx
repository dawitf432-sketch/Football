import { useState, useEffect, useMemo } from "react";
import { 
  Star, 
  Trash2, 
  Save, 
  Search, 
  Eye, 
  Send, 
  FileText, 
  Check, 
  Loader2, 
  ChevronRight, 
  Award, 
  Clock,
  Sparkles
} from "lucide-react";
import { ShortlistItem, PlayerPublicProfile } from "../../../types";
import { scoutService } from "../services/scoutService";
import { getCountryFlag, getPositionColor } from "../components/ScoutPlayerCard";
import ScoutPlayerProfileModal from "../components/ScoutPlayerProfileModal";
import ScoutContactModal from "../components/ScoutContactModal";

interface ScoutShortlistProps {
  user: any;
  onRefreshStats?: () => void;
}

export default function ScoutShortlist({ user, onRefreshStats }: ScoutShortlistProps) {
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});

  // Modals
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState<PlayerPublicProfile | null>(null);
  const [selectedPlayerForContact, setSelectedPlayerForContact] = useState<PlayerPublicProfile | null>(null);
  const [loadingPlayerId, setLoadingPlayerId] = useState<string | null>(null);

  useEffect(() => {
    loadShortlist();
  }, [user]);

  const loadShortlist = async () => {
    setLoading(true);
    try {
      const items = await scoutService.getScoutShortlist(user.uid);
      setShortlist(items);
      const notesMap: { [id: string]: string } = {};
      items.forEach(item => {
        notesMap[item.id] = item.notes || "";
      });
      setEditingNotes(notesMap);
    } catch (err) {
      console.error("Error loading shortlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await scoutService.removeFromShortlist(id);
      setShortlist(prev => prev.filter(item => item.id !== id));
      if (onRefreshStats) onRefreshStats();
    } catch (err) {
      console.error("Error removing from shortlist:", err);
    }
  };

  const handleSaveNotes = async (item: ShortlistItem) => {
    const updatedNotes = editingNotes[item.id] || "";
    setSavingId(item.id);
    try {
      await scoutService.updateShortlistNotes(item.id, updatedNotes);
      setShortlist(prev => prev.map(s => s.id === item.id ? { ...s, notes: updatedNotes } : s));
      setSavedSuccessId(item.id);
      setTimeout(() => setSavedSuccessId(null), 2000);
    } catch (err) {
      console.error("Error updating notes:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleOpenProfile = async (playerId: string) => {
    setLoadingPlayerId(playerId);
    try {
      const profile = await scoutService.getPlayerPublicProfile(playerId);
      if (profile) {
        setSelectedPlayerForProfile(profile);
      }
    } catch (err) {
      console.error("Error fetching player profile:", err);
    } finally {
      setLoadingPlayerId(null);
    }
  };

  const handleOpenContact = async (playerId: string) => {
    setLoadingPlayerId(playerId);
    try {
      const profile = await scoutService.getPlayerPublicProfile(playerId);
      if (profile) {
        setSelectedPlayerForContact(profile);
      }
    } catch (err) {
      console.error("Error fetching player profile:", err);
    } finally {
      setLoadingPlayerId(null);
    }
  };

  const filteredShortlist = useMemo(() => {
    if (!search.trim()) return shortlist;
    const term = search.toLowerCase();
    return shortlist.filter(s => {
      const name = s.playerName?.toLowerCase() || "";
      const pos = s.playerPosition?.toLowerCase() || "";
      const notes = s.notes?.toLowerCase() || "";
      const country = s.playerCountry?.toLowerCase() || "";
      return name.includes(term) || pos.includes(term) || notes.includes(term) || country.includes(term);
    });
  }, [shortlist, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Scouting Shortlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Private player observation list, tactical dossiers, and evaluation notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            {shortlist.length} Monitored Prospects
          </span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shortlisted players by name, position, country, or notes keywords..."
          className="w-full pl-10 pr-4 py-3 bg-[#0b1326] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f59b] transition-all"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 space-y-3">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm">Loading private shortlist...</p>
        </div>
      ) : filteredShortlist.length === 0 ? (
        <div className="bg-[#0b1326] border border-white/10 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Your shortlist is empty</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {search 
              ? "No shortlisted players match your search filter."
              : "Explore the Player Discovery database to save potential prospects for trial or recruitment."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredShortlist.map(item => {
            const posStyle = getPositionColor(item.playerPosition || "Midfielder");
            const flag = getCountryFlag(item.playerCountry || "");
            const isSaving = savingId === item.id;
            const isSaved = savedSuccessId === item.id;

            return (
              <div 
                key={item.id}
                className="bg-[#0b1326] border border-white/10 hover:border-amber-500/30 rounded-xl p-5 sm:p-6 transition-all shadow-md space-y-4"
              >
                {/* Top Row: Player Info & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{flag}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-white">{item.playerName || "Academy Player"}</h3>
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
                          {item.playerPosition || "Midfielder"}
                        </span>
                        {item.playerProgress && (
                          <span className="px-2 py-0.5 text-[11px] rounded bg-[#00f59b]/10 text-[#00f59b] border border-[#00f59b]/20 font-mono font-semibold">
                            {item.playerProgress}% Readiness
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        <span>{item.playerCountry || "Academy"}</span>
                        {item.playerAge && <span> • {item.playerAge} Years</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleOpenProfile(item.playerId)}
                      disabled={loadingPlayerId === item.playerId}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00f59b]" /> View Profile
                    </button>
                    <button
                      onClick={() => handleOpenContact(item.playerId)}
                      disabled={loadingPlayerId === item.playerId}
                      className="px-3 py-1.5 bg-[#00f59b]/10 hover:bg-[#00f59b]/20 border border-[#00f59b]/30 rounded-md text-xs font-semibold text-[#00f59b] flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Inquire
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      title="Remove from shortlist"
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Private Scouting Notes Editor */}
                <div className="space-y-2 bg-[#070d18] p-4 rounded-lg border border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" /> Private Scouting Observations
                    </label>
                    {isSaved && (
                      <span className="text-xs text-[#00f59b] font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Saved
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={2}
                    value={editingNotes[item.id] !== undefined ? editingNotes[item.id] : (item.notes || "")}
                    onChange={(e) => setEditingNotes({ ...editingNotes, [item.id]: e.target.value })}
                    placeholder="Add private evaluation: technical ceiling, match intelligence, trial recommendation..."
                    className="w-full bg-[#0b1326] border border-white/10 rounded-md p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/80 transition-colors resize-none leading-relaxed"
                  />

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleSaveNotes(item)}
                      disabled={isSaving}
                      className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Save className="w-3 h-3" />
                      {isSaving ? "Saving..." : "Update Notes"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dossier Modal */}
      {selectedPlayerForProfile && (
        <ScoutPlayerProfileModal
          player={selectedPlayerForProfile}
          isShortlisted={true}
          shortlistNotes={shortlist.find(s => s.playerId === selectedPlayerForProfile.id)?.notes || ""}
          onClose={() => setSelectedPlayerForProfile(null)}
          onToggleShortlist={() => {
            const item = shortlist.find(s => s.playerId === selectedPlayerForProfile.id);
            if (item) handleRemove(item.id);
            setSelectedPlayerForProfile(null);
          }}
          onSaveNotes={async (pId, notes) => {
            const item = shortlist.find(s => s.playerId === pId);
            if (item) {
              await scoutService.updateShortlistNotes(item.id, notes);
              setShortlist(prev => prev.map(s => s.id === item.id ? { ...s, notes } : s));
            }
          }}
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

import React, { useEffect, useState } from "react";
import { 
  Star, 
  Search, 
  MapPin, 
  Calendar, 
  Trash2, 
  Edit3, 
  Save, 
  Send, 
  ExternalLink,
  Users,
  Compass
} from "lucide-react";
import { ProviderShortlist as ProviderShortlistType, PlayerPublicProfile } from "../../../types";
import { providerService } from "../services/providerService";

interface ProviderShortlistProps {
  providerId: string;
  onNavigate: (tab: string) => void;
  onOpenPlayerModal: (player: PlayerPublicProfile) => void;
  onSendMessage: (player: { userId: string; name: string }) => void;
}

export default function ProviderShortlist({
  providerId,
  onNavigate,
  onOpenPlayerModal,
  onSendMessage
}: ProviderShortlistProps) {
  const [shortlist, setShortlist] = useState<ProviderShortlistType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const loadShortlist = async () => {
    setLoading(true);
    const list = await providerService.getShortlist(providerId);
    setShortlist(list);
    setLoading(false);
  };

  useEffect(() => {
    loadShortlist();
  }, [providerId]);

  const handleRemove = async (docId: string, name: string) => {
    if (window.confirm(`Remove ${name} from your scholarship candidate shortlist?`)) {
      await providerService.removeFromShortlist(docId);
      await loadShortlist();
    }
  };

  const handleStartEditNote = (item: ProviderShortlistType) => {
    setEditingId(item.id);
    setNoteText(item.notes || "");
  };

  const handleSaveNote = async (item: ProviderShortlistType) => {
    await providerService.updateShortlistNotes(item.id, noteText);
    setEditingId(null);
    await loadShortlist();
  };

  const filtered = shortlist.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.playerName.toLowerCase().includes(q) ||
      item.playerCountry.toLowerCase().includes(q) ||
      item.playerPosition.toLowerCase().includes(q) ||
      item.notes?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            Shortlisted Candidates & Priority Prospects
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Athletes bookmarked for scholarship consideration, ongoing evaluation, and committee interviews.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#0b1326] px-3.5 py-2 rounded-xl border border-white/10">
          <span>Total Shortlisted: <strong className="text-amber-400">{shortlist.length}</strong></span>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="bg-[#0b1326] border border-white/10 p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter shortlisted players..."
            className="w-full bg-[#070d18] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
          />
        </div>

        <button
          onClick={() => onNavigate("discovery")}
          className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Compass className="w-4 h-4 text-[#00ff88]" />
          <span className="hidden sm:inline">Discover More Talent</span>
        </button>
      </div>

      {/* Shortlist Content */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">Loading shortlisted prospects...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-[#0b1326] rounded-2xl border border-white/10 p-8 space-y-3">
          <Star className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Shortlisted Players</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? "No shortlisted players match your search filter."
              : "Discover grassroots and youth talent from the Discovery page and bookmark them here."}
          </p>
          <button
            onClick={() => onNavigate("discovery")}
            className="px-4 py-2 bg-[#00ff88] hover:bg-[#00e67a] text-black text-xs font-black rounded-xl inline-flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-4 h-4" />
            Explore Players
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const isEditingThis = editingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-[#0b1326] border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  {/* Header: Player info & remove button */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-black text-amber-400 text-sm">
                        {item.playerName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.playerName}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span>{item.playerCountry}</span>
                          <span>•</span>
                          <span>{item.playerAge}y</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id, item.playerName)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Position & Level Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30">
                      {item.playerPosition}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-300">
                      Foot: {item.playerPreferredFoot || "Right"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {item.playerDevelopmentLevel || "Youth Elite"}
                    </span>
                  </div>

                  {/* Evaluation Notes Box */}
                  <div className="bg-[#070d18] p-3 rounded-xl border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                      <span>Committee Evaluation Notes:</span>
                      {isEditingThis ? (
                        <button
                          onClick={() => handleSaveNote(item)}
                          className="text-[#00ff88] hover:underline flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEditNote(item)}
                          className="text-gray-400 hover:text-white flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>

                    {isEditingThis ? (
                      <textarea
                        rows={2}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full bg-[#0b1326] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
                      />
                    ) : (
                      <p className="text-xs text-gray-300 leading-relaxed italic">
                        "{item.notes || "No private evaluation notes recorded."}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenPlayerModal({
                      id: item.playerId,
                      userId: item.playerId,
                      name: item.playerName,
                      country: item.playerCountry,
                      age: item.playerAge,
                      position: item.playerPosition,
                      preferredFoot: item.playerPreferredFoot,
                      developmentLevel: item.playerDevelopmentLevel
                    } as any)}
                    className="text-xs font-bold text-[#00ff88] hover:underline"
                  >
                    View Authorized Profile →
                  </button>

                  <button
                    onClick={() => onSendMessage({ userId: item.playerId, name: item.playerName })}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3 text-[#00ff88]" />
                    <span>Message</span>
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

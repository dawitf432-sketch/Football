import { useState, useEffect, useMemo } from "react";
import { 
  PlayCircle, 
  Search, 
  Filter, 
  Eye, 
  Star, 
  Calendar, 
  Trophy, 
  Clock, 
  Loader2, 
  ShieldCheck,
  ExternalLink,
  X
} from "lucide-react";
import { ShowcaseVideo, PlayerPublicProfile } from "../../../types";
import { scoutService } from "../services/scoutService";
import { getCountryFlag, getPositionColor } from "../components/ScoutPlayerCard";
import ScoutPlayerProfileModal from "../components/ScoutPlayerProfileModal";
import ScoutContactModal from "../components/ScoutContactModal";

interface ScoutShowcasesProps {
  user: any;
}

export default function ScoutShowcases({ user }: ScoutShowcasesProps) {
  const [videos, setVideos] = useState<ShowcaseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [activeVideoModal, setActiveVideoModal] = useState<ShowcaseVideo | null>(null);

  // Profile / Contact modals
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState<PlayerPublicProfile | null>(null);
  const [selectedPlayerForContact, setSelectedPlayerForContact] = useState<PlayerPublicProfile | null>(null);
  const [loadingPlayerId, setLoadingPlayerId] = useState<string | null>(null);

  useEffect(() => {
    loadShowcases();
  }, []);

  const loadShowcases = async () => {
    setLoading(true);
    try {
      // Strictly approved showcase videos
      const list = await scoutService.getApprovedShowcases();
      setVideos(list);
    } catch (err) {
      console.error("Error loading showcases:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlayerProfile = async (playerId: string) => {
    setLoadingPlayerId(playerId);
    try {
      const profile = await scoutService.getPlayerPublicProfile(playerId);
      if (profile) {
        setSelectedPlayerForProfile(profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlayerId(null);
    }
  };

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      if (selectedPosition !== "All") {
        if (!v.playerPosition?.toLowerCase().includes(selectedPosition.toLowerCase())) {
          return false;
        }
      }
      if (search.trim()) {
        const term = search.toLowerCase();
        const matchesTitle = v.title.toLowerCase().includes(term);
        const matchesPlayer = v.playerName.toLowerCase().includes(term);
        const matchesComp = v.matchInfo?.competition?.toLowerCase().includes(term);
        if (!matchesTitle && !matchesPlayer && !matchesComp) return false;
      }
      return true;
    });
  }, [videos, search, selectedPosition]);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return url;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PlayCircle className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Approved Match Showcases
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Authenticated match footage, scouting highlight reels, and competitive game performances.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>{videos.length} Verified Reels</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search match videos by player name, competition, or highlight title..."
            className="w-full pl-10 pr-4 py-3 bg-[#0b1326] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["All", "Goalkeeper", "Defender", "Midfielder", "Winger", "Striker"].map(pos => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPosition === pos
                  ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,229,255,0.25)]"
                  : "bg-[#0b1326] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Showcases Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm">Loading verified match footage...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="bg-[#0b1326] border border-white/10 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
            <PlayCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No showcase footage found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your search criteria or position filters to explore other footage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => {
            const posStyle = getPositionColor(video.playerPosition || "Midfielder");
            const flag = getCountryFlag(video.playerCountry || "");

            return (
              <div 
                key={video.id}
                className="bg-[#0b1326] border border-white/10 hover:border-cyan-400/50 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] group"
              >
                <div>
                  {/* Video Thumbnail / Preview Click Area */}
                  <div 
                    onClick={() => setActiveVideoModal(video)}
                    className="relative aspect-video bg-[#070d18] flex items-center justify-center cursor-pointer overflow-hidden border-b border-white/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    <div className="w-12 h-12 rounded-full bg-cyan-500/80 text-black flex items-center justify-center group-hover:scale-110 transition-transform z-20 shadow-lg">
                      <PlayCircle className="w-6 h-6 fill-black text-cyan-400" />
                    </div>
                    <span className="absolute bottom-2.5 left-3 z-20 text-[10px] font-bold text-cyan-300 uppercase tracking-widest px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-cyan-500/30">
                      Approved Reel
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{flag}</span>
                        <span className="font-bold text-white text-sm hover:text-cyan-300 transition-colors">
                          {video.playerName}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
                        {video.playerPosition || "Academy"}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}

                    {/* Match Info Badges */}
                    {video.matchInfo && (
                      <div className="space-y-1.5 pt-2 border-t border-white/5 text-[11px] text-gray-400">
                        {video.matchInfo.competition && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{video.matchInfo.competition}</span>
                          </div>
                        )}
                        {video.matchInfo.opponent && (
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-gray-500">vs:</span>
                            <span className="text-gray-200 font-medium truncate">{video.matchInfo.opponent}</span>
                            {video.matchInfo.minute && (
                              <span className="text-cyan-400 font-mono text-[10px]">({video.matchInfo.minute})</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveVideoModal(video)}
                    className="py-2 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded text-xs font-semibold text-cyan-400 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> Watch Video
                  </button>
                  <button
                    onClick={() => handleOpenPlayerProfile(video.playerId)}
                    disabled={loadingPlayerId === video.playerId}
                    className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-semibold text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Eye className="w-3.5 h-3.5" /> Scout Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b1326] border border-white/10 rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 bg-[#070d18] border-b border-white/10">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm sm:text-base truncate max-w-md">
                  {activeVideoModal.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              {activeVideoModal.videoUrl.includes("youtube.com") || activeVideoModal.videoUrl.includes("youtu.be") ? (
                <iframe
                  src={getEmbedUrl(activeVideoModal.videoUrl)}
                  title={activeVideoModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  src={activeVideoModal.videoUrl} 
                  controls 
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-5 space-y-3 bg-[#0b1326]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-white text-base">{activeVideoModal.playerName}</div>
                  <div className="text-xs text-gray-400">{activeVideoModal.playerPosition} • {activeVideoModal.playerCountry}</div>
                </div>
                <button
                  onClick={() => {
                    const pId = activeVideoModal.playerId;
                    setActiveVideoModal(null);
                    handleOpenPlayerProfile(pId);
                  }}
                  className="px-4 py-2 bg-[#00f59b] hover:bg-[#00e5ff] text-black text-xs font-bold uppercase tracking-wider rounded-md transition-all self-start sm:self-auto"
                >
                  View Full Player Dossier
                </button>
              </div>
              {activeVideoModal.description && (
                <p className="text-xs text-gray-300 leading-relaxed pt-2 border-t border-white/5">
                  {activeVideoModal.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dossier Modal */}
      {selectedPlayerForProfile && (
        <ScoutPlayerProfileModal
          player={selectedPlayerForProfile}
          isShortlisted={false}
          onClose={() => setSelectedPlayerForProfile(null)}
          onToggleShortlist={() => {}}
          onSaveNotes={async () => {}}
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
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}

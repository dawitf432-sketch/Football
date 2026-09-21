import React, { useEffect, useState } from "react";
import { 
  X, 
  Shield, 
  Star, 
  PlayCircle, 
  MapPin, 
  Calendar, 
  Send, 
  Activity, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Loader2 
} from "lucide-react";
import { PlayerPublicProfile, ShowcaseVideo } from "../../../types";
import { providerService } from "../services/providerService";

interface ProviderPlayerProfileModalProps {
  player: PlayerPublicProfile;
  isShortlisted: boolean;
  onClose: () => void;
  onToggleShortlist: (player: PlayerPublicProfile) => void;
  onSendMessage?: (player: PlayerPublicProfile) => void;
}

export default function ProviderPlayerProfileModal({
  player,
  isShortlisted,
  onClose,
  onToggleShortlist,
  onSendMessage
}: ProviderPlayerProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"dossier" | "showcases">("dossier");
  const [showcases, setShowcases] = useState<ShowcaseVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<ShowcaseVideo | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadShowcases() {
      setLoadingVideos(true);
      const list = await providerService.getPlayerShowcases(player.userId || player.id);
      if (isMounted) {
        setShowcases(list);
        if (list.length > 0) {
          setSelectedVideo(list[0]);
        }
        setLoadingVideos(false);
      }
    }
    loadShowcases();
    return () => { isMounted = false; };
  }, [player.userId, player.id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0b1326] border border-white/15 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-[#0b1326] via-[#101b38] to-[#0b1326]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-[#00b8ff]/20 border border-[#00ff88]/40 flex items-center justify-center text-xl sm:text-2xl font-black text-[#00ff88]">
              {player.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">{player.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> VERIFIED TALENT
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {player.developmentLevel || "Academy"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  {player.location || player.country}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  {player.age} Years Old
                </span>
                <span>•</span>
                <span className="font-semibold text-gray-300">
                  {player.position} {player.secondaryPosition ? `(${player.secondaryPosition})` : ""}
                </span>
                <span>•</span>
                <span className="text-gray-400">
                  Foot: <strong className="text-white">{player.preferredFoot || "Right"}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleShortlist(player)}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isShortlisted
                  ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              }`}
              title={isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
            >
              <Star className={`w-4 h-4 ${isShortlisted ? "fill-black" : ""}`} />
              <span className="hidden sm:inline">{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
            </button>
            {onSendMessage && (
              <button
                onClick={() => onSendMessage(player)}
                className="p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-bold bg-[#00ff88] text-black hover:bg-[#00e67a] flex items-center gap-1.5 transition-all"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Message</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-white/10 flex gap-6 bg-[#0b1326]">
          <button
            onClick={() => setActiveTab("dossier")}
            className={`py-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all ${
              activeTab === "dossier"
                ? "border-[#00ff88] text-[#00ff88]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Player Evaluation Dossier
          </button>
          <button
            onClick={() => setActiveTab("showcases")}
            className={`py-3 text-xs font-bold tracking-wide uppercase border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === "showcases"
                ? "border-[#00ff88] text-[#00ff88]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>Approved Showcases</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-gray-300">
              {showcases.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "dossier" ? (
            <div className="space-y-6">
              {/* Safeguarding Notice */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between text-xs text-blue-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>Authorized Scholarship Profile: Private contact information is protected in accordance with FIFA Youth Safeguarding protocols.</span>
                </div>
              </div>

              {/* Bio & Overview */}
              <div>
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">Player Biography & Background</h3>
                <p className="text-sm text-gray-300 leading-relaxed bg-[#070d18] p-4 rounded-xl border border-white/5">
                  {player.bio || "No biography provided by applicant."}
                </p>
              </div>

              {/* Technical Skills Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#00ff88]" />
                    Technical Attributes (Verified by Academy Scouts)
                  </h3>
                  <span className="text-xs font-bold text-[#00ff88]">
                    Overall: {player.skills?.overall || 80}/100
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Ball Control", val: player.skills?.ballControl || 75 },
                    { label: "Passing & Distribution", val: player.skills?.passing || 75 },
                    { label: "Shooting & Finishing", val: player.skills?.shooting || 70 },
                    { label: "1v1 Dribbling", val: player.skills?.dribbling || 75 },
                    { label: "Defensive Tackling", val: player.skills?.tackling || 65 },
                    { label: "Tactical Vision", val: player.skills?.vision || 78 },
                  ].map((attr) => (
                    <div key={attr.label} className="bg-[#070d18] p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400 font-medium">{attr.label}</span>
                        <span className="font-mono font-bold text-white">{attr.val}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00ff88] to-[#00b8ff] rounded-full"
                          style={{ width: `${Math.min(attr.val, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical & Athleticism Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#00b8ff]" />
                    Physical & Athletic Performance Metrics
                  </h3>
                  <span className="text-xs font-bold text-[#00b8ff]">
                    Athletic Index: {player.athleticism?.overall || 82}/100
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Sprint Speed & Acceleration", val: player.athleticism?.pace || 80 },
                    { label: "Aerobic Stamina", val: player.athleticism?.stamina || 80 },
                    { label: "Agility & Coordination", val: player.athleticism?.agility || 80 },
                    { label: "Core Physical Strength", val: player.athleticism?.strength || 75 },
                    { label: "Vertical Jump & Aerial Reach", val: player.athleticism?.jumping || 75 },
                    { label: "Overall Conditioning", val: player.athleticism?.overall || 82 },
                  ].map((attr) => (
                    <div key={attr.label} className="bg-[#070d18] p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400 font-medium">{attr.label}</span>
                        <span className="font-mono font-bold text-white">{attr.val}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00b8ff] to-[#7928ca] rounded-full"
                          style={{ width: `${Math.min(attr.val, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Progress Bar */}
              <div className="bg-[#070d18] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-white">Academy Readiness Index</div>
                  <div className="text-xs text-gray-400 mt-0.5">Estimated tactical and physical progression towards full scholarship placement.</div>
                </div>
                <div className="w-full sm:w-56 flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00ff88] rounded-full transition-all"
                      style={{ width: `${player.developmentProgress || 80}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm font-black text-[#00ff88]">
                    {player.developmentProgress || 80}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {loadingVideos ? (
                <div className="py-16 flex flex-col items-center justify-center text-gray-400 space-y-3">
                  <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
                  <p className="text-xs">Loading approved video archives...</p>
                </div>
              ) : showcases.length === 0 ? (
                <div className="py-16 text-center text-gray-400 bg-[#070d18] rounded-xl border border-white/5 p-6">
                  <PlayCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <div className="text-sm font-bold text-white">No Approved Showcases Yet</div>
                  <div className="text-xs text-gray-400 mt-1">
                    This player has not published verified video reels or they are awaiting administrative approval.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Video Player Display */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center relative">
                      {selectedVideo?.videoUrl?.includes("youtube") || selectedVideo?.videoUrl?.includes("youtu.be") ? (
                        <iframe
                          src={selectedVideo.videoUrl.replace("watch?v=", "embed/")}
                          title={selectedVideo.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : selectedVideo?.videoUrl ? (
                        <video
                          src={selectedVideo.videoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-500 text-xs">No video source found</div>
                      )}
                    </div>

                    {selectedVideo && (
                      <div className="bg-[#070d18] p-4 rounded-xl border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white">{selectedVideo.title}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED BY COACHES
                          </span>
                        </div>
                        <p className="text-xs text-gray-300">{selectedVideo.description}</p>
                        {selectedVideo.matchInfo && (
                          <div className="pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gray-400">
                            <div>Competition: <strong className="text-white">{selectedVideo.matchInfo.competition || "N/A"}</strong></div>
                            <div>Opponent: <strong className="text-white">{selectedVideo.matchInfo.opponent || "N/A"}</strong></div>
                            <div>Date: <strong className="text-white">{selectedVideo.matchInfo.matchDate || "N/A"}</strong></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Showcases Playlist */}
                  <div className="space-y-2">
                    <div className="text-xs font-black uppercase text-gray-400 tracking-wider">Video Reels ({showcases.length})</div>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {showcases.map((vid) => (
                        <button
                          key={vid.id}
                          onClick={() => setSelectedVideo(vid)}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${
                            selectedVideo?.id === vid.id
                              ? "bg-[#00ff88]/10 border-[#00ff88]/50 text-white"
                              : "bg-[#070d18] border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <PlayCircle className={`w-4 h-4 ${selectedVideo?.id === vid.id ? "text-[#00ff88]" : "text-gray-400"}`} />
                            <span className="truncate">{vid.title}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 truncate">
                            {vid.matchInfo?.competition || vid.description || "Match highlight reel"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#070d18] flex items-center justify-between text-xs text-gray-400">
          <span>Candidate ID: <code className="text-gray-300 font-mono">{player.userId || player.id}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

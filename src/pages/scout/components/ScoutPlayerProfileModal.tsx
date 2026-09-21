import { useState, useEffect } from "react";
import { 
  X, 
  Star, 
  Send, 
  PlayCircle, 
  Activity, 
  ShieldCheck, 
  Award, 
  FileText, 
  Footprints, 
  MapPin, 
  Calendar, 
  Save, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { PlayerPublicProfile, ShowcaseVideo } from "../../../types";
import { getCountryFlag, getPositionColor } from "./ScoutPlayerCard";
import { scoutService } from "../services/scoutService";

interface ScoutPlayerProfileModalProps {
  player: PlayerPublicProfile | null;
  isShortlisted: boolean;
  shortlistNotes?: string;
  onClose: () => void;
  onToggleShortlist: (player: PlayerPublicProfile) => void;
  onSaveNotes: (playerId: string, notes: string) => Promise<void>;
  onRequestContact: (player: PlayerPublicProfile) => void;
}

export default function ScoutPlayerProfileModal({
  player,
  isShortlisted,
  shortlistNotes = "",
  onClose,
  onToggleShortlist,
  onSaveNotes,
  onRequestContact
}: ScoutPlayerProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"METRICS" | "SHOWCASES" | "NOTES">("METRICS");
  const [showcases, setShowcases] = useState<ShowcaseVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [notes, setNotes] = useState(shortlistNotes);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ShowcaseVideo | null>(null);

  useEffect(() => {
    setNotes(shortlistNotes);
  }, [shortlistNotes]);

  useEffect(() => {
    if (player) {
      setLoadingVideos(true);
      scoutService.getApprovedShowcases(player.id)
        .then(videos => {
          setShowcases(videos);
          if (videos.length > 0) {
            setActiveVideo(videos[0]);
          }
        })
        .finally(() => setLoadingVideos(false));
    }
  }, [player]);

  if (!player) return null;

  const flag = getCountryFlag(player.country);
  const posColor = getPositionColor(player.position);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await onSaveNotes(player.id, notes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNotes(false);
    }
  };

  // Safe technical attributes
  const technicalList = [
    { label: "Ball Control", value: player.skills?.ballControl || 82 },
    { label: "Passing", value: player.skills?.passing || 80 },
    { label: "Shooting", value: player.skills?.shooting || 78 },
    { label: "Dribbling", value: player.skills?.dribbling || 84 },
    { label: "Tackling", value: player.skills?.tackling || 70 },
    { label: "Vision", value: player.skills?.vision || 82 },
  ];

  // Safe athleticism attributes
  const athleticismList = [
    { label: "Sprint Speed", value: player.athleticism?.pace || 86 },
    { label: "Stamina", value: player.athleticism?.stamina || 85 },
    { label: "Agility", value: player.athleticism?.agility || 84 },
    { label: "Physical Strength", value: player.athleticism?.strength || 78 },
    { label: "Vertical Jump", value: player.athleticism?.jumping || 76 },
  ];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b1326] border border-white/10 rounded-xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-[#070d18] p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00f59b]/20 to-[#00e5ff]/10 border border-[#00f59b]/30 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              {flag}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {player.name}
                </h2>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded border ${posColor.bg} ${posColor.text} ${posColor.border}`}>
                  {player.position}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-white/5 text-gray-300 border border-white/10">
                  {player.developmentLevel}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" /> {player.location || player.country}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" /> {player.age} Years Old
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-gray-500" /> Preferred Foot: <strong className="text-white">{player.preferredFoot}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => onToggleShortlist(player)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isShortlisted
                  ? "bg-[#00f59b]/20 text-[#00f59b] border border-[#00f59b]/40"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              }`}
            >
              <Star className={`w-4 h-4 ${isShortlisted ? "fill-[#00f59b]" : ""}`} />
              <span>{isShortlisted ? "Shortlisted" : "Add to Shortlist"}</span>
            </button>

            <button
              onClick={() => onRequestContact(player)}
              className="px-4 py-2 bg-[#00f59b] hover:bg-[#00e5ff] text-black rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,245,155,0.2)]"
            >
              <Send className="w-3.5 h-3.5" /> Request Contact
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-white/10 bg-[#080f20] shrink-0 gap-6">
          <button
            onClick={() => setActiveTab("METRICS")}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "METRICS"
                ? "border-[#00f59b] text-[#00f59b]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Activity className="w-4 h-4" /> Attributes & Analysis
          </button>
          <button
            onClick={() => setActiveTab("SHOWCASES")}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "SHOWCASES"
                ? "border-[#00f59b] text-[#00f59b]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <PlayCircle className="w-4 h-4" /> Approved Showcases ({showcases.length})
          </button>
          <button
            onClick={() => setActiveTab("NOTES")}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "NOTES"
                ? "border-[#00f59b] text-[#00f59b]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <FileText className="w-4 h-4" /> Private Scouting Notes
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === "METRICS" && (
            <div className="space-y-6">
              {/* Scouting Overview Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#070d18] border border-white/5 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Development Progress</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#00f59b] font-mono">
                      {player.developmentProgress}%
                    </span>
                    <span className="text-xs text-gray-500">Benchmark Ready</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-[#00f59b] h-full rounded-full" 
                      style={{ width: `${player.developmentProgress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#070d18] border border-white/5 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Scout Readiness Category</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {player.developmentLevel}
                  </div>
                  <div className="text-xs text-[#00e5ff] mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Scouting Assessment
                  </div>
                </div>

                <div className="bg-[#070d18] border border-white/5 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Verified Showcases</div>
                  <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                    <span className="text-2xl font-mono font-bold text-cyan-400">{showcases.length}</span> Match Reels
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Admin Approved & Authenticated
                  </div>
                </div>
              </div>

              {/* Bio & Playing Profile */}
              <div className="bg-[#070d18] border border-white/5 rounded-lg p-5 space-y-2">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00f59b]" /> Tactical Dossier & Playing Style
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {player.bio || "Versatile academy prospect demonstrating high technical ceiling, composed decision making under tactical press, and strong developmental work ethic."}
                </p>
              </div>

              {/* Dual Attribute Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Technical Skills */}
                <div className="bg-[#070d18] border border-white/5 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Technical Ratings</h4>
                    <span className="text-xs font-mono font-bold text-[#00f59b]">
                      Avg: {player.skills?.overall || 82}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {technicalList.map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs text-gray-300 mb-1">
                          <span>{item.label}</span>
                          <span className="font-mono font-bold text-white">{item.value} / 99</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-[#00f59b] h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Athleticism */}
                <div className="bg-[#070d18] border border-white/5 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Athleticism & Physicality</h4>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Avg: {player.athleticism?.overall || 83}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {athleticismList.map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs text-gray-300 mb-1">
                          <span>{item.label}</span>
                          <span className="font-mono font-bold text-white">{item.value} / 99</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-[#00e5ff] h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "SHOWCASES" && (
            <div className="space-y-6">
              {showcases.length === 0 ? (
                <div className="p-12 text-center bg-[#070d18] rounded-lg border border-white/5 text-gray-400 space-y-2">
                  <PlayCircle className="w-8 h-8 mx-auto text-gray-600" />
                  <p className="text-sm">No approved showcase reels are currently available for this player.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected Video Player */}
                  {activeVideo && (
                    <div className="bg-[#070d18] border border-white/10 rounded-xl overflow-hidden shadow-lg">
                      <div className="aspect-video w-full bg-black relative">
                        {activeVideo.videoUrl.includes("youtube.com") || activeVideo.videoUrl.includes("youtu.be") ? (
                          <iframe
                            src={getEmbedUrl(activeVideo.videoUrl)}
                            title={activeVideo.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video 
                            src={activeVideo.videoUrl} 
                            controls 
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-base">{activeVideo.title}</h4>
                          <span className="px-2 py-0.5 text-xs bg-[#00f59b]/10 text-[#00f59b] border border-[#00f59b]/30 rounded">
                            Approved Footage
                          </span>
                        </div>
                        {activeVideo.description && (
                          <p className="text-xs text-gray-300">{activeVideo.description}</p>
                        )}
                        {activeVideo.matchInfo && (
                          <div className="flex flex-wrap gap-3 pt-2 text-xs text-gray-400 border-t border-white/5">
                            {activeVideo.matchInfo.competition && (
                              <span>Competition: <strong className="text-white">{activeVideo.matchInfo.competition}</strong></span>
                            )}
                            {activeVideo.matchInfo.opponent && (
                              <span>Opponent: <strong className="text-white">{activeVideo.matchInfo.opponent}</strong></span>
                            )}
                            {activeVideo.matchInfo.matchDate && (
                              <span>Date: <strong className="text-white">{activeVideo.matchInfo.matchDate}</strong></span>
                            )}
                            {activeVideo.matchInfo.minute && (
                              <span>Key Minutes: <strong className="text-white">{activeVideo.matchInfo.minute}</strong></span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* List of Available Showcases */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Approved Match Videos</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {showcases.map(v => (
                        <div
                          key={v.id}
                          onClick={() => setActiveVideo(v)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                            activeVideo?.id === v.id
                              ? "bg-[#00f59b]/10 border-[#00f59b]/50 text-white"
                              : "bg-[#070d18] border-white/5 hover:border-white/20 text-gray-300"
                          }`}
                        >
                          <PlayCircle className={`w-5 h-5 shrink-0 mt-0.5 ${activeVideo?.id === v.id ? "text-[#00f59b]" : "text-gray-400"}`} />
                          <div className="min-w-0">
                            <div className="font-semibold text-xs truncate text-white">{v.title}</div>
                            <div className="text-[11px] text-gray-400 truncate">
                              {v.matchInfo?.competition || "Academy Competition"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "NOTES" && (
            <div className="space-y-4">
              <div className="p-4 bg-[#070d18] border border-white/5 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Confidential Scout Assessment
                  </h4>
                  {notesSaved && (
                    <span className="text-xs text-[#00f59b] flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" /> Notes Saved to Shortlist
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  Scouting observations are strictly private to your scout account. Neither the player, coaches, nor other scouts can read your private notes.
                </p>
              </div>

              <textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Record technical strengths, tactical instincts, match rating, trial recommendations, and contract assessment..."
                className="w-full bg-[#070d18] border border-white/10 rounded-lg p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f59b] transition-colors resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {notes ? `${notes.length} characters written` : "No notes logged yet"}
                </span>
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-5 py-2 bg-[#00f59b] hover:bg-[#00e5ff] text-black text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,155,0.15)] disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" /> {savingNotes ? "Saving..." : "Save Private Notes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

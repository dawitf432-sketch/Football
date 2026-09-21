import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Video, ShieldCheck, Play, X, Sparkles, Filter, CheckCircle2, UserCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

interface ShowcaseItem {
  id: string;
  title: string;
  position: string;
  ageGroup: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string;
  adminApproved: boolean;
  tags: string[];
}

const DEFAULT_APPROVED_SHOWCASES: ShowcaseItem[] = [
  {
    id: "sc-1",
    title: "1v1 Isolation & Low Driven Finishes Under Press",
    position: "Right Winger (RW)",
    ageGroup: "U18 (17 yrs)",
    duration: "2:14",
    thumbnailUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    adminApproved: true,
    tags: ["Explosive Speed", "Weak Foot", "1v1 Dribble"]
  },
  {
    id: "sc-2",
    title: "360 Blindspot Scanning & 40m Diagonal Switches",
    position: "Central Midfielder (CM)",
    ageGroup: "U19 (18 yrs)",
    duration: "2:45",
    thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    adminApproved: true,
    tags: ["Tactical IQ", "Long Passing", "Tempo Control"]
  },
  {
    id: "sc-3",
    title: "High Line Sweeping & 1v1 Reaction K-Blocks",
    position: "Goalkeeper (GK)",
    ageGroup: "U17 (16 yrs)",
    duration: "1:58",
    thumbnailUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    adminApproved: true,
    tags: ["Reflexes", "Sweeper Keeper", "Command of Box"]
  },
  {
    id: "sc-4",
    title: "Box Separation & Ruthless Near-Post Cutback Finishes",
    position: "Centre Forward (ST)",
    ageGroup: "U18 (17 yrs)",
    duration: "2:30",
    thumbnailUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    adminApproved: true,
    tags: ["Clinical Finishing", "Movement", "Aerial Headers"]
  }
];

export default function PlayerShowcaseSection() {
  const { t } = useLanguage();
  const [showcases, setShowcases] = useState<ShowcaseItem[]>(DEFAULT_APPROVED_SHOWCASES);
  const [activeVideo, setActiveVideo] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    fetch("/api/public/showcases")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load showcases");
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Normalize server showcase records
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title || "Match Highlight Reel",
            position: d.position || "Player",
            ageGroup: d.ageGroup || "U18",
            duration: d.duration || "2:00",
            thumbnailUrl: d.thumbnailUrl || DEFAULT_APPROVED_SHOWCASES[0].thumbnailUrl,
            videoUrl: d.videoUrl,
            adminApproved: d.status === "APPROVED" || d.adminApproved === true,
            tags: Array.isArray(d.tags) ? d.tags : ["Match Action", "Skill"]
          }));
          setShowcases(mapped);
        }
      })
      .catch(() => {
        // Fallback to curated showcases
      });
  }, []);

  const handleDiscoverClick = () => {
    const el = document.getElementById("scouting");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="showcase" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#03060f] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#ff0055]/10 text-[#ff0055] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#ff0055]/20">
            <Video className="w-3.5 h-3.5" />
            {t.showcase.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.showcase.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.showcase.subtitle}
          </p>
        </div>

        {/* Safeguarding & Verification Rule Banner */}
        <div className="mb-12 p-4 sm:p-5 rounded-sm bg-gradient-to-r from-black via-[#0b1020] to-black border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs text-gray-300">
              <span className="font-bold text-white uppercase block mb-0.5">Strict Video Verification Protocol</span>
              {t.showcase.safeguardingRule}
            </div>
          </div>

          <button
            onClick={handleDiscoverClick}
            className="shrink-0 px-5 py-2.5 rounded-sm bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/15 flex items-center gap-2 cursor-pointer"
          >
            <span>{t.showcase.discoverCta}</span>
            <ArrowRight className="w-4 h-4 text-[#00ff88]" />
          </button>
        </div>

        {/* Showcase Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {showcases.map((sc) => (
            <div
              key={sc.id}
              className="bg-[#080d1a] border border-white/10 rounded-sm overflow-hidden hover:border-[#00ff88]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Video Thumbnail with Play Button */}
                <div
                  onClick={() => setActiveVideo(sc)}
                  className="relative aspect-video bg-black cursor-pointer overflow-hidden group/thumb"
                >
                  <img
                    src={sc.thumbnailUrl}
                    alt={sc.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#00ff88] text-black flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Admin Verified Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-black/80 backdrop-blur-md border border-[#00ff88]/40 text-[10px] font-mono font-bold text-[#00ff88] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.showcase.verifiedBadge}
                  </div>

                  {/* Duration pill */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-sm bg-black/80 text-white font-mono text-[10px] font-semibold">
                    {sc.duration}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-2">
                    <span className="text-[#00b8ff] font-bold uppercase">{sc.position}</span>
                    <span>{sc.ageGroup}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-2 mb-3 leading-snug group-hover:text-[#00ff88] transition-colors">
                    {sc.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {sc.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-sm bg-white/5 text-gray-400 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <button
                  onClick={() => setActiveVideo(sc)}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/5"
                >
                  <Play className="w-3 h-3 text-[#00ff88] fill-current" />
                  {t.showcase.watchHighlight}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Player Upload CTA prompt */}
        <div className="p-6 rounded-sm bg-[#0a0e1c] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs text-gray-300">
            <span className="font-bold text-white uppercase block mb-1">Want your match footage showcased here?</span>
            {t.showcase.submitPrompt}
          </div>
          <Link
            to="/access"
            className="shrink-0 px-5 py-2.5 bg-[#00ff88] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm hover:bg-[#00e67a] transition-all"
          >
            Upload in Portal
          </Link>
        </div>

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0a0e1c] border border-white/20 rounded-sm max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative">
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-sm bg-[#00ff88]/20 border border-[#00ff88]/40 text-[#00ff88] text-xs font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ADMIN VERIFIED CLIP
                </span>
                <span className="text-xs font-mono text-gray-400">{activeVideo.position} • {activeVideo.ageGroup}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-4">
                {activeVideo.title}
              </h3>

              {/* Video Element */}
              <div className="relative aspect-video bg-black rounded-sm overflow-hidden mb-4 border border-white/10">
                <video
                  src={activeVideo.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  {activeVideo.tags.map((tag, i) => (
                    <span key={i} className="font-mono bg-white/5 px-2 py-0.5 rounded-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-gray-500">Duration: {activeVideo.duration}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

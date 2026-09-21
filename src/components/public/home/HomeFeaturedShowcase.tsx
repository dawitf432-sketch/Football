import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Eye, ShieldCheck, Trophy, MapPin } from "lucide-react";

export default function HomeFeaturedShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const highlights = [
    {
      id: "sh-01",
      playerName: "Marcus Vance",
      age: 18,
      position: "Center Attacking Mid",
      club: "West London Academy",
      country: "England",
      title: "Tactical Scanning & 35-Yard Through Ball Assist",
      views: 342,
      duration: "0:45",
      verified: true,
      thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "sh-02",
      playerName: "Luka Modrician",
      age: 17,
      position: "Deep-Lying Playmaker",
      club: "Balkans Elite FC",
      country: "Croatia",
      title: "Press-Resistance & Trivela Switch vs U19 Pro Team",
      views: 512,
      duration: "1:12",
      verified: true,
      thumbnail: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "sh-03",
      playerName: "Kofi Boateng",
      age: 19,
      position: "Right Winger",
      club: "Accra Talent Academy",
      country: "Ghana",
      title: "1v1 Isolation Burst & Top-Corner Curler",
      views: 890,
      duration: "0:38",
      verified: true,
      thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "sh-04",
      playerName: "Tiago Silva Santos",
      age: 18,
      position: "Ball-Playing Center Back",
      club: "Porto Regional U19",
      country: "Portugal",
      title: "Last-Man Recovery Slide & 40m Diag Distribution",
      views: 420,
      duration: "0:58",
      verified: true,
      thumbnail: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#030611] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono font-bold text-[#00d4ff] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3 h-3 text-[#00d4ff]" />
              <span>Admin & Scout Verified Film</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-mono">
              Talent Showcase & Match Footage
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mt-1">
              Uncut, authenticated match film inspected by licensed UEFA coaches and FIFA scouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-sm p-1">
              <button
                onClick={() => handleScroll("left")}
                aria-label="Previous showcase"
                className="p-1.5 hover:bg-white/10 rounded-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="Next showcase"
                className="p-1.5 hover:bg-white/10 rounded-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/showcase"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-[#00d4ff] hover:text-white border border-[#00d4ff]/40 font-mono text-xs uppercase font-bold tracking-wider transition-all"
            >
              <span>View All Showcases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Video Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {highlights.map((item) => (
            <div
              key={item.id}
              className="min-w-[280px] sm:min-w-[320px] max-w-[340px] rounded-sm bg-[#050a1a] border border-white/10 overflow-hidden flex flex-col justify-between shrink-0 group hover:border-[#00d4ff]/40 transition-all"
              style={{ scrollSnapAlign: "start" }}
            >
              <div>
                {/* Video Preview Frame */}
                <div className="relative h-44 w-full overflow-hidden bg-black">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a1a] via-black/40 to-transparent"></div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/70 border border-[#00d4ff] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                      <Play className="w-4 h-4 text-[#00d4ff] ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-sm bg-black/80 border border-white/10 text-[10px] font-mono font-bold text-white flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#00d4ff]" /> {item.country}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-sm bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40 text-[10px] font-mono font-bold flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-gray-300">
                    <span className="bg-black/80 px-2 py-0.5 rounded-sm">{item.duration}</span>
                    <span className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded-sm text-gray-300">
                      <Eye className="w-3 h-3 text-[#00d4ff]" /> {item.views} Scout Reviews
                    </span>
                  </div>
                </div>

                {/* Athlete Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-1">
                    <span className="text-[#00d4ff] font-bold">{item.position}</span>
                    <span>Age {item.age}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#00d4ff] transition-colors mb-2">
                    {item.playerName}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {item.title}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0">
                <Link
                  to="/showcase"
                  className="w-full py-2 px-3 rounded-sm bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 border border-white/10 group-hover:border-[#00d4ff]/30 transition-all"
                >
                  <span>Inspect Scouting Dossier</span>
                  <ArrowRight className="w-3 h-3 text-[#00d4ff]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

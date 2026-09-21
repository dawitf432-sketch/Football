import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Flame,
  ShieldCheck,
  Eye,
  MapPin,
  Calendar,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";

export default function CompactFeaturedHub() {
  const [activeTab, setActiveTab] = useState<"training" | "showcase" | "opportunities">("training");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Exactly 3 Featured Training Items
  const featuredTraining = [
    {
      id: "tr-01",
      title: "Inverted Sole V-Cut & Push",
      category: "Ball Mastery",
      difficulty: "PRO",
      duration: "18 Mins",
      intensity: "High",
      reps: "4 Sets x 90s",
      summary: "Tight-space deceleration and immediate change-of-angle out of defensive trap.",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "tr-02",
      title: "Third-Man Wall Pass Combination",
      category: "Passing & Tempo",
      difficulty: "ADVANCED",
      duration: "25 Mins",
      intensity: "Max",
      reps: "5 Sets x 12 Reps",
      summary: "High-tempo one-touch sequence disorganizing low defensive blocks.",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "tr-03",
      title: "0-15m Decoupled Acceleration",
      category: "Athleticism",
      difficulty: "ELITE",
      duration: "22 Mins",
      intensity: "Max",
      reps: "8 Sprints",
      summary: "Ground-reaction biomechanics and explosive stride frequency off stationary start.",
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=600&auto=format&fit=crop",
    },
  ];

  // Exactly 3 Featured Showcase Items
  const featuredShowcase = [
    {
      id: "sh-01",
      playerName: "Marcus Vance",
      age: 18,
      position: "Center Attacking Mid",
      country: "England",
      title: "Tactical Scanning & 35-Yard Through Ball Assist",
      views: 342,
      duration: "0:45",
      thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "sh-02",
      playerName: "Luka Modrician",
      age: 17,
      position: "Deep-Lying Playmaker",
      country: "Croatia",
      title: "Press-Resistance & Trivela Switch vs U19 Pro Team",
      views: 512,
      duration: "1:12",
      thumbnail: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "sh-03",
      playerName: "Kofi Boateng",
      age: 19,
      position: "Right Winger",
      country: "Ghana",
      title: "1v1 Isolation Burst & Top-Corner Curler",
      views: 890,
      duration: "0:38",
      thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    },
  ];

  // Exactly 3 Featured Opportunities
  const featuredOpportunities = [
    {
      id: "op-01",
      title: "European Academy 10-Month Residency",
      provider: "Global Football Foundation",
      location: "Valencia, Spain",
      value: "€42,000 Fully Funded",
      deadline: "Oct 15, 2026",
      badge: "ELITE RESIDENCY",
      criteria: "Ages 16-19 • Verified Match Reel • Minimum 3.0 GPA",
    },
    {
      id: "op-02",
      title: "NCAA Division 1 Showcase Grant",
      provider: "American Soccer Pathway Trust",
      location: "North Carolina, USA",
      value: "$18,500 Direct Grant",
      deadline: "Nov 01, 2026",
      badge: "COLLEGIATE SCHOLARSHIP",
      criteria: "Ages 17-20 • High School Graduate • SAT/ACT Standard",
    },
    {
      id: "op-03",
      title: "Pro Combine Trial & Direct Scouting Week",
      provider: "Scandinavian Talent Alliance",
      location: "Gothenburg, Sweden",
      value: "Travel & Trial Covered",
      deadline: "Nov 20, 2026",
      badge: "CLUB TRIAL",
      criteria: "Ages 17-22 • Physical Yo-Yo Level 19.5+ • Coach Endorsed",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#030611] border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Compact Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-1">
              Featured Content
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono">
              Elite Training & Scouting Spotlight
            </h2>
          </div>

          {/* Interactive Category Selector */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-sm self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("training")}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "training"
                  ? "bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Training (3)
            </button>
            <button
              onClick={() => setActiveTab("showcase")}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "showcase"
                  ? "bg-[#00d4ff] text-black shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Showcase (3)
            </button>
            <button
              onClick={() => setActiveTab("opportunities")}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "opportunities"
                  ? "bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Opportunities (3)
            </button>
          </div>
        </div>

        {/* Carousel Controls & "View All" Link */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono text-gray-400">
            {activeTab === "training" && "Selected from 260+ UEFA analyzed drills"}
            {activeTab === "showcase" && "Selected from verified match film uploads"}
            {activeTab === "opportunities" && "Vetted institutional scholarships & trials"}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-sm p-0.5">
              <button
                onClick={() => handleScroll("left")}
                aria-label="Previous"
                className="p-1 hover:bg-white/10 rounded-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="Next"
                className="p-1 hover:bg-white/10 rounded-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {activeTab === "training" && (
              <Link
                to="/training"
                className="text-xs font-mono font-bold text-[#00ff88] hover:underline flex items-center gap-1"
              >
                <span>View All Drills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            {activeTab === "showcase" && (
              <Link
                to="/showcase"
                className="text-xs font-mono font-bold text-[#00d4ff] hover:underline flex items-center gap-1"
              >
                <span>View All Showcases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            {activeTab === "opportunities" && (
              <Link
                to="/scholarships"
                className="text-xs font-mono font-bold text-[#00ff88] hover:underline flex items-center gap-1"
              >
                <span>View All Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Horizontal Slider Area - exactly 3 cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {/* TAB 1: TRAINING */}
          {activeTab === "training" &&
            featuredTraining.map((drill) => (
              <div
                key={drill.id}
                className="min-w-[280px] sm:min-w-[320px] flex-1 max-w-[360px] rounded-sm bg-[#050a1a] border border-white/10 overflow-hidden flex flex-col justify-between shrink-0 group hover:border-[#00ff88]/40 transition-all"
                style={{ scrollSnapAlign: "start" }}
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-black">
                    <img
                      src={drill.image}
                      alt={drill.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050a1a] via-black/20 to-transparent"></div>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-sm bg-black/80 border border-white/10 text-[10px] font-mono font-bold text-[#00ff88]">
                        {drill.category}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-sm bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 text-[10px] font-mono font-bold">
                        {drill.difficulty}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-3 text-[10px] font-mono text-gray-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#00ff88]" /> {drill.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" /> {drill.reps}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-white mb-1.5 leading-snug group-hover:text-[#00ff88] transition-colors">
                      {drill.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {drill.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    to="/training"
                    className="w-full py-2 px-3 rounded-sm bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-[#00ff88]/40 transition-all"
                  >
                    <Play className="w-3 h-3 text-[#00ff88]" />
                    <span>Start Session</span>
                  </Link>
                </div>
              </div>
            ))}

          {/* TAB 2: SHOWCASE */}
          {activeTab === "showcase" &&
            featuredShowcase.map((item) => (
              <div
                key={item.id}
                className="min-w-[280px] sm:min-w-[320px] flex-1 max-w-[360px] rounded-sm bg-[#050a1a] border border-white/10 overflow-hidden flex flex-col justify-between shrink-0 group hover:border-[#00d4ff]/40 transition-all"
                style={{ scrollSnapAlign: "start" }}
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-black">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050a1a] via-black/30 to-transparent"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-black/70 border border-[#00d4ff] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 text-[#00d4ff] ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-sm bg-black/80 border border-white/10 text-[10px] font-mono font-bold text-white flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#00d4ff]" /> {item.country}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-sm bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40 text-[10px] font-mono font-bold flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-gray-300">
                      <span className="bg-black/80 px-2 py-0.5 rounded-sm">{item.duration}</span>
                      <span className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded-sm">
                        <Eye className="w-3 h-3 text-[#00d4ff]" /> {item.views} Reviews
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-1">
                      <span className="text-[#00d4ff] font-bold">{item.position}</span>
                      <span>Age {item.age}</span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#00d4ff] transition-colors mb-1.5">
                      {item.playerName}
                    </h3>
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {item.title}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    to="/showcase"
                    className="w-full py-2 px-3 rounded-sm bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 border border-white/10 group-hover:border-[#00d4ff]/40 transition-all"
                  >
                    <span>Inspect Scouting Reel</span>
                    <ArrowRight className="w-3 h-3 text-[#00d4ff]" />
                  </Link>
                </div>
              </div>
            ))}

          {/* TAB 3: OPPORTUNITIES */}
          {activeTab === "opportunities" &&
            featuredOpportunities.map((item) => (
              <div
                key={item.id}
                className="min-w-[280px] sm:min-w-[320px] flex-1 max-w-[360px] rounded-sm bg-[#050a1a] border border-white/10 p-5 flex flex-col justify-between shrink-0 group hover:border-[#00ff88]/40 transition-all"
                style={{ scrollSnapAlign: "start" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-white/5 text-[#00ff88] border border-[#00ff88]/30">
                      {item.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#00d4ff]">
                      {item.value}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 leading-snug group-hover:text-[#00ff88] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-400 font-mono mb-3">
                    {item.provider} • <span className="text-gray-300">{item.location}</span>
                  </p>

                  <div className="space-y-1.5 text-xs font-mono text-gray-300 bg-black/40 p-2.5 rounded-sm border border-white/5 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>Deadline: {item.deadline}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    <strong className="text-gray-300">Criteria:</strong> {item.criteria}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5">
                  <Link
                    to="/scholarships"
                    className="w-full py-2 px-3 rounded-sm bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-[#00ff88]/40 transition-all"
                  >
                    <span>View Guidelines</span>
                    <ArrowRight className="w-3 h-3 text-[#00ff88]" />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

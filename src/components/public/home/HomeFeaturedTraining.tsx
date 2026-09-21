import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Clock, Flame, ShieldAlert, Sparkles } from "lucide-react";

export default function HomeFeaturedTraining() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = ["ALL", "BALL MASTERY", "PASSING & TEMPO", "1V1 DOMINANCE", "TACTICS", "SPEED"];

  const drills = [
    {
      id: "bm-01",
      title: "Inverted Sole V-Cut & Push",
      category: "BALL MASTERY",
      difficulty: "PRO",
      duration: "18 Mins",
      intensity: "High",
      reps: "4 Sets x 90s",
      summary: "Tight-space deceleration and immediate change-of-angle out of defensive trap.",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "pt-02",
      title: "Third-Man Wall Pass Combination",
      category: "PASSING & TEMPO",
      difficulty: "ADVANCED",
      duration: "25 Mins",
      intensity: "Max",
      reps: "5 Sets x 12 Reps",
      summary: "High-tempo one-touch sequence disorganizing low defensive blocks.",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "1v1-03",
      title: "Body Feint & Explosive Burst",
      category: "1V1 DOMINANCE",
      difficulty: "ELITE",
      duration: "20 Mins",
      intensity: "High",
      reps: "6 Sets x 4 Reps",
      summary: "Drop-shoulder balance manipulation to create immediate crossing corridor.",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "tac-04",
      title: "Transition Counter-Press Triggers",
      category: "TACTICS",
      difficulty: "ADVANCED",
      duration: "30 Mins",
      intensity: "Pro",
      reps: "4 Sets x 5 Mins",
      summary: "5-second recovery window to collapse passing lanes upon possession turnover.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "spd-05",
      title: "0-15m Decoupled Acceleration",
      category: "SPEED",
      difficulty: "PRO",
      duration: "22 Mins",
      intensity: "Max",
      reps: "8 Sprints",
      summary: "Ground-reaction biomechanics and stride frequency off stationary start.",
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const filteredDrills = activeCategory === "ALL"
    ? drills
    : drills.filter((d) => d.category === activeCategory);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#02050e] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title & Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#00ff88]" />
              <span>Elite Training System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-mono">
              Featured Training Drills
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mt-1">
              Access 260+ video-analyzed drills categorized by difficulty, positional role, and tactical objective.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Buttons */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-sm p-1">
              <button
                onClick={() => handleScroll("left")}
                aria-label="Previous drills"
                className="p-1.5 hover:bg-white/10 rounded-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="Next drills"
                className="p-1.5 hover:bg-white/10 rounded-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/training"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-mono text-xs uppercase font-black tracking-wider transition-all"
            >
              <span>View All 260+ Drills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-white/15 text-[#00ff88] border border-[#00ff88]/40"
                  : "bg-white/5 text-gray-400 hover:text-white border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Horizontal Drill Cards Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {filteredDrills.map((drill) => (
            <div
              key={drill.id}
              className="min-w-[280px] sm:min-w-[320px] max-w-[340px] rounded-sm bg-[#050a1a] border border-white/10 overflow-hidden flex flex-col justify-between shrink-0 group hover:border-[#00ff88]/40 transition-all"
              style={{ scrollSnapAlign: "start" }}
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-black">
                  <img
                    src={drill.image}
                    alt={drill.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a1a] via-black/30 to-transparent"></div>
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-sm bg-black/70 border border-white/10 text-[10px] font-mono font-bold text-[#00ff88]">
                      {drill.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-sm bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 text-[10px] font-mono font-bold">
                      {drill.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[11px] font-mono text-gray-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00ff88]" /> {drill.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#ff9900]" /> {drill.reps}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-[#00ff88] transition-colors">
                    {drill.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {drill.summary}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <Link
                  to="/training"
                  className="w-full py-2 px-3 rounded-sm bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-[#00ff88]/30 transition-all"
                >
                  <Play className="w-3 h-3 text-[#00ff88]" />
                  <span>Start Drill Session</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

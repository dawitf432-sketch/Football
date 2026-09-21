import { useState, useEffect } from "react";
import {
  Trophy,
  ArrowRight,
  PlayCircle,
  Activity,
  Zap,
  Target,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cacheLocalData, getLocalCachedData, useOfflineStatus } from "../../../lib/offlineSync";

export default function PlayerOverview({ user }: { user: any }) {
  const { isOffline } = useOfflineStatus();
  const [activeTab, setActiveTab] = useState<"daily" | "course" | "metrics">("daily");

  const [stats, setStats] = useState(() => {
    return (
      getLocalCachedData<any>("player_overview_stats") || {
        overallDev: 78,
        ballMastery: 84,
        acceleration: "4.12s",
        yoYoLevel: "19.8",
        drillsCompleted: 16,
        courseProgress: 65,
      }
    );
  });

  useEffect(() => {
    // Cache the latest stats for offline-first resilience
    cacheLocalData("player_overview_stats", stats);
  }, [stats]);

  const dailyDrills = [
    {
      id: "d1",
      title: "Inverted Sole V-Cut",
      category: "Ball Mastery",
      sets: "4 x 90s",
      status: "COMPLETED",
    },
    {
      id: "d2",
      title: "Third-Man Wall Combination",
      category: "Passing & Tempo",
      sets: "5 x 12 Reps",
      status: "IN_PROGRESS",
    },
    {
      id: "d3",
      title: "Decoupled 15m Acceleration",
      category: "Athleticism",
      sets: "8 Sprints",
      status: "PENDING",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Athlete Banner - Compact */}
      <div className="bg-[#050a1a] border border-white/10 p-5 sm:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider">
              Athlete Passport Active
            </span>
            {isOffline && (
              <span className="px-2 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 text-[10px] font-mono flex items-center gap-1 border border-amber-500/30">
                <WifiOff className="w-2.5 h-2.5" /> Offline Storage
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono">
            Welcome, {user?.name?.split(" ")[0] || "Athlete"}
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            UEFA certified development pathway. Daily technical quota and physical benchmarks are synchronized.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Link
            to="/player/training"
            className="px-4 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-mono font-black text-xs uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.2)]"
          >
            <span>Today's Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/player/showcase"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-sm border border-white/10 transition-colors"
          >
            Showcase Reel
          </Link>
        </div>
      </div>

      {/* 4 Important Statistics First */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#050a1a] border border-white/10 p-4 rounded-sm flex flex-col justify-between hover:border-[#00ff88]/30 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>Overall Index</span>
            <Target className="w-3.5 h-3.5 text-[#00ff88]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.overallDev}%
          </div>
          <div className="text-[11px] font-mono text-[#00ff88] mt-1">+4% this cycle</div>
        </div>

        <div className="bg-[#050a1a] border border-white/10 p-4 rounded-sm flex flex-col justify-between hover:border-[#00ff88]/30 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>Ball Mastery</span>
            <Zap className="w-3.5 h-3.5 text-[#00d4ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.ballMastery}%
          </div>
          <div className="text-[11px] font-mono text-gray-400 mt-1">Tier 1 Pro</div>
        </div>

        <div className="bg-[#050a1a] border border-white/10 p-4 rounded-sm flex flex-col justify-between hover:border-[#00ff88]/30 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>0-30m Sprint</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.acceleration}
          </div>
          <div className="text-[11px] font-mono text-[#00ff88] mt-1">-0.08s benchmark</div>
        </div>

        <div className="bg-[#050a1a] border border-white/10 p-4 rounded-sm flex flex-col justify-between hover:border-[#00ff88]/30 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>Yo-Yo Recovery</span>
            <Activity className="w-3.5 h-3.5 text-[#00ff88]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.yoYoLevel}
          </div>
          <div className="text-[11px] font-mono text-gray-400 mt-1">Match Ready (90')</div>
        </div>
      </div>

      {/* Tabs Layout for Compactness */}
      <div className="bg-[#050a1a] border border-white/10 rounded-sm overflow-hidden">
        <div className="flex border-b border-white/10 px-4 pt-3 gap-3 bg-black/30">
          <button
            onClick={() => setActiveTab("daily")}
            className={`pb-3 text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "daily"
                ? "text-[#00ff88] border-[#00ff88]"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Today's Training Plan
          </button>
          <button
            onClick={() => setActiveTab("course")}
            className={`pb-3 text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "course"
                ? "text-[#00d4ff] border-[#00d4ff]"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Active Course Progress
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`pb-3 text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "metrics"
                ? "text-white border-white"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Scout Radar Opportunities
          </button>
        </div>

        <div className="p-5">
          {activeTab === "daily" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                <span>3 Micro-cycles Assigned Today</span>
                <Link to="/player/training" className="text-[#00ff88] hover:underline flex items-center gap-1">
                  <span>View All Drills</span> <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {dailyDrills.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-sm bg-black/40 border border-white/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1.5">
                        <span>{d.category}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-sm font-bold ${
                            d.status === "COMPLETED"
                              ? "bg-[#00ff88]/20 text-[#00ff88]"
                              : d.status === "IN_PROGRESS"
                              ? "bg-[#00d4ff]/20 text-[#00d4ff]"
                              : "bg-white/10 text-gray-400"
                          }`}
                        >
                          {d.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{d.title}</h4>
                      <p className="text-xs text-gray-400 font-mono">{d.sets}</p>
                    </div>

                    <Link
                      to="/player/training"
                      className="mt-3 text-xs font-mono text-[#00ff88] hover:underline flex items-center gap-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{d.status === "COMPLETED" ? "Review Reps" : "Execute Drill"}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "course" && (
            <div className="p-4 bg-black/40 border border-white/5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 shrink-0">
                  <PlayCircle className="w-7 h-7 text-[#00d4ff]" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#00d4ff] uppercase font-bold tracking-wider">
                    MODULE 03 • HIGH TEMPO SCANNING
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    UEFA Advanced Ball Mastery & Spatial Vision
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mt-2">
                    <span>Lesson 6 of 9</span>
                    <span>•</span>
                    <span className="text-[#00ff88]">65% Complete</span>
                  </div>
                </div>
              </div>

              <Link
                to="/player/courses"
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase font-bold rounded-sm border border-white/10 transition-colors whitespace-nowrap"
              >
                Resume Lesson
              </Link>
            </div>
          )}

          {activeTab === "metrics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-black/40 border border-[#00ff88]/30 rounded-sm">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88] font-bold mb-1">
                  <Trophy className="w-4 h-4" />
                  <span>EUROPEAN COMBINE TRIAL</span>
                </div>
                <h4 className="text-sm font-bold text-white">Valencia Academy Selection Match</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Upload certified match footage by this Friday to qualify for scout evaluation list.
                </p>
                <Link
                  to="/player/scholarships"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-[#00ff88] hover:underline"
                >
                  <span>View Details</span> <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 bg-black/40 border border-[#00d4ff]/30 rounded-sm">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff] font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>SCOUT RADAR ALERT</span>
                </div>
                <h4 className="text-sm font-bold text-white">2 Accredited Scouts Inspected Reel</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Your last video showcase was viewed by Nordic Scouting Network. Keep physical metrics updated.
                </p>
                <Link
                  to="/player/showcase"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-[#00d4ff] hover:underline"
                >
                  <span>Showcase Dossier</span> <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

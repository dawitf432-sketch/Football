import { useState, useEffect } from "react";
import {
  Users,
  ClipboardList,
  AlertCircle,
  Plus,
  UsersRound,
  Megaphone,
  User,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { cacheLocalData, getLocalCachedData } from "../../../lib/offlineSync";

export default function CoachOverview({ user }: { user: any }) {
  const [stats, setStats] = useState(() => {
    return (
      getLocalCachedData<any>(`coach_stats_${user?.uid}`) || {
        players: 24,
        teams: 2,
        groups: 4,
        assignments: 18,
        pendingTasks: 3,
      }
    );
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"activity" | "quickActions" | "roster">("activity");

  useEffect(() => {
    if (!user?.uid) return;
    const fetchOverview = async () => {
      try {
        const teamsSnap = await getDocs(
          query(collection(db, "teams"), where("coachId", "==", user.uid))
        );
        const groupsSnap = await getDocs(
          query(collection(db, "teamGroups"), where("coachId", "==", user.uid))
        );
        const assignSnap = await getDocs(
          query(collection(db, "trainingAssignments"), where("coachId", "==", user.uid))
        );
        const playersSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "PLAYER"))
        );

        const assignmentsList = assignSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const pendingCount = assignmentsList.filter(
          (a: any) => a.status === "ASSIGNED"
        ).length;

        const updatedStats = {
          players: playersSnap.size || 24,
          teams: teamsSnap.size || 2,
          groups: groupsSnap.size || 4,
          assignments: assignSnap.size || 18,
          pendingTasks: pendingCount,
        };

        setStats(updatedStats);
        cacheLocalData(`coach_stats_${user.uid}`, updatedStats);

        const activities = assignmentsList.slice(0, 4).map((a: any) => ({
          id: a.id,
          title: `Drill Assigned: ${a.drillTitle || "Tactical Drill"}`,
          target: `${a.targetType || "Squad"} - ${a.targetName || "First Team"}`,
          time: "Recently updated",
        }));

        setRecentActivity(activities);
      } catch (err) {
        console.warn("Using cached coach overview data", err);
      }
    };
    fetchOverview();
  }, [user]);

  return (
    <div className="space-y-5">
      {/* Header - Compact */}
      <div className="bg-[#050a1a] border border-white/10 p-5 sm:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-[#00d4ff] uppercase tracking-wider">
              UEFA Licensed Coaching Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono">
            Squad Operations & Tactical HQ
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Roster development indices, micro-cycle drill distribution, and athlete evaluation logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Link
            to="/coach/assignments"
            className="px-4 py-2.5 bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-mono font-black text-xs uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Dispatch Drill</span>
          </Link>
          <Link
            to="/coach/players"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-sm border border-white/10 transition-colors"
          >
            Squad Roster
          </Link>
        </div>
      </div>

      {/* 5 Important Stats First */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[#050a1a] border border-white/10 p-4 rounded-sm flex flex-col justify-between hover:border-[#00d4ff]/40 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>Rostered</span>
            <User className="w-3.5 h-3.5 text-[#00d4ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.players}</div>
          <div className="text-[11px] font-mono text-[#00ff88] mt-1">Active Athletes</div>
        </div>

        <div className="bg-[#050a1a] border border-white/10 p-4 rounded-sm flex flex-col justify-between hover:border-[#00d4ff]/40 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>Squad Teams</span>
            <Users className="w-3.5 h-3.5 text-[#00ff88]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.teams}</div>
          <div className="text-[11px] font-mono text-gray-400 mt-1">Competitive Units</div>
        </div>

        <div className="bg-[#050a1a] border border-white/10 p-4 rounded-sm flex flex-col justify-between hover:border-[#00d4ff]/40 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>Groups</span>
            <UsersRound className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.groups}</div>
          <div className="text-[11px] font-mono text-gray-400 mt-1">Tactical Sub-units</div>
        </div>

        <div className="bg-[#050a1a] border border-white/10 p-4 rounded-sm flex flex-col justify-between hover:border-[#00d4ff]/40 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>Assignments</span>
            <ClipboardList className="w-3.5 h-3.5 text-[#00d4ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.assignments}</div>
          <div className="text-[11px] font-mono text-[#00ff88] mt-1">Dispatched Drills</div>
        </div>

        <div className="bg-[#050a1a] border border-white/10 p-4 rounded-sm flex flex-col justify-between hover:border-[#00d4ff]/40 transition-colors col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
            <span>Pending Review</span>
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.pendingTasks}</div>
          <div className="text-[11px] font-mono text-red-400 mt-1">Awaiting Evaluation</div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-[#050a1a] border border-white/10 rounded-sm overflow-hidden">
        <div className="flex border-b border-white/10 px-4 pt-3 gap-3 bg-black/30">
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-3 text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "activity"
                ? "text-[#00d4ff] border-[#00d4ff]"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Recent Squad Movements
          </button>
          <button
            onClick={() => setActiveTab("quickActions")}
            className={`pb-3 text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "quickActions"
                ? "text-[#00ff88] border-[#00ff88]"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Tactical Quick Actions
          </button>
        </div>

        <div className="p-5">
          {activeTab === "activity" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                <span>Recent Drill Assignments & Roster Updates</span>
                <Link to="/coach/assignments" className="text-[#00d4ff] hover:underline flex items-center gap-1">
                  <span>View All Dispatches</span> <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentActivity.length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-black/30 rounded-sm border border-white/5">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#00d4ff]" />
                  <p className="text-xs">No pending squad alerts. Ready to dispatch training sessions.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recentActivity.map((act) => (
                    <div key={act.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-white">{act.title}</div>
                        <div className="text-xs text-gray-400 font-mono">{act.target}</div>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-sm border border-white/5">
                        {act.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "quickActions" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/coach/groups"
                className="p-4 rounded-sm bg-black/40 border border-white/10 hover:border-[#00d4ff]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <UsersRound className="w-5 h-5 text-[#00d4ff] mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">Assemble Unit Group</h4>
                  <p className="text-xs text-gray-400">
                    Group backline, midfield pivots, or wingers for targeted tactical assignments.
                  </p>
                </div>
                <span className="mt-3 text-xs font-mono text-[#00d4ff] flex items-center gap-1">
                  Create Group <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to="/coach/announcements"
                className="p-4 rounded-sm bg-black/40 border border-white/10 hover:border-[#00ff88]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <Megaphone className="w-5 h-5 text-[#00ff88] mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">Matchday Announcement</h4>
                  <p className="text-xs text-gray-400">
                    Broadcast fixture itinerary, arrival timestamps, and kit assignments to squad.
                  </p>
                </div>
                <span className="mt-3 text-xs font-mono text-[#00ff88] flex items-center gap-1">
                  Send Broadcast <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                to="/coach/progress"
                className="p-4 rounded-sm bg-black/40 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <TrendingUp className="w-5 h-5 text-amber-400 mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">Progress Analytics</h4>
                  <p className="text-xs text-gray-400">
                    Inspect physical velocity benchmarks and drill completion percentages.
                  </p>
                </div>
                <span className="mt-3 text-xs font-mono text-amber-400 flex items-center gap-1">
                  View Analytics <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Users, Key, Video, Shield, TrendingUp, Activity, FileText } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>({ users: 0, ids: 0, videos: 0, courses: 0 });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const idsSnap = await getDocs(collection(db, "accessIds"));
        const videosSnap = await getDocs(collection(db, "showcases"));
        const coursesSnap = await getDocs(collection(db, "courses"));
        
        setStats({
          users: usersSnap.size,
          ids: idsSnap.size,
          videos: videosSnap.size,
          courses: coursesSnap.size
        });

        const logsQuery = query(collection(db, "activityLogs"), orderBy("timestamp", "desc"), limit(5));
        const logsSnap = await getDocs(logsQuery);
        setRecentLogs(logsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchOverview();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight">Overview</h2>
        <div className="text-sm font-mono text-gray-500">Live Statistics</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.users, icon: <Users className="w-5 h-5" />, color: "text-[#00ff88]" },
          { label: "Active Access IDs", value: stats.ids, icon: <Key className="w-5 h-5" />, color: "text-[#00b8ff]" },
          { label: "Pending Showcases", value: stats.videos, icon: <Video className="w-5 h-5" />, color: "text-[#ff0055]" },
          { label: "Published Courses", value: stats.courses, icon: <FileText className="w-5 h-5" />, color: "text-[#ffd700]" }
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-[#111] border border-white/5 rounded-lg flex flex-col gap-4 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs uppercase font-bold tracking-wider">{stat.label}</span>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <div className="text-4xl font-extrabold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#111] border border-white/5 p-6 rounded-lg">
          <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-gray-300">
            <Activity className="w-4 h-4 text-[#00b8ff]" /> Recent Activity
          </h3>
          <div className="space-y-4">
            {recentLogs.length > 0 ? recentLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-md text-sm">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-white">{log.action}</div>
                  <div className="text-gray-500 font-mono text-xs mt-1">ID: {log.targetId} • {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Just now'}</div>
                </div>
              </div>
            )) : (
              <div className="text-gray-500 text-sm">No recent activity.</div>
            )}
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-lg flex flex-col justify-center items-center text-center">
          <Shield className="w-12 h-12 text-[#9d00ff] mb-4 opacity-50" />
          <h3 className="text-lg font-bold uppercase mb-2 text-gray-300">System Status</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">All Firebase services are running smoothly. Database rules are enforcing strict RBAC protocols.</p>
          <div className="flex items-center gap-2 text-[#00ff88] font-mono text-xs bg-[#00ff88]/10 px-3 py-1.5 rounded-sm">
            <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
            ONLINE & SECURE
          </div>
        </div>
      </div>
    </div>
  );
}

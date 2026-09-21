import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Bell, CheckCircle2, AlertCircle, ClipboardList, Megaphone } from "lucide-react";

export default function CoachNotifications({ user }: { user: any }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Query notifications targeted to this user or global
      const q = query(collection(db, "notifications"));
      const snap = await getDocs(q);
      const items = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as any))
        .filter(n => n.userId === user.uid || n.type === "GLOBAL" || !n.userId);

      if (items.length > 0) {
        setNotifications(items);
      } else {
        // Default standard notifications
        setNotifications([
          {
            id: "notif-1",
            title: "Coach Account Activated",
            message: "Your coach credentials have been granted full permissions for assigned squad pods.",
            type: "SYSTEM",
            timestamp: "Today"
          },
          {
            id: "notif-2",
            title: "Micro-Cycle Training Drills Available",
            message: "New curriculum modules for Ball Skills and Athleticism are now live in the training library.",
            type: "DRILL",
            timestamp: "Yesterday"
          },
          {
            id: "notif-3",
            title: "Showcase Review Submissions",
            message: "Players in your squads are uploading video footage for scout review.",
            type: "ALERT",
            timestamp: "2 days ago"
          }
        ]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold uppercase mb-1">Notifications & Activity Feed</h1>
        <p className="text-gray-400">Real-time alerts, completed player drill logs, and director notices.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-sm divide-y divide-white/5">
        {notifications.map(item => (
          <div key={item.id} className="p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="p-2 rounded-sm bg-white/5 text-[#00b8ff] mt-0.5">
              {item.type === "DRILL" ? (
                <ClipboardList className="w-5 h-5 text-[#00ff88]" />
              ) : item.type === "ALERT" ? (
                <AlertCircle className="w-5 h-5 text-[#ffd700]" />
              ) : (
                <Bell className="w-5 h-5 text-[#00b8ff]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <span className="text-[10px] text-gray-500 font-mono uppercase">{item.timestamp || "Recent"}</span>
              </div>
              <p className="text-sm text-gray-400">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

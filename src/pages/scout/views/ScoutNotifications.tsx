import { useState, useEffect } from "react";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Filter, 
  PlayCircle, 
  Activity, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Loader2, 
  Trash2,
  Clock
} from "lucide-react";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  orderBy, 
  writeBatch 
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { ScoutNotification } from "../../../types";

interface ScoutNotificationsProps {
  user: any;
  onRefreshStats?: () => void;
}

export default function ScoutNotifications({ user, onRefreshStats }: ScoutNotificationsProps) {
  const [notifications, setNotifications] = useState<ScoutNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const list: ScoutNotification[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as ScoutNotification);
      });

      // If empty, generate standard initial scout alerts
      if (list.length === 0) {
        const demoAlerts: ScoutNotification[] = [
          {
            id: "notif_1",
            userId: user.uid,
            title: "New Match Showcase Uploaded",
            message: "Striker Robel Tadesse uploaded a new approved highlight reel: 'Clinical Finishing & Counter Attack Goals'.",
            type: "NEW_SHOWCASE",
            read: false,
            createdAt: Date.now() - 3600000,
            link: "/scout/showcases"
          },
          {
            id: "notif_2",
            userId: user.uid,
            title: "Development Milestone Achieved",
            message: "Midfielder Dawit Mengistu advanced to 'Youth Elite' tier with 84% overall development progress.",
            type: "PLAYER_MILESTONE",
            read: false,
            createdAt: Date.now() - 86400000,
            link: "/scout/discover"
          },
          {
            id: "notif_3",
            userId: user.uid,
            title: "Contact Request Authorized",
            message: "Your inquiry regarding defender Yared Bekele was approved by academy coordinators. You may now message through authorized channels.",
            type: "CONTACT_ACCEPTED",
            read: true,
            createdAt: Date.now() - 172800000,
            link: "/scout/messages"
          }
        ];
        setNotifications(demoAlerts);
      } else {
        setNotifications(list);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      if (!id.startsWith("notif_")) {
        await updateDoc(doc(db, "notifications", id), { read: true });
      }
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      if (onRefreshStats) onRefreshStats();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      notifications.forEach(n => {
        if (!n.read && !n.id.startsWith("notif_")) {
          batch.update(doc(db, "notifications", n.id), { read: true });
        }
      });
      await batch.commit();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      if (onRefreshStats) onRefreshStats();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "UNREAD") return !n.read;
    return n.type === activeFilter;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "NEW_SHOWCASE":
        return <PlayCircle className="w-4 h-4 text-cyan-400" />;
      case "PLAYER_MILESTONE":
        return <Activity className="w-4 h-4 text-[#00f59b]" />;
      case "CONTACT_ACCEPTED":
        return <Send className="w-4 h-4 text-emerald-400" />;
      case "CONTACT_DECLINED":
        return <Send className="w-4 h-4 text-rose-400" />;
      case "NEW_MESSAGE":
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#00f59b]" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-[#00f59b]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Scouting Intelligence Alerts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Real-time updates on new match footage, player development benchmarks, and inquiry responses.
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-[#00f59b]" /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "ALL", label: "All Alerts" },
          { id: "UNREAD", label: "Unread Only" },
          { id: "NEW_SHOWCASE", label: "Showcase Footage" },
          { id: "PLAYER_MILESTONE", label: "Player Milestones" },
          { id: "CONTACT_ACCEPTED", label: "Inquiry Updates" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? "bg-[#00f59b] text-black shadow-[0_0_12px_rgba(0,245,155,0.2)]"
                : "bg-[#0b1326] text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 space-y-3">
          <Loader2 className="w-8 h-8 text-[#00f59b] animate-spin" />
          <p className="text-sm">Fetching notifications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#0b1326] border border-white/10 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 text-gray-400 mx-auto flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No notifications in this view</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You are fully up-to-date with all academy alerts and inquiry updates.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                !item.read
                  ? "bg-[#0d1830] border-[#00f59b]/40 shadow-[0_0_15px_rgba(0,245,155,0.05)]"
                  : "bg-[#0b1326] border-white/10 opacity-80"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotifIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#00f59b] animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                    {item.message}
                  </p>
                  <div className="text-[11px] text-gray-500 pt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  title="Mark as read"
                  className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-md transition-colors shrink-0"
                >
                  <Check className="w-4 h-4 text-[#00f59b]" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { 
  Bell, 
  CheckCheck, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Info, 
  CheckCircle2, 
  Trash2,
  Clock
} from "lucide-react";
import { ProviderNotification } from "../../../types";
import { providerService } from "../services/providerService";

interface ProviderNotificationsProps {
  providerId: string;
  onNavigate: (tab: string, param?: any) => void;
}

export default function ProviderNotifications({
  providerId,
  onNavigate
}: ProviderNotificationsProps) {
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");

  const loadNotifications = async () => {
    setLoading(true);
    const list = await providerService.getNotifications(providerId);
    setNotifications(list);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [providerId]);

  const handleMarkAsRead = async (id: string) => {
    await providerService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await providerService.markAllNotificationsRead(providerId);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n => {
    if (filterType === "ALL") return true;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "APPLICATION":
        return <FileText className="w-4 h-4 text-[#00ff88]" />;
      case "MESSAGE":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "DEADLINE":
        return <Calendar className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#00ff88]" />
            Activity & Notifications
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time updates regarding scholarship applicant submissions, committee reminders, and messages.
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4 text-[#00ff88]" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-[#0b1326] p-2 rounded-2xl border border-white/10">
        {["ALL", "APPLICATION", "STATUS_UPDATE", "MESSAGE", "ANNOUNCEMENT"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterType === t
                ? "bg-[#00ff88] text-black"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-[#0b1326] rounded-2xl border border-white/10 p-8 space-y-3">
          <Bell className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Notifications</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You're all caught up. Important updates will appear here when players apply or message your organization.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.read) handleMarkAsRead(n.id);
                if (n.type === "APPLICATION") onNavigate("applications");
                if (n.type === "MESSAGE") onNavigate("messages");
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                n.read
                  ? "bg-[#0b1326] border-white/5 opacity-70 hover:opacity-100 hover:border-white/15"
                  : "bg-[#0f1a36] border-[#00ff88]/30 shadow-[0_0_15px_rgba(0,255,136,0.05)]"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-white">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{n.message}</p>
                  <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {n.createdAt?.seconds 
                        ? new Date(n.createdAt.seconds * 1000).toLocaleString() 
                        : "Recent"}
                    </span>
                  </div>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(n.id);
                  }}
                  className="text-xs text-gray-400 hover:text-white p-1"
                  title="Mark as read"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

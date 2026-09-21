import React, { useState, useEffect } from "react";
import { 
  Bell, 
  MessageSquare, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  ClipboardList, 
  BookOpen, 
  Trophy, 
  FileText, 
  Megaphone, 
  Check, 
  Trash2, 
  ExternalLink,
  Loader2,
  Filter
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppNotification, NotificationType } from "../../../types";
import { notificationService } from "../../../lib/notificationService";

interface PlayerNotificationsProps {
  user: {
    uid: string;
    name: string;
    email?: string;
  };
}

export default function PlayerNotifications({ user }: PlayerNotificationsProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);

    const unsubscribe = notificationService.subscribeToUserNotifications(
      user.uid,
      (items) => {
        setNotifications(items);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleMarkAllRead = async () => {
    if (!user?.uid) return;
    setMarkingAll(true);
    await notificationService.markAllAsRead(user.uid);
    setMarkingAll(false);
  };

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.read) {
      await notificationService.markAsRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await notificationService.deleteNotification(id);
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "NEW_MESSAGE":
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case "CONTACT_REQUEST":
        return <UserCheck className="w-5 h-5 text-[#00ff88]" />;
      case "CONTACT_REQUEST_ACCEPTED":
        return <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />;
      case "CONTACT_REQUEST_DECLINED":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "TRAINING_ASSIGNMENT":
        return <ClipboardList className="w-5 h-5 text-amber-400" />;
      case "COURSE_UPDATE":
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case "SHOWCASE_STATUS":
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case "SCHOLARSHIP_UPDATE":
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case "ADMIN_ANNOUNCEMENT":
        return <Megaphone className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "ALL") return true;
    if (filterType === "UNREAD") return !n.read;
    if (filterType === "MESSAGES") return n.type === "NEW_MESSAGE";
    if (filterType === "CONTACT") return n.type.startsWith("CONTACT_");
    if (filterType === "TRAINING") return n.type === "TRAINING_ASSIGNMENT" || n.type === "COURSE_UPDATE";
    if (filterType === "ANNOUNCEMENT") return n.type === "ADMIN_ANNOUNCEMENT" || n.type === "GLOBAL";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#00ff88]" />
            Notifications & Alerts
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time updates regarding your messages, training assignments, contact inquiries, and academy news.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-200 hover:text-white rounded-sm flex items-center gap-2 transition-colors"
          >
            {markingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 text-[#00ff88]" />}
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar text-xs">
        {[
          { key: "ALL", label: `All (${notifications.length})` },
          { key: "UNREAD", label: `Unread (${unreadCount})` },
          { key: "MESSAGES", label: "Messages" },
          { key: "CONTACT", label: "Contact Inquiries" },
          { key: "TRAINING", label: "Training & Courses" },
          { key: "ANNOUNCEMENT", label: "Academy Bulletins" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-3 py-1.5 rounded-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              filterType === tab.key
                ? "bg-[#00ff88] text-black"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-[#111] border border-white/10 rounded-sm divide-y divide-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#00ff88]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">No Notifications</h4>
            <p className="text-[11px] text-gray-500 mt-1">
              You are all caught up! There are no notifications in this category.
            </p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 transition-colors cursor-pointer flex items-start gap-4 hover:bg-white/[0.03] ${
                !notif.read ? "bg-white/[0.02]" : ""
              }`}
            >
              <div className="mt-0.5 p-2 rounded-sm bg-white/5 border border-white/10 shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-sm ${!notif.read ? "font-bold text-white" : "font-medium text-gray-300"}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-mono shrink-0">
                    {notif.createdAt?.seconds 
                      ? new Date(notif.createdAt.seconds * 1000).toLocaleString(undefined, { 
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
                        })
                      : "Recently"}
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between text-xs">
                  {notif.link ? (
                    <span className="text-[#00ff88] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 hover:underline">
                      View details <ExternalLink className="w-3 h-3" />
                    </span>
                  ) : <span />}

                  <button
                    onClick={(e) => handleDelete(e, notif.id)}
                    className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] mt-2 shrink-0 shadow-md" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

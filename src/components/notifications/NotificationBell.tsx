import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  MessageSquare, 
  UserCheck, 
  XCircle, 
  CheckCircle2, 
  ClipboardList, 
  BookOpen, 
  Trophy, 
  FileText, 
  Megaphone, 
  Check, 
  Trash2, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { AppNotification, NotificationType } from "../../types";
import { notificationService } from "../../lib/notificationService";

interface NotificationBellProps {
  userId: string;
  onNavigate?: (link: string) => void;
}

export default function NotificationBell({ userId, onNavigate }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = notificationService.subscribeToUserNotifications(
      userId,
      (items) => {
        setNotifications(items);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    if (!userId) return;
    setLoading(true);
    await notificationService.markAllAsRead(userId);
    setLoading(false);
  };

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.read) {
      await notificationService.markAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link && onNavigate) {
      onNavigate(notification.link);
    } else if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await notificationService.deleteNotification(id);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "NEW_MESSAGE":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "CONTACT_REQUEST":
        return <UserCheck className="w-4 h-4 text-[#00ff88]" />;
      case "CONTACT_REQUEST_ACCEPTED":
        return <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />;
      case "CONTACT_REQUEST_DECLINED":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "TRAINING_ASSIGNMENT":
        return <ClipboardList className="w-4 h-4 text-amber-400" />;
      case "COURSE_UPDATE":
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case "SHOWCASE_STATUS":
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case "SCHOLARSHIP_UPDATE":
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case "ADMIN_ANNOUNCEMENT":
        return <Megaphone className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : (timestamp instanceof Date ? timestamp : new Date());
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-sm text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#00ff88] text-black text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141414] border border-white/15 rounded-sm shadow-2xl z-50 overflow-hidden flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="p-3.5 px-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#00ff88]" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#00ff88]/20 text-[#00ff88] text-[10px] font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="text-[11px] font-bold text-gray-400 hover:text-[#00ff88] flex items-center gap-1 transition-colors"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-bold uppercase tracking-wider">No Notifications</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Updates on messages, contact requests, and training assignments will arrive here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 px-4 transition-colors cursor-pointer flex items-start gap-3 hover:bg-white/5 ${
                    !notif.read ? "bg-white/[0.03]" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0 p-1.5 rounded-sm bg-white/5 border border-white/10">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className={`text-xs truncate ${!notif.read ? "font-bold text-white" : "font-medium text-gray-300"}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-gray-500 font-mono shrink-0">
                        {formatTimestamp(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-1">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px]">
                      {notif.link ? (
                        <span className="text-[#00ff88] font-bold uppercase tracking-wider flex items-center gap-1">
                          View details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      ) : <span />}

                      <button
                        onClick={(e) => handleDeleteNotification(e, notif.id)}
                        className="text-gray-500 hover:text-red-400 p-0.5"
                        title="Dismiss notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#00ff88] mt-1.5 shrink-0 shadow-sm" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

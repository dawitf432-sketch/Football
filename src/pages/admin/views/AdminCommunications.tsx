import React, { useState, useEffect } from "react";
import { 
  Shield, 
  MessageSquare, 
  AlertTriangle, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Search, 
  Megaphone, 
  Loader2, 
  Clock, 
  User, 
  ArrowRight,
  Filter,
  Eye,
  Send
} from "lucide-react";
import { Conversation, ConversationReport, UserRole } from "../../../types";
import { messagingService } from "../../../lib/messagingService";
import { notificationService } from "../../../lib/notificationService";

interface AdminCommunicationsProps {
  currentUser: {
    uid: string;
    name: string;
    role: UserRole;
  };
}

export default function AdminCommunications({ currentUser }: AdminCommunicationsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [reports, setReports] = useState<ConversationReport[]>([]);
  const [activeTab, setActiveTab] = useState<"REPORTS" | "CONVERSATIONS" | "ANNOUNCEMENT">("REPORTS");
  const [loading, setLoading] = useState(true);

  // Announcement form
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [targetRole, setTargetRole] = useState<"ALL" | "PLAYER" | "COACH" | "SCOUT" | "SCHOLARSHIP_PROVIDER">("ALL");
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  // Selected thread for inspection
  const [inspectingConv, setInspectingConv] = useState<Conversation | null>(null);
  const [inspectMessages, setInspectMessages] = useState<any[]>([]);
  const [loadingInspect, setLoadingInspect] = useState(false);

  // Search
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsubConvs = messagingService.subscribeToAllConversations((list) => {
      setConversations(list);
    });

    const unsubReports = messagingService.subscribeToReports((list) => {
      setReports(list);
      setLoading(false);
    });

    return () => {
      unsubConvs();
      unsubReports();
    };
  }, []);

  // Inspect conversation
  const handleInspect = (conv: Conversation) => {
    setInspectingConv(conv);
    setLoadingInspect(true);
    const unsub = messagingService.subscribeToMessages(conv.id, (msgs) => {
      setInspectMessages(msgs);
      setLoadingInspect(false);
    });
    return unsub;
  };

  // Resolve / Dismiss report
  const handleResolveReport = async (reportId: string, status: "RESOLVED" | "DISMISSED") => {
    try {
      await messagingService.resolveReport({
        reportId,
        status,
        resolvedBy: currentUser.name || "Administrator",
        notes: `Handled via Admin Safeguarding console on ${new Date().toLocaleDateString()}`
      });
    } catch (err) {
      console.error("Error resolving report:", err);
    }
  };

  // Toggle Block
  const handleToggleBlock = async (convId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await messagingService.unblockConversation(convId);
      } else {
        await messagingService.blockConversation(convId, currentUser.uid, "Blocked by Platform Administrator for policy enforcement.");
      }
    } catch (err) {
      console.error("Error toggling block:", err);
    }
  };

  // Broadcast announcement
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMessage.trim()) return;

    setBroadcasting(true);
    setBroadcastSuccess(null);
    try {
      const count = await notificationService.broadcastAnnouncement({
        title: announcementTitle.trim(),
        message: announcementMessage.trim(),
        targetRole,
        link: "/player"
      });

      setBroadcastSuccess(`Announcement dispatched successfully to ${count} active platform members.`);
      setAnnouncementTitle("");
      setAnnouncementMessage("");
    } catch (err) {
      console.error("Broadcast failed:", err);
    } finally {
      setBroadcasting(false);
    }
  };

  const pendingReports = reports.filter(r => r.status === "PENDING_REVIEW");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#00ff88]" />
            Communications & Safeguarding Center
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Monitor player communication safety, resolve safeguarding reports, and broadcast official academy bulletins.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-sm border border-white/10">
          <button
            onClick={() => setActiveTab("REPORTS")}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              activeTab === "REPORTS" ? "bg-[#00ff88] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Safeguarding Reports</span>
            {pendingReports.length > 0 && (
              <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-black">
                {pendingReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("CONVERSATIONS")}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              activeTab === "CONVERSATIONS" ? "bg-[#00ff88] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>All Threads ({conversations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ANNOUNCEMENT")}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              activeTab === "ANNOUNCEMENT" ? "bg-[#00ff88] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Broadcast Bulletin</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Safeguarding Reports */}
      {activeTab === "REPORTS" && (
        <div className="space-y-4">
          <div className="bg-[#111] border border-white/10 rounded-sm overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-[#161616] flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Safeguarding Incident Reports Queue
              </h3>
              <span className="text-xs text-gray-400 font-mono">
                {pendingReports.length} action item(s) pending
              </span>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin text-[#00ff88]" />
              </div>
            ) : reports.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-[#00ff88] opacity-60" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Clean Record</h4>
                <p className="text-[11px] text-gray-500 mt-1">No moderation reports have been submitted.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-white/[0.02]">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{report.reportedUserName}</span>
                        <span className="text-gray-400 text-[11px]">was reported by</span>
                        <span className="font-bold text-gray-300">{report.reporterName}</span>
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-white/10 text-gray-400">
                          {report.reporterRole}
                        </span>

                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                          report.status === "PENDING_REVIEW"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : report.status === "RESOLVED"
                            ? "bg-emerald-500/20 text-[#00ff88] border border-emerald-500/40"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/40"
                        }`}>
                          {report.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="text-amber-300 font-medium">
                        Reason: <strong className="text-white">{report.reason}</strong>
                      </div>

                      {report.notes && (
                        <div className="p-2 bg-white/5 border border-white/10 rounded-sm text-gray-300 max-w-xl text-[11px]">
                          "{report.notes}"
                        </div>
                      )}

                      <div className="text-[10px] text-gray-500 font-mono">
                        Reported: {report.createdAt?.seconds ? new Date(report.createdAt.seconds * 1000).toLocaleString() : "Recently"}
                        {report.resolvedBy && ` • Resolved by: ${report.resolvedBy}`}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {report.status === "PENDING_REVIEW" && (
                        <>
                          <button
                            onClick={() => handleResolveReport(report.id, "RESOLVED")}
                            className="px-3 py-1.5 bg-[#00ff88] hover:bg-[#00e078] text-black font-extrabold uppercase rounded-sm text-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolve</span>
                          </button>

                          <button
                            onClick={() => handleResolveReport(report.id, "DISMISSED")}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold uppercase rounded-sm text-xs border border-white/10"
                          >
                            Dismiss
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          const conv = conversations.find(c => c.id === report.conversationId);
                          if (conv) handleInspect(conv);
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold uppercase rounded-sm text-xs border border-white/10 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Thread</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: All Conversations */}
      {activeTab === "CONVERSATIONS" && (
        <div className="space-y-4">
          <div className="bg-[#111] border border-white/10 rounded-sm overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00ff88]" />
                Active Platform Conversation Threads
              </h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-[#1c1c1c] border border-white/10 rounded-sm text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
                />
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {conversations
                .filter(conv => {
                  const pList = Object.values(conv.participants || {}) as Array<{ uid?: string; name?: string; role?: string }>;
                  const names = pList.map(p => p.name?.toLowerCase() || "").join(" ");
                  return names.includes(search.toLowerCase());
                })
                .map((conv) => {
                  const participants = Object.values(conv.participants || {}) as Array<{ uid?: string; name?: string; role?: string }>;
                  const isBlocked = conv.status === "BLOCKED";

                  return (
                    <div key={conv.id} className="p-4 hover:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          {participants.map((p, idx) => (
                            <React.Fragment key={p.uid || idx}>
                              <span className="font-bold text-white">{p.name}</span>
                              <span className="px-1.5 py-0.2 bg-white/10 text-gray-400 rounded-sm text-[10px] uppercase font-mono">
                                {p.role}
                              </span>
                              {idx < participants.length - 1 && <span className="text-gray-500">↔</span>}
                            </React.Fragment>
                          ))}

                          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                            isBlocked ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-emerald-500/10 text-[#00ff88] border border-[#00ff88]/30"
                          }`}>
                            {conv.status}
                          </span>
                        </div>

                        <div className="text-gray-400 truncate max-w-lg">
                          Last Message: <span className="text-gray-200">"{conv.lastMessage?.text || "No text"}"</span>
                        </div>

                        <div className="text-[10px] text-gray-500 font-mono">
                          ID: {conv.id} • Updated: {conv.updatedAt?.seconds ? new Date(conv.updatedAt.seconds * 1000).toLocaleString() : "Recently"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleInspect(conv)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold uppercase rounded-sm text-xs border border-white/10 flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => handleToggleBlock(conv.id, isBlocked)}
                          className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                            isBlocked
                              ? "bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30"
                              : "bg-white/5 text-gray-400 border-white/10 hover:text-red-400"
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{isBlocked ? "Unblock" : "Block"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Broadcast Bulletin */}
      {activeTab === "ANNOUNCEMENT" && (
        <div className="max-w-2xl bg-[#111] border border-white/10 rounded-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Megaphone className="w-5 h-5 text-[#00ff88]" />
            <h3 className="font-extrabold text-sm uppercase tracking-wide text-white">
              Broadcast Official Academy Announcement
            </h3>
          </div>

          <p className="text-xs text-gray-400">
            Send an instant notification alert to all registered academy players, coaches, or scout personnel.
          </p>

          {broadcastSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-xs text-[#00ff88] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{broadcastSuccess}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                Audience Group
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#00ff88]"
              >
                <option value="ALL">All Academy Members (Global)</option>
                <option value="PLAYER">Players Only</option>
                <option value="COACH">Coaches Only</option>
                <option value="SCOUT">Scouts Only</option>
                <option value="SCHOLARSHIP_PROVIDER">Scholarship Providers Only</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Upcoming Premier League Showcase Trials"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                Announcement Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Type the announcement details and instructions for platform members..."
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-sm p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e078] text-black font-extrabold uppercase tracking-wider text-xs rounded-sm flex items-center gap-2 transition-colors disabled:opacity-40"
            >
              {broadcasting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Bulletin</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Inspect Modal */}
      {inspectingConv && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/15 rounded-sm max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00ff88]" />
                <h3 className="font-extrabold uppercase tracking-wide text-xs text-white">
                  Safeguarding Inspection: {inspectingConv.id}
                </h3>
              </div>
              <button onClick={() => setInspectingConv(null)} className="text-gray-400 hover:text-white">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#0d0d0d]">
              {loadingInspect ? (
                <div className="p-8 flex justify-center text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin text-[#00ff88]" />
                </div>
              ) : inspectMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs">
                  No messages logged in this conversation.
                </div>
              ) : (
                inspectMessages.map((m, idx) => (
                  <div key={m.id || idx} className="p-3 bg-[#181818] border border-white/10 rounded-sm text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span className="font-bold text-[#00ff88]">{m.senderName} ({m.senderRole})</span>
                      <span>{m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleString() : ""}</span>
                    </div>
                    {m.imageUrl && (
                      <img src={m.imageUrl} alt="Attachment" className="max-h-40 rounded-sm object-contain my-1" />
                    )}
                    <div className="text-gray-200">{m.text}</div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-white/10 bg-[#181818] flex items-center justify-between">
              <button
                onClick={() => handleToggleBlock(inspectingConv.id, inspectingConv.status === "BLOCKED")}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  inspectingConv.status === "BLOCKED" ? "bg-red-500/20 text-red-400" : "bg-white/5 text-gray-300"
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{inspectingConv.status === "BLOCKED" ? "Unblock Thread" : "Block Thread"}</span>
              </button>

              <button
                onClick={() => setInspectingConv(null)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase rounded-sm"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

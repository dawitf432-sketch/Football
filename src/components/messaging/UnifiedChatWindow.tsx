import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  X, 
  Shield, 
  AlertTriangle, 
  Ban, 
  CheckCheck, 
  Check, 
  Search, 
  Loader2, 
  User, 
  MoreVertical, 
  Info, 
  Flag, 
  Clock, 
  ArrowLeft,
  Sparkles,
  Paperclip,
  Maximize2
} from "lucide-react";
import { 
  Conversation, 
  ChatMessage, 
  UserRole, 
  ConversationType 
} from "../../types";
import { messagingService } from "../../lib/messagingService";

interface UnifiedChatWindowProps {
  currentUser: {
    uid: string;
    name: string;
    role: UserRole;
    email?: string;
  };
  initialConversationId?: string;
  // Optional pre-filtered role or contact list
  allowedRoleFilters?: UserRole[];
  headerTitle?: string;
  headerSubtitle?: string;
  onSelectContactRequestsTab?: () => void;
  pendingRequestsCount?: number;
}

export default function UnifiedChatWindow({
  currentUser,
  initialConversationId,
  headerTitle = "Secure Messaging",
  headerSubtitle = "Private, youth-safeguarded communication with authorized football personnel.",
  onSelectContactRequestsTab,
  pendingRequestsCount = 0
}: UnifiedChatWindowProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConversationId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Input states
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Modals / Overlays
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("Inappropriate Language");
  const [reportNotes, setReportNotes] = useState("");
  const [reportingSubmitting, setReportingSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Subscribe to user conversations
  useEffect(() => {
    setLoadingConv(true);
    const unsubscribe = messagingService.subscribeToUserConversations(
      currentUser.uid,
      (convs) => {
        setConversations(convs);
        setLoadingConv(false);

        // Auto-select initial or first conversation
        if (!selectedConvId && convs.length > 0) {
          setSelectedConvId(convs[0].id);
        } else if (initialConversationId) {
          const found = convs.find(c => c.id === initialConversationId);
          if (found) setSelectedConvId(found.id);
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid, initialConversationId]);

  // 2. Subscribe to messages when a conversation is selected
  useEffect(() => {
    if (!selectedConvId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    // Mark as read
    messagingService.markConversationAsRead(selectedConvId, currentUser.uid);

    const unsubscribe = messagingService.subscribeToMessages(
      selectedConvId,
      (msgs) => {
        setMessages(msgs);
        setLoadingMessages(false);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    );

    return () => unsubscribe();
  }, [selectedConvId, currentUser.uid]);

  // Selected conversation object
  const activeConversation = conversations.find(c => c.id === selectedConvId);

  // Recipient info
  const otherParticipantId = activeConversation?.participantIds.find(id => id !== currentUser.uid) || "";
  const otherParticipant = activeConversation?.participants[otherParticipantId] || {
    uid: otherParticipantId,
    name: "Platform Member",
    role: "COACH" as UserRole
  };

  // Helper for badge color by role
  const getRoleBadge = (role: UserRole | string) => {
    switch (role) {
      case "ADMIN":
        return { bg: "bg-purple-500/10 text-purple-400 border-purple-500/30", label: "Admin" };
      case "COACH":
        return { bg: "bg-blue-500/10 text-blue-400 border-blue-500/30", label: "Coach" };
      case "SCOUT":
        return { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", label: "Scout" };
      case "SCHOLARSHIP_PROVIDER":
        return { bg: "bg-amber-500/10 text-amber-400 border-amber-500/30", label: "Scholarship" };
      case "PLAYER":
        return { bg: "bg-emerald-500/10 text-[#00ff88] border-[#00ff88]/30", label: "Player" };
      default:
        return { bg: "bg-gray-500/10 text-gray-400 border-gray-500/30", label: role || "Member" };
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const otherId = conv.participantIds.find(id => id !== currentUser.uid) || "";
    const other = conv.participants[otherId];
    if (!other) return false;

    // Search query
    const matchSearch = other.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other.organization?.toLowerCase().includes(searchQuery.toLowerCase());

    // Role filter
    if (roleFilter !== "ALL") {
      if (roleFilter === "UNREAD") {
        const unread = conv.unreadCounts?.[currentUser.uid] || 0;
        return matchSearch && unread > 0;
      }
      return matchSearch && other.role === roleFilter;
    }

    return matchSearch;
  });

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setFileError("Attachment exceeds 5MB limit.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setFileError("Only image attachments (JPEG, PNG, WebP) are allowed.");
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedFile) || !selectedConvId || !otherParticipantId) return;

    setSending(true);
    setFileError(null);

    try {
      await messagingService.sendMessage({
        conversationId: selectedConvId,
        senderId: currentUser.uid,
        senderName: currentUser.name || "Member",
        senderRole: currentUser.role,
        recipientId: otherParticipantId,
        text: inputText,
        imageFile: selectedFile
      });

      setInputText("");
      clearSelectedFile();
    } catch (err: any) {
      setFileError(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  // Block / Unblock
  const handleToggleBlock = async () => {
    if (!selectedConvId) return;
    try {
      if (activeConversation?.status === "BLOCKED") {
        await messagingService.unblockConversation(selectedConvId);
      } else {
        await messagingService.blockConversation(
          selectedConvId, 
          currentUser.uid, 
          "Blocked by user request."
        );
      }
    } catch (err) {
      console.error("Error toggling block:", err);
    }
  };

  // Submit Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !otherParticipantId) return;

    setReportingSubmitting(true);
    try {
      await messagingService.reportConversation({
        conversationId: selectedConvId,
        reporterId: currentUser.uid,
        reporterName: currentUser.name || "Member",
        reporterRole: currentUser.role,
        reportedUserId: otherParticipantId,
        reportedUserName: otherParticipant.name,
        reason: reportReason,
        notes: reportNotes
      });

      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportNotes("");
      }, 2000);
    } catch (err) {
      console.error("Report error:", err);
    } finally {
      setReportingSubmitting(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : (timestamp instanceof Date ? timestamp : new Date());
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateLabel = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : (timestamp instanceof Date ? timestamp : new Date());
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Top Banner / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#00ff88]" />
            {headerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{headerSubtitle}</p>
        </div>

        {onSelectContactRequestsTab && (
          <button
            onClick={onSelectContactRequestsTab}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
          >
            <Shield className="w-4 h-4 text-[#00ff88]" />
            <span>Contact Inquiries</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-[#00ff88] text-black rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Main Messaging Container */}
      <div className="flex-1 bg-[#111] border border-white/10 rounded-sm min-h-[580px] grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl">
        
        {/* Left Pane: Conversations List */}
        <div className={`md:col-span-4 lg:col-span-4 border-r border-white/10 flex flex-col ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Search and Filters */}
          <div className="p-3 border-b border-white/10 space-y-2 bg-[#0d0d0d]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#181818] border border-white/10 rounded-sm text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
              />
            </div>

            {/* Role Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar text-[11px]">
              {["ALL", "UNREAD", "COACH", "SCOUT", "SCHOLARSHIP_PROVIDER", "ADMIN"].map((filter) => {
                const labelMap: Record<string, string> = {
                  ALL: "All",
                  UNREAD: "Unread",
                  COACH: "Coaches",
                  SCOUT: "Scouts",
                  SCHOLARSHIP_PROVIDER: "Providers",
                  ADMIN: "Admin"
                };
                const active = roleFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setRoleFilter(filter)}
                    className={`px-2.5 py-1 rounded-sm uppercase tracking-wider font-bold whitespace-nowrap transition-colors ${
                      active 
                        ? "bg-[#00ff88] text-black font-extrabold" 
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {labelMap[filter] || filter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loadingConv ? (
              <div className="p-8 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin text-[#00ff88] mb-2" />
                <span className="text-xs uppercase tracking-wider">Syncing inbox...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">No conversations found</div>
                <p className="text-[11px] text-gray-500 mt-1 max-w-xs mx-auto">
                  {searchQuery 
                    ? "No conversations match your search query."
                    : "When authorized coaches, scouts, or providers connect with you, threads appear here."}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                const otherId = conv.participantIds.find(id => id !== currentUser.uid) || "";
                const other = conv.participants[otherId] || { name: "Member", role: "PLAYER" as UserRole };
                const unreadCount = conv.unreadCounts?.[currentUser.uid] || 0;
                const roleBadge = getRoleBadge(other.role);
                const isBlocked = conv.status === "BLOCKED";

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setMobileShowChat(true);
                    }}
                    className={`w-full text-left p-3.5 transition-all flex items-start gap-3 border-l-2 ${
                      isSelected 
                        ? "bg-white/10 border-[#00ff88]" 
                        : "hover:bg-white/5 border-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-sm text-gray-200">
                        {other.name ? other.name.substring(0, 2).toUpperCase() : "PF"}
                      </div>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ff88] text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-lg">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-white truncate max-w-[140px]">
                          {other.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {formatDateLabel(conv.updatedAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider border ${roleBadge.bg}`}>
                          {roleBadge.label}
                        </span>
                        {other.organization && (
                          <span className="text-[10px] text-gray-400 truncate max-w-[100px]">
                            • {other.organization}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-gray-400 truncate flex items-center gap-1">
                        {isBlocked ? (
                          <span className="text-red-400 flex items-center gap-1">
                            <Ban className="w-3 h-3" /> Blocked
                          </span>
                        ) : (
                          <>
                            {conv.lastMessage?.hasImage && <ImageIcon className="w-3 h-3 text-[#00ff88]" />}
                            <span>{conv.lastMessage?.text || "No messages yet"}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Conversation Thread */}
        <div className={`md:col-span-8 lg:col-span-8 flex flex-col bg-[#0f0f0f] ${mobileShowChat ? 'flex' : 'hidden md:flex'}`}>
          {activeConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 px-4 border-b border-white/10 bg-[#141414] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-sm bg-white/5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="w-9 h-9 rounded-sm bg-white/10 border border-white/15 flex items-center justify-center font-bold text-xs">
                    {otherParticipant.name ? otherParticipant.name.substring(0, 2).toUpperCase() : "PF"}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white truncate">{otherParticipant.name}</h3>
                      <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider border ${getRoleBadge(otherParticipant.role).bg}`}>
                        {getRoleBadge(otherParticipant.role).label}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Shield className="w-3 h-3 text-[#00ff88]" />
                      <span>Verified Official Connection</span>
                      {otherParticipant.organization && <span>• {otherParticipant.organization}</span>}
                    </div>
                  </div>
                </div>

                {/* Header Action Menu */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleToggleBlock}
                    title={activeConversation.status === "BLOCKED" ? "Unblock Conversation" : "Block Conversation"}
                    className={`p-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors border ${
                      activeConversation.status === "BLOCKED"
                        ? "bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30"
                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {activeConversation.status === "BLOCKED" ? "Unblock" : "Block"}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowReportModal(true)}
                    title="Report inappropriate communication"
                    className="p-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-gray-400 hover:text-amber-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Report</span>
                  </button>
                </div>
              </div>

              {/* Safeguarding Notice */}
              <div className="p-2.5 px-4 bg-emerald-950/20 border-b border-emerald-500/20 flex items-center gap-2 text-[11px] text-emerald-300">
                <Shield className="w-4 h-4 text-[#00ff88] shrink-0" />
                <span>
                  <strong>Youth Safeguarding Protocol:</strong> Direct messaging is encrypted and archived for player integrity. External commercial solicitations or inappropriate inquiries are strictly prohibited.
                </span>
              </div>

              {/* Blocked State Notice */}
              {activeConversation.status === "BLOCKED" && (
                <div className="p-3 px-4 bg-red-950/40 border-b border-red-500/30 flex items-center justify-between text-xs text-red-300">
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-400 shrink-0" />
                    <span>This conversation is currently blocked. Messages cannot be sent or received.</span>
                  </div>
                  <button
                    onClick={handleToggleBlock}
                    className="px-2.5 py-1 bg-red-500 text-white rounded-sm font-bold uppercase text-[10px] tracking-wider hover:bg-red-600"
                  >
                    Unblock Thread
                  </button>
                </div>
              )}

              {/* Message Stream Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="p-8 flex justify-center items-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin text-[#00ff88]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 text-[#00ff88]" />
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
                      Conversation Opened
                    </h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Send a professional message to begin this training, scouting, or scholarship discussion.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isOwn = msg.senderId === currentUser.uid;
                    const showDateDivider = index === 0 || formatDateLabel(messages[index - 1].createdAt) !== formatDateLabel(msg.createdAt);

                    return (
                      <React.Fragment key={msg.id || index}>
                        {showDateDivider && (
                          <div className="flex items-center justify-center my-4">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-wider text-gray-400">
                              {formatDateLabel(msg.createdAt)}
                            </span>
                          </div>
                        )}

                        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                          <div className="text-[10px] text-gray-500 mb-1 px-1">
                            {isOwn ? "You" : msg.senderName} • {formatTime(msg.createdAt)}
                          </div>

                          <div
                            className={`max-w-[85%] sm:max-w-[70%] rounded-sm p-3 text-xs leading-relaxed break-words shadow-md ${
                              isOwn
                                ? "bg-[#00ff88] text-black font-medium rounded-tr-none"
                                : "bg-[#1f1f1f] text-gray-100 border border-white/10 rounded-tl-none"
                            }`}
                          >
                            {/* Image Attachment */}
                            {msg.imageUrl && (
                              <div className="mb-2 relative group cursor-pointer" onClick={() => setLightboxImage(msg.imageUrl || null)}>
                                <img
                                  src={msg.imageUrl}
                                  alt="Attachment"
                                  className="rounded-sm max-h-60 w-auto object-cover border border-black/10"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                                  <Maximize2 className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            )}

                            {/* Message Text */}
                            {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}

                            {/* Read Status (for sender) */}
                            {isOwn && (
                              <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-black/60 font-mono">
                                <CheckCheck className="w-3 h-3" />
                                <span>Sent</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              {activeConversation.status !== "BLOCKED" ? (
                <div className="p-3 border-t border-white/10 bg-[#141414]">
                  {/* File preview chip */}
                  {filePreview && (
                    <div className="mb-2 p-2 bg-white/5 border border-white/10 rounded-sm flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <img src={filePreview} alt="Preview" className="w-8 h-8 object-cover rounded-sm border border-white/15" />
                        <span className="text-gray-300 truncate max-w-xs">{selectedFile?.name}</span>
                        <span className="text-[10px] text-gray-500">({((selectedFile?.size || 0) / 1024).toFixed(0)} KB)</span>
                      </div>
                      <button onClick={clearSelectedFile} className="p-1 hover:text-red-400 text-gray-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {fileError && (
                    <div className="mb-2 text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{fileError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Attach image (Max 5MB)"
                      className="p-2.5 rounded-sm bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      placeholder="Type your official message here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={sending}
                      className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-sm px-3.5 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
                    />

                    <button
                      type="submit"
                      disabled={sending || (!inputText.trim() && !selectedFile)}
                      className="px-4 py-2 bg-[#00ff88] hover:bg-[#00e078] text-black font-bold uppercase tracking-wider rounded-sm text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span className="hidden sm:inline">Send</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-4 border-t border-white/10 bg-[#121212] text-center text-xs text-gray-500">
                  Input is disabled because this communication thread is currently blocked.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 text-white/15 mb-3" />
              <h3 className="text-base font-bold uppercase tracking-wide text-white mb-1">
                Select a Conversation
              </h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Choose a conversation thread from the left panel to review messages and communicate with verified club representatives.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setLightboxImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={lightboxImage} alt="Enlarged Attachment" className="max-w-full max-h-[85vh] rounded-sm object-contain" />
          </div>
        </div>
      )}

      {/* Moderation Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#181818] border border-white/15 rounded-sm p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Flag className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wide text-sm text-white">Report Inappropriate Message</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-6 text-center text-[#00ff88] space-y-2">
                <Shield className="w-8 h-8 mx-auto" />
                <h4 className="font-bold text-sm uppercase tracking-wide text-white">Report Logged Successfully</h4>
                <p className="text-xs text-gray-400">
                  Our youth safeguarding and academy administration team will review this thread immediately.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Reporting Member
                  </label>
                  <div className="p-2 bg-white/5 border border-white/10 rounded-sm text-gray-200">
                    {otherParticipant.name} ({otherParticipant.role})
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Reason for Concern
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-[#202020] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#00ff88]"
                  >
                    <option value="Inappropriate Language">Inappropriate Language or Tone</option>
                    <option value="Harassment / Unsolicited Contact">Harassment or Unsolicited Communication</option>
                    <option value="Commercial Spam / Financial Solicitation">Commercial Spam or Unapproved Solicitation</option>
                    <option value="Safety & Welfare Concern">Youth Safety & Welfare Concern</option>
                    <option value="Other">Other Policy Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Incident Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide additional context for academy administrators..."
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    className="w-full bg-[#202020] border border-white/10 rounded-sm p-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold uppercase rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportingSubmitting}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-sm flex items-center gap-1.5"
                  >
                    {reportingSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

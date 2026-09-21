import React, { useState, useEffect } from "react";
import { 
  Shield, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Send, 
  Building2, 
  MapPin, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Plus
} from "lucide-react";
import { ContactRequest, ContactRequestStatus, UserRole } from "../../types";
import { contactService } from "../../lib/contactService";

interface ContactRequestsManagerProps {
  currentUser: {
    uid: string;
    name: string;
    role: UserRole;
  };
  onOpenConversation?: (conversationId: string) => void;
  onRequestSent?: () => void;
}

export default function ContactRequestsManager({
  currentUser,
  onOpenConversation,
  onRequestSent
}: ContactRequestsManagerProps) {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [declineModalId, setDeclineModalId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const isPlayer = currentUser.role === "PLAYER";

  // Subscribe to contact requests
  useEffect(() => {
    setLoading(true);
    let unsubscribe: () => void;

    if (isPlayer) {
      unsubscribe = contactService.subscribeToPlayerContactRequests(
        currentUser.uid,
        (items) => {
          setRequests(items);
          setLoading(false);
        }
      );
    } else {
      unsubscribe = contactService.subscribeToSenderContactRequests(
        currentUser.uid,
        (items) => {
          setRequests(items);
          setLoading(false);
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser.uid, isPlayer]);

  // Player accepts contact request
  const handleAccept = async (request: ContactRequest) => {
    setActionInProgress(request.id);
    try {
      const res = await contactService.respondToContactRequest({
        requestId: request.id,
        playerId: currentUser.uid,
        playerName: currentUser.name || "Player",
        decision: "ACCEPT"
      });

      if (res.conversationId && onOpenConversation) {
        onOpenConversation(res.conversationId);
      }
    } catch (err) {
      console.error("Error accepting contact request:", err);
    } finally {
      setActionInProgress(null);
    }
  };

  // Player declines contact request
  const handleConfirmDecline = async () => {
    if (!declineModalId) return;
    setActionInProgress(declineModalId);
    try {
      await contactService.respondToContactRequest({
        requestId: declineModalId,
        playerId: currentUser.uid,
        playerName: currentUser.name || "Player",
        decision: "DECLINE",
        declineReason
      });
      setDeclineModalId(null);
      setDeclineReason("");
    } catch (err) {
      console.error("Error declining contact request:", err);
    } finally {
      setActionInProgress(null);
    }
  };

  const getStatusBadge = (status: ContactRequestStatus) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-[#00ff88] border border-[#00ff88]/30">
            <CheckCircle2 className="w-3 h-3" /> Accepted
          </span>
        );
      case "DECLINED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-extrabold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" /> Declined
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-extrabold uppercase tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/30">
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : (timestamp instanceof Date ? timestamp : new Date());
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-4">
      {/* Safeguarding Card Banner */}
      <div className="p-4 bg-[#141414] border border-white/10 rounded-sm flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#00ff88] shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300 leading-relaxed">
          <strong className="text-white font-bold uppercase tracking-wider block mb-0.5">
            Youth Safeguarding & Compliance Workflow
          </strong>
          In compliance with academy safeguarding regulations, external accredited scouts and scholarship providers must submit an official contact inquiry. Direct conversation threads are only established after explicit athlete approval.
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-[#111] border border-white/10 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-[#161616] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#00ff88]" />
            <h3 className="font-extrabold text-sm uppercase tracking-wide text-white">
              {isPlayer ? "Incoming Official Contact Inquiries" : "Sent Contact Inquiries"}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-gray-300">
              {requests.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#00ff88]" />
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">No Inquiries Found</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto">
              {isPlayer 
                ? "You have not received any contact inquiries yet. When verified scouts or scholarship directors discover your profile and request contact, they will be listed here."
                : "You have not sent any player contact requests yet. Browse showcases or scholarships to initiate inquiries."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {requests.map((req) => {
              const senderRoleTitle = req.senderRole === "SCHOLARSHIP_PROVIDER" ? "Scholarship Provider" : "Accredited Scout";
              const otherName = isPlayer ? (req.senderName || req.scoutName || "Scout/Provider") : (req.targetPlayerName || req.playerName || "Player");
              const otherOrg = isPlayer ? (req.senderOrganization || req.scoutOrganization) : "";

              return (
                <div key={req.id} className="p-4 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {otherName}
                      </span>
                      {otherOrg && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#00ff88]" /> {otherOrg}
                        </span>
                      )}
                      {getStatusBadge(req.status)}
                    </div>

                    <div className="text-[11px] text-gray-400 flex items-center gap-2">
                      <span className="font-mono text-gray-500">
                        {formatTimestamp(req.createdAt)}
                      </span>
                      {req.targetPlayerPosition && (
                        <span>• Targeted Position: <strong className="text-gray-200">{req.targetPlayerPosition}</strong></span>
                      )}
                    </div>

                    {req.message && (
                      <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm text-xs text-gray-300 leading-relaxed max-w-2xl mt-2">
                        <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">
                          Inquiry Statement:
                        </span>
                        "{req.message}"
                      </div>
                    )}

                    {req.declineReason && req.status === "DECLINED" && (
                      <div className="text-[11px] text-red-400 mt-1">
                        Decline Note: {req.declineReason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isPlayer && req.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleAccept(req)}
                          disabled={actionInProgress === req.id}
                          className="px-3 py-1.5 bg-[#00ff88] hover:bg-[#00e078] text-black font-extrabold uppercase tracking-wider text-xs rounded-sm flex items-center gap-1 transition-colors"
                        >
                          {actionInProgress === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>Accept & Chat</span>
                        </button>

                        <button
                          onClick={() => setDeclineModalId(req.id)}
                          disabled={actionInProgress === req.id}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-red-400 border border-red-500/20 font-bold uppercase tracking-wider text-xs rounded-sm flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {req.status === "ACCEPTED" && (
                      <button
                        onClick={() => {
                          if (req.conversationId && onOpenConversation) {
                            onOpenConversation(req.conversationId);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white font-bold uppercase tracking-wider text-xs rounded-sm flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#00ff88]" />
                        <span>Open Thread</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Decline Reason Modal */}
      {declineModalId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#181818] border border-white/15 rounded-sm p-5 max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              Decline Contact Inquiry
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Are you sure you wish to decline this contact request? You can provide a brief reason (optional).
            </p>

            <textarea
              rows={3}
              placeholder="e.g., Currently focused on ongoing club trials..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded-sm p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 mb-4"
            />

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setDeclineModalId(null)}
                className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-sm font-bold uppercase hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecline}
                disabled={actionInProgress === declineModalId}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold uppercase flex items-center gap-1.5"
              >
                {actionInProgress === declineModalId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

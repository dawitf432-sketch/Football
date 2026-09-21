import React, { useState } from "react";
import { X, Shield, Send, Loader2, AlertCircle, Building2, User } from "lucide-react";
import { UserRole } from "../../types";
import { contactService } from "../../lib/contactService";

interface SendContactRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    uid: string;
    name: string;
    role: UserRole;
    organization?: string;
  };
  targetPlayer: {
    id: string;
    name: string;
    position?: string;
    country?: string;
  };
  onSuccess?: () => void;
}

export default function SendContactRequestModal({
  isOpen,
  onClose,
  currentUser,
  targetPlayer,
  onSuccess
}: SendContactRequestModalProps) {
  const [subject, setSubject] = useState("Trial Opportunity / Official Inquiry");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please describe the nature of your inquiry.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await contactService.sendContactRequest({
        senderId: currentUser.uid,
        senderName: currentUser.name || "Club Representative",
        senderRole: currentUser.role,
        senderOrganization: currentUser.organization || "Football Club / Organization",
        targetPlayerId: targetPlayer.id,
        targetPlayerName: targetPlayer.name,
        targetPlayerPosition: targetPlayer.position,
        targetPlayerCountry: targetPlayer.country,
        subject: subject.trim(),
        message: message.trim()
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to transmit contact inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#161616] border border-white/15 rounded-sm p-6 max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00ff88]" />
            <h3 className="font-extrabold uppercase tracking-wide text-sm text-white">
              Official Contact Inquiry
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Safeguarding notice */}
        <div className="p-3 bg-white/5 border border-white/10 rounded-sm mb-4 text-xs text-gray-300">
          <p className="font-bold text-white mb-1">Youth Safeguarding Notice</p>
          Inquiries are recorded and delivered directly to the athlete's secure portal. Direct messaging will unlock once the athlete accepts.
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-500/10 border border-red-500/30 rounded-sm text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
              Target Athlete
            </label>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm flex items-center justify-between">
              <span className="font-bold text-white">{targetPlayer.name}</span>
              <span className="text-gray-400 font-mono text-[11px]">
                {targetPlayer.position} {targetPlayer.country && `• ${targetPlayer.country}`}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
              Your Organization / Club
            </label>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm text-gray-300">
              {currentUser.organization || "Accredited Scouting Network"}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
              Inquiry Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#202020] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#00ff88]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
              Inquiry Message & Opportunity Details
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explain the purpose of your contact inquiry (e.g., Academy trial dates, scholarship program overview, match scouting follow-up)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#202020] border border-white/10 rounded-sm p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-sm font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#00ff88] hover:bg-[#00e078] text-black font-extrabold uppercase rounded-sm flex items-center gap-1.5 transition-colors"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Contact Inquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { X, Send, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { PlayerPublicProfile } from "../../../types";
import { scoutService } from "../services/scoutService";
import { getCountryFlag } from "./ScoutPlayerCard";

interface ScoutContactModalProps {
  player: PlayerPublicProfile | null;
  scoutUser: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScoutContactModal({
  player,
  scoutUser,
  onClose,
  onSuccess
}: ScoutContactModalProps) {
  const [message, setMessage] = useState(
    player 
      ? `Greetings. On behalf of our scouting department, we are following ${player.name}'s progress in the academy. We would like to initiate an official discussion regarding developmental assessment and upcoming trial opportunities.` 
      : ""
  );
  const [inquiryType, setInquiryType] = useState<"TRIAL" | "SCHOLARSHIP" | "MONITORING" | "CONTRACT">("TRIAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!player) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please write an inquiry message.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await scoutService.createContactRequest({
        scoutId: scoutUser.uid,
        scoutName: scoutUser.name || "Scout Representative",
        scoutOrganization: scoutUser.organization || "Accredited Scouting Network",
        playerId: player.id,
        playerName: player.name,
        playerPosition: player.position,
        playerCountry: player.country,
        message: `[${inquiryType} INQUIRY]: ${message.trim()}`
      });

      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit contact request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1326] border border-white/10 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#070d18]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00f59b]/10 border border-[#00f59b]/30 flex items-center justify-center text-[#00f59b]">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Request Player Contact</h3>
              <p className="text-xs text-gray-400">Platform-controlled scouting inquiry</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Target Player Pill */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#070d18] border border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{getCountryFlag(player.country)}</span>
              <div>
                <div className="font-bold text-sm text-white">{player.name}</div>
                <div className="text-xs text-gray-400">{player.position} • {player.age} Years • {player.country}</div>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-[#00f59b]/10 text-[#00f59b] border border-[#00f59b]/20 font-medium">
              Verified Prospect
            </span>
          </div>

          {/* Privacy Protocol Notice */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-200">Protected Player Communication:</strong> In accordance with youth academy safeguarding protocols, private contact details are kept strictly confidential. Inquiries are routed through academy administration for review.
            </div>
          </div>

          {submitted ? (
            <div className="p-6 text-center space-y-2 bg-[#070d18] rounded-lg border border-[#00f59b]/30">
              <CheckCircle2 className="w-10 h-10 text-[#00f59b] mx-auto animate-bounce" />
              <div className="font-bold text-white text-sm">Official Inquiry Dispatched</div>
              <p className="text-xs text-gray-400">
                Status is marked as <span className="text-[#00f59b] font-mono">PENDING</span>. You will receive an instant notification when academy coordinators confirm authorization.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Inquiry Purpose
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "TRIAL", label: "Academy Trial" },
                    { id: "SCHOLARSHIP", label: "Scholarship Offer" },
                    { id: "MONITORING", label: "Formal Scouting" },
                    { id: "CONTRACT", label: "Club Assessment" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setInquiryType(type.id as any)}
                      className={`p-2 rounded text-xs font-medium border text-left transition-all ${
                        inquiryType === type.id
                          ? "bg-[#00f59b]/10 border-[#00f59b] text-[#00f59b]"
                          : "bg-[#070d18] border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Inquiry Details & Proposal
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline your club, upcoming observation schedule, or trial invitation details..."
                  className="w-full bg-[#070d18] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f59b] transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#00f59b] hover:bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-wide rounded-md transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,155,0.2)] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

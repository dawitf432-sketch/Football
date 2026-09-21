import React, { useState, useEffect } from "react";
import { MessageSquare, Shield, Send, UserCheck, Plus } from "lucide-react";
import { ProviderProfile } from "../../../types";
import UnifiedChatWindow from "../../../components/messaging/UnifiedChatWindow";
import ContactRequestsManager from "../../../components/messaging/ContactRequestsManager";
import SendContactRequestModal from "../../../components/messaging/SendContactRequestModal";

interface ProviderMessagesProps {
  providerId: string;
  profile: ProviderProfile | null;
  targetPlayer?: { userId: string; name: string } | null;
}

export default function ProviderMessages({
  providerId,
  profile,
  targetPlayer
}: ProviderMessagesProps) {
  const [activeTab, setActiveTab] = useState<"MESSAGES" | "REQUESTS">("MESSAGES");
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // If target player is passed from discovery/shortlist, automatically offer to send contact inquiry
  useEffect(() => {
    if (targetPlayer) {
      setShowInquiryModal(true);
    }
  }, [targetPlayer]);

  const handleOpenConversation = (convId: string) => {
    setSelectedConversationId(convId);
    setActiveTab("MESSAGES");
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("MESSAGES")}
            className={`px-4 py-2 rounded-sm text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              activeTab === "MESSAGES"
                ? "bg-[#00ff88] text-black"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Active Scholar Chats</span>
          </button>

          <button
            onClick={() => setActiveTab("REQUESTS")}
            className={`px-4 py-2 rounded-sm text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              activeTab === "REQUESTS"
                ? "bg-[#00ff88] text-black"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Sent Contact Inquiries</span>
          </button>
        </div>

        {targetPlayer && (
          <button
            onClick={() => setShowInquiryModal(true)}
            className="px-3.5 py-1.5 bg-[#00ff88] hover:bg-[#00e078] text-black font-extrabold uppercase text-xs tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Contact {targetPlayer.name}</span>
          </button>
        )}
      </div>

      {activeTab === "MESSAGES" ? (
        <UnifiedChatWindow
          currentUser={{
            uid: providerId,
            name: profile?.organizationName || "Scholarship Provider",
            role: "SCHOLARSHIP_PROVIDER"
          }}
          initialConversationId={selectedConversationId}
          headerTitle="Scholarship Admissions Desk"
          headerSubtitle="Official correspondence with accepted athlete candidates and platform representatives."
          onSelectContactRequestsTab={() => setActiveTab("REQUESTS")}
        />
      ) : (
        <ContactRequestsManager
          currentUser={{
            uid: providerId,
            name: profile?.organizationName || "Scholarship Provider",
            role: "SCHOLARSHIP_PROVIDER"
          }}
          onOpenConversation={handleOpenConversation}
        />
      )}

      {/* Target Player Contact Modal */}
      {showInquiryModal && targetPlayer && (
        <SendContactRequestModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          currentUser={{
            uid: providerId,
            name: profile?.organizationName || "Scholarship Provider",
            role: "SCHOLARSHIP_PROVIDER",
            organization: profile?.organizationName
          }}
          targetPlayer={{
            id: targetPlayer.userId,
            name: targetPlayer.name
          }}
          onSuccess={() => {
            setActiveTab("REQUESTS");
          }}
        />
      )}
    </div>
  );
}

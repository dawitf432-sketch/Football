import React, { useState, useEffect } from "react";
import { MessageSquare, Shield, UserCheck } from "lucide-react";
import UnifiedChatWindow from "../../../components/messaging/UnifiedChatWindow";
import ContactRequestsManager from "../../../components/messaging/ContactRequestsManager";
import { contactService } from "../../../lib/contactService";
import { ContactRequest } from "../../../types";

interface PlayerMessagesProps {
  user: {
    uid: string;
    name: string;
    email?: string;
  };
}

export default function PlayerMessages({ user }: PlayerMessagesProps) {
  const [activeTab, setActiveTab] = useState<"MESSAGES" | "INQUIRIES">("MESSAGES");
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Track pending contact inquiries
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = contactService.subscribeToPlayerContactRequests(user.uid, (requests) => {
      const pending = requests.filter(r => r.status === "PENDING").length;
      setPendingCount(pending);
    });
    return () => unsub();
  }, [user?.uid]);

  const handleOpenConversation = (convId: string) => {
    setSelectedConversationId(convId);
    setActiveTab("MESSAGES");
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("MESSAGES")}
          className={`px-4 py-2 rounded-sm text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-colors ${
            activeTab === "MESSAGES"
              ? "bg-[#00ff88] text-black"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Active Chats</span>
        </button>

        <button
          onClick={() => setActiveTab("INQUIRIES")}
          className={`px-4 py-2 rounded-sm text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-colors ${
            activeTab === "INQUIRIES"
              ? "bg-[#00ff88] text-black"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Official Contact Inquiries</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-red-500 text-white">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === "MESSAGES" ? (
        <UnifiedChatWindow
          currentUser={{
            uid: user.uid,
            name: user.name || "Player",
            role: "PLAYER",
            email: user.email
          }}
          initialConversationId={selectedConversationId}
          headerTitle="Player Messaging Center"
          headerSubtitle="Direct communication with your assigned coaches, accredited scouts, and scholarship providers."
          onSelectContactRequestsTab={() => setActiveTab("INQUIRIES")}
          pendingRequestsCount={pendingCount}
        />
      ) : (
        <ContactRequestsManager
          currentUser={{
            uid: user.uid,
            name: user.name || "Player",
            role: "PLAYER"
          }}
          onOpenConversation={handleOpenConversation}
        />
      )}
    </div>
  );
}

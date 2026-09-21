import React, { useState } from "react";
import { MessageSquare, Shield, Send, UserCheck } from "lucide-react";
import UnifiedChatWindow from "../../../components/messaging/UnifiedChatWindow";
import ContactRequestsManager from "../../../components/messaging/ContactRequestsManager";

interface ScoutMessagesProps {
  user: {
    uid: string;
    name: string;
    role?: string;
    organization?: string;
  };
}

export default function ScoutMessages({ user }: ScoutMessagesProps) {
  const [activeTab, setActiveTab] = useState<"MESSAGES" | "REQUESTS">("MESSAGES");
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);

  const handleOpenConversation = (convId: string) => {
    setSelectedConversationId(convId);
    setActiveTab("MESSAGES");
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Tab Controls */}
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
          <span>Active Scout Chats</span>
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

      {activeTab === "MESSAGES" ? (
        <UnifiedChatWindow
          currentUser={{
            uid: user.uid,
            name: user.name || "Accredited Scout",
            role: "SCOUT"
          }}
          initialConversationId={selectedConversationId}
          headerTitle="Scouting Communication Desk"
          headerSubtitle="Private, encrypted inquiries with authorized athletes who have accepted your contact requests."
          onSelectContactRequestsTab={() => setActiveTab("REQUESTS")}
        />
      ) : (
        <ContactRequestsManager
          currentUser={{
            uid: user.uid,
            name: user.name || "Accredited Scout",
            role: "SCOUT"
          }}
          onOpenConversation={handleOpenConversation}
        />
      )}
    </div>
  );
}

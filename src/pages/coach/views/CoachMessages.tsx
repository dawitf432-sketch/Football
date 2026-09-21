import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  UserPlus, 
  Search, 
  X, 
  Loader2, 
  User, 
  Shield 
} from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import UnifiedChatWindow from "../../../components/messaging/UnifiedChatWindow";
import { messagingService } from "../../../lib/messagingService";

interface CoachMessagesProps {
  user: {
    uid: string;
    name: string;
    email?: string;
  };
}

export default function CoachMessages({ user }: CoachMessagesProps) {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [playerSearch, setPlayerSearch] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);
  const [initiatingChat, setInitiatingChat] = useState<string | null>(null);

  // Fetch registered players for "New Chat" selector
  const openNewChatModal = async () => {
    setShowNewChatModal(true);
    setLoadingPlayers(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "PLAYER"));
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      setPlayers(list);
    } catch (err) {
      console.error("Error loading players:", err);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleStartChat = async (targetUser: any) => {
    setInitiatingChat(targetUser.id);
    try {
      const conv = await messagingService.getOrCreateConversation({
        currentUserId: user.uid,
        currentUserName: user.name || "Coach",
        currentUserRole: "COACH",
        targetUserId: targetUser.id,
        targetUserName: targetUser.name || "Player",
        targetUserRole: targetUser.role || "PLAYER",
        targetUserCountry: targetUser.country || "",
        type: targetUser.role === "ADMIN" ? "COACH_ADMIN" : "PLAYER_COACH"
      });

      setSelectedConversationId(conv.id);
      setShowNewChatModal(false);
    } catch (err) {
      console.error("Error creating coach chat thread:", err);
    } finally {
      setInitiatingChat(null);
    }
  };

  const filteredPlayers = players.filter((p) =>
    (p.name || "").toLowerCase().includes(playerSearch.toLowerCase()) ||
    (p.position || "").toLowerCase().includes(playerSearch.toLowerCase()) ||
    (p.country || "").toLowerCase().includes(playerSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Top Header with New Chat Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#00b8ff]" />
            Coach Communication Hub
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Direct, real-time messaging with your academy players and administration.
          </p>
        </div>

        <button
          onClick={openNewChatModal}
          className="px-3.5 py-2 bg-[#00b8ff] hover:bg-[#009edc] text-black font-extrabold uppercase text-xs tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <UnifiedChatWindow
        currentUser={{
          uid: user.uid,
          name: user.name || "Coach",
          role: "COACH",
          email: user.email
        }}
        initialConversationId={selectedConversationId}
        headerTitle="Team Communication Desk"
        headerSubtitle="Send tactical instructions, training reviews, and player guidance."
      />

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/15 rounded-sm p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#00b8ff]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Start New Player Conversation
                </h3>
              </div>
              <button onClick={() => setShowNewChatModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search players by name, position..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#1c1c1c] border border-white/10 rounded-sm text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00b8ff]"
              />
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
              {loadingPlayers ? (
                <div className="p-8 flex justify-center text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin text-[#00b8ff]" />
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs">
                  No players found.
                </div>
              ) : (
                filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-2.5 flex items-center justify-between hover:bg-white/5 transition-colors rounded-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center font-bold text-xs text-gray-200">
                        {player.name ? player.name.substring(0, 2).toUpperCase() : "PL"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{player.name}</div>
                        <div className="text-[10px] text-gray-400">
                          {player.position || "Squad Athlete"} {player.country && `• ${player.country}`}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartChat(player)}
                      disabled={initiatingChat === player.id}
                      className="px-3 py-1 bg-white/5 hover:bg-[#00b8ff] hover:text-black border border-white/10 text-white font-bold uppercase text-[10px] tracking-wider rounded-sm transition-colors flex items-center gap-1"
                    >
                      {initiatingChat === player.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span>Chat</span>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

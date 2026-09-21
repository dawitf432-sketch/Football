import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ShieldCheck, 
  Loader2, 
  Trash2, 
  Eye, 
  AlertCircle
} from "lucide-react";
import { ContactRequest, PlayerPublicProfile } from "../../../types";
import { scoutService } from "../services/scoutService";
import { getCountryFlag, getPositionColor } from "../components/ScoutPlayerCard";
import ScoutPlayerProfileModal from "../components/ScoutPlayerProfileModal";

interface ScoutContactRequestsProps {
  user: any;
}

export default function ScoutContactRequests({ user }: ScoutContactRequestsProps) {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerPublicProfile | null>(null);

  useEffect(() => {
    loadRequests();
  }, [user]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const list = await scoutService.getScoutContactRequests(user.uid);
      setRequests(list);
    } catch (err) {
      console.error("Error loading contact requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlayer = async (playerId: string) => {
    try {
      const profile = await scoutService.getPlayerPublicProfile(playerId);
      if (profile) {
        setSelectedPlayer(profile);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filterStatus === "ALL") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Scouting Contact Inquiries
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Platform-mediated trial invitations, club monitoring requests, and scholarship communications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
            {requests.length} Total Submissions
          </span>
        </div>
      </div>

      {/* Protocol Banner */}
      <div className="p-4 bg-[#0b1326] border border-white/10 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#00f59b] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <strong className="text-white">Safeguarded Youth Player Communication:</strong>
          <p className="text-gray-400 leading-relaxed">
            All scout contact inquiries are vetted by academy coordinators to safeguard youth players. Once an inquiry is <span className="text-[#00f59b] font-semibold">ACCEPTED</span>, direct platform messaging with player guardians and academy managers is unlocked in the Messages portal.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "ALL", label: "All Inquiries" },
          { id: "PENDING", label: "Pending Review" },
          { id: "ACCEPTED", label: "Authorized / Accepted" },
          { id: "DECLINED", label: "Declined" },
          { id: "CLOSED", label: "Closed" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === tab.id
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                : "bg-[#0b1326] text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-sm">Retrieving inquiry records...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-[#0b1326] border border-white/10 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No inquiries found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You have not submitted any inquiries in this status category. Browse Player Discovery to initiate an inquiry.
          </p>
          <Link
            to="/scout/discover"
            className="inline-block px-4 py-2 bg-[#00f59b] hover:bg-[#00e5ff] text-black text-xs font-bold uppercase tracking-wider rounded-md transition-all mt-2"
          >
            Browse Discovery
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const flag = getCountryFlag(req.playerCountry || "");
            const posStyle = getPositionColor(req.playerPosition || "Midfielder");

            return (
              <div 
                key={req.id}
                className="bg-[#0b1326] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4 shadow-md hover:border-purple-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{flag}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-white">{req.playerName}</h3>
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
                          {req.playerPosition || "Prospect"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Target Academy Prospect • Submitted: {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      req.status === "ACCEPTED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : req.status === "DECLINED"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        : req.status === "CLOSED"
                        ? "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse"
                    }`}>
                      {req.status === "ACCEPTED" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {req.status === "DECLINED" && <XCircle className="w-3.5 h-3.5" />}
                      {req.status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
                      {req.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#070d18] rounded-lg border border-white/5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Inquiry Proposal Dispatched
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {req.message}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleOpenPlayer(req.playerId)}
                    className="text-xs text-[#00f59b] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Public Dossier
                  </button>

                  {req.status === "ACCEPTED" ? (
                    <Link
                      to="/scout/messages"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Open Messages
                    </Link>
                  ) : req.status === "PENDING" ? (
                    <span className="text-xs text-amber-400/90 italic flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Awaiting coordinator review
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dossier Modal */}
      {selectedPlayer && (
        <ScoutPlayerProfileModal
          player={selectedPlayer}
          isShortlisted={false}
          onClose={() => setSelectedPlayer(null)}
          onToggleShortlist={() => {}}
          onSaveNotes={async () => {}}
          onRequestContact={() => {}}
        />
      )}
    </div>
  );
}

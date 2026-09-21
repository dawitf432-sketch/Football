import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { User, Shield, Search, Loader2, Award, Activity, Filter, ChevronRight } from "lucide-react";

export default function CoachPlayers({ user }: { user: any }) {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("ALL");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  useEffect(() => {
    fetchPlayers();
  }, [user]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      // Fetch players with role PLAYER
      const q = query(collection(db, "users"), where("role", "==", "PLAYER"));
      const snap = await getDocs(q);
      
      const playerList: any[] = [];
      for (const userDoc of snap.docs) {
        const uData = userDoc.data();
        let profileData = {};
        try {
          const pDoc = await getDoc(doc(db, "playerProfiles", userDoc.id));
          if (pDoc.exists()) {
            profileData = pDoc.data();
          }
        } catch (e) {
          // ignore profile read errors
        }

        playerList.push({
          id: userDoc.id,
          name: uData.name || "Player",
          email: uData.email,
          country: uData.country || "GBR",
          status: uData.status || "ACTIVE",
          position: (profileData as any).position || "MID",
          age: (profileData as any).age || "17",
          preferredFoot: (profileData as any).preferredFoot || "Right",
          bio: (profileData as any).bio || "Dedicated academy player.",
          overallProgress: 65 + (userDoc.id.charCodeAt(0) % 25)
        });
      }

      setPlayers(playerList);
    } catch (err) {
      console.error("Error fetching coach players:", err);
    }
    setLoading(false);
  };

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos = selectedPosition === "ALL" || p.position === selectedPosition;
    return matchesSearch && matchesPos;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase mb-1">My Squad Players</h1>
          <p className="text-gray-400">Monitor developmental readiness, positions, and skill evolution.</p>
        </div>
        <div className="text-xs font-mono text-[#00b8ff] bg-[#00b8ff]/10 px-3 py-1.5 rounded-sm self-start">
          {players.length} Active Roster Members
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-[#111] border border-white/10 p-3 rounded-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by player name or country..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00b8ff]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 hidden md:block" />
          <select
            value={selectedPosition}
            onChange={e => setSelectedPosition(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00b8ff]"
          >
            <option value="ALL">All Positions</option>
            <option value="GK">Goalkeeper (GK)</option>
            <option value="DEF">Defender (DEF)</option>
            <option value="MID">Midfielder (MID)</option>
            <option value="FWD">Forward (FWD)</option>
            <option value="WNG">Winger (WNG)</option>
          </select>
        </div>
      </div>

      {/* Player Modal / Detail View */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/20 rounded-sm max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold uppercase">{selectedPlayer.name}</h3>
                <div className="text-xs text-[#00b8ff] font-mono">ID: USR-{selectedPlayer.id.substring(0, 6)} • {selectedPlayer.country}</div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="text-gray-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 p-3 rounded-sm">
                <div className="text-xs text-gray-500 uppercase font-bold">Position</div>
                <div className="text-white font-bold mt-1">{selectedPlayer.position}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-sm">
                <div className="text-xs text-gray-500 uppercase font-bold">Preferred Foot</div>
                <div className="text-white font-bold mt-1">{selectedPlayer.preferredFoot}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-sm">
                <div className="text-xs text-gray-500 uppercase font-bold">Age</div>
                <div className="text-white font-bold mt-1">{selectedPlayer.age} Years Old</div>
              </div>
              <div className="bg-white/5 p-3 rounded-sm">
                <div className="text-xs text-gray-500 uppercase font-bold">Overall Progress</div>
                <div className="text-[#00ff88] font-bold mt-1">{selectedPlayer.overallProgress}%</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold mb-1">Player Dossier</div>
              <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-sm">{selectedPlayer.bio}</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded-sm hover:bg-gray-200"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00b8ff]" /></div>
      ) : filteredPlayers.length === 0 ? (
        <div className="bg-[#111] border border-white/10 p-12 text-center rounded-sm text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50 text-[#00b8ff]" />
          <h3 className="text-lg font-bold text-white mb-2 uppercase">No Players Matching Query</h3>
          <p className="text-sm max-w-sm mx-auto">No athletes found matching your search term or position filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map(player => (
            <div
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              className="bg-[#111] border border-white/10 hover:border-[#00b8ff]/40 p-5 rounded-sm flex flex-col justify-between cursor-pointer transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#00b8ff]/10 text-[#00b8ff]">
                    {player.position}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {player.country}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-[#00b8ff] group-hover:bg-[#00b8ff] group-hover:text-black transition-colors">
                    {player.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-[#00b8ff] transition-colors">{player.name}</h3>
                    <div className="text-xs text-gray-500">{player.age} yrs • {player.preferredFoot} Foot</div>
                  </div>
                </div>

                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Development Index</span>
                    <span className="font-mono text-[#00ff88] font-bold">{player.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00ff88] h-full" style={{ width: `${player.overallProgress}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 group-hover:text-white transition-colors mt-2">
                <span>View Full Profile</span>
                <ChevronRight className="w-4 h-4 text-[#00b8ff]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

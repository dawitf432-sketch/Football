import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Loader2, Users, Plus, Globe } from "lucide-react";

export default function CoachTeams({ user }: { user: any }) {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", country: "GBR" });
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [user]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "teams"), where("coachId", "==", user.uid)));
      setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.name) return;
    setCreating(true);
    try {
      await addDoc(collection(db, "teams"), {
        ...formData,
        coachId: user.uid,
        createdAt: new Date(),
        playerCount: 0
      });
      setShowCreate(false);
      setFormData({ name: "", country: "GBR" });
      await fetchTeams();
    } catch (err) {
      console.error(err);
    }
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold uppercase mb-1">My Teams</h1>
          <p className="text-gray-400">Manage the teams assigned to you.</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#00b8ff] text-black px-4 py-2 font-bold uppercase tracking-wider text-sm flex items-center gap-2 rounded-sm hover:bg-[#0096d6] transition-all"
        >
          <Plus className="w-4 h-4" /> {showCreate ? "Cancel" : "Create Team"}
        </button>
      </div>

      {showCreate && (
        <div className="bg-[#111] p-6 border border-[#00b8ff]/30 rounded-sm space-y-4">
          <h3 className="font-bold uppercase tracking-wide text-[#00b8ff]">New Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Team Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]" placeholder="e.g. Academy U19s" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Country</label>
              <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value.toUpperCase()})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff] font-mono uppercase" maxLength={3} />
            </div>
          </div>
          <button onClick={handleCreate} disabled={creating} className="px-6 py-2 bg-white text-black font-bold uppercase text-sm tracking-wider rounded-sm hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50">
             {creating && <Loader2 className="w-4 h-4 animate-spin" />} Create Team
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00b8ff]" /></div>
      ) : teams.length === 0 ? (
        <div className="bg-[#111] border border-white/10 p-12 text-center rounded-sm text-gray-500">
           <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
           <p>You have no teams assigned to you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map(team => (
            <div key={team.id} className="bg-[#111] border border-white/10 p-6 rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                     <Users className="w-5 h-5 text-[#00b8ff]" />
                   </div>
                   <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-sm text-gray-400">
                      ID: {team.id.substring(0,6)}
                   </span>
                </div>
                <h3 className="font-bold text-xl mb-1">{team.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-mono uppercase mb-4">
                  <Globe className="w-3 h-3" /> {team.country}
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-sm font-bold"><span className="text-[#00b8ff]">{team.playerCount || 0}</span> Players</div>
                <button className="text-xs font-bold uppercase tracking-wider text-white hover:text-[#00b8ff] transition-colors">Manage</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

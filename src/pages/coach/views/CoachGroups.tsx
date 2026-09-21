import { useState, useEffect, FormEvent } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { UsersRound, Plus, Loader2, Trash2, Edit3, Shield, UserPlus, X } from "lucide-react";

export default function CoachGroups({ user }: { user: any }) {
  const [groups, setGroups] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    teamId: "",
    teamName: "",
    ageGroup: "U17",
    focusArea: "Tactical & Technical",
    players: [] as string[]
  });

  const [newPlayerName, setNewPlayerName] = useState("");

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const teamsSnap = await getDocs(query(collection(db, "teams"), where("coachId", "==", user.uid)));
      const teamsList = teamsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTeams(teamsList);
      if (teamsList.length > 0 && !formData.teamId) {
        setFormData(prev => ({
          ...prev,
          teamId: teamsList[0].id,
          teamName: (teamsList[0] as any).name || "Default Team"
        }));
      }

      const groupsSnap = await getDocs(query(collection(db, "teamGroups"), where("coachId", "==", user.uid)));
      setGroups(groupsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error loading groups:", err);
    }
    setLoading(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setCreating(true);
    try {
      const selectedTeam = teams.find(t => t.id === formData.teamId);
      const groupData = {
        name: formData.name,
        teamId: formData.teamId,
        teamName: selectedTeam ? selectedTeam.name : "Assigned Team",
        coachId: user.uid,
        ageGroup: formData.ageGroup,
        focusArea: formData.focusArea,
        players: formData.players,
        playerCount: formData.players.length,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await addDoc(collection(db, "teamGroups"), groupData);
      setFormData({
        name: "",
        teamId: teams[0]?.id || "",
        teamName: teams[0]?.name || "",
        ageGroup: "U17",
        focusArea: "Tactical & Technical",
        players: []
      });
      setShowCreate(false);
      await fetchData();
    } catch (err) {
      console.error("Error creating group:", err);
    }
    setCreating(false);
  };

  const handleAddPlayerToForm = () => {
    if (!newPlayerName.trim()) return;
    if (!formData.players.includes(newPlayerName.trim())) {
      setFormData({
        ...formData,
        players: [...formData.players, newPlayerName.trim()]
      });
    }
    setNewPlayerName("");
  };

  const handleRemovePlayerFromForm = (player: string) => {
    setFormData({
      ...formData,
      players: formData.players.filter(p => p !== player)
    });
  };

  const handleDelete = async (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      await deleteDoc(doc(db, "teamGroups", groupId));
      await fetchData();
    } catch (err) {
      console.error("Error deleting group:", err);
    }
  };

  const handleToggleArchive = async (group: any) => {
    const newStatus = group.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED";
    try {
      await updateDoc(doc(db, "teamGroups", group.id), { status: newStatus });
      await fetchData();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase mb-1">Team Groups</h1>
          <p className="text-gray-400">Organize squad units (U15, U17, position pods) and assign specific regimens.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#00b8ff] text-black px-4 py-2 font-bold uppercase tracking-wider text-sm flex items-center gap-2 rounded-sm hover:bg-[#0096d6] transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> {showCreate ? "Cancel" : "Create Group"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-[#111] p-6 border border-[#00b8ff]/30 rounded-sm space-y-4">
          <h3 className="font-bold uppercase tracking-wide text-[#00b8ff]">Create Squad Group</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Group Name</label>
              <input
                type="text"
                placeholder="e.g. U17 Strikers & Wingers"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Parent Team</label>
              <select
                value={formData.teamId}
                onChange={e => setFormData({ ...formData, teamId: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
                {teams.length === 0 && (
                  <option value="">No Teams Created Yet</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Age Bracket</label>
              <select
                value={formData.ageGroup}
                onChange={e => setFormData({ ...formData, ageGroup: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
              >
                <option value="U13">U13 Academy</option>
                <option value="U15">U15 Junior</option>
                <option value="U17">U17 Elite</option>
                <option value="U19">U19 Reserves</option>
                <option value="FIRST_TEAM">First Team</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Add Players to Group</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Enter player name or jersey/ID"
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
              />
              <button
                type="button"
                onClick={handleAddPlayerToForm}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 font-bold uppercase text-xs rounded-sm transition-colors flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.players.map(player => (
                <span key={player} className="bg-white/5 border border-white/10 text-xs px-3 py-1 rounded-sm flex items-center gap-2">
                  {player}
                  <button type="button" onClick={() => handleRemovePlayerFromForm(player)} className="text-gray-400 hover:text-[#ff0055]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 bg-white text-black font-bold uppercase text-sm tracking-wider rounded-sm hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {creating && <Loader2 className="w-4 h-4 animate-spin" />} Save Squad Group
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00b8ff]" /></div>
      ) : groups.length === 0 ? (
        <div className="bg-[#111] border border-white/10 p-12 text-center rounded-sm text-gray-500">
          <UsersRound className="w-12 h-12 mx-auto mb-4 opacity-50 text-[#00b8ff]" />
          <h3 className="text-lg font-bold text-white mb-2 uppercase">No Team Groups Yet</h3>
          <p className="max-w-md mx-auto mb-6 text-sm">Organize your squad by age tiers, unit tactics, or specialty squads.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group.id} className="bg-[#111] border border-white/10 hover:border-white/20 p-6 rounded-sm flex flex-col justify-between transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00b8ff]/10 text-[#00b8ff] px-2 py-1 rounded-sm">
                    {group.ageGroup || "SQUAD"}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                    group.status === "ARCHIVED" ? "bg-[#ff0055]/10 text-[#ff0055]" : "bg-[#00ff88]/10 text-[#00ff88]"
                  }`}>
                    {group.status || "ACTIVE"}
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-1">{group.name}</h3>
                <div className="text-xs text-gray-400 font-mono mb-4">Team: {group.teamName || "Academy Squad"}</div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Players in Group ({group.players?.length || 0})</div>
                  <div className="flex flex-wrap gap-1">
                    {group.players && group.players.length > 0 ? (
                      group.players.map((p: string, idx: number) => (
                        <span key={idx} className="text-[11px] bg-white/5 px-2 py-0.5 rounded text-gray-300">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">No players assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleToggleArchive(group)}
                  className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                >
                  {group.status === "ARCHIVED" ? "Restore" : "Archive"}
                </button>
                <button
                  onClick={() => handleDelete(group.id)}
                  className="text-gray-500 hover:text-[#ff0055] transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

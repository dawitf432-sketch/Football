import { useState, useEffect, FormEvent } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { ClipboardList, Plus, Loader2, CheckCircle2, Clock, Calendar, AlertCircle } from "lucide-react";

export default function CoachAssignments({ user }: { user: any }) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [drills, setDrills] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    drillId: "",
    drillTitle: "",
    targetType: "TEAM", // TEAM | GROUP | PLAYER
    targetId: "",
    targetName: "",
    dueDate: "",
    instructions: ""
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch available training drills
      const drillsSnap = await getDocs(collection(db, "training"));
      const drillList = drillsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDrills(drillList);

      // 2. Fetch coach's teams
      const teamsSnap = await getDocs(query(collection(db, "teams"), where("coachId", "==", user.uid)));
      const teamList = teamsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTeams(teamList);

      // 3. Fetch coach's groups
      const groupsSnap = await getDocs(query(collection(db, "teamGroups"), where("coachId", "==", user.uid)));
      const groupList = groupsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setGroups(groupList);

      // 4. Fetch players
      const playersSnap = await getDocs(query(collection(db, "users"), where("role", "==", "PLAYER")));
      const playerList = playersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPlayers(playerList);

      // 5. Fetch assignments created by this coach
      const assignSnap = await getDocs(query(collection(db, "trainingAssignments"), where("coachId", "==", user.uid)));
      setAssignments(assignSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching assignment data:", err);
    }
    setLoading(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.drillId || !form.targetId) return;

    setSubmitting(true);
    try {
      const selectedDrill = drills.find(d => d.id === form.drillId);
      let targetName = "";
      if (form.targetType === "TEAM") {
        targetName = teams.find(t => t.id === form.targetId)?.name || "Team";
      } else if (form.targetType === "GROUP") {
        targetName = groups.find(g => g.id === form.targetId)?.name || "Squad Group";
      } else {
        targetName = players.find(p => p.id === form.targetId)?.name || "Player";
      }

      await addDoc(collection(db, "trainingAssignments"), {
        drillId: form.drillId,
        drillTitle: selectedDrill?.title || "Training Drill",
        drillCategory: selectedDrill?.category || "BALL SKILLS",
        coachId: user.uid,
        coachName: user.name || "Coach",
        targetType: form.targetType,
        targetId: form.targetId,
        targetName: targetName,
        dueDate: form.dueDate || "Next Practice",
        instructions: form.instructions || "Focus on precision and rhythm.",
        status: "ASSIGNED", // ASSIGNED, IN_PROGRESS, COMPLETED
        createdAt: new Date()
      });

      setForm({
        drillId: "",
        drillTitle: "",
        targetType: "TEAM",
        targetId: "",
        targetName: "",
        dueDate: "",
        instructions: ""
      });
      setShowCreate(false);
      await fetchData();
    } catch (err) {
      console.error("Error creating training assignment:", err);
    }
    setSubmitting(false);
  };

  const handleStatusChange = async (assignmentId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "trainingAssignments", assignmentId), {
        status: newStatus,
        updatedAt: new Date()
      });
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error("Error updating assignment status:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase mb-1">Training Assignments</h1>
          <p className="text-gray-400">Dispatch drills directly to teams, specialized units, or individual athletes.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#00b8ff] text-black px-4 py-2 font-bold uppercase tracking-wider text-sm flex items-center gap-2 rounded-sm hover:bg-[#0096d6] transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> {showCreate ? "Cancel" : "New Assignment"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-[#111] p-6 border border-[#00b8ff]/30 rounded-sm space-y-4">
          <h3 className="font-bold uppercase tracking-wide text-[#00b8ff]">Create Drill Assignment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Drill Catalog Item</label>
              <select
                value={form.drillId}
                onChange={e => setForm({ ...form, drillId: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
                required
              >
                <option value="">Select Training Drill...</option>
                {drills.map(d => (
                  <option key={d.id} value={d.id}>{d.title} ({d.category || 'SKILL'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Assignment Scope</label>
              <div className="grid grid-cols-3 gap-2">
                {(["TEAM", "GROUP", "PLAYER"] as const).map(scope => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => setForm({ ...form, targetType: scope, targetId: "" })}
                    className={`py-2 text-xs font-bold uppercase rounded-sm border transition-all ${
                      form.targetType === scope
                        ? "bg-[#00b8ff] text-black border-[#00b8ff]"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Select Target {form.targetType}
              </label>
              <select
                value={form.targetId}
                onChange={e => setForm({ ...form, targetId: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
                required
              >
                <option value="">Choose {form.targetType}...</option>
                {form.targetType === "TEAM" && teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.country})</option>
                ))}
                {form.targetType === "GROUP" && groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.ageGroup})</option>
                ))}
                {form.targetType === "PLAYER" && players.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target Completion Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Coach Notes & Tactical Instructions</label>
            <textarea
              rows={3}
              placeholder="e.g. Ensure high tempo ball circulation, minimum 20 reps on weak foot..."
              value={form.instructions}
              onChange={e => setForm({ ...form, instructions: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff] resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-white text-black font-bold uppercase text-sm tracking-wider rounded-sm hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Dispatch Assignment
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00b8ff]" /></div>
      ) : assignments.length === 0 ? (
        <div className="bg-[#111] border border-white/10 p-12 text-center rounded-sm text-gray-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50 text-[#00b8ff]" />
          <h3 className="text-lg font-bold text-white mb-2 uppercase">No Active Assignments</h3>
          <p className="max-w-md mx-auto mb-6 text-sm">Assign drills to your squad to monitor execution and performance progress.</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Assigned Drill</th>
                  <th className="p-4">Target Audience</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {assignments.map(item => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{item.drillTitle}</div>
                      <div className="text-xs text-[#00b8ff] uppercase">{item.drillCategory}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-gray-300">
                        {item.targetType}: {item.targetName}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-mono text-gray-400">
                      {item.dueDate || "Flexible"}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                        item.status === "COMPLETED"
                          ? "bg-[#00ff88]/10 text-[#00ff88]"
                          : item.status === "IN_PROGRESS"
                          ? "bg-[#ffd700]/10 text-[#ffd700]"
                          : "bg-[#00b8ff]/10 text-[#00b8ff]"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1">
                        {(["ASSIGNED", "IN_PROGRESS", "COMPLETED"] as const).map(statusVal => (
                          <button
                            key={statusVal}
                            onClick={() => handleStatusChange(item.id, statusVal)}
                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded-sm transition-colors ${
                              item.status === statusVal
                                ? "bg-white text-black"
                                : "bg-white/5 text-gray-400 hover:text-white"
                            }`}
                          >
                            {statusVal === "IN_PROGRESS" ? "In Prog" : statusVal === "COMPLETED" ? "Done" : "Assigned"}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

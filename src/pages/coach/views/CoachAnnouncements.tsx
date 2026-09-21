import { useState, useEffect, FormEvent } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import { Megaphone, Plus, Loader2, Calendar, Users, Send } from "lucide-react";

export default function CoachAnnouncements({ user }: { user: any }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    category: "TEAM NOTICE", // TEAM NOTICE, SCHEDULE, DRILL REMINDER, MATCH DAY
    targetType: "TEAM", // TEAM | GROUP | ALL_PLAYERS
    targetId: ""
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Teams
      const teamsSnap = await getDocs(query(collection(db, "teams"), where("coachId", "==", user.uid)));
      const teamList = teamsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTeams(teamList);
      if (teamList.length > 0 && !form.targetId) {
        setForm(prev => ({ ...prev, targetId: teamList[0].id }));
      }

      // Groups
      const groupsSnap = await getDocs(query(collection(db, "teamGroups"), where("coachId", "==", user.uid)));
      setGroups(groupsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Announcements
      const annSnap = await getDocs(query(collection(db, "announcements"), where("coachId", "==", user.uid)));
      setAnnouncements(annSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
    setLoading(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;

    setSubmitting(true);
    try {
      let targetName = "All Players";
      if (form.targetType === "TEAM") {
        targetName = teams.find(t => t.id === form.targetId)?.name || "Assigned Team";
      } else if (form.targetType === "GROUP") {
        targetName = groups.find(g => g.id === form.targetId)?.name || "Squad Group";
      }

      await addDoc(collection(db, "announcements"), {
        title: form.title,
        message: form.message,
        category: form.category,
        targetType: form.targetType,
        targetId: form.targetId,
        targetName: targetName,
        coachId: user.uid,
        coachName: user.name || "Coach",
        createdAt: new Date()
      });

      setForm({
        title: "",
        message: "",
        category: "TEAM NOTICE",
        targetType: "TEAM",
        targetId: teams[0]?.id || ""
      });
      setShowCreate(false);
      await fetchData();
    } catch (err) {
      console.error("Error sending announcement:", err);
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase mb-1">Squad Announcements</h1>
          <p className="text-gray-400">Broadcast schedule updates, tactical advisories, or session reminders.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#00b8ff] text-black px-4 py-2 font-bold uppercase tracking-wider text-sm flex items-center gap-2 rounded-sm hover:bg-[#0096d6] transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> {showCreate ? "Cancel" : "New Broadcast"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-[#111] p-6 border border-[#00b8ff]/30 rounded-sm space-y-4">
          <h3 className="font-bold uppercase tracking-wide text-[#00b8ff]">Publish Announcement</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Notice Title</label>
              <input
                type="text"
                placeholder="e.g. Schedule Change: Saturday Tactical Walkthrough"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
              >
                <option value="TEAM NOTICE">General Notice</option>
                <option value="SCHEDULE">Schedule / Match Day</option>
                <option value="DRILL REMINDER">Training Drill Reminder</option>
                <option value="TACTICAL ALERT">Tactical Briefing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target Scope</label>
              <select
                value={form.targetType}
                onChange={e => setForm({ ...form, targetType: e.target.value, targetId: "" })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
              >
                <option value="TEAM">Specific Team</option>
                <option value="GROUP">Specific Squad Group</option>
                <option value="ALL_PLAYERS">All Assigned Players</option>
              </select>
            </div>
          </div>

          {form.targetType !== "ALL_PLAYERS" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Target {form.targetType}</label>
              <select
                value={form.targetId}
                onChange={e => setForm({ ...form, targetId: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
                required
              >
                <option value="">Select {form.targetType}...</option>
                {form.targetType === "TEAM" && teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.country})</option>
                ))}
                {form.targetType === "GROUP" && groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.ageGroup})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message Body</label>
            <textarea
              rows={4}
              placeholder="Write announcement details..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff] resize-none"
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-white text-black font-bold uppercase text-sm tracking-wider rounded-sm hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Broadcast Notice
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00b8ff]" /></div>
      ) : announcements.length === 0 ? (
        <div className="bg-[#111] border border-white/10 p-12 text-center rounded-sm text-gray-500">
          <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50 text-[#00b8ff]" />
          <h3 className="text-lg font-bold text-white mb-2 uppercase">No Announcements Yet</h3>
          <p className="max-w-md mx-auto mb-6 text-sm">Keep your squad aligned by broadcasting important dates and requirements.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(item => (
            <div key={item.id} className="bg-[#111] border border-white/10 p-6 rounded-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00b8ff]/10 text-[#00b8ff] px-2 py-1 rounded-sm">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400 px-2 py-1 rounded-sm">
                    To: {item.targetName || "Squad"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Recent"}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

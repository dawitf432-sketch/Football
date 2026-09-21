import { useState, useEffect, FormEvent } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Key, Plus, Loader2, Copy, Check } from "lucide-react";
import { fetchWithAuth } from "../../../lib/fetchWithAuth";
import { logAdminActivity } from "../../../lib/adminUtils";

export default function AdminAccessIds() {
  const [ids, setIds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [copied, setCopied] = useState("");

  const [formData, setFormData] = useState({ role: "PLAYER", count: 1, country: "GBR" });

  useEffect(() => {
    fetchIds();
  }, []);

  const fetchIds = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "accessIds"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setIds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      // Use our secure server endpoint to generate atomic keys
      await fetchWithAuth("/api/admin/access-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      await logAdminActivity(`Generated ${formData.count} access IDs for ${formData.role}`, "accessIds");
      setShowGenerate(false);
      await fetchIds();
    } catch (err) {
      console.error(err);
    }
    setGenerating(false);
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this ID?")) return;
    try {
      await deleteDoc(doc(db, "accessIds", id));
      await logAdminActivity("Revoked access ID", id);
      await fetchIds();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight">Access IDs</h2>
        <button 
          onClick={() => setShowGenerate(!showGenerate)}
          className="bg-[#9d00ff] hover:bg-[#b033ff] text-white px-4 py-2 font-bold uppercase tracking-wider text-sm flex items-center gap-2 rounded-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Generate IDs
        </button>
      </div>

      {showGenerate && (
        <form onSubmit={handleGenerate} className="bg-[#111] border border-[#9d00ff]/30 p-6 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Role</label>
            <select 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#9d00ff] transition-colors"
            >
              <option value="PLAYER">PLAYER</option>
              <option value="COACH">COACH</option>
              <option value="SCOUT">SCOUT</option>
              <option value="SCHOLARSHIP_PROVIDER">SCHOLARSHIP_PROVIDER</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Country Code</label>
            <input 
              type="text" 
              maxLength={3}
              value={formData.country} 
              onChange={e => setFormData({...formData, country: e.target.value.toUpperCase()})}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#9d00ff] transition-colors uppercase font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quantity</label>
            <input 
              type="number" 
              min="1" max="50"
              value={formData.count} 
              onChange={e => setFormData({...formData, count: parseInt(e.target.value)})}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#9d00ff] transition-colors font-mono"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={generating} className="w-full bg-white text-black font-bold uppercase tracking-wider py-3 rounded-sm hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50">
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Generation"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#9d00ff]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 font-bold uppercase tracking-wider text-xs text-gray-400">
                <tr>
                  <th className="p-4">Key ID</th>
                  <th className="p-4">Role / Country</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ids.map((row: any) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-mono text-[#9d00ff] font-bold flex items-center gap-2">
                      <Key className="w-4 h-4 text-gray-500" />
                      {row.id}
                      <button onClick={() => copyToClipboard(row.id)} className="text-gray-500 hover:text-white ml-2">
                        {copied === row.id ? <Check className="w-4 h-4 text-[#00ff88]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{row.role}</div>
                      <div className="text-xs text-gray-500 font-mono">{row.country}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                        row.status === 'UNUSED' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 
                        row.status === 'CONSUMED' ? 'bg-[#ff0055]/10 text-[#ff0055]' : 
                        'bg-white/10 text-gray-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 font-mono">{row.assignedUserId ? `USR-${row.assignedUserId.substring(0,6)}...` : "-"}</td>
                    <td className="p-4 text-right">
                      {row.status === 'UNUSED' && (
                        <button onClick={() => handleRevoke(row.id)} className="text-[#ff0055] font-bold uppercase text-xs tracking-wide hover:underline">
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {ids.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No Access IDs generated yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

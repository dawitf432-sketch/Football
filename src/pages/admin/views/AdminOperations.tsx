import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { Shield, PlayCircle, Loader2, Users, FileText } from "lucide-react";
import { logAdminActivity } from "../../../lib/adminUtils";

export default function AdminOperations() {
  const [activeTab, setActiveTab] = useState("SHOWCASES");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, activeTab.toLowerCase()), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, activeTab.toLowerCase(), id), { status });
      await logAdminActivity(`Updated ${activeTab.toLowerCase()} status to ${status}`, id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight">Operations</h2>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-2">
        {["SHOWCASES", "TEAMS", "SCHOLARSHIPS"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold uppercase tracking-wider pb-2 px-2 border-b-2 transition-colors ${
              activeTab === tab ? "border-[#ff0055] text-[#ff0055]" : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#9d00ff]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 font-bold uppercase tracking-wider text-xs text-gray-400">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center shrink-0">
                        {activeTab === 'SHOWCASES' ? <PlayCircle className="w-4 h-4 text-gray-400" /> : 
                         activeTab === 'TEAMS' ? <Users className="w-4 h-4 text-gray-400" /> : 
                         <FileText className="w-4 h-4 text-gray-400" />}
                      </div>
                      <span>{item.title || item.name || `Item ${item.id.substring(0,6)}`}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                        ['APPROVED', 'PUBLISHED', 'ACTIVE'].includes(item.status) ? 'bg-[#00ff88]/10 text-[#00ff88]' : 
                        ['REJECTED', 'HIDDEN', 'DISABLED'].includes(item.status) ? 'bg-[#ff0055]/10 text-[#ff0055]' : 
                        'bg-white/10 text-gray-400'
                      }`}>
                        {item.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs font-mono">
                       {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 flex items-center justify-end gap-3">
                      {activeTab === 'SHOWCASES' && (
                        <>
                          {item.videoUrl && (
                            <a href={item.videoUrl} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-wider text-[#00b8ff] hover:underline">
                              Watch
                            </a>
                          )}
                          <button onClick={() => handleUpdateStatus(item.id, 'APPROVED')} className="text-xs font-bold uppercase tracking-wider text-[#00ff88] hover:underline">Approve</button>
                          <button onClick={() => handleUpdateStatus(item.id, 'REJECTED')} className="text-xs font-bold uppercase tracking-wider text-[#ff0055] hover:underline">Reject</button>
                        </>
                      )}
                      {activeTab !== 'SHOWCASES' && (
                         <button className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">Manage</button>
                      )}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No data found in {activeTab}.</td>
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

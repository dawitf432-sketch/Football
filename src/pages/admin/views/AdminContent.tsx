import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { BookOpen, Plus, Loader2, PlayCircle, Edit3, Trash2 } from "lucide-react";
import { logAdminActivity } from "../../../lib/adminUtils";

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState("COURSES");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, activeTab.toLowerCase()), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const title = prompt(`Enter new ${activeTab.toLowerCase()} title:`);
    if (!title) return;
    
    try {
      const newDoc = {
        title,
        status: "DRAFT",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(collection(db, activeTab.toLowerCase()), newDoc);
      await logAdminActivity(`Created ${activeTab.toLowerCase()} ${title}`, docRef.id);
      fetchContent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, activeTab.toLowerCase(), id));
      await logAdminActivity(`Deleted ${activeTab.toLowerCase()}`, id);
      fetchContent();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight">Content Studio</h2>
        <button 
          onClick={handleCreate}
          className="bg-white hover:bg-gray-200 text-black px-4 py-2 font-bold uppercase tracking-wider text-sm flex items-center gap-2 rounded-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create {activeTab === "COURSES" ? "Course" : activeTab === "TRAINING" ? "Training" : "Video"}
        </button>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-2">
        {["COURSES", "TRAINING", "VIDEOS"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold uppercase tracking-wider pb-2 px-2 border-b-2 transition-colors ${
              activeTab === tab ? "border-[#00ff88] text-[#00ff88]" : "border-transparent text-gray-500 hover:text-white"
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
                  <th className="p-4">Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {courses.map(item => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center shrink-0">
                        {activeTab === 'VIDEOS' ? <PlayCircle className="w-4 h-4 text-gray-400" /> : <BookOpen className="w-4 h-4 text-gray-400" />}
                      </div>
                      <span>{item.title || 'Untitled'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'PUBLISHED' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 
                        'bg-white/10 text-gray-400'
                      }`}>
                        {item.status || 'DRAFT'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs font-mono">
                       {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 flex items-center justify-end gap-3">
                      <button className="text-gray-400 hover:text-[#00b8ff] transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-[#ff0055] transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No {activeTab.toLowerCase()} found.</td>
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

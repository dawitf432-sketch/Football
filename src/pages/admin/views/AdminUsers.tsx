import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { Shield, User, Loader2, Ban, CheckCircle } from "lucide-react";
import { logAdminActivity } from "../../../lib/adminUtils";

export default function AdminUsers({ filterRole = "ALL" }: { filterRole?: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let q = collection(db, "users");
      if (filterRole !== "ALL") {
        q = query(q, where("role", "==", filterRole)) as any;
      }
      const snap = await getDocs(q);
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    if (!confirm("Are you sure you want to change this user's status?")) return;
    try {
      const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
      await updateDoc(doc(db, "users", userId), { status: newStatus });
      await logAdminActivity(`User status changed to ${newStatus}`, userId);
      await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight">
          {filterRole === "ALL" ? "All Users" : filterRole + "S"}
        </h2>
        <div className="text-sm font-mono text-gray-500">{users.length} Records</div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#9d00ff]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 font-bold uppercase tracking-wider text-xs text-gray-400">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">ID</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{user.email || 'No email'}</div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-gray-500">USR-{user.id.substring(0,6)}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{user.country || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'ACTIVE' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 
                        user.status === 'DISABLED' ? 'bg-[#ff0055]/10 text-[#ff0055]' : 
                        'bg-white/10 text-gray-400'
                      }`}>
                        {user.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.status || 'ACTIVE')}
                        className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                      >
                        {user.status === 'ACTIVE' ? 'Disable' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No users found for this role.</td>
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

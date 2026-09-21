import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, Save } from "lucide-react";

export default function PlayerProfile({ user }: { user: any }) {
  const [profile, setProfile] = useState<any>({
    age: "",
    position: "",
    preferredFoot: "",
    location: "",
    bio: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = await getDoc(doc(db, "playerProfiles", user.uid));
        if (docRef.exists()) {
          setProfile(docRef.data());
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await setDoc(doc(db, "playerProfiles", user.uid), profile, { merge: true });
      setMessage("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Error saving profile.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold uppercase mb-1">My Profile</h1>
        <p className="text-gray-400">Manage your player card information.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-sm p-6 md:p-8 space-y-6">
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Age</label>
           <input 
             type="number" 
             value={profile.age || ''} 
             onChange={e => setProfile({...profile, age: e.target.value})}
             className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00ff88]" 
           />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Position</label>
             <select 
               value={profile.position || ''} 
               onChange={e => setProfile({...profile, position: e.target.value})}
               className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00ff88]"
             >
               <option value="">Select Position...</option>
               <option value="GK">Goalkeeper</option>
               <option value="DEF">Defender</option>
               <option value="MID">Midfielder</option>
               <option value="FWD">Forward</option>
               <option value="WNG">Winger</option>
             </select>
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preferred Foot</label>
             <select 
               value={profile.preferredFoot || ''} 
               onChange={e => setProfile({...profile, preferredFoot: e.target.value})}
               className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00ff88]"
             >
               <option value="">Select Foot...</option>
               <option value="RIGHT">Right</option>
               <option value="LEFT">Left</option>
               <option value="BOTH">Both</option>
             </select>
          </div>
        </div>

        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location (City, Country)</label>
           <input 
             type="text" 
             value={profile.location || ''} 
             onChange={e => setProfile({...profile, location: e.target.value})}
             className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00ff88]" 
           />
        </div>

        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</label>
           <textarea 
             value={profile.bio || ''} 
             onChange={e => setProfile({...profile, bio: e.target.value})}
             rows={4}
             placeholder="Tell coaches and scouts about yourself..."
             className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00ff88] resize-none" 
           />
        </div>

        <div className="pt-4 flex items-center gap-4">
           <button 
             onClick={handleSave}
             disabled={saving}
             className="px-8 py-3 bg-[#00ff88] text-black font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#00e67a] transition-colors flex items-center gap-2 disabled:opacity-50"
           >
             {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
           </button>
           {message && <span className={`text-sm font-bold ${message.includes('Error') ? 'text-[#ff0055]' : 'text-[#00ff88]'}`}>{message}</span>}
        </div>
      </div>
    </div>
  );
}

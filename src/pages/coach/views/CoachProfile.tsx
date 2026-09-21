import { useState, useEffect, FormEvent } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User, Shield, Save, Loader2, Award, Globe, Mail } from "lucide-react";

export default function CoachProfile({ user }: { user: any }) {
  const [profile, setProfile] = useState({
    name: user.name || "Coach",
    email: user.email || "",
    country: user.country || "GBR",
    licenseLevel: "UEFA B License",
    specialization: "Tactical Periodization & Technical Mastery",
    experienceYears: "8",
    bio: "Passionate academy mentor focused on high-performance athlete development and match analysis."
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const pDoc = await getDoc(doc(db, "coachProfiles", user.uid));
      if (pDoc.exists()) {
        setProfile(prev => ({ ...prev, ...pDoc.data() }));
      }
    } catch (err) {
      console.error("Error loading coach profile:", err);
    }
    setLoading(false);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");
    try {
      await setDoc(doc(db, "coachProfiles", user.uid), {
        ...profile,
        updatedAt: new Date()
      }, { merge: true });
      setFeedback("Profile credentials successfully updated.");
    } catch (err) {
      console.error("Error saving coach profile:", err);
      setFeedback("Failed to update profile.");
    }
    setSaving(false);
    setTimeout(() => setFeedback(""), 4000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold uppercase mb-1">Coach Profile & Dossier</h1>
        <p className="text-gray-400">Manage your credentials, coaching badges, and professional biography.</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#111] border border-white/10 rounded-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-16 h-16 rounded-full bg-[#00b8ff]/20 border border-[#00b8ff]/40 flex items-center justify-center font-black text-xl text-[#00b8ff]">
            {profile.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase">{profile.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <Shield className="w-3.5 h-3.5 text-[#00b8ff]" /> Verified Academy Coach
              <span className="text-white/20">•</span>
              <Globe className="w-3.5 h-3.5" /> {profile.country}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Display Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email (Read Only)</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-[#141414] border border-white/5 rounded-sm p-3 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Coaching License Level</label>
            <input
              type="text"
              value={profile.licenseLevel}
              onChange={e => setProfile({ ...profile, licenseLevel: e.target.value })}
              placeholder="e.g. UEFA Pro / UEFA A / USSF National"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Country Code</label>
            <input
              type="text"
              value={profile.country}
              onChange={e => setProfile({ ...profile, country: e.target.value.toUpperCase() })}
              maxLength={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white font-mono uppercase focus:outline-none focus:border-[#00b8ff]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Primary Specialization</label>
          <input
            type="text"
            value={profile.specialization}
            onChange={e => setProfile({ ...profile, specialization: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Professional Biography & Philosophy</label>
          <textarea
            rows={4}
            value={profile.bio}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#00b8ff] resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#00b8ff] hover:bg-[#0096d6] text-black font-bold uppercase text-xs tracking-wider rounded-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
          </button>
          {feedback && (
            <span className={`text-xs font-bold ${feedback.includes("Failed") ? "text-[#ff0055]" : "text-[#00ff88]"}`}>
              {feedback}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

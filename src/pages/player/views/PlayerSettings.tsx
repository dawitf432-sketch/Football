import { useState } from "react";
import { Settings, Shield, Bell, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "../../../lib/LanguageContext";
import { auth } from "../../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function PlayerSettings({ user }: { user: any }) {
  const { language, setLanguage } = useLanguage();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setResetMessage({ text: "No email address associated with this account.", type: "error" });
      return;
    }
    setResetting(true);
    setResetMessage(null);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetMessage({ text: `Password reset link has been dispatched to ${user.email}`, type: "success" });
    } catch (err: any) {
      setResetMessage({ text: err.message || "Failed to send reset email. Please try again.", type: "error" });
    }
    setResetting(false);
    setTimeout(() => setResetMessage(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold uppercase mb-1">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and security.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-sm p-6 space-y-8">
        <div>
           <h3 className="flex items-center gap-2 font-bold uppercase tracking-wide border-b border-white/10 pb-3 mb-4">
             <Settings className="w-5 h-5 text-[#00ff88]" /> Preferences
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">Interface Language</div>
                  <div className="text-xs text-gray-500">Select your preferred platform language.</div>
                </div>
                <select 
                  value={language}
                  onChange={e => setLanguage(e.target.value as "en" | "am")}
                  className="bg-[#1a1a1a] border border-white/10 p-2 rounded-sm text-sm outline-none text-white focus:border-[#00ff88]"
                >
                  <option value="en">English (EN)</option>
                  <option value="am">Amharic (አማርኛ)</option>
                </select>
              </div>
           </div>
        </div>

        <div>
           <h3 className="flex items-center gap-2 font-bold uppercase tracking-wide border-b border-white/10 pb-3 mb-4">
             <Bell className="w-5 h-5 text-[#00ff88]" /> Notifications
           </h3>
           <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-sm">Email Alerts & Briefings</div>
                  <div className="text-xs text-gray-500">Receive email notifications for scout inquiries and drill evaluations.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#00ff88] cursor-pointer" 
                />
              </label>
           </div>
        </div>

        <div>
           <h3 className="flex items-center gap-2 font-bold uppercase tracking-wide border-b border-white/10 pb-3 mb-4">
             <Shield className="w-5 h-5 text-[#00ff88]" /> Security & Credentials
           </h3>
           <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm">Account Password</div>
                  <div className="text-xs text-gray-500">
                    Send a verified password reset email to {user?.email || "your registered email"}.
                  </div>
                </div>
                <button 
                  onClick={handlePasswordReset}
                  disabled={resetting}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {resetting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Reset Password
                </button>
              </div>

              {resetMessage && (
                <div className={`p-3 rounded-sm text-xs font-bold flex items-center gap-2 border ${
                  resetMessage.type === "success" 
                    ? "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30" 
                    : "bg-red-500/10 text-red-400 border-red-500/30"
                }`}>
                  {resetMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{resetMessage.text}</span>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

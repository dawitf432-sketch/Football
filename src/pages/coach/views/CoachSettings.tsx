import { useState } from "react";
import { Settings, Shield, Bell, KeyRound, Globe, Loader2 } from "lucide-react";
import { auth } from "../../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function CoachSettings({ user }: { user: any }) {
  const [resetSent, setResetSent] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [language, setLanguage] = useState("en");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [drillNotifications, setDrillNotifications] = useState(true);

  const handlePasswordReset = async () => {
    if (!user.email) return;
    setSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
    } catch (err) {
      console.error("Password reset error:", err);
    }
    setSendingReset(false);
    setTimeout(() => setResetSent(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold uppercase mb-1">Coach Settings & Security</h1>
        <p className="text-gray-400">Manage communication alerts, portal preferences, and authentication security.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-sm p-6 md:p-8 space-y-8">
        {/* System Preferences */}
        <div>
          <h3 className="flex items-center gap-2 font-bold uppercase tracking-wide border-b border-white/10 pb-3 mb-4 text-[#00b8ff]">
            <Globe className="w-5 h-5" /> Localization & Language
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-white">Platform Language</div>
              <div className="text-xs text-gray-400">Select default display dialect for tactical summaries.</div>
            </div>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-[#1a1a1a] border border-white/10 p-2.5 rounded-sm text-xs font-bold uppercase tracking-wider text-white outline-none focus:border-[#00b8ff]"
            >
              <option value="en">English (UK)</option>
              <option value="am">Amharic (አማርኛ)</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="flex items-center gap-2 font-bold uppercase tracking-wide border-b border-white/10 pb-3 mb-4 text-[#00b8ff]">
            <Bell className="w-5 h-5" /> Dispatch Alerts & Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-sm text-white">Player Drill Submissions</div>
                <div className="text-xs text-gray-400">Receive alerts when players complete assigned micro-cycles.</div>
              </div>
              <input
                type="checkbox"
                checked={drillNotifications}
                onChange={e => setDrillNotifications(e.target.checked)}
                className="w-4 h-4 accent-[#00b8ff] cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-sm text-white">Director & Scout Messages</div>
                <div className="text-xs text-gray-400">Notify me immediately of direct messages from administrative personnel.</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#00b8ff] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security and Credentials */}
        <div>
          <h3 className="flex items-center gap-2 font-bold uppercase tracking-wide border-b border-white/10 pb-3 mb-4 text-[#00b8ff]">
            <Shield className="w-5 h-5" /> Account Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-white">Password Management</div>
                <div className="text-xs text-gray-400">Send an authorized password reset email to {user.email}.</div>
              </div>
              <button
                onClick={handlePasswordReset}
                disabled={sendingReset || resetSent}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {sendingReset ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5" />
                )}
                {resetSent ? "Reset Email Sent!" : "Send Password Reset"}
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
              <div className="text-xs font-bold uppercase text-gray-400 mb-1">Access Protocol: COACH RBAC</div>
              <p className="text-xs text-gray-400">
                You have authorized coach privileges. Modifying platform core schemas, access keys, or billing configuration requires Admin authorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { 
  Settings, 
  KeyRound, 
  Bell, 
  ShieldCheck, 
  Sliders, 
  Save, 
  Check, 
  AlertCircle,
  LogOut,
  Mail
} from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../lib/firebase";

interface ScoutSettingsProps {
  user: any;
  onSignOut: () => void;
}

export default function ScoutSettings({ user, onSignOut }: ScoutSettingsProps) {
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");
  const [savedSettings, setSavedSettings] = useState(false);

  // Notification Toggles
  const [notifyShowcases, setNotifyShowcases] = useState(true);
  const [notifyMilestones, setNotifyMilestones] = useState(true);
  const [notifyInquiries, setNotifyInquiries] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);

  // Preferences
  const [defaultPositionFilter, setDefaultPositionFilter] = useState("All");
  const [metricDisplayMode, setMetricDisplayMode] = useState("COMPREHENSIVE");

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetError("");
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      console.error(err);
      setResetError(err.message || "Failed to send reset link.");
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Scout Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Configure security credentials, notification channels, and scouting platform preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account & Security */}
        <div className="bg-[#0b1326] border border-white/10 rounded-xl p-5 sm:p-6 space-y-5 shadow-md">
          <h3 className="font-bold text-white text-base border-b border-white/10 pb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#00f59b]" /> Account Authentication & Security
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#070d18] rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-400">Registered Email Address</div>
                  <div className="text-sm font-semibold text-white">{user.email}</div>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded text-gray-300 font-mono self-start sm:self-auto">
                Role: SCOUT
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#070d18] rounded-lg border border-white/5">
              <div>
                <div className="text-sm font-semibold text-white">Password Management</div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Send an authenticated password reset link to your registered email address.
                </p>
              </div>

              <button
                onClick={handlePasswordReset}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold rounded-md transition-colors self-start sm:self-auto shrink-0"
              >
                Send Password Reset Link
              </button>
            </div>

            {resetSent && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Password reset email dispatched to {user.email}. Please check your inbox.</span>
              </div>
            )}

            {resetError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Configuration */}
        <form onSubmit={handleSavePreferences} className="space-y-6">
          <div className="bg-[#0b1326] border border-white/10 rounded-xl p-5 sm:p-6 space-y-5 shadow-md">
            <h3 className="font-bold text-white text-base border-b border-white/10 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#00f59b]" /> Intelligence Alert Notifications
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: "showcases",
                  label: "New Showcase Videos",
                  desc: "Receive immediate notifications when players upload new approved match reels.",
                  checked: notifyShowcases,
                  onChange: setNotifyShowcases
                },
                {
                  id: "milestones",
                  label: "Player Development Milestones",
                  desc: "Get notified when shortlisted players cross major skill and training benchmarks.",
                  checked: notifyMilestones,
                  onChange: setNotifyMilestones
                },
                {
                  id: "inquiries",
                  label: "Inquiry & Contact Request Updates",
                  desc: "Alerts when academy coordinators authorize or review your trial inquiries.",
                  checked: notifyInquiries,
                  onChange: setNotifyInquiries
                },
                {
                  id: "messages",
                  label: "Messenger Direct Alerts",
                  desc: "Real-time sound and banner notifications for incoming platform messages.",
                  checked: notifyMessages,
                  onChange: setNotifyMessages
                }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-3.5 bg-[#070d18] rounded-lg border border-white/5">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-[11px] text-gray-400">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00f59b]" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Portal Display Preferences */}
          <div className="bg-[#0b1326] border border-white/10 rounded-xl p-5 sm:p-6 space-y-5 shadow-md">
            <h3 className="font-bold text-white text-base border-b border-white/10 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00f59b]" /> Discovery Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Default Position Filter
                </label>
                <select
                  value={defaultPositionFilter}
                  onChange={(e) => setDefaultPositionFilter(e.target.value)}
                  className="w-full bg-[#070d18] border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-[#00f59b]"
                >
                  <option value="All">All Positions (Default)</option>
                  <option value="Goalkeeper">Goalkeepers</option>
                  <option value="Defender">Defenders</option>
                  <option value="Midfielder">Midfielders</option>
                  <option value="Winger">Wingers</option>
                  <option value="Striker">Strikers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Metrics Display Format
                </label>
                <select
                  value={metricDisplayMode}
                  onChange={(e) => setMetricDisplayMode(e.target.value)}
                  className="w-full bg-[#070d18] border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-[#00f59b]"
                >
                  <option value="COMPREHENSIVE">Comprehensive (0-99 Visual Bars)</option>
                  <option value="COMPACT">Compact Summary</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSettings ? (
                <span className="text-xs text-[#00f59b] font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Preferences Saved
                </span>
              ) : (
                <span className="text-xs text-gray-500">Changes apply across scouting sessions</span>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00f59b] hover:bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,155,0.2)]"
              >
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          </div>
        </form>

        {/* Sign Out Section */}
        <div className="p-5 sm:p-6 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white text-sm">Session Termination</h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Securely sign out of your accredited scout account.
            </p>
          </div>

          <button
            onClick={onSignOut}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

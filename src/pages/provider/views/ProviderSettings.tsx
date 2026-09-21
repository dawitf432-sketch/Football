import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Key, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Mail
} from "lucide-react";
import { auth } from "../../../lib/firebase";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { ProviderProfile } from "../../../types";

interface ProviderSettingsProps {
  providerId: string;
  profile: ProviderProfile | null;
  onLogout: () => void;
}

export default function ProviderSettings({
  providerId,
  profile,
  onLogout
}: ProviderSettingsProps) {
  const user = auth.currentUser;
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Safeguarding toggles
  const [safeguardingAck, setSafeguardingAck] = useState(true);
  const [gdprAck, setGdprAck] = useState(true);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [applicantAlerts, setApplicantAlerts] = useState(true);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetError(null);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      setResetError(err.message || "Failed to send password reset email.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-[#00ff88]" />
          Provider Settings & Security
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Manage your organization account credentials, youth safeguarding compliance, and alert preferences.
        </p>
      </div>

      {/* Account Security */}
      <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-[#00ff88]" />
          Account & Security
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-[#070d18] rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-black">Logged in as</div>
              <div className="text-sm font-bold text-white mt-0.5">{user?.email || profile?.contactEmail || "N/A"}</div>
              <div className="text-gray-500 text-[11px] mt-0.5">Role: SCHOLARSHIP_PROVIDER (Verified)</div>
            </div>

            <button
              onClick={handlePasswordReset}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              Send Password Reset Email
            </button>
          </div>

          {resetSent && (
            <div className="p-3 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl text-[#00ff88] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password reset email dispatched to {user?.email}. Follow instructions in your inbox.</span>
            </div>
          )}

          {resetError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{resetError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Safeguarding & Child Protection */}
      <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          Youth Football Safeguarding Compliance
        </h3>

        <div className="space-y-3 text-xs text-gray-300">
          <p className="leading-relaxed bg-[#070d18] p-4 rounded-xl border border-white/5">
            PRO FOOTBALL CLASS strictly complies with FIFA Child Protection regulations and international student athlete protocols. All scholarship providers must confirm full compliance with background checks, non-disclosure of personal minor data, and transparent grievance procedures.
          </p>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-3 p-3 bg-[#070d18] rounded-xl border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={safeguardingAck}
                onChange={(e) => setSafeguardingAck(e.target.checked)}
                className="w-4 h-4 accent-[#00ff88] rounded"
              />
              <span>
                Our organization adheres to certified youth safeguarding policies and background verification for all coaching and residential academy staff.
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-[#070d18] rounded-xl border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={gdprAck}
                onChange={(e) => setGdprAck(e.target.checked)}
                className="w-4 h-4 accent-[#00ff88] rounded"
              />
              <span>
                We strictly communicate with minor athletes through this platform or through verified guardians/representatives without unsolicited direct contact.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          Alert & Notification Preferences
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-[#070d18] rounded-xl border border-white/5">
            <div>
              <div className="font-bold text-white">Instant Applicant Alerts</div>
              <div className="text-gray-400 text-[11px]">Notify organization whenever an athlete submits a scholarship application</div>
            </div>
            <input
              type="checkbox"
              checked={applicantAlerts}
              onChange={(e) => setApplicantAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#00ff88] rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#070d18] rounded-xl border border-white/5">
            <div>
              <div className="font-bold text-white">Direct Message Notifications</div>
              <div className="text-gray-400 text-[11px]">Receive in-app alerts when applicants reply to your messages</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#00ff88] rounded"
            />
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-[#0b1326] border border-white/10 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <div className="font-bold text-white text-sm">Sign Out</div>
          <div className="text-xs text-gray-400 mt-0.5">End your current session on this device</div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-bold rounded-xl border border-red-500/30 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import {
  Compass,
  Search,
  Star,
  PlayCircle,
  Send,
  MessageSquare,
  UserCheck,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { onAppAuthChange, logoutAppUser, AppUser } from "../../lib/authSession";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { scoutService } from "./services/scoutService";
import { PlayerPublicProfile } from "../../types";

import DashboardShell from "../../components/dashboard/DashboardShell";
import ScoutOverview from "./views/ScoutOverview";
import ScoutDiscover from "./views/ScoutDiscover";
import ScoutShortlist from "./views/ScoutShortlist";
import ScoutShowcases from "./views/ScoutShowcases";
import ScoutContactRequests from "./views/ScoutContactRequests";
import ScoutMessages from "./views/ScoutMessages";
import ScoutNotifications from "./views/ScoutNotifications";
import ScoutProfileView from "./views/ScoutProfileView";
import ScoutSettings from "./views/ScoutSettings";
import ScoutPlayerProfileModal from "./components/ScoutPlayerProfileModal";
import ScoutContactModal from "./components/ScoutContactModal";

export default function ScoutDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [scoutProfile, setScoutProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Global Player Modal Trigger
  const [selectedPlayerForDossier, setSelectedPlayerForDossier] = useState<PlayerPublicProfile | null>(null);
  const [selectedPlayerForContact, setSelectedPlayerForContact] = useState<PlayerPublicProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAppAuthChange(async (appUser) => {
      if (appUser && (appUser.role === "SCOUT" || appUser.role === "ADMIN")) {
        setUser(appUser);
        try {
          const sProfile = await scoutService.getScoutProfile(appUser.uid);
          setScoutProfile(sProfile);
        } catch (e) {
          // ignore
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/access");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("read", "==", false)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setUnreadNotifications(snap.size);
      },
      () => {}
    );

    return () => unsub();
  }, [user?.uid]);

  const handleLogout = async () => {
    await logoutAppUser();
    navigate("/");
  };

  const navItems = [
    { name: "Overview", path: "/scout", icon: <Compass className="w-4 h-4" /> },
    { name: "Discover Players", path: "/scout/discover", icon: <Search className="w-4 h-4" /> },
    { name: "Shortlist", path: "/scout/shortlist", icon: <Star className="w-4 h-4" /> },
    { name: "Showcase Videos", path: "/scout/showcases", icon: <PlayCircle className="w-4 h-4" /> },
    { name: "Inquiries", path: "/scout/inquiries", icon: <Send className="w-4 h-4" /> },
    { name: "Messages", path: "/scout/messages", icon: <MessageSquare className="w-4 h-4" /> },
    {
      name: "Notifications",
      path: "/scout/notifications",
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    { name: "Scout Profile", path: "/scout/profile", icon: <UserCheck className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030611] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
        <p className="text-xs font-mono font-bold tracking-wide text-gray-400 uppercase">
          Initializing Scout Intelligence...
        </p>
      </div>
    );
  }

  const isVerified = scoutProfile?.verificationStatus === "VERIFIED" || user?.verificationStatus === "VERIFIED";

  return (
    <DashboardShell
      roleTitle="Scout Radar"
      roleBadge={isVerified ? "Verified Scout" : "Pending Audit"}
      roleColor="green"
      user={user}
      navItems={navItems}
      settingsPath="/scout/settings"
      onLogout={handleLogout}
      headerAction={
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[11px] font-mono font-bold uppercase tracking-wider bg-white/5">
          {isVerified ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
              <span className="text-[#00ff88]">FIFA Verified Agency</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-400">Accreditation Review</span>
            </>
          )}
        </div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            <ScoutOverview
              user={user}
              onOpenPlayer={(p) => setSelectedPlayerForDossier(p)}
            />
          }
        />
        <Route
          path="/discover"
          element={<ScoutDiscover user={user} scoutProfile={scoutProfile} />}
        />
        <Route path="/shortlist" element={<ScoutShortlist user={user} />} />
        <Route path="/showcases" element={<ScoutShowcases user={user} />} />
        <Route path="/inquiries" element={<ScoutContactRequests user={user} />} />
        <Route path="/messages" element={<ScoutMessages user={user} />} />
        <Route path="/notifications" element={<ScoutNotifications user={user} />} />
        <Route
          path="/profile"
          element={
            <ScoutProfileView
              user={user}
              onProfileUpdated={(updated) => setScoutProfile(updated)}
            />
          }
        />
        <Route
          path="/settings"
          element={<ScoutSettings user={user} onSignOut={handleLogout} />}
        />
        <Route path="*" element={<Navigate to="/scout" replace />} />
      </Routes>

      {/* Global Player Dossier Modal */}
      {selectedPlayerForDossier && (
        <ScoutPlayerProfileModal
          player={selectedPlayerForDossier}
          isShortlisted={false}
          onClose={() => setSelectedPlayerForDossier(null)}
          onToggleShortlist={() => {}}
          onSaveNotes={async () => {}}
          onRequestContact={(p) => {
            setSelectedPlayerForDossier(null);
            setSelectedPlayerForContact(p);
          }}
        />
      )}

      {/* Global Contact Modal */}
      {selectedPlayerForContact && (
        <ScoutContactModal
          player={selectedPlayerForContact}
          scoutUser={user}
          onClose={() => setSelectedPlayerForContact(null)}
          onSuccess={() => {}}
        />
      )}
    </DashboardShell>
  );
}

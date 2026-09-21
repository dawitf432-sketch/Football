import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Activity,
  Key,
  Users,
  BookOpen,
  Settings,
  Video,
  Trophy,
  Database,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAppAuthChange, logoutAppUser } from "../../lib/authSession";
import { getDoc, doc, setDoc } from "firebase/firestore";

import DashboardShell from "../../components/dashboard/DashboardShell";
import AdminOverview from "./views/AdminOverview";
import AdminAccessIds from "./views/AdminAccessIds";
import AdminUsers from "./views/AdminUsers";
import AdminContent from "./views/AdminContent";
import AdminOperations from "./views/AdminOperations";
import AdminCommunications from "./views/AdminCommunications";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAppAuthChange(async (appUser) => {
      if (appUser) {
        const isMasterEmail = appUser.email === "dawitf645@gmail.com" || appUser.email === "dawitf432@gmail.com";
        const isMasterId = appUser.accessId === "PFC-ADMIN-MASTER1";
        const hasAdminRole = appUser.role === "ADMIN";

        if (isMasterEmail || isMasterId || hasAdminRole) {
          setIsAdmin(true);
          setCurrentAdmin(appUser);
          try {
            await setDoc(
              doc(db, "users", appUser.uid),
              {
                uid: appUser.uid,
                name: appUser.name || "Dawit (Master Admin)",
                email: appUser.email || (isMasterEmail ? appUser.email : "dawitf645@gmail.com"),
                role: "ADMIN",
                status: "ACTIVE",
                lastLoginAt: new Date(),
              },
              { merge: true }
            );
          } catch (e) {
            // ignore
          }
        } else {
          navigate("/access");
        }
      } else {
        navigate("/access");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await logoutAppUser();
    navigate("/");
  };

  const navItems = [
    { name: "Overview", path: "/admin", icon: <Activity className="w-4 h-4" /> },
    { name: "Access IDs", path: "/admin/access-ids", icon: <Key className="w-4 h-4" /> },
    { name: "Users", path: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { name: "Players", path: "/admin/players", icon: <Trophy className="w-4 h-4" /> },
    { name: "Coaches", path: "/admin/coaches", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Content", path: "/admin/content", icon: <Database className="w-4 h-4" /> },
    { name: "Operations", path: "/admin/operations", icon: <Video className="w-4 h-4" /> },
    { name: "Communications", path: "/admin/communications", icon: <MessageSquare className="w-4 h-4" /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030611] flex items-center justify-center">
        <Activity className="w-8 h-8 text-[#00ff88] animate-pulse" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const adminUser = {
    uid: currentAdmin?.uid || auth.currentUser?.uid || "admin",
    name: currentAdmin?.name || auth.currentUser?.displayName || "Dawit (Master Admin)",
    email: currentAdmin?.email || auth.currentUser?.email || "dawitf645@gmail.com",
  };

  return (
    <DashboardShell
      roleTitle="Command Center"
      roleBadge="Master Admin"
      roleColor="green"
      user={adminUser}
      navItems={navItems}
      settingsPath="/admin/settings"
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/access-ids" element={<AdminAccessIds />} />
        <Route path="/users" element={<AdminUsers filterRole="ALL" />} />
        <Route path="/players" element={<AdminUsers filterRole="PLAYER" />} />
        <Route path="/coaches" element={<AdminUsers filterRole="COACH" />} />
        <Route path="/content" element={<AdminContent />} />
        <Route path="/operations" element={<AdminOperations />} />
        <Route
          path="/communications"
          element={
            <AdminCommunications
              currentUser={{
                uid: auth.currentUser?.uid || "admin",
                name: "Master Admin",
                role: "ADMIN",
              }}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <div className="p-8 text-center text-gray-500 bg-[#060b18] border border-white/10 rounded-sm">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50 text-[#00ff88]" />
              <h2 className="text-xl font-bold text-white mb-2 uppercase font-mono">
                System Governance & Safeguards
              </h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                All platform security policies, FIFA child safety rules, encryption keys, and role boundaries are operational.
              </p>
            </div>
          }
        />
      </Routes>
    </DashboardShell>
  );
}

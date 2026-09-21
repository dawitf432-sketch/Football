import { Routes, Route, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  Activity,
  User,
  Megaphone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { onAppAuthChange, logoutAppUser, AppUser } from "../../lib/authSession";

import DashboardShell from "../../components/dashboard/DashboardShell";
import CoachOverview from "./views/CoachOverview";
import CoachTeams from "./views/CoachTeams";
import CoachGroups from "./views/CoachGroups";
import CoachPlayers from "./views/CoachPlayers";
import CoachAssignments from "./views/CoachAssignments";
import CoachProgress from "./views/CoachProgress";
import CoachAnnouncements from "./views/CoachAnnouncements";
import CoachMessages from "./views/CoachMessages";
import CoachNotifications from "./views/CoachNotifications";
import CoachProfile from "./views/CoachProfile";
import CoachSettings from "./views/CoachSettings";

export default function CoachDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAppAuthChange((appUser) => {
      if (appUser && (appUser.role === "COACH" || appUser.role === "ADMIN")) {
        setUser(appUser);
        setLoading(false);
      } else {
        navigate("/access");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await logoutAppUser();
    navigate("/");
  };

  const navItems = [
    { name: "Overview", path: "/coach", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "My Teams", path: "/coach/teams", icon: <Users className="w-4 h-4" /> },
    { name: "Team Groups", path: "/coach/groups", icon: <UsersRound className="w-4 h-4" /> },
    { name: "My Players", path: "/coach/players", icon: <User className="w-4 h-4" /> },
    { name: "Assignments", path: "/coach/assignments", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Progress", path: "/coach/progress", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Announcements", path: "/coach/announcements", icon: <Megaphone className="w-4 h-4" /> },
    { name: "Messages", path: "/coach/messages", icon: <MessageSquare className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030611] flex items-center justify-center">
        <Activity className="w-8 h-8 text-[#00d4ff] animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardShell
      roleTitle="Coaching HQ"
      roleBadge="UEFA Certified"
      roleColor="cyan"
      user={user}
      navItems={navItems}
      settingsPath="/coach/settings"
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<CoachOverview user={user} />} />
        <Route path="/teams" element={<CoachTeams user={user} />} />
        <Route path="/groups" element={<CoachGroups user={user} />} />
        <Route path="/players" element={<CoachPlayers user={user} />} />
        <Route path="/assignments" element={<CoachAssignments user={user} />} />
        <Route path="/progress" element={<CoachProgress user={user} />} />
        <Route path="/announcements" element={<CoachAnnouncements user={user} />} />
        <Route path="/messages" element={<CoachMessages user={user} />} />
        <Route path="/notifications" element={<CoachNotifications user={user} />} />
        <Route path="/profile" element={<CoachProfile user={user} />} />
        <Route path="/settings" element={<CoachSettings user={user} />} />
      </Routes>
    </DashboardShell>
  );
}

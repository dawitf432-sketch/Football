import { Routes, Route, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlayCircle,
  Trophy,
  User,
  MessageSquare,
  FileText,
  Activity,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { onAppAuthChange, logoutAppUser, AppUser } from "../../lib/authSession";

import DashboardShell from "../../components/dashboard/DashboardShell";
import PlayerOverview from "./views/PlayerOverview";
import PlayerTraining from "./views/PlayerTraining";
import PlayerCourses from "./views/PlayerCourses";
import PlayerProgress from "./views/PlayerProgress";
import PlayerProfile from "./views/PlayerProfile";
import PlayerShowcase from "./views/PlayerShowcase";
import PlayerScholarships from "./views/PlayerScholarships";
import PlayerMessages from "./views/PlayerMessages";
import PlayerSettings from "./views/PlayerSettings";
import PlayerNotifications from "./views/PlayerNotifications";

export default function PlayerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAppAuthChange((appUser) => {
      if (appUser) {
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
    { name: "Overview", path: "/player", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "My Training", path: "/player/training", icon: <PlayCircle className="w-4 h-4" /> },
    { name: "Courses", path: "/player/courses", icon: <BookOpen className="w-4 h-4" /> },
    { name: "My Progress", path: "/player/progress", icon: <Activity className="w-4 h-4" /> },
    { name: "My Profile", path: "/player/profile", icon: <User className="w-4 h-4" /> },
    { name: "Game Showcase", path: "/player/showcase", icon: <Trophy className="w-4 h-4" /> },
    { name: "Scholarships", path: "/player/scholarships", icon: <FileText className="w-4 h-4" /> },
    { name: "Messages", path: "/player/messages", icon: <MessageSquare className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030611] flex items-center justify-center">
        <Activity className="w-8 h-8 text-[#00ff88] animate-pulse" />
      </div>
    );
  }

  return (
    <DashboardShell
      roleTitle="Player Center"
      roleBadge="Elite Athlete"
      roleColor="green"
      user={user}
      navItems={navItems}
      settingsPath="/player/settings"
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<PlayerOverview user={user} />} />
        <Route path="/training" element={<PlayerTraining user={user} />} />
        <Route path="/courses" element={<PlayerCourses user={user} />} />
        <Route path="/progress" element={<PlayerProgress user={user} />} />
        <Route path="/profile" element={<PlayerProfile user={user} />} />
        <Route path="/showcase" element={<PlayerShowcase user={user} />} />
        <Route path="/scholarships" element={<PlayerScholarships user={user} />} />
        <Route path="/messages" element={<PlayerMessages user={user} />} />
        <Route path="/notifications" element={<PlayerNotifications user={user} />} />
        <Route path="/settings" element={<PlayerSettings user={user} />} />
      </Routes>
    </DashboardShell>
  );
}

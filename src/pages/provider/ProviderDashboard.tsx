import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  LayoutDashboard, 
  FileText, 
  Compass, 
  Star, 
  MessageSquare, 
  Bell, 
  Building2, 
  Settings as SettingsIcon, 
  LogOut, 
  PlusCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Menu, 
  X, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { onAppAuthChange, logoutAppUser, AppUser } from "../../lib/authSession";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../../components/common/BrandLogo";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

import { 
  ProviderProfile, 
  Scholarship, 
  PlayerPublicProfile, 
  UserRole 
} from "../../types";
import { providerService } from "./services/providerService";

// Views
import ProviderOverview from "./views/ProviderOverview";
import ProviderScholarshipsList from "./views/ProviderScholarshipsList";
import ProviderCreateScholarship from "./views/ProviderCreateScholarship";
import ProviderApplications from "./views/ProviderApplications";
import ProviderPlayerDiscovery from "./views/ProviderPlayerDiscovery";
import ProviderShortlist from "./views/ProviderShortlist";
import ProviderMessages from "./views/ProviderMessages";
import ProviderNotifications from "./views/ProviderNotifications";
import ProviderOrganizationProfile from "./views/ProviderOrganizationProfile";
import ProviderSettings from "./views/ProviderSettings";

// Modals
import ProviderPlayerProfileModal from "./components/ProviderPlayerProfileModal";

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cross-view parameters
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [targetAppScholarshipId, setTargetAppScholarshipId] = useState<string | undefined>(undefined);
  const [targetPlayerForChat, setTargetPlayerForChat] = useState<{ userId: string; name: string } | null>(null);

  // Player Dossier Modal
  const [inspectedPlayer, setInspectedPlayer] = useState<PlayerPublicProfile | null>(null);
  const [shortlistIds, setShortlistIds] = useState<Set<string>>(new Set());

  // Real-time unread counts
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAppAuthChange(async (appUser) => {
      if (!appUser) {
        setLoading(false);
        navigate("/access");
        return;
      }

      setCurrentUser(appUser);

      try {
        const role = (appUser.role || "SCHOLARSHIP_PROVIDER") as UserRole;
        setUserRole(role);

        // Verify role authorization
        if (role !== "SCHOLARSHIP_PROVIDER" && role !== "ADMIN") {
          setAuthError(`Access restricted. Your account role is "${role}". Only verified SCHOLARSHIP_PROVIDER or ADMIN accounts can access this portal.`);
          setLoading(false);
          return;
        }

        // Fetch or create Provider Profile
        const provProfile = await providerService.getProviderProfile(appUser.uid);
        setProfile(provProfile);

        // Load initial shortlist IDs
        const sl = await providerService.getShortlist(appUser.uid);
        setShortlistIds(new Set(sl.map(s => s.playerId)));

        setLoading(false);
      } catch (err: any) {
        console.error("Auth error in provider dashboard:", err);
        setAuthError(err.message || "Failed to load provider credentials.");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Listen for unread notifications and messages
  useEffect(() => {
    if (!currentUser) return;

    // Notifications listener
    const qNotif = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      where("read", "==", false)
    );
    const unsubNotif = onSnapshot(qNotif, (snap) => {
      setUnreadNotifications(snap.size);
    });

    // Messages listener
    const qMsg = query(
      collection(db, "messages"),
      where("receiverId", "==", currentUser.uid),
      where("read", "==", false)
    );
    const unsubMsg = onSnapshot(qMsg, (snap) => {
      setUnreadMessages(snap.size);
    });

    return () => {
      unsubNotif();
      unsubMsg();
    };
  }, [currentUser]);

  const handleLogout = async () => {
    await logoutAppUser();
    navigate("/access");
  };

  const handleNavigate = (tab: string, param?: any) => {
    if (tab === "create-scholarship") {
      setEditingScholarship(null);
    } else if (tab === "applications") {
      setTargetAppScholarshipId(param?.scholarshipId);
    }
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditScholarship = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setActiveTab("create-scholarship");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSendMessageToPlayer = (player: { userId: string; name: string }) => {
    setTargetPlayerForChat(player);
    setActiveTab("messages");
    setInspectedPlayer(null);
  };

  const handleToggleShortlist = async (player: PlayerPublicProfile) => {
    if (!currentUser) return;
    const pId = player.userId || player.id;
    const isShortlisted = shortlistIds.has(pId);

    if (isShortlisted) {
      const sl = await providerService.getShortlist(currentUser.uid);
      const match = sl.find(s => s.playerId === pId);
      if (match) {
        await providerService.removeFromShortlist(match.id);
        const updated = new Set(shortlistIds);
        updated.delete(pId);
        setShortlistIds(updated);
      }
    } else {
      await providerService.addToShortlist(currentUser.uid, player);
      const updated = new Set(shortlistIds);
      updated.add(pId);
      setShortlistIds(updated);
    }
  };

  // Nav menu items
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "scholarships", label: "My Scholarships", icon: GraduationCap },
    { id: "create-scholarship", label: "Create Scholarship", icon: PlusCircle },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "discovery", label: "Player Discovery", icon: Compass },
    { id: "shortlist", label: "Shortlisted Players", icon: Star },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: unreadMessages },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotifications },
    { id: "profile", label: "Organization Profile", icon: Building2 },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070d18] flex flex-col items-center justify-center text-gray-400 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#00ff88]" />
        <p className="text-sm font-bold text-white">Authenticating Scholarship Provider...</p>
        <p className="text-xs text-gray-500">PRO FOOTBALL CLASS Global Pathway Portal</p>
      </div>
    );
  }

  // Not Logged In Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#070d18] flex items-center justify-center p-4">
        <div className="bg-[#0b1326] border border-white/10 p-8 rounded-3xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#00ff88]/10 text-[#00ff88] mx-auto flex items-center justify-center font-black text-2xl">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Scholarship Provider Portal</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Only authenticated and verified SCHOLARSHIP_PROVIDER organizations can access this dashboard to create programs, review athlete dossiers, and award placements.
          </p>
          <button
            onClick={() => navigate("/access")}
            className="w-full py-3 bg-[#00ff88] hover:bg-[#00e67a] text-black font-black text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
          >
            Sign In with Provider Access Key
          </button>
        </div>
      </div>
    );
  }

  // Access Denied (Unauthorized Role)
  if (authError) {
    return (
      <div className="min-h-screen bg-[#070d18] flex items-center justify-center p-4">
        <div className="bg-[#0b1326] border border-red-500/30 p-8 rounded-3xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Access Denied</h2>
          <p className="text-xs text-red-300 leading-relaxed">{authError}</p>
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-black text-xs rounded-xl transition-colors"
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    );
  }

  const isVerified = profile?.verificationStatus === "VERIFIED";

  return (
    <div className="min-h-screen bg-[#030611] text-white flex flex-col md:flex-row selection:bg-[#00ff88] selection:text-black">
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <aside className="hidden md:flex flex-col w-64 bg-[#050a1a] border-r border-white/10 shrink-0 h-screen sticky top-0">
        {/* Brand Header */}
        <div className="h-18 px-5 border-b border-white/10 flex items-center justify-between">
          <BrandLogo size="sm" showSubtitle={true} to="/" />
        </div>

        {/* Organization Mini Badge */}
        <div className="p-3 mx-3 mt-3 bg-black/40 rounded-sm border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center font-bold text-xs shrink-0">
            {profile?.organizationName ? profile.organizationName.charAt(0) : "P"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">
              {profile?.organizationName || "Scholarship Committee"}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
              {isVerified ? (
                <span className="text-[#00ff88] font-bold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Verified Partner
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <ShieldAlert className="w-3 h-3" /> Under Review
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? "bg-[#00ff88]/15 border-l-2 border-[#00ff88] text-white shadow-[inset_0_0_15px_rgba(0,255,136,0.15)] font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/5 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#00ff88]" : "text-gray-400 group-hover:text-white"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span className={`px-1.5 py-0.2 rounded-sm text-[10px] font-mono font-black ${
                    isActive ? "bg-[#00ff88] text-black" : "bg-[#00ff88] text-black"
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Bottom User / Logout */}
        <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="text-[11px] font-bold text-gray-300 truncate">{currentUser.email}</div>
            <div className="text-[9px] text-[#00ff88] font-mono font-bold uppercase tracking-wider">SCHOLARSHIP PROVIDER</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ==================== MOBILE HEADER ==================== */}
      <header className="md:hidden bg-[#050a1a] border-b border-white/10 p-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" showSubtitle={false} to="/" />
        </div>

        <div className="flex items-center gap-2">
          {unreadNotifications > 0 && (
            <button
              onClick={() => handleNavigate("notifications")}
              className="p-2 rounded-lg bg-white/5 text-gray-300 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#00ff88] absolute top-1.5 right-1.5" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] z-30 bg-[#091020]/95 backdrop-blur-md p-4 flex flex-col justify-between">
          <nav className="space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between ${
                    isActive ? "bg-[#00ff88] text-black" : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black text-[#00ff88]">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-400">{currentUser.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto min-w-0 max-w-7xl mx-auto w-full">
        {activeTab === "overview" && (
          <ProviderOverview
            providerId={currentUser.uid}
            profile={profile}
            onNavigate={handleNavigate}
            onOpenPlayerModal={(p) => setInspectedPlayer(p)}
          />
        )}

        {activeTab === "scholarships" && (
          <ProviderScholarshipsList
            providerId={currentUser.uid}
            profile={profile}
            onNavigate={handleNavigate}
            onEditScholarship={handleEditScholarship}
          />
        )}

        {activeTab === "create-scholarship" && (
          <ProviderCreateScholarship
            providerId={currentUser.uid}
            profile={profile}
            editingScholarship={editingScholarship}
            onNavigate={handleNavigate}
            onSuccess={() => handleNavigate("scholarships")}
          />
        )}

        {activeTab === "applications" && (
          <ProviderApplications
            providerId={currentUser.uid}
            profile={profile}
            initialScholarshipId={targetAppScholarshipId}
            onOpenPlayerModal={(p) => setInspectedPlayer(p)}
            onSendMessage={handleSendMessageToPlayer}
          />
        )}

        {activeTab === "discovery" && (
          <ProviderPlayerDiscovery
            providerId={currentUser.uid}
            onOpenPlayerModal={(p) => setInspectedPlayer(p)}
            onSendMessage={handleSendMessageToPlayer}
          />
        )}

        {activeTab === "shortlist" && (
          <ProviderShortlist
            providerId={currentUser.uid}
            onNavigate={handleNavigate}
            onOpenPlayerModal={(p) => setInspectedPlayer(p)}
            onSendMessage={handleSendMessageToPlayer}
          />
        )}

        {activeTab === "messages" && (
          <ProviderMessages
            providerId={currentUser.uid}
            profile={profile}
            targetPlayer={targetPlayerForChat}
          />
        )}

        {activeTab === "notifications" && (
          <ProviderNotifications
            providerId={currentUser.uid}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === "profile" && (
          <ProviderOrganizationProfile
            providerId={currentUser.uid}
            profile={profile}
            onProfileUpdated={(updated) => setProfile(updated)}
          />
        )}

        {activeTab === "settings" && (
          <ProviderSettings
            providerId={currentUser.uid}
            profile={profile}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* ==================== GLOBAL AUTHORIZED PLAYER DOSSIER MODAL ==================== */}
      {inspectedPlayer && (
        <ProviderPlayerProfileModal
          player={inspectedPlayer}
          isShortlisted={shortlistIds.has(inspectedPlayer.userId || inspectedPlayer.id)}
          onClose={() => setInspectedPlayer(null)}
          onToggleShortlist={handleToggleShortlist}
          onSendMessage={(p) => handleSendMessageToPlayer({ userId: p.userId || p.id, name: p.name })}
        />
      )}
    </div>
  );
}

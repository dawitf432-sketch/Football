import React, { useState, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandLogo } from "../common/BrandLogo";
import { PWAInstallButton } from "../common/PWAInstallButton";
import NotificationBell from "../notifications/NotificationBell";
import { OfflineIndicator } from "../common/OfflineIndicator";
import { useLanguage } from "../../lib/LanguageContext";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  User,
  Shield,
  Menu,
  X,
  Sparkles,
  Globe,
} from "lucide-react";

export interface DashboardNavItem {
  name: string;
  path: string;
  icon: ReactNode;
  badge?: string | number;
}

interface DashboardShellProps {
  roleTitle: string;
  roleBadge: string;
  roleColor?: "green" | "cyan" | "gold" | "purple";
  user: {
    uid: string;
    name: string;
    email?: string;
    accessId?: string;
    photoURL?: string;
  };
  navItems: DashboardNavItem[];
  settingsPath?: string;
  onLogout: () => void;
  children: ReactNode;
  headerAction?: ReactNode;
}

export default function DashboardShell({
  roleTitle,
  roleBadge,
  roleColor = "green",
  user,
  navItems,
  settingsPath,
  onLogout,
  children,
  headerAction,
}: DashboardShellProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayIdentifier = user.accessId 
    ? user.accessId 
    : user.email?.includes("@")
      ? user.email.includes(".internal")
        ? user.email.split("@")[0].toUpperCase()
        : user.email
      : user.uid.slice(0, 10);

  const getAccentClass = () => {
    switch (roleColor) {
      case "cyan":
        return "text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/30";
      case "gold":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "purple":
        return "text-purple-400 bg-purple-400/10 border-purple-400/30";
      case "green":
      default:
        return "text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/30";
    }
  };

  const getActiveItemClass = () => {
    switch (roleColor) {
      case "cyan":
        return "text-white bg-[#00d4ff]/15 border-l-2 border-[#00d4ff] shadow-[inset_0_0_15px_rgba(0,212,255,0.15)] font-bold";
      case "gold":
        return "text-white bg-yellow-400/15 border-l-2 border-yellow-400 shadow-[inset_0_0_15px_rgba(250,204,21,0.15)] font-bold";
      case "purple":
        return "text-white bg-purple-400/15 border-l-2 border-purple-400 shadow-[inset_0_0_15px_rgba(168,85,247,0.15)] font-bold";
      case "green":
      default:
        return "text-white bg-[#00ff88]/15 border-l-2 border-[#00ff88] shadow-[inset_0_0_15px_rgba(0,255,136,0.15)] font-bold";
    }
  };

  return (
    <div className="min-h-screen bg-[#030611] text-white flex flex-col md:flex-row selection:bg-[#00ff88] selection:text-black font-sans antialiased overflow-x-hidden">
      <OfflineIndicator />

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-white/10 bg-[#050a1a] transition-all duration-300 z-40 relative ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-4 border-b border-white/10 flex items-center justify-between">
          <BrandLogo size="sm" iconOnly={collapsed} showSubtitle={!collapsed} to="/" />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Mini Card in Sidebar */}
        <div className="p-3 border-b border-white/5 bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-[#00ff88]/30 to-[#00d4ff]/30 border border-white/15 flex items-center justify-center shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover rounded-sm" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm border ${getAccentClass()}`}
                  >
                    {roleBadge}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1 py-3">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path + "/"));
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs transition-all uppercase tracking-wider ${
                  isActive
                    ? getActiveItemClass()
                    : "text-gray-400 hover:text-white hover:bg-white/5 font-medium"
                }`}
              >
                <div className="shrink-0">{item.icon}</div>
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.name}</span>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#00ff88] text-black font-extrabold rounded-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="p-2 border-t border-white/10 space-y-1 bg-black/40">
          <div className="px-2 py-1">
            <PWAInstallButton variant="compact" />
          </div>

          {settingsPath && (
            <Link
              to={settingsPath}
              className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-sm transition-colors uppercase tracking-wider"
              title={collapsed ? t.dashboard.settings : undefined}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{t.dashboard.settings}</span>}
            </Link>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-colors uppercase tracking-wider cursor-pointer text-left"
            title={collapsed ? t.dashboard.logout : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{t.dashboard.logout}</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/10 px-4 sm:px-6 bg-[#050a1a]/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile drawer toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-sm bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-mono uppercase tracking-wider text-white">
                {roleTitle}
              </span>
              <span
                className={`hidden sm:inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${getAccentClass()}`}
              >
                {roleBadge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {headerAction}

            {/* Language Switcher in Dashboard Header */}
            <button
              onClick={toggleLanguage}
              title={language === "en" ? "Switch to Amharic" : "Switch to English"}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#00b8ff]" />
              <span className={language === "en" ? "text-[#00ff88]" : "text-gray-400"}>EN</span>
              <span className="text-gray-500">|</span>
              <span className={language === "am" ? "text-[#00ff88]" : "text-gray-400"}>አማ</span>
            </button>

            {/* Notification Bell */}
            <NotificationBell userId={user.uid} onNavigate={() => {}} />

            {/* Quick Profile Summary */}
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                <div className="text-[10px] font-mono text-gray-400 truncate max-w-[140px]">
                  {displayIdentifier}
                </div>
              </div>
              <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 border border-white/15 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Slide Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#050a1a] border-b border-white/10 px-4 py-4 space-y-1 shadow-2xl animate-in slide-in-from-top duration-200">
            {/* User Info Bar in Mobile Menu */}
            <div className="p-3 mb-3 bg-black/40 rounded-sm border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[10px] font-mono text-gray-400">{displayIdentifier}</div>
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm border ${getAccentClass()}`}>
                {roleBadge}
              </span>
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs uppercase tracking-wider font-bold ${
                    isActive
                      ? getActiveItemClass()
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={onLogout}
                className="text-xs font-bold text-red-400 flex items-center gap-2 py-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> <span>{t.dashboard.logout}</span>
              </button>
              <PWAInstallButton variant="compact" />
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#040816] via-[#030611] to-[#02040c]">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-15 bg-[#050a1a]/95 backdrop-blur-md border-t border-white/10 z-40 flex items-center justify-around px-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-1.5 rounded-sm transition-colors ${
                isActive ? "text-[#00ff88]" : "text-gray-400 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="text-[9px] uppercase font-mono tracking-tighter mt-0.5">
                {item.name.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

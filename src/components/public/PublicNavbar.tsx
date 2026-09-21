import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X, Globe, UserCheck, Lock } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { BrandLogo } from "../common/BrandLogo";
import { PWAInstallButton } from "../common/PWAInstallButton";

export default function PublicNavbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.academy, path: "/academy" },
    { label: t.nav.training, path: "/training" },
    { label: t.nav.positions, path: "/positions" },
    { label: t.nav.athleticism, path: "/athleticism" },
    { label: t.nav.nutrition, path: "/nutrition" },
    { label: t.nav.mindset, path: "/mindset" },
    { label: t.nav.showcase, path: "/showcase" },
    { label: t.nav.teams, path: "/teams" },
    { label: t.nav.scholarships, path: "/scholarships" },
    { label: t.nav.about, path: "/about" },
  ];

  return (
    <header
      id="public-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-800 shadow-md"
          : "bg-[#0a0f1d]/80 backdrop-blur-sm border-b border-slate-800/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo Component */}
        <BrandLogo size="md" showSubtitle={true} to="/" />

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-5 text-[11px] 2xl:text-xs font-semibold uppercase tracking-wider text-slate-400">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`py-1 relative transition-colors ${
                  isActive ? "text-emerald-400 font-bold" : "hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions (PWA Install + Language Switcher + Student Access Button) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* PWA Install Button in Header */}
          <PWAInstallButton variant="compact" className="hidden lg:flex" />

          {/* Language Switcher */}
          <button
            id="lang-toggle-btn"
            onClick={toggleLanguage}
            title={language === "en" ? "Switch to Amharic" : "Switch to English"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className={language === "en" ? "text-emerald-400 font-bold" : "text-slate-400"}>EN</span>
            <span className="text-slate-600">|</span>
            <span className={language === "am" ? "text-emerald-400 font-bold" : "text-slate-400"}>አማ</span>
          </button>

          {/* Login direct shortcut */}
          <Link
            to="/access"
            state={{ defaultTab: "LOGIN" }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white uppercase tracking-wider transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.nav.login}</span>
          </Link>

          {/* Student Access Primary CTA */}
          <Link
            id="student-access-btn"
            to="/access"
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t.nav.studentAccess}</span>
            <ArrowRight className="w-3 h-3 hidden md:inline-block" />
          </Link>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a0f1d]/98 border-b border-slate-800 px-4 sm:px-6 py-5 backdrop-blur-2xl shadow-xl animate-in slide-in-from-top duration-200">
          {/* In-app install button inside mobile menu */}
          <div className="mb-4">
            <PWAInstallButton variant="banner" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider mb-5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 px-3 rounded-lg border transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-semibold"
                      : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
            <Link
              to="/access"
              state={{ defaultTab: "ACTIVATE" }}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider text-center rounded-lg shadow-sm"
            >
              {t.hero.primaryCta}
            </Link>
            <Link
              to="/access"
              state={{ defaultTab: "LOGIN" }}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 bg-slate-800 border border-slate-700 text-white font-semibold text-xs uppercase tracking-wider text-center rounded-lg hover:bg-slate-700"
            >
              {t.nav.login}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

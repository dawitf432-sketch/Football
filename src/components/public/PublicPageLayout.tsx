import React, { ReactNode } from "react";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";
import { OfflineIndicator } from "../common/OfflineIndicator";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface PublicPageLayoutProps {
  children: ReactNode;
  title: string;
  badge?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: ReactNode;
}

export default function PublicPageLayout({
  children,
  title,
  badge,
  subtitle,
  breadcrumbs,
  action,
}: PublicPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#03060f] text-white selection:bg-[#00ff88] selection:text-black font-sans antialiased flex flex-col">
      <PublicNavbar />
      <OfflineIndicator />

      {/* Compact Page Header */}
      <section className="pt-24 sm:pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#070e22] via-[#040816] to-[#03060f] border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 font-mono">
            <Link to="/" className="hover:text-[#00ff88] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Home
            </Link>
            {breadcrumbs?.map((bc, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-gray-600" />
                {bc.href ? (
                  <Link to={bc.href} className="hover:text-white transition-colors">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="text-[#00ff88] font-bold">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {badge && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#00ff88]/10 text-[#00ff88] text-[11px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#00ff88]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                  {badge}
                </div>
              )}
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-mono">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      <PublicFooter />
    </div>
  );
}

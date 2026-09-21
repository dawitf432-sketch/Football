import React from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import PlayerShowcaseSection from "../../components/public/PlayerShowcaseSection";
import ScoutingSection from "../../components/public/ScoutingSection";
import { Link } from "react-router-dom";
import { ArrowRight, Video, ShieldCheck, UserCheck } from "lucide-react";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function ShowcasePage() {
  return (
    <PublicPageLayout
      title="Verified Match Highlights & Talent Showcase"
      badge="Admin-Approved Film"
      subtitle="Watch standardized match reels audited for authentic match pressure, verified physical data, and anti-scam scout contact safeguarding."
      breadcrumbs={[{ label: "Showcase" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Submit Highlights <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-12">
        {/* Showcase Gallery */}
        <div className="rounded-sm overflow-hidden border border-white/10">
          <PlayerShowcaseSection />
        </div>

        {/* Scout Inquiries & Discovery */}
        <div className="rounded-sm overflow-hidden border border-white/10">
          <ScoutingSection />
        </div>

        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

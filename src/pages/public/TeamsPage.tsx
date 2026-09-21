import React from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import TeamsSection from "../../components/public/TeamsSection";
import ForPlayersSection from "../../components/public/ForPlayersSection";
import { Link } from "react-router-dom";
import { ArrowRight, Users, ClipboardList, ShieldCheck } from "lucide-react";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function TeamsPage() {
  return (
    <PublicPageLayout
      title="Teams, Coaches & Squad Management"
      badge="Club Operations"
      subtitle="Equipping academy directors, head coaches, and squad leaders with automated drill assignments, attendance logs, and progress tracking."
      breadcrumbs={[{ label: "Teams" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Coach Portal <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-12">
        <div className="rounded-sm overflow-hidden border border-white/10">
          <TeamsSection />
        </div>

        <div className="rounded-sm overflow-hidden border border-white/10">
          <ForPlayersSection />
        </div>

        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

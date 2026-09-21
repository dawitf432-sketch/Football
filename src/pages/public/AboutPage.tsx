import React from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import AboutSection from "../../components/public/AboutSection";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, HeartHandshake, Award } from "lucide-react";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function AboutPage() {
  return (
    <PublicPageLayout
      title="About Pro Football Class"
      badge="Mission & Safeguarding"
      subtitle="Bridging emerging football talent directly with verified coaching, transparent scouting standards, and authentic global opportunities."
      breadcrumbs={[{ label: "About" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Join Academy <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-12">
        <div className="rounded-sm overflow-hidden border border-white/10">
          <AboutSection />
        </div>

        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

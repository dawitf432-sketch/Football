import React from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import ScholarshipSection from "../../components/public/ScholarshipSection";
import { Link } from "react-router-dom";
import { ArrowRight, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function ScholarshipsPage() {
  return (
    <PublicPageLayout
      title="Verified Global Scholarships & Trials"
      badge="Zero Exploitation"
      subtitle="Direct, fully verified football and academic opportunities with European academies, US collegiate networks, and international pathway partners."
      breadcrumbs={[{ label: "Scholarships" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Apply via Dossier <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-12">
        <div className="p-4 bg-gradient-to-r from-[#00ff88]/10 via-transparent to-[#00d4ff]/10 border border-[#00ff88]/30 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#00ff88]/20 border border-[#00ff88]/40 flex items-center justify-center text-[#00ff88] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold uppercase text-white">Anti-Agent Exploitation Guarantee</div>
              <div className="text-xs text-gray-400">All opportunities on Pro Football Class require institutional verification and zero pay-to-play scam fees.</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#00ff88] uppercase bg-[#00ff88]/10 px-2.5 py-1 rounded-sm border border-[#00ff88]/30 shrink-0">
            FIFA Clearinghouse Aligned
          </span>
        </div>

        <div className="rounded-sm overflow-hidden border border-white/10">
          <ScholarshipSection />
        </div>

        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

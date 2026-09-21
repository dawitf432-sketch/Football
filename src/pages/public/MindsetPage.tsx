import React from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import MindsetSection from "../../components/public/MindsetSection";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Target, ShieldCheck, Compass } from "lucide-react";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function MindsetPage() {
  return (
    <PublicPageLayout
      title="Psychological Resilience & Tactical IQ"
      badge="Cognitive Elite Training"
      subtitle="Elite performance is decided between the ears: mistake-flush routines, pre-scanning habits, clutch penalty focus, and vocal leadership."
      breadcrumbs={[{ label: "Mindset" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Mindset Modules <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm font-bold uppercase mb-1">
              <Brain className="w-4 h-4" /> 3-Second Mistake Flush
            </div>
            <p className="text-xs text-gray-400">Physical anchor reset routine to immediately erase error cascades after turnovers.</p>
          </div>
          <div className="p-4 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="flex items-center gap-2 text-[#00d4ff] font-mono text-sm font-bold uppercase mb-1">
              <Compass className="w-4 h-4" /> 0.8 Scans / Second
            </div>
            <p className="text-xs text-gray-400">Blindside shoulder checking habits to process opponent pressing angles prior to ball receipt.</p>
          </div>
          <div className="p-4 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="flex items-center gap-2 text-[#00ff88] font-mono text-sm font-bold uppercase mb-1">
              <Target className="w-4 h-4" /> 90+ Minute Box Breathing
            </div>
            <p className="text-xs text-gray-400">HRV stabilization protocol for high-stakes stoppage time penalties and free kicks.</p>
          </div>
        </div>

        <div className="rounded-sm overflow-hidden border border-white/10">
          <MindsetSection />
        </div>

        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

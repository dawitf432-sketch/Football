import React from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import AthleticismSection from "../../components/public/AthleticismSection";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Activity, Dumbbell, ShieldCheck } from "lucide-react";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function AthleticismPage() {
  return (
    <PublicPageLayout
      title="Athletic Conditioning & Sports Science"
      badge="Modern Football Fitness"
      subtitle="Elite physical preparation engineered specifically for 90+ minutes of high-intensity intermittent sprinting, duel dominance, and injury resilience."
      breadcrumbs={[{ label: "Athleticism" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          View Workout Plans <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Athletic Standards Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm font-bold uppercase mb-1">
              <Zap className="w-4 h-4" /> 0-30m Acceleration
            </div>
            <p className="text-xs text-gray-400">Targeting sub-4.10s standard with ground reaction force coaching and forward torso lean.</p>
          </div>
          <div className="p-4 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="flex items-center gap-2 text-[#00ff88] font-mono text-sm font-bold uppercase mb-1">
              <Activity className="w-4 h-4" /> 90-Min Match Engine
            </div>
            <p className="text-xs text-gray-400">Yo-Yo Intermittent Recovery level 2 conditioning with lactate threshold clearance intervals.</p>
          </div>
          <div className="p-4 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="flex items-center gap-2 text-[#00d4ff] font-mono text-sm font-bold uppercase mb-1">
              <ShieldCheck className="w-4 h-4" /> ACL & Hamstring Armor
            </div>
            <p className="text-xs text-gray-400">Nordic hamstring curls and single-leg deceleration landings to eliminate non-contact tears.</p>
          </div>
        </div>

        <div className="rounded-sm overflow-hidden border border-white/10">
          <AthleticismSection />
        </div>

        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

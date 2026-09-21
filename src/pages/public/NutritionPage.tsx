import React from "react";
import PublicPageLayout from "../../components/public/PublicPageLayout";
import NutritionSection from "../../components/public/NutritionSection";
import { Link } from "react-router-dom";
import { ArrowRight, Apple, Droplets, BatteryCharging, Utensils } from "lucide-react";
import { PWAInstallButton } from "../../components/common/PWAInstallButton";

export default function NutritionPage() {
  return (
    <PublicPageLayout
      title="Performance Fueling & Sports Nutrition"
      badge="Matchday Science"
      subtitle="Optimize glycogen storage, cellular hydration, halftime energy spikes, and muscular protein synthesis for maximum matchday output."
      breadcrumbs={[{ label: "Nutrition" }]}
      action={
        <Link
          to="/access"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Athlete Meal Plans <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="text-yellow-400 font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" /> 3-4 Hours Pre-Match
            </div>
            <div className="text-sm font-bold text-white">Complex Glycogen Load</div>
            <div className="text-[11px] text-gray-400 mt-1">Low-GI carbs + lean protein. Low fat, low fiber.</div>
          </div>
          <div className="p-3.5 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="text-[#00ff88] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5" /> 15-Min Halftime
            </div>
            <div className="text-sm font-bold text-white">Rapid Blood Glucose</div>
            <div className="text-[11px] text-gray-400 mt-1">Isotonic electrolytes + rapid maltodextrin gel.</div>
          </div>
          <div className="p-3.5 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="text-[#00d4ff] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5" /> 30-Min Post-Match
            </div>
            <div className="text-sm font-bold text-white">3:1 Carb & Protein</div>
            <div className="text-[11px] text-gray-400 mt-1">25-30g whey + tart cherry anti-inflammatory juice.</div>
          </div>
          <div className="p-3.5 bg-[#060b18] border border-white/10 rounded-sm">
            <div className="text-purple-400 font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" /> Hydration Target
            </div>
            <div className="text-sm font-bold text-white">Electrolyte Balance</div>
            <div className="text-[11px] text-gray-400 mt-1">1.5L rehydration for every 1kg match sweat loss.</div>
          </div>
        </div>

        <div className="rounded-sm overflow-hidden border border-white/10">
          <NutritionSection />
        </div>

        <PWAInstallButton variant="banner" />
      </div>
    </PublicPageLayout>
  );
}

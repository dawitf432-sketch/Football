import { useState } from "react";
import { LineChart, ShieldCheck, Activity, Target, Zap, Brain, Apple, TrendingUp, Lock } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function PlayerDevelopmentSection() {
  const { language, t } = useLanguage();
  const [selectedQuarter, setSelectedQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q4");

  const quarterStats = {
    Q1: { technical: 62, athleticism: 65, tactical: 58, mindset: 60, nutrition: 55, overall: 60 },
    Q2: { technical: 74, athleticism: 76, tactical: 70, mindset: 72, nutrition: 68, overall: 72 },
    Q3: { technical: 83, athleticism: 85, tactical: 81, mindset: 80, nutrition: 79, overall: 82 },
    Q4: { technical: 92, athleticism: 91, tactical: 89, mindset: 90, nutrition: 88, overall: 90 }
  };

  const currentData = quarterStats[selectedQuarter];

  return (
    <section id="development" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050812] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00ff88]/10 text-[#00ff88] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#00ff88]/20">
            <TrendingUp className="w-3.5 h-3.5" />
            {t.development.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.development.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.development.subtitle}
          </p>
        </div>

        {/* 5 Core Pillars Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-12">
          <div className="p-4 rounded-sm bg-[#080d1a] border border-white/10 text-center">
            <Target className="w-6 h-6 text-[#00ff88] mx-auto mb-2" />
            <div className="text-xs font-black uppercase text-white font-mono">{t.development.radarTechnical}</div>
            <div className="text-[10px] text-gray-400">First touch, 1v1, strikes</div>
          </div>
          <div className="p-4 rounded-sm bg-[#080d1a] border border-white/10 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-xs font-black uppercase text-white font-mono">{t.development.radarAthletic}</div>
            <div className="text-[10px] text-gray-400">Speed, agility, power</div>
          </div>
          <div className="p-4 rounded-sm bg-[#080d1a] border border-white/10 text-center">
            <Activity className="w-6 h-6 text-[#00b8ff] mx-auto mb-2" />
            <div className="text-xs font-black uppercase text-white font-mono">{t.development.radarTactical}</div>
            <div className="text-[10px] text-gray-400">Scanning, spatial IQ</div>
          </div>
          <div className="p-4 rounded-sm bg-[#080d1a] border border-white/10 text-center">
            <Brain className="w-6 h-6 text-[#9d00ff] mx-auto mb-2" />
            <div className="text-xs font-black uppercase text-white font-mono">{t.development.radarMental}</div>
            <div className="text-[10px] text-gray-400">Clutch, resilience</div>
          </div>
          <div className="p-4 rounded-sm bg-[#080d1a] border border-white/10 text-center col-span-2 sm:col-span-1">
            <Apple className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-xs font-black uppercase text-white font-mono">{t.development.radarNutrition}</div>
            <div className="text-[10px] text-gray-400">Fueling, recovery</div>
          </div>
        </div>

        {/* Visual Progress Dashboard Concept */}
        <div className="p-6 sm:p-8 rounded-sm bg-[#080d1a] border border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00ff88] uppercase mb-1">
                <ShieldCheck className="w-4 h-4" />
                {t.development.sampleProgressTitle}
              </div>
              <p className="text-xs text-gray-400">
                {t.development.sampleProgressDesc}
              </p>
            </div>

            {/* Quarter Selector */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-sm border border-white/10">
              {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedQuarter === q
                      ? "bg-[#00ff88] text-black shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {q} (Month {q === "Q1" ? "1-3" : q === "Q2" ? "4-6" : q === "Q3" ? "7-9" : "10-12"})
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bars Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-300 font-bold">{t.development.radarTechnical}</span>
                <span className="text-[#00ff88] font-bold">{currentData.technical}%</span>
              </div>
              <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-[#00ff88] transition-all duration-500"
                  style={{ width: `${currentData.technical}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-300 font-bold">{t.development.radarAthletic}</span>
                <span className="text-yellow-400 font-bold">{currentData.athleticism}%</span>
              </div>
              <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${currentData.athleticism}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-300 font-bold">{t.development.radarTactical}</span>
                <span className="text-[#00b8ff] font-bold">{currentData.tactical}%</span>
              </div>
              <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-[#00b8ff] transition-all duration-500"
                  style={{ width: `${currentData.tactical}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-300 font-bold">{t.development.radarMental}</span>
                <span className="text-[#9d00ff] font-bold">{currentData.mindset}%</span>
              </div>
              <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-[#9d00ff] transition-all duration-500"
                  style={{ width: `${currentData.mindset}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-300 font-bold">{t.development.radarNutrition}</span>
                <span className="text-green-400 font-bold">{currentData.nutrition}%</span>
              </div>
              <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-green-400 transition-all duration-500"
                  style={{ width: `${currentData.nutrition}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Privacy & Safeguarding Notice */}
          <div className="p-4 rounded-sm bg-black/60 border border-white/5 flex items-center gap-3 text-xs text-gray-400">
            <Lock className="w-4 h-4 text-[#00ff88] shrink-0" />
            <span>{t.development.protectedDataNotice}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

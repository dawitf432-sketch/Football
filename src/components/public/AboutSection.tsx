import { Shield, Award, Globe, HeartHandshake, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();

  const pillarIcons = [
    <Globe className="w-5 h-5 text-[#00b8ff]" />,
    <Award className="w-5 h-5 text-[#00ff88]" />,
    <HeartHandshake className="w-5 h-5 text-yellow-400" />
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050812] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00ff88]/10 text-[#00ff88] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#00ff88]/20">
            <Shield className="w-3.5 h-3.5" />
            {t.about.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.about.title}
          </h2>
          <p className="text-[#00ff88] text-lg sm:text-xl font-bold font-mono max-w-2xl mx-auto">
            "{t.about.missionHeadline}"
          </p>
        </div>

        {/* Mission Statement Box */}
        <div className="p-8 sm:p-10 rounded-sm bg-[#080d1a] border border-white/10 mb-12 text-center max-w-4xl mx-auto">
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
            {t.about.missionBody}
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {t.about.pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-sm bg-[#080d1a] border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="p-3 rounded-sm bg-white/5 border border-white/10 w-fit mb-4">
                {pillarIcons[idx]}
              </div>
              <h3 className="text-base font-bold uppercase text-white mb-2 font-mono">
                {p.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Child Protection & Safeguarding Statement Box */}
        <div className="p-6 sm:p-8 rounded-sm bg-gradient-to-r from-[#0c1424] via-[#080d1a] to-[#0c1424] border border-[#00ff88]/30 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center shrink-0 border border-[#00ff88]/30">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-[#00ff88] uppercase mb-1">
              International Standard
            </div>
            <h3 className="text-lg font-black uppercase text-white font-mono mb-2">
              {t.about.safeguardingTitle}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {t.about.safeguardingDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

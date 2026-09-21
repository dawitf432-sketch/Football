import { Link } from "react-router-dom";
import { Dumbbell, GraduationCap, LineChart, Award, Video, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function ForPlayersSection() {
  const { t } = useLanguage();

  const playerIcons = [
    <Dumbbell className="w-5 h-5 text-[#00ff88]" />,
    <GraduationCap className="w-5 h-5 text-[#00b8ff]" />,
    <LineChart className="w-5 h-5 text-yellow-400" />,
    <Award className="w-5 h-5 text-purple-400" />,
    <Video className="w-5 h-5 text-[#ff0055]" />,
    <Sparkles className="w-5 h-5 text-[#00ff88]" />
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#03060f] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00b8ff]/10 text-[#00b8ff] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#00b8ff]/20">
            <Sparkles className="w-3.5 h-3.5" />
            {t.players.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.players.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.players.subtitle}
          </p>
        </div>

        {/* 6 Player Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {t.players.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-sm bg-[#080d1a] border border-white/10 hover:border-[#00b8ff]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-sm bg-white/5 border border-white/10">
                    {playerIcons[idx]}
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">Step 0{idx + 1}</span>
                </div>

                <h3 className="text-base font-bold uppercase text-white mb-2 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-[#00b8ff]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Player Passport Feature</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Prompt */}
        <div className="text-center">
          <Link
            to="/access"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,255,136,0.3)]"
          >
            <span>{t.hero.primaryCta}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

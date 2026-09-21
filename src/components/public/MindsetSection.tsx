import { Brain, ShieldAlert, Compass, Target, Users, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function MindsetSection() {
  const { language, t } = useLanguage();

  const mentalPillars = [
    {
      titleEn: "Mental Resilience & Mistake Flush",
      titleAm: "ስነ-ልቦናዊ ጽናት እና ከስህተት በፍጥነት ማገገም",
      icon: <ShieldAlert className="w-5 h-5 text-yellow-400" />,
      descEn: "Eliminate downstream error cascades. Train the 3-second physical anchor reset routine immediately following a turnover or missed shot.",
      descAm: "ስህተት ከተሰራ በኋላ ተስፋ ባለመቁረጥ በ3 ሰከንድ ውስጥ ትኩረትን ወደ ቀጣዩ እንቅስቃሴ የመመለስ ስነ-ልቦናዊ ልምምድ።",
      actionEn: "Anchor Technique: Clench fist, release on deep exhale, focus immediately on the next defensive trigger.",
      actionAm: "የመልሶ ማረጋጊያ ስልት፡ እጅን ጨብጦ በረጅሙ በመተንፈስ ቀጣዩን የሜዳ ላይ ኃላፊነት መረከብ።"
    },
    {
      titleEn: "Tactical IQ & Pre-Scanning",
      titleAm: "የታክቲክ ንቃተ-ህሊና እና ቀድሞ መቃኘት",
      icon: <Compass className="w-5 h-5 text-[#00b8ff]" />,
      descEn: "Scanning rate directly correlates with forward pass success. Elite playmakers scan between 0.5 and 0.8 times per second prior to receiving.",
      descAm: "ኳስ ከመድረሱ በፊት ሜዳውን ደጋግሞ መቃኘት ትክክለኛ ውሳኔዎችን ለመወሰን ቁልፍ ሚና ይጫወታል።",
      actionEn: "Scanner Drill: Identifying blindside full-back runs 3 seconds before receipt of the pass.",
      actionAm: "የመቃኘት ልምምድ፡ ኳስ ሳይደርስህ በፊት የተከላካዩን ክፍተት እና የቡድን አጋርህን ቦታ ማወቅ።"
    },
    {
      titleEn: "Pressure & Clutch Execution",
      titleAm: "ጫናን መቋቋም እና የፍጹም ቅጣት ምት እርጋታ",
      icon: <Target className="w-5 h-5 text-[#ff0055]" />,
      descEn: "Control heart rate spikes when standing over stoppage-time penalties, free kicks, or facing hostile away crowds.",
      descAm: "በጨዋታው የመጨረሻ ደቂቃዎች ላይ ወይም በደጋፊ ጩኸት ውስጥ የልብ ምትን እና የአዕምሮ ጭንቀትን የመቆጣጠር ብቃት።",
      actionEn: "Box Breathing: 4-second inhale, 4-second hold, 4-second exhale, 4-second hold before striking.",
      actionAm: "የአተነፋፈስ ስነ-ስርዓት፡ ከመምታትህ በፊት ለ4 ሰከንድ መተንፈስ፣ መያዝ እና መልቀቅ።"
    },
    {
      titleEn: "Vocal Leadership & On-Field Command",
      titleAm: "የአመራር ብቃት እና የሜዳ ላይ ተግባቦት",
      icon: <Users className="w-5 h-5 text-[#00ff88]" />,
      descEn: "Clear, concise verbal direction. Demanding standards, supporting teammates through fatigue, and organizing defensive shape.",
      descAm: "በሜዳ ላይ ለቡድን አጋሮች ግልጽ መመሪያዎችን መስጠት፣ ማበረታታት እና የመከላከል አሰላለፍን በድምጽ ማስተካከል የሚችል መሪነት።",
      actionEn: "Verbal Cadence: 'Man on', 'Turn', 'Time', 'Drop' shouted with maximum conviction and directional hand signals.",
      actionAm: "የመግባቢያ ቃላት፡ 'ሰው አለብህ'፣ 'ዙር'፣ 'ጊዜ አለህ' በማለት በግልጽ እና በልበ-ሙሉነት መናገር።"
    }
  ];

  return (
    <section id="mindset" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#03060f] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#9d00ff]/10 text-[#9d00ff] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#9d00ff]/20">
            <Brain className="w-3.5 h-3.5" />
            {t.mindset.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.mindset.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.mindset.subtitle}
          </p>
        </div>

        {/* 4 Mental Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {mentalPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-sm bg-[#080d1a] border border-white/10 hover:border-[#9d00ff]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-sm bg-white/5 border border-white/10">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono text-[#9d00ff] uppercase tracking-widest font-bold">
                    Psych Factor 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase text-white mb-3 font-mono">
                  {language === "am" ? pillar.titleAm : pillar.titleEn}
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed mb-5">
                  {language === "am" ? pillar.descAm : pillar.descEn}
                </p>
              </div>

              <div className="p-3.5 rounded-sm bg-black/60 border border-white/5">
                <span className="text-[10px] font-mono font-bold text-[#00ff88] uppercase block mb-1">
                  Tactical Protocol:
                </span>
                <p className="text-xs text-gray-400">
                  {language === "am" ? pillar.actionAm : pillar.actionEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Elite Rule Callout */}
        <div className="p-5 rounded-sm bg-[#0a0e1c] border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-sm bg-[#9d00ff]/20 text-[#9d00ff] flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div className="text-xs text-gray-300">
            <span className="font-bold text-white uppercase block mb-0.5">UEFA Psychological Framework</span>
            {t.mindset.eliteMentalRule}
          </div>
        </div>
      </div>
    </section>
  );
}

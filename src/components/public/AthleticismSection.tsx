import { Zap, Dumbbell, Flame, HeartPulse, Activity, RotateCcw, CheckCircle } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function AthleticismSection() {
  const { language, t } = useLanguage();

  const athleticPillars = [
    {
      titleEn: "Speed & Agility",
      titleAm: "ፍጥነት እና ቅልጥፍና",
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      metricEn: "0-10m Acceleration & 30m Fly Sprint",
      metricAm: "ከ0-10ሜ ፈጣን ፍጥነት እና 30ሜ ሙሉ ፍጥነት",
      benchmarkEn: "Target: 30m under 4.15s (U18) / 3.95s (Pro)",
      benchmarkAm: "ዒላማ፡ 30 ሜትር ከ4.15 ሰከንድ (U18) / 3.95 ሰከንድ (ፕሮ)",
      descEn: "First-step burst mechanics, low center-of-gravity braking, and razor-sharp directional changes.",
      descAm: "የመጀመሪያ እርምጃ ፍጥነት፣ የሰውነት ሚዛንን ጠብቆ ማቆም እና አቅጣጫን በቅጽበት የመቀየር ብቃት።"
    },
    {
      titleEn: "Strength & Armor",
      titleAm: "ጥንካሬ እና መከላከያ",
      icon: <Dumbbell className="w-5 h-5 text-purple-400" />,
      metricEn: "Single-Leg Squat & Anti-Rotation Core",
      metricAm: "የአንድ እግር ስኩዋት እና የወገብ ጥንካሬ",
      benchmarkEn: "Target: 1.5x Bodyweight Trap Bar Deadlift",
      benchmarkAm: "ዒላማ፡ የሰውነት ክብደት 1.5 እጥፍ ማንሳት",
      descEn: "Building robust physical shielding to shrug off tackles and protect joints from non-contact tears.",
      descAm: "የተጋጣሚን ግፊት ለመቋቋም የሚያስችል እና የጅማት ጉዳቶችን የሚከላከል ጠንካራ የአካል መዋቅር።"
    },
    {
      titleEn: "Explosiveness",
      titleAm: "ፈንጂ ኃይል",
      icon: <Flame className="w-5 h-5 text-[#ff0055]" />,
      metricEn: "Countermovement Jump & Broad Jump",
      metricAm: "የከፍታ ዝላይ እና የርዝመት ዝላይ",
      benchmarkEn: "Target: Vertical Leap > 55cm (U18)",
      benchmarkAm: "ዒላማ፡ የቁመት ዝላይ > 55 ሳ.ሜ (U18)",
      descEn: "Neuromuscular rate of force development for aerial supremacy and sudden breakaways.",
      descAm: "በአየር ላይ ኳሶችን ለማሸነፍ እና በድንገት ተከላካይን ጥሎ ለመሄድ የሚያስችል ፈንጂ የጡንቻ ኃይል።"
    },
    {
      titleEn: "Endurance (Engine)",
      titleAm: "ጽናት (ሞተር)",
      icon: <HeartPulse className="w-5 h-5 text-[#00ff88]" />,
      metricEn: "Yo-Yo Intermittent Recovery Level 2",
      metricAm: "ዮ-ዮ ኢንተርሚተንት ሪከቨሪ ደረጃ 2",
      benchmarkEn: "Target: Yo-Yo IR2 > 1,040m (Elite Academy)",
      benchmarkAm: "ዒላማ፡ ዮ-ዮ IR2 > 1,040 ሜትር (የላቀ አካዳሚ)",
      descEn: "Repeat Sprint Ability (RSA) allowing players to maintain maximum sprint velocity through minute 90+.",
      descAm: "በጨዋታው የመጨረሻ ደቂቃዎች ላይ እንኳን ከፍተኛ ፍጥነትን ደጋግሞ ለመሮጥ የሚያስችል የጽናት አቅም።"
    },
    {
      titleEn: "Mobility & Range",
      titleAm: "ተለዋዋጭነት እና ዝርጋታ",
      icon: <Activity className="w-5 h-5 text-[#00b8ff]" />,
      metricEn: "Hip Rotation & Ankle Dorsiflexion",
      metricAm: "የዳሌ እንቅስቃሴ እና የቁርጭምጭሚት ዝርጋታ",
      benchmarkEn: "Target: 12cm+ Knee-to-Wall Ankle Range",
      benchmarkAm: "ዒላማ፡ ከ12 ሳ.ሜ በላይ የቁርጭምጭሚት መለኪያ",
      descEn: "Unrestricted kinetic chain motion preventing groin, hip flexor, and hamstring tightness.",
      descAm: "የጭን፣ የዳሌ እና የወገብ ጡንቻዎች ሳይኮማተሩ በነፃነት እንዲንቀሳቀሱ የሚያደርግ ተለዋዋጭነት።"
    },
    {
      titleEn: "Regeneration & Recovery",
      titleAm: "ማገገም እና እረፍት",
      icon: <RotateCcw className="w-5 h-5 text-emerald-400" />,
      metricEn: "Heart Rate Variability (HRV) & Sleep Score",
      metricAm: "የልብ ምት ተለዋዋጭነት እና የእንቅልፍ ጥራት",
      benchmarkEn: "Target: 8.5+ Hours Deep Rest / Post-Match Flush",
      benchmarkAm: "ዒላማ፡ 8.5+ ሰዓት ጥልቅ እንቅልፍ እና የድካም ማላቀቅ",
      descEn: "Active tissue flush, contrast water hydrotherapy, and metabolic clearance post-competition.",
      descAm: "ከጨዋታ በኋላ ጡንቻዎች በፍጥነት እንዲያገግሙ የሚረዱ የቀዝቃዛ ውሃ ህክምናዎች እና የእረፍት ፕሮቶኮሎች።"
    }
  ];

  return (
    <section id="athleticism" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#03060f] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#ff0055]/10 text-[#ff0055] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#ff0055]/20">
            <Zap className="w-3.5 h-3.5" />
            {t.athleticism.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.athleticism.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.athleticism.subtitle}
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {athleticPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-sm bg-[#080d1a] border border-white/10 hover:border-white/25 hover:bg-[#0b1222] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-sm bg-white/5 border border-white/10">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    Pillar 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase text-white mb-2 tracking-wide">
                  {language === "am" ? pillar.titleAm : pillar.titleEn}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {language === "am" ? pillar.descAm : pillar.descEn}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="text-[11px] font-mono text-[#00b8ff] font-bold">
                  {language === "am" ? pillar.metricAm : pillar.metricEn}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 bg-black/40 px-2.5 py-1.5 rounded-sm border border-white/5">
                  {language === "am" ? pillar.benchmarkAm : pillar.benchmarkEn}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testing Protocol Notice */}
        <div className="p-6 rounded-sm bg-[#0a0e1c] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs text-gray-300">
            <span className="font-bold text-white uppercase block mb-1">
              {t.athleticism.testingProtocols}
            </span>
            {t.athleticism.benchmarkNote}
          </div>
          <span className="px-4 py-2 rounded-sm bg-white/5 border border-white/10 text-xs font-mono text-gray-300 shrink-0">
            FIFA Testing Standards
          </span>
        </div>
      </div>
    </section>
  );
}

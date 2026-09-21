import { Apple, Droplets, BatteryCharging, Flame, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function NutritionSection() {
  const { language, t } = useLanguage();

  const nutritionProtocols = [
    {
      timingEn: "Pre-Match (3-4h Before Kickoff)",
      timingAm: "ከጨዋታ በፊት (ከ3-4 ሰዓት በፊት)",
      icon: <Clock className="w-5 h-5 text-yellow-400" />,
      focusEn: "Complex Glycogen Supercompensation",
      focusAm: "የካርቦሃይድሬት ክምችት ማሳደግ",
      itemsEn: ["Low GI carbohydrates (oats, brown basmati, sweet potatoes)", "Lean clean protein (chicken breast, egg whites, fish)", "Zero heavy fats or high fiber to avoid stomach distress", "500ml water + pinch of pink Himalayan sea salt"],
      itemsAm: ["ቀስ ብለው የሚፈጩ ካርቦሃይድሬቶች (አጃ፣ ባስማቲ ሩዝ፣ ድንች)", "ስብ የሌለው ፕሮቲን (የዶሮ ስጋ፣ የእንቁላል ነጭ፣ አሳ)", "የጨጓራ ድካምን ለማስወገድ ከባድ ቅባቶችን አለመመገብ", "500ml ንጹህ ውሃ ከትንሽ ጨው ጋር"]
    },
    {
      timingEn: "Halftime Rapid Refuel (15min Window)",
      timingAm: "በእረፍት ሰዓት (የ15 ደቂቃ እድል)",
      icon: <BatteryCharging className="w-5 h-5 text-[#00ff88]" />,
      focusEn: "Rapid Blood Glucose Stabilization",
      focusAm: "ፈጣን የደም ግሉኮስ ማረጋጊያ",
      itemsEn: ["Fast-absorbing maltodextrin/electrolyte energy gel", "Half banana with honey chew", "200-250ml cool isotonic solution", "Mouth rinse technique for central nervous stimulation"],
      itemsAm: ["በፍጥነት የሚዋሃድ የሃይል ጄል ወይም ፈሳሽ", "ግማሽ ሙዝ ከትንሽ ማር ጋር", "200-250ml የቀዘቀዘ ኤሌክትሮላይት መጠጥ", "አዕምሮን ለማንቃት አፍን በቀዝቃዛ ውሃ መጉመጥመጥ"]
    },
    {
      timingEn: "Post-Match Recovery (Within 30-45min)",
      timingAm: "ከጨዋታ በኋላ (በ30-45 ደቂቃ ውስጥ)",
      icon: <Flame className="w-5 h-5 text-[#00b8ff]" />,
      focusEn: "3:1 Carb-to-Protein Synthesis",
      focusAm: "የጡንቻ እድሳት እና ፕሮቲን",
      itemsEn: ["25-30g whey isolate or plant amino protein", "60-80g simple carbohydrates (tart cherry juice, white rice)", "Electrolyte rehydration (1.5L for every 1kg bodyweight lost)", "Tart cherry juice to suppress muscular inflammation"],
      itemsAm: ["ከ25-30 ግራም ንጹህ ፕሮቲን", "ከ60-80 ግራም ፈጣን ካርቦሃይድሬት (ቼሪ ጁስ፣ ነጭ ሩዝ)", "የፈሳሽ ማካካሻ (ላጡት ለእያንዳንዱ 1 ኪሎ 1.5 ሊትር)", "የጡንቻ መቆጣትን የሚቀንስ የተፈጥሮ ጁስ"]
    },
    {
      timingEn: "Daily Athlete Lifestyle Habits",
      timingAm: "የየቀኑ ጤናማ ልማዶች",
      icon: <Apple className="w-5 h-5 text-green-400" />,
      focusEn: "Baseline Cellular Health & Immune Resilience",
      focusAm: "የሰውነት በሽታ የመከላከል አቅም",
      itemsEn: ["Rainbow vegetables for antioxidant coverage", "Omega-3 fatty acids (flax, walnuts, wild salmon)", "Vitamin D3 + Magnesium glycinate before sleep", "Avoid all refined syrups, energy drinks, and processed oils"],
      itemsAm: ["የተለያዩ ቀለማት ያላቸው አትክልቶችን አዘውትሮ መመገብ", "ኦሜጋ-3 የበለጸጉ ምግቦች (የተልባ ዘር፣ ዋልነት)", "ቪታሚን D3 እና ማግኒዚየም ከመኝታ በፊት", "ሰው ሰራሽ ስኳር እና የታሸጉ የሃይል መጠጦችን ማስወገድ"]
    }
  ];

  return (
    <section id="nutrition" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050812] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-green-400/10 text-green-400 text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-green-400/20">
            <Apple className="w-3.5 h-3.5" />
            {t.nutrition.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.nutrition.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.nutrition.subtitle}
          </p>
        </div>

        {/* 4 Timing Protocol Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {nutritionProtocols.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-sm bg-[#080d1a] border border-white/10 hover:border-green-400/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-sm bg-white/5 border border-white/10">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-green-400">
                    {language === "am" ? item.timingAm : item.timingEn}
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase text-white mb-4 font-mono">
                  {language === "am" ? item.focusAm : item.focusEn}
                </h3>

                <div className="space-y-2.5">
                  {(language === "am" ? item.itemsAm : item.itemsEn).map((point, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hydration Banner */}
        <div className="p-5 rounded-sm bg-[#0a1526] border border-[#00b8ff]/30 flex items-center gap-4">
          <div className="w-10 h-10 rounded-sm bg-[#00b8ff]/20 text-[#00b8ff] flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="text-xs text-gray-300">
            <span className="font-bold text-white uppercase block mb-0.5">Hydration Science Standard</span>
            {t.nutrition.hydrationRule}
          </div>
        </div>
      </div>
    </section>
  );
}

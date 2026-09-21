import { useState } from "react";
import { Shield, Target, Compass, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

interface PositionRole {
  id: string;
  nameEn: string;
  nameAm: string;
  category: "GK" | "DEF" | "MID" | "WING" | "ATT";
  pitchCoordinates: { x: number; y: number };
  tacticalDutyEn: string[];
  tacticalDutyAm: string[];
  coreAttributesEn: string[];
  coreAttributesAm: string[];
  proBenchmarkEn: string;
  proBenchmarkAm: string;
}

const POSITIONS_DATA: PositionRole[] = [
  {
    id: "gk",
    nameEn: "Goalkeeper (GK)",
    nameAm: "ግብ ጠባቂ (GK)",
    category: "GK",
    pitchCoordinates: { x: 50, y: 88 },
    tacticalDutyEn: [
      "Shot stopping & commanding the 18-yard penalty box",
      "Proactive sweeping of line-breaking through balls",
      "Pinpoint distribution to initiate buildup play under press"
    ],
    tacticalDutyAm: [
      "የግብ ሙከራዎችን ማዳን እና የ18 ሜትር ሳጥንን መቆጣጠር",
      "የተከላካይን ጀርባ የሚጥሱ ኳሶችን ወጥቶ ማራቅ (Sweeping)",
      "ተጋጣሚ ጫና ሲያደርግ ኳሶችን በብቃት ለቡድን አባላት ማከፋፈል"
    ],
    coreAttributesEn: ["Reaction Time (<0.22s)", "Handling Stability", "Diving Range", "Aerial Command", "Left/Right Foot Passing"],
    coreAttributesAm: ["ፈጣን ምላሽ (<0.22 ሰከንድ)", "የእጅ ጽናት", "የዝላይ እና የመድረስ አቅም", "የአየር ላይ ኳስ ቁጥጥር", "በሁለቱም እግሮች ማቀበል"],
    proBenchmarkEn: "Modern sweeper-keeper profile with 85%+ short pass completion and 70%+ high cross claim success rate.",
    proBenchmarkAm: "85%+ ትክክለኛ አጫጭር ቅብብሎች እና 70%+ የአየር ላይ ኳሶችን የመቆጣጠር ስኬት ያለው ዘመናዊ ግብ ጠባቂ።"
  },
  {
    id: "def",
    nameEn: "Defenders (CB & FB)",
    nameAm: "ተከላካዮች (ማዕከላዊ እና የመስመር)",
    category: "DEF",
    pitchCoordinates: { x: 50, y: 70 },
    tacticalDutyEn: [
      "1v1 defending: jockeying, forcing wide, and tackling precision",
      "Maintaining high/mid defensive line integrity and offside traps",
      "Progressive line-breaking passing and overlapping flank support"
    ],
    tacticalDutyAm: [
      "1ለ1 መከላከል፡ ተጋጣሚን ማዘግየት እና ኳስ ማቋረጥ",
      "የመከላከል መስመርን መጠበቅ እና የኦፍሳይድ ወጥመድ ማውጣት",
      "የተከላካይ መስመርን ሰብረው ወደፊት የሚሄዱ ቅብብሎች"
    ],
    coreAttributesEn: ["Aerial Duel Win Rate (>68%)", "Recovery Sprint Speed", "Tactical Positioning", "Anticipation", "Tackling Cleanliness"],
    coreAttributesAm: ["የአየር ላይ ኳስ የማሸነፍ መጠን (>68%)", "የማካካሻ የሩጫ ፍጥነት", "የቦታ አያያዝ", "የቀደመ ንቃት", "ንጹህ የተከላካይነት ንክኪ"],
    proBenchmarkEn: "Dominant physical duels paired with calm composure on the ball to build attacks out from the back.",
    proBenchmarkAm: "የአካል ጥንካሬን ከኳስ ቁጥጥር ጋር በማጣመር ጥቃትን ከኋላ የሚጀምር የመከላከል ብቃት።"
  },
  {
    id: "mid",
    nameEn: "Midfielders (CDM, CM, CAM)",
    nameAm: "አማካዮች (ተከላካይ፣ ማዕከላዊ እና አጥቂ)",
    category: "MID",
    pitchCoordinates: { x: 50, y: 48 },
    tacticalDutyEn: [
      "Pivoting play, dictating match tempo, and switching attack points",
      "Constant 360-degree head scanning before receiving under pressure",
      "Counter-press triggering and screening defensive zones"
    ],
    tacticalDutyAm: [
      "የጨዋታውን ፍጥነት መቆጣጠር እና የጥቃት አቅጣጫዎችን መቀየር",
      "ኳስ ሳይደርስ ዙሪያን በ360 ዲግሪ መቃኘት",
      "የተጋጣሚን የመልሶ ማጥቃት ኳሶችን ቀድሞ ማቋረጥ"
    ],
    coreAttributesEn: ["High Aerobic Engine (11-13km/match)", "Pass Accuracy (>88%)", "Vision & Spatial IQ", "Half-Turn Receiving", "Tackling"],
    coreAttributesAm: ["የከፍተኛ ደረጃ ጽናት (በጨዋታ 11-13 ኪ.ሜ)", "የማቀበል ትክክለኛነት (>88%)", "የሜዳ እይታ እና ንቃት", "በግማሽ ዙር ኳስ መቀበል"],
    proBenchmarkEn: "The tactical engine room of the pitch, connecting defensive blocks with the attacking frontline.",
    proBenchmarkAm: "የመከላከል መስመርን ከፊት አጥቂዎች ጋር የሚያገናኝ እና የጨዋታውን ሚዛን የሚጠብቅ የሜዳ ላይ ሞተር።"
  },
  {
    id: "wing",
    nameEn: "Wingers (LW, RW)",
    nameAm: "የክንፍ ተጫዋቾች (LW, RW)",
    category: "WING",
    pitchCoordinates: { x: 20, y: 30 },
    tacticalDutyEn: [
      "Creating 1v1 isolation mismatches on the touchline",
      "Delivering driven low crosses, cutbacks, and whipped far-post balls",
      "Exploiting half-spaces with inverted runs into the penalty box"
    ],
    tacticalDutyAm: [
      "በመስመር ላይ 1ለ1 ተከላካይን ማለፍ",
      "አደገኛ ኳሶችን ወደ ሳጥን ውስጥ ማሻገር",
      "ከመስመር ወደ ውስጥ ሰብሮ በመግባት የግብ እድሎችን መፍጠር"
    ],
    coreAttributesEn: ["Top Speed (>33.5 km/h)", "Acceleration (0-10m)", "Dribble Success Rate", "Cutback Precision", "Weak Foot Quality"],
    coreAttributesAm: ["ከፍተኛ ፍጥነት (>33.5 ኪሜ/ሰ)", "የመነሻ ፍጥነት (0-10ሜ)", "የማለፍ ስኬት መጠን", "የማሻገር ጥራት", "የደካማ እግር ብቃት"],
    proBenchmarkEn: "Direct dynamic dribblers with rapid transition speeds capable of altering game states within seconds.",
    proBenchmarkAm: "በቅጽበት የጨዋታውን ውጤት የመቀየር አቅም ያላቸው ፈጣን እና አደገኛ የመስመር አጥቂዎች።"
  },
  {
    id: "att",
    nameEn: "Strikers (CF, ST)",
    nameAm: "አጥቂዎች (CF, ST)",
    category: "ATT",
    pitchCoordinates: { x: 50, y: 18 },
    tacticalDutyEn: [
      "Converting chances with clinical efficiency from all angles",
      "Occupying and pinning central defenders to generate midfield gaps",
      "Blindside darting runs across the near and far posts"
    ],
    tacticalDutyAm: [
      "የሚፈጠሩ የግብ እድሎችን በብቃት መጠቀም",
      "ተከላካዮችን በመያዝ ለአማካዮች ክፍተት መፍጠር",
      "ተከላካይ ባላሰበበት ሰዓት ወደ ሳጥን ውስጥ ፈጣን ሩጫ ማድረግ"
    ],
    coreAttributesEn: ["Conversion Rate (>22%)", "Hold-Up Physicality", "Near-Post Timing", "First-Time Finishing", "Instinctive Anticipation"],
    coreAttributesAm: ["የግብ ማግባት ስኬት (>22%)", "ኳስን በጀርባ የመያዝ ጥንካሬ", "የአንድ ንክኪ ምቶች", "ፈጣን የግብ ውሳኔ"],
    proBenchmarkEn: "Ruthless execution inside the 18-yard box, combining physical presence with subtle separation movement.",
    proBenchmarkAm: "በ18 ሜትር ሳጥን ውስጥ ያለ ርህራሄ እድሎችን የሚጠቀም እና ለተከላካይ የማያመች አጥቂ።"
  }
];

export default function PositionsSection() {
  const { language, t } = useLanguage();
  const [selectedPosition, setSelectedPosition] = useState<PositionRole>(POSITIONS_DATA[2]); // Default Midfielder

  return (
    <section id="positions" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050812] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00ff88]/10 text-[#00ff88] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#00ff88]/20">
            <Compass className="w-3.5 h-3.5" />
            {t.positions.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.positions.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.positions.subtitle}
          </p>
        </div>

        {/* Position Select Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {POSITIONS_DATA.map((pos) => {
            const isSelected = selectedPosition.id === pos.id;
            return (
              <button
                key={pos.id}
                onClick={() => setSelectedPosition(pos)}
                className={`px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#00ff88] text-black border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                    : "bg-[#0a0e1c] text-gray-300 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {language === "am" ? pos.nameAm : pos.nameEn}
              </button>
            );
          })}
        </div>

        {/* Tactical Field + Detailed Role Inspection Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Tactical Pitch Visualizer (5 cols) */}
          <div className="lg:col-span-5 bg-[#080d1a] border border-white/10 rounded-sm p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="text-xs font-mono font-bold text-[#00b8ff] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Interactive Tactical Pitch</span>
              <span className="text-white/40">Formation 4-3-3</span>
            </div>

            {/* Field Canvas SVG Representation */}
            <div className="relative w-full aspect-[2/3] bg-gradient-to-b from-[#0a1f14] to-[#040e09] rounded-sm border-2 border-white/20 p-3 overflow-hidden shadow-inner">
              {/* Pitch markings */}
              <div className="absolute inset-2 border border-white/20 rounded-sm"></div>
              <div className="absolute top-1/2 left-2 right-2 h-px bg-white/20 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/20"></div>
              {/* Top Goal Box */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-14 border-b border-l border-r border-white/20"></div>
              {/* Bottom Goal Box */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-14 border-t border-l border-r border-white/20"></div>

              {/* Position Nodes on Pitch */}
              {POSITIONS_DATA.map((pos) => {
                const isSelected = selectedPosition.id === pos.id;
                return (
                  <button
                    key={pos.id}
                    onClick={() => setSelectedPosition(pos)}
                    style={{
                      left: `${pos.pitchCoordinates.x}%`,
                      top: `${pos.pitchCoordinates.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                    className={`absolute z-10 w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#00ff88] text-black shadow-[0_0_20px_#00ff88] scale-125 ring-4 ring-[#00ff88]/30"
                        : "bg-[#050811] text-white border border-white/40 hover:scale-110 hover:border-[#00ff88]"
                    }`}
                  >
                    {pos.category}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-[11px] text-gray-400 text-center font-mono">
              Click any node on the pitch to inspect specific tactical profiles.
            </div>
          </div>

          {/* Position Detail Profile Dossier (7 cols) */}
          <div className="lg:col-span-7 bg-[#0a0e1e] border border-[#00ff88]/30 rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider bg-[#00ff88]/10 px-3 py-1 rounded-sm border border-[#00ff88]/20">
                  Tactical Blueprint
                </span>
                <span className="text-xs font-mono text-gray-400">Position ID: {selectedPosition.id.toUpperCase()}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-6 font-mono">
                {language === "am" ? selectedPosition.nameAm : selectedPosition.nameEn}
              </h3>

              {/* Tactical Duties */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#00ff88]" />
                  {t.positions.tacticalDuty}
                </h4>
                <div className="space-y-2">
                  {(language === "am" ? selectedPosition.tacticalDutyAm : selectedPosition.tacticalDutyEn).map((duty, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-sm bg-black/40 border border-white/5 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0 mt-0.5" />
                      <span>{duty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Attributes */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00b8ff]" />
                  {t.positions.coreAttributes}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(language === "am" ? selectedPosition.coreAttributesAm : selectedPosition.coreAttributesEn).map((attr, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-xs font-mono text-gray-200"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pro Benchmark */}
              <div className="p-4 rounded-sm bg-black/60 border-l-4 border-l-[#00ff88] border border-white/5">
                <div className="text-[11px] font-mono font-bold text-[#00ff88] uppercase mb-1">
                  {t.positions.proBenchmark}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {language === "am" ? selectedPosition.proBenchmarkAm : selectedPosition.proBenchmarkEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

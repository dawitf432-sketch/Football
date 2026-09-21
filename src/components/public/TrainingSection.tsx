import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Target, Zap, Compass, Shield, Activity, Dumbbell, 
  HeartPulse, Brain, Apple, Flame, ChevronRight, Lock, 
  CheckCircle2, X, Play, Eye
} from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export interface TrainingCategory {
  id: string;
  nameEn: string;
  nameAm: string;
  group: "TECHNICAL" | "POSITIONAL" | "ATHLETICISM" | "LIFESTYLE";
  drillsCount: number;
  difficulty: "FOUNDATION" | "INTERMEDIATE" | "ELITE PRO";
  iconName: string;
  taglineEn: string;
  taglineAm: string;
  curriculumEn: string[];
  curriculumAm: string[];
}

export const TRAINING_CATEGORIES: TrainingCategory[] = [
  {
    id: "ball-mastery",
    nameEn: "Ball Mastery",
    nameAm: "የኳስ ቁጥጥር ጥበብ",
    group: "TECHNICAL",
    drillsCount: 28,
    difficulty: "FOUNDATION",
    iconName: "Target",
    taglineEn: "Develop flawless touch with all surfaces of both feet.",
    taglineAm: "በሁለቱም እግሮች የኳስ ቁጥጥር እና ንክኪን ማዳበር።",
    curriculumEn: ["Inside-outside single foot loops", "Sole rolls & V-pull transitions", "Brazilian toe-tap rhythm variations", "Tight-space cone box matrix"],
    curriculumAm: ["የውስጥ እና የውጭ እግር ቅብብል", "የሶል ማንከባለል እና V-pull ሽግግሮች", "የብራዚል የፈጣን ንክኪ ሪትሞች", "በጠበበ ቦታ ውስጥ የኳስ ቁጥጥር"]
  },
  {
    id: "dribbling",
    nameEn: "Dribbling",
    nameAm: "ማለፍ / ድሪብሊንግ",
    group: "TECHNICAL",
    drillsCount: 22,
    difficulty: "INTERMEDIATE",
    iconName: "Flame",
    taglineEn: "Explosive 1v1 deception, change of pace and direct penetration.",
    taglineAm: "1ለ1 ማለፍ፣ የፍጥነት ለውጥ እና የተከላካይ መስመርን ሰብሮ መግባት።",
    curriculumEn: ["Body drop and shoulder feints", "Cruyff & Elastico execution in motion", "1v1 isolation angle attacking", "High-speed deceleration escapes"],
    curriculumAm: ["የሰውነት እና የትከሻ ማታለል", "ክሩይፍ እና ኤላስቲኮ በእንቅስቃሴ ላይ", "1ለ1 በመስመር ላይ ማለፍ", "በከፍተኛ ፍጥነት ድንገት ማቆም"]
  },
  {
    id: "passing",
    nameEn: "Passing",
    nameAm: "ማቀበል",
    group: "TECHNICAL",
    drillsCount: 24,
    difficulty: "INTERMEDIATE",
    iconName: "Compass",
    taglineEn: "Weight, trajectory, line-breaking and disguise in distribution.",
    taglineAm: "የኳስ ክብደት፣ መስመር ሰባሪ ኳሶች እና የተደበቁ ቅብብሎች።",
    curriculumEn: ["Low-driven line breaker passing", "First-time wall pass combinations", "Clipped diagonal switches", "Disguised reverse ball threading"],
    curriculumAm: ["የመሬት ለመሬት መስመር ሰባሪ ኳሶች", "የአንድ ንክኪ ቅብብል ጥምረቶች", "የተሻገሩ ዲያጎናል ኳሶች", "ተከላካይን ያላሰበው የተገላቢጦሽ ቅብብል"]
  },
  {
    id: "shooting",
    nameEn: "Shooting",
    nameAm: "ግብ ማግባት / መምታት",
    group: "TECHNICAL",
    drillsCount: 20,
    difficulty: "ELITE PRO",
    iconName: "Target",
    taglineEn: "Laces power, curled placement, volleys and instinctive finishing.",
    taglineAm: "የኃይል ምቶች፣ የተጠመዘዙ ኳሶች እና ፈጣን የግብ ማግባት ውሳኔ።",
    curriculumEn: ["Instep laces drive across the keeper", "Bending near and far post curls", "Cutback one-touch first-time finish", "Half-volley clean strike mechanics"],
    curriculumAm: ["በኃይል የሚመቱ ኳሶች", "ወደ ማዕዘን የሚጠመዘዙ ምቶች", "ከክንፍ የሚመጡ ኳሶችን በአንድ ንክኪ ማግባት", "ግማሽ ቮሊ የመምታት ቴክኒክ"]
  },
  {
    id: "goalkeeper",
    nameEn: "Goalkeeper",
    nameAm: "ግብ ጠባቂ",
    group: "POSITIONAL",
    drillsCount: 18,
    difficulty: "ELITE PRO",
    iconName: "Shield",
    taglineEn: "Handling, footwork, sweeping transitions and 1v1 spread blocks.",
    taglineAm: "ኳስ መያዝ፣ የእግር እንቅስቃሴ፣ ስዊፒንግ እና 1ለ1 ማዳን።",
    curriculumEn: ["Set position and micro-footwork adjustments", "Low diving and contour hand shaping", "Sweeper-keeper distribution under press", "Smothering 1v1 K-block spreads"],
    curriculumAm: ["የመዘጋጀት አቋቋም እና የእግር እንቅስቃሴ", "የመሬት ለመሬት ኳሶችን መያዝ", "ተጭነው ሲመጡ ኳስ ማሰራጨት", "1ለ1 አጥቂን መዝጋት"]
  },
  {
    id: "defender",
    nameEn: "Defender",
    nameAm: "ተከላካይ",
    group: "POSITIONAL",
    drillsCount: 16,
    difficulty: "INTERMEDIATE",
    iconName: "Shield",
    taglineEn: "Body shape, recovery pace, aerial duels and aggressive interception.",
    taglineAm: "የመከላከል አቋቋም፣ የፍጥነት ማካካሻ፣ የአየር ላይ ኳሶች እና ኳስ ማቋረጥ።",
    curriculumEn: ["Side-on jockeying and delay mechanics", "Front-foot intercepting timing", "Defensive line stepping and offside traps", "Clearing headers under aerial pressure"],
    curriculumAm: ["ተጋጣሚን የማዘግየት የመከላከል አቋም", "ወደፊት በመሄድ ኳስ ማቋረጥ", "የኦፍሳይድ ወጥመድ አወጣጥ", "በአየር ላይ ኳስን ማራቅ"]
  },
  {
    id: "midfielder",
    nameEn: "Midfielder",
    nameAm: "አማካይ",
    group: "POSITIONAL",
    drillsCount: 22,
    difficulty: "ELITE PRO",
    iconName: "Compass",
    taglineEn: "360-degree scanning, half-turn receiving and tempo orchestration.",
    taglineAm: "360 ዲግሪ ሜዳውን መቃኘት፣ በግማሽ ዙር ኳስ መቀበል እና የጨዋታን ፍጥነት መምራት።",
    curriculumEn: ["Pre-receipt blindspot scanning routine", "Open body shape receiving on back foot", "Shielding and turning under heavy contact", "Tempo modulation and progressive play"],
    curriculumAm: ["ኳስ ሳይደርስ ዙሪያን የመቃኘት ልምምድ", "በክፍት አቋም ኳስ መቀበል", "ኳስን በሰውነት ከልሎ ማዞር", "የጨዋታውን ሪትም ማስተካከል"]
  },
  {
    id: "winger",
    nameEn: "Winger",
    nameAm: "የክንፍ ተጫዋች",
    group: "POSITIONAL",
    drillsCount: 18,
    difficulty: "ELITE PRO",
    iconName: "Zap",
    taglineEn: "Touchline isolation, whipped low crosses and diagonal inside runs.",
    taglineAm: "በመስመር ላይ 1ለ1 መግጠም፣ ኃይለኛ ኳሶችን ማሻገር እና ወደ ውስጥ ሰብሮ መግባት።",
    curriculumEn: ["Explosive first touch attacking full-back's heels", "Driven low cutback deliveries", "Blindside diagonal box arrivals", "Inverted shooting off the flank"],
    curriculumAm: ["ተከላካይን ቀድሞ የማለፍ ፈጣን ንክኪ", "ዝቅ ብለው ወደ ውስጥ የሚላኩ ኳሶች", "ተከላካይ ሳይመለከት ወደ ሳጥን መግባት", "ከመስመር ገብቶ ወደ ግብ መምታት"]
  },
  {
    id: "striker",
    nameEn: "Striker",
    nameAm: "አጥቂ",
    group: "POSITIONAL",
    drillsCount: 19,
    difficulty: "ELITE PRO",
    iconName: "Target",
    taglineEn: "Centre-back pin, near-post darting and ruthless box economy.",
    taglineAm: "ተከላካይን መያዝ፣ ወደ ቅርብ ቋሚ በፍጥነት መሮጥ እና በሳጥን ውስጥ እድልን መጠቀም።",
    curriculumEn: ["Holding off centre-backs with forearm frame", "Double-movement box separation", "Near-post glancing headers and flicks", "First-time ruthless one-touch finishes"],
    curriculumAm: ["ተከላካይን በጀርባ መያዝ እና ኳስ መጠበቅ", "የማታለያ ሩጫ በማድረግ ክፍተት መፍጠር", "በቅርብ ቋሚ በጭንቅላት ማግባት", "የአንድ ንክኪ ግቦች"]
  },
  {
    id: "speed-agility",
    nameEn: "Speed & Agility",
    nameAm: "ፍጥነት እና ቅልጥፍና",
    group: "ATHLETICISM",
    drillsCount: 25,
    difficulty: "INTERMEDIATE",
    iconName: "Zap",
    taglineEn: "First 5m acceleration, deceleration brake and reactive COD.",
    taglineAm: "የመጀመሪያዎቹ 5 ሜትር ፍጥነት፣ በቅጽበት ማቆም እና አቅጣጫ መቀየር።",
    curriculumEn: ["Wall drives and acceleration posture angles", "Deceleration drop-step braking mechanics", "Agility T-Drill and reactive mirror cuts", "High-frequency ladder cadence speed"],
    curriculumAm: ["የመነሻ የፍጥነት አንግል ልምምዶች", "በድንገት የማቆም እና የመመለስ ቴክኒክ", "የT-ቅርጽ የቅልጥፍና ልምምድ", "የፈጣን ደረጃ (Ladder) ልምምዶች"]
  },
  {
    id: "strength",
    nameEn: "Strength",
    nameAm: "ጥንካሬ",
    group: "ATHLETICISM",
    drillsCount: 16,
    difficulty: "INTERMEDIATE",
    iconName: "Dumbbell",
    taglineEn: "Unilateral leg stability, anti-rotation core and physical shielding.",
    taglineAm: "የእግር ጥንካሬ፣ የሆድ እና የወገብ ጥንካሬ እና ተጋጣሚን በሰውነት መቋቋም።",
    curriculumEn: ["Bulgarian split squat single-leg drive", "Pallof press anti-rotational core lock", "Romanian deadlifts for hamstring resilience", "Loaded push-pull functional shields"],
    curriculumAm: ["የአንድ እግር ጥንካሬ ስኩዋት", "የሆድ እና የወገብ ማጠናከሪያ", "የጭን ጡንቻዎች ጥንካሬ እና መከላከያ", "የሰውነት ግፊት የመቋቋም ልምምድ"]
  },
  {
    id: "explosiveness",
    nameEn: "Explosiveness",
    nameAm: "ፈንጂ ኃይል",
    group: "ATHLETICISM",
    drillsCount: 14,
    difficulty: "ELITE PRO",
    iconName: "Flame",
    taglineEn: "Plyometric elasticity, vertical jump power and takeoff velocity.",
    taglineAm: "የፕላዮሜትሪክ ዝላይ፣ የከፍታ ኃይል እና የመነሳት ፍጥነት።",
    curriculumEn: ["Box jumps with soft absorption landing", "Broad jumps and bounding triple strides", "Contrast loading hex-bar to vertical leap", "Medicine ball rotational launch"],
    curriculumAm: ["በሳጥን ላይ የሚደረጉ የዝላይ ልምምዶች", "ወደፊት የሚደረጉ ረጅም ዝላዮች", "የክብደት እና የዝላይ ጥምረት", "የሜዲሲን ቦል መወርወር ልምምድ"]
  },
  {
    id: "endurance",
    nameEn: "Endurance",
    nameAm: "ጽናት",
    group: "ATHLETICISM",
    drillsCount: 15,
    difficulty: "INTERMEDIATE",
    iconName: "HeartPulse",
    taglineEn: "Aerobic engine, high-speed repeat sprint ability (RSA) and VO2 max.",
    taglineAm: "የሳንባ አቅም፣ ተደጋጋሚ ከፍተኛ ፍጥነት ሩጫ (RSA) እና የ90 ደቂቃ ጽናት።",
    curriculumEn: ["MAS (Maximal Aerobic Speed) shuttle runs", "Intermittent 15s on / 15s off intervals", "Small-sided game high-density overload", "Progressive beep test stamina staging"],
    curriculumAm: ["የኤሮቢክ ከፍተኛ ፍጥነት ሹትል ሩጫ", "የ15 ሰከንድ ሩጫ እና እረፍት", "በጠበበ ሜዳ ላይ የሚደረግ የጽናት ጨዋታ", "ደረጃውን የጠበቀ የቢፕ ቴስት ልምምድ"]
  },
  {
    id: "mobility",
    nameEn: "Mobility",
    nameAm: "ተለዋዋጭነት",
    group: "ATHLETICISM",
    drillsCount: 14,
    difficulty: "FOUNDATION",
    iconName: "Activity",
    taglineEn: "Hip opening, ankle dorsiflexion and thoracic spine rotation.",
    taglineAm: "የዳሌ መከፈት፣ የቁርጭምጭሚት ተለዋዋጭነት እና የጀርባ አጥንት እንቅስቃሴ።",
    curriculumEn: ["90/90 hip capsule rotators", "Cossack squats for adductor range", "Ankle wall mobility and achilles stretch", "Thoracic spine rotational thread-the-needle"],
    curriculumAm: ["የ90/90 የዳሌ መክፈቻ ልምምድ", "የኮሳክ ስኩዋት ተለዋዋጭነት", "የቁርጭምጭሚት እና የጅማት ዝርጋታ", "የላይኛው የጀርባ አጥንት እንቅስቃሴ"]
  },
  {
    id: "recovery",
    nameEn: "Recovery",
    nameAm: "ማገገም",
    group: "LIFESTYLE",
    drillsCount: 12,
    difficulty: "FOUNDATION",
    iconName: "HeartPulse",
    taglineEn: "Cold exposure, muscle flush, sleep architecture and soft tissue care.",
    taglineAm: "የጡንቻ ማገገም፣ የቅዝቃዜ ህክምና፣ የእንቅልፍ ስርዓት እና የድካም ቅነሳ።",
    curriculumEn: ["Contrast water therapy protocols (cold/hot)", "Foam rolling lower extremity trigger points", "Active recovery low-intensity flush", "Sleep hygiene and circadian rhythm tuning"],
    curriculumAm: ["የቀዝቃዛ እና የሞቀ ውሃ ህክምና", "በፎም ሮለር ጡንቻዎችን ማሳጅ ማድረግ", "ቀለል ያለ የጡንቻ ማላላት እንቅስቃሴ", "የእንቅልፍ ጥራት እና ሰዓት አጠባበቅ"]
  },
  {
    id: "mindset",
    nameEn: "Mindset",
    nameAm: "የአዕምሮ ዝግጁነት",
    group: "LIFESTYLE",
    drillsCount: 15,
    difficulty: "ELITE PRO",
    iconName: "Brain",
    taglineEn: "Cognitive composure, pre-match visualization and penalty clutch.",
    taglineAm: "የአዕምሮ እርጋታ፣ የጨዋታ እይታ እና ጫናን መቋቋም።",
    curriculumEn: ["Tactical visualization of game scenarios", "Box breathing for penalty composure", "Mistake-reset anchor routines", "Growth mindset coachability reviews"],
    curriculumAm: ["የጨዋታ ሁኔታዎችን በአዕምሮ መሳል", "የትንፋሽ ስነ-ስርዓት ለፍጹም ቅጣት ምት", "ከስህተት በፍጥነት የማገገም ስልት", "ከአሰልጣኝ ትችት የመማር ዝግጁነት"]
  },
  {
    id: "nutrition",
    nameEn: "Nutrition",
    nameAm: "ስነ-ምግብ",
    group: "LIFESTYLE",
    drillsCount: 14,
    difficulty: "FOUNDATION",
    iconName: "Apple",
    taglineEn: "Macronutrient timing, matchday carb load and hydration balance.",
    taglineAm: "የምግብ ሰዓት አጠባበቅ፣ የጨዋታ ቀን ካርቦሃይድሬት እና ፈሳሽ መውሰድ።",
    curriculumEn: ["Pre-match 3-hour complex carb loading", "Halftime rapid glucose & electrolyte intake", "30-minute post-match protein window", "Youth athlete micronutrient essentials"],
    curriculumAm: ["ከጨዋታ 3 ሰዓት በፊት የሚወሰዱ ምግቦች", "በእረፍት ሰዓት የሚወሰዱ ፈጣን ኃይል ሰጪዎች", "ከጨዋታ በኋላ በ30 ደቂቃ ውስጥ ፕሮቲን መውሰድ", "ለታዳጊዎች አስፈላጊ ቪታሚኖች"]
  }
];

export default function TrainingSection() {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<"ALL" | "TECHNICAL" | "POSITIONAL" | "ATHLETICISM" | "LIFESTYLE">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory | null>(null);

  const filteredCategories = TRAINING_CATEGORIES.filter(cat => {
    if (activeFilter === "ALL") return true;
    return cat.group === activeFilter;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Target": return <Target className="w-5 h-5 text-[#00ff88]" />;
      case "Flame": return <Flame className="w-5 h-5 text-orange-400" />;
      case "Compass": return <Compass className="w-5 h-5 text-[#00b8ff]" />;
      case "Shield": return <Shield className="w-5 h-5 text-emerald-400" />;
      case "Zap": return <Zap className="w-5 h-5 text-yellow-400" />;
      case "Dumbbell": return <Dumbbell className="w-5 h-5 text-purple-400" />;
      case "HeartPulse": return <HeartPulse className="w-5 h-5 text-[#ff0055]" />;
      case "Activity": return <Activity className="w-5 h-5 text-[#00ff88]" />;
      case "Brain": return <Brain className="w-5 h-5 text-[#00b8ff]" />;
      case "Apple": return <Apple className="w-5 h-5 text-green-400" />;
      default: return <Activity className="w-5 h-5 text-[#00ff88]" />;
    }
  };

  return (
    <section id="training" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#03060f] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00b8ff]/10 text-[#00b8ff] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#00b8ff]/20">
            <Target className="w-3.5 h-3.5" />
            {t.training.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.training.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.training.subtitle}
          </p>
        </div>

        {/* Private Lessons Notice Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-sm bg-gradient-to-r from-[#00ff88]/10 via-black to-[#00b8ff]/10 border border-[#00ff88]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-sm bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white text-sm font-bold uppercase tracking-wide">
                Private Lessons & Video Tracking Protected
              </div>
              <div className="text-xs text-gray-300">
                {t.training.privateNotice}
              </div>
            </div>
          </div>
          <Link
            to="/access"
            className="shrink-0 px-5 py-2.5 rounded-sm bg-[#00ff88] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#00e67a] transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]"
          >
            {t.training.unlockBtn}
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "ALL"
                ? "bg-white text-black shadow-md"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.training.allFilter} (17)
          </button>
          <button
            onClick={() => setActiveFilter("TECHNICAL")}
            className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "TECHNICAL"
                ? "bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.training.technicalFilter} (4)
          </button>
          <button
            onClick={() => setActiveFilter("POSITIONAL")}
            className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "POSITIONAL"
                ? "bg-[#00b8ff] text-black shadow-[0_0_15px_rgba(0,184,255,0.3)]"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.training.positionalFilter} (5)
          </button>
          <button
            onClick={() => setActiveFilter("ATHLETICISM")}
            className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "ATHLETICISM"
                ? "bg-[#ff0055] text-white shadow-[0_0_15px_rgba(255,0,85,0.3)]"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.training.athleticismFilter} (5)
          </button>
          <button
            onClick={() => setActiveFilter("LIFESTYLE")}
            className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "LIFESTYLE"
                ? "bg-[#9d00ff] text-white shadow-[0_0_15px_rgba(157,0,255,0.3)]"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.training.lifestyleFilter} (3)
          </button>
        </div>

        {/* 17 Categories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => {
            const name = language === "am" ? cat.nameAm : cat.nameEn;
            const tagline = language === "am" ? cat.taglineAm : cat.taglineEn;
            return (
              <div
                key={cat.id}
                className="p-6 rounded-sm bg-[#080d1a] border border-white/10 hover:border-[#00ff88]/50 hover:bg-[#0c1326] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getIcon(cat.iconName)}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-white/5 text-gray-300 border border-white/10">
                      {cat.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-black uppercase text-white tracking-wide mb-1 group-hover:text-[#00ff88] transition-colors">
                    {name}
                  </h3>

                  <div className="text-[11px] font-mono text-[#00b8ff] mb-2 font-bold">
                    {cat.drillsCount} {t.training.drillCount}
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#00b8ff]" />
                    <span>{t.training.viewCurriculum}</span>
                  </button>

                  <Link
                    to="/access"
                    title="Student access required"
                    className="p-1.5 rounded-sm bg-white/5 hover:bg-[#00ff88] text-gray-400 hover:text-black transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Curriculum Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0a0e1c] border border-white/20 rounded-sm max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-sm bg-[#00ff88]/10 border border-[#00ff88]/20">
                  {getIcon(selectedCategory.iconName)}
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#00b8ff] uppercase">
                    {selectedCategory.group} • {selectedCategory.difficulty}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase font-mono">
                    {language === "am" ? selectedCategory.nameAm : selectedCategory.nameEn}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-6">
                {language === "am" ? selectedCategory.taglineAm : selectedCategory.taglineEn}
              </p>

              <div className="mb-6">
                <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Sample Core Curriculum Modules ({selectedCategory.drillsCount} Total Drills)
                </div>
                <div className="space-y-2">
                  {(language === "am" ? selectedCategory.curriculumAm : selectedCategory.curriculumEn).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 p-2.5 rounded-sm bg-black/50 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Access Lock Banner inside Modal */}
              <div className="p-4 rounded-sm bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-between gap-4">
                <div className="text-xs text-gray-300">
                  <span className="font-bold text-white block mb-0.5">Full Video Lessons & Homework Trackers</span>
                  Log in with your official Access ID to practice these drills.
                </div>
                <Link
                  to="/access"
                  onClick={() => setSelectedCategory(null)}
                  className="shrink-0 px-4 py-2 bg-[#00ff88] text-black font-extrabold text-xs uppercase tracking-wide rounded-sm hover:bg-[#00e67a]"
                >
                  Enter Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

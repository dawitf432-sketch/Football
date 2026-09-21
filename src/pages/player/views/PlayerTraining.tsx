import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { PlayCircle, Loader2, CheckCircle2, X, Clock, Target, Flame, Award, ChevronRight } from "lucide-react";

interface TrainingDrill {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  position?: string;
  duration: string;
  difficulty: "FOUNDATION" | "INTERMEDIATE" | "ELITE PRO";
  description: string;
  coachingPoints: string[];
  reps: string;
  videoUrl?: string;
}

const DEFAULT_DRILLS: TrainingDrill[] = [
  // BALL SKILLS
  {
    id: "drill-bs-1",
    title: "Tight-Space Sole-Roll & V-Pull Matrix",
    category: "BALL SKILLS",
    subcategory: "Ball Mastery",
    position: "All Positions",
    duration: "20 min",
    difficulty: "FOUNDATION",
    description: "Multi-surface ball manipulation in a 3x3m grid emphasizing rapid sole rolls, inside taps, and explosive 45-degree angle exits.",
    coachingPoints: ["Stay on balls of feet", "Keep chest over the ball", "Use both feet with zero hesitation"],
    reps: "4 sets of 90 seconds (30s rest)",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "drill-bs-2",
    title: "1v1 Isolation & Elastico Breakout",
    category: "BALL SKILLS",
    subcategory: "Dribbling",
    position: "Wingers & Attackers",
    duration: "25 min",
    difficulty: "INTERMEDIATE",
    description: "Simulating match touchline 1v1 duels. Execute body drop feints, stepovers, and lightning directional acceleration to penetrate.",
    coachingPoints: ["Exaggerate shoulder drop before strike", "Burst 5 meters beyond cone defender", "Head up immediately after turn"],
    reps: "6 reps per side (right & left)",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "drill-bs-3",
    title: "Low-Driven Wall Rebounder & First-Touch Half-Turn",
    category: "BALL SKILLS",
    subcategory: "Passing & Receiving",
    position: "Midfielders",
    duration: "20 min",
    difficulty: "ELITE PRO",
    description: "High-cadence wall passing focusing on firm ankle lock, receiving across your body onto the back foot, and scanning shoulders prior to contact.",
    coachingPoints: ["Check shoulder before receiving", "Cushion with back foot", "Firm punch pass into rebounder"],
    reps: "50 passes right foot, 50 left foot",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },

  // POSITION TRAINING
  {
    id: "drill-pt-1",
    title: "Central Midfield Scanning & Line-Breaker Delivery",
    category: "POSITION TRAINING",
    subcategory: "Central Midfield",
    position: "CM / CDM / CAM",
    duration: "30 min",
    difficulty: "ELITE PRO",
    description: "Tactical positioning drills simulating pressure from behind. Receive in pocket of space, execute double scan, and thread ground pass between mini-goals.",
    coachingPoints: ["Open body shape to receive 360-degree vision", "Scan 2-3 times before ball arrives", "Disguise line breaker with eyes"],
    reps: "8 rounds of 2-minute decision simulations",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "drill-pt-2",
    title: "Fullback Overlap & Low-Driven Cutback Crossing",
    category: "POSITION TRAINING",
    subcategory: "Fullback & Wingback",
    position: "LB / RB",
    duration: "25 min",
    difficulty: "INTERMEDIATE",
    description: "Timing explosive overlapping runs, receiving in stride on the touchline, and delivering accurate pullbacks to the penalty spot.",
    coachingPoints: ["Curve your run to stay onside", "Hit cross between 6-yard box and penalty spot", "Strike with instep wrap"],
    reps: "10 crosses from each flank",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "drill-pt-3",
    title: "Striker Blind-Side Dart & Near-Post Flick",
    category: "POSITION TRAINING",
    subcategory: "Center Forward",
    position: "ST / CF",
    duration: "25 min",
    difficulty: "ELITE PRO",
    description: "Lose center-backs using double movements into blind side, then accelerate across front post to redirect crosses into near corner.",
    coachingPoints: ["Initiate run as passer looks down at ball", "Attack near post with conviction", "Keep shot low across keeper"],
    reps: "12 box deliveries with active finish",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },

  // ATHLETICISM
  {
    id: "drill-ath-1",
    title: "0-30m Acceleration Mechanics & Deceleration Brake",
    category: "ATHLETICISM",
    subcategory: "Speed & Agility",
    position: "All Positions",
    duration: "25 min",
    difficulty: "INTERMEDIATE",
    description: "Biomechanical sprint drill focusing on 45-degree forward lean, powerful knee drive, and controlled 3-step deceleration to protect hamstrings.",
    coachingPoints: ["Violent arm swing cheek-to-pocket", "Triple extension through ankles, knees, hips", "Sink hips during brake"],
    reps: "6 x 20m full effort sprints with 90s full recovery",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "drill-ath-2",
    title: "Plyometric Lateral Box Bounds & Landing Stability",
    category: "ATHLETICISM",
    subcategory: "Power & Biomechanics",
    position: "All Positions",
    duration: "20 min",
    difficulty: "ELITE PRO",
    description: "Developing explosive elastic recoil in adductors and glutes. Single-leg lateral bounds stick-and-hold for ACL resilience.",
    coachingPoints: ["Land softly with knee tracking over toes", "Freeze landing for 2 seconds before bound", "Engage core bracing"],
    reps: "4 sets of 6 bounds per leg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },

  // MENTAL & NUTRITION
  {
    id: "drill-mn-1",
    title: "Pre-Match Heart-Rate Regulation & Tactical Visualization",
    category: "MENTAL & NUTRITION",
    subcategory: "Cognitive Performance",
    position: "All Positions",
    duration: "15 min",
    difficulty: "FOUNDATION",
    description: "Physiological sigh breathing (double inhale, long exhale) paired with mental rehearsal of your first 3 actions in the match.",
    coachingPoints: ["Lower heart rate under 70 BPM prior to kickoff", "Visualize high-pressure scenarios calmly", "Anchor physical cue"],
    reps: "10-minute daily breathing & mental walkthrough",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "drill-mn-2",
    title: "Matchday -3h Glycogen Pre-Load & Electrolyte Window",
    category: "MENTAL & NUTRITION",
    subcategory: "Sports Nutrition",
    position: "All Positions",
    duration: "15 min",
    difficulty: "FOUNDATION",
    description: "Structured hydration and complex carbohydrate timing strategy to prevent cramping and maintain energy through minute 90+.",
    coachingPoints: ["Consume 2-3g carbs per kg bodyweight 3.5h prior", "500ml water with sodium 2h prior", "Zero heavy fats or fibrous vegetables pre-kickoff"],
    reps: "Applied every competitive matchday",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
];

export default function PlayerTraining({ user }: { user: any }) {
  const [training, setTraining] = useState<TrainingDrill[]>(DEFAULT_DRILLS);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("BALL SKILLS");
  const [completingId, setCompletingId] = useState("");
  const [selectedDrill, setSelectedDrill] = useState<TrainingDrill | null>(null);

  const categories = [
    "BALL SKILLS",
    "POSITION TRAINING",
    "ATHLETICISM",
    "MENTAL & NUTRITION"
  ];

  useEffect(() => {
    fetchTraining();
    fetchProgress();
  }, [user]);

  const fetchTraining = async () => {
    try {
      const snap = await getDocs(collection(db, "training"));
      if (!snap.empty) {
        const firestoreDrills = snap.docs.map(d => ({ id: d.id, ...d.data() } as TrainingDrill));
        // Merge with defaults so there's always a full curriculum
        const existingIds = new Set(firestoreDrills.map(d => d.id));
        const merged = [...firestoreDrills, ...DEFAULT_DRILLS.filter(d => !existingIds.has(d.id))];
        setTraining(merged);
      } else {
        setTraining(DEFAULT_DRILLS);
      }
    } catch (err) {
      console.warn("Using default training curriculum:", err);
      setTraining(DEFAULT_DRILLS);
    }
    setLoading(false);
  };

  const fetchProgress = async () => {
    if (!user?.uid) return;
    try {
      const snap = await getDocs(collection(db, `playerProgress/${user.uid}/trainingProgress`));
      const comp: Record<string, boolean> = {};
      snap.docs.forEach(d => {
        comp[d.id] = true;
      });
      setCompleted(comp);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (trainingId: string) => {
    if (!user?.uid) return;
    setCompletingId(trainingId);
    try {
      await setDoc(doc(db, `playerProgress/${user.uid}/trainingProgress`, trainingId), {
        completedAt: new Date(),
      }, { merge: true });
      setCompleted(prev => ({ ...prev, [trainingId]: true }));
    } catch (err) {
      console.error(err);
    }
    setCompletingId("");
  };

  const filtered = training.filter(t => t.category === category);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase mb-1">My Training Curriculum</h1>
          <p className="text-gray-400">Complete professional drills to level up your development stats and portfolio.</p>
        </div>
      </div>
      
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs font-bold uppercase tracking-wider pb-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
              category === cat ? "border-[#00ff88] text-[#00ff88]" : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" /></div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-[#111] border border-white/10 rounded-sm">
          No training drills found for this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => {
            const isDone = completed[item.id];
            return (
              <div key={item.id} className={`bg-[#111] border rounded-sm overflow-hidden flex flex-col transition-colors ${isDone ? 'border-[#00ff88]/30' : 'border-white/10 hover:border-white/20'}`}>
                <div 
                  onClick={() => setSelectedDrill(item)}
                  className="h-40 bg-white/5 relative flex items-center justify-center border-b border-white/10 cursor-pointer group"
                >
                  <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-[#00ff88] group-hover:scale-110 transition-all" />
                  {isDone && (
                    <div className="absolute top-2 right-2 bg-[#00ff88] text-black text-[10px] px-2 py-1 font-bold uppercase tracking-widest flex items-center gap-1 rounded-sm shadow-md">
                      <CheckCircle2 className="w-3 h-3"/> Done
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-sm text-[10px] text-gray-300 font-mono">
                    {item.duration}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold text-[#00ff88] uppercase tracking-wide">{item.position || item.subcategory || 'General'}</div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-white/5 text-gray-400 font-mono uppercase rounded-xs">
                        {item.difficulty}
                      </span>
                    </div>
                    <h3 
                      onClick={() => setSelectedDrill(item)}
                      className="font-bold text-lg mb-2 hover:text-[#00ff88] cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span className="font-mono">{item.reps}</span>
                      <button 
                        onClick={() => setSelectedDrill(item)}
                        className="text-[#00ff88] hover:underline font-bold uppercase tracking-wider text-[11px] flex items-center"
                      >
                        Details <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      disabled={isDone || completingId === item.id}
                      onClick={() => handleComplete(item.id)}
                      className={`w-full py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 ${
                        isDone ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'
                      }`}
                    >
                      {completingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : isDone ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drill Detail Modal */}
      {selectedDrill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/20 rounded-sm w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <div className="text-xs font-bold text-[#00ff88] uppercase tracking-wider mb-1">{selectedDrill.category} • {selectedDrill.subcategory}</div>
                <h2 className="text-xl font-extrabold uppercase tracking-wide text-white">{selectedDrill.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedDrill(null)}
                className="text-gray-400 hover:text-white p-1 rounded-sm hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              <div className="aspect-video bg-black rounded-sm border border-white/10 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <PlayCircle className="w-14 h-14 text-[#00ff88] mb-3" />
                <div className="text-sm font-bold text-white uppercase tracking-wider">Instructional Curriculum Footage</div>
                <div className="text-xs text-gray-400 mt-1">High-Definition Tactical Angle Breakdown</div>
                {selectedDrill.videoUrl && (
                  <a 
                    href={selectedDrill.videoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-3 px-4 py-1.5 bg-[#00ff88] text-black font-bold uppercase text-xs tracking-wider rounded-sm hover:bg-[#00e67a] transition-all"
                  >
                    Open Video Demo
                  </a>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Drill Objectives & Setup</h4>
                <p className="text-gray-300 leading-relaxed">{selectedDrill.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-sm border border-white/10">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Duration</div>
                  <div className="font-bold text-white mt-0.5">{selectedDrill.duration}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Difficulty</div>
                  <div className="font-bold text-[#00ff88] mt-0.5">{selectedDrill.difficulty}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Volume</div>
                  <div className="font-bold text-white mt-0.5">{selectedDrill.reps}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Coaching Cues</h4>
                <ul className="space-y-2">
                  {selectedDrill.coachingPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#00ff88] flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <button 
                onClick={() => setSelectedDrill(null)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                disabled={completed[selectedDrill.id] || completingId === selectedDrill.id}
                onClick={() => handleComplete(selectedDrill.id)}
                className={`px-6 py-2.5 font-bold uppercase text-xs tracking-wider rounded-sm transition-all flex items-center gap-2 ${
                  completed[selectedDrill.id] 
                    ? "bg-[#00ff88]/20 text-[#00ff88] cursor-default" 
                    : "bg-[#00ff88] hover:bg-[#00e67a] text-black"
                }`}
              >
                {completingId === selectedDrill.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : completed[selectedDrill.id] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </>
                ) : (
                  "Mark Completed"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

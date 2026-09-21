import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { BookOpen, Loader2, PlayCircle, CheckCircle2, X, ChevronRight, Award, Clock } from "lucide-react";

interface CourseModule {
  id: string;
  title: string;
  duration: string;
  summary: string;
}

interface CourseItem {
  id: string;
  title: string;
  category: string;
  instructor: string;
  modulesCount: number;
  description: string;
  modules: CourseModule[];
}

const DEFAULT_COURSES: CourseItem[] = [
  {
    id: "course-tac-1",
    title: "Elite Positional & Tactical Intelligence",
    category: "TACTICS",
    instructor: "Pro Football Class Tactical Staff",
    modulesCount: 5,
    description: "Deep-dive spatial analysis, pressing triggers, breaking defensive blocks, and manipulating opponent defensive shapes.",
    modules: [
      { id: "m1", title: "Half-Space Overloads & Positional Play Rules", duration: "18 min", summary: "Mastering the 5 vertical corridors of the pitch and timing blind-side runs into the opponent's defensive seams." },
      { id: "m2", title: "High-Pressing Triggers & Angle Closure", duration: "22 min", summary: "Recognizing heavy touches, back-passes, and weak-foot receptions to launch high-intensity coordinated ball winning." },
      { id: "m3", title: "Rest Defense & Counter-Press Transitions", duration: "15 min", summary: "How fullbacks and holding midfielders lock down central space during attacking transitions." },
      { id: "m4", title: "Low-Block Disruption & Third-Man Runs", duration: "20 min", summary: "Unlocking compact defensive walls using quick 1-2 wall passes and third-man combination strikes." },
      { id: "m5", title: "Match Scenario Exam & Tactical Quiz", duration: "25 min", summary: "Test your spatial IQ across 10 pro match tactical video scenarios." }
    ]
  },
  {
    id: "course-nut-1",
    title: "High-Performance Football Nutrition & Hydration",
    category: "NUTRITION",
    instructor: "Elite Performance Nutritionist",
    modulesCount: 4,
    description: "Periodized fuelling systems for pre-match carb loading, halftime rehydration, and post-match tissue regeneration.",
    modules: [
      { id: "m1", title: "Macronutrient Ratios for Matchdays vs Training Days", duration: "16 min", summary: "Calculating daily protein, carbohydrate, and healthy fat requirements tailored to your position." },
      { id: "m2", title: "Halftime Rapid-Absorption Glycogen Strategy", duration: "12 min", summary: "Electrolyte optimization and fast carbohydrate gels to eliminate 70-minute fatigue drops." },
      { id: "m3", title: "Sleep Architecture & Tissue Recovery", duration: "18 min", summary: "Optimizing REM and deep sleep cycles for hormone production and neuromuscular repair." },
      { id: "m4", title: "Supplements for Footballers: Safety & Efficacy", duration: "14 min", summary: "Evidence-based analysis of creatine, beta-alanine, and micronutrient protocols." }
    ]
  },
  {
    id: "course-scout-1",
    title: "Scout Readiness: Building an Elite Video Dossier",
    category: "CAREER",
    instructor: "FIFA Registered Talent Evaluator",
    modulesCount: 4,
    description: "Understand exactly what European and international scouts look for when reviewing video highlights and athletic metrics.",
    modules: [
      { id: "m1", title: "Anatomy of an Impact Highlight Reel", duration: "15 min", summary: "Structuring 3-minute highlight reels: first 30 seconds, variety of actions, and match context." },
      { id: "m2", title: "Off-the-Ball Footage: What Scouts Truly Watch", duration: "18 min", summary: "Why scouts evaluate defensive tracking, scanning frequency, and body language during pauses." },
      { id: "m3", title: "Physical Testing Standards (Beep, 30m, Yo-Yo)", duration: "14 min", summary: "Benchmark scores required for tier-1 academy and university scholarship consideration." },
      { id: "m4", title: "Direct Inquiries & Professional Communication", duration: "12 min", summary: "Drafting introduction emails, CVs, and handling scout trial invitations with etiquette." }
    ]
  }
];

export default function PlayerCourses({ user }: { user: any }) {
  const [courses, setCourses] = useState<CourseItem[]>(DEFAULT_COURSES);
  const [courseProgress, setCourseProgress] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  useEffect(() => {
    fetchCourses();
    fetchProgress();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const snap = await getDocs(collection(db, "courses"));
      if (!snap.empty) {
        const firestoreCourses = snap.docs.map(d => ({ id: d.id, ...d.data() } as CourseItem));
        const existingIds = new Set(firestoreCourses.map(c => c.id));
        setCourses([...firestoreCourses, ...DEFAULT_COURSES.filter(c => !existingIds.has(c.id))]);
      } else {
        setCourses(DEFAULT_COURSES);
      }
    } catch (err) {
      console.warn("Using default courses:", err);
      setCourses(DEFAULT_COURSES);
    }
    setLoading(false);
  };

  const fetchProgress = async () => {
    if (!user?.uid) return;
    try {
      const snap = await getDocs(collection(db, `playerProgress/${user.uid}/courseProgress`));
      const prog: Record<string, Record<string, boolean>> = {};
      snap.docs.forEach(d => {
        prog[d.id] = d.data().completedModules || {};
      });
      setCourseProgress(prog);
    } catch (err) {
      console.error("Error fetching course progress:", err);
    }
  };

  const toggleModuleComplete = async (courseId: string, moduleId: string) => {
    if (!user?.uid) return;
    const currentCompleted = courseProgress[courseId] || {};
    const updated = { ...currentCompleted, [moduleId]: !currentCompleted[moduleId] };

    setCourseProgress(prev => ({
      ...prev,
      [courseId]: updated
    }));

    try {
      await setDoc(doc(db, `playerProgress/${user.uid}/courseProgress`, courseId), {
        completedModules: updated,
        updatedAt: new Date()
      }, { merge: true });
    } catch (err) {
      console.error("Error updating module progress:", err);
    }
  };

  const getCoursePercent = (course: CourseItem) => {
    const completed = courseProgress[course.id] || {};
    const total = course.modules?.length || course.modulesCount || 1;
    const doneCount = Object.values(completed).filter(Boolean).length;
    return Math.min(100, Math.round((doneCount / total) * 100));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold uppercase mb-1">Education & Tactical Courses</h1>
        <p className="text-gray-400">Structured academic and tactical education designed for elite footballers.</p>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" /></div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-[#111] border border-white/10 rounded-sm">
          No courses available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const percent = getCoursePercent(course);
            return (
              <div 
                key={course.id} 
                onClick={() => {
                  setActiveCourse(course);
                  setActiveModuleIndex(0);
                }}
                className="bg-[#111] border border-white/10 rounded-sm overflow-hidden group cursor-pointer hover:border-white/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 bg-white/5 relative flex items-center justify-center border-b border-white/10 group-hover:bg-white/10 transition-colors">
                    <BookOpen className="w-12 h-12 text-white/50 group-hover:text-[#00ff88] transition-colors" />
                    {percent === 100 && (
                      <div className="absolute top-2 right-2 bg-[#00ff88] text-black text-[10px] px-2 py-1 font-bold uppercase tracking-widest flex items-center gap-1 rounded-sm">
                        <CheckCircle2 className="w-3 h-3"/> Completed
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold text-[#00ff88] uppercase tracking-wide">{course.category || "TACTICS"}</div>
                      <div className="text-xs text-gray-500 font-mono uppercase">{course.modules?.length || course.modulesCount} Modules</div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-[#00ff88] transition-colors">{course.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
                    <div className="bg-[#00ff88] h-full transition-all duration-300" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wide">
                     <span className="flex items-center gap-1 text-white group-hover:text-[#00ff88] transition-colors">
                       <PlayCircle className="w-4 h-4"/> {percent > 0 ? "Continue" : "Start Course"}
                     </span>
                     <span className="text-gray-500 font-mono">{percent}% COMPLETE</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Course Player Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/20 rounded-sm w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <div className="text-xs font-bold text-[#00ff88] uppercase tracking-wider mb-1">{activeCourse.category} • Course Curriculum</div>
                <h2 className="text-xl font-extrabold uppercase tracking-wide text-white">{activeCourse.title}</h2>
              </div>
              <button 
                onClick={() => setActiveCourse(null)}
                className="text-gray-400 hover:text-white p-1 rounded-sm hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Selected Module Detail */}
              {activeCourse.modules && activeCourse.modules[activeModuleIndex] && (
                <div className="bg-black/60 p-5 rounded-sm border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Module {activeModuleIndex + 1} of {activeCourse.modules.length}
                    </div>
                    <div className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#00ff88]" /> {activeCourse.modules[activeModuleIndex].duration}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {activeCourse.modules[activeModuleIndex].title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activeCourse.modules[activeModuleIndex].summary}
                  </p>
                  
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => toggleModuleComplete(activeCourse.id, activeCourse.modules[activeModuleIndex].id)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 ${
                        courseProgress[activeCourse.id]?.[activeCourse.modules[activeModuleIndex].id]
                          ? "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40"
                          : "bg-[#00ff88] hover:bg-[#00e67a] text-black"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {courseProgress[activeCourse.id]?.[activeCourse.modules[activeModuleIndex].id]
                        ? "Completed (Click to Revert)"
                        : "Mark Module Complete"}
                    </button>

                    {activeModuleIndex < (activeCourse.modules.length - 1) && (
                      <button
                        onClick={() => setActiveModuleIndex(prev => prev + 1)}
                        className="text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wider flex items-center gap-1"
                      >
                        Next Module <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Module List */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">All Syllabus Modules</h4>
                <div className="space-y-2">
                  {activeCourse.modules?.map((mod, idx) => {
                    const isDone = !!courseProgress[activeCourse.id]?.[mod.id];
                    const isCurrent = idx === activeModuleIndex;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => setActiveModuleIndex(idx)}
                        className={`p-3.5 rounded-sm border transition-all flex items-center justify-between cursor-pointer ${
                          isCurrent 
                            ? "bg-white/10 border-[#00ff88]" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleModuleComplete(activeCourse.id, mod.id);
                            }}
                            className={`w-5 h-5 rounded-sm flex items-center justify-center border transition-colors ${
                              isDone ? "bg-[#00ff88] border-[#00ff88] text-black" : "border-white/20 hover:border-white/50"
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                          <div>
                            <div className={`font-bold text-sm ${isCurrent ? "text-white" : "text-gray-300"}`}>
                              {idx + 1}. {mod.title}
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono">{mod.duration}</div>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isCurrent ? "text-[#00ff88]" : "text-gray-600"}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="text-xs text-gray-400 font-mono">
                Completion: <span className="text-[#00ff88] font-bold">{getCoursePercent(activeCourse)}%</span>
              </div>
              <button 
                onClick={() => setActiveCourse(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
              >
                Close Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

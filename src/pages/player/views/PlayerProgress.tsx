import { useState, useEffect } from "react";
import { Trophy, Activity, Target, Brain, Flame, FileText } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function PlayerProgress({ user }: { user: any }) {
  const [stats, setStats] = useState({
    trainingCompleted: 0,
    coursesCompleted: 0
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const trainSnap = await getDocs(collection(db, `playerProgress/${user.uid}/trainingProgress`));
        setStats({
          trainingCompleted: trainSnap.size,
          coursesCompleted: 0
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, [user]);

  const devCategories = [
    { name: "Ball Skills", score: 78, icon: <Trophy className="w-5 h-5" />, color: "bg-[#00ff88]" },
    { name: "Position Logic", score: 82, icon: <Target className="w-5 h-5" />, color: "bg-[#00b8ff]" },
    { name: "Athleticism", score: 64, icon: <Activity className="w-5 h-5" />, color: "bg-[#ff0055]" },
    { name: "Mindset", score: 85, icon: <Brain className="w-5 h-5" />, color: "bg-[#9d00ff]" },
    { name: "Nutrition", score: 60, icon: <Flame className="w-5 h-5" />, color: "bg-[#ffd700]" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold uppercase mb-1">My Progress</h1>
        <p className="text-gray-400">Track your overall development and statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-white/10 rounded-sm p-6 md:p-8 flex items-center justify-between">
           <div>
             <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Drills Completed</div>
             <div className="text-4xl font-black text-[#00ff88]">{stats.trainingCompleted}</div>
           </div>
           <Activity className="w-12 h-12 text-white/5" />
        </div>
        <div className="bg-[#111] border border-white/10 rounded-sm p-6 md:p-8 flex items-center justify-between">
           <div>
             <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Course Modules</div>
             <div className="text-4xl font-black">{stats.coursesCompleted}</div>
           </div>
           <FileText className="w-12 h-12 text-white/5" />
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-sm p-6 md:p-8">
        <h3 className="font-bold uppercase tracking-wide mb-6 pb-2 border-b border-white/10">Development Attributes</h3>
        
        <div className="space-y-6">
          {devCategories.map(cat => (
            <div key={cat.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-sm bg-white/5 ${cat.color.replace('bg-', 'text-')}`}>
                    {cat.icon}
                  </div>
                  <span className="font-bold uppercase tracking-wide text-sm">{cat.name}</span>
                </div>
                <span className="font-mono font-bold">{cat.score}%</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

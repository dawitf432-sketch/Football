import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { Loader2, FileText, CheckCircle2, X, Send, Award, Calendar, MapPin, DollarSign } from "lucide-react";

export default function PlayerScholarships({ user }: { user: any }) {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedScholarship, setSelectedScholarship] = useState<any | null>(null);
  const [personalStatement, setPersonalStatement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchScholarships();
    fetchUserApplications();
  }, [user]);

  const fetchScholarships = async () => {
    try {
      const snap = await getDocs(collection(db, "scholarships"));
      if (!snap.empty) {
        setScholarships(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        const res = await fetch("/api/public/scholarships");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setScholarships(data);
          }
        }
      }
    } catch (err) {
      console.error("Error loading scholarships:", err);
    }
    setLoading(false);
  };

  const fetchUserApplications = async () => {
    if (!user?.uid) return;
    try {
      const appQuery = query(collection(db, "applications"), where("playerId", "==", user.uid));
      const appSnap = await getDocs(appQuery);
      const map: Record<string, boolean> = {};
      appSnap.forEach(d => {
        const data = d.data();
        if (data.scholarshipId) {
          map[data.scholarshipId] = true;
        }
      });
      setAppliedIds(map);
    } catch (err) {
      console.error("Error loading user applications:", err);
    }
  };

  const handleApply = async () => {
    if (!selectedScholarship || !user?.uid) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        scholarshipId: selectedScholarship.id,
        scholarshipTitle: selectedScholarship.title,
        playerId: user.uid,
        playerName: user.name || "Student Athlete",
        playerEmail: user.email || "",
        providerId: selectedScholarship.providerId || "ADMIN",
        personalStatement: personalStatement.trim() || "Applying for elite pathway scholarship.",
        status: "SUBMITTED",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setAppliedIds(prev => ({ ...prev, [selectedScholarship.id]: true }));
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedScholarship(null);
        setPersonalStatement("");
      }, 2500);
    } catch (err) {
      console.error("Error submitting scholarship application:", err);
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold uppercase mb-1">Scholarships</h1>
        <p className="text-gray-400">Discover and apply for academy and university programs.</p>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" /></div>
      ) : scholarships.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-[#111] border border-white/10 rounded-sm">
          No scholarships available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map(item => {
            const isApplied = appliedIds[item.id];
            return (
              <div key={item.id} className="bg-[#111] border border-white/10 rounded-sm p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                       <FileText className="w-5 h-5 text-[#00ff88]" />
                    </div>
                    {isApplied ? (
                      <span className="text-xs font-bold uppercase tracking-widest text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 px-2 py-1 rounded-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-widest text-[#00ff88] bg-[#00ff88]/10 px-2 py-1 rounded-sm">
                        Open
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3 mb-4">{item.description}</p>
                  
                  {item.institution && (
                    <div className="text-xs text-gray-400 flex items-center gap-1.5 mb-2">
                      <Award className="w-4 h-4 text-gray-500" /> {item.institution}
                    </div>
                  )}
                  {item.location && (
                    <div className="text-xs text-gray-400 flex items-center gap-1.5 mb-4">
                      <MapPin className="w-4 h-4 text-gray-500" /> {item.location}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                   <div className="text-xs text-gray-500 font-mono uppercase">
                     Deadline: {item.deadline || 'Rolling'}
                   </div>
                   <button 
                     onClick={() => {
                       setSelectedScholarship(item);
                       setSubmitSuccess(false);
                     }}
                     className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-200 transition-colors"
                   >
                     {isApplied ? "View Application" : "View Details & Apply"}
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details & Application Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/20 rounded-sm w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00ff88]/10 rounded-sm flex items-center justify-center text-[#00ff88]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-wide text-white">{selectedScholarship.title}</h2>
                  <p className="text-xs text-gray-400">{selectedScholarship.institution || "Pro Football Class Partner Institution"}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="text-gray-400 hover:text-white p-1 rounded-sm hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Program Overview</h4>
                <p className="text-gray-300 leading-relaxed">{selectedScholarship.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-sm border border-white/10">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Coverage</div>
                  <div className="font-bold text-[#00ff88] mt-0.5">{selectedScholarship.fundingCoverage || "100% Tuition & Accommodation"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Age Group</div>
                  <div className="font-bold text-white mt-0.5">{selectedScholarship.ageRange || "U16 – U21"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Deadline</div>
                  <div className="font-bold text-white mt-0.5">{selectedScholarship.deadline || "Rolling Intake"}</div>
                </div>
              </div>

              {selectedScholarship.requirements && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Applicant Requirements</h4>
                  <p className="text-gray-300 bg-black/40 p-3 rounded-sm border border-white/10 text-xs leading-relaxed whitespace-pre-line">
                    {Array.isArray(selectedScholarship.requirements) 
                      ? selectedScholarship.requirements.join("\n• ") 
                      : selectedScholarship.requirements}
                  </p>
                </div>
              )}

              {appliedIds[selectedScholarship.id] ? (
                <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 p-4 rounded-sm flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00ff88] flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm">Application on File</div>
                    <div className="text-xs text-gray-400">Your profile and dossier have been submitted to the scholarship committee for evaluation.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Personal Statement / Supporting Note (Optional)
                  </label>
                  <textarea
                    value={personalStatement}
                    onChange={e => setPersonalStatement(e.target.value)}
                    rows={3}
                    placeholder="Describe your football background, academic aspirations, and commitment to the program..."
                    className="w-full bg-black/60 border border-white/10 rounded-sm p-3 text-white text-xs outline-none focus:border-[#00ff88] resize-none"
                  />
                  {submitSuccess && (
                    <div className="text-xs font-bold text-[#00ff88] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Application submitted successfully!
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              {!appliedIds[selectedScholarship.id] && (
                <button
                  onClick={handleApply}
                  disabled={submitting || submitSuccess}
                  className="px-6 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold uppercase text-xs tracking-wider rounded-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

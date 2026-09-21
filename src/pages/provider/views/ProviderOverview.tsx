import React, { useEffect, useState } from "react";
import { 
  GraduationCap, 
  Users, 
  Clock, 
  CheckCircle2, 
  Star, 
  PlusCircle, 
  Compass, 
  FileText, 
  ArrowRight, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { 
  Scholarship, 
  ScholarshipApplication, 
  ProviderProfile, 
  ProviderShortlist,
  PlayerPublicProfile
} from "../../../types";
import { providerService } from "../services/providerService";

interface ProviderOverviewProps {
  providerId: string;
  profile: ProviderProfile | null;
  onNavigate: (tab: string, param?: any) => void;
  onOpenPlayerModal: (player: PlayerPublicProfile) => void;
}

export default function ProviderOverview({
  providerId,
  profile,
  onNavigate,
  onOpenPlayerModal
}: ProviderOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [shortlist, setShortlist] = useState<ProviderShortlist[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadOverviewData() {
      setLoading(true);
      // Ensure initial seed if brand new provider
      if (profile) {
        await providerService.seedInitialProviderDataIfEmpty(providerId, profile.organizationName);
      }

      const [sList, aList, slList] = await Promise.all([
        providerService.getScholarships(providerId),
        providerService.getApplications(providerId),
        providerService.getShortlist(providerId)
      ]);

      if (mounted) {
        setScholarships(sList);
        setApplications(aList);
        setShortlist(slList);
        setLoading(false);
      }
    }
    loadOverviewData();
    return () => { mounted = false; };
  }, [providerId, profile]);

  const activeScholarships = scholarships.filter(s => s.status === "PUBLISHED").length;
  const underReviewCount = applications.filter(a => a.status === "UNDER_REVIEW").length;
  const acceptedCount = applications.filter(a => a.status === "ACCEPTED").length;
  const recentApplications = applications.slice(0, 5);

  const isVerified = profile?.verificationStatus === "VERIFIED";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Verification Status Banner */}
      {!isVerified ? (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Organization Verification Pending</h3>
              <p className="text-xs text-amber-200/80 mt-0.5">
                To protect student athletes and youth football players, only accredited organizations can publish live scholarships.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("profile")}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            Complete Verification
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#00ff88]/10 via-[#00b8ff]/5 to-transparent border border-[#00ff88]/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{profile?.organizationName || "Verified Organization"}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30">
                  OFFICIALLY VERIFIED
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Authorized Scholarship & Academic Pathway Provider • Accreditation #{profile?.accreditationNumber || "PFC-2026"}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("create-scholarship")}
            className="hidden sm:flex px-4 py-2 bg-[#00ff88] hover:bg-[#00e67a] text-black text-xs font-black rounded-xl items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]"
          >
            <PlusCircle className="w-4 h-4" />
            New Scholarship
          </button>
        </div>
      )}

      {/* 5 Real Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Active Scholarships */}
        <div 
          onClick={() => onNavigate("scholarships")}
          className="bg-[#0b1326] border border-white/10 hover:border-[#00ff88]/40 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Active Programs</span>
            <div className="w-8 h-8 rounded-lg bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#00ff88] transition-colors">
            {loading ? "..." : activeScholarships}
          </div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span>{scholarships.length} total created</span>
            <ChevronRight className="w-3 h-3 text-gray-500" />
          </div>
        </div>

        {/* Total Applications */}
        <div 
          onClick={() => onNavigate("applications")}
          className="bg-[#0b1326] border border-white/10 hover:border-blue-400/40 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Applications</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-blue-400 transition-colors">
            {loading ? "..." : applications.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span>Candidate submissions</span>
            <ChevronRight className="w-3 h-3 text-gray-500" />
          </div>
        </div>

        {/* Under Review */}
        <div 
          onClick={() => onNavigate("applications")}
          className="bg-[#0b1326] border border-white/10 hover:border-amber-400/40 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Under Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {loading ? "..." : underReviewCount}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Pending committee decision
          </div>
        </div>

        {/* Shortlisted Players */}
        <div 
          onClick={() => onNavigate("shortlist")}
          className="bg-[#0b1326] border border-white/10 hover:border-purple-400/40 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Shortlisted</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-purple-400 transition-colors">
            {loading ? "..." : shortlist.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Target prospects & finalists
          </div>
        </div>

        {/* Accepted Players */}
        <div 
          onClick={() => onNavigate("applications")}
          className="bg-[#0b1326] border border-white/10 hover:border-[#00ff88]/40 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all hover:translate-y-[-2px] group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Accepted</span>
            <div className="w-8 h-8 rounded-lg bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#00ff88]">
            {loading ? "..." : acceptedCount}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Awarded scholarships
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Applications & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Applications */}
        <div className="lg:col-span-2 bg-[#0b1326] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00ff88]" />
                Recent Applicant Submissions
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Real athlete dossiers submitted to your programs</p>
            </div>
            <button
              onClick={() => onNavigate("applications")}
              className="text-xs font-bold text-[#00ff88] hover:underline flex items-center gap-1"
            >
              View All ({applications.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-400 text-xs">Loading application records...</div>
          ) : recentApplications.length === 0 ? (
            <div className="py-16 text-center text-gray-400 bg-[#070d18] rounded-xl border border-white/5 p-6 my-auto">
              <GraduationCap className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-white">No Applications Received Yet</div>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Once players apply to your published scholarship listings, their dossiers and video highlights will populate here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-[#070d18] border border-white/5 hover:border-white/20 p-3.5 sm:p-4 rounded-xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-blue-500/20 border border-[#00ff88]/30 flex items-center justify-center text-sm font-black text-[#00ff88] shrink-0">
                      {app.playerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{app.playerName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-300">
                          {app.playerPosition} • {app.playerAge}y
                        </span>
                        <span className="text-xs text-gray-400">
                          {app.playerCountry}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                        Applied for: <span className="text-gray-300 font-medium">{app.scholarshipTitle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      app.status === "ACCEPTED"
                        ? "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30"
                        : app.status === "SHORTLISTED"
                        ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                        : app.status === "UNDER_REVIEW"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : app.status === "REJECTED"
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                    }`}>
                      {app.status.replace("_", " ")}
                    </span>

                    <button
                      onClick={() => onNavigate("applications", { scholarshipId: app.scholarshipId, applicationId: app.id })}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-colors flex items-center gap-1"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Quick Actions & Program Status */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-[#0b1326] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-3">
            <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider mb-2">Provider Actions</h3>
            
            <button
              onClick={() => onNavigate("create-scholarship")}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#00ff88]/20 to-[#00b8ff]/20 hover:from-[#00ff88]/30 hover:to-[#00b8ff]/30 border border-[#00ff88]/40 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Create New Scholarship</div>
                  <div className="text-[10px] text-gray-400">Publish eligibility, benefits & deadline</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => onNavigate("discovery")}
              className="w-full p-3.5 rounded-xl bg-[#070d18] hover:bg-white/5 border border-white/5 hover:border-white/15 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Discover Players</div>
                  <div className="text-[10px] text-gray-400">Search verified grassroots & academy talent</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => onNavigate("messages")}
              className="w-full p-3.5 rounded-xl bg-[#070d18] hover:bg-white/5 border border-white/5 hover:border-white/15 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Direct Messages</div>
                  <div className="text-[10px] text-gray-400">Controlled communication with applicants</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Active Program Spotlight */}
          <div className="bg-[#0b1326] border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider mb-3">Live Scholarship Spotlight</h3>
            {scholarships.length > 0 ? (
              <div className="bg-[#070d18] p-4 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    scholarships[0].status === "PUBLISHED" 
                      ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30" 
                      : "bg-white/10 text-gray-400"
                  }`}>
                    {scholarships[0].status}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Deadline: {scholarships[0].applicationDeadline || "Open"}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm leading-snug">{scholarships[0].title}</h4>
                <p className="text-xs text-gray-400 line-clamp-2">{scholarships[0].description}</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <span>Places: <strong className="text-white">{scholarships[0].availablePlaces}</strong></span>
                  <button
                    onClick={() => onNavigate("scholarships")}
                    className="text-[#00ff88] font-bold hover:underline"
                  >
                    Manage →
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center py-6">
                No active scholarships published.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

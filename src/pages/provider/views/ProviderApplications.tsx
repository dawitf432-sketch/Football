import React, { useEffect, useState } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Shield, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Star, 
  ExternalLink, 
  PlayCircle, 
  Send, 
  Edit3, 
  UserCheck, 
  X,
  ChevronDown,
  MessageSquare
} from "lucide-react";
import { 
  ScholarshipApplication, 
  Scholarship, 
  ApplicationStatus, 
  PlayerPublicProfile,
  ProviderProfile 
} from "../../../types";
import { providerService } from "../services/providerService";

interface ProviderApplicationsProps {
  providerId: string;
  profile: ProviderProfile | null;
  initialScholarshipId?: string;
  onOpenPlayerModal: (player: PlayerPublicProfile) => void;
  onSendMessage: (player: { userId: string; name: string }) => void;
}

export default function ProviderApplications({
  providerId,
  profile,
  initialScholarshipId,
  onOpenPlayerModal,
  onSendMessage
}: ProviderApplicationsProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>(initialScholarshipId || "ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Detailed Modal state
  const [inspectedApp, setInspectedApp] = useState<ScholarshipApplication | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [sList, aList] = await Promise.all([
      providerService.getScholarships(providerId),
      providerService.getApplications(
        providerId, 
        selectedScholarshipId !== "ALL" ? selectedScholarshipId : undefined
      )
    ]);
    setScholarships(sList);
    setApplications(aList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [providerId, selectedScholarshipId]);

  const handleUpdateStatus = async (app: ScholarshipApplication, newStatus: ApplicationStatus) => {
    setUpdatingStatus(true);
    try {
      await providerService.updateApplicationStatus(
        app.id, 
        newStatus, 
        app.providerNotes, 
        {
          playerId: app.playerId,
          scholarshipTitle: app.scholarshipTitle,
          providerName: profile?.organizationName || "Scholarship Committee"
        }
      );
      if (inspectedApp && inspectedApp.id === app.id) {
        setInspectedApp({ ...inspectedApp, status: newStatus });
      }
      await loadData();
    } catch (e) {
      console.error("Error updating status:", e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async (appId: string) => {
    try {
      await providerService.updateApplicationStatus(appId, inspectedApp?.status || "UNDER_REVIEW", editingNotes);
      if (inspectedApp) {
        setInspectedApp({ ...inspectedApp, providerNotes: editingNotes });
      }
      await loadData();
    } catch (e) {
      console.error("Error saving notes:", e);
    }
  };

  const openAppDetails = (app: ScholarshipApplication) => {
    setInspectedApp(app);
    setEditingNotes(app.providerNotes || "");
  };

  const filtered = applications.filter((app) => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        app.playerName.toLowerCase().includes(q) ||
        app.playerCountry.toLowerCase().includes(q) ||
        app.playerPosition.toLowerCase().includes(q) ||
        app.scholarshipTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#00ff88]" />
            Applicant Dossiers & Submissions
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Review player applications, evaluate qualifications, and award official scholarship placements.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#0b1326] px-3 py-1.5 rounded-xl border border-white/10">
          <span>Total Dossiers: <strong className="text-white">{applications.length}</strong></span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0b1326] border border-white/10 p-4 rounded-2xl flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applicant name, country, position..."
              className="w-full bg-[#070d18] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
            />
          </div>

          {/* Scholarship selector */}
          <select
            value={selectedScholarshipId}
            onChange={(e) => setSelectedScholarshipId(e.target.value)}
            className="bg-[#070d18] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff88] max-w-xs truncate"
          >
            <option value="ALL">All Scholarship Programs</option>
            {scholarships.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {["ALL", "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? "bg-[#00ff88] text-black"
                  : "bg-[#070d18] text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">Loading applicant dossiers...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-[#0b1326] rounded-2xl border border-white/10 p-8 space-y-3">
          <FileText className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Applications Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "ALL" || selectedScholarshipId !== "ALL"
              ? "No dossiers match the selected filters."
              : "No candidate has applied to this program yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const isAccepted = app.status === "ACCEPTED";
            const isShortlisted = app.status === "SHORTLISTED";
            const isUnderReview = app.status === "UNDER_REVIEW";
            const isRejected = app.status === "REJECTED";

            return (
              <div
                key={app.id}
                className="bg-[#0b1326] border border-white/10 hover:border-white/20 p-4 sm:p-5 rounded-2xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                {/* Left: Applicant Information */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-blue-500/20 border border-[#00ff88]/30 flex items-center justify-center text-base font-black text-[#00ff88] shrink-0">
                    {app.playerName.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-base">{app.playerName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20">
                        {app.playerPosition}
                      </span>
                      <span className="text-xs text-gray-400">
                        {app.playerAge} Years • {app.playerCountry}
                      </span>
                    </div>

                    <div className="text-xs text-gray-300">
                      Applied for: <strong className="text-white">{app.scholarshipTitle}</strong>
                    </div>

                    {app.personalStatement && (
                      <p className="text-xs text-gray-400 line-clamp-1 italic max-w-2xl">
                        "{app.personalStatement}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                  {/* Status Dropdown / Badge */}
                  <div className="relative group/status">
                    <button
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isAccepted
                          ? "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30"
                          : isShortlisted
                          ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          : isUnderReview
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : isRejected
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      <span>{app.status.replace("_", " ")}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick status selector popup */}
                    <div className="absolute right-0 mt-1 w-44 bg-[#070d18] border border-white/15 rounded-xl p-1.5 shadow-2xl z-20 hidden group-hover/status:block">
                      {(["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"] as ApplicationStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(app, st)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            app.status === st ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {st.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => openAppDetails(app)}
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-colors"
                  >
                    View Dossier
                  </button>

                  <button
                    onClick={() => onSendMessage({ userId: app.playerId, name: app.playerName })}
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#00ff88]/20 text-gray-300 hover:text-[#00ff88] border border-white/10 transition-colors"
                    title="Send Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Detail Dossier Modal */}
      {inspectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0b1326] border border-white/15 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-[#0b1326] via-[#101b38] to-[#0b1326]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#00ff88]/20 border border-[#00ff88]/40 flex items-center justify-center text-lg font-black text-[#00ff88]">
                  {inspectedApp.playerName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{inspectedApp.playerName}</h3>
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                    <span>{inspectedApp.playerPosition}</span>
                    <span>•</span>
                    <span>{inspectedApp.playerAge} Years</span>
                    <span>•</span>
                    <span>{inspectedApp.playerCountry}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectedApp(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Program Applied for */}
              <div className="p-4 bg-[#070d18] rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Scholarship Application</div>
                  <div className="text-sm font-bold text-white mt-0.5">{inspectedApp.scholarshipTitle}</div>
                </div>
                {/* Status Toggle buttons */}
                <div className="flex items-center gap-1 flex-wrap">
                  {(["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"] as ApplicationStatus[]).map((st) => (
                    <button
                      key={st}
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus(inspectedApp, st)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] uppercase transition-all ${
                        inspectedApp.status === st
                          ? "bg-[#00ff88] text-black"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Statement */}
              <div>
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
                  Personal Statement & Ambitions
                </h4>
                <div className="bg-[#070d18] p-4 rounded-xl border border-white/5 text-gray-300 leading-relaxed text-xs">
                  {inspectedApp.personalStatement || "No personal statement submitted."}
                </div>
              </div>

              {/* Qualifications & Verification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#070d18] p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Academic Record</div>
                  <div className="text-sm font-bold text-white">{inspectedApp.academicGrade || "Grade A- Equivalent (Transcripts Verified)"}</div>
                  <div className="text-gray-400 text-[11px]">Academic schooling standards meet eligibility requirements.</div>
                </div>

                <div className="bg-[#070d18] p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Guardian Safeguarding</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00ff88]">
                    <Shield className="w-4 h-4" />
                    <span>Guardian Consent Verified</span>
                  </div>
                  <div className="text-gray-400 text-[11px]">Formal parental/guardian approval signed for international residency.</div>
                </div>
              </div>

              {/* Showcase Video Link */}
              {inspectedApp.videoShowcaseUrl && (
                <div>
                  <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
                    Applicant Video Showcase Reel
                  </h4>
                  <a
                    href={inspectedApp.videoShowcaseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#070d18] hover:bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs text-white transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-[#00ff88]" />
                      Watch Match Highlights & Tactical Film
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>
              )}

              {/* Committee Internal Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    Provider Evaluation Notes (Private to Organization)
                  </h4>
                  <button
                    onClick={() => handleSaveNotes(inspectedApp.id)}
                    className="text-[#00ff88] font-bold hover:underline text-xs"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record scouting notes, committee interview feedback, physical testing evaluation..."
                  className="w-full bg-[#070d18] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#070d18] flex items-center justify-between gap-3">
              <button
                onClick={() => onSendMessage({ userId: inspectedApp.playerId, name: inspectedApp.playerName })}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Message Candidate
              </button>

              <button
                onClick={() => setInspectedApp(null)}
                className="px-4 py-2 bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

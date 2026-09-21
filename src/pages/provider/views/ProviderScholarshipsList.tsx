import React, { useEffect, useState } from "react";
import { 
  GraduationCap, 
  PlusCircle, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Edit3, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  Eye, 
  ChevronRight, 
  AlertCircle,
  Clock,
  Globe
} from "lucide-react";
import { Scholarship, ScholarshipStatus, ProviderProfile } from "../../../types";
import { providerService } from "../services/providerService";

interface ProviderScholarshipsListProps {
  providerId: string;
  profile: ProviderProfile | null;
  onNavigate: (tab: string, param?: any) => void;
  onEditScholarship: (scholarship: Scholarship) => void;
}

export default function ProviderScholarshipsList({
  providerId,
  profile,
  onNavigate,
  onEditScholarship
}: ProviderScholarshipsListProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionError, setActionError] = useState<string | null>(null);

  const isVerified = profile?.verificationStatus === "VERIFIED";

  const loadScholarships = async () => {
    setLoading(true);
    const list = await providerService.getScholarships(providerId);
    setScholarships(list);
    setLoading(false);
  };

  useEffect(() => {
    loadScholarships();
  }, [providerId]);

  const handleStatusChange = async (scholarshipId: string, newStatus: ScholarshipStatus) => {
    setActionError(null);
    if (newStatus === "PUBLISHED" && !isVerified) {
      setActionError("Your organization must be verified by administrators before publishing live scholarships to players.");
      return;
    }
    try {
      await providerService.updateScholarshipStatus(scholarshipId, newStatus);
      await loadScholarships();
    } catch (err: any) {
      setActionError(err.message || "Failed to update scholarship status.");
    }
  };

  const handleDelete = async (scholarshipId: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await providerService.deleteScholarship(scholarshipId);
        await loadScholarships();
      } catch (err: any) {
        setActionError("Failed to delete scholarship.");
      }
    }
  };

  const filtered = scholarships.filter(s => {
    if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.eligiblePositions?.some(p => p.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#00ff88]" />
            My Scholarships & Grants
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your organization's football academy programs, tuition grants, and athlete residencies.
          </p>
        </div>
        <button
          onClick={() => onNavigate("create-scholarship")}
          className="px-4 py-2.5 bg-[#00ff88] hover:bg-[#00e67a] text-black text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,136,0.25)]"
        >
          <PlusCircle className="w-4 h-4" />
          Create Scholarship
        </button>
      </div>

      {actionError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#0b1326] border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, position..."
            className="w-full bg-[#070d18] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["ALL", "PUBLISHED", "DRAFT", "CLOSED", "ARCHIVED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? "bg-[#00ff88] text-black"
                  : "bg-[#070d18] text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Scholarships List Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">Loading scholarship listings...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-[#0b1326] rounded-2xl border border-white/10 p-8 space-y-3">
          <GraduationCap className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Scholarships Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your search criteria or status filter."
              : "Get started by creating your first youth football scholarship or academy grant."}
          </p>
          <button
            onClick={() => onNavigate("create-scholarship")}
            className="px-4 py-2 bg-[#00ff88] hover:bg-[#00e67a] text-black text-xs font-black rounded-xl inline-flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create First Scholarship
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => {
            const isPub = s.status === "PUBLISHED";
            const isDraft = s.status === "DRAFT";
            const isClosed = s.status === "CLOSED";
            const isArchived = s.status === "ARCHIVED";

            return (
              <div
                key={s.id}
                className="bg-[#0b1326] border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  {/* Top Status & Places Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      isPub
                        ? "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30"
                        : isDraft
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : isClosed
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : "bg-gray-500/15 text-gray-400 border border-gray-500/30"
                    }`}>
                      {s.status}
                    </span>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="font-semibold text-white">{s.availablePlaces}</span>
                      <span>Places</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#00ff88] transition-colors line-clamp-2">
                      {s.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  {/* Meta Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className="truncate">{s.location || s.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>Deadline: <strong className="text-gray-200">{s.applicationDeadline || "Open"}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>Age: <strong className="text-gray-200">{s.ageRequirements || "All Ages"}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Applicants: <strong className="text-white">{s.applicationsCount || 0}</strong></span>
                    </div>
                  </div>

                  {/* Position tags */}
                  {s.eligiblePositions && s.eligiblePositions.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {s.eligiblePositions.map((pos) => (
                        <span key={pos} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-300 border border-white/5">
                          {pos}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
                  {/* Applications count link */}
                  <button
                    onClick={() => onNavigate("applications", { scholarshipId: s.id })}
                    className="text-xs font-bold text-[#00ff88] hover:underline flex items-center gap-1"
                  >
                    <span>View Dossiers ({s.applicationsCount || 0})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Status quick toggles */}
                    {isDraft && (
                      <button
                        onClick={() => handleStatusChange(s.id, "PUBLISHED")}
                        className="px-2.5 py-1.5 rounded-lg bg-[#00ff88]/10 hover:bg-[#00ff88]/20 text-[#00ff88] text-[11px] font-bold transition-colors"
                        title="Publish Live"
                      >
                        Publish
                      </button>
                    )}
                    {isPub && (
                      <button
                        onClick={() => handleStatusChange(s.id, "CLOSED")}
                        className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold transition-colors"
                        title="Close Applications"
                      >
                        Close
                      </button>
                    )}
                    {isClosed && (
                      <button
                        onClick={() => handleStatusChange(s.id, "PUBLISHED")}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold transition-colors"
                        title="Reopen Applications"
                      >
                        Reopen
                      </button>
                    )}

                    <button
                      onClick={() => onEditScholarship(s)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      title="Edit Scholarship"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(s.id, s.title)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

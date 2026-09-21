import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, MapPin, Calendar, Users, CheckCircle2, ArrowRight, X, ExternalLink, Shield } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

interface ScholarshipOpportunity {
  id: string;
  title: string;
  organizationName: string;
  location: string;
  country: string;
  description: string;
  eligiblePositions: string[];
  ageRequirements: string;
  placesAvailable: number;
  deadline: string;
  benefits: string[];
  requirements: string[];
  applicationInstructions?: string;
}

const DEFAULT_SCHOLARSHIPS: ScholarshipOpportunity[] = [
  {
    id: "sch-01",
    title: "European Residential Elite Football & Academic Fellowship",
    organizationName: "International Football Development Academy",
    location: "Valencia / Alicante",
    country: "Spain",
    description: "Fully funded 10-month residential program combining UEFA Pro licensed daily training with accredited bilingual academic coursework.",
    eligiblePositions: ["Midfielder", "Winger", "Striker", "Defender", "Goalkeeper"],
    ageRequirements: "16 - 19 years old",
    placesAvailable: 4,
    deadline: "2026-06-30",
    benefits: ["100% Tuition & Boarding covered", "UEFA Pro Coaching staff & GPS tracking", "Official federated match competition", "Spanish language & secondary education"],
    requirements: ["Verified 30m sprint test under 4.15s", "Admin-approved match highlight video", "Clean disciplinary & academic record", "Passport valid for at least 12 months"],
    applicationInstructions: "Submit your verified Pro Football Class profile dossier and coach evaluation letter via the student portal."
  },
  {
    id: "sch-02",
    title: "US Collegiate Soccer Athletic & Degree Grant",
    organizationName: "Collegiate Soccer Recruitment Network",
    location: "Various Campuses (NCAA D1 / D2)",
    country: "United States",
    description: "Full four-year collegiate athletic scholarship offering competitive soccer and four-year bachelor degree.",
    eligiblePositions: ["Centre-Back", "Full-Back", "Central Midfielder", "Striker"],
    ageRequirements: "17 - 20 years old",
    placesAvailable: 6,
    deadline: "2026-08-15",
    benefits: ["Full university tuition & accommodation", "Strength & conditioning sports science", "High-exposure collegiate conference matches", "Degree in business, kinesiology or STEM"],
    requirements: ["High school completion with verified transcripts", "Minimum TOEFL / Duolingo English test score", "Verified game footage and coach references", "Physical combine fitness results"],
    applicationInstructions: "Apply directly through your student portal by linking your verified academic scores and biometric radar."
  },
  {
    id: "sch-03",
    title: "Pan-African High Performance Residential Academy Grant",
    organizationName: "East Africa Football Excellence Trust",
    location: "Addis Ababa / Bishoftu",
    country: "Ethiopia",
    description: "Full residential scholarship for exceptional emerging talent from across East Africa with elite coaching, nutrition, and schooling.",
    eligiblePositions: ["Goalkeeper", "Defender", "Midfielder", "Winger", "Striker"],
    ageRequirements: "14 - 17 years old",
    placesAvailable: 10,
    deadline: "2026-05-31",
    benefits: ["Full boarding, sports nutrition & medical care", "CAF A-licensed training twice daily", "International showcase tournament tours", "Secondary school academic scholarship"],
    requirements: ["Citizen of an African football federation", "Combine fitness test completion in portal", "Parent / guardian safeguarding consent", "Registered Pro Football Class student account"],
    applicationInstructions: "Ensure your player profile is active and verified by your registered youth coach."
  }
];

export default function ScholarshipSection() {
  const { t } = useLanguage();
  const [scholarships, setScholarships] = useState<ScholarshipOpportunity[]>(DEFAULT_SCHOLARSHIPS);
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipOpportunity | null>(null);

  useEffect(() => {
    fetch("/api/public/scholarships")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch scholarships");
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Normalize server scholarship records
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            organizationName: d.organizationName || "Accredited Partner",
            location: d.location || "Global",
            country: d.country || "International",
            description: d.description,
            eligiblePositions: Array.isArray(d.eligiblePositions) ? d.eligiblePositions : ["All Positions"],
            ageRequirements: d.ageRequirements || "U16 - U20",
            placesAvailable: d.placesAvailable || 1,
            deadline: d.deadline || "Open",
            benefits: Array.isArray(d.benefits) ? d.benefits : [d.benefits || "Fully Funded"],
            requirements: Array.isArray(d.requirements) ? d.requirements : [d.requirements || "Verified Profile"],
            applicationInstructions: d.applicationInstructions
          }));
          setScholarships(mapped);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_SCHOLARSHIPS
      });
  }, []);

  return (
    <section id="scholarships" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#03060f] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00ff88]/10 text-[#00ff88] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#00ff88]/20">
            <Award className="w-3.5 h-3.5" />
            {t.scholarships.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.scholarships.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.scholarships.subtitle}
          </p>
        </div>

        {/* Provider Callout Bar */}
        <div className="mb-10 p-4 sm:p-5 rounded-sm bg-[#080d1a] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-full bg-[#00b8ff]/20 text-[#00b8ff] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-xs text-gray-300">
              <span className="font-bold text-white uppercase block mb-0.5">Accredited Club & University Gateways</span>
              {t.scholarships.eligiblePrompt}
            </div>
          </div>
          <Link
            to="/access"
            state={{ defaultTab: "LOGIN" }}
            className="shrink-0 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-sm border border-white/15 transition-all"
          >
            Provider Portal
          </Link>
        </div>

        {/* Scholarships Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {scholarships.map((sch) => (
            <div
              key={sch.id}
              className="p-6 sm:p-7 rounded-sm bg-[#080d1a] border border-white/10 hover:border-[#00ff88]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1 text-[#00b8ff]">
                    <MapPin className="w-3.5 h-3.5" />
                    {sch.country}
                  </span>
                  <span className="bg-white/5 px-2 py-0.5 rounded-sm text-[10px]">
                    {sch.placesAvailable} {t.scholarships.placesLabel}
                  </span>
                </div>

                <div className="text-[11px] font-mono font-bold text-gray-400 uppercase mb-1">
                  {sch.organizationName}
                </div>

                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#00ff88] transition-colors leading-snug">
                  {sch.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                  {sch.description}
                </p>

                {/* Key metadata tags */}
                <div className="space-y-1.5 text-xs font-mono text-gray-300 mb-6 bg-black/40 p-3 rounded-sm border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Eligibility:</span>
                    <span>{sch.ageRequirements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline:</span>
                    <span className="text-[#00ff88] font-bold">{sch.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setSelectedScholarship(sch)}
                  className="text-xs font-bold text-gray-300 hover:text-white uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.scholarships.viewCta}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00ff88]" />
                </button>

                <Link
                  to="/access"
                  className="px-3 py-1.5 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-[11px] uppercase tracking-wider transition-colors"
                >
                  Apply
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Scholarship Modal */}
        {selectedScholarship && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0a0e1c] border border-white/20 rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedScholarship(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-[#00b8ff] uppercase mb-2">
                <MapPin className="w-3.5 h-3.5" />
                {selectedScholarship.location}, {selectedScholarship.country} • {selectedScholarship.organizationName}
              </div>

              <h3 className="text-2xl font-black text-white uppercase font-mono mb-4">
                {selectedScholarship.title}
              </h3>

              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                {selectedScholarship.description}
              </p>

              {/* Key Specs Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-3.5 rounded-sm bg-black/50 border border-white/10 text-xs font-mono">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Age Group</span>
                  <span className="text-white font-bold">{selectedScholarship.ageRequirements}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Open Places</span>
                  <span className="text-[#00ff88] font-bold">{selectedScholarship.placesAvailable} Available</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Deadline</span>
                  <span className="text-yellow-400 font-bold">{selectedScholarship.deadline}</span>
                </div>
              </div>

              {/* Eligible Positions */}
              <div className="mb-6">
                <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Eligible Positions:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScholarship.eligiblePositions.map((pos, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-xs text-gray-200">
                      {pos}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <div className="text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2">
                  {t.scholarships.benefitsLabel}:
                </div>
                <div className="space-y-1.5">
                  {selectedScholarship.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <div className="text-xs font-mono font-bold text-[#00b8ff] uppercase tracking-wider mb-2">
                  {t.scholarships.requirementsLabel}:
                </div>
                <div className="space-y-1.5">
                  {selectedScholarship.requirements.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#00b8ff] shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Banner */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-400">
                  Applications require an active student profile with verified stats.
                </span>
                <Link
                  to="/access"
                  onClick={() => setSelectedScholarship(null)}
                  className="w-full sm:w-auto px-6 py-3 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider text-center"
                >
                  {t.scholarships.applyNow}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, MapPin, Calendar, Award, DollarSign, ShieldCheck } from "lucide-react";

export default function HomeScholarshipsPreview() {
  const opportunities = [
    {
      id: "sch-01",
      title: "European Academy 10-Month Residency",
      provider: "Global Football Foundation",
      location: "Valencia, Spain",
      value: "€42,000 Fully Funded",
      deadline: "Oct 15, 2026",
      slots: "4 Athletes",
      criteria: "Ages 16-19 • Verified Match Reel • Minimum 3.0 Academic GPA",
      badge: "ELITE RESIDENCY",
      color: "border-[#00ff88]/40",
    },
    {
      id: "sch-02",
      title: "NCAA Division 1 Collegiate Showcase Grant",
      provider: "American Soccer Pathway Trust",
      location: "North Carolina, USA",
      value: "$18,500 Direct Grant",
      deadline: "Nov 01, 2026",
      slots: "8 Athletes",
      criteria: "Ages 17-20 • High School Graduate • SAT/ACT Standard Passed",
      badge: "COLLEGIATE SCHOLARSHIP",
      color: "border-[#00d4ff]/40",
    },
    {
      id: "sch-03",
      title: "Pro Combine Trial & Direct Scouting Week",
      provider: "Scandinavian Talent Alliance",
      location: "Gothenburg, Sweden",
      value: "Travel & Trial Covered",
      deadline: "Nov 20, 2026",
      slots: "6 Athletes",
      criteria: "Ages 17-22 • Physical Yo-Yo Level 19.5+ • Coach Endorsed",
      badge: "CLUB TRIAL",
      color: "border-[#00ff88]/40",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#030611] relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>Verified Institutional Funding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-mono">
              Scholarships & Pro Opportunities
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mt-1">
              Zero-agent fee academic and professional football grants vetted by verified institutional partners.
            </p>
          </div>

          <Link
            to="/scholarships"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-[#00ff88] hover:text-white border border-[#00ff88]/30 font-mono text-xs uppercase font-bold tracking-wider transition-all self-start md:self-auto"
          >
            <span>View All Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-sm bg-[#050a1a] border ${item.color} flex flex-col justify-between hover:border-white/40 transition-all group`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-white/5 text-[#00ff88] border border-[#00ff88]/30">
                    {item.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#00d4ff]">
                    {item.value}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#00ff88] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-400 font-mono mb-4">
                  Provided by <span className="text-gray-300 font-semibold">{item.provider}</span>
                </p>

                <div className="space-y-2 text-xs font-mono text-gray-300 bg-black/40 p-3 rounded-sm border border-white/5 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00ff88]" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Deadline: {item.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#00d4ff]" />
                    <span>Cohort: {item.slots}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  <strong className="text-gray-300">Criteria:</strong> {item.criteria}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5">
                <Link
                  to="/scholarships"
                  className="w-full py-2 px-3 rounded-sm bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-[#00ff88]/40 transition-all"
                >
                  <span>Review Application Guidelines</span>
                  <ArrowRight className="w-3 h-3 text-[#00ff88]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

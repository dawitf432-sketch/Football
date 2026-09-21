import { Link } from "react-router-dom";
import { User, Users, Search, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomeEcosystem() {
  const roles = [
    {
      title: "Athletes & Players",
      role: "PLAYER ROLE",
      icon: User,
      color: "text-emerald-400",
      badgeStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      description: "Access progressive technical drills, measure 0-30m sprint velocity, track Yo-Yo endurance, and build a verified profile visible to accredited club scouts.",
      highlights: ["Daily drill assignments", "Biometric testing logs", "Passport verification"],
    },
    {
      title: "Certified Coaches",
      role: "COACH ROLE",
      icon: Users,
      color: "text-sky-400",
      badgeStyle: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      description: "Manage squad rosters, assemble tactical groups, dispatch training micro-cycles, review completion rates, and broadcast team matchday announcements.",
      highlights: ["Squad roster control", "Training dispatch engine", "Performance analytics"],
    },
    {
      title: "Club & Academy Scouts",
      role: "SCOUT ROLE",
      icon: Search,
      color: "text-amber-400",
      badgeStyle: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      description: "Evaluate verified athlete dossiers, review timestamped match film, filter players by position and physical metrics, and track rising prospects.",
      highlights: ["Tamper-proof stats", "Direct scouting dossiers", "Position-specific filters"],
    },
    {
      title: "Scholarship Providers",
      role: "PROVIDER ROLE",
      icon: GraduationCap,
      color: "text-purple-400",
      badgeStyle: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      description: "Connect institutional funds, collegiate soccer grants, and international residency trials directly to disciplined, high-potential youth footballers.",
      highlights: ["Merit-based allocations", "Direct trial opportunities", "Zero third-party agent fees"],
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#0a0f1d] border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
            Platform Roles
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white font-display tracking-tight">
            Built For The Entire Football Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Dedicated portal experiences tailored to every participant in modern football development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.role}
                className="p-6 rounded-xl bg-[#11182c] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${r.badgeStyle}`}>
                      {r.role}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className={`w-5 h-5 ${r.color}`} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors font-display">
                    {r.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-5">
                    {r.description}
                  </p>

                  <ul className="space-y-2 border-t border-slate-800/80 pt-4 mb-5">
                    {r.highlights.map((h) => (
                      <li key={h} className="text-xs text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${r.color} shrink-0`} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <Link
                    to="/access"
                    className="inline-flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <span>Access Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

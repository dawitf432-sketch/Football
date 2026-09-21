import { Link } from "react-router-dom";
import { User, Users, Search, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomeEcosystem() {
  const roles = [
    {
      title: "Athletes & Players",
      role: "PLAYER ROLE",
      icon: User,
      color: "text-[#00ff88]",
      border: "border-[#00ff88]/30",
      description: "Access progressive technical drills, measure 0-30m sprint velocity, track Yo-Yo endurance, and build a verified profile visible to accredited club scouts.",
      highlights: ["Daily drill assignments", "Biometric testing logs", "Passport verification"],
    },
    {
      title: "Certified Coaches",
      role: "COACH ROLE",
      icon: Users,
      color: "text-[#00d4ff]",
      border: "border-[#00d4ff]/30",
      description: "Manage squad rosters, assemble tactical groups, dispatch training micro-cycles, review completion rates, and broadcast team matchday announcements.",
      highlights: ["Squad roster control", "Training dispatch engine", "Performance analytics"],
    },
    {
      title: "Club & Academy Scouts",
      role: "SCOUT ROLE",
      icon: Search,
      color: "text-[#00ff88]",
      border: "border-[#00ff88]/30",
      description: "Evaluate verified athlete dossiers, review timestamped match film, filter players by position and physical metrics, and track rising prospects.",
      highlights: ["Tamper-proof stats", "Direct scouting dossiers", "Position-specific filters"],
    },
    {
      title: "Scholarship Providers",
      role: "PROVIDER ROLE",
      icon: GraduationCap,
      color: "text-[#00d4ff]",
      border: "border-[#00d4ff]/30",
      description: "Connect institutional funds, collegiate soccer grants, and international residency trials directly to disciplined, high-potential youth footballers.",
      highlights: ["Merit-based allocations", "Direct trial opportunities", "Zero third-party agent fees"],
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#030611] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[11px] font-mono font-bold text-[#00d4ff] uppercase tracking-wider mb-1">
            Platform Roles
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono">
            Built For The Entire Football Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Dedicated portal experiences tailored to every participant in modern football development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.role}
                className={`p-5 rounded-sm bg-[#050a1a] border ${r.border} hover:border-white/30 transition-all flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-white/5 text-gray-300">
                      {r.role}
                    </span>
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${r.color}`} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                    {r.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {r.description}
                  </p>

                  <ul className="space-y-1.5 border-t border-white/5 pt-3">
                    {r.highlights.map((h) => (
                      <li key={h} className="text-[11px] font-mono text-gray-300 flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3 h-3 ${r.color} shrink-0`} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5">
                  <Link
                    to="/access"
                    className="inline-flex items-center justify-between w-full text-xs font-mono text-gray-400 hover:text-white transition-colors"
                  >
                    <span>Access Portal</span>
                    <ArrowRight className="w-3 h-3 text-[#00ff88]" />
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

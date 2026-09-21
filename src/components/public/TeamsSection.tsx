import { Link } from "react-router-dom";
import { Users, ClipboardList, Target, LineChart, Bell, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function TeamsSection() {
  const { t } = useLanguage();

  const coachIcons = [
    <Users className="w-5 h-5 text-[#00ff88]" />,
    <ClipboardList className="w-5 h-5 text-[#00b8ff]" />,
    <Target className="w-5 h-5 text-yellow-400" />,
    <LineChart className="w-5 h-5 text-emerald-400" />,
    <Bell className="w-5 h-5 text-[#ff0055]" />
  ];

  return (
    <section id="teams" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050812] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00ff88]/10 text-[#00ff88] text-xs font-mono font-bold uppercase tracking-widest mb-3 border border-[#00ff88]/20">
            <Users className="w-3.5 h-3.5" />
            {t.coaches.sectionTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 font-mono">
            {t.coaches.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {t.coaches.subtitle}
          </p>
        </div>

        {/* 5 Coach Features Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {t.coaches.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-sm bg-[#080d1a] border border-white/10 hover:border-[#00ff88]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-sm bg-white/5 border border-white/10 w-fit mb-4">
                  {coachIcons[idx]}
                </div>
                <h3 className="text-sm font-bold uppercase text-white mb-2 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 text-[11px] font-mono text-[#00ff88] flex items-center gap-1">
                <span>Integrated Tool</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Coach Portal Access Callout */}
        <div className="p-6 sm:p-8 rounded-sm bg-gradient-to-r from-[#0c1426] to-[#080d18] border border-[#00ff88]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00ff88] uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              Verified Coach Accreditation
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-mono mb-2">
              Ready To Modernize Your Club Or Academy?
            </h3>
            <p className="text-xs text-gray-400 max-w-xl">
              Get an official Coach Access ID to onboard your rosters, assign video training drills, and generate verified developmental reports.
            </p>
          </div>

          <Link
            to="/access"
            state={{ defaultTab: "LOGIN" }}
            className="shrink-0 px-6 py-3.5 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center gap-2"
          >
            <span>Enter Coach Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, X, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

import { BrandLogo } from "../common/BrandLogo";
import { PWAInstallButton } from "../common/PWAInstallButton";

export default function PublicFooter() {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<"TERMS" | "PRIVACY" | "SAFEGUARD" | "CONTACT" | null>(null);

  // Contact form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("GENERAL");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError("");
    try {
      const payload = {
        name: contactName.trim(),
        email: contactEmail.trim(),
        subject: contactSubject,
        message: contactMessage.trim(),
        createdAt: new Date()
      };

      let submitted = false;
      try {
        await addDoc(collection(db, "contactInquiries"), payload);
        submitted = true;
      } catch (directErr) {
        // Fallback to API
      }

      if (!submitted) {
        const res = await fetch("/api/public/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          throw new Error("Failed to transmit contact inquiry. Please try again.");
        }
      }

      setContactSuccess(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (err: any) {
      setContactError(err.message || "An unexpected error occurred.");
    } finally {
      setContactSubmitting(false);
    }
  };

  const navLinks = [
    { label: t.nav.home, href: "#hero" },
    { label: t.nav.academy, href: "#academy" },
    { label: t.nav.training, href: "#training" },
    { label: t.nav.positions, href: "#positions" },
    { label: t.nav.athleticism, href: "#athleticism" },
    { label: t.nav.nutrition, href: "#nutrition" },
    { label: t.nav.mindset, href: "#mindset" },
    { label: t.nav.showcase, href: "#showcase" },
    { label: t.nav.teams, href: "#teams" },
    { label: t.nav.scholarships, href: "#scholarships" },
    { label: t.nav.about, href: "#about" },
  ];

  return (
    <footer className="bg-[#02040a] border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" showSubtitle={true} to="/" />

            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              {t.footer.brandDesc}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-white/80 font-mono text-[11px]">
                <Shield className="w-3.5 h-3.5 text-[#00ff88]" />
                <span>{t.footer.safeguardingBadge}</span>
              </div>
              <PWAInstallButton variant="compact" />
            </div>
          </div>

          {/* Academy Navigation Links */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider mb-4">
              Curriculum & Roles
            </h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/training" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.training}</Link></li>
              <li><Link to="/positions" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.positions}</Link></li>
              <li><Link to="/athleticism" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.athleticism}</Link></li>
              <li><Link to="/nutrition" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.nutrition}</Link></li>
              <li><Link to="/mindset" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.mindset}</Link></li>
            </ul>
          </div>

          {/* Discovery & Pathways Links */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider mb-4">
              Pathways & Teams
            </h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/academy" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.academy}</Link></li>
              <li><Link to="/showcase" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.showcase}</Link></li>
              <li><Link to="/scholarships" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.scholarships}</Link></li>
              <li><Link to="/teams" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.teams}</Link></li>
              <li><Link to="/about" className="hover:text-white hover:text-[#00ff88] transition-colors">{t.nav.about}</Link></li>
            </ul>
          </div>

          {/* Portals & Legal Support */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider mb-4">
              Portals & Governance
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/access" className="text-[#00ff88] hover:underline font-bold">
                  {t.nav.studentAccess}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("CONTACT")}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.footer.contactSupport}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("SAFEGUARD")}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Child Protection & Safeguarding
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("PRIVACY")}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.footer.privacy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("TERMS")}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.footer.terms}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-mono">
          <div>{t.footer.rights}</div>
          <div className="flex items-center gap-4">
            <span>UEFA & CAF Certified Framework</span>
            <span>•</span>
            <span>FIFA Safeguarding Compliant</span>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Contact & Support Modal */}
      {activeModal === "CONTACT" && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0e1c] border border-white/20 rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => { setActiveModal(null); setContactSuccess(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black uppercase text-white font-mono mb-1">
              Contact Pro Football Class
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Reach our football operations, technical directors, or institutional scholarship coordination team.
            </p>

            {contactSuccess ? (
              <div className="p-6 text-center bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-sm">
                <CheckCircle2 className="w-10 h-10 text-[#00ff88] mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white uppercase mb-1">Message Transmitted</h4>
                <p className="text-xs text-gray-300 mb-4">
                  Your inquiry has been dispatched to our platform administrators. We respond within 24 business hours.
                </p>
                <button
                  onClick={() => { setActiveModal(null); setContactSuccess(false); }}
                  className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-sm text-xs font-bold uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {contactError && (
                  <div className="p-3 rounded-sm bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    {contactError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Coach or Athlete Name"
                    className="w-full px-3.5 py-2 rounded-sm bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00ff88]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Official Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 rounded-sm bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00ff88]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Department / Reason</label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-sm bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00ff88]"
                  >
                    <option value="GENERAL">General Support & Student Inquiries</option>
                    <option value="SCOUT">Verified Scout Accreditation Inquiry</option>
                    <option value="SCHOLARSHIP">Scholarship Provider Partnership</option>
                    <option value="SAFEGUARD">Child Protection & Safeguarding Officer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Detail your inquiry or request..."
                    className="w-full px-3.5 py-2 rounded-sm bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00ff88]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full py-3 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {contactSubmitting ? "Transmitting..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Safeguarding Policy Modal */}
      {activeModal === "SAFEGUARD" && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0e1c] border border-white/20 rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-[#00ff88] text-xs font-mono font-bold uppercase mb-2">
              <Shield className="w-4 h-4" />
              FIFA Compliance Policy
            </div>
            <h3 className="text-xl font-black uppercase text-white font-mono mb-4">
              Youth Safeguarding & Child Protection Statement
            </h3>
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <p>
                Pro Football Class is unconditionally committed to the safety, wellbeing, and dignity of every young athlete who utilizes our training curriculum, registers a player passport, or uploads match footage.
              </p>
              <div className="p-4 bg-black/50 border border-white/10 rounded-sm space-y-2">
                <h4 className="font-bold text-white uppercase text-xs">Core Safeguarding Mandates:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Direct contact information (home address, personal mobile telephone numbers) of minors is never made public or sold to third parties.</li>
                  <li>Video footage uploaded by youth athletes is reviewed by platform administrators before any public or scout-facing visibility is granted.</li>
                  <li>Scouts and club representatives must be vetted and accredited through our verification system before requesting direct contact with players' affiliated coaches or legal guardians.</li>
                  <li>All reports of harassment, suspicious unsolicited contact, or illicit agent promises are immediately investigated and referred to appropriate jurisdictional authorities.</li>
                </ul>
              </div>
              <p>
                Designated Child Safeguarding Officer: safeguarding@profootballclass.internal
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Terms Modal */}
      {activeModal === "TERMS" && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0e1c] border border-white/20 rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black uppercase text-white font-mono mb-4">
              Terms of Service
            </h3>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <p>
                By accessing Pro Football Class, you agree to adhere to all terms governing legitimate athletic development and authenticated portal access.
              </p>
              <p>
                <strong>1. Access ID Authorization:</strong> Access IDs are assigned exclusively to registered students, verified coaches, accredited scouts, and registered scholarship providers. Unauthorized transfer, sharing, or brute forcing of Access IDs is strictly prohibited and subject to immediate account revocation.
              </p>
              <p>
                <strong>2. Content Ownership:</strong> Training curricula, drill diagrams, and sports science protocols are proprietary intellectual property of Pro Football Class and its licensed coaches.
              </p>
              <p>
                <strong>3. Video Highlights:</strong> Players retain ownership of their competitive video footage while granting Pro Football Class a non-exclusive license to review and display admin-approved footage for talent discovery.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Privacy Modal */}
      {activeModal === "PRIVACY" && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0e1c] border border-white/20 rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black uppercase text-white font-mono mb-4">
              Privacy Policy
            </h3>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <p>
                We value your privacy. We collect minimal personal data necessary to benchmark athletic development, maintain player profiles, and facilitate genuine scholarship opportunities.
              </p>
              <p>
                <strong>Data Encryption:</strong> All biometric records, fitness metrics, and account credentials are encrypted in transit and stored securely in Cloud Firestore with role-based security rules.
              </p>
              <p>
                <strong>Non-Disclosure:</strong> We never sell player biometric data, contact information, or academic transcripts to predatory third-party advertisers or unverified intermediaries.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

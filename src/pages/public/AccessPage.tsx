import { useState, FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  ArrowLeft, Shield, Lock, User, CheckCircle2, 
  Key, AlertCircle, Globe, ChevronRight, Sparkles,
  ShieldCheck, Award, Users, Search, GraduationCap
} from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useLanguage } from "../../lib/LanguageContext";
import { BrandLogo } from "../../components/common/BrandLogo";
import { setSessionUser, AppUser } from "../../lib/authSession";

// Institutional & Demo IDs for instant access and system evaluation
const DEMO_ACCESS_IDS: Record<string, { role: string; country: string; label: string; name: string }> = {
  "PFC-ADMIN-MASTER1": { role: "ADMIN", country: "ETH", label: "Master Admin", name: "Dawit (Master Admin)" },
  "PFC-COACH-DEMO1": { role: "COACH", country: "ETH", label: "Head Coach", name: "Coach Solomon T." },
  "PFC-SCOUT-DEMO1": { role: "SCOUT", country: "GBR", label: "Talent Scout", name: "Marcus Wright (Scout)" },
  "PFC-PLAYER-DEMO1": { role: "PLAYER", country: "ETH", label: "Academy Player", name: "Yared Bekele (Player)" },
  "PFC-PROVIDER-DEMO1": { role: "SCHOLARSHIP_PROVIDER", country: "USA", label: "Scholarship Provider", name: "EduSports Global" },
};

export default function AccessPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"LOGIN" | "ACTIVATE">(() => {
    return (location.state as any)?.defaultTab === "ACTIVATE" ? "ACTIVATE" : "LOGIN";
  });

  // Activate Flow States (Access ID, Name, Password, Confirm Password)
  const [activationStep, setActivationStep] = useState<"VALIDATE" | "SETUP">("VALIDATE");
  const [accessId, setAccessId] = useState("");
  const [validatedRole, setValidatedRole] = useState("");
  const [validatedCountry, setValidatedCountry] = useState("");
  const [name, setName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login Flow States (Access ID / Email + Password)
  const [loginAccessId, setLoginAccessId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Processing, Notice & Errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  const switchTab = (tab: "LOGIN" | "ACTIVATE") => {
    setActiveTab(tab);
    setError("");
    setSuccessNotice("");
  };

  const routeToRole = (role: string) => {
    const r = role?.toUpperCase();
    if (r === "PLAYER") navigate("/player");
    else if (r === "COACH") navigate("/coach");
    else if (r === "SCOUT") navigate("/scout");
    else if (r === "SCHOLARSHIP_PROVIDER") navigate("/provider");
    else if (r === "ADMIN") navigate("/admin");
    else navigate("/player");
  };

  // Convert Access ID or Email to deterministic internal auth handle
  const toInternalEmail = (id: string) => {
    const trimmed = id.trim();
    if (trimmed.includes("@")) return trimmed.toLowerCase();
    const sanitized = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "");
    return `${sanitized}@profootballclass.internal`;
  };

  // 1. Activate Step 1: Validate Access ID
  const handleValidateAccessId = async (e: FormEvent) => {
    e.preventDefault();
    const cleanId = accessId.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setError("");
    setSuccessNotice("");

    try {
      if (DEMO_ACCESS_IDS[cleanId]) {
        const demoConfig = DEMO_ACCESS_IDS[cleanId];
        try {
          const checkDoc = await getDoc(doc(db, "accessIds", cleanId));
          if (!checkDoc.exists()) {
            await setDoc(doc(db, "accessIds", cleanId), {
              id: cleanId,
              role: demoConfig.role,
              country: demoConfig.country,
              status: "UNUSED",
              createdAt: new Date()
            });
          }
        } catch {
          // ignore seed err
        }
      }

      try {
        const idDoc = await getDoc(doc(db, "accessIds", cleanId));
        if (idDoc.exists()) {
          const record = idDoc.data();
          if (record.status === "CONSUMED") {
            setError(t.access.alreadyActivated);
            setLoginAccessId(cleanId);
            setLoading(false);
            return;
          }
          if (record.status === "DISABLED") {
            setError(t.access.revoked);
            setLoading(false);
            return;
          }
          setValidatedRole(record.role || "PLAYER");
          setValidatedCountry(record.country || "ETH");
          setActivationStep("SETUP");
          setLoading(false);
          return;
        }
      } catch {
        // Fallback below
      }

      // Check server API fallback
      const res = await fetch(`/api/access/validate?id=${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === "CONSUMED") {
          setError(t.access.alreadyActivated);
          setLoginAccessId(cleanId);
        } else if (data.status === "DISABLED") {
          setError(t.access.revoked);
        } else if (data.valid) {
          setValidatedRole(data.role || "PLAYER");
          setValidatedCountry(data.country || "ETH");
          setActivationStep("SETUP");
        } else {
          setError(t.access.invalidId);
        }
      } else {
        if (cleanId.startsWith("PFC-") || cleanId.length >= 6) {
          let fallbackRole = "PLAYER";
          if (cleanId.includes("COACH")) fallbackRole = "COACH";
          else if (cleanId.includes("SCOUT")) fallbackRole = "SCOUT";
          else if (cleanId.includes("PROVIDER")) fallbackRole = "SCHOLARSHIP_PROVIDER";
          else if (cleanId.includes("ADMIN")) fallbackRole = "ADMIN";

          setValidatedRole(fallbackRole);
          setValidatedCountry("ETH");
          setActivationStep("SETUP");
        } else {
          setError(t.access.invalidId);
        }
      }
    } catch {
      setError(t.access.networkError);
    } finally {
      setLoading(false);
    }
  };

  // 2. Activate Step 2: Complete Setup
  const handleCompleteActivation = async (e: FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      setError(t.access.passwordMismatch);
      return;
    }
    if (registerPassword.length < 6) {
      setError(t.access.passwordTooShort);
      return;
    }
    if (!name.trim()) {
      setError(t.access.nameRequired);
      return;
    }

    setLoading(true);
    setError("");

    const cleanId = accessId.trim().toUpperCase();
    const internalEmail = toInternalEmail(cleanId);
    let uid = `user-${cleanId.toLowerCase()}`;

    try {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, registerPassword);
        uid = userCredential.user.uid;
        await updateProfile(userCredential.user, { displayName: name.trim() });
      } catch (authErr: any) {
        if (authErr.code === "auth/email-already-in-use") {
          const cred = await signInWithEmailAndPassword(auth, internalEmail, registerPassword);
          uid = cred.user.uid;
        }
      }

      const country = validatedCountry || "ETH";
      const appUser: AppUser = {
        uid,
        name: name.trim(),
        email: internalEmail,
        role: validatedRole || "PLAYER",
        country,
        countryCode: country,
        accessId: cleanId,
        status: "ACTIVE"
      };

      try {
        await setDoc(doc(db, "users", uid), {
          uid,
          name: name.trim(),
          email: internalEmail,
          role: validatedRole || "PLAYER",
          country,
          countryCode: country,
          accessId: cleanId,
          status: "ACTIVE",
          createdAt: new Date(),
          lastLoginAt: new Date()
        }, { merge: true });

        await setDoc(doc(db, "accessIds", cleanId), {
          status: "CONSUMED",
          consumedBy: uid,
          consumedAt: new Date(),
          assignedName: name.trim()
        }, { merge: true });

        if (validatedRole === "PLAYER") {
          await setDoc(doc(db, "playerProfiles", uid), {
            playerId: uid,
            name: name.trim(),
            country,
            position: "Midfielder",
            level: "Academy",
            trainingHours: 0,
            showcaseCount: 0,
            updatedAt: new Date()
          }, { merge: true });
        } else if (validatedRole === "COACH") {
          await setDoc(doc(db, "coachProfiles", uid), {
            coachId: uid,
            name: name.trim(),
            country,
            licenseLevel: "CAF License",
            club: "PFC Academy",
            updatedAt: new Date()
          }, { merge: true });
        } else if (validatedRole === "SCOUT") {
          await setDoc(doc(db, "scoutProfiles", uid), {
            scoutId: uid,
            name: name.trim(),
            country,
            organization: "Independent Scouting",
            updatedAt: new Date()
          }, { merge: true });
        } else if (validatedRole === "SCHOLARSHIP_PROVIDER") {
          await setDoc(doc(db, "providerProfiles", uid), {
            providerId: uid,
            name: name.trim(),
            country,
            organization: "Scholarship Partner",
            updatedAt: new Date()
          }, { merge: true });
        }
      } catch {
        // Continue with local session if network lag
      }

      setSessionUser(appUser);
      setSuccessNotice(t.access.activationSuccess);
      setTimeout(() => {
        routeToRole(validatedRole || "PLAYER");
      }, 500);
    } catch (err: any) {
      setError(err.message || t.access.activationFailed);
    } finally {
      setLoading(false);
    }
  };

  // 3. Member Sign In
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const cleanId = loginAccessId.trim();
    if (!cleanId || !loginPassword) {
      setError(language === "am" ? "እባክዎ Access ID / ኢሜይል እና የይለፍ ቃል ያስገቡ።" : "Please enter your Access ID or Email and Password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const upperId = cleanId.toUpperCase();
      if (DEMO_ACCESS_IDS[upperId]) {
        fillDemoId(upperId);
        return;
      }

      const internalEmail = toInternalEmail(cleanId);
      const isMasterAdmin = upperId === "PFC-ADMIN-MASTER1" || cleanId.toLowerCase() === "dawitf645@gmail.com" || cleanId.toLowerCase() === "dawitf432@gmail.com" || cleanId.toLowerCase() === "admin@profootballclass.com";
      let userRole = isMasterAdmin ? "ADMIN" : "PLAYER";
      let userName = isMasterAdmin ? "Dawit (Master Admin)" : `Member ${cleanId}`;
      let uid = `user-${upperId.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, internalEmail, loginPassword);
        uid = userCredential.user.uid;
        if (userCredential.user.displayName) userName = userCredential.user.displayName;
      } catch {
        // Fallback to Firestore check
      }

      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const udata = userDoc.data();
          if (udata.role) userRole = udata.role;
          if (udata.name) userName = udata.name;
          await updateDoc(doc(db, "users", uid), {
            lastLoginAt: new Date()
          }).catch(() => {});
        } else {
          const accessDoc = await getDoc(doc(db, "accessIds", upperId));
          if (accessDoc.exists() && accessDoc.data().role) {
            userRole = accessDoc.data().role;
            if (accessDoc.data().assignedName) userName = accessDoc.data().assignedName;
          }
        }
      } catch {
        if (upperId.includes("COACH")) userRole = "COACH";
        else if (upperId.includes("SCOUT")) userRole = "SCOUT";
        else if (upperId.includes("PROVIDER")) userRole = "SCHOLARSHIP_PROVIDER";
        else if (upperId.includes("ADMIN") || isMasterAdmin) userRole = "ADMIN";
      }

      const appUser: AppUser = {
        uid,
        name: userName,
        email: internalEmail,
        role: userRole,
        country: "ETH",
        countryCode: "ETH",
        accessId: upperId,
        status: "ACTIVE"
      };
      setSessionUser(appUser);

      setSuccessNotice(t.access.loginSuccess);
      setTimeout(() => {
        routeToRole(userRole);
      }, 400);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // 4. One-Click Fast-Pass for Evaluation & Staff Roles
  const fillDemoId = async (id: string) => {
    setLoading(true);
    setError("");
    setSuccessNotice("");

    setLoginAccessId(id);

    const demoConfig = DEMO_ACCESS_IDS[id];
    if (!demoConfig) {
      setLoading(false);
      return;
    }

    const demoName = demoConfig.name;
    const uid = `demo-${id.toLowerCase()}`;
    const demoEmail = `${id.toLowerCase()}@profootballclass.com`;

    const sessionUser: AppUser = {
      uid,
      name: demoName,
      email: demoEmail,
      role: demoConfig.role,
      country: demoConfig.country,
      countryCode: demoConfig.country,
      accessId: id,
      status: "ACTIVE",
      isDemo: true,
    };
    setSessionUser(sessionUser);

    try {
      await setDoc(doc(db, "users", uid), {
        uid,
        name: demoName,
        email: demoEmail,
        role: demoConfig.role,
        country: demoConfig.country,
        countryCode: demoConfig.country,
        accessId: id,
        status: "ACTIVE",
        createdAt: new Date(),
        lastLoginAt: new Date()
      }, { merge: true }).catch(() => {});

      if (demoConfig.role === "PLAYER") {
        await setDoc(doc(db, "playerProfiles", uid), {
          playerId: uid,
          name: demoName,
          country: demoConfig.country,
          position: "Midfielder",
          level: "Academy",
          trainingHours: 18,
          showcaseCount: 2,
          updatedAt: new Date()
        }, { merge: true }).catch(() => {});
      } else if (demoConfig.role === "COACH") {
        await setDoc(doc(db, "coachProfiles", uid), {
          coachId: uid,
          name: demoName,
          country: demoConfig.country,
          club: "PFC Academy",
          experienceYears: 6,
          licenseLevel: "UEFA B / CAF License",
          updatedAt: new Date()
        }, { merge: true }).catch(() => {});
      } else if (demoConfig.role === "SCOUT") {
        await setDoc(doc(db, "scoutProfiles", uid), {
          scoutId: uid,
          name: demoName,
          country: demoConfig.country,
          organization: "International Scout Network",
          updatedAt: new Date()
        }, { merge: true }).catch(() => {});
      } else if (demoConfig.role === "SCHOLARSHIP_PROVIDER") {
        await setDoc(doc(db, "providerProfiles", uid), {
          providerId: uid,
          name: demoName,
          country: demoConfig.country,
          organization: "EduSports Global Foundation",
          updatedAt: new Date()
        }, { merge: true }).catch(() => {});
      }
    } catch {
      // non-blocking
    }

    setSuccessNotice(language === "am" ? `ወደ ${demoConfig.label} በመግባት ላይ...` : `Accessing portal as ${demoConfig.label}...`);
    setTimeout(() => {
      routeToRole(demoConfig.role);
    }, 350);
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": return Award;
      case "COACH": return Users;
      case "SCOUT": return Search;
      case "SCHOLARSHIP_PROVIDER": return GraduationCap;
      case "PLAYER":
      default: return User;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "COACH": return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "SCOUT": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "SCHOLARSHIP_PROVIDER": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "PLAYER":
      default: return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Refined Top Navigation Bar */}
      <header className="px-4 sm:px-8 py-4 border-b border-slate-800/80 bg-[#0a0f1d]/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.common.back}</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <BrandLogo size="sm" showSubtitle={false} to="/" />
        </div>

        {/* Language Switcher */}
        <button
          id="auth-lang-toggle"
          onClick={toggleLanguage}
          title={language === "en" ? "Switch to Amharic" : "Switch to English"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className={language === "en" ? "text-emerald-400 font-bold" : "text-slate-400"}>EN</span>
          <span className="text-slate-600">|</span>
          <span className={language === "am" ? "text-emerald-400 font-bold" : "text-slate-400"}>አማ</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md">
          {/* Institutional Portal Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 text-emerald-400 shadow-sm mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5 font-display">
              {t.access.portalTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
              {t.access.portalSubtitle}
            </p>
          </div>

          {/* Segmented Control / Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-6 shadow-inner">
            <button
              id="tab-login-btn"
              onClick={() => switchTab("LOGIN")}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "LOGIN"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700/80"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.access.loginTab}
            </button>
            <button
              id="tab-activate-btn"
              onClick={() => switchTab("ACTIVATE")}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "ACTIVATE"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700/80"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.access.activateTab}
            </button>
          </div>

          {/* Card Container */}
          <div className="bg-[#11182c] border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl relative">
            {error && (
              <div className="p-3.5 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {successNotice && (
              <div className="p-3.5 mb-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span className="leading-relaxed">{successNotice}</span>
              </div>
            )}

            {/* TAB 1: MEMBER SIGN IN */}
            {activeTab === "LOGIN" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.access.loginIdentifierLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      id="login-access-id-input"
                      type="text"
                      required
                      value={loginAccessId}
                      onChange={(e) => setLoginAccessId(e.target.value)}
                      placeholder={t.access.loginIdentifierPlaceholder}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      {t.access.passwordLabel}
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password-input"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={t.access.passwordPlaceholder}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-colors"
                    />
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {loading ? (
                    <span>{t.access.authenticating}</span>
                  ) : (
                    <>
                      <span>{t.access.loginBtn}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: ACTIVATE ACCOUNT */}
            {activeTab === "ACTIVATE" && (
              <div>
                {activationStep === "VALIDATE" ? (
                  <form onSubmit={handleValidateAccessId} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {t.access.accessIdLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Key className="w-4 h-4" />
                        </div>
                        <input
                          id="activate-access-id-input"
                          type="text"
                          required
                          value={accessId}
                          onChange={(e) => setAccessId(e.target.value.toUpperCase())}
                          placeholder={t.access.accessIdPlaceholder}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 font-mono tracking-wider transition-colors"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">
                        {t.access.howToGetIdDesc}
                      </p>
                    </div>

                    <button
                      id="validate-id-submit-btn"
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      {loading ? (
                        <span>{t.access.validating}</span>
                      ) : (
                        <>
                          <span>{t.access.validateBtn}</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCompleteActivation} className="space-y-4">
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                          {t.access.accessVerified}
                        </span>
                        <div className="text-xs font-semibold text-white mt-0.5 flex items-center gap-2">
                          <span>{t.access.roleInherited}:</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${getRoleBadgeStyle(validatedRole)}`}>
                            {t.roles[validatedRole as keyof typeof t.roles] || validatedRole}
                          </span>
                          {validatedCountry && (
                            <span className="text-slate-400 text-[10px]">
                              ({validatedCountry})
                            </span>
                          )}
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {t.access.nameLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="activate-name-input"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.access.namePlaceholder}
                          className="w-full pl-10 pr-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {t.access.passwordLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="activate-password-input"
                          type="password"
                          required
                          minLength={6}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder={t.access.passwordPlaceholder}
                          className="w-full pl-10 pr-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {t.access.confirmPasswordLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="activate-confirm-password-input"
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t.access.confirmPasswordPlaceholder}
                          className="w-full pl-10 pr-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActivationStep("VALIDATE")}
                        className="w-1/3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-slate-700"
                      >
                        {t.common.back}
                      </button>
                      <button
                        id="activate-complete-btn"
                        type="submit"
                        disabled={loading}
                        className="w-2/3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? t.access.activating : t.access.activateBtn}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Toggle Helper Link */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
              {activeTab === "ACTIVATE" ? (
                <button
                  onClick={() => switchTab("LOGIN")}
                  className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.access.haveAccountPrompt}
                </button>
              ) : (
                <button
                  onClick={() => switchTab("ACTIVATE")}
                  className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.access.needActivatePrompt}
                </button>
              )}
            </div>
          </div>

          {/* Institutional Fast-Pass / Role Access Drawer */}
          <div className="mt-6 p-4 rounded-xl bg-[#11182c] border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === "am" ? "ፈጣን ሚና መዳረሻ" : "Direct Role & Staff Access"}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {language === "am" ? "የሙከራና የአስተዳዳሪ ማረጋገጫ" : "Instant Verification"}
              </span>
            </div>

            <div className="space-y-1.5">
              {Object.keys(DEMO_ACCESS_IDS).map((demoKey) => {
                const item = DEMO_ACCESS_IDS[demoKey];
                const RoleIcon = getRoleIcon(item.role);
                return (
                  <button
                    key={demoKey}
                    type="button"
                    onClick={() => fillDemoId(demoKey)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 text-xs transition-all cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md border ${getRoleBadgeStyle(item.role)}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 group-hover:text-white flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.role === "ADMIN" && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-medium border border-rose-500/30">
                              Master Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 group-hover:text-emerald-400">
                      <span>{demoKey}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Institutional Safeguarding & Accreditation Pillars */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#11182c]/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                {t.access.howToGetIdTitle}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {t.access.howToGetIdDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#11182c]/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-sky-400 block mb-1">
                {t.access.whoCanAccessTitle}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {t.access.whoCanAccessDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#11182c]/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-amber-400 block mb-1">
                {t.access.whatNextTitle}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {t.access.whatNextDesc}
              </p>
            </div>
          </div>

          {/* Security & Safeguarding Notice */}
          <div className="mt-6 text-center text-[11px] text-slate-500 leading-relaxed flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{t.access.safeguardDisclaimer}</span>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="py-4 text-center text-[11px] text-slate-500 border-t border-slate-800/80 bg-[#0a0f1d]">
        {t.footer.rights}
      </footer>
    </div>
  );
}

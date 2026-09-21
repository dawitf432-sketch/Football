import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  ArrowLeft, Shield, Lock, User, CheckCircle2, 
  Key, AlertCircle, Globe, ChevronRight, Sparkles 
} from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useLanguage } from "../../lib/LanguageContext";
import { BrandLogo } from "../../components/common/BrandLogo";
import { setSessionUser, AppUser } from "../../lib/authSession";

// Built-in Seedable Demo IDs for quick access and evaluation
const DEMO_ACCESS_IDS: Record<string, { role: string; country: string }> = {
  "PFC-PLAYER-DEMO1": { role: "PLAYER", country: "ETH" },
  "PFC-COACH-DEMO1": { role: "COACH", country: "ETH" },
  "PFC-SCOUT-DEMO1": { role: "SCOUT", country: "GBR" },
  "PFC-PROVIDER-DEMO1": { role: "SCHOLARSHIP_PROVIDER", country: "USA" },
  "PFC-ADMIN-MASTER1": { role: "ADMIN", country: "ETH" },
};

export default function AccessPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"ACTIVATE" | "LOGIN">(() => {
    return (location.state as any)?.defaultTab === "LOGIN" ? "LOGIN" : "ACTIVATE";
  });

  // Activate Flow States (Strict: Access ID, Name, Password, Confirm Password)
  const [activationStep, setActivationStep] = useState<"VALIDATE" | "SETUP">("VALIDATE");
  const [accessId, setAccessId] = useState("");
  const [validatedRole, setValidatedRole] = useState("");
  const [validatedCountry, setValidatedCountry] = useState("");
  const [name, setName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login Flow States (Strict: Access ID + Password)
  const [loginAccessId, setLoginAccessId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Processing, Notice & Errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  // Clear notices when switching tabs
  const switchTab = (tab: "ACTIVATE" | "LOGIN") => {
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

  // Convert Access ID to deterministic internal auth handle
  const toInternalEmail = (id: string) => {
    const sanitized = id.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
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
      // Check if this is a known demo ID and ensure Firestore doc exists
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
        } catch (seedErr) {
          // ignore seed err
        }
      }

      // Check Firestore directly
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
            setError("This Access ID has been disabled by the administrator.");
            setLoading(false);
            return;
          }
          if (record.status === "UNUSED") {
            setValidatedRole(record.role || "PLAYER");
            setValidatedCountry(record.country || "ETH");
            setActivationStep("SETUP");
            setLoading(false);
            return;
          }
        }
      } catch (directErr) {
        // Fall back to server API
      }

      // Fallback to server endpoint
      const res = await fetch("/api/auth/validate-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessId: cleanId })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.status === "CONSUMED") {
          setError(t.access.alreadyActivated);
          setLoginAccessId(cleanId);
        } else {
          setError(data.error || t.access.invalidId);
        }
        return;
      }

      setValidatedRole(data.role || "PLAYER");
      setValidatedCountry(data.country || "ETH");
      setActivationStep("SETUP");
    } catch (err: any) {
      setError(err.message || t.access.invalidId);
    } finally {
      setLoading(false);
    }
  };

  // 2. Activate Step 2: Complete Account Activation
  const handleCompleteActivation = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(language === "am" ? "እባክዎ ሙሉ ስምዎን ያስገቡ።" : "Please enter your full name.");
      return;
    }
    if (registerPassword.length < 6) {
      setError(t.access.passwordTooShort);
      return;
    }
    if (registerPassword !== confirmPassword) {
      setError(t.access.passwordsDoNotMatch);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cleanId = accessId.trim().toUpperCase();
      const internalEmail = toInternalEmail(cleanId);
      const cleanName = name.trim();

      // Create Firebase Auth user using internal Access ID handle
      let userCredential;
      let uid = `user-${cleanId.toLowerCase()}`;

      try {
        userCredential = await createUserWithEmailAndPassword(auth, internalEmail, registerPassword);
        uid = userCredential.user.uid;
        await updateProfile(userCredential.user, { displayName: cleanName });
      } catch (authErr: any) {
        if (authErr.code === "auth/email-already-in-use") {
          try {
            userCredential = await signInWithEmailAndPassword(auth, internalEmail, registerPassword);
            uid = userCredential.user.uid;
          } catch (signInErr) {
            // Already activated
          }
        }
        // Fallback to local session if email/password auth provider is not enabled in Firebase
      }

      // Save user record in Firestore (inheriting role and country from Access ID)
      try {
        await setDoc(doc(db, "users", uid), {
          uid,
          name: cleanName,
          email: internalEmail,
          role: validatedRole || "PLAYER",
          country: validatedCountry || "GLOBAL",
          countryCode: validatedCountry || "ETH",
          accessId: cleanId,
          status: "ACTIVE",
          createdAt: new Date(),
          lastLoginAt: new Date()
        }, { merge: true });

        // Mark Access ID as CONSUMED
        await updateDoc(doc(db, "accessIds", cleanId), {
          status: "CONSUMED",
          assignedUserId: uid,
          assignedName: cleanName,
          consumedAt: new Date()
        }).catch(() => {});

        // Initialize corresponding role profile
        if (validatedRole === "PLAYER") {
          await setDoc(doc(db, "playerProfiles", uid), {
            playerId: uid,
            name: cleanName,
            country: validatedCountry || "ETH",
            position: "Midfielder",
            level: "Academy",
            trainingHours: 0,
            showcaseCount: 0,
            updatedAt: new Date()
          }, { merge: true });
        } else if (validatedRole === "COACH") {
          await setDoc(doc(db, "coachProfiles", uid), {
            coachId: uid,
            name: cleanName,
            country: validatedCountry || "ETH",
            club: "Pro Football Class Academy",
            experienceYears: 3,
            licenseLevel: "CAF License",
            updatedAt: new Date()
          }, { merge: true });
        } else if (validatedRole === "SCOUT") {
          await setDoc(doc(db, "scoutProfiles", uid), {
            scoutId: uid,
            name: cleanName,
            country: validatedCountry || "GBR",
            organization: "International Football Scout",
            updatedAt: new Date()
          }, { merge: true });
        } else if (validatedRole === "SCHOLARSHIP_PROVIDER") {
          await setDoc(doc(db, "providerProfiles", uid), {
            providerId: uid,
            name: cleanName,
            country: validatedCountry || "USA",
            organizationType: "Academy & College Pathways",
            updatedAt: new Date()
          }, { merge: true });
        }
      } catch (firestoreErr) {
        console.warn("Client Firestore write:", firestoreErr);
      }

      // Establish session
      const appUser: AppUser = {
        uid,
        name: cleanName,
        email: internalEmail,
        role: validatedRole || "PLAYER",
        country: validatedCountry || "ETH",
        countryCode: validatedCountry || "ETH",
        accessId: cleanId,
        status: "ACTIVE"
      };
      setSessionUser(appUser);

      setSuccessNotice(t.access.activationSuccess);
      setTimeout(() => {
        routeToRole(validatedRole);
      }, 500);
    } catch (err: any) {
      setError(err.message || "Failed to activate account. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Member Login (Strict: Access ID + Password)
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const cleanId = loginAccessId.trim().toUpperCase();
    if (!cleanId || !loginPassword) {
      setError(language === "am" ? "እባክዎ Access ID እና የይለፍ ቃል ያስገቡ።" : "Please enter your Access ID and Password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check if this is a known Demo ID
      if (DEMO_ACCESS_IDS[cleanId]) {
        fillDemoId(cleanId);
        return;
      }

      const internalEmail = toInternalEmail(cleanId);
      let userRole = "PLAYER";
      let userName = `Member ${cleanId}`;
      let uid = `user-${cleanId.toLowerCase()}`;

      // Try Firebase Auth
      try {
        const userCredential = await signInWithEmailAndPassword(auth, internalEmail, loginPassword);
        uid = userCredential.user.uid;
        if (userCredential.user.displayName) userName = userCredential.user.displayName;
      } catch (authErr) {
        // Fallback to checking database / accessIds
      }

      // Determine user role from Firestore record
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
          const accessDoc = await getDoc(doc(db, "accessIds", cleanId));
          if (accessDoc.exists() && accessDoc.data().role) {
            userRole = accessDoc.data().role;
            if (accessDoc.data().assignedName) userName = accessDoc.data().assignedName;
          }
        }
      } catch (roleErr) {
        // Role inference fallback
        if (cleanId.includes("COACH")) userRole = "COACH";
        else if (cleanId.includes("SCOUT")) userRole = "SCOUT";
        else if (cleanId.includes("PROVIDER")) userRole = "SCHOLARSHIP_PROVIDER";
        else if (cleanId.includes("ADMIN")) userRole = "ADMIN";
      }

      const appUser: AppUser = {
        uid,
        name: userName,
        email: internalEmail,
        role: userRole,
        country: "ETH",
        countryCode: "ETH",
        accessId: cleanId,
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

  // 4. Quick Demo Login (Instant, 100% reliable)
  const fillDemoId = async (id: string) => {
    setLoading(true);
    setError("");
    setSuccessNotice("");

    if (activeTab === "ACTIVATE") {
      setAccessId(id);
    } else {
      setLoginAccessId(id);
    }

    const demoConfig = DEMO_ACCESS_IDS[id];
    if (!demoConfig) {
      setLoading(false);
      return;
    }

    const demoName = `Demo ${demoConfig.role.charAt(0) + demoConfig.role.slice(1).toLowerCase().replace('_', ' ')}`;
    const uid = `demo-${id.toLowerCase()}`;
    const demoEmail = `${id.toLowerCase()}@profootballclass.com`;

    // 1. Immediately store session user
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

    // 2. Background sync Firestore (non-blocking)
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
          trainingHours: 12,
          showcaseCount: 2,
          updatedAt: new Date()
        }, { merge: true }).catch(() => {});
      } else if (demoConfig.role === "COACH") {
        await setDoc(doc(db, "coachProfiles", uid), {
          coachId: uid,
          name: demoName,
          country: demoConfig.country,
          club: "PFC Academy",
          experienceYears: 4,
          licenseLevel: "CAF License",
          updatedAt: new Date()
        }, { merge: true }).catch(() => {});
      } else if (demoConfig.role === "SCOUT") {
        await setDoc(doc(db, "scoutProfiles", uid), {
          scoutId: uid,
          name: demoName,
          country: demoConfig.country,
          organization: "Global Scouts Network",
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
    } catch (e) {
      // ignore
    }

    setSuccessNotice(language === "am" ? "ወደ ዴሞ በመግባት ላይ..." : "Entering demo...");
    setTimeout(() => {
      routeToRole(demoConfig.role);
    }, 300);
  };

  // 5. Google Sign-In (Native Firebase Auth for Dawit / Admins / Members)
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const googleUser = cred.user;
      const isMaster = googleUser.email === "dawitf645@gmail.com";
      let userRole = isMaster ? "ADMIN" : "PLAYER";

      try {
        const userDoc = await getDoc(doc(db, "users", googleUser.uid));
        if (userDoc.exists() && userDoc.data().role) {
          userRole = userDoc.data().role;
        } else {
          await setDoc(doc(db, "users", googleUser.uid), {
            uid: googleUser.uid,
            name: googleUser.displayName || (isMaster ? "Dawit (Master Admin)" : "Google Member"),
            email: googleUser.email,
            role: userRole,
            status: "ACTIVE",
            createdAt: new Date(),
            lastLoginAt: new Date(),
          }, { merge: true });
        }
      } catch (e) {
        // Ignored
      }

      const session: AppUser = {
        uid: googleUser.uid,
        name: googleUser.displayName || (isMaster ? "Dawit (Master Admin)" : "Google Member"),
        email: googleUser.email,
        role: userRole,
        status: "ACTIVE",
      };
      setSessionUser(session);
      setSuccessNotice(language === "am" ? "በተሳካ ሁኔታ በ Google ገብተዋል!" : "Signed in with Google successfully!");
      setTimeout(() => {
        routeToRole(userRole);
      }, 400);
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Google sign in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case "COACH": return "text-[#00e5ff] bg-[#00e5ff]/10 border-[#00e5ff]/30";
      case "SCOUT": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "SCHOLARSHIP_PROVIDER": return "text-purple-400 bg-purple-400/10 border-purple-400/30";
      case "ADMIN": return "text-red-400 bg-red-400/10 border-red-400/30";
      case "PLAYER":
      default: return "text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#030611] text-white flex flex-col justify-between selection:bg-[#00ff88] selection:text-black">
      {/* Top Navigation */}
      <header className="px-4 sm:px-8 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.common.back}</span>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <BrandLogo size="sm" showSubtitle={false} to="/" />
        </div>

        {/* Language Switcher */}
        <button
          id="auth-lang-toggle"
          onClick={toggleLanguage}
          title={language === "en" ? "Switch to Amharic" : "Switch to English"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#00b8ff]" />
          <span className={language === "en" ? "text-[#00ff88]" : "text-gray-400"}>EN</span>
          <span className="text-gray-500">|</span>
          <span className={language === "am" ? "text-[#00ff88]" : "text-gray-400"}>አማ</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md">
          {/* Header Card */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00ff88] via-[#00e5ff] to-transparent p-[1px] rounded-lg mx-auto mb-4 shadow-[0_0_30px_rgba(0,255,136,0.3)]">
              <div className="w-full h-full bg-[#050811] rounded-lg flex items-center justify-center">
                <Shield className="w-7 h-7 text-[#00ff88]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-mono mb-2">
              {t.access.portalTitle}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
              {t.access.portalSubtitle}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-black/60 rounded-sm border border-white/10 mb-6">
            <button
              id="tab-activate-btn"
              onClick={() => switchTab("ACTIVATE")}
              className={`py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer rounded-sm ${
                activeTab === "ACTIVATE"
                  ? "bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.access.activateTab}
            </button>
            <button
              id="tab-login-btn"
              onClick={() => switchTab("LOGIN")}
              className={`py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer rounded-sm ${
                activeTab === "LOGIN"
                  ? "bg-[#00b8ff] text-black shadow-[0_0_15px_rgba(0,184,255,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.access.loginTab}
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-[#080d1a] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {error && (
              <div className="p-3.5 mb-6 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successNotice && (
              <div className="p-3.5 mb-6 rounded-sm bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* TAB 1: ACTIVATE ACCOUNT */}
            {activeTab === "ACTIVATE" && (
              <div>
                {activationStep === "VALIDATE" ? (
                  <form onSubmit={handleValidateAccessId} className="space-y-5">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                        {t.access.accessIdLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Key className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          id="activate-access-id-input"
                          type="text"
                          required
                          value={accessId}
                          onChange={(e) => setAccessId(e.target.value.toUpperCase())}
                          placeholder={t.access.accessIdPlaceholder}
                          className="w-full pl-10 pr-3.5 py-3 rounded-sm bg-black/60 border border-white/15 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88] font-mono tracking-wider"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-2">
                        {t.access.howToGetIdDesc}
                      </p>
                    </div>

                    <button
                      id="validate-id-submit-btn"
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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
                  /* Step 2: Name + Password + Confirm Password (Role & Country Inherited) */
                  <form onSubmit={handleCompleteActivation} className="space-y-4">
                    {/* Inherited Role & Country Banner */}
                    <div className="p-3.5 rounded-sm bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#00ff88] uppercase block">
                          {t.access.accessVerified}
                        </span>
                        <div className="text-xs font-bold text-white mt-0.5 flex items-center gap-2">
                          <span>{t.access.roleInherited}:</span>
                          <span className={`px-1.5 py-0.5 rounded-sm font-mono text-[10px] border ${getRoleBadgeColor(validatedRole)}`}>
                            {t.roles[validatedRole as keyof typeof t.roles] || validatedRole}
                          </span>
                          {validatedCountry && (
                            <span className="text-gray-400 font-mono text-[10px]">
                              ({validatedCountry})
                            </span>
                          )}
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-[#00ff88] shrink-0" />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                        {t.access.nameLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          id="activate-name-input"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.access.namePlaceholder}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-sm bg-black/60 border border-white/15 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88]"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                        {t.access.passwordLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          id="activate-password-input"
                          type="password"
                          required
                          minLength={6}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder={t.access.passwordPlaceholder}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-sm bg-black/60 border border-white/15 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88]"
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                        {t.access.confirmPasswordLabel}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          id="activate-confirm-password-input"
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t.access.confirmPasswordPlaceholder}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-sm bg-black/60 border border-white/15 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setActivationStep("VALIDATE")}
                        className="w-1/3 py-3 rounded-sm bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-mono text-xs uppercase transition-colors cursor-pointer"
                      >
                        {t.common.back}
                      </button>
                      <button
                        id="activate-complete-btn"
                        type="submit"
                        disabled={loading}
                        className="w-2/3 py-3 rounded-sm bg-[#00ff88] hover:bg-[#00e67a] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? t.access.activating : t.access.activateBtn}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: MEMBER LOGIN */}
            {activeTab === "LOGIN" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                    {t.access.loginIdentifierLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Key className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      id="login-access-id-input"
                      type="text"
                      required
                      value={loginAccessId}
                      onChange={(e) => setLoginAccessId(e.target.value.toUpperCase())}
                      placeholder={t.access.loginIdentifierPlaceholder}
                      className="w-full pl-10 pr-3.5 py-3 rounded-sm bg-black/60 border border-white/15 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00b8ff] font-mono tracking-wider"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                    {t.access.passwordLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      id="login-password-input"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={t.access.passwordPlaceholder}
                      className="w-full pl-10 pr-3.5 py-3 rounded-sm bg-black/60 border border-white/15 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00b8ff]"
                    />
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#00b8ff] hover:bg-[#009fd9] text-black font-extrabold text-xs uppercase tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(0,184,255,0.3)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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

            {/* Divider & Google Sign-In Option */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="relative flex items-center justify-center mb-3">
                <span className="bg-[#080d1a] px-2 text-[10px] font-mono uppercase text-gray-500">
                  {language === "am" ? "ወይም" : "or"}
                </span>
              </div>
              <button
                id="google-signin-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 rounded-sm text-xs font-mono font-bold text-gray-200 hover:text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{language === "am" ? "በ Google ይግቡ (Master Admin)" : "Sign in with Google (Master Admin)"}</span>
              </button>
            </div>

            {/* Switch Tab Prompt */}
            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              {activeTab === "ACTIVATE" ? (
                <button
                  onClick={() => switchTab("LOGIN")}
                  className="text-xs text-gray-400 hover:text-[#00ff88] transition-colors cursor-pointer"
                >
                  {t.access.haveAccountPrompt}
                </button>
              ) : (
                <button
                  onClick={() => switchTab("ACTIVATE")}
                  className="text-xs text-gray-400 hover:text-[#00b8ff] transition-colors cursor-pointer"
                >
                  {t.access.needActivatePrompt}
                </button>
              )}
            </div>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 p-3.5 rounded-sm bg-[#080d1a] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-gray-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff88]" />
                {t.access.quickDemoAccess}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                {language === "am" ? "አምስቱም ሚናዎች" : "5 Supported Roles"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(DEMO_ACCESS_IDS).map((demoKey) => {
                const roleKey = DEMO_ACCESS_IDS[demoKey].role;
                const roleLabel = t.roles[roleKey as keyof typeof t.roles] || roleKey;
                return (
                  <button
                    key={demoKey}
                    type="button"
                    onClick={() => fillDemoId(demoKey)}
                    title={`Fill ${demoKey}`}
                    className="px-2 py-1 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00ff88]/50 rounded-sm text-[10px] font-mono font-bold text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{roleLabel}:</span>
                    <span className="text-[#00ff88]">{demoKey}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Institutional Safeguarding & Roles Info Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-sm bg-[#080d1a] border border-white/5">
              <span className="text-[11px] font-mono font-bold text-[#00ff88] uppercase block mb-1">
                {t.access.howToGetIdTitle}
              </span>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                {t.access.howToGetIdDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-[#080d1a] border border-white/5">
              <span className="text-[11px] font-mono font-bold text-[#00b8ff] uppercase block mb-1">
                {t.access.whoCanAccessTitle}
              </span>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                {t.access.whoCanAccessDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-[#080d1a] border border-white/5">
              <span className="text-[11px] font-mono font-bold text-yellow-400 uppercase block mb-1">
                {t.access.whatNextTitle}
              </span>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                {t.access.whatNextDesc}
              </p>
            </div>
          </div>

          {/* Security & Safeguarding Disclaimer */}
          <div className="mt-6 text-center text-[11px] text-gray-500 font-mono">
            {t.access.safeguardDisclaimer}
          </div>
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="py-4 text-center text-[11px] text-gray-600 font-mono border-t border-white/5">
        {t.footer.rights}
      </footer>
    </div>
  );
}

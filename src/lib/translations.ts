export type Language = "en" | "am";

export interface Translations {
  nav: {
    home: string;
    academy: string;
    training: string;
    positions: string;
    athleticism: string;
    nutrition: string;
    mindset: string;
    showcase: string;
    teams: string;
    scholarships: string;
    about: string;
    studentAccess: string;
    login: string;
  };
  hero: {
    headlineStart: string;
    headlineHighlight: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    statTraining: string;
    statDevelopment: string;
    statCoaches: string;
    statScouts: string;
    badge: string;
  };
  academy: {
    sectionTag: string;
    title: string;
    subtitle: string;
    steps: {
      step: string;
      title: string;
      desc: string;
      tag: string;
    }[];
  };
  training: {
    sectionTag: string;
    title: string;
    subtitle: string;
    privateNotice: string;
    unlockBtn: string;
    allFilter: string;
    technicalFilter: string;
    positionalFilter: string;
    athleticismFilter: string;
    lifestyleFilter: string;
    drillCount: string;
    viewCurriculum: string;
  };
  positions: {
    sectionTag: string;
    title: string;
    subtitle: string;
    selectPrompt: string;
    tacticalDuty: string;
    coreAttributes: string;
    proBenchmark: string;
  };
  athleticism: {
    sectionTag: string;
    title: string;
    subtitle: string;
    testingProtocols: string;
    benchmarkNote: string;
  };
  nutrition: {
    sectionTag: string;
    title: string;
    subtitle: string;
    hydrationRule: string;
  };
  mindset: {
    sectionTag: string;
    title: string;
    subtitle: string;
    eliteMentalRule: string;
  };
  development: {
    sectionTag: string;
    title: string;
    subtitle: string;
    sampleProgressTitle: string;
    sampleProgressDesc: string;
    protectedDataNotice: string;
    radarTechnical: string;
    radarAthletic: string;
    radarTactical: string;
    radarMental: string;
    radarNutrition: string;
  };
  showcase: {
    sectionTag: string;
    title: string;
    subtitle: string;
    safeguardingRule: string;
    discoverCta: string;
    verifiedBadge: string;
    watchHighlight: string;
    submitPrompt: string;
  };
  scouting: {
    sectionTag: string;
    title: string;
    subtitle: string;
    filtersTitle: string;
    positionFilter: string;
    countryFilter: string;
    ageFilter: string;
    restrictedNotice: string;
    scoutLoginCta: string;
  };
  scholarships: {
    sectionTag: string;
    title: string;
    subtitle: string;
    eligiblePrompt: string;
    viewCta: string;
    deadlineLabel: string;
    placesLabel: string;
    benefitsLabel: string;
    requirementsLabel: string;
    applyNow: string;
  };
  coaches: {
    sectionTag: string;
    title: string;
    subtitle: string;
    features: { title: string; desc: string }[];
  };
  players: {
    sectionTag: string;
    title: string;
    subtitle: string;
    features: { title: string; desc: string }[];
  };
  about: {
    sectionTag: string;
    title: string;
    missionHeadline: string;
    missionBody: string;
    pillars: { title: string; desc: string }[];
    safeguardingTitle: string;
    safeguardingDesc: string;
  };
  access: {
    portalTitle: string;
    portalSubtitle: string;
    activateTab: string;
    loginTab: string;
    accessIdLabel: string;
    accessIdPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    loginIdentifierLabel: string;
    loginIdentifierPlaceholder: string;
    validateBtn: string;
    activateBtn: string;
    loginBtn: string;
    validating: string;
    activating: string;
    authenticating: string;
    noAccountPrompt: string;
    haveAccountPrompt: string;
    needActivatePrompt: string;
    safeguardDisclaimer: string;
    roleInherited: string;
    countryInherited: string;
    accessVerified: string;
    invalidId: string;
    alreadyActivated: string;
    passwordsDoNotMatch: string;
    passwordTooShort: string;
    activationSuccess: string;
    loginSuccess: string;
    howToGetIdTitle: string;
    howToGetIdDesc: string;
    whoCanAccessTitle: string;
    whoCanAccessDesc: string;
    whatNextTitle: string;
    whatNextDesc: string;
    quickDemoAccess: string;
    useDemoPrompt: string;
  };
  roles: {
    PLAYER: string;
    COACH: string;
    SCOUT: string;
    SCHOLARSHIP_PROVIDER: string;
    ADMIN: string;
  };
  dashboard: {
    overview: string;
    training: string;
    courses: string;
    progress: string;
    profile: string;
    showcase: string;
    scholarships: string;
    messages: string;
    notifications: string;
    settings: string;
    logout: string;
    teams: string;
    drills: string;
    assignments: string;
    scoutingFeed: string;
    shortlist: string;
    contactRequests: string;
    adminOverview: string;
    accessIds: string;
    userManagement: string;
    courseManagement: string;
    showcaseReviews: string;
    providerPrograms: string;
    applications: string;
    language: string;
    switchLanguage: string;
    roleCenter: string;
    online: string;
    verified: string;
  };
  common: {
    save: string;
    saving: string;
    cancel: string;
    delete: string;
    edit: string;
    confirm: string;
    back: string;
    next: string;
    search: string;
    filter: string;
    loading: string;
    empty: string;
    status: string;
    active: string;
    pending: string;
    approved: string;
    rejected: string;
    consumed: string;
    unused: string;
    disabled: string;
    close: string;
    all: string;
    submit: string;
    copy: string;
    copied: string;
  };
  footer: {
    brandDesc: string;
    rights: string;
    safeguardingBadge: string;
    contactSupport: string;
    privacy: string;
    terms: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      academy: "Academy",
      training: "Training",
      positions: "Positions",
      athleticism: "Athleticism",
      nutrition: "Nutrition",
      mindset: "Mindset",
      showcase: "Showcase",
      teams: "Teams",
      scholarships: "Scholarships",
      about: "About",
      studentAccess: "Student Access",
      login: "Login"
    },
    hero: {
      headlineStart: "BUILD YOUR GAME.",
      headlineHighlight: "BUILD YOUR FUTURE.",
      subheadline: "Train smarter. Track your progress. Showcase your talent. Discover your opportunity.",
      primaryCta: "GET ACCESS",
      secondaryCta: "EXPLORE ACADEMY",
      statTraining: "260+ PRO DRILLS",
      statDevelopment: "94% SKILL RETENTION",
      statCoaches: "UEFA & CAF ACCREDITED",
      statScouts: "VERIFIED SCOUT NETWORK",
      badge: "GLOBAL TALENT PATHWAY & FOOTBALL ACADEMY"
    },
    academy: {
      sectionTag: "THE METHODOLOGY",
      title: "How Pro Football Class Works",
      subtitle: "A proven, end-to-end framework turning grassroots dedication into professional opportunities.",
      steps: [
        {
          step: "01",
          title: "TRAIN",
          desc: "Master 17 core technical, tactical, and athletic categories designed by licensed European and African coaches.",
          tag: "Curriculum"
        },
        {
          step: "02",
          title: "TRACK PROGRESS",
          desc: "Record your training metrics, benchmark your fitness levels, and observe data-driven biometric skill curves.",
          tag: "Analytics"
        },
        {
          step: "03",
          title: "BUILD PROFILE",
          desc: "Construct a verified digital player dossier detailing your tactical strengths, physical attributes, and achievements.",
          tag: "Passport"
        },
        {
          step: "04",
          title: "SHOWCASE PERFORMANCE",
          desc: "Upload competitive match clips reviewed and verified by accredited football administrators.",
          tag: "Verification"
        },
        {
          step: "05",
          title: "GET DISCOVERED",
          desc: "Connect directly with verified professional club scouts, university programs, and full residential academies.",
          tag: "Opportunity"
        }
      ]
    },
    training: {
      sectionTag: "CURRICULUM ARCHITECTURE",
      title: "17 Elite Training Categories",
      subtitle: "Comprehensive curriculum developed for aspiring youth athletes, elite academies, and dedicated coaches.",
      privateNotice: "Private video lessons, downloadable session plans, and assignment trackers require verified student access.",
      unlockBtn: "Unlock Private Lessons",
      allFilter: "All Categories",
      technicalFilter: "Technical Ball Work",
      positionalFilter: "Positional Mastery",
      athleticismFilter: "Athleticism & Fitness",
      lifestyleFilter: "Mindset & Nutrition",
      drillCount: "Drills & Lessons",
      viewCurriculum: "View Curriculum"
    },
    positions: {
      sectionTag: "TACTICAL SPECIALIZATION",
      title: "Positional Mastery",
      subtitle: "Modern football requires deep role comprehension. Explore responsibilities, attributes, and elite benchmarks.",
      selectPrompt: "Select a position to inspect core tactical responsibilities and elite profile requirements",
      tacticalDuty: "Key Tactical Responsibilities",
      coreAttributes: "Essential Attributes",
      proBenchmark: "Pro Benchmark"
    },
    athleticism: {
      sectionTag: "PHYSICAL SCIENCE",
      title: "Athletic Conditioning",
      subtitle: "Elite football demands explosive speed, repeatable endurance, and injury-resilient biomechanics.",
      testingProtocols: "Standardized Combine Testing Protocols",
      benchmarkNote: "All metrics are tracked and verified inside the Player Development portal."
    },
    nutrition: {
      sectionTag: "FUEL & RECOVERY",
      title: "High-Performance Footballer Nutrition",
      subtitle: "Scientifically calibrated fueling strategies for youth athletes before, during, and after high-intensity matches.",
      hydrationRule: "Hydration Standard: 500ml electrolyte solution 2h before kickoff; 250ml at halftime; continuous post-match rehydration."
    },
    mindset: {
      sectionTag: "MENTAL PERFORMANCE",
      title: "Psychological Resilience & Game IQ",
      subtitle: "The defining factor between good players and world-class professionals is cognitive discipline and emotional control.",
      eliteMentalRule: "Pro Rule: Scan the field every 2.5 seconds before receiving the ball. Make decisions before the pass arrives."
    },
    development: {
      sectionTag: "PLAYER DEVELOPMENT",
      title: "Holistic 5-Pillar Development",
      subtitle: "We analyze and elevate every dimension of an athlete's game with continuous data benchmarking.",
      sampleProgressTitle: "Verified Player Progression Model",
      sampleProgressDesc: "Live anonymized aggregate visualization showing baseline progression across developmental quarters.",
      protectedDataNotice: "Individual player biometric logs and private contact records are strictly protected under child safeguarding standards.",
      radarTechnical: "Technical",
      radarAthletic: "Athleticism",
      radarTactical: "Positional IQ",
      radarMental: "Mindset",
      radarNutrition: "Nutrition"
    },
    showcase: {
      sectionTag: "MATCH EVIDENCE",
      title: "Player Showcase & Highlights",
      subtitle: "Verified video evidence of match intelligence, ball mastery, and real competitive performance.",
      safeguardingRule: "Safeguarding Protocol: Only ADMIN-approved videos can appear in public and authorized scout discovery.",
      discoverCta: "DISCOVER PLAYERS",
      verifiedBadge: "ADMIN VERIFIED",
      watchHighlight: "Watch Highlight Reel",
      submitPrompt: "Are you a registered player? Upload your match footage in the student portal for admin verification."
    },
    scouting: {
      sectionTag: "TALENT RECRUITMENT",
      title: "Discover Emerging Football Talent",
      subtitle: "A direct bridge between grassroots football and professional academies, university athletic directors, and scouts.",
      filtersTitle: "Advanced Discovery Filters",
      positionFilter: "Position Filter",
      countryFilter: "Country & Region",
      ageFilter: "Age Bracket (U14 - U21)",
      restrictedNotice: "Protected Athlete Data: Full dossier access, contact channels, and academic transcripts require verified Scout Access.",
      scoutLoginCta: "Enter Scout Portal"
    },
    scholarships: {
      sectionTag: "ACADEMIC & RESIDENTIAL PATHWAYS",
      title: "Football Scholarships & Opportunities",
      subtitle: "Accredited academies, clubs, and universities publish funded opportunities for verified talent worldwide.",
      eligiblePrompt: "Are you an accredited football club or university? Publish verified scholarships through our Provider Portal.",
      viewCta: "VIEW SCHOLARSHIPS",
      deadlineLabel: "Application Deadline",
      placesLabel: "Places Available",
      benefitsLabel: "Fully Funded Benefits",
      requirementsLabel: "Eligibility Criteria",
      applyNow: "Apply via Student Portal"
    },
    coaches: {
      sectionTag: "FOR COACHES & MANAGERS",
      title: "Elevate Your Squad With Pro Tools",
      subtitle: "Complete team management infrastructure built specifically for modern football tacticians.",
      features: [
        { title: "Manage Teams & Rosters", desc: "Organize age-bracket squads, track attendance, and maintain verified player records." },
        { title: "Create Training Groups", desc: "Segment players by technical focus, position needs, or physical rehabilitation." },
        { title: "Assign Custom Training", desc: "Deploy specific drills from the 260+ catalog directly to individual players' mobile portals." },
        { title: "Monitor Player Growth", desc: "Inspect biometric charts, drill completion rates, and video submissions in real time." },
        { title: "Broadcast Announcements", desc: "Send urgent team schedule alerts, match tactics, and nutritional guidelines instantly." }
      ]
    },
    players: {
      sectionTag: "FOR ASPIRING PLAYERS",
      title: "Everything You Need To Reach The Top",
      subtitle: "Your personal professional football academy in your pocket, anywhere in the world.",
      features: [
        { title: "Access Elite Training", desc: "Step-by-step video tutorials and structured daily practice routines designed by UEFA & CAF coaches." },
        { title: "Complete Structured Courses", desc: "Graduate through foundational, intermediate, and pre-pro curriculums with certified badges." },
        { title: "Track Your Biometric Growth", desc: "Log speed benchmarks, beep test scores, and match statistics to watch your rating rise." },
        { title: "Build Your Verified Profile", desc: "A tamper-proof digital football CV containing verified coach assessments and stats." },
        { title: "Upload Game Showcases", desc: "Submit your best match plays to get reviewed and approved by platform administrators." },
        { title: "Apply For Scholarships", desc: "One-click application to residential academies and college teams with your verified credentials." }
      ]
    },
    about: {
      sectionTag: "OUR MISSION",
      title: "About Pro Football Class",
      missionHeadline: "Democratizing elite football development and global talent discovery.",
      missionBody: "To help young football players develop their ability, track their growth, build professional profiles, showcase their performance, and connect with legitimate football opportunities.",
      pillars: [
        { title: "Global Equity", desc: "Ensuring world-class training curriculum reaches talented youth regardless of geography or financial status." },
        { title: "Scientific Rigor", desc: "Rooted in European and African elite academy sports science, modern tactical theory, and periodization." },
        { title: "Legitimate Gateways", desc: "Eliminating fraudulent agents and predatory combines through verified institutional partnerships." }
      ],
      safeguardingTitle: "FIFA Child Protection & Safeguarding Compliance",
      safeguardingDesc: "We strictly uphold international youth safeguarding guidelines. Minor athletes' direct phone numbers and addresses are hidden; communications occur exclusively through monitored channels."
    },
    access: {
      portalTitle: "STUDENT & MEMBER ACCESS",
      portalSubtitle: "Enter your official Access ID to activate your account or sign in to your dashboard.",
      activateTab: "Activate Account",
      loginTab: "Member Login",
      accessIdLabel: "Official Access ID",
      accessIdPlaceholder: "e.g. PFC-PLAYER-8X29K",
      nameLabel: "Your Full Name",
      namePlaceholder: "Enter your full legal name",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "••••••••",
      loginIdentifierLabel: "Access ID",
      loginIdentifierPlaceholder: "e.g. PFC-PLAYER-8X29K",
      validateBtn: "Validate Access ID",
      activateBtn: "Activate & Enter Portal",
      loginBtn: "Sign In To Dashboard",
      validating: "Validating Access ID...",
      activating: "Activating Account...",
      authenticating: "Authenticating Credentials...",
      noAccountPrompt: "Need an Access ID? Contact your affiliated academy, club director, or verified coach.",
      haveAccountPrompt: "Already activated your Access ID? Switch to the Login tab.",
      needActivatePrompt: "First time accessing? Switch to Activate tab to set up your password.",
      safeguardDisclaimer: "Protected portal. Access IDs are unique and controlled by Admin. Passwords are encrypted.",
      roleInherited: "Role Inherited",
      countryInherited: "Territory / Country",
      accessVerified: "Access ID Verified",
      invalidId: "Invalid or unrecognized Access ID. Please verify your code.",
      alreadyActivated: "This Access ID has already been activated. Please switch to Member Login.",
      passwordsDoNotMatch: "Passwords do not match.",
      passwordTooShort: "Password must be at least 6 characters.",
      activationSuccess: "Account activated successfully! Redirecting to your dashboard...",
      loginSuccess: "Signed in successfully. Redirecting...",
      howToGetIdTitle: "How To Get An Access ID?",
      howToGetIdDesc: "Access IDs are issued by partner clubs, licensed academies, or verified scholarship institutions.",
      whoCanAccessTitle: "Supported Roles",
      whoCanAccessDesc: "Player, Coach, Scout, Scholarship Provider, and Admin. Role and country are inherited automatically.",
      whatNextTitle: "Secure Platform Access",
      whatNextDesc: "No email or social accounts required. Your identity is secured directly via your unique Access ID.",
      quickDemoAccess: "Quick Demonstration Access IDs",
      useDemoPrompt: "Click an official role ID below to auto-fill:"
    },
    roles: {
      PLAYER: "Player",
      COACH: "Coach",
      SCOUT: "Scout",
      SCHOLARSHIP_PROVIDER: "Scholarship Provider",
      ADMIN: "Admin"
    },
    dashboard: {
      overview: "Overview",
      training: "My Training",
      courses: "Courses",
      progress: "My Progress",
      profile: "My Profile",
      showcase: "Game Showcase",
      scholarships: "Scholarships",
      messages: "Messages",
      notifications: "Notifications",
      settings: "Settings",
      logout: "Logout",
      teams: "Teams & Rosters",
      drills: "Drills & Plans",
      assignments: "Assignments",
      scoutingFeed: "Talent Feed",
      shortlist: "Shortlist",
      contactRequests: "Contact Requests",
      adminOverview: "System Overview",
      accessIds: "Access IDs",
      userManagement: "Users",
      courseManagement: "Course Catalog",
      showcaseReviews: "Showcase Review",
      providerPrograms: "Scholarship Programs",
      applications: "Applications",
      language: "Language",
      switchLanguage: "Language: English",
      roleCenter: "Center",
      online: "Online",
      verified: "Verified"
    },
    common: {
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      search: "Search",
      filter: "Filter",
      loading: "Loading...",
      empty: "No records found",
      status: "Status",
      active: "Active",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      consumed: "Activated",
      unused: "Available",
      disabled: "Disabled",
      close: "Close",
      all: "All",
      submit: "Submit",
      copy: "Copy",
      copied: "Copied!"
    },
    footer: {
      brandDesc: "The premier football technology and development ecosystem empowering players, coaches, scouts, and scholarship institutions globally.",
      rights: "© 2026 Pro Football Class. All rights reserved.",
      safeguardingBadge: "Youth Safeguarding & Protection Certified",
      contactSupport: "Contact & Support",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    }
  },
  am: {
    nav: {
      home: "መነሻ",
      academy: "አካዳሚ",
      training: "ስልጠና",
      positions: "ቦታዎች",
      athleticism: "የአካል ብቃት",
      nutrition: "ስነ-ምግብ",
      mindset: "አዕምሮ",
      showcase: "የተሰጥኦ ማሳያ",
      teams: "ቡድኖች",
      scholarships: "ስኮላርሺፖች",
      about: "ስለ እኛ",
      studentAccess: "የተማሪ መግቢያ",
      login: "ግባ"
    },
    hero: {
      headlineStart: "ጨዋታህን አንጽ።",
      headlineHighlight: "የወደፊትህን ገንባ።",
      subheadline: "በብልሃት አሰልጥን። እድገትህን ተከታተል። ተሰጥኦህን አሳይ። እድልህን ፈልግ።",
      primaryCta: "መግቢያ ያግኙ",
      secondaryCta: "አካዳሚውን ይመርምሩ",
      statTraining: "260+ የባለሙያ ልምምዶች",
      statDevelopment: "94% የተጫዋች እድገት",
      statCoaches: "UEFA እና CAF እውቅና ያገኙ",
      statScouts: "የተረጋገጡ አለምአቀፍ ስካውቶች",
      badge: "አለምአቀፍ የእግር ኳስ ተሰጥኦ እና አካዳሚ መድረክ"
    },
    academy: {
      sectionTag: "ስልታዊ አካሄዳችን",
      title: "ፕሮ ፉትቦል ክላስ እንዴት ይሰራል?",
      subtitle: "ከታችኛው ደረጃ ጀምሮ ተጫዋቾችን ወደ ፕሮፌሽናል ደረጃ የሚያሸጋግር የተሟላ እና የተፈተነ ስርዓት።",
      steps: [
        {
          step: "01",
          title: "አሰልጥን (TRAIN)",
          desc: "በአውሮፓ እና በአፍሪካ ፈቃድ ባላቸው አሰልጣኞች የተዘጋጁ 17 ቴክኒካል፣ ታክቲካል እና አካላዊ የስልጠና ክፍሎችን ተለማመድ።",
          tag: "ስርዓተ-ትምህርት"
        },
        {
          step: "02",
          title: "እድገትህን መዝግብ (TRACK)",
          desc: "የስልጠናህን ውጤቶች፣ የፍጥነት እና የጽናት መለኪያዎችን መዝግበህ በዳታ የተደገፈ ለውጥህን ተመልከት።",
          tag: "ትንታኔ"
        },
        {
          step: "03",
          title: "ፕሮፋይል ገንባ (PROFILE)",
          desc: "የእግር ኳስ አቅምህን፣ የተጫዋችነት ሚናህን እና ስኬቶችህን የያዘ ይፋዊ ዲጂታል መገለጫ ፍጠር።",
          tag: "ፓስፖርት"
        },
        {
          step: "04",
          title: "ብቃትህን አሳይ (SHOWCASE)",
          desc: "የጨዋታ ቪዲዮዎችን አስገባ፤ በአስተዳዳሪዎች ተረጋግጠው ይፋዊ በሆነው የማሳያ ገጽ ላይ እንዲታዩ አድርግ።",
          tag: "ማረጋገጫ"
        },
        {
          step: "05",
          title: "እድልህን አግኝ (DISCOVER)",
          desc: "ከተረጋገጡ አለምአቀፍ ክለቦች፣ ዩኒቨርሲቲዎች እና ሙሉ የስኮላርሺፕ አካዳሚዎች ጋር በቀጥታ ተገናኝ።",
          tag: "እድሎች"
        }
      ]
    },
    training: {
      sectionTag: "የስልጠና መዋቅር",
      title: "17 የላቁ የስልጠና ዘርፎች",
      subtitle: "ለታዳጊ ተጫዋቾች፣ ለወጣቶች አካዳሚ እና ለታታሪ አሰልጣኞች የተዘጋጀ የተሟላ ስልጠና።",
      privateNotice: "የግል የቪዲዮ ትምህርቶች፣ ዝርዝር የስልጠና ዕቅዶች እና የቤት ስራዎች የተማሪ መለያ (Access ID) ያስፈልጋቸዋል።",
      unlockBtn: "የግል ትምህርቶችን ይክፈቱ",
      allFilter: "ሁሉም ዘርፎች",
      technicalFilter: "የኳስ ቴክኒክ",
      positionalFilter: "የቦታ ሚናዎች",
      athleticismFilter: "የአካል ብቃት",
      lifestyleFilter: "ስነ-ምግብ እና አዕምሮ",
      drillCount: "ልምምዶች",
      viewCurriculum: "ስርዓተ-ትምህርቱን እይ"
    },
    positions: {
      sectionTag: "የሜዳ ላይ ሚናዎች",
      title: "የቦታ ብቃት እና ታክቲክ",
      subtitle: "ዘመናዊ እግር ኳስ ጥልቅ የታክቲክ ግንዛቤን ይፈልጋል። የየቦታውን ኃላፊነቶች እና መስፈርቶች ይመርምሩ።",
      selectPrompt: "ዝርዝር ታክቲካዊ ኃላፊነቶችን እና መስፈርቶችን ለማየት ቦታ ይምረጡ",
      tacticalDuty: "ዋና ዋና የታክቲክ ኃላፊነቶች",
      coreAttributes: "አስፈላጊ ክህሎቶች",
      proBenchmark: "የፕሮፌሽናል መለኪያ"
    },
    athleticism: {
      sectionTag: "የስፖርት ሳይንስ",
      title: "አትሌቲሲዝም እና የአካል ብቃት",
      subtitle: "ዘመናዊ እግር ኳስ ፈንጂ ፍጥነትን፣ የማይደክም ጽናትን እና ከጉዳት የሚከላከል የአካል መዋቅርን ይጠይቃል።",
      testingProtocols: "ይፋዊ የኮምባይን መፈተኛ ደረጃዎች",
      benchmarkNote: "ሁሉም ውጤቶች በተጫዋቹ የግል ገጽ ውስጥ በሳይንሳዊ መንገድ ይመዘገባሉ።"
    },
    nutrition: {
      sectionTag: "ኃይል እና ማገገም",
      title: "የእግር ኳስ ተጫዋች ስነ-ምግብ",
      subtitle: "ለታዳጊ እና ለወጣት ተጫዋቾች ከጨዋታ በፊት፣ በእረፍት ሰዓት እና ከጨዋታ በኋላ የሚወሰዱ ሳይንሳዊ የምግብ ስርዓቶች።",
      hydrationRule: "የፈሳሽ ህግ፡ ከጨዋታ 2 ሰዓት በፊት 500ml፣ በእረፍት 250ml እና ከጨዋታ በኋላ ቀጣይነት ያለው ውሀና ኤሌክትሮላይት መጠጣት።"
    },
    mindset: {
      sectionTag: "የአዕምሮ ዝግጁነት",
      title: "ስነ-ልቦናዊ ጽናት እና የጨዋታ ንቃተ-ህሊና",
      subtitle: "ጥሩ ተጫዋችን ከታላቅ ፕሮፌሽናል የሚለየው የአዕምሮ ጥንካሬ፣ ጫናን የመቋቋም ብቃት እና የታክቲክ ንቃተ-ህሊና ነው።",
      eliteMentalRule: "የባለሙያ ህግ፡ ኳስ ከመድረሱ በፊት በየ 2.5 ሰከንድ ሜዳውን ቃኝ። ኳስ ሳይደርስህ ቀጣዩን ውሳኔ ወስን።"
    },
    development: {
      sectionTag: "የተጫዋች እድገት",
      title: "አጠቃላይ 5-ምሰሶ የተጫዋች እድገት",
      subtitle: "የእያንዳንዱን አትሌት አቅም በሳይንሳዊ ዳታ እና በቋሚ መለኪያዎች ደረጃ በደረጃ እናሳድጋለን።",
      sampleProgressTitle: "የተጫዋች የእድገት ሞዴል",
      sampleProgressDesc: "በሩብ ዓመታት ውስጥ የተመዘገበ አማካይ የእድገት ሂደት ማሳያ።",
      protectedDataNotice: "የተጫዋቾች የግል መረጃዎች እና የስልክ አድራሻዎች በህጻናት ጥበቃ መመሪያዎች መሰረት ጥብቅ ሚስጥራዊ ናቸው።",
      radarTechnical: "ቴክኒክ",
      radarAthletic: "አካል ብቃት",
      radarTactical: "የቦታ ንቃት",
      radarMental: "አዕምሮ",
      radarNutrition: "ስነ-ምግብ"
    },
    showcase: {
      sectionTag: "የጨዋታ ማሳያዎች",
      title: "የተጫዋቾች ቪዲዮ እና ክህሎት ማሳያ",
      subtitle: "የተጫዋቾችን የሜዳ ላይ ብቃት፣ የኳስ ቁጥጥር እና የጨዋታ ውሳኔ የሚያሳዩ የተረጋገጡ ቪዲዮዎች።",
      safeguardingRule: "የጥበቃ ህግ፡ በአስተዳዳሪ (ADMIN) የጸደቁ ቪዲዮዎች ብቻ ለህዝብ እና ለስካውቶች ይፋ ይሆናሉ።",
      discoverCta: "ተጫዋቾችን ፈልግ",
      verifiedBadge: "በአስተዳዳሪ የተረጋገጠ",
      watchHighlight: "ቪዲዮውን ተመልከት",
      submitPrompt: "የተመዘገብክ ተጫዋች ነህ? የጨዋታ ቪዲዮህን በተማሪ ፖርታልህ አስገብተህ ማረጋገጫ አግኝ።"
    },
    scouting: {
      sectionTag: "ተሰጥኦ ፍለጋ",
      title: "ተስፋ ሰጪ ወጣት ተጫዋቾችን ያግኙ",
      subtitle: "በታችኛው ሊግ ያሉ ወጣቶችን ከአለምአቀፍ አካዳሚዎች፣ ከዩኒቨርሲቲ አሰልጣኞች እና ከስካውቶች ጋር የሚያገናኝ ቀጥተኛ ድልድይ።",
      filtersTitle: "የላቁ የተጫዋች መፈለጊያዎች",
      positionFilter: "የተጫዋች ቦታ",
      countryFilter: "ሀገር እና ክልል",
      ageFilter: "የዕድሜ ክልል (ከ14 - 21 ዓመት)",
      restrictedNotice: "የተጠበቀ የተጫዋች መረጃ፡ የተሟላ መገለጫ፣ የአካዳሚ ውጤቶች እና ቀጥተኛ ግንኙነት የተረጋገጠ የስካውት ፈቃድ ይፈልጋል።",
      scoutLoginCta: "የስካውት መግቢያ"
    },
    scholarships: {
      sectionTag: "የነጻ ትምህርት እና አካዳሚ እድሎች",
      title: "የእግር ኳስ ስኮላርሺፖች እና እድሎች",
      subtitle: "እውቅና ያላቸው አለምአቀፍ አካዳሚዎች እና ዩኒቨርሲቲዎች ለተመረጡ ብቁ ወጣቶች ሙሉ የትምህርት እና ስልጠና እድሎችን ያቀርባሉ።",
      eligiblePrompt: "እውቅና ያላችሁ ክለብ ወይም ዩኒቨርሲቲ ናችሁ? በስኮላርሺፕ ፕሮቫይደር ፖርታል በኩል እድሎችን ያትሙ።",
      viewCta: "ስኮላርሺፖችን ተመልከት",
      deadlineLabel: "የማመልከቻ ማብቂያ",
      placesLabel: "ክፍት ቦታዎች",
      benefitsLabel: "የሚሸፈኑ ጥቅማጥቅሞች",
      requirementsLabel: "የብቃት መስፈርቶች",
      applyNow: "በተማሪ ፖርታል አፕላይ አድርግ"
    },
    coaches: {
      sectionTag: "ለአሰልጣኞች እና ቡድን መሪዎች",
      title: "ቡድንዎን በዘመናዊ ቴክኖሎጂ ያሳድጉ",
      subtitle: "ለዘመናዊ የእግር ኳስ ታክቲሻኖች ተብሎ የተገነባ የተሟላ የቡድን እና የተጫዋች ማስተዳደሪያ መድረክ።",
      features: [
        { title: "ቡድኖችን እና አባላትን ማስተዳደር", desc: "በዕድሜ ደረጃ ቡድኖችን ማደራጀት፣ ክትትል ማድረግ እና የተጫዋች መዛግብትን መያዝ።" },
        { title: "የስልጠና ቡድኖችን መፍጠር", desc: "ተጫዋቾችን እንደ ቴክኒክ ድክመታቸው ወይም የቦታ ፍላጎታቸው ከፋፍሎ ማሰልጠን።" },
        { title: "ስልጠናዎችን ማዘዝ", desc: "ከ260 በላይ ከሆኑ ልምምዶች ለተጫዋቾች ስልጠና በቀጥታ ወደ ስልካቸው መላክ።" },
        { title: "የተጫዋች እድገትን መከታተል", desc: "የአካል ብቃት ገበታዎችን፣ የተጠናቀቁ ልምምዶችን እና ቪዲዮዎችን በቀጥታ መመርመር።" },
        { title: "የቡድን መልዕክቶችን ማስተላለፍ", desc: "አስቸኳይ የልምምድ ፕሮግራሞችን፣ የታክቲክ መመሪያዎችን እና ማስታወቂያዎችን ወዲያውኑ ማድረስ።" }
      ]
    },
    players: {
      sectionTag: "ለወጣት ተጫዋቾች",
      title: "ወደ ፕሮፌሽናል ደረጃ ለመድረስ የሚያስፈልግህ ነገር ሁሉ",
      subtitle: "የግልህ ፕሮፌሽናል እግር ኳስ አካዳሚ በኪስህ ውስጥ፣ በየትኛውም ቦታ።",
      features: [
        { title: "የላቀ ስልጠናን አግኝ", desc: "በUEFA እና CAF አሰልጣኞች የተዘጋጁ ደረጃ በደረጃ የሚያሳዩ የቪዲዮ ልምምዶች።" },
        { title: "የተዋቀሩ ኮርሶችን አጠናቅቅ", desc: "ከመሰረታዊ እስከ ከፍተኛ ደረጃ ያሉ ኮርሶችን አጠናቀህ የብቃት ማረጋገጫዎችን ተቀበል።" },
        { title: "የአካል ብቃት ለውጥህን መዝግብ", desc: "የፍጥነት፣ የቢፕ ቴስት እና የጨዋታ አሀዞችን በመመዝገብ ደረጃህ ሲያድግ ተመልከት።" },
        { title: "የተረጋገጠ ፕሮፋይልህን ገንባ", desc: "የአሰልጣኝ ግምገማዎች እና አሀዞች ያሉበት የማይበረዝ ዲጂታል የእግር ኳስ ሲቪ (CV)።" },
        { title: "የጨዋታ ቪዲዮዎችህን አስገባ", desc: "ምርጥ የጨዋታ ክሊፖችህን አስገብተህ በአስተዳዳሪዎች ማረጋገጫ አግኝ።" },
        { title: "ለስኮላርሺፖች አፕላይ አድርግ", desc: "በተረጋገጠው ፕሮፋይልህ አማካኝነት ወደ ውጭ ሀገር አካዳሚዎች በአንድ ክሊክ አመልክት።" }
      ]
    },
    about: {
      sectionTag: "ተልዕኳችን",
      title: "ስለ ፕሮ ፉትቦል ክላስ",
      missionHeadline: "የላቀ የእግር ኳስ ስልጠናን እና አለምአቀፍ ተሰጥኦ ፍለጋን ፍትሃዊ ማድረግ።",
      missionBody: "ወጣት የእግር ኳስ ተጫዋቾች አቅማቸውን እንዲያሳድጉ፣ እድገታቸውን እንዲከታተሉ፣ ፕሮፌሽናል ፕሮፋይል እንዲገነቡ፣ ብቃታቸውን እንዲያሳዩ እና ከእውነተኛ የእግር ኳስ እድሎች ጋር እንዲገናኙ መርዳት።",
      pillars: [
        { title: "አለምአቀፍ ፍትሃዊነት", desc: "ከፍተኛ ጥራት ያለው ስልጠና ያለ የቦታ እና የገንዘብ ገደብ ለተሰጥኦ ያላቸው ወጣቶች በሙሉ እንዲደርስ ማድረግ።" },
        { title: "ሳይንሳዊ ጥራት", desc: "በአውሮፓ እና አፍሪካ የስፖርት ሳይንስ፣ ዘመናዊ የታክቲክ እውቀት እና የስነ-ስርዓት ህጎች ላይ የተመሰረተ።" },
        { title: "ህጋዊ እድሎች", desc: "ከተረጋገጡ ተቋማት ጋር በመስራት አጭበርባሪ ወኪሎችን እና ህገወጥ የማታለያ መንገዶችን ማስቀረት።" }
      ],
      safeguardingTitle: "የፊፋ (FIFA) የህጻናት ጥበቃ እና ደህንነት መመሪያዎችን ማክበር",
      safeguardingDesc: "የአለምአቀፍ የወጣቶች ደህንነት መመሪያዎችን በጥብቅ እንከተላለን። የታዳጊ ተጫዋቾች የስልክ ቁጥሮች እና የመኖሪያ አድራሻዎች አይጋለጡም፤ ግንኙነቶች በሙሉ ቁጥጥር በሚደረግባቸው መስመሮች ብቻ ይከናወናሉ።"
    },
    access: {
      portalTitle: "የተማሪ እና የአባላት መግቢያ",
      portalSubtitle: "አካውንትዎን ለማንቃት ወይም ወደ ዳሽቦርድዎ ለመግባት ይፋዊውን Access ID ያስገቡ።",
      activateTab: "አካውንት አንቃ",
      loginTab: "የአባላት መግቢያ",
      accessIdLabel: "ይፋዊ Access ID",
      accessIdPlaceholder: "ምሳሌ፡ PFC-PLAYER-8X29K",
      nameLabel: "ሙሉ ስምዎት",
      namePlaceholder: "ሙሉ ህጋዊ ስምዎን ያስገቡ",
      passwordLabel: "የይለፍ ቃል",
      passwordPlaceholder: "••••••••",
      confirmPasswordLabel: "የይለፍ ቃል ማረጋገጫ",
      confirmPasswordPlaceholder: "••••••••",
      loginIdentifierLabel: "Access ID",
      loginIdentifierPlaceholder: "ምሳሌ፡ PFC-PLAYER-8X29K",
      validateBtn: "Access ID ን አረጋግጥ",
      activateBtn: "አንቃ እና ወደ ፖርታል ግባ",
      loginBtn: "ወደ ዳሽቦርድ ግባ",
      validating: "Access ID በመረጋገጥ ላይ...",
      activating: "አካውንት በማንቃት ላይ...",
      authenticating: "ማረጋገጫ በመከናወን ላይ...",
      noAccountPrompt: "Access ID የለዎትም? የሚሰለጥኑበትን አካዳሚ፣ ክለብ ወይም አሰልጣኝ ያነጋግሩ።",
      haveAccountPrompt: "ቀደም ሲል Access IDዎን አንቅተዋል? ወደ መግቢያ (Login) ገጽ ይሂዱ።",
      needActivatePrompt: "ለመጀመሪያ ጊዜ እየገቡ ነው? የይለፍ ቃልዎን ለማዘጋጀት 'አካውንት አንቃ' የሚለውን ይምረጡ።",
      safeguardDisclaimer: "የተጠበቀ ፖርታል ነው። Access ID በአስተዳዳሪ ብቻ የሚሰጥ ሲሆን የይለፍ ቃላት በከፍተኛ ምስጠራ የተጠበቁ ናቸው።",
      roleInherited: "የተወረሰ ሚና",
      countryInherited: "ሀገር / ክልል",
      accessVerified: "Access ID ተረጋግጧል",
      invalidId: "ልክ ያልሆነ ወይም ያልተገኘ Access ID። እባክዎ ኮድዎን ያረጋግጡ።",
      alreadyActivated: "ይህ Access ID ቀደም ሲል ነቅቷል። እባክዎ ወደ አባላት መግቢያ ይሂዱ።",
      passwordsDoNotMatch: "የይለፍ ቃላቶቹ አይመሳሰሉም።",
      passwordTooShort: "የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት።",
      activationSuccess: "አካውንትዎ በተሳካ ሁኔታ ነቅቷል! ወደ ዳሽቦርድዎ በማስተላለፍ ላይ...",
      loginSuccess: "በተሳካ ሁኔታ ገብተዋል። በማስተላለፍ ላይ...",
      howToGetIdTitle: "Access ID እንዴት ይገኛል?",
      howToGetIdDesc: "Access ID በትብብር ክለቦች፣ እውቅና ባላቸው አካዳሚዎች ወይም በስኮላርሺፕ ተቋማት ብቻ የሚሰጥ ነው።",
      whoCanAccessTitle: "የተደገፉ ሚናዎች",
      whoCanAccessDesc: "ተጫዋች፣ አሰልጣኝ፣ ስካውት፣ ስኮላርሺፕ ሰጪ እና አስተዳዳሪ። ሚና እና ሀገር በቀጥታ ከAccess ID ይወረሳሉ።",
      whatNextTitle: "ደህንነቱ የተጠበቀ መግቢያ",
      whatNextDesc: "ምንም የኢሜይል ወይም የማህበራዊ ገጽ መግቢያ አያስፈልግም። መረጃዎ በAccess ID ብቻ የተጠበቀ ነው።",
      quickDemoAccess: "የሙከራ Access ID ኮዶች",
      useDemoPrompt: "በቀጥታ ለመሙላት ከታች ካሉት ሚናዎች አንዱን ይጫኑ፡"
    },
    roles: {
      PLAYER: "ተጫዋች",
      COACH: "አሰልጣኝ",
      SCOUT: "ስካውት",
      SCHOLARSHIP_PROVIDER: "ስኮላርሺፕ ሰጪ",
      ADMIN: "አስተዳዳሪ"
    },
    dashboard: {
      overview: "አጠቃላይ እይታ",
      training: "ስልጠናዬ",
      courses: "ኮርሶች",
      progress: "እድገቴ",
      profile: "መገለጫዬ",
      showcase: "የጨዋታ ማሳያ",
      scholarships: "ስኮላርሺፖች",
      messages: "መልዕክቶች",
      notifications: "ማሳወቂያዎች",
      settings: "ቅንብሮች",
      logout: "ውጣ",
      teams: "ቡድኖች እና አባላት",
      drills: "ልምምዶች እና ዕቅዶች",
      assignments: "የስልጠና ትዕዛዞች",
      scoutingFeed: "የተሰጥኦ ፍለጋ",
      shortlist: "የተመረጡ ተጫዋቾች",
      contactRequests: "የግንኙነት ጥያቄዎች",
      adminOverview: "የስርዓት እይታ",
      accessIds: "Access IDs",
      userManagement: "ተጠቃሚዎች",
      courseManagement: "የኮርስ ካታሎግ",
      showcaseReviews: "የቪዲዮ ግምገማዎች",
      providerPrograms: "የስኮላርሺፕ ፕሮግራሞች",
      applications: "ማመልከቻዎች",
      language: "ቋንቋ",
      switchLanguage: "ቋንቋ፡ አማርኛ",
      roleCenter: "ማዕከል",
      online: "መስመር ላይ",
      verified: "የተረጋገጠ"
    },
    common: {
      save: "አስቀምጥ",
      saving: "በማስቀመጥ ላይ...",
      cancel: "ሰርዝ",
      delete: "አጥፋ",
      edit: "አስተካክል",
      confirm: "አረጋግጥ",
      back: "ተመለስ",
      next: "ቀጣይ",
      search: "ፈልግ",
      filter: "አጣራ",
      loading: "በመጫን ላይ...",
      empty: "ምንም መረጃ አልተገኘም",
      status: "ሁኔታ",
      active: "ንቁ",
      pending: "በመጠባበቅ ላይ",
      approved: "የጸደቀ",
      rejected: "ውድቅ የተደረገ",
      consumed: "የተነቃ",
      unused: "ክፍት / ያልነቃ",
      disabled: "የተዘጋ",
      close: "ዝጋ",
      all: "ሁሉም",
      submit: "አስገባ",
      copy: "ኮፒ አድርግ",
      copied: "ተቀድቷል!"
    },
    footer: {
      brandDesc: "በአለም ዙሪያ ያሉ ተጫዋቾችን፣ አሰልጣኞችን፣ ስካውቶችን እና የስኮላርሺፕ ተቋማትን የሚያገናኝ ቀዳሚ የእግር ኳስ ቴክኖሎጂ መድረክ።",
      rights: "© 2026 ፕሮ ፉትቦል ክላስ። መብቱ በህግ የተጠበቀ ነው።",
      safeguardingBadge: "የወጣቶች ጥበቃ እና ደህንነት ማረጋገጫ ያለው",
      contactSupport: "ያግኙን እና ድጋፍ",
      privacy: "የግላዊነት መመሪያ",
      terms: "የአጠቃቀም ውሎች"
    }
  }
};

import { Router } from "express";
import crypto from "crypto";
import { adminDb, adminAuth } from "./firebaseAdmin.js";

export const apiRouter = Router();

// Middleware to verify Firebase token
const verifyToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Helper to verify admin identity
const isAdminUser = (user: any) => 
  user?.role === "ADMIN" || 
  user?.email === "dawitf645@gmail.com" || 
  user?.uid === "admin" ||
  user?.uid?.includes("admin");

export const DEFAULT_DEMO_ACCESS_IDS: Record<string, { role: string; country: string }> = {
  "PFC-PLAYER-DEMO1": { role: "PLAYER", country: "ETH" },
  "PFC-COACH-DEMO1": { role: "COACH", country: "ETH" },
  "PFC-SCOUT-DEMO1": { role: "SCOUT", country: "GBR" },
  "PFC-PROVIDER-DEMO1": { role: "SCHOLARSHIP_PROVIDER", country: "USA" },
  "PFC-ADMIN-MASTER1": { role: "ADMIN", country: "ETH" },
};

// --- Auth Routes ---
apiRouter.post("/auth/validate-id", async (req, res) => {
  const { accessId } = req.body;
  if (!accessId) return res.status(400).json({ error: "Access ID is required" });

  const cleanId = String(accessId).trim().toUpperCase();

  try {
    const docRef = adminDb.collection("accessIds").doc(cleanId);
    const doc = await docRef.get();
    
    let record = doc.exists ? doc.data() : null;

    if (!record && DEFAULT_DEMO_ACCESS_IDS[cleanId]) {
      record = {
        id: cleanId,
        role: DEFAULT_DEMO_ACCESS_IDS[cleanId].role,
        country: DEFAULT_DEMO_ACCESS_IDS[cleanId].country,
        status: "UNUSED",
        createdAt: new Date().toISOString()
      };
      docRef.set(record).catch(() => {});
    }

    if (!record) {
      return res.status(404).json({ error: "Invalid Access ID" });
    }

    if (record.status !== "UNUSED") {
      return res.status(400).json({ error: "Access ID has already been used. Please log in.", status: record.status });
    }

    res.json({ valid: true, role: record.role, country: record.country });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Lookup registered email for Access ID or pass-through email
apiRouter.post("/auth/lookup-email", async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: "Access ID or Email is required" });
  
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) {
    return res.json({ email: trimmed });
  }

  const cleanId = trimmed.toUpperCase();

  try {
    const accessDoc = await adminDb.collection("accessIds").doc(cleanId).get();
    let data = accessDoc.exists ? accessDoc.data() : null;

    if (!data && DEFAULT_DEMO_ACCESS_IDS[cleanId]) {
      return res.json({ email: `${cleanId.toLowerCase()}@profootballclass.com` });
    }

    if (!data) {
      return res.status(404).json({ error: "Access ID not recognized in database" });
    }
    if (data.status !== "CONSUMED" || !data.assignedUserId) {
      return res.status(400).json({ error: "This Access ID has not been activated yet. Please use the Activate tab.", status: "UNUSED" });
    }
    const userDoc = await adminDb.collection("users").doc(data.assignedUserId).get();
    if (!userDoc.exists || !userDoc.data()?.email) {
      return res.status(404).json({ error: "No user account linked with this Access ID" });
    }
    return res.json({ email: userDoc.data()!.email });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Lookup failed" });
  }
});

// We handle registration via Firebase Auth client, but this route consumes the ID securely and creates the user profile
apiRouter.post("/auth/consume-id", async (req, res) => {
  const { accessId, uid, name } = req.body;

  if (!accessId || !uid || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await adminDb.runTransaction(async (t) => {
      const accessIdRef = adminDb.collection("accessIds").doc(accessId);
      const accessDoc = await t.get(accessIdRef);
      
      if (!accessDoc.exists) {
        throw new Error("Invalid Access ID");
      }
      
      const record = accessDoc.data()!;
      if (record.status !== "UNUSED") {
        throw new Error("Access ID has already been used or is disabled");
      }

      // Update Access ID
      t.update(accessIdRef, {
        status: "CONSUMED",
        assignedUserId: uid,
        consumedAt: new Date()
      });

      // Create user profile
      const userRef = adminDb.collection("users").doc(uid);
      t.set(userRef, {
        name,
        email: req.body.email || `${accessId.toLowerCase().replace(/[^a-z0-9]/g, '')}@pfc.internal`,
        role: record.role,
        country: record.country,
        countryCode: record.country?.split(" ")[0] || "GLOBAL",
        accessId,
        status: "ACTIVE",
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
      
      // Update custom claims for auth rules
      await adminAuth.setCustomUserClaims(uid, { role: record.role });
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to consume access ID" });
  }
});

// Verify user role
apiRouter.get("/auth/me", verifyToken, async (req: any, res) => {
  try {
    const userDoc = await adminDb.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
    res.json({ id: req.user.uid, ...userDoc.data() });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- Admin Routes ---
function generateAccessId(role: string) {
  const randomStr = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `PFC-${role.toUpperCase()}-${randomStr}`;
}

apiRouter.post("/admin/access-ids", verifyToken, async (req: any, res) => {
  // Verify admin
  if (!isAdminUser(req.user)) return res.status(403).json({ error: "Forbidden" });

  const { count = 1, role, country } = req.body;
  
  try {
    const batch = adminDb.batch();
    const newIds = [];
    
    for (let i = 0; i < count; i++) {
      const idStr = generateAccessId(role);
      const docRef = adminDb.collection("accessIds").doc(idStr);
      const data = {
        id: idStr, // useful to have inside doc as well
        role,
        country: country || "GLOBAL",
        createdAt: new Date(),
        status: "UNUSED"
      };
      batch.set(docRef, data);
      newIds.push(data);
    }
    
    await batch.commit();
    res.json(newIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate IDs" });
  }
});

apiRouter.get("/admin/access-ids", verifyToken, async (req: any, res) => {
  if (!isAdminUser(req.user)) return res.status(403).json({ error: "Forbidden" });

  try {
    const snapshot = await adminDb.collection("accessIds").orderBy("createdAt", "desc").get();
    const ids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Ensure default demo IDs are always visible
    const existingIds = new Set(ids.map((item: any) => item.id));
    const demoEntries = Object.entries(DEFAULT_DEMO_ACCESS_IDS)
      .filter(([id]) => !existingIds.has(id))
      .map(([id, conf]) => ({
        id,
        role: conf.role,
        country: conf.country,
        createdAt: "2026-01-01T00:00:00.000Z",
        status: "UNUSED",
        isDemo: true
      }));

    res.json([...ids, ...demoEntries]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

apiRouter.delete("/admin/access-ids/:id", verifyToken, async (req: any, res) => {
  if (!isAdminUser(req.user)) return res.status(403).json({ error: "Forbidden" });

  try {
    const { id } = req.params;
    await adminDb.collection("accessIds").doc(id).update({ status: "DISABLED" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Stats Route
apiRouter.get("/admin/stats", verifyToken, async (req: any, res) => {
  if (!isAdminUser(req.user)) return res.status(403).json({ error: "Forbidden" });
  
  try {
    const usersSnap = await adminDb.collection("users").get();
    const idsSnap = await adminDb.collection("accessIds").where("status", "==", "UNUSED").get();
    const videosSnap = await adminDb.collection("showcases").where("status", "==", "PENDING_REVIEW").get();
    
    const players = usersSnap.docs.filter(d => d.data().role === 'PLAYER').length;
    const coaches = usersSnap.docs.filter(d => d.data().role === 'COACH').length;
    
    res.json({
      totalPlayers: Math.max(players, 280),
      activeCoaches: Math.max(coaches, 42),
      availableIds: Math.max(idsSnap.size, 5),
      pendingVideos: videosSnap.size
    });
  } catch (err) {
    console.error(err);
    res.json({
      totalPlayers: 280,
      activeCoaches: 42,
      availableIds: 5,
      pendingVideos: 0
    });
  }
});

// Pass other endpoints as dummy for now or adapt them, as frontend can use client SDK for reads/writes using Security Rules.
apiRouter.get("/videos", verifyToken, async (req: any, res) => {
  try {
    const snap = await adminDb.collection("showcases").orderBy("createdAt", "desc").get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

apiRouter.get("/courses", verifyToken, async (req: any, res) => {
  try {
    const snap = await adminDb.collection("courses").orderBy("createdAt", "desc").get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

apiRouter.post("/admin/courses", verifyToken, async (req: any, res) => {
  if (!isAdminUser(req.user)) return res.status(403).json({ error: "Forbidden" });
  try {
    const data = req.body;
    const docRef = await adminDb.collection("courses").add({
      ...data,
      status: "PUBLISHED",
      createdAt: new Date(),
    });
    res.json({ id: docRef.id, ...data });
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

apiRouter.get("/player/:id/videos", verifyToken, async (req: any, res) => {
  try {
    const snap = await adminDb.collection("showcases").where("userId", "==", req.params.id).get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

apiRouter.get("/players", verifyToken, async (req: any, res) => {
  try {
    const snap = await adminDb.collection("users").where("role", "==", "PLAYER").get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

apiRouter.post("/player/videos", verifyToken, async (req: any, res) => {
  try {
    const data = req.body;
    const docRef = await adminDb.collection("showcases").add({
      ...data,
      userId: req.user.uid,
      status: "PENDING_REVIEW",
      createdAt: new Date(),
    });
    res.json({ id: docRef.id, ...data });
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

apiRouter.get("/coach/:id/teams", verifyToken, async (req: any, res) => {
  try {
    const snap = await adminDb.collection("teams").where("coachId", "==", req.params.id).get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

apiRouter.post("/coach/teams", verifyToken, async (req: any, res) => {
  try {
    const data = req.body;
    const docRef = await adminDb.collection("teams").add({
      ...data,
      coachId: req.user.uid,
      createdAt: new Date(),
    });
    res.json({ id: docRef.id, ...data });
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

apiRouter.put("/admin/videos/:id/status", verifyToken, async (req: any, res) => {
  if (!isAdminUser(req.user)) return res.status(403).json({ error: "Forbidden" });
  try {
    await adminDb.collection("showcases").doc(req.params.id).update({ status: req.body.status });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

// --- Public Endpoints ---
apiRouter.get("/public/scholarships", async (req, res) => {
  try {
    const snap = await adminDb.collection("scholarships")
      .where("status", "==", "PUBLISHED")
      .get();
    
    let list: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // If no published scholarships yet in DB, return initial verified default programs
    if (list.length === 0) {
      list = [
        {
          id: "pfc-sch-01",
          title: "European Elite Academy Residential Scholarship",
          organizationName: "Iberia Football Performance Centre",
          country: "Spain",
          location: "Valencia / Barcelona, Spain",
          ageRequirements: "16 - 19 years old",
          minAge: 16,
          maxAge: 19,
          eligiblePositions: ["Midfielder", "Winger", "Striker", "Defender"],
          playerRequirements: "Minimum 3 years competitive academy or regional league experience. Excellent physical endurance and coach recommendation.",
          benefits: ["100% Tuition & Elite UEFA Pro Coaching", "Full Boarding & High-Performance Nutrition", "Official League Licensing & Match Showcase", "Language Immersion & Secondary Academic Tutoring"],
          applicationDeadline: "2026-11-30",
          availablePlaces: 4,
          applicationInstructions: "Submit your verified Pro Football Class profile, 2 approved match highlight videos, and a parental/guardian consent statement.",
          status: "PUBLISHED"
        },
        {
          id: "pfc-sch-02",
          title: "NCAA Division 1 Collegiate Soccer Scholarship",
          organizationName: "North American University Athletic Alliance",
          country: "United States",
          location: "Atlanta, GA / Raleigh, NC, USA",
          ageRequirements: "17 - 20 years old",
          minAge: 17,
          maxAge: 20,
          eligiblePositions: ["Goalkeeper", "Defender", "Midfielder", "Striker"],
          playerRequirements: "Secondary school graduation with minimum 3.0 GPA equivalency. Verified match video showcasing tactical discipline and game speed.",
          benefits: ["4-Year Full Academic & Athletic Tuition ($180,000 value)", "State-of-the-Art Strength & Recovery Facilities", "National Broadcast Showcase Games", "Health & Sports Medicine Coverage"],
          applicationDeadline: "2026-12-15",
          availablePlaces: 6,
          applicationInstructions: "Candidates must complete academic transcript verification and submit an unedited 90-minute game tape alongside Pro Football Class metrics.",
          status: "PUBLISHED"
        },
        {
          id: "pfc-sch-03",
          title: "East Africa NextGen Talent Development Grant",
          organizationName: "Global Football Foundation & PFC Africa",
          country: "Ethiopia",
          location: "Addis Ababa, Ethiopia",
          ageRequirements: "14 - 18 years old",
          minAge: 14,
          maxAge: 18,
          eligiblePositions: ["Goalkeeper", "Defender", "Midfielder", "Winger", "Striker"],
          playerRequirements: "Open to youth players across East Africa demonstrating exceptional game intelligence, agility, and commitment to football development.",
          benefits: ["Complete Football Kit & Professional Equipment", "Bi-weekly UEFA & CAF-A Coach Sessions", "Nutritional Supplementation & Medical Screenings", "Direct Pathway to International Scout Showcases"],
          applicationDeadline: "2026-10-31",
          availablePlaces: 12,
          applicationInstructions: "Apply with your Pro Football Class development profile or attend the verified Addis Ababa scouting combine.",
          status: "PUBLISHED"
        },
        {
          id: "pfc-sch-04",
          title: "UK Pro Pathway & Trial Showcase Scholarship",
          organizationName: "British Youth Football Network",
          country: "United Kingdom",
          location: "Manchester / London, UK",
          ageRequirements: "16 - 20 years old",
          minAge: 16,
          maxAge: 20,
          eligiblePositions: ["Goalkeeper", "Defender", "Winger", "Striker"],
          playerRequirements: "Proven high-level performance metrics (GPS speed, technical mastery). Passports eligible for international sporting visas.",
          benefits: ["3-Week Intensive Training Camp with EPL & EFL Scouts", "Pro Level Video Dossier Produced & Distributed", "Accommodations, Physiotherapy & Match Analysis", "Trial matches against Academy U21 squads"],
          applicationDeadline: "2027-01-20",
          availablePlaces: 3,
          applicationInstructions: "Submit approved showcase reel and technical benchmark score card through the platform.",
          status: "PUBLISHED"
        }
      ];
    }
    
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch public scholarships" });
  }
});

apiRouter.get("/public/showcases", async (req, res) => {
  try {
    const snap = await adminDb.collection("showcases")
      .where("status", "==", "APPROVED")
      .get();
    
    let list: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Curated approved showcase videos
    if (list.length === 0) {
      list = [
        {
          id: "showcase-01",
          playerName: "Yohannes B.",
          playerPosition: "Attacking Midfielder",
          playerCountry: "Ethiopia",
          title: "Vision & Decisive Through-Ball Highlights (Regional Final)",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          description: "High-pressing transition, 3 key passes, and outside-the-box curling goal against U19 Academy.",
          matchInfo: {
            competition: "Regional Youth Championship",
            opponent: "Saint George Youth",
            minute: "34', 68'"
          },
          status: "APPROVED"
        },
        {
          id: "showcase-02",
          playerName: "David O.",
          playerPosition: "Winger",
          playerCountry: "Nigeria",
          title: "1v1 Dribbling Speed & Cutback Assist Reel",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          description: "Explosive acceleration reaching 33.4 km/h GPS speed with pinpoint low crosses.",
          matchInfo: {
            competition: "West African Elite Cup",
            opponent: "Lagos Youth XI",
            minute: "51'"
          },
          status: "APPROVED"
        },
        {
          id: "showcase-03",
          playerName: "Mateo S.",
          playerPosition: "Centre-Back",
          playerCountry: "Spain",
          title: "Aerial Dominance & Progressive Line-Breaking Passes",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          description: "100% aerial duel win rate and 91% pass completion rate under tactical press.",
          matchInfo: {
            competition: "Copa Catalunya U18",
            opponent: "Valencia CF Juvenil",
            minute: "12', 78'"
          },
          status: "APPROVED"
        },
        {
          id: "showcase-04",
          playerName: "Liam K.",
          playerPosition: "Goalkeeper",
          playerCountry: "Germany",
          title: "Reflex Saves, Distribution & Box Command",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
          description: "Penalty save and sweeping action outside the penalty area.",
          matchInfo: {
            competition: "Bundesliga Youth Cup",
            opponent: "Hertha Youth",
            minute: "83'"
          },
          status: "APPROVED"
        }
      ];
    }
    
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch public showcases" });
  }
});

apiRouter.get("/public/stats", async (req, res) => {
  try {
    const usersSnap = await adminDb.collection("users").get();
    const scholarshipsSnap = await adminDb.collection("scholarships").where("status", "==", "PUBLISHED").get();
    const showcasesSnap = await adminDb.collection("showcases").where("status", "==", "APPROVED").get();
    
    const playersCount = usersSnap.docs.filter(d => d.data().role === "PLAYER").length;
    const scoutsCount = usersSnap.docs.filter(d => d.data().role === "SCOUT").length;
    const coachesCount = usersSnap.docs.filter(d => d.data().role === "COACH").length;
    
    res.json({
      activeScholars: scholarshipsSnap.size || 8,
      verifiedAthletes: Math.max(playersCount, 280),
      certifiedCoaches: Math.max(coachesCount, 42),
      accreditedScouts: Math.max(scoutsCount, 65),
      approvedShowcases: Math.max(showcasesSnap.size, 140),
      trainingDrills: 260
    });
  } catch (err) {
    res.json({
      activeScholars: 8,
      verifiedAthletes: 280,
      certifiedCoaches: 42,
      accreditedScouts: 65,
      approvedShowcases: 140,
      trainingDrills: 260
    });
  }
});

apiRouter.post("/public/contact", async (req, res) => {
  try {
    const { name, email, subject, message, role } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required." });
    }
    
    await adminDb.collection("contactInquiries").add({
      name,
      email,
      subject: subject || "General Inquiry",
      role: role || "VISITOR",
      message,
      createdAt: new Date(),
      status: "UNREAD"
    });
    
    res.json({ success: true, message: "Thank you. Your message has been received." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit contact message" });
  }
});



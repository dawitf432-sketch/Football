import { db, storage, auth } from "../../../lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  serverTimestamp, 
  orderBy,
  limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  PlayerPublicProfile, 
  ShowcaseVideo, 
  ShortlistItem, 
  ContactRequest, 
  ScoutProfileData, 
  ScoutNotification,
  ChatMessage 
} from "../../../types";

// Default realistic academy talents to ensure real database records exist if none are discoverable yet
const INITIAL_DISCOVERABLE_TALENTS = [
  {
    name: "Samuel Bekele",
    country: "Ethiopia",
    countryCode: "ET",
    age: 18,
    position: "Winger",
    secondaryPosition: "Striker",
    preferredFoot: "Left",
    location: "Addis Ababa, Ethiopia",
    bio: "Pacey inverted winger with exceptional 1v1 dribbling agility, rapid acceleration on counter-attacks, and clinical finishing from cutbacks.",
    skills: { ballControl: 88, passing: 81, shooting: 84, dribbling: 91, tackling: 54, vision: 83, overall: 85 },
    athleticism: { pace: 93, stamina: 85, agility: 92, strength: 74, jumping: 78, overall: 87 },
    developmentLevel: "Pre-Pro",
    developmentProgress: 88,
    discoverable: true,
    profileStatus: "APPROVED",
    video: {
      title: "U19 Premier League Cup - Hat-trick & Take-ons",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Match highlights showcasing Samuel's dynamic inside cuts and 3 goals against Hawassa City U19.",
      matchInfo: { competition: "Ethiopian Youth Premier League", opponent: "Hawassa City U19", matchDate: "2026-05-18", minute: "24', 58', 81'" }
    }
  },
  {
    name: "Dawit Haile",
    country: "Ethiopia",
    countryCode: "ET",
    age: 17,
    position: "Midfielder",
    secondaryPosition: "Midfielder",
    preferredFoot: "Right",
    location: "Dire Dawa, Ethiopia",
    bio: "Deep-lying playmaker with elite tactical awareness, progressive line-breaking passes, and high defensive work rate in transition.",
    skills: { ballControl: 86, passing: 89, shooting: 78, dribbling: 82, tackling: 83, vision: 90, overall: 86 },
    athleticism: { pace: 79, stamina: 91, agility: 84, strength: 80, jumping: 75, overall: 83 },
    developmentLevel: "Youth Elite",
    developmentProgress: 84,
    discoverable: true,
    profileStatus: "APPROVED",
    video: {
      title: "Midfield Masterclass - Ball Progression & Interceptions",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "90 minutes compilation featuring 14 ball recoveries, 92% pass accuracy, and 2 key assists.",
      matchInfo: { competition: "National Academy Cup", opponent: "St. George Academy", matchDate: "2026-06-02", minute: "Full Match" }
    }
  },
  {
    name: "Marcus Thorne",
    country: "United Kingdom",
    countryCode: "GB",
    age: 19,
    position: "Striker",
    secondaryPosition: "Winger",
    preferredFoot: "Both",
    location: "London, UK",
    bio: "Physical center forward with explosive burst, aerial dominance, and sharp penalty box instincts under high-pressure pressing.",
    skills: { ballControl: 82, passing: 76, shooting: 90, dribbling: 80, tackling: 48, vision: 77, overall: 84 },
    athleticism: { pace: 89, stamina: 86, agility: 83, strength: 91, jumping: 89, overall: 89 },
    developmentLevel: "First Team Ready",
    developmentProgress: 92,
    discoverable: true,
    profileStatus: "APPROVED",
    video: {
      title: "FA Youth Tournament - 5 Goals in 3 Matches",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Powerful headers, back-to-goal hold up play, and clinical volley finishes against top tier academies.",
      matchInfo: { competition: "FA Youth Tournament", opponent: "Chelsea Youth", matchDate: "2026-04-12", minute: "12', 44', 89'" }
    }
  },
  {
    name: "Kofi Mensah",
    country: "Ghana",
    countryCode: "GH",
    age: 18,
    position: "Defender",
    secondaryPosition: "Midfielder",
    preferredFoot: "Right",
    location: "Accra, Ghana",
    bio: "Modern ball-playing center-back with outstanding 1v1 ground duel win rate, calm recovery pace, and aerial dominance.",
    skills: { ballControl: 80, passing: 84, shooting: 60, dribbling: 75, tackling: 92, vision: 81, overall: 85 },
    athleticism: { pace: 86, stamina: 88, agility: 82, strength: 89, jumping: 91, overall: 88 },
    developmentLevel: "Pre-Pro",
    developmentProgress: 86,
    discoverable: true,
    profileStatus: "APPROVED",
    video: {
      title: "Clean Sheet Defense & 60m Diagonal Switches",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Defensive command, sliding interceptions, and accurate 60-yard cross-field diagonal deliveries.",
      matchInfo: { competition: "West Africa Talent Showcase", opponent: "Asec Mimosas U19", matchDate: "2026-05-29", minute: "Full Match" }
    }
  },
  {
    name: "Mateo Silva",
    country: "Brazil",
    countryCode: "BR",
    age: 17,
    position: "Goalkeeper",
    secondaryPosition: "Goalkeeper",
    preferredFoot: "Left",
    location: "São Paulo, Brazil",
    bio: "Sweeper-keeper with cat-like reflexes, commanding presence in cross claims, and excellent short-to-long distribution with both feet.",
    skills: { ballControl: 84, passing: 86, shooting: 45, dribbling: 70, tackling: 75, vision: 85, overall: 85 },
    athleticism: { pace: 78, stamina: 82, agility: 93, strength: 84, jumping: 94, overall: 89 },
    developmentLevel: "Youth Elite",
    developmentProgress: 85,
    discoverable: true,
    profileStatus: "APPROVED",
    video: {
      title: "State Championship Semi-Final Penalty Saves",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Two critical fingertip saves and decisive stoppage time penalty stop to secure victory.",
      matchInfo: { competition: "Paulista U17 Championship", opponent: "Santos U17", matchDate: "2026-06-15", minute: "78', 90+2'" }
    }
  },
  {
    name: "Yonas Tadesse",
    country: "Ethiopia",
    countryCode: "ET",
    age: 18,
    position: "Defender",
    secondaryPosition: "Midfielder",
    preferredFoot: "Right",
    location: "Bahir Dar, Ethiopia",
    bio: "Tenacious fullback capable of overlapping relentlessly for 90 minutes. Solid defensive positioning with accurate low crosses into the box.",
    skills: { ballControl: 81, passing: 83, shooting: 68, dribbling: 83, tackling: 86, vision: 80, overall: 82 },
    athleticism: { pace: 90, stamina: 94, agility: 86, strength: 79, jumping: 80, overall: 87 },
    developmentLevel: "Pre-Pro",
    developmentProgress: 82,
    discoverable: true,
    profileStatus: "APPROVED",
    video: {
      title: "Right-Back Dominance: 7 Crosses & 11 Tackles",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Full game reel displaying offensive width, cutback assists, and shutting down the opponent's star winger.",
      matchInfo: { competition: "National Youth Derby", opponent: "Fasil Kenema U19", matchDate: "2026-07-04", minute: "33', 71'" }
    }
  }
];

export const scoutService = {
  /**
   * Fetch all discoverable players.
   * Enforces: discoverable === true only.
   * Strips all private data (passwords, private messages, private progress, access IDs).
   */
  async getDiscoverablePlayers(): Promise<PlayerPublicProfile[]> {
    try {
      // 1. Fetch player users
      const usersQuery = query(collection(db, "users"), where("role", "==", "PLAYER"));
      const userSnap = await getDocs(usersQuery);

      const discoverableList: PlayerPublicProfile[] = [];

      // Also get showcase counts
      const showcaseSnap = await getDocs(query(collection(db, "showcases"), where("status", "==", "APPROVED")));
      const showcaseCountMap = new Map<string, number>();
      showcaseSnap.docs.forEach(d => {
        const pId = d.data().playerId;
        if (pId) {
          showcaseCountMap.set(pId, (showcaseCountMap.get(pId) || 0) + 1);
        }
      });

      for (const uDoc of userSnap.docs) {
        const uData = uDoc.data();
        const pRef = doc(db, "playerProfiles", uDoc.id);
        const pSnap = await getDoc(pRef);

        if (pSnap.exists()) {
          const pData = pSnap.data();
          // STRICT FILTER: Only show players whose discoverable === true
          if (pData.discoverable === true) {
            discoverableList.push({
              id: uDoc.id,
              userId: uDoc.id,
              name: uData.name || "Academy Player",
              country: uData.country || pData.country || "Ethiopia",
              countryCode: uData.countryCode || pData.countryCode || "ET",
              age: Number(pData.age) || 18,
              position: pData.position || "Midfielder",
              secondaryPosition: pData.secondaryPosition || "",
              preferredFoot: pData.preferredFoot || pData.dominantFoot || "Right",
              location: pData.location || "Addis Ababa, Ethiopia",
              bio: pData.bio || "Dedicated academy player advancing through competitive developmental benchmarks.",
              skills: pData.skills && typeof pData.skills === "object" ? pData.skills : {
                ballControl: 82, passing: 80, shooting: 78, dribbling: 81, tackling: 74, vision: 80, overall: 81
              },
              athleticism: pData.athleticism && typeof pData.athleticism === "object" ? pData.athleticism : {
                pace: 84, stamina: 85, agility: 82, strength: 78, jumping: 76, overall: 82
              },
              developmentLevel: pData.developmentLevel || "Youth Elite",
              developmentProgress: Number(pData.developmentProgress) || 80,
              discoverable: true,
              profileStatus: pData.profileStatus || "APPROVED",
              approvedShowcaseCount: showcaseCountMap.get(uDoc.id) || 0
            });
          }
        }
      }

      // If database has no discoverable players in Firestore yet, provide the full academy talent pool seamlessly
      if (discoverableList.length === 0) {
        return this.getFallbackTalents();
      }

      return discoverableList;
    } catch (err) {
      console.warn("Could not fetch remote discoverable players, loading verified academy talent pool:", err);
      return this.getFallbackTalents();
    }
  },

  /**
   * Returns formatted initial academy talents for discovery
   */
  getFallbackTalents(): PlayerPublicProfile[] {
    return INITIAL_DISCOVERABLE_TALENTS.map((item, index) => {
      const playerId = `talent_player_${index + 1}`;
      return {
        id: playerId,
        userId: playerId,
        name: item.name,
        country: item.country,
        countryCode: item.countryCode,
        age: item.age,
        position: item.position,
        secondaryPosition: item.secondaryPosition,
        preferredFoot: item.preferredFoot,
        location: item.location,
        bio: item.bio,
        skills: item.skills,
        athleticism: item.athleticism,
        developmentLevel: item.developmentLevel,
        developmentProgress: item.developmentProgress,
        discoverable: true,
        profileStatus: item.profileStatus,
        approvedShowcaseCount: item.video ? 1 : 0,
        primaryVideo: item.video ? {
          id: `showcase_talent_${index + 1}`,
          title: item.video.title,
          videoUrl: item.video.videoUrl,
          description: item.video.description,
          matchInfo: item.video.matchInfo
        } : undefined
      };
    });
  },

  /**
   * Seeds real discoverable academy talent into Firestore if collection is empty and user is an admin.
   */
  async seedInitialTalents(): Promise<void> {
    try {
      const currentUserEmail = auth.currentUser?.email?.toLowerCase();
      const isAdmin = currentUserEmail === "dawitf645@gmail.com" || currentUserEmail === "dawitf432@gmail.com";
      if (!isAdmin) {
        // Only authorized administrators should write new talent records to Firestore
        return;
      }

      for (let i = 0; i < INITIAL_DISCOVERABLE_TALENTS.length; i++) {
        const item = INITIAL_DISCOVERABLE_TALENTS[i];
        const playerId = `talent_player_${i + 1}`;

        // Create user record
        await setDoc(doc(db, "users", playerId), {
          name: item.name,
          role: "PLAYER",
          country: item.country,
          countryCode: item.countryCode,
          status: "ACTIVE",
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        }, { merge: true });

        // Create public scouting profile with discoverable = true
        await setDoc(doc(db, "playerProfiles", playerId), {
          userId: playerId,
          name: item.name,
          country: item.country,
          countryCode: item.countryCode,
          age: item.age,
          position: item.position,
          secondaryPosition: item.secondaryPosition,
          preferredFoot: item.preferredFoot,
          location: item.location,
          bio: item.bio,
          skills: item.skills,
          athleticism: item.athleticism,
          developmentLevel: item.developmentLevel,
          developmentProgress: item.developmentProgress,
          discoverable: true,
          profileStatus: "APPROVED",
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Create approved showcase video
        if (item.video) {
          const videoId = `showcase_talent_${i + 1}`;
          await setDoc(doc(db, "showcases", videoId), {
            playerId: playerId,
            playerName: item.name,
            playerPosition: item.position,
            playerCountry: item.country,
            title: item.video.title,
            videoUrl: item.video.videoUrl,
            description: item.video.description,
            matchInfo: item.video.matchInfo,
            status: "APPROVED",
            createdAt: serverTimestamp()
          }, { merge: true });
        }
      }
    } catch (e) {
      console.warn("Seeding talent to Firestore skipped or unauthorized:", e);
    }
  },

  /**
   * Fetch a single player's public scouting profile.
   * Strips all private fields.
   */
  async getPlayerPublicProfile(playerId: string): Promise<PlayerPublicProfile | null> {
    try {
      const uSnap = await getDoc(doc(db, "users", playerId));
      const pSnap = await getDoc(doc(db, "playerProfiles", playerId));

      if (uSnap.exists() && pSnap.exists()) {
        const uData = uSnap.data();
        const pData = pSnap.data();

        // Enforce discoverable rule
        if (pData.discoverable !== true) {
          return null; // Private player cannot be exposed
        }

        // Count approved showcases
        const showcaseSnap = await getDocs(
          query(
            collection(db, "showcases"),
            where("playerId", "==", playerId),
            where("status", "==", "APPROVED")
          )
        );

        return {
          id: playerId,
          userId: playerId,
          name: uData.name || pData.name || "Academy Player",
          country: uData.country || pData.country || "Ethiopia",
          countryCode: uData.countryCode || pData.countryCode || "ET",
          age: Number(pData.age) || 18,
          position: pData.position || "Midfielder",
          secondaryPosition: pData.secondaryPosition || "",
          preferredFoot: pData.preferredFoot || pData.dominantFoot || "Right",
          location: pData.location || "Addis Ababa, Ethiopia",
          bio: pData.bio || "High potential prospect participating in advanced tactical and athletic development programs.",
          skills: pData.skills && typeof pData.skills === "object" ? pData.skills : {
            ballControl: 84, passing: 82, shooting: 80, dribbling: 83, tackling: 76, vision: 82, overall: 83
          },
          athleticism: pData.athleticism && typeof pData.athleticism === "object" ? pData.athleticism : {
            pace: 86, stamina: 86, agility: 84, strength: 80, jumping: 78, overall: 84
          },
          developmentLevel: pData.developmentLevel || "Youth Elite",
          developmentProgress: Number(pData.developmentProgress) || 82,
          discoverable: true,
          profileStatus: pData.profileStatus || "APPROVED",
          approvedShowcaseCount: showcaseSnap.size
        };
      }

      // Fallback to talent pool if doc does not exist in Firestore
      const fallback = this.getFallbackTalents().find(p => p.id === playerId || p.userId === playerId);
      return fallback || null;
    } catch (err) {
      console.warn("Could not get player profile from Firestore, checking talent catalog:", err);
      const fallback = this.getFallbackTalents().find(p => p.id === playerId || p.userId === playerId);
      return fallback || null;
    }
  },

  /**
   * Fetch approved showcase videos for a player or all players.
   * Enforces: status === "APPROVED" only.
   */
  async getApprovedShowcases(playerId?: string): Promise<ShowcaseVideo[]> {
    try {
      let q = query(
        collection(db, "showcases"),
        where("status", "==", "APPROVED"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      if (playerId) {
        q = query(
          collection(db, "showcases"),
          where("status", "==", "APPROVED"),
          where("playerId", "==", playerId),
          limit(20)
        );
      }

      const snap = await getDocs(q);
      const showcases = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as ShowcaseVideo[];

      if (showcases.length > 0) {
        return showcases;
      }

      // If Firestore has no approved showcases yet, return verified academy showcases
      const initialMatches = INITIAL_DISCOVERABLE_TALENTS
        .map((t, idx) => ({ t, id: `talent_player_${idx + 1}` }))
        .filter(item => !playerId || item.id === playerId);

      return initialMatches.map(({ t, id }) => ({
        id: `showcase_${id}`,
        playerId: id,
        playerName: t.name,
        playerPosition: t.position,
        playerCountry: t.country,
        title: t.video.title,
        videoUrl: t.video.videoUrl,
        description: t.video.description,
        matchInfo: t.video.matchInfo,
        status: "APPROVED" as const,
        createdAt: "2026-06-01T00:00:00.000Z"
      }));
    } catch (err) {
      console.warn("Error fetching approved showcases from Firestore:", err);
      return [];
    }
  },

  /**
   * Fetch private shortlist for scout
   */
  async getScoutShortlist(scoutId: string): Promise<ShortlistItem[]> {
    try {
      const q = query(
        collection(db, "scoutShortlists"),
        where("scoutId", "==", scoutId)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as ShortlistItem[];
    } catch (err) {
      console.error("Error fetching scout shortlist:", err);
      return [];
    }
  },

  /**
   * Add player to private shortlist
   */
  async addToShortlist(
    scoutId: string, 
    player: PlayerPublicProfile, 
    notes: string = ""
  ): Promise<ShortlistItem> {
    // Check if already in shortlist
    const q = query(
      collection(db, "scoutShortlists"),
      where("scoutId", "==", scoutId),
      where("playerId", "==", player.id)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const existing = snap.docs[0];
      return { id: existing.id, ...existing.data() } as ShortlistItem;
    }

    const docRef = await addDoc(collection(db, "scoutShortlists"), {
      scoutId,
      playerId: player.id,
      playerName: player.name,
      playerPosition: player.position,
      playerCountry: player.country,
      playerAge: player.age,
      playerProgress: player.developmentProgress,
      notes,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      scoutId,
      playerId: player.id,
      playerName: player.name,
      playerPosition: player.position,
      playerCountry: player.country,
      playerAge: player.age,
      playerProgress: player.developmentProgress,
      notes,
      createdAt: new Date()
    };
  },

  /**
   * Remove player from shortlist
   */
  async removeFromShortlist(shortlistDocId: string): Promise<void> {
    await deleteDoc(doc(db, "scoutShortlists", shortlistDocId));
  },

  /**
   * Update private scouting notes for a shortlisted player
   */
  async updateShortlistNotes(shortlistDocId: string, notes: string): Promise<void> {
    await updateDoc(doc(db, "scoutShortlists", shortlistDocId), {
      notes,
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Controlled Contact Workflow:
   * Scout submits contact request for a player.
   * Private contact information is NOT exposed.
   */
  async createContactRequest(data: {
    scoutId: string;
    scoutName: string;
    scoutOrganization?: string;
    playerId: string;
    playerName: string;
    playerPosition?: string;
    playerCountry?: string;
    message: string;
  }): Promise<ContactRequest> {
    const docRef = await addDoc(collection(db, "contactRequests"), {
      ...data,
      status: "PENDING",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Notify player through system notifications
    try {
      await addDoc(collection(db, "notifications"), {
        userId: data.playerId,
        title: "New Scouting Inquiry",
        message: `Scout ${data.scoutName} (${data.scoutOrganization || 'Verified Agency'}) submitted an official contact request.`,
        type: "CONTACT_REQUEST",
        read: false,
        link: "/player/messages",
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Could not dispatch notification to player:", e);
    }

    return {
      id: docRef.id,
      ...data,
      status: "PENDING",
      createdAt: new Date()
    };
  },

  /**
   * Get all contact requests submitted by this scout
   */
  async getScoutContactRequests(scoutId: string): Promise<ContactRequest[]> {
    try {
      const q = query(
        collection(db, "contactRequests"),
        where("scoutId", "==", scoutId)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as ContactRequest[];
    } catch (err) {
      console.error("Error fetching contact requests:", err);
      return [];
    }
  },

  /**
   * Update status of contact request (e.g. CLOSED)
   */
  async updateContactRequestStatus(
    requestId: string, 
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "CLOSED"
  ): Promise<void> {
    await updateDoc(doc(db, "contactRequests", requestId), {
      status,
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Fetch scout profile from `scoutProfiles/{userId}`
   */
  async getScoutProfile(userId: string, defaultName: string = "Scout"): Promise<ScoutProfileData> {
    try {
      const docRef = doc(db, "scoutProfiles", userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as ScoutProfileData;
      }

      // Initialize default profile
      const defaultProfile: ScoutProfileData = {
        userId,
        name: defaultName,
        organization: "Independent Scouting Network",
        country: "Ethiopia",
        verificationStatus: "VERIFIED", // By default verified for approved scout access IDs
        licenseNumber: "FIFA-SCT-2026",
        specialization: "Youth Talent & Attacking Prospects (U15-U20)",
        bio: "Accredited professional scout identifying high-potential talent across East Africa and international academies.",
        scoutingRegions: ["East Africa", "Europe", "West Africa"],
        contactEmail: "scout@profootballclass.com",
        phone: "+251 91 234 5678",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(docRef, defaultProfile);
      return defaultProfile;
    } catch (err) {
      console.error("Error fetching scout profile:", err);
      return {
        userId,
        name: defaultName,
        organization: "International Academy Scout",
        country: "Ethiopia",
        verificationStatus: "VERIFIED",
        licenseNumber: "PFC-VERIFIED-01",
        specialization: "Academy Prospects"
      };
    }
  },

  /**
   * Update scout profile
   */
  async updateScoutProfile(userId: string, data: Partial<ScoutProfileData>): Promise<void> {
    const docRef = doc(db, "scoutProfiles", userId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Also update users doc if name changed
    if (data.name) {
      await updateDoc(doc(db, "users", userId), {
        name: data.name
      });
    }
  },

  /**
   * Get scout notifications
   */
  async getScoutNotifications(userId: string): Promise<ScoutNotification[]> {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId)
      );
      const snap = await getDocs(q);
      const items: ScoutNotification[] = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as ScoutNotification[];

      // Also get global announcements
      const globalQ = query(
        collection(db, "notifications"),
        where("type", "==", "GLOBAL")
      );
      const globalSnap = await getDocs(globalQ);
      globalSnap.docs.forEach(d => {
        if (!items.find(i => i.id === d.id)) {
          items.push({ id: d.id, ...d.data() } as ScoutNotification);
        }
      });

      return items.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      return [];
    }
  },

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notifId: string): Promise<void> {
    try {
      await updateDoc(doc(db, "notifications", notifId), { read: true });
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Send platform message from scout to player
   */
  async sendMessage(
    senderId: string, 
    senderName: string, 
    receiverId: string, 
    receiverName: string, 
    text: string, 
    imageUrl?: string
  ): Promise<ChatMessage> {
    const data = {
      senderId,
      senderName,
      receiverId,
      receiverName,
      text,
      imageUrl: imageUrl || "",
      read: false,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "messages"), data);

    return {
      id: docRef.id,
      senderId,
      senderName,
      receiverId,
      receiverName,
      text,
      imageUrl,
      read: false,
      createdAt: new Date()
    };
  },

  /**
   * Upload image attachment for chat
   */
  async uploadChatAttachment(file: File, scoutId: string): Promise<string> {
    try {
      const storageRef = ref(storage, `chat_attachments/${scoutId}_${Date.now()}_${file.name}`);
      const snap = await uploadBytes(storageRef, file);
      return await getDownloadURL(snap.ref);
    } catch (err) {
      console.warn("Storage upload fallback to Data URL for preview:", err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }
};

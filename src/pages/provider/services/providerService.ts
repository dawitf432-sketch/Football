import { db, storage } from "../../../lib/firebase";
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
  limit,
  writeBatch
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  Scholarship, 
  ScholarshipApplication, 
  ProviderProfile, 
  ProviderShortlist, 
  ProviderNotification, 
  ChatMessage, 
  PlayerPublicProfile,
  ShowcaseVideo,
  ApplicationStatus,
  ScholarshipStatus
} from "../../../types";

// Seed discoverable prospects if collection is empty
const INITIAL_TALENTS: Array<Omit<PlayerPublicProfile, "id"> & { video?: any }> = [
  {
    userId: "player_seed_1",
    name: "Samuel Bekele",
    country: "Ethiopia",
    countryCode: "ET",
    age: 17,
    position: "Winger",
    secondaryPosition: "Striker",
    preferredFoot: "Left",
    location: "Addis Ababa, Ethiopia",
    bio: "Pacey inverted winger with exceptional 1v1 dribbling agility, rapid acceleration on counter-attacks, and clinical finishing from cutbacks. Top scorer in the U17 Regional Cup.",
    skills: { ballControl: 88, passing: 81, shooting: 84, dribbling: 91, tackling: 54, vision: 83, overall: 85 },
    athleticism: { pace: 93, stamina: 85, agility: 92, strength: 74, jumping: 78, overall: 87 },
    developmentLevel: "Pre-Pro",
    developmentProgress: 88,
    discoverable: true,
    profileStatus: "APPROVED",
    video: {
      title: "U17 Regional Cup - Hat-trick & High-Speed Take-ons",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Match highlights showcasing Samuel's dynamic inside cuts and 3 goals against Hawassa City Youth.",
      matchInfo: { competition: "Ethiopian Youth Premier League", opponent: "Hawassa City Youth", matchDate: "2026-05-18", minute: "24', 58', 81'" }
    }
  },
  {
    userId: "player_seed_2",
    name: "Dawit Haile",
    country: "Ethiopia",
    countryCode: "ET",
    age: 18,
    position: "Midfielder",
    secondaryPosition: "Midfielder",
    preferredFoot: "Right",
    location: "Dire Dawa, Ethiopia",
    bio: "Deep-lying playmaker with elite tactical awareness, progressive line-breaking passes, and high defensive work rate in transition. Fluent in English and Amharic.",
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
    userId: "player_seed_3",
    name: "Marcus Thorne",
    country: "United Kingdom",
    countryCode: "GB",
    age: 18,
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
    userId: "player_seed_4",
    name: "Kofi Mensah",
    country: "Ghana",
    countryCode: "GH",
    age: 17,
    position: "Defender",
    secondaryPosition: "Defender",
    preferredFoot: "Right",
    location: "Accra, Ghana",
    bio: "Commanding center back with superior positional discipline, 1v1 ground duel efficiency, and accurate long-range diagonals to wingers.",
    skills: { ballControl: 79, passing: 83, shooting: 55, dribbling: 72, tackling: 92, vision: 81, overall: 83 },
    athleticism: { pace: 86, stamina: 88, agility: 81, strength: 93, jumping: 94, overall: 90 },
    developmentLevel: "Youth Elite",
    developmentProgress: 86,
    discoverable: true,
    profileStatus: "APPROVED",
    video: {
      title: "Defensive Rock - Last Ditch Tackles & Aerial Duels",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Dominant defensive display against Right to Dream Academy with 9 aerial wins and zero fouls conceded.",
      matchInfo: { competition: "West African Youth Championship", opponent: "Right to Dream", matchDate: "2026-03-29", minute: "Full Match" }
    }
  },
  {
    userId: "player_seed_5",
    name: "Mateo Silva",
    country: "Spain",
    countryCode: "ES",
    age: 16,
    position: "Goalkeeper",
    secondaryPosition: "Goalkeeper",
    preferredFoot: "Right",
    location: "Valencia, Spain",
    bio: "Modern sweeper keeper with extraordinary reflexes, brave 1v1 shot-stopping, and accurate distribution under heavy press.",
    skills: { ballControl: 84, passing: 85, shooting: 40, dribbling: 68, tackling: 65, vision: 88, overall: 85 },
    athleticism: { pace: 78, stamina: 82, agility: 91, strength: 80, jumping: 92, overall: 86 },
    developmentLevel: "Youth Elite",
    developmentProgress: 82,
    discoverable: true,
    profileStatus: "APPROVED",
    video: {
      title: "Penalty Save & Point Blank Double Stop",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Decisive match-winning performance in the Copa de Campeones Juvenil semifinals.",
      matchInfo: { competition: "Copa Juvenil", opponent: "Villarreal U17", matchDate: "2026-05-04", minute: "73', 89'" }
    }
  }
];

export const providerService = {
  // ==================== 1. ORGANIZATION PROFILE ====================
  async getProviderProfile(uid: string): Promise<ProviderProfile | null> {
    try {
      const docRef = doc(db, "providerProfiles", uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { userId: uid, ...snap.data() } as ProviderProfile;
      }

      // Check users collection as fallback
      const userDoc = await getDoc(doc(db, "users", uid));
      const userData = userDoc.exists() ? userDoc.data() : null;

      const initialProfile: ProviderProfile = {
        userId: uid,
        organizationName: userData?.name || "Global Football Foundation",
        country: userData?.country || "International",
        location: "Geneva / London",
        description: "Empowering talented youth footballers through fully-funded international scholarships, education, and professional development pathways.",
        website: "https://profootballclass.com/scholarships",
        contactEmail: userData?.email || "scholarships@profootballclass.com",
        phone: "+41 22 819 0000",
        accreditationNumber: "PFC-ACCR-2026-09",
        verificationStatus: "VERIFIED", // Automatically verify default coordinator
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(docRef, initialProfile);
      return initialProfile;
    } catch (error) {
      console.error("Error fetching provider profile:", error);
      return null;
    }
  },

  async updateProviderProfile(uid: string, data: Partial<ProviderProfile>): Promise<void> {
    const docRef = doc(db, "providerProfiles", uid);
    await setDoc(docRef, {
      ...data,
      userId: uid,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  async uploadLogo(uid: string, file: File): Promise<string> {
    try {
      const fileRef = ref(storage, `logos/${uid}_${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    } catch (err) {
      console.warn("Storage upload fallback to base64 for preview:", err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  },

  // ==================== 2. SCHOLARSHIPS CRUD ====================
  async getScholarships(providerId: string): Promise<Scholarship[]> {
    try {
      const q = query(
        collection(db, "scholarships"),
        where("providerId", "==", providerId),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const scholarships: Scholarship[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Scholarship));
      
      // Calculate real application counts for each scholarship
      for (const s of scholarships) {
        try {
          const appQ = query(collection(db, "applications"), where("scholarshipId", "==", s.id));
          const appSnap = await getDocs(appQ);
          s.applicationsCount = appSnap.size;
        } catch (e) {
          s.applicationsCount = 0;
        }
      }

      return scholarships;
    } catch (error) {
      console.error("Error getting scholarships:", error);
      // Fallback query without orderBy in case index is pending
      try {
        const q2 = query(collection(db, "scholarships"), where("providerId", "==", providerId));
        const snap2 = await getDocs(q2);
        return snap2.docs.map(d => ({ id: d.id, ...d.data() } as Scholarship));
      } catch (e2) {
        return [];
      }
    }
  },

  async createScholarship(data: Omit<Scholarship, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const colRef = collection(db, "scholarships");
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Create a notification for the provider
    try {
      await addDoc(collection(db, "notifications"), {
        userId: data.providerId,
        title: "Scholarship Created",
        message: `"${data.title}" has been successfully saved with status ${data.status}.`,
        type: "ANNOUNCEMENT",
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (e) {}

    return docRef.id;
  },

  async updateScholarship(id: string, updates: Partial<Scholarship>): Promise<void> {
    const docRef = doc(db, "scholarships", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async updateScholarshipStatus(id: string, status: ScholarshipStatus): Promise<void> {
    const docRef = doc(db, "scholarships", id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
  },

  async deleteScholarship(id: string): Promise<void> {
    const docRef = doc(db, "scholarships", id);
    await deleteDoc(docRef);
  },

  // ==================== 3. APPLICATIONS ====================
  async getApplications(providerId: string, scholarshipId?: string): Promise<ScholarshipApplication[]> {
    try {
      let q = scholarshipId 
        ? query(collection(db, "applications"), where("providerId", "==", providerId), where("scholarshipId", "==", scholarshipId))
        : query(collection(db, "applications"), where("providerId", "==", providerId));
      
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ScholarshipApplication));
      // Sort newest first
      return list.sort((a, b) => {
        const tA = a.appliedAt?.seconds ? a.appliedAt.seconds * 1000 : new Date(a.appliedAt || 0).getTime();
        const tB = b.appliedAt?.seconds ? b.appliedAt.seconds * 1000 : new Date(b.appliedAt || 0).getTime();
        return tB - tA;
      });
    } catch (error) {
      console.error("Error getting applications:", error);
      return [];
    }
  },

  async updateApplicationStatus(
    applicationId: string, 
    status: ApplicationStatus, 
    providerNotes?: string,
    applicantData?: { playerId: string; scholarshipTitle: string; providerName: string }
  ): Promise<void> {
    const docRef = doc(db, "applications", applicationId);
    const updates: any = {
      status,
      updatedAt: serverTimestamp()
    };
    if (providerNotes !== undefined) {
      updates.providerNotes = providerNotes;
    }
    await updateDoc(docRef, updates);

    // Notify player if applicantData provided
    if (applicantData?.playerId) {
      try {
        await addDoc(collection(db, "notifications"), {
          userId: applicantData.playerId,
          title: `Application ${status.replace("_", " ")}`,
          message: `Your scholarship application for "${applicantData.scholarshipTitle}" was updated to: ${status}.`,
          type: "STATUS_UPDATE",
          read: false,
          createdAt: serverTimestamp()
        });
      } catch (e) {}
    }
  },

  // ==================== 4. PLAYER DISCOVERY ====================
  async getDiscoverablePlayers(filters?: {
    country?: string;
    position?: string;
    preferredFoot?: string;
    developmentLevel?: string;
    minAge?: number;
    maxAge?: number;
    searchQuery?: string;
  }): Promise<PlayerPublicProfile[]> {
    try {
      let q = query(
        collection(db, "playerProfiles"),
        where("discoverable", "==", true),
        where("profileStatus", "==", "APPROVED")
      );
      let snap = await getDocs(q);

      // If database has no discoverable players yet, seed realistic talents
      if (snap.empty) {
        await this.seedDiscoverableTalents();
        snap = await getDocs(q);
      }

      let players: PlayerPublicProfile[] = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as PlayerPublicProfile));

      // Apply client-side filters for maximum flexibility
      if (filters) {
        if (filters.country && filters.country !== "ALL") {
          players = players.filter(p => p.country?.toLowerCase() === filters.country?.toLowerCase());
        }
        if (filters.position && filters.position !== "ALL") {
          players = players.filter(p => p.position?.toLowerCase() === filters.position?.toLowerCase());
        }
        if (filters.preferredFoot && filters.preferredFoot !== "ALL") {
          players = players.filter(p => p.preferredFoot?.toLowerCase() === filters.preferredFoot?.toLowerCase());
        }
        if (filters.developmentLevel && filters.developmentLevel !== "ALL") {
          players = players.filter(p => p.developmentLevel?.toLowerCase() === filters.developmentLevel?.toLowerCase());
        }
        if (filters.minAge) {
          players = players.filter(p => (p.age || 0) >= (filters.minAge || 0));
        }
        if (filters.maxAge) {
          players = players.filter(p => (p.age || 0) <= (filters.maxAge || 99));
        }
        if (filters.searchQuery) {
          const qStr = filters.searchQuery.toLowerCase().trim();
          players = players.filter(p => 
            p.name?.toLowerCase().includes(qStr) || 
            p.country?.toLowerCase().includes(qStr) ||
            p.position?.toLowerCase().includes(qStr) ||
            p.bio?.toLowerCase().includes(qStr)
          );
        }
      }

      return players;
    } catch (error) {
      console.error("Error fetching discoverable players:", error);
      return [];
    }
  },

  async getPlayerShowcases(playerId: string): Promise<ShowcaseVideo[]> {
    try {
      const q = query(
        collection(db, "showcases"),
        where("playerId", "==", playerId),
        where("status", "==", "APPROVED")
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ShowcaseVideo));
    } catch (e) {
      console.error("Error fetching showcases for player:", e);
      return [];
    }
  },

  async seedDiscoverableTalents(): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const talent of INITIAL_TALENTS) {
        const playerRef = doc(db, "playerProfiles", talent.userId);
        const { video, ...playerData } = talent;
        batch.set(playerRef, {
          ...playerData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        if (video) {
          const videoRef = doc(collection(db, "showcases"));
          batch.set(videoRef, {
            playerId: talent.userId,
            playerName: talent.name,
            playerPosition: talent.position,
            playerCountry: talent.country,
            title: video.title,
            videoUrl: video.videoUrl,
            description: video.description,
            matchInfo: video.matchInfo,
            status: "APPROVED",
            createdAt: serverTimestamp()
          });
        }
      }
      await batch.commit();
    } catch (e) {
      console.error("Failed to seed discoverable talents:", e);
    }
  },

  // ==================== 5. SHORTLIST ====================
  async getShortlist(providerId: string): Promise<ProviderShortlist[]> {
    try {
      const q = query(
        collection(db, "providerShortlists"),
        where("providerId", "==", providerId)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ProviderShortlist));
    } catch (error) {
      console.error("Error fetching shortlist:", error);
      return [];
    }
  },

  async addToShortlist(providerId: string, player: PlayerPublicProfile, notes: string = ""): Promise<string> {
    // Check if already shortlisted
    const q = query(
      collection(db, "providerShortlists"),
      where("providerId", "==", providerId),
      where("playerId", "==", player.userId || player.id)
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
      return existing.docs[0].id;
    }

    const docRef = await addDoc(collection(db, "providerShortlists"), {
      providerId,
      playerId: player.userId || player.id,
      playerName: player.name,
      playerCountry: player.country,
      playerCountryCode: player.countryCode || "GLOBAL",
      playerAge: player.age,
      playerPosition: player.position,
      playerPreferredFoot: player.preferredFoot || "Right",
      playerDevelopmentLevel: player.developmentLevel || "Academy",
      notes: notes || "Shortlisted candidate for international scholarship pathway.",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  },

  async removeFromShortlist(shortlistDocId: string): Promise<void> {
    await deleteDoc(doc(db, "providerShortlists", shortlistDocId));
  },

  async updateShortlistNotes(shortlistDocId: string, notes: string): Promise<void> {
    await updateDoc(doc(db, "providerShortlists", shortlistDocId), {
      notes,
      updatedAt: serverTimestamp()
    });
  },

  // ==================== 6. MESSAGING ====================
  async getConversations(providerId: string): Promise<Array<{
    participantId: string;
    participantName: string;
    lastMessage: string;
    lastTimestamp: any;
    unreadCount: number;
  }>> {
    try {
      // Get all messages where provider is sender or receiver
      const q1 = query(collection(db, "messages"), where("senderId", "==", providerId));
      const q2 = query(collection(db, "messages"), where("receiverId", "==", providerId));

      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      const allMsgs = [...snap1.docs, ...snap2.docs].map(d => ({ id: d.id, ...d.data() } as ChatMessage));

      const map = new Map<string, {
        participantId: string;
        participantName: string;
        lastMessage: string;
        lastTimestamp: any;
        unreadCount: number;
      }>();

      for (const m of allMsgs) {
        const otherId = m.senderId === providerId ? m.receiverId : m.senderId;
        const otherName = m.senderId === providerId ? (m.receiverName || "Applicant Player") : (m.senderName || "Player");

        const isUnread = m.receiverId === providerId && !m.read;

        const existing = map.get(otherId);
        const mTime = m.createdAt?.seconds ? m.createdAt.seconds * 1000 : new Date(m.createdAt || 0).getTime();
        const existingTime = existing?.lastTimestamp?.seconds ? existing.lastTimestamp.seconds * 1000 : new Date(existing?.lastTimestamp || 0).getTime();

        if (!existing || mTime > existingTime) {
          map.set(otherId, {
            participantId: otherId,
            participantName: otherName,
            lastMessage: m.text || (m.imageUrl ? "📷 [Image attachment]" : ""),
            lastTimestamp: m.createdAt,
            unreadCount: (existing?.unreadCount || 0) + (isUnread ? 1 : 0)
          });
        } else if (isUnread && existing) {
          existing.unreadCount += 1;
        }
      }

      return Array.from(map.values()).sort((a, b) => {
        const tA = a.lastTimestamp?.seconds ? a.lastTimestamp.seconds * 1000 : new Date(a.lastTimestamp || 0).getTime();
        const tB = b.lastTimestamp?.seconds ? b.lastTimestamp.seconds * 1000 : new Date(b.lastTimestamp || 0).getTime();
        return tB - tA;
      });
    } catch (e) {
      console.error("Error loading conversations:", e);
      return [];
    }
  },

  async getMessagesBetween(providerId: string, playerId: string): Promise<ChatMessage[]> {
    try {
      const q1 = query(
        collection(db, "messages"),
        where("senderId", "==", providerId),
        where("receiverId", "==", playerId)
      );
      const q2 = query(
        collection(db, "messages"),
        where("senderId", "==", playerId),
        where("receiverId", "==", providerId)
      );

      const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      const combined = [...s1.docs, ...s2.docs].map(d => ({ id: d.id, ...d.data() } as ChatMessage));

      return combined.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
        return tA - tB;
      });
    } catch (e) {
      console.error("Error fetching message history:", e);
      return [];
    }
  },

  async sendMessage(params: {
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    text: string;
    imageUrl?: string;
  }): Promise<string> {
    const docRef = await addDoc(collection(db, "messages"), {
      ...params,
      read: false,
      createdAt: serverTimestamp()
    });

    // Notify receiver
    try {
      await addDoc(collection(db, "notifications"), {
        userId: params.receiverId,
        title: `Message from ${params.senderName}`,
        message: params.text ? (params.text.length > 80 ? params.text.slice(0, 80) + "..." : params.text) : "Sent an attachment",
        type: "MESSAGE",
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (e) {}

    return docRef.id;
  },

  async uploadMessageAttachment(senderId: string, file: File): Promise<string> {
    try {
      const fileRef = ref(storage, `messages/${senderId}_${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    } catch (err) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  },

  async markConversationAsRead(providerId: string, senderPlayerId: string): Promise<void> {
    try {
      const q = query(
        collection(db, "messages"),
        where("senderId", "==", senderPlayerId),
        where("receiverId", "==", providerId),
        where("read", "==", false)
      );
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach(d => {
        batch.update(d.ref, { read: true });
      });
      await batch.commit();
    } catch (e) {
      console.error("Error marking messages read:", e);
    }
  },

  // ==================== 7. NOTIFICATIONS ====================
  async getNotifications(userId: string): Promise<ProviderNotification[]> {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProviderNotification));
      return list.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
        return tB - tA;
      });
    } catch (e) {
      console.error("Error fetching notifications:", e);
      return [];
    }
  },

  async markNotificationRead(id: string): Promise<void> {
    await updateDoc(doc(db, "notifications", id), { read: true });
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => {
      batch.update(d.ref, { read: true });
    });
    await batch.commit();
  },

  // ==================== 8. SEED INITIAL PROVIDER DATA ====================
  async seedInitialProviderDataIfEmpty(providerId: string, orgName: string): Promise<void> {
    try {
      const existing = await getDocs(query(collection(db, "scholarships"), where("providerId", "==", providerId)));
      if (!existing.empty) return;

      const batch = writeBatch(db);

      // 1. Create a Published Scholarship
      const sch1Ref = doc(collection(db, "scholarships"));
      const sch1: Omit<Scholarship, "id"> = {
        providerId,
        organizationName: orgName || "Global Football Foundation",
        title: "2026 Elite European Academy Full Tuition & Residential Scholarship",
        description: "Fully sponsored 1-year residency scholarship covering elite academy football training, UEFA pro coaching, academic schooling, accommodation, nutrition, and international showcase tournaments.",
        country: "Spain",
        location: "Valencia Elite Campus, Spain",
        ageRequirements: "16 - 19 Years",
        minAge: 16,
        maxAge: 19,
        eligiblePositions: ["Midfielder", "Winger", "Striker", "Defender", "Goalkeeper"],
        playerRequirements: "Demonstrated competitive match experience, high coach evaluation score, disciplinary clearance, and commitment to academic curriculum.",
        benefits: [
          "100% Full Academy Tuition & Coaching Fees",
          "Residential Boarding & Professional Athlete Nutrition",
          "Official Match Kit, Training Apparel & GPS Tracking",
          "Direct Scouting Showcases with La Liga & Segunda Division Clubs",
          "Accredited Secondary / Higher Education Program"
        ],
        applicationDeadline: "2026-11-30",
        availablePlaces: 4,
        applicationInstructions: "Submit your player bio, verified showcase video reels, academic transcripts, and a brief statement on your football ambitions.",
        status: "PUBLISHED",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      batch.set(sch1Ref, sch1);

      // 2. Create a Draft Scholarship
      const sch2Ref = doc(collection(db, "scholarships"));
      const sch2: Omit<Scholarship, "id"> = {
        providerId,
        organizationName: orgName || "Global Football Foundation",
        title: "Premier UK Summer Trial & Showcase Intensive (Under-20)",
        description: "Intensive 6-week summer program in London offering specialized position training, athletic conditioning, and friendly matches against UK youth professional academies.",
        country: "United Kingdom",
        location: "London, UK",
        ageRequirements: "17 - 20 Years",
        minAge: 17,
        maxAge: 20,
        eligiblePositions: ["Midfielder", "Defender", "Winger"],
        playerRequirements: "High technical competence in ball distribution, clean physical medical certificate, and passport eligibility.",
        benefits: [
          "Full Accommodation & Meals in London",
          "Friendly Fixtures against Academy Select Teams",
          "Physical Performance Lab Testing & Recovery Suites",
          "Individual Video Tactical Analysis"
        ],
        applicationDeadline: "2026-12-15",
        availablePlaces: 8,
        applicationInstructions: "Provide recent full match recordings and letter of recommendation from your club or academy director.",
        status: "DRAFT",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      batch.set(sch2Ref, sch2);

      // 3. Create initial applicant submissions from seeded discoverable players
      const app1Ref = doc(collection(db, "applications"));
      batch.set(app1Ref, {
        scholarshipId: sch1Ref.id,
        scholarshipTitle: sch1.title,
        providerId,
        playerId: "player_seed_1",
        playerName: "Samuel Bekele",
        playerCountry: "Ethiopia",
        playerCountryCode: "ET",
        playerAge: 17,
        playerPosition: "Winger",
        playerPreferredFoot: "Left",
        playerDevelopmentLevel: "Pre-Pro",
        playerBio: "Pacey inverted winger with exceptional 1v1 dribbling agility, rapid acceleration on counter-attacks, and clinical finishing from cutbacks.",
        personalStatement: "Football is my life and passion. I have dedicated every single day to refining my left-foot delivery, acceleration, and game IQ. Earning this scholarship in Spain would allow me to represent my nation with pride.",
        guardianConsent: true,
        academicGrade: "A- (High School Senior)",
        videoShowcaseUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "UNDER_REVIEW",
        providerNotes: "Excellent video highlights. Sprint pace tested at 93. Strong candidate for winger spot.",
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const app2Ref = doc(collection(db, "applications"));
      batch.set(app2Ref, {
        scholarshipId: sch1Ref.id,
        scholarshipTitle: sch1.title,
        providerId,
        playerId: "player_seed_2",
        playerName: "Dawit Haile",
        playerCountry: "Ethiopia",
        playerCountryCode: "ET",
        playerAge: 18,
        playerPosition: "Midfielder",
        playerPreferredFoot: "Right",
        playerDevelopmentLevel: "Youth Elite",
        playerBio: "Deep-lying playmaker with elite tactical awareness, progressive line-breaking passes, and high defensive work rate in transition.",
        personalStatement: "I aim to master European tactical discipline. My dream is to develop into a world-class holding midfielder who can dictate the tempo of modern high-intensity football.",
        guardianConsent: true,
        academicGrade: "Straight A's (Honor Roll)",
        videoShowcaseUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "SHORTLISTED",
        providerNotes: "High football intelligence and vision score (90). Academic record is outstanding.",
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const app3Ref = doc(collection(db, "applications"));
      batch.set(app3Ref, {
        scholarshipId: sch1Ref.id,
        scholarshipTitle: sch1.title,
        providerId,
        playerId: "player_seed_4",
        playerName: "Kofi Mensah",
        playerCountry: "Ghana",
        playerCountryCode: "GH",
        playerAge: 17,
        playerPosition: "Defender",
        playerPreferredFoot: "Right",
        playerDevelopmentLevel: "Youth Elite",
        playerBio: "Commanding center back with superior positional discipline, 1v1 ground duel efficiency, and accurate long-range diagonals to wingers.",
        personalStatement: "I want to test my strength, positioning, and aerial skills against the best strikers in the world. I lead by example on and off the pitch.",
        guardianConsent: true,
        academicGrade: "B+",
        videoShowcaseUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "SUBMITTED",
        providerNotes: "",
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 4. Initial notification
      const notifRef = doc(collection(db, "notifications"));
      batch.set(notifRef, {
        userId: providerId,
        title: "Welcome to Scholarship Provider Portal",
        message: "Your organization account is ready. 3 applicant dossiers have been submitted for your review.",
        type: "APPLICATION",
        read: false,
        createdAt: serverTimestamp()
      });

      // 5. Initial message thread
      const msgRef = doc(collection(db, "messages"));
      batch.set(msgRef, {
        senderId: "player_seed_1",
        senderName: "Samuel Bekele",
        receiverId: providerId,
        receiverName: orgName || "Scholarship Committee",
        text: "Honored Committee, thank you for considering my application. I have uploaded my latest match recording for your review.",
        read: false,
        createdAt: serverTimestamp()
      });

      await batch.commit();
    } catch (e) {
      console.error("Error seeding initial provider data:", e);
    }
  }
};

import { db, storage } from "./firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  increment 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  Conversation, 
  ChatMessage, 
  ConversationParticipant, 
  ConversationType, 
  UserRole, 
  ConversationReport 
} from "../types";
import { notificationService } from "./notificationService";

const MAX_ATTACHMENT_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const messagingService = {
  /**
   * Helper to generate a deterministic ID for a pair of participants
   */
  getConversationIdForPair(uidA: string, uidB: string): string {
    return [uidA, uidB].sort().join("_");
  },

  /**
   * Check if a conversation between these two users is authorized
   * - Player ↔ Coach: Allowed
   * - Player ↔ Admin: Allowed
   * - Coach ↔ Admin: Allowed
   * - Player ↔ Scout: Requires ACCEPTED contactRequest
   * - Player ↔ Provider: Requires ACCEPTED contactRequest
   */
  async verifyMessagingAuthorization(params: {
    userAId: string;
    userARole: UserRole;
    userBId: string;
    userBRole: UserRole;
    contactRequestId?: string;
  }): Promise<{ authorized: boolean; reason?: string }> {
    const roles = [params.userARole, params.userBRole];

    // Admin can converse with any role
    if (roles.includes("ADMIN")) {
      return { authorized: true };
    }

    // Player ↔ Coach
    if (roles.includes("PLAYER") && roles.includes("COACH")) {
      return { authorized: true };
    }

    // Player ↔ Scout or Player ↔ Scholarship Provider
    if (
      (roles.includes("PLAYER") && roles.includes("SCOUT")) ||
      (roles.includes("PLAYER") && roles.includes("SCHOLARSHIP_PROVIDER"))
    ) {
      // Check for an accepted contact request between these two users
      try {
        const q1 = query(
          collection(db, "contactRequests"),
          where("status", "==", "ACCEPTED")
        );
        const snap = await getDocs(q1);
        const hasAccepted = snap.docs.some((d) => {
          const data = d.data();
          const pId = data.targetPlayerId || data.playerId;
          const sId = data.senderId || data.scoutId;
          return (
            (pId === params.userAId && sId === params.userBId) ||
            (pId === params.userBId && sId === params.userAId)
          );
        });

        if (hasAccepted) {
          return { authorized: true };
        } else {
          return {
            authorized: false,
            reason: "Messaging is locked. An official Contact Request must be submitted and accepted by the athlete first."
          };
        }
      } catch (err) {
        console.warn("Error verifying contact authorization:", err);
        return { authorized: true }; // Permissive fallback if offline
      }
    }

    // General fallback
    return { authorized: true };
  },

  /**
   * Get or create a private conversation thread between two authorized participants
   */
  async getOrCreateConversation(params: {
    currentUserId: string;
    currentUserName: string;
    currentUserRole: UserRole;
    targetUserId: string;
    targetUserName: string;
    targetUserRole: UserRole;
    targetUserOrg?: string;
    targetUserCountry?: string;
    contactRequestId?: string;
    type?: ConversationType;
  }): Promise<Conversation> {
    const convId = this.getConversationIdForPair(params.currentUserId, params.targetUserId);
    const convRef = doc(db, "conversations", convId);
    const existingSnap = await getDoc(convRef);

    if (existingSnap.exists()) {
      return { id: existingSnap.id, ...existingSnap.data() } as Conversation;
    }

    // Infer conversation type
    let inferredType: ConversationType = params.type || "GENERAL";
    const roles = [params.currentUserRole, params.targetUserRole];
    if (roles.includes("PLAYER") && roles.includes("COACH")) inferredType = "PLAYER_COACH";
    else if (roles.includes("PLAYER") && roles.includes("ADMIN")) inferredType = "PLAYER_ADMIN";
    else if (roles.includes("PLAYER") && roles.includes("SCOUT")) inferredType = "PLAYER_SCOUT";
    else if (roles.includes("PLAYER") && roles.includes("SCHOLARSHIP_PROVIDER")) inferredType = "PLAYER_PROVIDER";
    else if (roles.includes("COACH") && roles.includes("ADMIN")) inferredType = "COACH_ADMIN";

    const participantA: ConversationParticipant = {
      uid: params.currentUserId,
      name: params.currentUserName,
      role: params.currentUserRole
    };

    const participantB: ConversationParticipant = {
      uid: params.targetUserId,
      name: params.targetUserName,
      role: params.targetUserRole,
      organization: params.targetUserOrg || "",
      country: params.targetUserCountry || ""
    };

    const newConversation: any = {
      participantIds: [params.currentUserId, params.targetUserId],
      participants: {
        [params.currentUserId]: participantA,
        [params.targetUserId]: participantB
      },
      type: inferredType,
      contactRequestId: params.contactRequestId || "",
      status: "ACTIVE",
      unreadCounts: {
        [params.currentUserId]: 0,
        [params.targetUserId]: 0
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(convRef, newConversation);

    return {
      id: convId,
      ...newConversation,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },

  /**
   * Subscribe to real-time conversation threads for a specific user
   */
  subscribeToUserConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ) {
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, "conversations"),
      where("participantIds", "array-contains", userId)
    );

    return onSnapshot(q, (snapshot) => {
      const list: Conversation[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Conversation);
      });

      // Sort by updatedAt descending
      list.sort((a, b) => {
        const tA = a.updatedAt?.seconds ? a.updatedAt.seconds * 1000 : (a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0);
        const tB = b.updatedAt?.seconds ? b.updatedAt.seconds * 1000 : (b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0);
        return tB - tA;
      });

      callback(list);
    }, (err) => {
      console.warn("Conversations subscription warning:", err);
      callback([]);
    });
  },

  /**
   * Subscribe to real-time messages within a conversation thread
   */
  subscribeToMessages(
    conversationId: string,
    callback: (messages: ChatMessage[]) => void
  ) {
    if (!conversationId) {
      callback([]);
      return () => {};
    }

    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
      const list: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
      });
      callback(list);
    }, (err) => {
      console.warn("Messages subscription error, fallback without ordering:", err);
      const fallbackQuery = collection(db, "conversations", conversationId, "messages");
      onSnapshot(fallbackQuery, (snap) => {
        const list: ChatMessage[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ChatMessage));
        list.sort((a, b) => {
          const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
          const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
          return tA - tB;
        });
        callback(list);
      }, () => callback([]));
    });
  },

  /**
   * Send a text message and/or image attachment in a conversation thread
   */
  async sendMessage(params: {
    conversationId: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    recipientId: string;
    text: string;
    imageFile?: File | null;
  }): Promise<ChatMessage> {
    const { conversationId, senderId, senderName, senderRole, recipientId, text, imageFile } = params;

    if (!text.trim() && !imageFile) {
      throw new Error("Cannot send an empty message.");
    }

    // Verify conversation isn't blocked
    const convRef = doc(db, "conversations", conversationId);
    const convSnap = await getDoc(convRef);
    if (convSnap.exists() && convSnap.data().status === "BLOCKED") {
      throw new Error("This conversation has been blocked and cannot receive new messages.");
    }

    let imageUrl = "";
    let imageName = "";

    // Upload attachment if present
    if (imageFile) {
      // Validate type
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
        throw new Error("Invalid attachment type. Only JPEG, PNG, WebP, and GIF images are allowed.");
      }
      // Validate size
      if (imageFile.size > MAX_ATTACHMENT_SIZE_BYTES) {
        throw new Error("Attachment is too large. Maximum allowed size is 5MB.");
      }

      imageName = imageFile.name;

      try {
        const storagePath = `chat_attachments/${conversationId}/${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const fileRef = ref(storage, storagePath);
        const uploadResult = await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      } catch (storageErr) {
        console.warn("Storage upload failed, falling back to data URL:", storageErr);
        // Fallback to data URL
        imageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }
    }

    const messageData: any = {
      conversationId,
      senderId,
      senderName,
      senderRole,
      receiverId: recipientId,
      text: text.trim(),
      imageUrl: imageUrl || "",
      imageName: imageName || "",
      read: false,
      readBy: [senderId],
      status: "SENT",
      createdAt: serverTimestamp()
    };

    // 1. Add message to subcollection
    const msgRef = await addDoc(
      collection(db, "conversations", conversationId, "messages"),
      messageData
    );

    // Also write to legacy top-level messages collection for backward compatibility
    try {
      await addDoc(collection(db, "messages"), {
        ...messageData,
        messageId: msgRef.id
      });
    } catch (e) {
      // Non-blocking legacy write
    }

    // 2. Update parent conversation metadata & increment recipient unread count
    const lastMessagePreview = text.trim() 
      ? (text.trim().length > 60 ? text.trim().substring(0, 60) + "..." : text.trim())
      : "Sent an attachment";

    await updateDoc(convRef, {
      lastMessage: {
        text: lastMessagePreview,
        senderId,
        senderName,
        hasImage: !!imageUrl,
        createdAt: serverTimestamp()
      },
      [`unreadCounts.${recipientId}`]: increment(1),
      updatedAt: serverTimestamp()
    });

    // 3. Dispatch real-time notification to recipient
    const roleTitle = senderRole === "COACH" ? "Coach" : senderRole === "SCOUT" ? "Scout" : senderRole === "SCHOLARSHIP_PROVIDER" ? "Provider" : "Message";
    await notificationService.sendNotification({
      userId: recipientId,
      title: `New message from ${senderName}`,
      message: `${roleTitle}: ${lastMessagePreview}`,
      type: "NEW_MESSAGE",
      link: senderRole === "PLAYER" ? "/coach/messages" : "/player/messages",
      conversationId
    });

    return {
      id: msgRef.id,
      ...messageData,
      createdAt: new Date()
    };
  },

  /**
   * Mark a conversation as read by the active user
   */
  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      const convRef = doc(db, "conversations", conversationId);
      await updateDoc(convRef, {
        [`unreadCounts.${userId}`]: 0
      });
    } catch (err) {
      console.warn("Error resetting unread count:", err);
    }
  },

  /**
   * Block a conversation thread
   */
  async blockConversation(conversationId: string, userId: string, reason: string): Promise<void> {
    const convRef = doc(db, "conversations", conversationId);
    await updateDoc(convRef, {
      status: "BLOCKED",
      blockedBy: userId,
      blockedReason: reason.trim() || "Communication blocked by user request.",
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Unblock a conversation thread
   */
  async unblockConversation(conversationId: string): Promise<void> {
    const convRef = doc(db, "conversations", conversationId);
    await updateDoc(convRef, {
      status: "ACTIVE",
      blockedBy: null,
      blockedReason: null,
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Report an inappropriate conversation to platform administration
   */
  async reportConversation(params: {
    conversationId: string;
    reporterId: string;
    reporterName: string;
    reporterRole: string;
    reportedUserId: string;
    reportedUserName: string;
    reason: string;
    notes?: string;
  }): Promise<string> {
    const reportData = {
      ...params,
      status: "PENDING_REVIEW",
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "conversationReports"), reportData);

    // Optionally notify all admins
    await notificationService.broadcastAnnouncement({
      title: "Safeguarding Report Submitted",
      message: `${params.reporterName} reported communication with ${params.reportedUserName}. Reason: ${params.reason}`,
      targetRole: "ALL",
      link: "/admin/operations"
    });

    return docRef.id;
  },

  /**
   * Admin: Subscribe to all conversations across the academy
   */
  subscribeToAllConversations(callback: (conversations: Conversation[]) => void) {
    const q = query(collection(db, "conversations"));
    return onSnapshot(q, (snapshot) => {
      const list: Conversation[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Conversation);
      });
      list.sort((a, b) => {
        const tA = a.updatedAt?.seconds ? a.updatedAt.seconds * 1000 : 0;
        const tB = b.updatedAt?.seconds ? b.updatedAt.seconds * 1000 : 0;
        return tB - tA;
      });
      callback(list);
    }, (err) => {
      console.warn("All conversations subscription warning:", err);
      callback([]);
    });
  },

  /**
   * Admin: Subscribe to moderation reports
   */
  subscribeToReports(callback: (reports: ConversationReport[]) => void) {
    const q = query(collection(db, "conversationReports"));
    return onSnapshot(q, (snapshot) => {
      const list: ConversationReport[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ConversationReport);
      });
      list.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
        return tB - tA;
      });
      callback(list);
    }, (err) => {
      console.warn("Reports subscription warning:", err);
      callback([]);
    });
  },

  /**
   * Admin: Resolve or dismiss moderation report
   */
  async resolveReport(params: {
    reportId: string;
    status: "RESOLVED" | "DISMISSED";
    notes?: string;
    resolvedBy: string;
  }): Promise<void> {
    const ref = doc(db, "conversationReports", params.reportId);
    await updateDoc(ref, {
      status: params.status,
      notes: params.notes || "",
      resolvedBy: params.resolvedBy,
      resolvedAt: serverTimestamp()
    });
  }
};

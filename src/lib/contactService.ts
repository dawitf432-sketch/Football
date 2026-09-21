import { db } from "./firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { ContactRequest, ContactRequestStatus } from "../types";
import { notificationService } from "./notificationService";
import { messagingService } from "./messagingService";

export const contactService = {
  /**
   * Submit a new Contact Request from a Scout or Scholarship Provider to a Player
   */
  async sendContactRequest(params: {
    senderId: string;
    senderName: string;
    senderRole: "SCOUT" | "SCHOLARSHIP_PROVIDER" | string;
    senderOrganization?: string;
    targetPlayerId: string;
    targetPlayerName: string;
    targetPlayerPosition?: string;
    targetPlayerCountry?: string;
    subject?: string;
    message: string;
  }): Promise<ContactRequest> {
    const requestData = {
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole,
      senderOrganization: params.senderOrganization || "",
      targetPlayerId: params.targetPlayerId,
      targetPlayerName: params.targetPlayerName,
      targetPlayerPosition: params.targetPlayerPosition || "",
      targetPlayerCountry: params.targetPlayerCountry || "",
      // Legacy aliases for scout service compatibility
      scoutId: params.senderId,
      scoutName: params.senderName,
      scoutOrganization: params.senderOrganization || "",
      playerId: params.targetPlayerId,
      playerName: params.targetPlayerName,
      playerPosition: params.targetPlayerPosition || "",
      playerCountry: params.targetPlayerCountry || "",
      subject: params.subject || "Official Platform Inquiries",
      message: params.message.trim(),
      status: "PENDING" as ContactRequestStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "contactRequests"), requestData);

    // Notify the target player
    const roleLabel = params.senderRole === "SCHOLARSHIP_PROVIDER" ? "Scholarship Provider" : "Accredited Scout";
    const orgLabel = params.senderOrganization ? ` (${params.senderOrganization})` : "";
    
    await notificationService.sendNotification({
      userId: params.targetPlayerId,
      title: "New Official Contact Request",
      message: `${roleLabel} ${params.senderName}${orgLabel} has requested permission to message you. Review and accept or decline.`,
      type: "CONTACT_REQUEST",
      link: "/player/messages",
      contactRequestId: docRef.id
    });

    return {
      id: docRef.id,
      ...requestData,
      createdAt: new Date()
    };
  },

  /**
   * Player responds to a contact request (ACCEPT or DECLINE)
   */
  async respondToContactRequest(params: {
    requestId: string;
    playerId: string;
    playerName: string;
    decision: "ACCEPT" | "DECLINE";
    declineReason?: string;
  }): Promise<{ status: ContactRequestStatus; conversationId?: string }> {
    const requestRef = doc(db, "contactRequests", params.requestId);
    const snap = await getDoc(requestRef);
    if (!snap.exists()) {
      throw new Error("Contact request not found.");
    }

    const data = snap.data();
    const senderId = data.senderId || data.scoutId;
    const senderName = data.senderName || data.scoutName || "Scout/Provider";
    const senderRole = data.senderRole || "SCOUT";
    const senderOrg = data.senderOrganization || data.scoutOrganization || "";

    if (params.decision === "ACCEPT") {
      // 1. Create or get existing conversation thread
      const conversationType = senderRole === "SCHOLARSHIP_PROVIDER" ? "PLAYER_PROVIDER" : "PLAYER_SCOUT";
      
      const conversation = await messagingService.getOrCreateConversation({
        currentUserId: params.playerId,
        currentUserName: params.playerName,
        currentUserRole: "PLAYER",
        targetUserId: senderId,
        targetUserName: senderName,
        targetUserRole: senderRole as any,
        targetUserOrg: senderOrg,
        contactRequestId: params.requestId,
        type: conversationType
      });

      // 2. Update contact request document
      await updateDoc(requestRef, {
        status: "ACCEPTED",
        conversationId: conversation.id,
        updatedAt: serverTimestamp()
      });

      // 3. Notify the sender that the request was accepted
      const targetLink = senderRole === "SCHOLARSHIP_PROVIDER" ? "/provider" : "/scout/messages";
      await notificationService.sendNotification({
        userId: senderId,
        title: "Contact Request Accepted!",
        message: `Athlete ${params.playerName} accepted your contact inquiry. Direct messaging is now unlocked.`,
        type: "CONTACT_REQUEST_ACCEPTED",
        link: targetLink,
        conversationId: conversation.id,
        contactRequestId: params.requestId
      });

      return { status: "ACCEPTED", conversationId: conversation.id };
    } else {
      // Declined
      await updateDoc(requestRef, {
        status: "DECLINED",
        declineReason: params.declineReason || "Inquiry declined by player/guardian.",
        updatedAt: serverTimestamp()
      });

      // Notify the sender
      await notificationService.sendNotification({
        userId: senderId,
        title: "Contact Request Declined",
        message: `Player ${params.playerName} has declined your recent contact inquiry.`,
        type: "CONTACT_REQUEST_DECLINED",
        link: senderRole === "SCHOLARSHIP_PROVIDER" ? "/provider" : "/scout/messages",
        contactRequestId: params.requestId
      });

      return { status: "DECLINED" };
    }
  },

  /**
   * Real-time listener for incoming contact requests directed to a player
   */
  subscribeToPlayerContactRequests(
    playerId: string,
    callback: (requests: ContactRequest[]) => void
  ) {
    if (!playerId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, "contactRequests"),
      where("targetPlayerId", "==", playerId)
    );

    return onSnapshot(q, (snapshot) => {
      const list: ContactRequest[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ContactRequest);
      });

      // Also listen for legacy playerId field if separate
      list.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
        return tB - tA;
      });

      callback(list);
    }, (err) => {
      console.warn("Contact requests subscription warning (trying fallback):", err);
      // Fallback query with legacy playerId
      const fallbackQuery = query(
        collection(db, "contactRequests"),
        where("playerId", "==", playerId)
      );
      onSnapshot(fallbackQuery, (fbSnap) => {
        const fallbackList: ContactRequest[] = [];
        fbSnap.forEach((docSnap) => {
          fallbackList.push({ id: docSnap.id, ...docSnap.data() } as ContactRequest);
        });
        callback(fallbackList);
      }, () => callback([]));
    });
  },

  /**
   * Real-time listener for sent contact requests from a scout or provider
   */
  subscribeToSenderContactRequests(
    senderId: string,
    callback: (requests: ContactRequest[]) => void
  ) {
    if (!senderId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, "contactRequests"),
      where("senderId", "==", senderId)
    );

    return onSnapshot(q, (snapshot) => {
      const list: ContactRequest[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ContactRequest);
      });
      list.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
        return tB - tA;
      });
      callback(list);
    }, (err) => {
      console.warn("Sender contact requests fallback:", err);
      // Fallback with scoutId
      const fallbackQuery = query(
        collection(db, "contactRequests"),
        where("scoutId", "==", senderId)
      );
      onSnapshot(fallbackQuery, (fbSnap) => {
        const fallbackList: ContactRequest[] = [];
        fbSnap.forEach((docSnap) => {
          fallbackList.push({ id: docSnap.id, ...docSnap.data() } as ContactRequest);
        });
        callback(fallbackList);
      }, () => callback([]));
    });
  }
};

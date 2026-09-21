import { db } from "./firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  writeBatch 
} from "firebase/firestore";
import { AppNotification, NotificationType } from "../types";

export const notificationService = {
  /**
   * Subscribe to real-time notifications for a specific user
   */
  subscribeToUserNotifications(
    userId: string, 
    callback: (notifications: AppNotification[]) => void
  ) {
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
      const items: AppNotification[] = [];
      snapshot.forEach((docSnap) => {
        items.push({
          id: docSnap.id,
          ...docSnap.data()
        } as AppNotification);
      });

      // Sort client-side by createdAt descending to avoid composite index requirement
      items.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
        const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
        return tB - tA;
      });

      callback(items);
    }, (err) => {
      console.warn("Notifications subscription warning:", err);
      callback([]);
    });
  },

  /**
   * Send a notification to an authorized user
   */
  async sendNotification(params: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
    conversationId?: string;
    contactRequestId?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "notifications"), {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        read: false,
        link: params.link || "",
        conversationId: params.conversationId || "",
        contactRequestId: params.contactRequestId || "",
        metadata: params.metadata || {},
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      console.error("Error dispatching notification:", err);
      return "";
    }
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  },

  /**
   * Mark all unread notifications for a user as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false)
      );
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach((d) => {
        batch.update(d.ref, { read: true, readAt: serverTimestamp() });
      });
      await batch.commit();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  },

  /**
   * Admin broadcast: Send announcement notification to users
   */
  async broadcastAnnouncement(params: {
    title: string;
    message: string;
    targetRole?: "ALL" | "PLAYER" | "COACH" | "SCOUT" | "SCHOLARSHIP_PROVIDER";
    link?: string;
  }): Promise<number> {
    try {
      let usersQuery = query(collection(db, "users"));
      if (params.targetRole && params.targetRole !== "ALL") {
        usersQuery = query(collection(db, "users"), where("role", "==", params.targetRole));
      }
      const usersSnap = await getDocs(usersQuery);
      
      const batch = writeBatch(db);
      let count = 0;

      usersSnap.docs.forEach((uDoc) => {
        const notifRef = doc(collection(db, "notifications"));
        batch.set(notifRef, {
          userId: uDoc.id,
          title: params.title,
          message: params.message,
          type: "ADMIN_ANNOUNCEMENT",
          read: false,
          link: params.link || "",
          createdAt: serverTimestamp()
        });
        count++;
      });

      if (count > 0) {
        await batch.commit();
      }
      return count;
    } catch (err) {
      console.error("Error broadcasting announcement:", err);
      return 0;
    }
  }
};

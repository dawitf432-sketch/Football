import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const logAdminActivity = async (action: string, targetId: string = "system") => {
  if (!auth.currentUser) return;
  try {
    await addDoc(collection(db, "activityLogs"), {
      actorId: auth.currentUser.uid,
      action,
      targetId,
      timestamp: new Date()
    });
  } catch (e) {
    console.error("Failed to log admin activity:", e);
  }
};

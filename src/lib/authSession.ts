import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export interface AppUser {
  uid: string;
  name: string;
  email?: string | null;
  role: "PLAYER" | "COACH" | "SCOUT" | "SCHOLARSHIP_PROVIDER" | "ADMIN" | string;
  country?: string;
  countryCode?: string;
  accessId?: string;
  status?: string;
  isDemo?: boolean;
}

const SESSION_STORAGE_KEY = "pfc_auth_session";

export function getSessionUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setSessionUser(user: AppUser): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("pfc_session_change"));
  } catch (e) {
    console.error("Failed to save session user:", e);
  }
}

export function clearSessionUser(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.dispatchEvent(new Event("pfc_session_change"));
  } catch (e) {
    console.error("Failed to clear session user:", e);
  }
}

export async function logoutAppUser(): Promise<void> {
  clearSessionUser();
  try {
    await firebaseSignOut(auth);
  } catch (e) {
    // Ignore signout errors
  }
}

/**
 * Listens for either Firebase Auth state change or local session change.
 */
export function onAppAuthChange(callback: (user: AppUser | null) => void): () => void {
  let isMounted = true;

  const handleState = async (firebaseUser: User | null) => {
    if (!isMounted) return;

    if (firebaseUser) {
      let role = "PLAYER";
      const isMasterEmail = firebaseUser.email === "dawitf645@gmail.com";

      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          role = userDoc.data().role || (isMasterEmail ? "ADMIN" : "PLAYER");
        } else if (isMasterEmail) {
          role = "ADMIN";
        }
      } catch (e) {
        if (isMasterEmail) role = "ADMIN";
      }

      const appUser: AppUser = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || (isMasterEmail ? "Dawit (Master Admin)" : "Authenticated Member"),
        email: firebaseUser.email,
        role: isMasterEmail ? "ADMIN" : role,
        country: "ETH",
        countryCode: "ETH",
        status: "ACTIVE",
      };

      setSessionUser(appUser);
      callback(appUser);
    } else {
      const session = getSessionUser();
      callback(session);
    }
  };

  const unsubscribeFirebase = onAuthStateChanged(auth, handleState);

  const handleSessionEvent = () => {
    if (!isMounted) return;
    if (!auth.currentUser) {
      callback(getSessionUser());
    }
  };

  window.addEventListener("pfc_session_change", handleSessionEvent);
  window.addEventListener("storage", handleSessionEvent);

  return () => {
    isMounted = false;
    unsubscribeFirebase();
    window.removeEventListener("pfc_session_change", handleSessionEvent);
    window.removeEventListener("storage", handleSessionEvent);
  };
}

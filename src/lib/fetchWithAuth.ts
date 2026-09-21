import { auth } from "./firebase";
import { getSessionUser } from "./authSession";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  let token = "";
  
  if (user) {
    try {
      token = await user.getIdToken();
    } catch (e) {
      // fallback
    }
  }
  
  if (!token) {
    const session = getSessionUser();
    if (session) {
      const payload = {
        uid: session.uid,
        email: session.email,
        role: session.role,
        name: session.name
      };
      token = `demo.${btoa(JSON.stringify(payload))}.signature`;
    }
  }

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`
  };

  return fetch(url, { ...options, headers });
}


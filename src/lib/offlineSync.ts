import { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";

export interface QueuedMutation {
  id: string; // Idempotency key
  type: "DRILL_PROGRESS" | "PROFILE_UPDATE" | "TRAINING_NOTE" | "COURSE_PROGRESS";
  collectionName: string;
  docId?: string;
  data: Record<string, any>;
  createdAt: number;
  retryCount: number;
}

const STORAGE_KEY_QUEUE = "pfc_offline_mutation_queue_v1";
const STORAGE_KEY_CACHE_PREFIX = "pfc_offline_cache_";

// --- Storage Utilities ---

export function getOfflineQueue(): QueuedMutation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveOfflineQueue(queue: QueuedMutation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.error("Failed to persist offline queue", e);
  }
}

export function cacheLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(
      `${STORAGE_KEY_CACHE_PREFIX}${key}`,
      JSON.stringify({
        timestamp: Date.now(),
        payload: data,
      })
    );
  } catch (e) {
    console.warn("Local cache save failed", e);
  }
}

export function getLocalCachedData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.payload as T;
  } catch (e) {
    return null;
  }
}

// --- Queue Mutations ---

export function enqueueOfflineMutation(
  mutation: Omit<QueuedMutation, "id" | "createdAt" | "retryCount">
): QueuedMutation {
  const queue = getOfflineQueue();

  // Create deterministic idempotency key to prevent duplicates
  const id = `${mutation.type}_${mutation.docId || "doc"}_${Date.now()}`;
  const item: QueuedMutation = {
    ...mutation,
    id,
    createdAt: Date.now(),
    retryCount: 0,
  };

  // Check if duplicate existing mutation exists for the same document and type
  const existingIdx = queue.findIndex(
    (q) => q.type === item.type && q.docId && q.docId === item.docId
  );

  if (existingIdx >= 0) {
    // Merge newer updates into existing queued item
    queue[existingIdx].data = {
      ...queue[existingIdx].data,
      ...item.data,
      updatedAt: Date.now(),
    };
  } else {
    queue.push(item);
  }

  saveOfflineQueue(queue);

  // Notify listeners
  window.dispatchEvent(new CustomEvent("pfc:offline-queue-change", { detail: queue.length }));

  return item;
}

// --- Synchronization Engine ---

export async function processOfflineQueue(): Promise<{
  synced: number;
  failed: number;
}> {
  if (!navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { synced: 0, failed: 0 };
  }

  const remaining: QueuedMutation[] = [];
  let syncedCount = 0;
  let failedCount = 0;

  for (const item of queue) {
    try {
      if (item.docId) {
        // Document update / merge
        const docRef = doc(db, item.collectionName, item.docId);
        await setDoc(
          docRef,
          {
            ...item.data,
            _syncedFromOffline: true,
            _syncedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        // Collection document creation
        const colRef = collection(db, item.collectionName);
        await addDoc(colRef, {
          ...item.data,
          _syncedFromOffline: true,
          _syncedAt: serverTimestamp(),
        });
      }
      syncedCount++;
    } catch (err) {
      console.warn(`Error syncing queued mutation ${item.id}:`, err);
      // Keep in queue if retry count < 3
      if (item.retryCount < 3) {
        remaining.push({ ...item, retryCount: item.retryCount + 1 });
      }
      failedCount++;
    }
  }

  saveOfflineQueue(remaining);
  window.dispatchEvent(
    new CustomEvent("pfc:offline-queue-change", { detail: remaining.length })
  );

  if (syncedCount > 0) {
    window.dispatchEvent(
      new CustomEvent("pfc:offline-sync-success", { detail: { count: syncedCount } })
    );
  }

  return { synced: syncedCount, failed: failedCount };
}

// --- React Hook for Offline State & Auto-Sync ---

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [queueCount, setQueueCount] = useState<number>(() => getOfflineQueue().length);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleOnline = useCallback(async () => {
    setIsOnline(true);
    setIsSyncing(true);
    try {
      const { synced } = await processOfflineQueue();
      if (synced > 0) {
        setSyncNotice(`Reconnected: Synchronized ${synced} offline update${synced > 1 ? "s" : ""} to cloud.`);
        setTimeout(() => setSyncNotice(null), 5000);
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  const handleQueueChange = useCallback((e: any) => {
    setQueueCount(e.detail ?? getOfflineQueue().length);
  }, []);

  const triggerManualSync = useCallback(async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    try {
      await processOfflineQueue();
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("pfc:offline-queue-change", handleQueueChange);

    // Initial check on mount
    if (navigator.onLine && getOfflineQueue().length > 0) {
      processOfflineQueue();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("pfc:offline-queue-change", handleQueueChange);
    };
  }, [handleOnline, handleOffline, handleQueueChange]);

  return {
    isOnline,
    isOffline: !isOnline,
    queueCount,
    isSyncing,
    syncNotice,
    triggerManualSync,
  };
}

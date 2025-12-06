"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { syncUser } from "@/actions/user.action";

const SYNC_STORAGE_KEY = "codehub_user_sync";
const SYNC_SESSION_KEY = "codehub_sync_session";

/**
 * Client component that syncs user data in the background after render.
 * Optimized to only sync when necessary, not on every navigation.
 */
export default function UserSync() {
  const { user, isLoaded } = useUser();
  const syncInProgressRef = useRef(false);
  const lastSyncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only sync if user is loaded and authenticated
    if (!isLoaded || !user?.id) {
      return;
    }

    const userId = user.id;

    // Skip if we're already syncing this user
    if (syncInProgressRef.current && lastSyncedUserIdRef.current === userId) {
      return;
    }

    // Check if we've already synced this user in this session
    const sessionId = sessionStorage.getItem(SYNC_SESSION_KEY);
    const syncedUserId = sessionStorage.getItem(SYNC_STORAGE_KEY);
    
    // If we've already synced this user in this session, skip
    if (syncedUserId === userId && sessionId) {
      lastSyncedUserIdRef.current = userId;
      return;
    }

    // Mark as in progress
    syncInProgressRef.current = true;
    lastSyncedUserIdRef.current = userId;

    // Run sync in background without blocking
    syncUser()
      .then(() => {
        // Mark as synced for this session
        sessionStorage.setItem(SYNC_STORAGE_KEY, userId);
        sessionStorage.setItem(SYNC_SESSION_KEY, Date.now().toString());
      })
      .catch((error) => {
        // Silently handle errors - user sync shouldn't break navigation
        console.error("Failed to sync user:", error);
        // Reset ref on error so we can retry on next navigation
        lastSyncedUserIdRef.current = null;
      })
      .finally(() => {
        syncInProgressRef.current = false;
      });
  }, [user?.id, isLoaded]); // Only depend on userId, not the entire user object

  // This component doesn't render anything
  return null;
}

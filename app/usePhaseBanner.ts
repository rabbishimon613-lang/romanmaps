"use client";

import { useSyncExternalStore } from "react";

export type PhaseBannerState = { siteSlug: string; siteName: string; note: string } | null;

let current: PhaseBannerState = null;
const listeners = new Set<() => void>();
// Once dismissed, a site's banner stays hidden for the rest of the session — reopening the
// same site (e.g. panning away and back) shouldn't re-nag the user with the same notice.
const dismissedSites = new Set<string>();

function getSnapshot(): PhaseBannerState {
  return current;
}

function getServerSnapshot(): PhaseBannerState {
  return null;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

/** Called from Map.tsx the first time a site with a `snapshotNote` (sites.ts) finishes loading
 * its street-level detail — see [06-P0-1] phase-banners. A no-op if the user already dismissed
 * this site's banner this session. */
export function showPhaseBanner(siteSlug: string, siteName: string, note: string) {
  if (dismissedSites.has(siteSlug)) return;
  current = { siteSlug, siteName, note };
  listeners.forEach((l) => l());
}

export function dismissPhaseBanner() {
  if (current === null) return;
  dismissedSites.add(current.siteSlug);
  current = null;
  listeners.forEach((l) => l());
}

/** The current honest-snapshot notice, if any, shared with PhaseBanner.tsx. */
export function usePhaseBanner(): PhaseBannerState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

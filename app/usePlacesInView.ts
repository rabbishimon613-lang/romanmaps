"use client";

import { useSyncExternalStore } from "react";

let current = false;
const listeners = new Set<() => void>();

function getSnapshot(): boolean {
  return current;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function openPlacesInView() {
  if (current) return;
  current = true;
  listeners.forEach((l) => l());
}

export function closePlacesInView() {
  if (!current) return;
  current = false;
  listeners.forEach((l) => l());
}

export function togglePlacesInView() {
  current = !current;
  listeners.forEach((l) => l());
}

/** Open/closed state for the "Places in view" panel (`PlacesInViewList.tsx`), shared between its
 * own FAB (desktop) and the hamburger-menu entry that opens it on mobile — same
 * `useSyncExternalStore` pattern as `useRuler.ts`/`usePoiPanel.ts`. */
export function usePlacesInViewOpen(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

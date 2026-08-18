"use client";

import { useSyncExternalStore } from "react";
import { clearPoi, registerPoiSelectedSideEffect } from "./usePoiPanel";

/** Selected-province state for the map's "click a province → highlight + panel" feature
 * (FEATURE_BACKLOG.md P1 "Province overlay"). Same store shape and non-React accessor pattern as
 * usePoiPanel.ts, kept as its own module because a province isn't a `pois.geojson`-shaped
 * record — it's a lookup into `app/provinces.ts::PROVINCES` by slug. */

let current: string | null = null; // Province slug, or null
const listeners = new Set<() => void>();

function getSnapshot(): string | null {
  return current;
}
function getServerSnapshot(): string | null {
  return null;
}
function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function selectProvince(slug: string) {
  current = slug;
  clearPoi(); // provinces and places share one screen slot — only one open at a time
  listeners.forEach((l) => l());
}

export function clearProvince() {
  if (current === null) return;
  current = null;
  listeners.forEach((l) => l());
}

// The reverse direction: selecting a POI (map click, search, tour stop, legion locator, context
// menu) always closes an open province panel. Registered once, at module load.
registerPoiSelectedSideEffect(() => clearProvince());

export function useProvincePanel(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Non-React accessor so app/Map.tsx's imperative MapLibre setup can drive the province highlight
 * layer's filter off the same selection, outside any component render. */
export function getSelectedProvince(): string | null {
  return current;
}
export function subscribeSelectedProvince(listener: (v: string | null) => void): () => void {
  const wrapped = () => listener(current);
  listeners.add(wrapped);
  return () => listeners.delete(wrapped);
}

"use client";

import { useSyncExternalStore } from "react";

export type SelectedPoi = {
  props: Record<string, any>;
  lngLat: [number, number];
} | null;

let current: SelectedPoi = null;
const listeners = new Set<() => void>();

function getSnapshot(): SelectedPoi {
  return current;
}

function getServerSnapshot(): SelectedPoi {
  return null;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

// Set once by useProvincePanel.ts so selecting a POI always closes an open province panel — the
// two panels share the same screen slot and are mutually exclusive, same pattern as Directions/
// Ruler's "modes". A plain callback slot (not a static import) avoids a module import cycle,
// since useProvincePanel.ts already needs to import clearPoi from here for the reverse direction.
let onPoiSelected: (() => void) | null = null;
export function registerPoiSelectedSideEffect(fn: () => void) {
  onPoiSelected = fn;
}

export function selectPoi(props: Record<string, any>, lngLat: [number, number]) {
  current = { props, lngLat };
  onPoiSelected?.();
  listeners.forEach((l) => l());
}

export function clearPoi() {
  if (current === null) return;
  current = null;
  listeners.forEach((l) => l());
}

/** The currently-selected POI (from clicking a POI marker on the map), shared with PlaceDetails.tsx. */
export function usePoiPanel(): SelectedPoi {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Non-React accessors so app/Map.tsx's imperative MapLibre setup (outside any component render)
 * can read the current selection and react to changes when keeping the shareable URL hash in
 * sync with whichever place is open. */
export function getSelectedPoi(): SelectedPoi {
  return current;
}
export function subscribeSelectedPoi(listener: (v: SelectedPoi) => void): () => void {
  const wrapped = () => listener(current);
  listeners.add(wrapped);
  return () => listeners.delete(wrapped);
}

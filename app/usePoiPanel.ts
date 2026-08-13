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

export function selectPoi(props: Record<string, any>, lngLat: [number, number]) {
  current = { props, lngLat };
  listeners.forEach((l) => l());
}

export function clearPoi() {
  if (current === null) return;
  current = null;
  listeners.forEach((l) => l());
}

/** The currently-selected POI (from clicking a pois-dot on the map), shared with PlaceDetails.tsx. */
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

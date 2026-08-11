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

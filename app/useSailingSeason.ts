"use client";

import { useSyncExternalStore } from "react";
import type { Map as MLMap } from "maplibre-gl";

/** [7b] Mare apertum (open sea, roughly May-September) vs mare clausum (closed sea, roughly
 * November-March) — the seasonal rhythm that governed Mediterranean sailing in 117 CE. Modeled
 * as a manual toggle rather than tied to the visitor's real-world calendar date, since the map
 * itself is a frozen 117 CE snapshot, not a live simulation. */
export type SailingSeason = "summer" | "winter";

const STORAGE_KEY = "roman-maps:sailing-season";
const TINT_LAYER_IDS = ["sea-mask-winter-tint", "ancient-sea-winter-tint"];
const WINTER_TINT_OPACITY = 0.55;

const listeners = new Set<() => void>();
let current: SailingSeason = "summer";
let hydrated = false;

function readStored(): SailingSeason {
  if (typeof window === "undefined") return "summer";
  return window.localStorage.getItem(STORAGE_KEY) === "winter" ? "winter" : "summer";
}

function getSnapshot(): SailingSeason {
  if (!hydrated) {
    current = readStored();
    hydrated = true;
  }
  return current;
}

function getServerSnapshot(): SailingSeason {
  return "summer";
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function applyToMap(season: SailingSeason) {
  const map = (window as any).__map as MLMap | undefined;
  if (!map) return;
  const opacity = season === "winter" ? WINTER_TINT_OPACITY : 0;
  for (const id of TINT_LAYER_IDS) {
    if (map.getLayer(id)) map.setPaintProperty(id, "fill-opacity", opacity);
  }
}

export function setSailingSeason(season: SailingSeason) {
  current = season;
  hydrated = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, season);
    } catch {
      // ignore quota/private-mode errors
    }
  }
  applyToMap(season);
  listeners.forEach((l) => l());
}

/** Re-applies the persisted season to the tint layers — call once the map (re)creates them, so a
 * returning visitor who last left it on "Winter" sees the tint immediately instead of only after
 * they re-open the toggle. */
export function applyStoredSailingSeason() {
  applyToMap(getSnapshot());
}

/** Persisted mare apertum/clausum toggle, shared across every component that calls this hook. */
export function useSailingSeason(): [SailingSeason, (s: SailingSeason) => void] {
  const season = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [season, setSailingSeason];
}

"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Units = "km" | "mi";

const STORAGE_KEY = "roman-maps:units";
const KM_PER_MI = 1.609344;

const listeners = new Set<() => void>();
let current: Units = "km";
let hydrated = false;

function readStored(): Units {
  if (typeof window === "undefined") return "km";
  return window.localStorage.getItem(STORAGE_KEY) === "mi" ? "mi" : "km";
}

function getSnapshot(): Units {
  if (!hydrated) {
    current = readStored();
    hydrated = true;
  }
  return current;
}

function getServerSnapshot(): Units {
  return "km";
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function setUnits(units: Units) {
  current = units;
  hydrated = true;
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, units);
  listeners.forEach((l) => l());
}

/** Persisted mi/km preference, shared across every component that calls this hook. */
export function useUnits(): [Units, (u: Units) => void] {
  const units = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const set = useCallback((u: Units) => setUnits(u), []);
  return [units, set];
}

export function metersToUnit(meters: number, units: Units): number {
  const km = meters / 1000;
  return units === "mi" ? km / KM_PER_MI : km;
}

/** Google-Maps-style distance formatting: short hops in m/ft, longer ones in km/mi. */
export function formatDistance(meters: number, units: Units): string {
  if (units === "mi") {
    if (meters < 1609.344 * 0.1) return `${Math.round(meters * 3.28084)} ft`;
  } else if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const val = metersToUnit(meters, units);
  const precision = val < 10 ? 2 : val < 100 ? 1 : 0;
  return `${val.toFixed(precision)} ${units}`;
}

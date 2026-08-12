"use client";

import { useSyncExternalStore } from "react";

type LngLat = [number, number];
type RulerState = { active: boolean; seedPoint?: LngLat };

const INACTIVE: RulerState = { active: false };

let current: RulerState = INACTIVE;
const listeners = new Set<() => void>();

function getSnapshot(): RulerState {
  return current;
}

function getServerSnapshot(): RulerState {
  return INACTIVE;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

/** Turns the ruler on, optionally seeding it with a starting point (e.g. from the right-click
 * "Measure distance" context-menu item). Calling this again while already active resets to the
 * new seed point, matching "start a fresh measurement from here". */
export function activateRuler(seedPoint?: LngLat) {
  current = { active: true, seedPoint };
  listeners.forEach((l) => l());
}

export function deactivateRuler() {
  if (!current.active) return;
  current = INACTIVE;
  listeners.forEach((l) => l());
}

/** Shared ruler on/off state, `useSyncExternalStore`-backed like `usePoiPanel`/`useLayers`, so the
 * right-click context menu and the Ruler FAB can both drive the same measuring session. */
export function useRulerState(): RulerState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

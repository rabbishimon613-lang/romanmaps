"use client";

import { useSyncExternalStore } from "react";
import { deactivateRuler } from "./useRuler";

type LngLat = [number, number];
type Waypoint = { point: LngLat; label: string };

export type DirectionsState = {
  active: boolean;
  origin?: Waypoint;
  destination?: Waypoint;
};

const INACTIVE: DirectionsState = { active: false };

let current: DirectionsState = INACTIVE;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot(): DirectionsState {
  return current;
}
function getServerSnapshot(): DirectionsState {
  return INACTIVE;
}
function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

/** Turns Directions on, optionally seeding origin and/or destination (e.g. from the right-click
 * "Directions from/to here" context-menu items, or a place card's "Directions" button). Calling
 * this again while already active replaces whichever end is passed, leaving the other alone —
 * so "Directions to here" from a second place fills in the destination without discarding an
 * origin someone already set. */
export function activateDirections(opts: { origin?: Waypoint; destination?: Waypoint } = {}) {
  deactivateRuler(); // Directions and the ruler are mutually exclusive map "modes", same as Google Maps.
  current = {
    active: true,
    origin: opts.origin ?? current.origin,
    destination: opts.destination ?? current.destination,
  };
  emit();
}

export function setDirectionsOrigin(point: LngLat, label: string) {
  deactivateRuler();
  current = { active: true, origin: { point, label }, destination: current.destination };
  emit();
}

export function setDirectionsDestination(point: LngLat, label: string) {
  deactivateRuler();
  current = { active: true, origin: current.origin, destination: { point, label } };
  emit();
}

export function clearDirections() {
  if (!current.active && !current.origin && !current.destination) return;
  current = INACTIVE;
  emit();
}

/** Shared Directions state — `useSyncExternalStore`-backed like `useRuler.ts`/`usePoiPanel.ts`,
 * so the context menu, place-card button, and the Directions panel itself all drive one session. */
export function useDirectionsState(): DirectionsState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Non-React accessor, same purpose as useRuler.ts's isRulerActive() — lets Map.tsx's own click
 * handlers (province panel, "what's here") skip while a routing session is capturing clicks. */
export function isDirectionsActive(): boolean {
  return current.active;
}

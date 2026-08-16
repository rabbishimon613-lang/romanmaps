"use client";

import { useSyncExternalStore } from "react";

type TourPanelState = {
  open: boolean;
  activeTourSlug: string | null; // null = browsing the tour list, set = playing that tour's itinerary
  stopIndex: number;
};

const CLOSED: TourPanelState = { open: false, activeTourSlug: null, stopIndex: 0 };

let current: TourPanelState = CLOSED;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot(): TourPanelState {
  return current;
}

function getServerSnapshot(): TourPanelState {
  return CLOSED;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function openTourPanel() {
  current = { ...current, open: true };
  emit();
}

export function closeTourPanel() {
  current = CLOSED;
  emit();
}

/** Hides the panel without losing tour progress — used when a stop's "Open full details" opens
 * the real Place details panel, which shares the same left-side screen real estate. Reopening
 * the tour panel (rail icon / hamburger menu) resumes at the same stop. */
export function minimizeTourPanel() {
  current = { ...current, open: false };
  emit();
}

export function toggleTourPanel() {
  current.open ? closeTourPanel() : openTourPanel();
}

export function selectTour(tourSlug: string) {
  current = { open: true, activeTourSlug: tourSlug, stopIndex: 0 };
  emit();
}

export function backToTourList() {
  current = { ...current, activeTourSlug: null, stopIndex: 0 };
  emit();
}

export function goToStop(stopIndex: number) {
  if (!current.activeTourSlug) return;
  current = { ...current, stopIndex };
  emit();
}

/** Shared tour-panel state — open/closed, which tour (if any) is being walked, and which stop.
 * Drives TourPlayer's UI and TourRoute's map line, the same useSyncExternalStore pattern as
 * useRuler/usePoiPanel so the left rail (desktop) and the hamburger menu (mobile) can both open
 * the same panel without lifting state through page.tsx. */
export function useTourPanel(): TourPanelState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

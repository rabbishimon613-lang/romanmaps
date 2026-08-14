"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "roman-maps:hidden-categories";

/** Per-category-group POI visibility, independent of CategoryChips' "isolate to only this
 * category" filter (which stays a positive select — click a chip to show ONLY that category).
 * This is the opposite shape: an explicit hide-set, default empty (everything visible), so the
 * Layers panel can offer real Google-Maps-style "turn this category off" checkboxes without
 * colliding with the chips' isolate semantics. PoiMarkers.tsx ANDs both filters together. */

let hidden = new Set<string>();
let hydrated = false;
const listeners = new Set<() => void>();

function load(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function save() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...hidden]));
  } catch {
    // ignore quota/private-mode errors
  }
}

function getSnapshot(): Set<string> {
  if (!hydrated) {
    hidden = load();
    hydrated = true;
  }
  return hidden;
}

const SERVER_SNAPSHOT = new Set<string>();
function getServerSnapshot(): Set<string> {
  return SERVER_SNAPSHOT;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function toggleHiddenCategory(groupId: string) {
  const next = new Set(getSnapshot());
  if (next.has(groupId)) next.delete(groupId);
  else next.add(groupId);
  hidden = next;
  hydrated = true;
  save();
  listeners.forEach((l) => l());
}

/** Persisted set of POI category-group ids the user has turned off in the Layers panel. */
export function useHiddenCategories(): Set<string> {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

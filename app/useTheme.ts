"use client";

import { useSyncExternalStore } from "react";

/** Manual light/dark override for the whole app (chrome tokens in globals.css + the map's own
 * LIGHT/DARK palette in Map.tsx). "system" (the default) tracks prefers-color-scheme exactly
 * like before this existed — this only adds an explicit escape hatch, it never removes the
 * OS-preference behavior. */
export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "roman-maps:theme";

const listeners = new Set<() => void>();
let current: ThemeMode = "system";
let hydrated = false;
let mqlBound = false;

function readStored(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : "system";
}

function getSnapshot(): ThemeMode {
  if (!hydrated) {
    current = readStored();
    hydrated = true;
  }
  return current;
}

function getServerSnapshot(): ThemeMode {
  return "system";
}

function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** The actual light/dark being rendered right now — resolves "system" against the live OS
 * preference. Map.tsx and any future theme-aware code should call this, not read `current`
 * directly, since "system" isn't itself a paintable value. */
export function resolveDark(mode: ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return systemPrefersDark();
}

export function getResolvedDark(): boolean {
  return resolveDark(getSnapshot());
}

function applyDom() {
  if (typeof document === "undefined") return;
  const mode = getSnapshot();
  if (mode === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", mode);
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // While in "system" mode, an OS-level scheme change needs to notify subscribers too (Map.tsx's
  // live repaint included) even though `current` itself never changes — bind this once, globally,
  // not per-subscriber.
  if (!mqlBound && typeof window !== "undefined" && window.matchMedia) {
    mqlBound = true;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getSnapshot() === "system") listeners.forEach((l) => l());
    };
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange); // Safari <14 fallback
  }
  return () => listeners.delete(onStoreChange);
}

export function setThemeMode(mode: ThemeMode) {
  current = mode;
  hydrated = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore quota/private-mode errors
    }
  }
  applyDom();
  listeners.forEach((l) => l());
}

/** Subscribes to every theme change (explicit mode switch, or the OS preference moving while
 * "system" is active) without a React hook — for imperative consumers like Map.tsx's map
 * instance, which lives outside React's render tree. */
export function subscribeThemeChange(cb: () => void): () => void {
  return subscribe(cb);
}

/** Persisted light/dark/system preference, shared across every component that calls this hook.
 * Third element is the resolved boolean (system already collapsed to a real light/dark value) —
 * most UI only needs the mode for the picker itself and doesn't care whether it's showing dark
 * because the user chose it or because their OS did. */
export function useTheme(): [ThemeMode, (m: ThemeMode) => void, boolean] {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [mode, setThemeMode, resolveDark(mode)];
}

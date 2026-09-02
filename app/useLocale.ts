"use client";

import { useCallback, useSyncExternalStore } from "react";
import { type Locale, type TranslationKey, translate } from "./strings";

const STORAGE_KEY = "roman-maps:locale";

const listeners = new Set<() => void>();
let current: Locale = "en";
let hydrated = false;

function readStored(): Locale {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(STORAGE_KEY) === "it" ? "it" : "en";
}

function getSnapshot(): Locale {
  if (!hydrated) {
    current = readStored();
    hydrated = true;
  }
  return current;
}

function getServerSnapshot(): Locale {
  return "en";
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function setLocale(locale: Locale) {
  current = locale;
  hydrated = true;
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, locale);
  listeners.forEach((l) => l());
}

/** Persisted UI-language preference, shared across every component that calls this hook. */
export function useLocale(): [Locale, (l: Locale) => void, (key: TranslationKey) => string] {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const set = useCallback((l: Locale) => setLocale(l), []);
  const t = useCallback((key: TranslationKey) => translate(locale, key), [locale]);
  return [locale, set, t];
}

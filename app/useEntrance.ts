"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "roman-maps:entrance-seen";

/** First-visit welcome screen: one sentence framing the map, three doors into it, dismissible.
 * Same shape as useOnboardingHint.ts — shows once per browser, never again once dismissed. Kept
 * as its own hook (rather than folding into useOnboardingHint) because the two features are
 * independent: a returning visitor with camera memory (`[01-P0-2]`) restored should still not see
 * this, but could in principle still see the smaller search-bar hint if that key hasn't been set. */
export function useEntrance() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private browsing, etc.) — just skip straight to the map.
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  return { visible, dismiss };
}

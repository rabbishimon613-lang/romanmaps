"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "roman-maps:onboarding-hint-seen";

/** First-visit "try searching for X" hint under the search bar. Shows once, then never again. */
export function useOnboardingHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private browsing, etc.) — just skip the hint.
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

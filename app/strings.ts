"use client";

/**
 * i18n scaffold ([05-P2-6] on BOARD.md). English + Italian dictionaries for the chrome UI
 * (search bar, hamburger menu, epoch pill) — not a full sweep of every string in the app.
 * Adding a new language means adding one more key to `Locale` and filling in its dictionary
 * below; adding a new string means adding one key to `en` and the same key to every other
 * dictionary (TypeScript enforces this via `Record<TranslationKey, string>`).
 */

export type Locale = "en" | "it";

export const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "it", label: "Italiano" },
];

const en = {
  searchPlaceholder: "Search Roman Maps",
  searchTitle: "Search Roman Maps (press / to focus)",
  menu: "Menu",
  search: "Search",
  backToSearch: "Back to search",
  onboardingHint: "Try “Londinium” or “Ephesus”",
  dismiss: "Dismiss",
  today: "Today",
  distanceUnits: "Distance units",
  kilometers: "Kilometers",
  miles: "Miles",
  language: "Language",
  measureDistance: "Measure distance",
  guidedTours: "Guided tours",
  placesInView: "Places in view",
  whyEpoch: "Why 117 CE?",
  epochLabel: "117 CE",
  epochTagline: "The Empire at its peak",
};

export type TranslationKey = keyof typeof en;

const it: Record<TranslationKey, string> = {
  searchPlaceholder: "Cerca su Roman Maps",
  searchTitle: "Cerca su Roman Maps (premi / per selezionare)",
  menu: "Menu",
  search: "Cerca",
  backToSearch: "Torna alla ricerca",
  onboardingHint: "Prova “Londinium” o “Efeso”",
  dismiss: "Chiudi",
  today: "Oggi",
  distanceUnits: "Unità di distanza",
  kilometers: "Chilometri",
  miles: "Miglia",
  language: "Lingua",
  measureDistance: "Misura distanza",
  guidedTours: "Percorsi guidati",
  placesInView: "Luoghi visibili",
  whyEpoch: "Perché il 117 d.C.?",
  epochLabel: "117 d.C.",
  epochTagline: "L'Impero al suo apice",
};

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { en, it };

export function translate(locale: Locale, key: TranslationKey): string {
  return dictionaries[locale][key] ?? en[key];
}

"use client";

import { useState } from "react";
import { useTheme, type ThemeMode } from "./useTheme";

const OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: "system", label: "System" },
  { mode: "light", label: "Light" },
  { mode: "dark", label: "Dark" },
];

/** [P3] In-app manual light/dark override — lives in Chrome.tsx's hamburger menu, same
 * expandable-section pattern as CurrencyConverter/SailingSeason. The map already followed
 * prefers-color-scheme on its own; this adds the explicit switch a visitor without OS-level
 * control (or who just wants the map one way regardless of their system) expects to find, same as
 * Google Maps' own theme setting. Repaints the live map instance via app/useTheme.ts +
 * app/Map.tsx's swapPaletteColors — no reload, no map remount. */
export default function ThemeToggle() {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode, dark] = useTheme();

  return (
    <div style={{ borderTop: "1px solid var(--divider)" }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-strong)",
        }}
      >
        Appearance
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="var(--icon)"
          style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 120ms" }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {OPTIONS.map((o) => (
              <button
                key={o.mode}
                onClick={() => setMode(o.mode)}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  background: mode === o.mode ? "var(--accent-bg)" : "var(--surface-2)",
                  color: mode === o.mode ? "var(--accent)" : "var(--text-strong)",
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.4 }}>
            {mode === "system"
              ? `Matches your device — currently showing ${dark ? "dark" : "light"}.`
              : `Map and menus stay ${dark ? "dark" : "light"} regardless of your device setting.`}
          </div>
        </div>
      )}
    </div>
  );
}

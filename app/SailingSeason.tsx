"use client";

import { useState } from "react";
import { useSailingSeason } from "./useSailingSeason";

/** [7b] Google-Business-panel-style explainer for mare apertum/clausum — lives inside Chrome.tsx's
 * hamburger menu, next to the currency converter. A manual Summer/Winter toggle (not tied to the
 * visitor's real-world date, since the map itself is a frozen 117 CE snapshot) that also tints
 * the map's sea fill grey in "Winter" mode via app/useSailingSeason.ts, echoing the closed season
 * ancient captains actually planned around. */
export default function SailingSeason() {
  const [expanded, setExpanded] = useState(false);
  const [season, setSeason] = useSailingSeason();

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
        Sailing season
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
          <div style={{ fontSize: 11, color: "var(--text-2)", marginBottom: 10, lineHeight: 1.4 }}>
            Mediterranean shipping was seasonal. Captains sailed freely May through September
            (mare apertum, "the open sea") and mostly stayed in harbor November through March
            (mare clausum, "the closed sea"), when storms made the crossing too risky to insure or
            plan around.
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {(["summer", "winter"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  background: season === s ? "var(--accent-bg)" : "var(--surface-2)",
                  color: season === s ? "var(--accent)" : "var(--text-strong)",
                }}
              >
                {s === "summer" ? "Mare apertum" : "Mare clausum"}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.4, marginBottom: 6 }}>
            {season === "summer"
              ? "Open sea: grain fleets, troop transports and ordinary trade all moved freely across the map's water."
              : "Closed sea: the map's water tints grey to mark the season ships stayed beached rather than risk the crossing."}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-3)", lineHeight: 1.4 }}>
            Vegetius, writing later but describing standing Roman practice, gives the same three
            windows: safe from late May to mid-September, risky in the shoulder months, closed
            from November to March.
          </div>
        </div>
      )}
    </div>
  );
}

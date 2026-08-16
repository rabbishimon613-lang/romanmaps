"use client";

import { useEffect } from "react";

/** "Why 117 CE?" explainer, opened by clicking the bottom-left epoch pill. Centered modal over a
 * dimmed backdrop, Google-Maps-info-card styling (white rounded card, soft shadow). Closes on
 * backdrop click or Esc. */
export default function EpochModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--overlay)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-3)",
          width: "min(440px, 100%)",
          maxHeight: "85vh",
          overflowY: "auto",
          font: "14px Roboto, sans-serif",
          color: "var(--text-strong)",
        }}
      >
        <div style={{ padding: "22px 24px 8px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#b0431a", flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: "var(--text)", letterSpacing: -0.1 }}>Why 117 CE?</h2>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="ui-btn"
            style={{ width: 32, height: 32, display: "grid", placeItems: "center", flexShrink: 0, marginTop: -4, marginRight: -4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--icon)">
              <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.7 2.88 18.3 9.17 12 2.88 5.71 4.3 4.3l6.29 6.28L16.89 4.3z" />
            </svg>
          </button>
        </div>

        <div style={{ padding: "4px 24px 24px", lineHeight: 1.55 }}>
          <p style={{ margin: "8px 0" }}>
            This map is frozen at a single moment: <strong>11 August 117 CE</strong>, the day the
            emperor Trajan died at Selinus in Cilicia, on the coast of what's now southern Turkey.
          </p>
          <p style={{ margin: "8px 0" }}>
            Trajan's conquests — Dacia in the north, Mesopotamia and Armenia in the east — had just
            pushed Roman territory to its largest extent ever, roughly <strong>5 million km²</strong>{" "}
            stretching from Britain to the Persian Gulf. Within days his adopted successor,{" "}
            Hadrian, would already be giving some of that eastern territory back.
          </p>
          <p style={{ margin: "8px 0" }}>
            Every place, person, and event on this map is checked against that single day. A
            building still standing, a war still raging, a person still alive — all as they stood
            on 117 CE, not before and not after. That discipline is what lets the map work as one
            coherent snapshot instead of a blur of centuries.
          </p>
          <p style={{ margin: "8px 0", color: "var(--text-2)", fontSize: 12.5 }}>
            Sources: Cassius Dio, <em>Roman History</em> 68.33; <em>Historia Augusta</em>,{" "}
            <em>Hadrian</em> 4.7.
          </p>
        </div>
      </div>
    </div>
  );
}

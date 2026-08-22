"use client";

import { useEffect } from "react";
import { openTourPanel } from "./useTour";
import { openPlacesInView } from "./usePlacesInView";

/** First-visit welcome screen — board `[10-P1-4]` ("one sentence, three doors, dismissible").
 * Centered modal over a dimmed backdrop, same chrome as EpochModal.tsx. One line framing what the
 * map is, three ways to start (a guided tour, a browse list of what's nearby, or straight onto
 * the map), and a close affordance that works the same as everywhere else in the app: backdrop
 * click, Esc, or the X. Shown once per browser via useEntrance.ts, then never again. */
export default function Entrance({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const doors: { title: string; detail: string; onPick: () => void }[] = [
    {
      title: "Take a guided tour",
      detail: "Via Appia, a day in Ostia, or the news of 117 CE — walk a route stop by stop.",
      onPick: () => {
        openTourPanel();
        onClose();
      },
    },
    {
      title: "See what's nearby",
      detail: "Browse every place on screen as a list, and jump straight to one.",
      onPick: () => {
        openPlacesInView();
        onClose();
      },
    },
    {
      title: "Just start exploring",
      detail: "Pan, zoom, and click anything that catches your eye.",
      onPick: onClose,
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(32,33,36,.5)",
        zIndex: 60,
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
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,.35)",
          width: "min(460px, 100%)",
          maxHeight: "85vh",
          overflowY: "auto",
          font: "14px Roboto, sans-serif",
          color: "var(--text-strong)",
        }}
      >
        <div style={{ padding: "20px 24px 4px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#b0431a" }} />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--text)" }}>Roman Maps</h2>
          </div>
          <button
            onClick={onClose}
            title="Close"
            style={{ width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center", flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--icon)">
              <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.7 2.88 18.3 9.17 12 2.88 5.71 4.3 4.3l6.29 6.28L16.89 4.3z" />
            </svg>
          </button>
        </div>

        <div style={{ padding: "8px 24px 24px" }}>
          <p style={{ margin: "8px 0 20px", lineHeight: 1.55 }}>
            The Roman Empire at its peak, 11 August 117 CE, mapped street by street — pick a way in.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {doors.map((d) => (
              <button
                key={d.title}
                onClick={d.onPick}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--divider)",
                  background: "var(--surface-3)",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{d.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 2, lineHeight: 1.4 }}>{d.detail}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

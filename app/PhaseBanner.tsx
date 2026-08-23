"use client";

import { usePhaseBanner, dismissPhaseBanner } from "./usePhaseBanner";
import { useIsMobile } from "./useIsMobile";

/** [06-P0-1] A site like Pompeii or Herculaneum was destroyed before 117 CE, but its map view
 * still renders full OSM building detail — the only honest way to show a buried city's excavated
 * plan. Without a notice, that detail alone could read as "this is how the city stood in 117,"
 * the opposite of the truth. Shown once per site per session (app/usePhaseBanner.ts), triggered
 * from Map.tsx's loadSiteDetail the first time such a site's buildings finish loading. */
export default function PhaseBanner() {
  const banner = usePhaseBanner();
  const isMobile = useIsMobile();

  if (!banner) return null;

  return (
    <div
      role="status"
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: isMobile ? "calc(76px + env(safe-area-inset-bottom))" : 64,
        zIndex: 7,
        maxWidth: isMobile ? "calc(100vw - 32px)" : 420,
        width: "max-content",
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 10,
        background: "var(--warn-bg)",
        color: "var(--warn-text)",
        boxShadow: "var(--shadow-2)",
        fontSize: 13,
        lineHeight: 1.4,
        transition: "opacity 200ms ease, transform 200ms ease",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="var(--warn-text)"
        style={{ flexShrink: 0, marginTop: 1 }}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <div style={{ flex: 1 }}>
        <strong style={{ fontWeight: 600 }}>{banner.siteName}: </strong>
        {banner.note}
      </div>
      <button
        onClick={dismissPhaseBanner}
        title="Dismiss"
        aria-label="Dismiss"
        style={{
          flexShrink: 0,
          width: 22,
          height: 22,
          display: "grid",
          placeItems: "center",
          borderRadius: 999,
          color: "var(--warn-text)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
}

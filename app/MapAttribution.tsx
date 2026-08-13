"use client";

import { useIsMobile } from "./useIsMobile";

/** Bottom-of-map data-credit row. Left-inset matches the LeftRail (desktop) or hugs the edge
 * (mobile, where the rail is hidden). The empire/year branding lives in the Chrome epoch pill,
 * not here — this row is data credits only. */
export default function MapAttribution() {
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: isMobile ? 0 : 60,
        right: 0,
        height: 20,
        background: "rgba(255,255,255,.85)",
        color: "#5f6368",
        fontSize: 11,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        zIndex: 3,
        pointerEvents: "auto",
        userSelect: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      Data ©{" "}
      <a href="https://itiner-e.org" target="_blank" rel="noopener noreferrer" style={{ color: "#5f6368", textDecoration: "underline" }}>
        Itiner-e
      </a>{" "}
      ·{" "}
      <a href="https://dh.gu.se/dare/" target="_blank" rel="noopener noreferrer" style={{ color: "#5f6368", textDecoration: "underline" }}>
        DARE
      </a>{" "}
      ·{" "}
      <a href="https://pelagios.org" target="_blank" rel="noopener noreferrer" style={{ color: "#5f6368", textDecoration: "underline" }}>
        Pelagios
      </a>{" "}
      ·{" "}
      <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#5f6368", textDecoration: "underline" }}>
        Natural Earth
      </a>{" "}
      · OSM contributors
    </div>
  );
}

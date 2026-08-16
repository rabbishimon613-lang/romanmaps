"use client";

import { useState } from "react";
import { useIsMobile } from "./useIsMobile";

const SOURCES: { label: string; href: string }[] = [
  { label: "Itiner-e", href: "https://itiner-e.org" },
  { label: "DARE", href: "https://dh.gu.se/dare/" },
  { label: "Pelagios", href: "https://pelagios.org" },
  { label: "Natural Earth", href: "https://www.naturalearthdata.com/" },
];

/** Bottom-of-map data-credit row. On desktop it's a thin strip inset past the LeftRail. On a
 * phone the full credit line was a solid white band across the bottom of the screen — wider and
 * louder than anything Google shows — so it collapses to a small "Data ©" chip in the corner
 * that expands to the full list on tap. */
export default function MapAttribution() {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  const links = SOURCES.map((s, i) => (
    <span key={s.href}>
      {i > 0 ? " · " : null}
      <a
        href={s.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--text-2)", textDecoration: "underline" }}
      >
        {s.label}
      </a>
    </span>
  ));

  if (isMobile && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        title="Data sources"
        style={{
          position: "absolute",
          right: 0,
          bottom: "env(safe-area-inset-bottom)",
          background: "var(--scrim)",
          color: "var(--text-2)",
          fontSize: 10,
          lineHeight: "16px",
          padding: "0 6px",
          borderRadius: "4px 0 0 0",
          zIndex: 3,
          userSelect: "none",
        }}
      >
        Data ©
      </button>
    );
  }

  return (
    <div
      onClick={() => isMobile && setExpanded(false)}
      style={{
        position: "absolute",
        bottom: isMobile ? "env(safe-area-inset-bottom)" : 0,
        left: isMobile ? 0 : 60,
        right: 0,
        height: 20,
        background: "var(--scrim)",
        color: "var(--text-2)",
        fontSize: isMobile ? 10 : 11,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 4,
        zIndex: 3,
        pointerEvents: "auto",
        userSelect: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      Data © {links} · OSM contributors
    </div>
  );
}

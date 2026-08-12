"use client";

import { useState } from "react";
import SitesPanel from "./SitesPanel";

/** 60px-wide dark left rail, styled after Google Maps' side icons column. */
export default function LeftRail() {
  const [sitesOpen, setSitesOpen] = useState(false);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 60,
          background: "#202124",
          color: "#e8eaed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: 12,
          zIndex: 10,
        }}
      >
        <RailButton label="Menu" glyph={<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />} />
        <RailButton
          label="Explore cities"
          active={sitesOpen}
          onClick={() => setSitesOpen((o) => !o)}
          glyph={<path d="M12 2 4 6v6c0 5 3.5 9.7 8 10 4.5-.3 8-5 8-10V6l-8-4z" />}
        />
        <RailButton label="Saved" glyph={<path d="M19 3H5c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />} />
        <RailButton
          label="Recents"
          glyph={<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />}
        />
        <div style={{ flex: 1 }} />
        <RailButton
          label="About"
          glyph={<path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z" />}
        />
      </div>
      <SitesPanel open={sitesOpen} onClose={() => setSitesOpen(false)} />
    </>
  );
}

function RailButton({
  label,
  glyph,
  active,
  onClick,
}: {
  label: string;
  glyph: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      style={{
        width: 44,
        height: 44,
        margin: "4px 0",
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
        background: active ? "#3c4043" : "transparent",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
        {glyph}
      </svg>
    </button>
  );
}

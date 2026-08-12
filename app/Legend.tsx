"use client";

import { useState } from "react";
import { CATEGORY_GROUPS } from "./poiCategories";
import { useIsMobile } from "./useIsMobile";
import { usePoiPanel } from "./usePoiPanel";

/** Google-Maps-style legend: small collapsible panel explaining what each POI dot color means.
 * Sits above the Layers button, bottom-right. Closed by default so it doesn't compete with the
 * epoch pill / attribution for space on first load. */
export default function Legend() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const poiOpen = !!usePoiPanel();

  // Hidden while the mobile Place details bottom sheet covers this corner of the screen.
  if (isMobile && poiOpen) return null;

  return (
    <div style={{ position: "absolute", right: 12, bottom: 214, zIndex: 5 }}>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 48,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 3px 8px rgba(0,0,0,.15)",
            padding: "8px 0",
            width: 240,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "6px 16px 10px", fontSize: 13, fontWeight: 600, color: "#3c4043" }}>
            Landmarks
          </div>
          {CATEGORY_GROUPS.map((g) => (
            <div
              key={g.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "5px 16px",
                fontSize: 12.5,
                color: "#3c4043",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: g.color,
                  flexShrink: 0,
                  boxShadow: "0 0 0 1.5px #f4ead5, 0 0 0 2.5px rgba(0,0,0,.1)",
                }}
              />
              {g.label}
            </div>
          ))}
        </div>
      )}
      <button
        title="Legend"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: open ? "#e8f0fe" : "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={open ? "#1a73e8" : "#5f6368"}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
        </svg>
      </button>
    </div>
  );
}

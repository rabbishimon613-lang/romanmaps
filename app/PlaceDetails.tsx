"use client";

import { useEffect, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { usePoiPanel, clearPoi } from "./usePoiPanel";

const CATEGORY_COLORS: Record<string, string> = {
  temple: "#8b1a1a",
  bathhouse: "#1a6b8b",
  amphitheater: "#7a4a1a",
  theater: "#7a4a1a",
  circus: "#7a4a1a",
  forum: "#b0431a",
  basilica: "#b0431a",
  curia: "#b0431a",
  palace: "#6a1a8b",
  port: "#1a5c8b",
  lighthouse: "#1a5c8b",
  canal: "#1a5c8b",
  aqueduct: "#1a6b46",
  fort: "#3c4043",
  mansio: "#3c4043",
  mine: "#3c4043",
  library: "#8b6a1a",
  arch: "#8b1a1a",
  column: "#8b1a1a",
  monument: "#8b1a1a",
  mausoleum: "#5c1414",
  market: "#8b6a1a",
  warehouse: "#8b6a1a",
  road: "#5f6368",
  gate: "#5f6368",
  synagogue: "#1a6b8b",
  necropolis: "#5c1414",
};
const DEFAULT_COLOR = "#8b1a1a";

const CONFIDENCE_COLOR: Record<string, string> = {
  high: "#188038",
  medium: "#b06000",
  low: "#5f6368",
};

function formatYear(y: any): string {
  if (y === null || y === undefined || y === "") return "";
  const n = Number(y);
  if (Number.isNaN(n)) return String(y);
  return n < 0 ? `${-n} BCE` : `${n} CE`;
}

function titleCase(s: string): string {
  return s.replace(/(^|\s|-)\w/g, (c) => c.toUpperCase());
}

function useIsMobile(breakpoint = 640): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return mobile;
}

/** Google-Maps-style place details panel: click a POI (app/Map.tsx pois-dot layer) to open,
 * slides in from the left on desktop / up from the bottom on mobile. Replaces the old Maplibre
 * click-popup. Drag-to-expand bottom sheet + "Directions to here" wiring are future upgrades
 * (Directions itself hasn't shipped yet). */
export default function PlaceDetails() {
  const selected = usePoiPanel();
  const [rendered, setRendered] = useState<{ props: Record<string, any>; lngLat: [number, number] } | null>(null);
  const isMobile = useIsMobile();
  const open = !!selected;

  useEffect(() => {
    if (selected) setRendered(selected);
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearPoi();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!rendered) return null;
  const p = rendered.props;

  const name = p.name_latin || p.name_english || "Unknown";
  const subtitle = p.name_english && p.name_english !== p.name_latin ? p.name_english : "";
  const category: string = p.category || "";
  const color = CATEGORY_COLORS[category] || DEFAULT_COLOR;

  const built = formatYear(p.built);
  const destroyed = formatYear(p.destroyed);
  const dateLine = built ? (destroyed ? `Built ${built} · Destroyed ${destroyed}` : `Built ${built}`) : "";

  const locationLine = [p.province, p.modern_location].filter(Boolean).join(" · ");

  const sources: string[] = Array.isArray(p.sources) ? p.sources : [];
  const confidence: string = p.confidence || "";

  const flyTo = () => {
    const map = (window as any).__map as MLMap | undefined;
    if (map) map.flyTo({ center: rendered.lngLat, zoom: Math.max(map.getZoom(), 8), duration: 800 });
  };

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        maxHeight: "55vh",
        borderRadius: "12px 12px 0 0",
        transform: open ? "translateY(0)" : "translateY(110%)",
      }
    : {
        position: "absolute",
        left: 10,
        top: 66,
        bottom: 16,
        width: 360,
        maxWidth: "calc(100vw - 20px)",
        borderRadius: 8,
        transform: open ? "translateX(0)" : "translateX(-120%)",
      };

  return (
    <div
      style={{
        ...panelStyle,
        background: "#fff",
        boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.2)",
        zIndex: 7,
        transition: "transform 220ms ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      role="dialog"
      aria-label="Place details"
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "16px 16px 12px" }}>
        <button
          title="Close"
          onClick={() => clearPoi()}
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#202124", lineHeight: 1.25 }}>{name}</div>
          {subtitle && <div style={{ fontSize: 13, color: "#5f6368", marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>

      <div style={{ overflowY: "auto", padding: "0 16px 16px" }}>
        {/* Category + confidence chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {category && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 500,
                color: "#3c4043",
                background: "#f1f3f4",
                borderRadius: 999,
                padding: "4px 10px",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
              {titleCase(category)}
            </span>
          )}
          {p.extant_117ce === false && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#8a5a00",
                background: "#fef7e0",
                borderRadius: 999,
                padding: "4px 10px",
              }}
            >
              Not standing in 117 CE
            </span>
          )}
        </div>

        {dateLine && <div style={{ fontSize: 13, color: "#3c4043", marginBottom: 4 }}>{dateLine}</div>}
        {locationLine && <div style={{ fontSize: 13, color: "#5f6368", marginBottom: 10 }}>{locationLine}</div>}

        {p.notes && (
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#202124", marginBottom: 14 }}>{p.notes}</p>
        )}

        <button
          title="Coming soon — road-routing (Directions) hasn't shipped yet"
          disabled
          style={{
            width: "100%",
            height: 40,
            borderRadius: 8,
            background: "#f1f3f4",
            color: "#9aa0a6",
            fontSize: 13.5,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "not-allowed",
            marginBottom: 14,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#9aa0a6">
            <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.41 0l-9 9a1 1 0 0 0 0 1.41l9 9a1 1 0 0 0 1.41 0l9-9a1 1 0 0 0 0-1.41zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
          </svg>
          Directions to here (coming soon)
        </button>

        <button
          onClick={flyTo}
          style={{
            width: "100%",
            height: 36,
            borderRadius: 8,
            background: "#fff",
            border: "1px solid #dadce0",
            color: "#1a73e8",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          Center on map
        </button>

        {sources.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#5f6368", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>
              Sources
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
              {sources.map((s, i) => (
                <li key={i} style={{ fontSize: 12, color: "#5f6368", lineHeight: 1.4 }}>
                  {/^https?:\/\//.test(s) ? (
                    <a href={s} target="_blank" rel="noopener noreferrer" style={{ color: "#1a73e8", wordBreak: "break-all" }}>
                      {s}
                    </a>
                  ) : (
                    s
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {confidence && (
          <div style={{ marginTop: 12, fontSize: 11, color: CONFIDENCE_COLOR[confidence] || "#5f6368" }}>
            Sourcing confidence: {confidence}
          </div>
        )}
      </div>
    </div>
  );
}

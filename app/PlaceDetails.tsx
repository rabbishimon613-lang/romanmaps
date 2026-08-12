"use client";

import { useEffect, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { usePoiPanel, clearPoi } from "./usePoiPanel";
import { colorForCategory } from "./poiCategories";
import { useIsMobile } from "./useIsMobile";

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
  const color = colorForCategory(category);

  const built = formatYear(p.built);
  const destroyed = formatYear(p.destroyed);
  const dateLine = built ? (destroyed ? `Built ${built} · Destroyed ${destroyed}` : `Built ${built}`) : "";

  const locationLine = [p.province, p.modern_location].filter(Boolean).join(" · ");

  const sources: string[] = Array.isArray(p.sources) ? p.sources : [];

  // Clean shift-scholar voice out of notes: drop bracketed asides, sourcing meta,
  // "per the brief", "guardrail", any parenthetical citations that read like margin notes.
  // Keep only the first 1–2 clean sentences that would work as a tourist-facing description.
  const cleanNotes = (raw: string): string => {
    if (!raw) return "";
    let t = String(raw);
    // Strip parentheticals that are clearly meta ("per Pliny...", "cf.", "see also")
    t = t.replace(/\([^)]*\b(per|cf\.?|see|note|extant_117ce|guardrail|brief|Squarciapino|Runesson|White vs\.?|caveat)[^)]*\)/gi, "");
    // Strip trailing "-- but even..." shift-author asides
    t = t.replace(/\s*--\s*[^.]*?(guardrail|caveat|per the|extant_117ce|kept as|kept per|kept anyway)[^.]*\.?/gi, "");
    // Remove scholar hedge phrases
    t = t.replace(/\b(kept as|kept per|so it is kept as|per the guardrail|per the brief|for tourists|programmatically)\b[^.]*\.?/gi, "");
    // Collapse whitespace
    t = t.replace(/\s+/g, " ").trim();
    // Grab first two sentences, max ~280 chars
    const sentences = t.split(/(?<=[.!?])\s+/).filter(Boolean);
    let out = sentences.slice(0, 2).join(" ");
    if (out.length > 280) {
      const cut = out.slice(0, 280);
      const lastPeriod = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("!"), cut.lastIndexOf("?"));
      out = lastPeriod > 100 ? cut.slice(0, lastPeriod + 1) : cut + "…";
    }
    return out;
  };
  const notes = cleanNotes(p.notes || "");

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
        left: 70,
        top: 66,
        bottom: 40,
        width: 380,
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
      {/* Banner — Google Maps has a photo strip here; we use a category-tinted band with icon. */}
      <div
        style={{
          height: 128,
          background: `linear-gradient(135deg, ${color}bb 0%, ${color}66 100%)`,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <button
          title="Close"
          onClick={() => clearPoi()}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: 999,
            background: "rgba(255,255,255,.92)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      {/* Title block */}
      <div style={{ padding: "16px 16px 4px" }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: "#202124", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
          {name}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: "#5f6368", marginTop: 4 }}>{subtitle}</div>
        )}
        {category && (
          <div style={{ fontSize: 14, color: "#5f6368", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: "inline-block" }} />
            {titleCase(category)}
            {p.province && <span style={{ color: "#c8ccd0" }}>·</span>}
            {p.province && <span>{p.province}</span>}
          </div>
        )}
      </div>

      {/* Google-Maps-style pill button row */}
      <div style={{ display: "flex", gap: 6, padding: "12px 12px 8px", flexShrink: 0 }}>
        <PillButton
          label="Directions"
          disabled
          title="Coming soon — road routing hasn't shipped yet"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.41 0l-9 9a1 1 0 0 0 0 1.41l9 9a1 1 0 0 0 1.41 0l9-9a1 1 0 0 0 0-1.41zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
            </svg>
          }
        />
        <PillButton
          label="Save"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        <PillButton
          label="Nearby"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          }
          onClick={flyTo}
        />
        <PillButton
          label="Share"
          onClick={() => navigator.clipboard?.writeText(window.location.href)}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.15c-.05.21-.08.43-.08.66 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
          }
        />
      </div>

      <div style={{ height: 1, background: "#e8eaed", margin: "4px 16px 8px" }} />

      <div style={{ overflowY: "auto", padding: "0 16px 20px", flex: 1 }}>
        {p.extant_117ce === false && (
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#8a5a00",
              background: "#fef7e0",
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#a06600"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            Not standing in 117 CE
          </div>
        )}

        {/* Info rows — Google Maps' address / hours / phone list styling */}
        <InfoRow
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          }
          text={dateLine || "Date unknown"}
        />
        {locationLine && (
          <InfoRow
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            }
            text={locationLine}
          />
        )}

        {notes && (
          <div style={{ marginTop: 16 }}>
            <SectionHeader label="About" />
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "#202124", margin: 0 }}>{notes}</p>
          </div>
        )}

        {sources.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <SectionHeader label="Sources" />
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {sources.map((s, i) => (
                <li key={i} style={{ fontSize: 12.5, color: "#5f6368", lineHeight: 1.45 }}>
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

        {/* Sourcing confidence intentionally hidden — internal editorial signal, not user-facing. */}
      </div>
    </div>
  );
}

function PillButton({
  label,
  icon,
  onClick,
  disabled,
  title,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "10px 4px",
        borderRadius: 10,
        background: disabled ? "#f8f9fa" : "#fff",
        color: disabled ? "#9aa0a6" : "#1a73e8",
        border: `1px solid ${disabled ? "#f1f3f4" : "#dadce0"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: 0.1,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid #f1f3f4" }}>
      <div style={{ flexShrink: 0, width: 20, height: 20, marginTop: 1 }}>{icon}</div>
      <div style={{ fontSize: 13.5, color: "#3c4043", lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#5f6368",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginBottom: 8,
      }}
    >
      {label}
    </div>
  );
}

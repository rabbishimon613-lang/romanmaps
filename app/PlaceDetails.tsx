"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { usePoiPanel, clearPoi, selectPoi } from "./usePoiPanel";
import { colorForCategory } from "./poiCategories";
import { lifeForCategory } from "./categoryLife";
import { useIsMobile } from "./useIsMobile";
import { useNearbyPois } from "./useNearby";
import { useUnits, formatDistance } from "./useUnits";
import { setDirectionsDestination } from "./useDirections";
import { motionDuration } from "./reducedMotion";

const CONFIDENCE_COLOR: Record<string, string> = {
  high: "var(--ok)",
  medium: "var(--warn-text)",
  low: "var(--text-2)",
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

/** A place reaches this panel by two routes and they don't agree on types. A map click hands us
 * Maplibre's feature properties, where every array has been flattened to a JSON string; a deep
 * link or the legion locator hands us the GeoJSON we fetched ourselves, where it is still an
 * array. Accept both, or the list blocks below silently render nothing on the common path. */
function asArray<T>(v: any): T[] {
  if (Array.isArray(v)) return v as T[];
  if (typeof v === "string" && v.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** One entry of `ancient_sources[]` — a classical text that describes this place. `note` says
 * what the passage actually contains, so the citation reads as content and not as apparatus. */
type AncientSource = {
  author?: string;
  work?: string;
  ref?: string;
  quote?: string;
  note?: string;
};

/** Google-Maps-style place details panel: click a POI (app/PoiMarkers.tsx HTML pin) to open,
 * slides in from the left on desktop / up from the bottom on mobile. Replaces the old Maplibre
 * click-popup. On mobile the sheet snaps between a half-height and a full-height state via the
 * drag handle at its top edge; dragging well below half height dismisses it. "Directions" sets
 * this place as the destination in the shared useDirections.ts store — [07-P1-1]. */
// Mobile bottom-sheet snap heights, as vh — three detents, mirroring Google Maps mobile's
// peek/half/full sheet. Drag the handle to move between them; dragging well below peek height
// dismisses the panel. A fast flick jumps one detent in the flick direction regardless of how
// far the pointer traveled — [04-P0-1] sheet-detents.
const SHEET_PEEK_VH = 32;
const SHEET_HALF_VH = 55;
const SHEET_FULL_VH = 92;
const SHEET_MIN_PX = 80;
const SHEET_DISMISS_SLACK_PX = 120;
const SHEET_DETENTS = ["peek", "half", "full"] as const;
type SheetState = (typeof SHEET_DETENTS)[number];
// Sustained release velocity, in sheet-height px/ms, above which a drag is treated as a flick
// (snap one detent in that direction) rather than a slow drag (snap to nearest by position).
const SHEET_FLICK_VELOCITY = 0.5;

export default function PlaceDetails() {
  const selected = usePoiPanel();
  const [rendered, setRendered] = useState<{ props: Record<string, any>; lngLat: [number, number] } | null>(null);
  const isMobile = useIsMobile();
  const open = !!selected;
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);
  // A dead image_url (offline, network-blocked, wrong filename) used to leave the <img> hidden
  // but its position:relative wrapper still in the layout — collapsed to zero height once the
  // image was gone, which left the credit caption (position:absolute, bottom:0 *of that wrapper*)
  // sitting right at the top of the panel, overlapping and eating pointer events meant for the
  // mobile drag handle above it. Tracking the failure in state so a broken image degrades exactly
  // like "no image_url" does — the fallback gradient rail, not a half-collapsed hero block.
  const [imageFailed, setImageFailed] = useState(false);

  // Drag-to-expand bottom sheet (mobile only). `sheetState` is the committed snap point;
  // `dragPx` is a live height override while a drag gesture is in progress (null when idle).
  const [sheetState, setSheetState] = useState<SheetState>("half");
  const [dragPx, setDragPx] = useState<number | null>(null);

  // Hooks that read `rendered` must run unconditionally (before the `if (!rendered) return null`
  // below), so they take the not-yet-selected case via optional chaining rather than being
  // skipped on some renders — [03-P1-4] nearby-related.
  const [units] = useUnits();
  const nearby = useNearbyPois(
    rendered?.props?.id,
    rendered?.lngLat?.[0],
    rendered?.lngLat?.[1],
    rendered?.props?.category || "",
    6,
  );

  useEffect(() => {
    if (selected) {
      setRendered(selected);
      setSheetState("half");
      setDragPx(null);
      setImageFailed(false);
    }
  }, [selected]);

  const vhFor = (state: SheetState) => (state === "full" ? SHEET_FULL_VH : state === "half" ? SHEET_HALF_VH : SHEET_PEEK_VH);
  const heightPxFor = (state: SheetState) => (vhFor(state) / 100) * window.innerHeight;

  // Window-level listeners (not element-level) so the drag tracks the pointer even once it leaves
  // the small handle's own bounds. All state for one gesture lives in this closure — added and
  // removed as a matched pair per pointerdown, so there's no stale-listener risk across re-renders.
  const onHandlePointerDown = (e: React.PointerEvent) => {
    if (!isMobile) return;
    const startY = e.clientY;
    const startHeightPx = heightPxFor(sheetState);
    let currentPx = startHeightPx;
    // Exponentially-smoothed release velocity, in sheet-height px/ms (positive = growing/dragging
    // up). A handful of noisy per-event samples make a poor flick signal on their own; smoothing
    // keeps the last real swipe direction dominant without needing a full sample buffer.
    let lastY = startY;
    let lastT = performance.now();
    let velocityPxPerMs = 0;

    const onMove = (ev: PointerEvent) => {
      const delta = startY - ev.clientY; // drag up = positive = taller
      const maxPx = heightPxFor("full");
      currentPx = Math.min(maxPx, Math.max(SHEET_MIN_PX, startHeightPx + delta));
      setDragPx(currentPx);

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const instantVelocity = -(ev.clientY - lastY) / dt;
        velocityPxPerMs = velocityPxPerMs * 0.6 + instantVelocity * 0.4;
      }
      lastY = ev.clientY;
      lastT = now;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setDragPx(null);

      const idx = SHEET_DETENTS.indexOf(sheetState);
      if (velocityPxPerMs > SHEET_FLICK_VELOCITY) {
        // Fast upward flick — advance one detent regardless of how far the pointer traveled.
        setSheetState(SHEET_DETENTS[Math.min(idx + 1, SHEET_DETENTS.length - 1)]);
        return;
      }
      if (velocityPxPerMs < -SHEET_FLICK_VELOCITY) {
        // Fast downward flick — retreat one detent, or dismiss from the lowest one.
        if (idx === 0) {
          clearPoi();
          return;
        }
        setSheetState(SHEET_DETENTS[idx - 1]);
        return;
      }

      // Slow release — snap to the nearest detent by position, or dismiss if let go well below
      // the lowest one (peek).
      const peekPx = heightPxFor("peek");
      if (currentPx < peekPx - SHEET_DISMISS_SLACK_PX) {
        clearPoi();
        return;
      }
      let nearest: SheetState = "peek";
      let nearestDist = Infinity;
      for (const s of SHEET_DETENTS) {
        const d = Math.abs(heightPxFor(s) - currentPx);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = s;
        }
      }
      setSheetState(nearest);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

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

  const sources = asArray<string>(p.sources);
  const ancientSources = asArray<AncientSource>(p.ancient_sources).filter((s) => s && (s.author || s.work));

  // Clean shift-scholar voice out of notes: drop bracketed asides, sourcing meta,
  // "per the brief", "guardrail", any parenthetical citations that read like margin notes.
  // The data itself should already be written in tourist-facing voice — this is a safety net,
  // not the primary defense. Full text renders; nothing is cut for length.
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
    return t.replace(/\s+/g, " ").trim();
  };
  const notes = cleanNotes(p.notes || "");
  const categoryLife = lifeForCategory(category);

  const flyTo = () => {
    const map = (window as any).__map as MLMap | undefined;
    if (map) map.flyTo({ center: rendered.lngLat, zoom: Math.max(map.getZoom(), 8), duration: motionDuration(800) });
  };

  const copyLink = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
    }).catch(() => {});
  };

  const isDragging = dragPx !== null;
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        maxHeight: isDragging ? `${dragPx}px` : `${vhFor(sheetState)}vh`,
        borderRadius: "12px 12px 0 0",
        transform: open ? "translateY(0)" : "translateY(110%)",
        transition: isDragging ? "transform 220ms ease" : "transform 220ms ease, max-height 200ms ease",
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
        transition: "transform 220ms ease",
      };

  return (
    <div
      aria-hidden={!open}
      // @ts-ignore inert is a valid HTML attribute
      inert={!open ? "" : undefined}
      style={{
        ...panelStyle,
        background: "var(--surface)",
        boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.2)",
        zIndex: 7,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      role="dialog"
      aria-label="Place details"
    >
      {isMobile && (
        <div
          onPointerDown={onHandlePointerDown}
          style={{
            flexShrink: 0,
            width: "100%",
            padding: "9px 0 7px",
            display: "flex",
            justifyContent: "center",
            touchAction: "none",
            cursor: "grab",
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "var(--divider)" }} />
        </div>
      )}
      {/* Hero band: an artist rendering / engraving / reconstruction (image_url on the POI).
       * When no image is supplied we fall back to a thin category-tinted rail — no empty gray
       * slab. Image credit renders under the picture, kept small so it doesn't crowd the title. */}
      {p.image_url && !imageFailed ? (
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={p.image_url}
            alt={p.image_alt || name}
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              height: 180,
              objectFit: "cover",
              background: `${color}22`,
            }}
            onError={() => {
              // Broken URL → fall back to the same gradient rail "no image_url" gets, rather than
              // leaving a collapsed wrapper with an orphaned credit caption in the layout.
              setImageFailed(true);
            }}
          />
          {p.image_credit && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "3px 8px",
                fontSize: 10,
                lineHeight: 1.2,
                color: "rgba(255,255,255,.92)",
                background: "linear-gradient(180deg, transparent, rgba(0,0,0,.5))",
                textShadow: "0 1px 2px rgba(0,0,0,.6)",
              }}
            >
              {p.image_credit}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            height: 6,
            background: `linear-gradient(90deg, ${color} 0%, ${color}66 100%)`,
            flexShrink: 0,
          }}
        />
      )}
      <button
        title="Close"
        onClick={() => clearPoi()}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 32,
          height: 32,
          borderRadius: 999,
          background: "rgba(255,255,255,.95)",
          display: "grid",
          placeItems: "center",
          boxShadow: "var(--shadow-1)",
          zIndex: 1,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--icon)">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      {/* Title block */}
      <div style={{ padding: "14px 48px 4px 16px" }}>
        <div className="roman-label" style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
          {name}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>{subtitle}</div>
        )}
        {category && (
          <div style={{ fontSize: 14, color: "var(--text-2)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: "inline-block" }} />
            {titleCase(category)}
            {p.province && <span style={{ color: "var(--divider)" }}>·</span>}
            {p.province && <span>{p.province}</span>}
          </div>
        )}
      </div>

      {/* Three working actions — Directions + Zoom to place + Copy link. */}
      <div style={{ display: "flex", gap: 6, padding: "12px 12px 8px", flexShrink: 0 }}>
        <PillButton
          label="Directions"
          onClick={() => {
            // Close this panel/sheet too — on mobile the Directions readout card would otherwise
            // render underneath the still-open bottom sheet, invisible until dismissed by hand.
            setDirectionsDestination(rendered.lngLat, name);
            clearPoi();
          }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
            </svg>
          }
        />
        <PillButton
          label="Zoom to"
          onClick={flyTo}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM9 6h1v3H9zM6 9h6v1H6z" />
            </svg>
          }
        />
        <PillButton
          label={copied ? "Copied!" : "Copy link"}
          onClick={copyLink}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 0-10z" />
            </svg>
          }
        />
      </div>

      <div style={{ height: 1, background: "var(--divider)", margin: "4px 16px 8px" }} />

      <div style={{ overflowY: "auto", padding: "0 16px 20px", flex: 1 }}>
        {p.extant_117ce === false && (
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--warn-text)",
              background: "var(--warn-bg)",
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--warn-text)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            Not standing in 117 CE
          </div>
        )}

        {/* Info rows — Google Maps' address / hours / phone list styling */}
        <InfoRow
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--icon)">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          }
          text={dateLine || "Date unknown"}
        />
        {locationLine && (
          <InfoRow
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--icon)">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            }
            text={locationLine}
          />
        )}

        {notes && (
          <div style={{ marginTop: 16 }}>
            <SectionHeader label="About" />
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--text)", margin: 0 }}>{notes}</p>
          </div>
        )}

        {/* Written once per category and shown on every card of that category — what a place of
         * this kind was actually like to stand in. Absent for categories not yet written. */}
        {categoryLife && (
          <div style={{ marginTop: 18 }}>
            <SectionHeader label="What happened here" />
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-2)", margin: 0 }}>{categoryLife}</p>
          </div>
        )}

        {/* What the Romans wrote about this place. Sits above the modern link list because a
         * passage of Strabo is something to read; a Pleiades URL is provenance. */}
        {ancientSources.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <SectionHeader label="In ancient writing" />
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {ancientSources.map((s, i) => (
                <li key={i}>
                  <div style={{ fontSize: 13, color: "var(--text-strong)", lineHeight: 1.35 }}>
                    {s.author && <span style={{ fontWeight: 600 }}>{s.author}</span>}
                    {s.work && (
                      <>
                        {s.author ? ", " : ""}
                        <span style={{ fontStyle: "italic" }}>{s.work}</span>
                      </>
                    )}
                    {s.ref && <span style={{ color: "var(--text-2)" }}>{` ${s.ref}`}</span>}
                  </div>
                  {s.quote && (
                    <p
                      style={{
                        margin: "5px 0 0",
                        paddingLeft: 10,
                        borderLeft: "2px solid var(--divider)",
                        fontSize: 13,
                        fontStyle: "italic",
                        lineHeight: 1.5,
                        color: "var(--text)",
                      }}
                    >
                      {s.quote}
                    </p>
                  )}
                  {s.note && (
                    <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.5, color: "var(--text-2)" }}>
                      {s.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {sources.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <SectionHeader label="Sources" />
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {sources.map((s, i) => (
                <li key={i} style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.45 }}>
                  {/^https?:\/\//.test(s) ? (
                    <a href={s} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", wordBreak: "break-all" }}>
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

        {/* Nearby/related places — proximity ranked, with a same-category boost so a relevant
         * place a little further off can beat an unrelated one next door. Clicking a card just
         * calls selectPoi() again, which re-renders this same panel in place — [03-P1-4]. */}
        {nearby.length > 0 && (
          <div style={{ marginTop: 18, marginBottom: 4 }}>
            <SectionHeader label="Nearby" />
            <div
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                paddingBottom: 4,
                marginLeft: -16,
                marginRight: -16,
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              {nearby.map((row) => {
                const rowColor = colorForCategory(row.category);
                return (
                  <button
                    key={row.id}
                    onClick={() => selectPoi(row.props, [row.lng, row.lat])}
                    style={{
                      flexShrink: 0,
                      width: 116,
                      textAlign: "left",
                      border: "1px solid var(--divider)",
                      borderRadius: 8,
                      overflow: "hidden",
                      background: "var(--surface)",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {row.imageUrl ? (
                      <img
                        src={row.imageUrl}
                        alt=""
                        loading="lazy"
                        style={{ display: "block", width: "100%", height: 64, objectFit: "cover", background: `${rowColor}22` }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div style={{ height: 64, background: `linear-gradient(135deg, ${rowColor}55, ${rowColor}22)` }} />
                    )}
                    <div style={{ padding: "6px 8px 8px" }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--text)",
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {row.name}
                      </div>
                      <div style={{ fontSize: 10.5, color: "var(--text-2)", marginTop: 3 }}>
                        {formatDistance(row.distanceM, units)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
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
        background: disabled ? "var(--surface-3)" : "var(--surface)",
        color: disabled ? "var(--text-3)" : "var(--accent)",
        border: `1px solid ${disabled ? "var(--divider)" : "var(--divider)"}`,
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
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--divider)" }}>
      <div style={{ flexShrink: 0, width: 20, height: 20, marginTop: 1 }}>{icon}</div>
      <div style={{ fontSize: 13.5, color: "var(--text-strong)", lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "var(--text-2)",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginBottom: 8,
      }}
    >
      {label}
    </div>
  );
}

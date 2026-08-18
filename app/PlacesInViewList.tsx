"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { loadPois } from "./places";
import { SITES } from "./sites";
import { colorForCategory } from "./poiCategories";
import { selectPoi, usePoiPanel } from "./usePoiPanel";
import { closePlacesInView, openPlacesInView, usePlacesInViewOpen } from "./usePlacesInView";
import { useIsMobile } from "./useIsMobile";
import { useUnits, formatDistance } from "./useUnits";

const EARTH_RADIUS_M = 6371008.8;
const MAX_ROWS = 150;

type Row = {
  key: string;
  name: string;
  category: string;
  lng: number;
  lat: number;
  distanceM: number;
  kind: "poi" | "site";
  poiProps?: Record<string, any>;
  siteSlug?: string;
};

function haversineMeters(aLng: number, aLat: number, bLng: number, bLat: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Accessible, keyboard-navigable list of every curated place (POI or site) inside the current
 * map viewport — the thing a sighted user gets for free by scanning pins, and everyone else (a
 * screen-reader user, a keyboard-only user, anyone who just wants a scannable list) doesn't get
 * any other way. Doubles as a general browse UI: opening it with a zoomed-out view lists whatever
 * major places are on screen; zooming into a neighborhood narrows it to a handful. [05-P0-1] */
export default function PlacesInViewList() {
  const open = usePlacesInViewOpen();
  const isMobile = useIsMobile();
  const poiOpen = !!usePoiPanel();
  const [units] = useUnits();
  const [rows, setRows] = useState<Row[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Hidden while the mobile Place details bottom sheet covers this corner — same rule the rest
  // of the bottom-right FAB stack follows.
  const hideForSheet = isMobile && poiOpen;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const map = (window as any).__map as MLMap | undefined;

    const recompute = () => {
      if (cancelled || !map) return;
      const bounds = map.getBounds();
      const center = map.getCenter();
      loadPois().then((pois) => {
        if (cancelled) return;
        const next: Row[] = [];
        for (const p of pois) {
          if (!bounds.contains([p.lng, p.lat])) continue;
          next.push({
            key: `poi:${p.id}`,
            name: p.latin || p.modern || "Unnamed place",
            category: p.poiProps?.category || "",
            lng: p.lng,
            lat: p.lat,
            distanceM: haversineMeters(center.lng, center.lat, p.lng, p.lat),
            kind: "poi",
            poiProps: p.poiProps,
          });
        }
        for (const s of SITES) {
          if (!bounds.contains(s.center)) continue;
          next.push({
            key: `site:${s.slug}`,
            name: s.display,
            category: "city",
            lng: s.center[0],
            lat: s.center[1],
            distanceM: haversineMeters(center.lng, center.lat, s.center[0], s.center[1]),
            kind: "site",
            siteSlug: s.slug,
          });
        }
        next.sort((a, b) => a.distanceM - b.distanceM);
        setRows(next);
        setActiveIndex(0);
      });
    };

    recompute();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onMoveEnd = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(recompute, 200);
    };
    map?.on("moveend", onMoveEnd);
    listRef.current?.focus();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      map?.off("moveend", onMoveEnd);
    };
  }, [open]);

  const visibleRows = useMemo(() => rows.slice(0, MAX_ROWS), [rows]);
  const overflow = rows.length - visibleRows.length;

  const choose = (row: Row) => {
    const map = (window as any).__map as MLMap | undefined;
    if (row.kind === "poi" && row.poiProps) {
      selectPoi(row.poiProps, [row.lng, row.lat]);
      if (map) {
        const padding = isMobile
          ? { top: 0, right: 0, left: 0, bottom: Math.round(window.innerHeight * 0.55) }
          : { top: 66, right: 0, left: 470, bottom: 40 };
        map.flyTo({ center: [row.lng, row.lat], zoom: Math.max(map.getZoom(), 15.5), padding, duration: 900 });
      }
    } else if (row.kind === "site" && row.siteSlug) {
      const s = SITES.find((x) => x.slug === row.siteSlug);
      if (s && map) map.flyTo({ center: s.center, zoom: s.zoom, duration: 1400 });
      const loadSiteDetail = (window as any).__loadSiteDetail as ((slug: string) => void) | undefined;
      if (row.siteSlug) loadSiteDetail?.(row.siteSlug);
    }
    closePlacesInView();
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (visibleRows.length === 0) {
      if (e.key === "Escape") closePlacesInView();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, visibleRows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(visibleRows.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = visibleRows[activeIndex];
      if (row) choose(row);
    } else if (e.key === "Escape") {
      closePlacesInView();
    }
  };

  useEffect(() => {
    rowRefs.current.get(activeIndex)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (hideForSheet) return null;

  return (
    <>
      {/* Desktop: a FAB of its own, next open slot in the bottom-right stack. Mobile: no FAB —
          the phone's corner is already at its five-control budget, so this is reached from the
          hamburger menu instead (see Chrome.tsx). */}
      {!isMobile && (
        <button
          title="Places in view"
          onClick={() => (open ? closePlacesInView() : openPlacesInView())}
          style={{
            position: "absolute",
            right: 12,
            bottom: 361,
            width: 40,
            height: 40,
            borderRadius: 8,
            background: open ? "var(--accent-bg)" : "var(--surface)",
            boxShadow: "var(--shadow-1)",
            display: "grid",
            placeItems: "center",
            zIndex: 5,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={open ? "var(--accent)" : "var(--icon)"}>
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Places in view"
          style={
            isMobile
              ? {
                  position: "fixed",
                  inset: 0,
                  background: "rgba(32,33,36,.5)",
                  zIndex: 50,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }
              : {
                  position: "absolute",
                  right: 12,
                  bottom: 409,
                  zIndex: 6,
                }
          }
          onClick={isMobile ? closePlacesInView : undefined}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              borderRadius: isMobile ? "12px 12px 0 0" : 8,
              boxShadow: "var(--shadow-2)",
              width: isMobile ? "100%" : 300,
              maxWidth: isMobile ? "100%" : "calc(100vw - 20px)",
              // Desktop: the FAB sits high in the bottom-right stack (bottom:361), so a flat 60vh
              // cap would run off the top of a short window — bound it by the actual space above
              // the panel's own anchor (409px reserved below it) instead.
              maxHeight: isMobile ? "70vh" : "min(60vh, calc(100vh - 429px))",
              display: "flex",
              flexDirection: "column",
              paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderBottom: "1px solid var(--divider)",
                flexShrink: 0,
              }}
            >
              <strong style={{ fontSize: 14, color: "var(--text-strong)" }}>
                Places in view{rows.length > 0 ? ` · ${rows.length}` : ""}
              </strong>
              <button
                title="Close"
                onClick={closePlacesInView}
                style={{ width: 28, height: 28, borderRadius: 999, display: "grid", placeItems: "center" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--icon)">
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div
              ref={listRef}
              role="listbox"
              aria-label="Places currently visible on the map"
              tabIndex={0}
              onKeyDown={onListKeyDown}
              aria-activedescendant={visibleRows[activeIndex] ? `piv-${visibleRows[activeIndex].key}` : undefined}
              style={{ overflowY: "auto", outline: "none" }}
            >
              {visibleRows.length === 0 ? (
                <p style={{ padding: "16px 14px", color: "var(--text-2)", fontSize: 13 }}>
                  Nothing curated in view yet — pan or zoom toward a province, city, or road.
                </p>
              ) : (
                visibleRows.map((row, i) => (
                  <div
                    key={row.key}
                    id={`piv-${row.key}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    ref={(el) => {
                      if (el) rowRefs.current.set(i, el);
                      else rowRefs.current.delete(i);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => choose(row)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 14px",
                      cursor: "pointer",
                      background: i === activeIndex ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: row.kind === "site" ? "var(--accent)" : colorForCategory(row.category),
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          color: "var(--text)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.name}
                      </div>
                    </div>
                    <span style={{ fontSize: 11.5, color: "var(--text-2)", flexShrink: 0 }}>
                      {formatDistance(row.distanceM, units)}
                    </span>
                  </div>
                ))
              )}
              {overflow > 0 && (
                <p style={{ padding: "8px 14px 12px", color: "var(--text-2)", fontSize: 12 }}>
                  +{overflow} more — zoom in to narrow the list.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, MapMouseEvent, GeoJSONSource } from "maplibre-gl";
import { useUnits, formatDistance } from "./useUnits";
import { useIsMobile } from "./useIsMobile";
import { usePoiPanel } from "./usePoiPanel";
import { activateRuler, deactivateRuler, useRulerState } from "./useRuler";

const EARTH_RADIUS_M = 6371008.8;
const LINE_SOURCE = "ruler-line";
const POINTS_SOURCE = "ruler-points";

type LngLat = [number, number];

function haversineMeters(a: LngLat, b: LngLat): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(s)));
}

function lineFeatureCollection(points: LngLat[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features:
      points.length >= 2
        ? [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: points } }]
        : [],
  };
}

function pointFeatureCollection(points: LngLat[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: points.map((p) => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: p } })),
  };
}

function paintLayers(map: MLMap, points: LngLat[]) {
  (map.getSource(LINE_SOURCE) as GeoJSONSource | undefined)?.setData(lineFeatureCollection(points));
  (map.getSource(POINTS_SOURCE) as GeoJSONSource | undefined)?.setData(pointFeatureCollection(points));
}

export default function Ruler() {
  const { active, seedPoint } = useRulerState();
  const seedKey = seedPoint ? seedPoint.join(",") : "";
  const [points, setPoints] = useState<LngLat[]>([]);
  const [units] = useUnits();
  const pointsRef = useRef<LngLat[]>([]);
  pointsRef.current = points;
  const isMobile = useIsMobile();
  const poiOpen = !!usePoiPanel();
  // Hidden while the mobile Place details bottom sheet covers this corner — unless the user is
  // mid-measurement, in which case keep the readout card visible so they don't lose their points.
  const hideForSheet = isMobile && poiOpen && !active;

  useEffect(() => {
    if (!active) {
      setPoints([]);
      pointsRef.current = [];
      const map = (window as any).__map as MLMap | undefined;
      if (map) paintLayers(map, []);
      return;
    }

    const map = (window as any).__map as MLMap | undefined;
    if (!map) return;

    if (!map.getSource(LINE_SOURCE)) {
      map.addSource(LINE_SOURCE, { type: "geojson", data: lineFeatureCollection([]) });
      map.addLayer({
        id: LINE_SOURCE,
        type: "line",
        source: LINE_SOURCE,
        paint: { "line-color": "#1a73e8", "line-width": 3 },
        layout: { "line-cap": "round", "line-join": "round" },
      });
    }
    if (!map.getSource(POINTS_SOURCE)) {
      map.addSource(POINTS_SOURCE, { type: "geojson", data: pointFeatureCollection([]) });
      map.addLayer({
        id: POINTS_SOURCE,
        type: "circle",
        source: POINTS_SOURCE,
        paint: {
          "circle-radius": 5,
          "circle-color": "#fff",
          "circle-stroke-color": "var(--accent)",
          "circle-stroke-width": 2,
        },
      });
    }

    // Seed with a starting point (e.g. right-click "Measure distance") — resets the measurement
    // to start fresh from that point even if a session was already in progress.
    const initial = seedPoint ? [seedPoint] : [];
    pointsRef.current = initial;
    setPoints(initial);
    paintLayers(map, initial);

    map.doubleClickZoom.disable();
    const prevCursor = map.getCanvas().style.cursor;
    map.getCanvas().style.cursor = "crosshair";

    const onClick = (e: MapMouseEvent) => {
      const next = [...pointsRef.current, [e.lngLat.lng, e.lngLat.lat] as LngLat];
      pointsRef.current = next;
      setPoints(next);
      paintLayers(map, next);
    };
    const onDblClick = (e: MapMouseEvent) => {
      e.preventDefault();
    };
    const onContextMenu = (e: MapMouseEvent) => {
      e.preventDefault();
      deactivateRuler();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") deactivateRuler();
    };

    map.on("click", onClick);
    map.on("dblclick", onDblClick);
    map.on("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      map.off("click", onClick);
      map.off("dblclick", onDblClick);
      map.off("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeyDown);
      map.doubleClickZoom.enable();
      map.getCanvas().style.cursor = prevCursor;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, seedKey]);

  const segments: number[] = [];
  for (let i = 1; i < points.length; i++) segments.push(haversineMeters(points[i - 1], points[i]));
  const total = segments.reduce((a, b) => a + b, 0);

  const copyTotal = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(formatDistance(total, units)).catch(() => {});
    }
  };

  if (hideForSheet) return null;
  // On phones the bottom-right corner is a single FAB, not a stack of five — the ruler is
  // driven from the hamburger menu / long-press instead, but its readout card still shows.
  const showFab = !isMobile;

  return (
    <>
      {showFab && (
      <button
        title="Measure distance"
        onClick={() => (active ? deactivateRuler() : activateRuler())}
        style={{
          position: "absolute",
          right: 12,
          bottom: 121,
          width: 40,
          height: 40,
          borderRadius: 8,
          background: active ? "var(--accent)" : "var(--surface)",
          boxShadow: "var(--shadow-1)",
          display: "grid",
          placeItems: "center",
          zIndex: 5,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "var(--on-accent)" : "var(--icon)"}>
          <path d="M21.71 2.29a1 1 0 0 0-1.42 0L2.29 20.29a1 1 0 1 0 1.42 1.42L5 20.41l1.29 1.3a1 1 0 0 0 1.42-1.42L6.41 19l2-2 1.3 1.29a1 1 0 0 0 1.4-1.4L9.83 15.6l2-2 1.29 1.29a1 1 0 0 0 1.42-1.42L13.24 12.17l2-2 1.29 1.29a1 1 0 0 0 1.42-1.42L16.66 8.75l2-2 1.29 1.3a1 1 0 0 0 1.42-1.43L20.07 5.3l1.64-1.63a1 1 0 0 0 0-1.38z" />
        </svg>
      </button>
      )}

      {active && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 240,
            maxWidth: "calc(100vw - 20px)",
            background: "var(--surface)",
            borderRadius: 8,
            boxShadow: "var(--shadow-2)",
            zIndex: 6,
            padding: "12px 14px",
            fontSize: 13,
            color: "var(--text)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <strong style={{ fontSize: 14 }}>Measure distance</strong>
            <button
              title="Close"
              onClick={() => deactivateRuler()}
              style={{ width: 24, height: 24, display: "grid", placeItems: "center", borderRadius: 999 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--icon)">
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {points.length === 0 ? (
            <p style={{ color: "var(--text-2)", marginTop: 8 }}>Click points on the map to measure. Right-click or Esc to finish.</p>
          ) : (
            <>
              <div style={{ marginTop: 10, fontSize: 20, fontWeight: 600 }}>{formatDistance(total, units)}</div>
              {segments.length > 1 && (
                <div style={{ marginTop: 6, color: "var(--text-2)", maxHeight: 96, overflowY: "auto" }}>
                  {segments.map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Leg {i + 1}</span>
                      <span>{formatDistance(s, units)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  onClick={copyTotal}
                  style={{
                    flex: 1,
                    height: 32,
                    borderRadius: 6,
                    background: "var(--surface-2)",
                    color: "var(--text-strong)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Copy total
                </button>
                <button
                  onClick={() => {
                    pointsRef.current = [];
                    setPoints([]);
                    const map = (window as any).__map as MLMap | undefined;
                    if (map) paintLayers(map, []);
                  }}
                  style={{
                    flex: 1,
                    height: 32,
                    borderRadius: 6,
                    background: "var(--surface-2)",
                    color: "var(--text-strong)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Clear
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

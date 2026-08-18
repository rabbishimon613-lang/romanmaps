"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, MapMouseEvent, GeoJSONSource } from "maplibre-gl";
import { useUnits, formatDistance } from "./useUnits";
import { useIsMobile } from "./useIsMobile";
import { usePoiPanel } from "./usePoiPanel";
import {
  useDirectionsState,
  setDirectionsOrigin,
  setDirectionsDestination,
  clearDirections,
} from "./useDirections";
import { loadRouteGraph, nearestNode, shortestPath, type RouteResult } from "./routeGraph";

const LINE_SOURCE = "directions-route";
const POINTS_SOURCE = "directions-points";

// FEATURE_BACKLOG's own MVP assumption for a road-only journey-time estimate: 25 Roman miles/day
// for a legion on the march, 15/day for an ordinary merchant party. 1 Roman mile (mille passus,
// 1000 paces) is conventionally ~1.48 km.
const ROMAN_MILE_KM = 1.48;
const LEGION_KM_PER_DAY = 25 * ROMAN_MILE_KM;
const MERCHANT_KM_PER_DAY = 15 * ROMAN_MILE_KM;
// Cursus publicus (imperial post, horse relay) — A.M. Ramsay, "The Speed of the Roman Imperial
// Post," Journal of Roman Studies 15 (1925): 60-74, clocks ordinary official travel at 41-64
// (modern) miles/day, ~66-103 km/day, over the relay network of mutationes (horse-change posts,
// roughly every 12-15 km) and mansiones (overnight stations, roughly every 25-40 km). 75 km/day
// sits inside that range as a representative rate — not the extreme "urgent courier" case
// Ramsay separately notes could exceed 100 modern miles/day, which this doesn't model. Sea legs
// are still out of scope entirely (see the no-route message below) — no sailing-season-aware
// network exists yet to estimate them honestly.
const COURIER_KM_PER_DAY = 75;

type LngLat = [number, number];

function emptyLine(): GeoJSON.FeatureCollection {
  return { type: "FeatureCollection", features: [] };
}

function pointsFC(points: { point: LngLat; role: "origin" | "destination" }[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: points.map((p) => ({
      type: "Feature",
      properties: { role: p.role },
      geometry: { type: "Point", coordinates: p.point },
    })),
  };
}

function formatLatLng(p: LngLat): string {
  return `${p[1].toFixed(4)}, ${p[0].toFixed(4)}`;
}

function formatDays(km: number, kmPerDay: number): string {
  const days = km / kmPerDay;
  if (days < 1) return "under a day";
  if (days < 2) return "about a day";
  return `about ${Math.round(days)} days`;
}

/** Road-network "Directions" — click A and B (or use the right-click context menu / a place
 * card's Directions button) and see the real Itiner-e road route between them, not a straight
 * line — [07-P1-1] travel-time, FEATURE_BACKLOG's P0 "Directions" item. Road-only for MVP, same
 * scope that item's own note calls for: no sea legs, so a route across a strait or to an island
 * with no bridge in the source data honestly reports no road route rather than faking one. */
export default function Directions() {
  const { active, origin, destination } = useDirectionsState();
  const [units] = useUnits();
  const isMobile = useIsMobile();
  const poiOpen = !!usePoiPanel();
  const hideForSheet = isMobile && poiOpen;

  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "none">("idle");
  const [result, setResult] = useState<RouteResult | null>(null);
  const [approachKm, setApproachKm] = useState<{ origin: number; destination: number } | null>(null);
  const requestId = useRef(0);

  // Map source/layers — set up once, torn down when Directions is closed entirely.
  useEffect(() => {
    const map = (window as any).__map as MLMap | undefined;
    if (!map) return;

    if (!active) {
      (map.getSource(LINE_SOURCE) as GeoJSONSource | undefined)?.setData(emptyLine());
      (map.getSource(POINTS_SOURCE) as GeoJSONSource | undefined)?.setData(emptyLine());
      return;
    }

    if (!map.getSource(LINE_SOURCE)) {
      map.addSource(LINE_SOURCE, { type: "geojson", data: emptyLine() });
      map.addLayer({
        id: `${LINE_SOURCE}-casing`,
        type: "line",
        source: LINE_SOURCE,
        paint: { "line-color": "#1a3f8f", "line-width": 6, "line-opacity": 0.5 },
        layout: { "line-cap": "round", "line-join": "round" },
      });
      map.addLayer({
        id: LINE_SOURCE,
        type: "line",
        source: LINE_SOURCE,
        paint: { "line-color": "#4285f4", "line-width": 3.5 },
        layout: { "line-cap": "round", "line-join": "round" },
      });
    }
    if (!map.getSource(POINTS_SOURCE)) {
      map.addSource(POINTS_SOURCE, { type: "geojson", data: emptyLine() });
      map.addLayer({
        id: POINTS_SOURCE,
        type: "circle",
        source: POINTS_SOURCE,
        paint: {
          "circle-radius": 7,
          "circle-color": ["match", ["get", "role"], "origin", "#34a853", "#ea4335"],
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 2,
        },
      });
    }

    const pts: { point: LngLat; role: "origin" | "destination" }[] = [];
    if (origin) pts.push({ point: origin.point, role: "origin" });
    if (destination) pts.push({ point: destination.point, role: "destination" });
    (map.getSource(POINTS_SOURCE) as GeoJSONSource).setData(pointsFC(pts));
  }, [active, origin, destination]);

  // Click-to-set: whichever endpoint is still missing gets filled by the next map click. Once
  // both are set, a further click replaces the destination (re-querying a new "where to" without
  // losing the origin) — mirrors how the ruler treats clicks as an ongoing session.
  useEffect(() => {
    const map = (window as any).__map as MLMap | undefined;
    if (!map || !active) return;

    const prevCursor = map.getCanvas().style.cursor;
    map.getCanvas().style.cursor = "crosshair";

    const onClick = (e: MapMouseEvent) => {
      const p: LngLat = [e.lngLat.lng, e.lngLat.lat];
      if (!origin) {
        setDirectionsOrigin(p, formatLatLng(p));
      } else if (!destination) {
        setDirectionsDestination(p, formatLatLng(p));
      } else {
        setDirectionsDestination(p, formatLatLng(p));
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearDirections();
    };

    map.on("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      map.off("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
      map.getCanvas().style.cursor = prevCursor;
    };
  }, [active, origin, destination]);

  // Route computation — runs whenever both ends are set. `requestId` guards against a stale
  // async result landing after a newer request started (e.g. destination changed mid-computation).
  useEffect(() => {
    const map = (window as any).__map as MLMap | undefined;
    if (!active || !origin || !destination) {
      setStatus("idle");
      setResult(null);
      setApproachKm(null);
      if (map) (map.getSource(LINE_SOURCE) as GeoJSONSource | undefined)?.setData(emptyLine());
      return;
    }
    const myId = ++requestId.current;
    setStatus("loading");
    loadRouteGraph().then((graph) => {
      if (myId !== requestId.current) return;
      const a = nearestNode(graph, origin.point[0], origin.point[1]);
      const b = nearestNode(graph, destination.point[0], destination.point[1]);
      const route = shortestPath(graph, a.idx, b.idx);
      if (myId !== requestId.current) return;
      setApproachKm({ origin: a.distKm, destination: b.distKm });
      if (!route) {
        setStatus("none");
        setResult(null);
        if (map) (map.getSource(LINE_SOURCE) as GeoJSONSource | undefined)?.setData(emptyLine());
        return;
      }
      setStatus("ok");
      setResult(route);
      if (map) {
        (map.getSource(LINE_SOURCE) as GeoJSONSource | undefined)?.setData({
          type: "FeatureCollection",
          features: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route.coords } }],
        });
      }
    });
  }, [active, origin?.point?.[0], origin?.point?.[1], destination?.point?.[0], destination?.point?.[1]]);

  if (!active || hideForSheet) return null;

  const totalKm = result ? result.distKm + (approachKm ? approachKm.origin + approachKm.destination : 0) : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        width: 260,
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
        <strong style={{ fontSize: 14 }}>Directions</strong>
        <button
          title="Close"
          onClick={() => clearDirections()}
          style={{ width: 24, height: 24, display: "grid", placeItems: "center", borderRadius: 999 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--icon)">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "#34a853", flexShrink: 0 }} />
          <span style={{ color: origin ? "var(--text)" : "var(--text-3)" }}>{origin ? origin.label : "Click the map to set a start"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "#ea4335", flexShrink: 0 }} />
          <span style={{ color: destination ? "var(--text)" : "var(--text-3)" }}>
            {destination ? destination.label : origin ? "Click the map to set a destination" : "Then click a destination"}
          </span>
        </div>
      </div>

      {status === "loading" && <p style={{ color: "var(--text-2)", marginTop: 10 }}>Finding the road route…</p>}

      {status === "none" && (
        <p style={{ color: "var(--text-2)", marginTop: 10 }}>
          No road route found — the two points aren't connected in the 117 CE road network (this is road-only routing; a sea
          crossing isn't modeled yet).
        </p>
      )}

      {status === "ok" && result && (
        <>
          <div style={{ marginTop: 10, fontSize: 20, fontWeight: 600 }}>{formatDistance(totalKm * 1000, units)}</div>
          <div style={{ marginTop: 2, fontSize: 11.5, color: "var(--text-2)" }}>by the Roman road network</div>
          {approachKm && (approachKm.origin > 0.3 || approachKm.destination > 0.3) && (
            <div style={{ marginTop: 6, fontSize: 11.5, color: "var(--text-3)" }}>
              Includes {formatDistance((approachKm.origin + approachKm.destination) * 1000, units)} off-road to reach the
              nearest mapped road.
            </div>
          )}
          <div style={{ marginTop: 10, borderTop: "1px solid var(--divider)", paddingTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-2)" }}>
              <span>Legion on the march</span>
              <span>{formatDays(totalKm, LEGION_KM_PER_DAY)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-2)", marginTop: 4 }}>
              <span>Merchant on foot</span>
              <span>{formatDays(totalKm, MERCHANT_KM_PER_DAY)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-2)", marginTop: 4 }}>
              <span>Imperial courier (horse relay)</span>
              <span>{formatDays(totalKm, COURIER_KM_PER_DAY)}</span>
            </div>
          </div>
          <p style={{ marginTop: 6, fontSize: 10.5, color: "var(--text-3)" }}>
            Courier estimate assumes the cursus publicus, the state post's relay of mutationes and fresh horses —
            not available to ordinary travelers. Sea legs aren't modeled.
          </p>
          <button
            onClick={() => clearDirections()}
            style={{
              width: "100%",
              height: 32,
              borderRadius: 6,
              background: "var(--surface-2)",
              color: "var(--text-strong)",
              fontSize: 12,
              fontWeight: 500,
              marginTop: 10,
            }}
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
}

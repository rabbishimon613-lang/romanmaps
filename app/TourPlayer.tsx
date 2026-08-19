"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { TOURS, type Tour, type TourStop } from "./tours";
import { closeTourPanel, backToTourList, goToStop, minimizeTourPanel, selectTour, useTourPanel } from "./useTour";
import { selectPoi } from "./usePoiPanel";
import { useIsMobile } from "./useIsMobile";
import { motionDuration } from "./reducedMotion";

type LngLat = [number, number];
type ResolvedStop = { name: string; body: string; sources: string[]; coords: LngLat; poiProps?: Record<string, any> };

const LINE_SOURCE = "tour-line";
const STOPS_SOURCE = "tour-stops";

const ZOOM_BY_KIND: Record<TourStop["kind"], number> = { poi: 16, station: 14, event: 12.5, person: 11 };

function stopFC(coords: LngLat[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: coords.map((c, i) => ({ type: "Feature", properties: { idx: i }, geometry: { type: "Point", coordinates: c } })),
  };
}
function lineFC(coords: LngLat[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: coords.length >= 2 ? [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } }] : [],
  };
}

/** Guided-tour panel — browse the three starter tours, then walk one stop at a time. Each stop
 * flies the camera and, for a "poi" stop, opens the real Place details panel (the same one a map
 * click would); "station"/"event"/"person" stops have no card of their own, so their sourced text
 * renders right here instead. Draws a dashed route line + numbered stop markers on the map while
 * a tour is active, cleaned up on close — same imperative-source pattern as app/Ruler.tsx. */
export default function TourPlayer() {
  const { open, activeTourSlug, stopIndex } = useTourPanel();
  const isMobile = useIsMobile();
  const [poisById, setPoisById] = useState<Record<string, any> | null>(null);
  const [stationsById, setStationsById] = useState<Record<string, any> | null>(null);
  const [eventsById, setEventsById] = useState<Record<string, any> | null>(null);
  const [peopleById, setPeopleById] = useState<Record<string, any> | null>(null);
  const dataReady = !!(poisById && stationsById && eventsById && peopleById);

  useEffect(() => {
    if (!open || dataReady) return;
    let cancelled = false;
    const indexOf = (fc: GeoJSON.FeatureCollection<GeoJSON.Point, Record<string, any>>) => {
      const idx: Record<string, any> = {};
      for (const f of fc.features || []) {
        const id = f.properties?.id;
        if (id && f.geometry?.type === "Point") idx[id] = { props: f.properties, coords: f.geometry.coordinates as LngLat };
      }
      return idx;
    };
    Promise.all([
      fetch("/data/pois.geojson").then((r) => r.json()),
      fetch("/data/road_stations.geojson").then((r) => r.json()),
      fetch("/data/events_117.geojson").then((r) => r.json()),
      fetch("/data/people_117.geojson").then((r) => r.json()),
    ])
      .then(([pois, stations, events, people]) => {
        if (cancelled) return;
        setPoisById(indexOf(pois));
        setStationsById(indexOf(stations));
        setEventsById(indexOf(events));
        setPeopleById(indexOf(people));
      })
      .catch(() => {
        if (!cancelled) {
          setPoisById({});
          setStationsById({});
          setEventsById({});
          setPeopleById({});
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, dataReady]);

  const indexFor = (kind: TourStop["kind"]) =>
    kind === "poi" ? poisById : kind === "station" ? stationsById : kind === "event" ? eventsById : peopleById;

  const activeTour: Tour | undefined = TOURS.find((t) => t.slug === activeTourSlug);

  const resolvedStops: (ResolvedStop | null)[] = useMemo(() => {
    if (!activeTour || !dataReady) return [];
    return activeTour.stops.map((s) => {
      const idx = indexFor(s.kind);
      const entry = idx?.[s.id];
      if (!entry) return null;
      const p = entry.props;
      if (s.kind === "poi") {
        return { name: p.name_english || p.name_latin || s.id, body: p.notes || "", sources: p.sources || [], coords: entry.coords, poiProps: p };
      }
      if (s.kind === "station") {
        const distance = p.distance_from_previous_mp ? `${p.distance_from_previous_mp} Roman miles from the previous stop` : "";
        return { name: `${p.name} (${p.category})`, body: [p.notes, distance].filter(Boolean).join(" — "), sources: p.sources || [], coords: entry.coords };
      }
      // event | person
      return { name: p.name, body: p.one_line || "", sources: p.sources || [], coords: entry.coords };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTour, dataReady, poisById, stationsById, eventsById, peopleById]);

  const stopCoords: LngLat[] = useMemo(() => resolvedStops.filter(Boolean).map((s) => (s as ResolvedStop).coords), [resolvedStops]);

  // Draw / clean up the route line + numbered stop markers as the active tour changes.
  useEffect(() => {
    const map = (window as any).__map as MLMap | undefined;
    if (!map) return;
    if (!activeTour || stopCoords.length === 0) {
      if (map.getLayer(LINE_SOURCE)) map.removeLayer(LINE_SOURCE);
      if (map.getSource(LINE_SOURCE)) map.removeSource(LINE_SOURCE);
      if (map.getLayer(STOPS_SOURCE)) map.removeLayer(STOPS_SOURCE);
      if (map.getSource(STOPS_SOURCE)) map.removeSource(STOPS_SOURCE);
      return;
    }
    if (!map.getSource(LINE_SOURCE)) {
      map.addSource(LINE_SOURCE, { type: "geojson", data: lineFC(stopCoords) });
      map.addLayer({
        id: LINE_SOURCE,
        type: "line",
        source: LINE_SOURCE,
        paint: { "line-color": "#8859a6", "line-width": 2.5, "line-dasharray": [0.2, 1.6] },
        layout: { "line-cap": "round", "line-join": "round" },
      });
    } else {
      (map.getSource(LINE_SOURCE) as GeoJSONSource).setData(lineFC(stopCoords));
    }
    if (!map.getSource(STOPS_SOURCE)) {
      map.addSource(STOPS_SOURCE, { type: "geojson", data: stopFC(stopCoords) });
      map.addLayer({
        id: STOPS_SOURCE,
        type: "circle",
        source: STOPS_SOURCE,
        paint: {
          "circle-radius": 6,
          "circle-color": ["case", ["==", ["get", "idx"], stopIndex], "#ea4335", "#8859a6"],
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 2,
        },
      });
    } else {
      (map.getSource(STOPS_SOURCE) as GeoJSONSource).setData(stopFC(stopCoords));
      map.setPaintProperty(STOPS_SOURCE, "circle-color", ["case", ["==", ["get", "idx"], stopIndex], "#ea4335", "#8859a6"]);
    }
    return () => {
      // Only tear down on unmount / tour change, not on every stopIndex tick — the outer branch
      // above handles the "no active tour" teardown case.
    };
  }, [activeTour, stopCoords, stopIndex]);

  useEffect(() => {
    return () => {
      const map = (window as any).__map as MLMap | undefined;
      if (!map) return;
      if (map.getLayer(LINE_SOURCE)) map.removeLayer(LINE_SOURCE);
      if (map.getSource(LINE_SOURCE)) map.removeSource(LINE_SOURCE);
      if (map.getLayer(STOPS_SOURCE)) map.removeLayer(STOPS_SOURCE);
      if (map.getSource(STOPS_SOURCE)) map.removeSource(STOPS_SOURCE);
    };
  }, []);

  // Flies the camera only — does not open the full Place details panel, which shares the tour
  // panel's own screen real estate. Opening it is an explicit choice via the button below, and
  // minimizes this panel so the card underneath actually becomes visible.
  const jumpToStop = (i: number) => {
    goToStop(i);
    const resolved = resolvedStops[i];
    const stopDef = activeTour?.stops[i];
    if (!resolved || !stopDef) return;
    const map = (window as any).__map as MLMap | undefined;
    if (map) map.flyTo({ center: resolved.coords, zoom: ZOOM_BY_KIND[stopDef.kind], duration: motionDuration(1200) });
  };

  const openFullDetails = () => {
    if (!current?.poiProps) return;
    selectPoi(current.poiProps, current.coords);
    minimizeTourPanel();
  };

  // Whenever a fresh tour is selected (or its data finishes loading), fly to and open its first stop.
  const startedTourRef = useRef<string | null>(null);
  useEffect(() => {
    if (!activeTour || !dataReady) return;
    if (startedTourRef.current === activeTour.slug) return;
    startedTourRef.current = activeTour.slug;
    jumpToStop(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTour, dataReady]);
  useEffect(() => {
    if (!activeTour) startedTourRef.current = null;
  }, [activeTour]);

  if (!open) return null;

  const current = activeTour ? resolvedStops[stopIndex] : null;
  const currentDef = activeTour ? activeTour.stops[stopIndex] : null;

  // Mobile has no left rail, so this can't be a slide-in side panel the way SitesPanel/
  // LegionLocator are. It becomes a compact card parked below the search pill instead — short
  // enough to coexist with PlaceDetails' own bottom sheet when a "poi" stop's card opens on top.
  const containerStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: "calc(66px + env(safe-area-inset-top))",
        left: 8,
        right: 8,
        maxHeight: "calc(100vh - 150px - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
        background: "var(--surface)",
        borderRadius: 12,
        boxShadow: "var(--shadow-2)",
        zIndex: 8,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }
    : {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 60,
        width: 360,
        maxWidth: "calc(100vw - 60px)",
        background: "var(--surface)",
        boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.2)",
        zIndex: 9,
        display: "flex",
        flexDirection: "column",
      };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", alignItems: "center", padding: "12px 12px 8px", gap: 8 }}>
        <button
          onClick={activeTour ? backToTourList : closeTourPanel}
          title={activeTour ? "Back to tours" : "Close"}
          style={{ width: 36, height: 36, borderRadius: 999, display: "grid", placeItems: "center" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--icon)">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div style={{ flex: 1, fontSize: 18, fontWeight: 500, color: "var(--text)" }}>
          {activeTour ? activeTour.title : "Guided tours"}
        </div>
        {activeTour && (
          <button onClick={closeTourPanel} title="Close" style={{ width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--icon)">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>

      {!activeTour && (
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 12px 12px" }}>
          {TOURS.map((t) => (
            <button
              key={t.slug}
              onClick={() => selectTour(t.slug)}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 12px",
                borderRadius: 10,
                background: "var(--surface-2)",
                textAlign: "left",
                marginBottom: 10,
              }}
            >
              <div className="roman-label" style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{t.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 2 }}>{t.subtitle}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-strong)", marginTop: 6, lineHeight: 1.4 }}>{t.description}</div>
              <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {t.distanceNote}
              </div>
            </button>
          ))}
        </div>
      )}

      {activeTour && (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0 16px 10px", fontSize: 11, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: 0.6 }}>
            Stop {stopIndex + 1} of {activeTour.stops.length}
          </div>
          {!dataReady ? (
            <div style={{ padding: "0 16px", fontSize: 13, color: "var(--text-2)" }}>Loading…</div>
          ) : current && currentDef ? (
            <div style={{ padding: "0 16px 16px", flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{current.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-strong)", marginTop: 8, lineHeight: 1.5 }}>{currentDef.caption}</div>
              {current.body && (
                <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 10, lineHeight: 1.5, paddingTop: 10, borderTop: "1px solid var(--divider)" }}>
                  {current.body}
                </div>
              )}
              {currentDef.kind === "poi" && (
                <button
                  onClick={openFullDetails}
                  style={{ marginTop: 10, fontSize: 12.5, fontWeight: 600, color: "var(--accent)" }}
                >
                  Open full details →
                </button>
              )}
              {current.sources.length > 0 && (
                <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 10 }}>
                  Sources: {current.sources.join(" · ")}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: "0 16px", fontSize: 13, color: "var(--text-2)" }}>This stop couldn&rsquo;t be found.</div>
          )}

          <div style={{ display: "flex", gap: 8, padding: "10px 16px 16px", borderTop: "1px solid var(--divider)" }}>
            <button
              onClick={() => jumpToStop(Math.max(0, stopIndex - 1))}
              disabled={stopIndex === 0}
              style={{
                flex: 1,
                height: 38,
                borderRadius: 8,
                background: "var(--surface-2)",
                color: stopIndex === 0 ? "var(--text-2)" : "var(--text-strong)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ← Previous
            </button>
            <button
              onClick={() => jumpToStop(Math.min(activeTour.stops.length - 1, stopIndex + 1))}
              disabled={stopIndex === activeTour.stops.length - 1}
              style={{
                flex: 1,
                height: 38,
                borderRadius: 8,
                background: stopIndex === activeTour.stops.length - 1 ? "var(--surface-2)" : "var(--accent-bg)",
                color: stopIndex === activeTour.stops.length - 1 ? "var(--text-2)" : "var(--accent)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

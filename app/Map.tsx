"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { applyAllLayers } from "./useLayers";
import { selectPoi, clearPoi, getSelectedPoi, subscribeSelectedPoi } from "./usePoiPanel";
import { categoryColorMatchPairs, DEFAULT_COLOR } from "./poiCategories";
import { ostiaEntry } from "./ostiaDescriptions";
import { SITE_META } from "./sites";

// Palette — light + dark variants. Both palettes are calibrated so that the sea/land/roads/labels
// stay legible at every zoom and so ancient-sea and modern-sea read as the same water tone.
type Palette = {
  sea: string;
  land: string;
  provinceFill: string;
  provinceLine: string;
  river: string;
  lake: string;
  roadMain: string;
  roadSecondary: string;
  placeLabelMajor: string;
  placeLabelMinor: string;
  labelHalo: string;
};
const LIGHT: Palette = {
  sea: "#a9d1e3",
  land: "#f4ead5",
  provinceFill: "#ecdfbf",
  provinceLine: "#a58a5a",
  river: "#7fb0c9",
  lake: "#b8dbe6",
  roadMain: "#a12b0d",
  roadSecondary: "#c17a4d",
  placeLabelMajor: "#2a1e10",
  placeLabelMinor: "#5c4326",
  labelHalo: "#f4ead5",
};
const DARK: Palette = {
  sea: "#0f2233",
  land: "#232628",
  provinceFill: "#2c2f31",
  provinceLine: "#6a5b3a",
  river: "#3d6885",
  lake: "#1f3c4d",
  roadMain: "#c9573b",
  roadSecondary: "#8a5636",
  placeLabelMajor: "#e6dcc4",
  placeLabelMinor: "#a89b7f",
  labelHalo: "#111315",
};

function prefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function Map() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let cancelled = false;
    let map: maplibregl.Map | null = null;
    let ro: ResizeObserver | null = null;
    let onWinResize: (() => void) | null = null;
    let onPopState: (() => void) | null = null;
    let pushTimer: ReturnType<typeof setTimeout> | null = null;
    let unsubPoi: (() => void) | null = null;
    // Populated once pois.geojson loads (Phase 4 below) so a shared #lng,lat,zoomz:poiId link —
    // or a back/forward step onto one — can look the place back up and reopen its panel.
    // (Plain object, not a `Map` instance — this component is itself named `Map`, which shadows
    // the built-in class inside this function body.)
    let poiIndex: Record<string, { props: Record<string, any>; coords: [number, number] }> | null = null;
    const P: Palette = prefersDark() ? DARK : LIGHT;

    (async () => {
      // Phase 1: light sources first — small enough to render fast.
      const [land, provinces, lakes, rivers, ancientSea] = await Promise.all([
        fetch("/data/land.geojson").then((r) => r.json()),
        fetch("/data/provinces.geojson").then((r) => r.json()),
        fetch("/data/10m_lakes.geojson").then((r) => r.json()),
        fetch("/data/10m_rivers_lake_centerlines.geojson").then((r) => r.json()),
        fetch("/data/ancient_sea.geojson").then((r) => r.json()),
      ]);
      if (cancelled || !ref.current) return;

      // Coordinates URL sync — restore #lng,lat,zoomz from a shared/bookmarked link if present.
      const initialView = parseHash(window.location.hash);

      // Sea mask — one big world-bbox polygon with every land ring cut out as a hole. Painted
      // above rivers/provinces so any linework that leaks past the coast (Natural Earth 10m
      // rivers over-extending into estuaries; province polygons buffered into the sea) is
      // occluded by water. Cheap: one polygon, ~O(N) coords, tessellated once by MapLibre.
      const seaMask = buildSeaMask(land);

      map = new maplibregl.Map({
        container: ref.current,
        style: {
          version: 8,
          glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
          sources: {
            land: { type: "geojson", maxzoom: 14, buffer: 128, tolerance: 0.375, data: land },
            provinces: { type: "geojson", maxzoom: 14, buffer: 128, tolerance: 0.375, data: provinces },
            lakes: { type: "geojson", maxzoom: 14, buffer: 128, tolerance: 0.375, data: lakes },
            rivers: { type: "geojson", maxzoom: 14, buffer: 128, tolerance: 0.375, data: rivers },
            "ancient-sea": { type: "geojson", maxzoom: 18, buffer: 128, tolerance: 0.1, data: ancientSea },
            "sea-mask": { type: "geojson", maxzoom: 14, buffer: 128, tolerance: 0.5, data: seaMask },
          },
          layers: [
            { id: "bg", type: "background", paint: { "background-color": P.sea } },
            {
              id: "land",
              type: "fill",
              source: "land",
              paint: { "fill-color": P.land },
            },
            {
              id: "provinces-fill",
              type: "fill",
              source: "provinces",
              paint: { "fill-color": P.provinceFill, "fill-opacity": 0.18 },
            },
            {
              id: "provinces-line",
              type: "line",
              source: "provinces",
              paint: {
                "line-color": P.provinceLine,
                "line-width": 0.6,
                "line-dasharray": [2, 2],
                "line-opacity": 0.6,
              },
            },
            {
              id: "rivers",
              type: "line",
              source: "rivers",
              paint: {
                "line-color": P.river,
                "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.3, 8, 1.4],
              },
            },
            {
              id: "sea-mask",
              type: "fill",
              source: "sea-mask",
              paint: { "fill-color": P.sea },
            },
            {
              id: "ancient-sea",
              type: "fill",
              source: "ancient-sea",
              paint: { "fill-color": P.sea },
            },
            { id: "lakes", type: "fill", source: "lakes", paint: { "fill-color": P.lake } },
          ],
        },
        center: initialView ? [initialView.lng, initialView.lat] : [12.4964, 41.9028],
        zoom: initialView ? initialView.zoom : 4.2,
        minZoom: 2.5,
        maxZoom: 19,
        attributionControl: false,
      });

      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution:
            'Data © <a href="https://itiner-e.org" target="_blank">Itiner-e</a> · <a href="https://dh.gu.se/dare/" target="_blank">DARE</a> · <a href="https://pelagios.org" target="_blank">Pelagios</a> · <a href="https://www.naturalearthdata.com/" target="_blank">Natural Earth</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        }),
      );
      // No default NavigationControl — its bottom-right slot is CSS-hidden (custom attribution
      // lives there instead), and app/ZoomControl.tsx renders our own Google-style +/- buttons.
      (window as any).__map = map;

      const kick = () => map && map.resize();
      setTimeout(kick, 100);
      // Real animated flyTo — forces rAF frames the whole way, which paints. Skipped when the
      // page loaded with a coordinates hash (shared link / back-forward) — land directly there
      // instead of flying past it into the default Rome view.
      const openingFly = () => {
        if (!map || initialView) return;
        map.jumpTo({ center: [15, 43], zoom: 3.8 });
        setTimeout(() => {
          if (!map) return;
          map.flyTo({ center: [12.4964, 41.9028], zoom: 4.2, duration: 1200 });
        }, 50);
      };
      map.once("load", openingFly);
      ro = new ResizeObserver(kick);
      ro.observe(ref.current);
      onWinResize = kick;
      window.addEventListener("resize", onWinResize);

      // Coordinates + selected-place URL sync — keep #lng,lat,zoomz[:poiId] in the hash as the
      // user pans/zooms/flies anywhere (search, site jump, context menu) or opens/closes a place
      // panel, and make back/forward retrace those stops. The very first write replaces the
      // current history entry rather than pushing a new one, so loading the app doesn't itself
      // consume a "back" step. This is what makes the Place details panel's "Copy link" button
      // (app/PlaceDetails.tsx) share a URL that reopens the same place, not just the same view.
      let firstHashWrite = true;
      let suppressNextPush = !!initialView;
      const writeHash = () => {
        if (!map) return;
        const c = map.getCenter();
        const sel = getSelectedPoi();
        const poiId = sel && typeof sel.props?.id === "string" ? sel.props.id : undefined;
        const hash = formatHash(c.lng, c.lat, map.getZoom(), poiId);
        if (window.location.hash === hash) return;
        if (firstHashWrite) {
          firstHashWrite = false;
          history.replaceState(null, "", hash);
        } else {
          history.pushState(null, "", hash);
        }
      };
      map.on("moveend", () => {
        if (suppressNextPush) {
          suppressNextPush = false;
          return;
        }
        if (pushTimer) clearTimeout(pushTimer);
        pushTimer = setTimeout(writeHash, 400);
      });
      // Selecting/clearing a place is a discrete user action (click a pin, click a building, hit
      // Esc) — write immediately rather than debouncing like the continuous pan/zoom stream above.
      unsubPoi = subscribeSelectedPoi(() => writeHash());
      onPopState = () => {
        if (!map) return;
        const view = parseHash(window.location.hash);
        if (!view) return;
        suppressNextPush = true;
        map.flyTo({ center: [view.lng, view.lat], zoom: view.zoom, duration: 600 });
        if (view.poiId && poiIndex && poiIndex[view.poiId]) {
          selectPoi(poiIndex[view.poiId].props, poiIndex[view.poiId].coords);
        } else {
          clearPoi();
        }
      };
      window.addEventListener("popstate", onPopState);

      // Phase 2: roads — Itiner-e dataset, split into Main (viae) and Secondary.
      // Google-Maps-like hierarchy: Main = highway (thicker, brighter), Secondary = local street.
      map.on("load", async () => {
        const [mainRoads, secondaryRoads] = await Promise.all([
          fetch("/data/roads_main.geojson").then((r) => r.json()),
          fetch("/data/roads_secondary.geojson").then((r) => r.json()),
        ]);
        if (cancelled || !map) return;

        map.addSource("roads-secondary", {
          type: "geojson", maxzoom: 14, buffer: 128, tolerance: 0.375, data: secondaryRoads,
        });
        map.addLayer({
          id: "roads-secondary",
          type: "line",
          source: "roads-secondary",
          minzoom: 5.5,
          paint: {
            "line-color": P.roadSecondary,
            "line-width": ["interpolate", ["linear"], ["zoom"], 5.5, 0.3, 7, 1.0, 10, 2.2],
            "line-opacity": ["interpolate", ["linear"], ["zoom"], 5.5, 0.35, 7, 0.7, 10, 0.8],
          },
          layout: { "line-cap": "round", "line-join": "round" },
        });

        map.addSource("roads-main", {
          type: "geojson", maxzoom: 14, buffer: 128, tolerance: 0.375, data: mainRoads,
        });
        map.addLayer({
          id: "roads-main",
          type: "line",
          source: "roads-main",
          minzoom: 3.5,
          paint: {
            "line-color": P.roadMain,
            "line-width": ["interpolate", ["linear"], ["zoom"], 3.5, 0.25, 5, 1.1, 7, 2.4, 10, 3.6],
            "line-opacity": ["interpolate", ["linear"], ["zoom"], 3.5, 0.35, 5, 0.7, 7, 0.9, 10, 0.95],
          },
          layout: { "line-cap": "round", "line-join": "round" },
        });
        kick();

        // Phase 3: places (last, biggest).
        const places = await fetch("/data/places_medium.geojson").then((r) => r.json());
        if (cancelled || !map) return;
        map.addSource("places", { type: "geojson", maxzoom: 14, buffer: 128, tolerance: 0.375, data: places });
        // No place dots at all — labels only, Google-Maps style.
        map.addLayer({
          id: "places-dot",
          type: "circle",
          source: "places",
          filter: ["==", ["get", "ancient"], -1],
          paint: { "circle-opacity": 0 },
        });
        map.addLayer({
          id: "places-label-major",
          type: "symbol",
          source: "places",
          filter: ["all", ["==", ["get", "ancient"], 1], ["==", ["get", "major"], 1]],
          minzoom: 3.5,
          layout: {
            "text-field": ["coalesce", ["get", "latin"], ["get", "modern"]],
            "text-font": ["Noto Sans Regular"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 3.5, 11, 8, 15],
            "text-offset": [0, 1],
            "text-anchor": "top",
            "text-optional": true,
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": P.placeLabelMajor,
            "text-halo-color": P.labelHalo,
            "text-halo-width": 1.6,
          },
        });
        map.addLayer({
          id: "places-label-minor",
          type: "symbol",
          source: "places",
          filter: ["all", ["==", ["get", "ancient"], 1], ["!=", ["get", "major"], 1]],
          minzoom: 6.5,
          maxzoom: 11,
          layout: {
            "text-field": ["coalesce", ["get", "latin"], ["get", "modern"]],
            "text-font": ["Noto Sans Regular"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 6.5, 10, 9, 12],
            "text-offset": [0, 0.4],
            "text-anchor": "center",
            "text-optional": true,
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": P.placeLabelMinor,
            "text-halo-color": P.labelHalo,
            "text-halo-width": 1.4,
          },
        });
        kick();

        const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10 });
        map.on("mouseenter", "places-dot", (e) => {
          if (!map) return;
          map.getCanvas().style.cursor = "pointer";
          const f = e.features?.[0];
          if (!f) return;
          const props: any = f.properties || {};
          const latin = props.latin || "";
          const modern = props.modern || "";
          const name = latin || modern || "Unknown";
          const subtitle = latin && modern && latin !== modern ? `Today: ${modern}` : "";
          // @ts-ignore
          const coords = (f.geometry.type === "Point" && f.geometry.coordinates) || null;
          if (!coords) return;
          popup
            .setLngLat(coords as [number, number])
            .setHTML(
              `<div style="font: 13px Roboto, sans-serif; color: #202124;">
                 <div style="font-weight: 600;">${name}</div>
                 ${subtitle ? `<div style="color:#5f6368; font-size:11px; margin-top:2px;">${subtitle}</div>` : ""}
               </div>`,
            )
            .addTo(map);
        });
        map.on("mouseleave", "places-dot", () => {
          if (!map) return;
          map.getCanvas().style.cursor = "";
          popup.remove();
        });

        // Phase 4: curated POIs (temples, baths, monuments...) — richer than the raw gazetteer dots.
        const pois = await fetch("/data/pois.geojson").then((r) => r.json());
        if (cancelled || !map) return;

        // Index by id for the shareable-URL restore below (initial load here; back/forward via
        // the popstate handler wired earlier, which reads this same index once populated).
        poiIndex = {};
        for (const f of pois.features || []) {
          const id = f?.properties?.id;
          if (typeof id === "string" && f.geometry?.type === "Point") {
            poiIndex[id] = { props: f.properties, coords: f.geometry.coordinates as [number, number] };
          }
        }
        if (initialView?.poiId && poiIndex[initialView.poiId]) {
          selectPoi(poiIndex[initialView.poiId].props, poiIndex[initialView.poiId].coords);
        }

        map.addSource("pois", { type: "geojson", data: pois });
        map.addLayer({
          id: "pois-dot",
          type: "circle",
          source: "pois",
          filter: ["==", ["get", "extant_117ce"], true],
          paint: {
            // Slightly larger + a thicker halo than the base gazetteer's places-dot layer, so POI
            // markers stay legible where they sit on top of dense roads-main convergences (e.g.
            // Forum Romanum at Rome's road hub) — flagged as a visibility bug by Shift 4.
            "circle-radius": 0,
            "circle-opacity": 0,
            "circle-color": ["match", ["get", "category"], ...categoryColorMatchPairs(), DEFAULT_COLOR] as any,
            "circle-stroke-color": "#f4ead5",
            "circle-stroke-width": 2.2,
          },
        });
        map.addLayer({
          id: "pois-label",
          type: "symbol",
          source: "pois",
          // Labels rendered by app/PoiMarkers.tsx HTML markers; disable this layer.
          filter: ["==", ["get", "extant_117ce"], "__disabled__"],
          minzoom: 24,
          layout: { "text-field": "" },
        });

        // Click a POI -> open the slide-in Place details panel (app/PlaceDetails.tsx),
        // driven by the shared usePoiPanel store rather than a Maplibre popup.
        map.on("mouseenter", "pois-dot", () => {
          if (!map) return;
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "pois-dot", () => {
          if (!map) return;
          map.getCanvas().style.cursor = "";
        });
        map.on("click", "pois-dot", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          const props: any = f.properties || {};
          // @ts-ignore
          const coords = (f.geometry.type === "Point" && f.geometry.coordinates) || null;
          if (!coords) return;
          selectPoi(props, coords as [number, number]);
        });
        // Clicking empty map space (no POI under the cursor) closes the panel, Google-Maps-style.
        map.on("click", (e) => {
          if (!map) return;
          const hits = map.queryRenderedFeatures(e.point, { layers: ["pois-dot"] });
          if (hits.length === 0) clearPoi();
        });
        kick();

        // Phase 5: Ostia Antica street-level detail (1,266 building outlines + 251 park paths).
        // Only visible at zoom 13+ so it doesn't pollute regional views.
        const [ostiaBuildings, ostiaStreets] = await Promise.all([
          fetch("/data/sites_buildings.geojson").then((r) => r.json()),
          fetch("/data/sites_streets.geojson").then((r) => r.json()),
        ]);
        if (cancelled || !map) return;

        map.addSource("ostia-buildings", {
          type: "geojson",
          maxzoom: 18,
          buffer: 128,
          tolerance: 0.25,
          data: ostiaBuildings,
        });
        map.addSource("ostia-streets", {
          type: "geojson",
          maxzoom: 18,
          buffer: 128,
          tolerance: 0.25,
          data: ostiaStreets,
        });

        // Street/path outlines inside the park
        map.addLayer({
          id: "ostia-streets",
          type: "line",
          source: "ostia-streets",
          minzoom: 12,
          paint: {
            "line-color": "#8a6a3a",
            "line-width": ["interpolate", ["linear"], ["zoom"], 13, 0.4, 17, 2],
            "line-opacity": 0.6,
          },
        });
        // Street name labels — italic like Google Maps' street names
        map.addLayer({
          id: "ostia-street-labels",
          type: "symbol",
          source: "ostia-streets",
          minzoom: 15,
          filter: ["all", ["has", "name"], ["!=", ["get", "name"], ""]],
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Noto Sans Regular"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 15, 10, 18, 13],
            "symbol-placement": "line",
            "text-max-angle": 25,
            "text-letter-spacing": 0.02,
            "text-optional": true,
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#5f6368",
            "text-halo-color": "#f4ead5",
            "text-halo-width": 1.6,
          },
        });

        // Building fills — color-coded per category, Google-Maps-of-antiquity style.
        map.addLayer({
          id: "ostia-buildings-fill",
          type: "fill",
          source: "ostia-buildings",
          minzoom: 12,
          paint: {
            "fill-color": [
              "match",
              ["get", "category"],
              "bath", "#5aa3c8",
              "temple", "#c94b4b",
              "theater", "#7a4bc9",
              "basilica", "#c9a24b",
              "basilica_christian", "#a866d9",
              "warehouse", "#8c6b3a",
              "domus", "#d99a55",
              "insula", "#e0b070",
              "mithraeum", "#5f4a8c",
              "fullery", "#4a9d6b",
              "barracks", "#7a1f1f",
              "taberna", "#c96b3a",
              "tomb", "#5a5a5a",
              "forum", "#c98d3a",
              "plaza", "#e5c88c",
              "medieval", "#9a9a9a",
              "archaeological", "#c9b394",
              "#b8a180",
            ],
            "fill-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0.4, 16, 0.85],
          },
        });
        map.addLayer({
          id: "ostia-buildings-line",
          type: "line",
          source: "ostia-buildings",
          minzoom: 12,
          paint: {
            "line-color": "#3b2a17",
            "line-width": ["interpolate", ["linear"], ["zoom"], 13, 0.2, 17, 0.8],
            "line-opacity": 0.75,
          },
        });

        // Building labels at high zoom
        map.addLayer({
          id: "ostia-buildings-label",
          type: "symbol",
          source: "ostia-buildings",
          minzoom: 15.5,
          filter: ["all", ["has", "name"], ["!=", ["get", "category"], "archaeological"]],
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Noto Sans Regular"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 15.5, 9, 18, 13],
            "text-max-width": 12,
            "text-optional": true,
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#2a1e10",
            "text-halo-color": "#f4ead5",
            "text-halo-width": 1.4,
          },
        });

        // Click a building → open the PoI panel with its info (enriched from curated lookup).
        map.on("click", "ostia-buildings-fill", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          const p: any = f.properties || {};
          const rawName = p.name || "";
          const site: string = p.site || "ostia";
          const siteMeta = SITE_META[site] || { display: site, province: "" };
          // Strip Regio.Insula parenthetical for a cleaner display name
          const displayName = rawName.replace(/\s*\([^)]*\)\s*$/, "").trim() || rawName || `Building ${p.osm_id}`;
          const entry = site === "ostia" ? ostiaEntry(rawName) : undefined;
          selectPoi(
            {
              id: `${site}-${p.osm_id}`,
              name_latin: displayName,
              name_english: entry?.english,
              category: entry?.category || p.category || "archaeological",
              notes:
                entry?.description ||
                (rawName
                  ? `Excavated ${p.category === "archaeological" ? "structure" : p.category} at ${siteMeta.display}. Detailed archaeology in progress.`
                  : `Unidentified structure in the ${siteMeta.display} archaeological zone.`),
              built: entry?.built,
              destroyed: entry?.destroyed,
              extant_117ce: entry?.extant_117ce ?? (p.category !== "medieval"),
              province: siteMeta.province,
              modern_location: siteMeta.display,
              sources: ["OpenStreetMap contributors"],
            } as any,
            [e.lngLat.lng, e.lngLat.lat],
          );
        });
        map.on("mouseenter", "ostia-buildings-fill", () => {
          if (map) map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "ostia-buildings-fill", () => {
          if (map) map.getCanvas().style.cursor = "";
        });

        kick();

        // Phase 6: Road stations (mansiones/mutationes/stationes) — small square markers, dim
        // gray, deliberately not shaped like the round POI pins so the road network's own rhythm
        // reads distinctly from city/landmark POIs. Hover for name/road/distance tooltip.
        const roadStations = await fetch("/data/road_stations.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && roadStations) {
          const sq = 10;
          const canvas = document.createElement("canvas");
          canvas.width = sq;
          canvas.height = sq;
          const ctx2d = canvas.getContext("2d");
          if (ctx2d) {
            ctx2d.fillStyle = "#6b6f76";
            ctx2d.fillRect(1, 1, sq - 2, sq - 2);
            ctx2d.strokeStyle = "#f4ead5";
            ctx2d.lineWidth = 1;
            ctx2d.strokeRect(1, 1, sq - 2, sq - 2);
            const imgData = ctx2d.getImageData(0, 0, sq, sq);
            if (!map.hasImage("road-station-square")) {
              map.addImage("road-station-square", { width: sq, height: sq, data: imgData.data });
            }
          }

          map.addSource("road-stations", { type: "geojson", data: roadStations });
          map.addLayer({
            id: "road-stations",
            type: "symbol",
            source: "road-stations",
            minzoom: 5,
            layout: { "icon-image": "road-station-square", "icon-size": 1, "icon-allow-overlap": false },
          });

          const stationPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 8 });
          map.on("mouseenter", "road-stations", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            // @ts-ignore
            const coords = (f.geometry.type === "Point" && f.geometry.coordinates) || null;
            if (!coords) return;
            const distLine =
              p.distance_from_previous_mp != null
                ? `<div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(String(p.distance_from_previous_mp))} Roman mi from previous stop</div>`
                : "";
            stationPopup
              .setLngLat(coords as [number, number])
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px;">${escapeHtml(p.road || "")} · ${escapeHtml(p.category || "")}</div>
                   ${distLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "road-stations", () => {
            if (!map) return;
            map.getCanvas().style.cursor = "";
            stationPopup.remove();
          });
          kick();
        }

        // Phase 7: Events in 117 CE (public/data/events_117.geojson) — the year's news, drawn as
        // point markers (a dedication, a death, a battle) and translucent polygons (a war front,
        // a revolt zone). People markers are a separate HTML overlay, app/PeopleMarkers.tsx.
        const events117 = await fetch("/data/events_117.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && events117) {
          map.addSource("events-117", { type: "geojson", data: events117 });

          map.addLayer({
            id: "events-polygon-fill",
            type: "fill",
            source: "events-117",
            filter: ["==", ["geometry-type"], "Polygon"],
            paint: { "fill-color": "#a1442e", "fill-opacity": 0.15 },
          });
          map.addLayer({
            id: "events-polygon-line",
            type: "line",
            source: "events-117",
            filter: ["==", ["geometry-type"], "Polygon"],
            paint: { "line-color": "#a1442e", "line-width": 1.2, "line-dasharray": [3, 2], "line-opacity": 0.7 },
          });
          map.addLayer({
            id: "events-point",
            type: "circle",
            source: "events-117",
            filter: ["==", ["geometry-type"], "Point"],
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#a1442e",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const eventPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          const onEventEnter = (e: any) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const dateLine = p.date_iso ? `<div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(String(p.date_iso))} CE</div>` : "";
            const noteLine = p.one_line ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.one_line)}</div>` : "";
            const lngLat = e.lngLat;
            eventPopup
              .setLngLat(lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   ${dateLine}
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          };
          map.on("mouseenter", "events-point", onEventEnter);
          map.on("mouseleave", "events-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          map.on("click", "events-polygon-fill", onEventEnter);
          map.on("mouseenter", "events-polygon-fill", () => {
            if (map) map.getCanvas().style.cursor = "pointer";
          });
          kick();
        }

        // Phase 8: Trade routes (public/data/trade_routes.geojson) — long-distance commodity
        // routes as dashed amber LineStrings, with small diamond markers at named waypoint nodes.
        const tradeRoutes = await fetch("/data/trade_routes.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && tradeRoutes) {
          map.addSource("trade-routes", { type: "geojson", data: tradeRoutes });

          map.addLayer({
            id: "trade-routes-line",
            type: "line",
            source: "trade-routes",
            filter: ["==", ["geometry-type"], "LineString"],
            paint: {
              "line-color": "#b8860b",
              "line-width": ["interpolate", ["linear"], ["zoom"], 3, 1.4, 8, 2.6],
              "line-dasharray": [2, 1.5],
              "line-opacity": 0.85,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });
          map.addLayer({
            id: "trade-routes-node",
            type: "circle",
            source: "trade-routes",
            filter: ["==", ["geometry-type"], "Point"],
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3, 8, 5.5],
              "circle-color": "#b8860b",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const routePopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          const onRouteLineEnter = (e: any) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const noteLine = p.notes ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.notes)}</div>` : "";
            routePopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(p.commodity || "")} · ${escapeHtml(p.direction || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          };
          const onRouteNodeEnter = (e: any) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            routePopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(p.route || "")}</div>
                   <div style="margin-top:4px; max-width:220px;">${escapeHtml(p.role || "")}</div>
                 </div>`,
              )
              .addTo(map);
          };
          map.on("mouseenter", "trade-routes-line", onRouteLineEnter);
          map.on("mouseleave", "trade-routes-line", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          map.on("mouseenter", "trade-routes-node", onRouteNodeEnter);
          map.on("mouseleave", "trade-routes-node", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 9: Disasters + memory (public/data/disasters.geojson) — events still felt or
        // remembered in 117 CE (earthquakes, fires, floods, revolts), colored distinctly from the
        // current-year events layer so past trauma reads differently from unfolding news.
        const disasters = await fetch("/data/disasters.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && disasters) {
          map.addSource("disasters", { type: "geojson", data: disasters });
          map.addLayer({
            id: "disasters-point",
            type: "circle",
            source: "disasters",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#5c3a21",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const disasterPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "disasters-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const badge = p.still_visible_in_117
              ? `<div style="color:#a1442e; font-size:11px; margin-top:4px; font-weight:600;">Still felt in 117 CE</div>`
              : "";
            disasterPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 220px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(String(p.year ?? ""))} CE · ${escapeHtml(p.type || "")}</div>
                   <div style="margin-top:4px;">${escapeHtml(p.one_line || "")}</div>
                   ${badge}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "disasters-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 10: Health, medicine + spa culture (public/data/health.geojson) — Aquae spa
        // towns, Asklepieia, medical schools, named doctors, and malaria zones (axis 18).
        const health = await fetch("/data/health.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && health) {
          map.addSource("health", { type: "geojson", data: health });
          map.addLayer({
            id: "health-point",
            type: "circle",
            source: "health",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#1f9e89",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const healthPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "health-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const catLabel: Record<string, string> = {
              aquae_town: "Spa town",
              asklepieion: "Healing sanctuary",
              medical_school: "Medical school",
              doctor: "Physician",
              malaria_zone: "Malaria zone",
            };
            const noteLine = p.one_line ? `<div style="margin-top:4px;">${escapeHtml(p.one_line)}</div>` : "";
            healthPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(catLabel[p.category] || p.category || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "health-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 11: Mints (public/data/mints.geojson) — where the empire's coinage was struck
        // in 117 CE, imperial and civic (axis 8a).
        const mints = await fetch("/data/mints.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && mints) {
          map.addSource("mints", { type: "geojson", data: mints });
          map.addLayer({
            id: "mints-point",
            type: "circle",
            source: "mints",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#b08d2e",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const mintPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "mints-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const noteLine = p.one_line ? `<div style="margin-top:4px;">${escapeHtml(p.one_line)}</div>` : "";
            mintPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">Mint · ${escapeHtml(p.metal || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "mints-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 12: Imperial cult centers (public/data/imperial_cult.geojson) — provincial
        // Roma-et-Augusti temples, sebasteia, and Rome's temples to the deified emperors (axis 12).
        const imperialCult = await fetch("/data/imperial_cult.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && imperialCult) {
          map.addSource("imperial-cult", { type: "geojson", data: imperialCult });
          map.addLayer({
            id: "imperial-cult-point",
            type: "circle",
            source: "imperial-cult",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#8859a6",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const cultPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "imperial-cult-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const catLabel: Record<string, string> = {
              provincial_cult_center: "Provincial cult center",
              sebasteion: "Sebasteion",
              divus_temple: "Temple of a deified emperor",
            };
            const noteLine = p.one_line ? `<div style="margin-top:4px;">${escapeHtml(p.one_line)}</div>` : "";
            cultPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(catLabel[p.category] || p.category || "")}${p.first_worshipped ? " · " + escapeHtml(p.first_worshipped) : ""}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "imperial-cult-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 13: Political apparatus (public/data/politics.geojson) — chariot faction HQs,
        // praetorian/urban-cohort/vigiles/equites-singulares barracks, senator hometowns (axis 13).
        const politics = await fetch("/data/politics.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && politics) {
          map.addSource("politics", { type: "geojson", data: politics });
          map.addLayer({
            id: "politics-point",
            type: "circle",
            source: "politics",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#a1442e",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const politicsPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "politics-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const catLabel: Record<string, string> = {
              chariot_faction_HQ: "Chariot faction headquarters",
              praetorian_barrack: "Praetorian barracks",
              equites_singulares_barrack: "Imperial horse guard barracks",
              urban_cohort_HQ: "Urban cohort",
              vigiles_station: "Vigiles station",
              senator_hometown: "Senator's hometown",
            };
            const noteLine = p.one_line ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.one_line)}</div>` : "";
            politicsPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(catLabel[p.category] || p.category || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "politics-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 14: Long line features (public/data/lines.geojson) — frontier lines (Fossatum
        // Africae, the Upper Germanic-Raetian Limes, the Dacian Olt river frontier, axis 3a) and
        // major aqueducts (Aqua Claudia, Aqua Traiana, the Pont du Gard route and more, axis 3f).
        // One shared source, two filtered layers so the two feature families read distinctly —
        // frontiers stay dashed earth-brown, aqueducts get a solid line in the same green already
        // used for aqueduct POI pins (app/poiCategories.ts's "infrastructure" group).
        const lines = await fetch("/data/lines.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && lines) {
          map.addSource("lines", { type: "geojson", data: lines });
          map.addLayer({
            id: "frontier-lines-line",
            type: "line",
            source: "lines",
            filter: ["==", ["get", "category"], "frontier_line"],
            paint: {
              "line-color": "#6a5f4a",
              "line-width": ["interpolate", ["linear"], ["zoom"], 3, 1.2, 8, 2.4],
              "line-dasharray": [3, 2],
              "line-opacity": 0.85,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });
          map.addLayer({
            id: "aqueduct-lines-line",
            type: "line",
            source: "lines",
            filter: ["==", ["get", "category"], "aqueduct_line"],
            paint: {
              "line-color": "#3a9a6a",
              "line-width": ["interpolate", ["linear"], ["zoom"], 3, 1, 8, 2.2],
              "line-opacity": 0.85,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });

          const linePopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          const onLineEnter = (e: any) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const noteLine = p.notes ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.notes)}</div>` : "";
            linePopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124;">
                   <div style="font-weight: 600;">${escapeHtml(p.name_english || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(p.province || "")}${p.extant_117ce === false ? " · not yet built in 117 CE" : ""}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          };
          const onLineLeave = () => {
            if (map) map.getCanvas().style.cursor = "";
          };
          map.on("mouseenter", "frontier-lines-line", onLineEnter);
          map.on("mouseleave", "frontier-lines-line", onLineLeave);
          map.on("mouseenter", "aqueduct-lines-line", onLineEnter);
          map.on("mouseleave", "aqueduct-lines-line", onLineLeave);
          kick();
        }

        // Phase 15: Welfare + euergetism (public/data/euergetism.geojson) — Trajan's alimenta
        // child-welfare towns (Veleia and Ligures Baebiani's bronze tables, and individually
        // attested towns beyond those two) plus a handful of Trajanic-era benefactor endowments
        // (axis 15).
        const euergetism = await fetch("/data/euergetism.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && euergetism) {
          map.addSource("euergetism", { type: "geojson", data: euergetism });
          map.addLayer({
            id: "euergetism-point",
            type: "circle",
            source: "euergetism",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#c98a2e",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const euergetismPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "euergetism-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const catLabel: Record<string, string> = {
              alimenta_town: "Alimenta welfare town",
              benefactor_inscription: "Benefactor endowment",
            };
            const noteLine = p.one_line ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.one_line)}</div>` : "";
            euergetismPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(catLabel[p.category] || p.category || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "euergetism-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 16: Exile + penal geography (public/data/penal.geojson) — every known Roman
        // exile island (Julio-Claudian relegation network in the Aegean and Tyrrhenian), plus a
        // penal mine, a penal quarry, and Rome's own Tullianum execution cell (axis 17).
        const penal = await fetch("/data/penal.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && penal) {
          map.addSource("penal", { type: "geojson", data: penal });
          map.addLayer({
            id: "penal-point",
            type: "circle",
            source: "penal",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#4a4a52",
              "circle-stroke-color": "#e2ddd8",
              "circle-stroke-width": 1.6,
            },
          });

          const penalPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "penal-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const catLabel: Record<string, string> = {
              exile_island: "Exile island",
              penal_mine: "Penal mine",
              penal_quarry: "Penal quarry",
              prison: "Prison",
            };
            const name = p.name_english || p.name_latin || "";
            const noteLine = p.notes ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.notes)}</div>` : "";
            penalPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(name)}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(catLabel[p.category] || p.category || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "penal-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 17: Religious communities (public/data/religions_117.geojson) — Christian and
        // Jewish diaspora communities, Isis/Cybele cult centers, and mystery-cult sanctuaries
        // active by 117 CE, each tagged with an attestation confidence band (axis 6b).
        const religions = await fetch("/data/religions_117.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && religions) {
          map.addSource("religions", { type: "geojson", data: religions });
          map.addLayer({
            id: "religions-point",
            type: "circle",
            source: "religions",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#a63d6b",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const religionPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "religions-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const traditionLabel: Record<string, string> = {
              christian: "Christian community",
              jewish: "Jewish diaspora community",
              isis: "Isis cult center",
              mithraic: "Mithraic community",
              cybele: "Cybele (Magna Mater) center",
              other_mystery: "Mystery cult sanctuary",
            };
            const attestationLabel: Record<string, string> = {
              attested_117: "Attested by 117 CE",
              probable: "Probable by 117 CE",
              claimed: "Claimed in later sources",
            };
            const noteLine = p.one_line ? `<div style="margin-top:4px;">${escapeHtml(p.one_line)}</div>` : "";
            religionPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(traditionLabel[p.tradition] || p.tradition || "")}${p.attestation ? " · " + escapeHtml(attestationLabel[p.attestation] || p.attestation) : ""}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "religions-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 18: Sports + athletic culture (public/data/sports.geojson) — gymnasia, the
        // sacred-crown festival circuit (periodos: Olympia, Delphi, Nemea, Isthmia), other
        // periodic festivals, and athletic guild HQs (axis 20).
        const sports = await fetch("/data/sports.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && sports) {
          map.addSource("sports", { type: "geojson", data: sports });
          map.addLayer({
            id: "sports-point",
            type: "circle",
            source: "sports",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#3f7a4f",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const sportsPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "sports-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const catLabel: Record<string, string> = {
              gymnasium: "Gymnasium",
              athletic_guild: "Athletic guild HQ",
              festival_site: "Festival site",
            };
            const subLine = p.festival_name
              ? p.festival_name + (p.circuit === "periodos" ? " · Sacred crown games" : "")
              : catLabel[p.category] || p.category || "";
            const noteLine = p.one_line ? `<div style="margin-top:4px;">${escapeHtml(p.one_line)}</div>` : "";
            sportsPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(subLine)}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "sports-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 19: Foreign relations + embassies (public/data/diplomacy_117.geojson) — hostage
        // princes at Rome, inbound/outbound embassies, and treaty sites with Parthia, Armenia,
        // India, Han China, Britannia, and the empire's client kingdoms (axis 14).
        const diplomacy = await fetch("/data/diplomacy_117.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && diplomacy) {
          map.addSource("diplomacy", { type: "geojson", data: diplomacy });
          map.addLayer({
            id: "diplomacy-point",
            type: "circle",
            source: "diplomacy",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#3a6b91",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const diplomacyPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "diplomacy-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const directionLabel: Record<string, string> = {
              inbound: "Inbound embassy",
              outbound: "Outbound trade/contact",
              treaty: "Treaty site",
              hostage: "Hostage residence",
            };
            const subLine = [directionLabel[p.direction] || p.direction, p.polity].filter(Boolean).join(" · ");
            const noteLine = p.one_line ? `<div style="margin-top:4px;">${escapeHtml(p.one_line)}</div>` : "";
            diplomacyPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(subLine)}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "diplomacy-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 20: Textile + luxury craft geography (public/data/crafts.geojson) — purple dye
        // works, silk endpoints, linen and wool centers, amber working, pearl fisheries,
        // perfume, glass, bronze, and jewelry production (axis 16).
        const crafts = await fetch("/data/crafts.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && crafts) {
          map.addSource("crafts", { type: "geojson", data: crafts });
          map.addLayer({
            id: "crafts-point",
            type: "circle",
            source: "crafts",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#8a5a8f",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const craftsPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "crafts-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const craftLabel: Record<string, string> = {
              purple_dye: "Purple dye works",
              silk: "Silk trade",
              linen: "Linen weaving",
              wool: "Wool production",
              amber: "Amber working",
              pearl: "Pearl fishery",
              perfume: "Perfume production",
              glass: "Glassmaking",
              bronze: "Bronze working",
              jewelry: "Jewelry / goldsmithing",
            };
            const noteLine = p.one_line ? `<div style="margin-top:4px;">${escapeHtml(p.one_line)}</div>` : "";
            craftsPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(craftLabel[p.craft] || p.craft || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "crafts-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 21: Correspondence networks (public/data/letters.geojson) — Pliny the Younger's
        // letter-writing network: his own villas as origin nodes, named correspondents as
        // recipient nodes, and route LineStrings for the best-documented exchanges (axis 19).
        const letters = await fetch("/data/letters.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && letters) {
          map.addSource("letters", { type: "geojson", data: letters });

          map.addLayer({
            id: "letters-route-line",
            type: "line",
            source: "letters",
            filter: ["==", ["geometry-type"], "LineString"],
            paint: {
              "line-color": "#5c7a3a",
              "line-width": ["interpolate", ["linear"], ["zoom"], 3, 1.2, 8, 2.2],
              "line-dasharray": [1.5, 1.5],
              "line-opacity": 0.75,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });
          map.addLayer({
            id: "letters-node-point",
            type: "circle",
            source: "letters",
            filter: ["==", ["geometry-type"], "Point"],
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": [
                "match",
                ["get", "node_type"],
                "origin",
                "#8b5a2b",
                "#5c7a3a",
              ],
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const lettersPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          const onLettersNodeEnter = (e: any) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const subLine = p.node_type === "origin" ? "Pliny's own estate" : `Correspondent of Pliny the Younger`;
            const noteLine = p.one_line ? `<div style="margin-top:4px;">${escapeHtml(p.one_line)}</div>` : "";
            lettersPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(subLine)}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          };
          const onLettersLineEnter = (e: any) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const noteLine = p.note ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.note)}</div>` : "";
            lettersPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124;">
                   <div style="font-weight: 600;">${escapeHtml(p.from || "")} &rarr; ${escapeHtml(p.to || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          };
          map.on("mouseenter", "letters-node-point", onLettersNodeEnter);
          map.on("mouseleave", "letters-node-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          map.on("mouseenter", "letters-route-line", onLettersLineEnter);
          map.on("mouseleave", "letters-route-line", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 22: Intellectual + educational centers (public/data/learning_117.geojson) —
        // Alexandria's Museion/Serapeum, Athens's four philosophy schools, and the rhetoric/law/
        // medical schools at Rhodes, Berytus, Nicopolis, Pergamon, Antioch, Massilia, Rome (axis 6c).
        const learning = await fetch("/data/learning_117.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && learning) {
          map.addSource("learning", { type: "geojson", data: learning });
          map.addLayer({
            id: "learning-point",
            type: "circle",
            source: "learning",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#3b4a7a",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const learningPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "learning-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const categoryLabel: Record<string, string> = {
              library: "Library",
              philosophy_school: "Philosophy school",
              rhetoric_school: "Rhetoric school",
              law_school: "Law school",
              medical_school: "Medical school",
              scriptorium: "Scriptorium",
            };
            const noteLine = p.one_line ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.one_line)}</div>` : "";
            learningPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(categoryLabel[p.category] || p.category || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "learning-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 23: Natural landmarks (public/data/landmarks_117.geojson) — volcanoes, sacred
        // mountains, sacred islands, sea-hazards, sacred springs, and geological wonders people
        // knew and revered in 117 CE (axis 6d).
        const landmarks = await fetch("/data/landmarks_117.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && landmarks) {
          map.addSource("landmarks", { type: "geojson", data: landmarks });
          map.addLayer({
            id: "landmarks-point",
            type: "circle",
            source: "landmarks",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#2e6b4f",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const landmarksPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "landmarks-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const typeLabel: Record<string, string> = {
              volcano: "Volcano",
              sacred_mountain: "Sacred mountain",
              sacred_island: "Sacred island",
              sea_hazard: "Sea hazard",
              sacred_spring: "Sacred spring",
              wonder: "Geological wonder",
            };
            const noteLine = p.one_line ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.one_line)}</div>` : "";
            landmarksPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(typeLabel[p.type] || p.type || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "landmarks-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 24: Client kingdoms + neighbors just outside the empire (public/data/
        // neighbors_117.geojson) — the political world beyond Rome's own borders (axis 5b).
        const neighbors = await fetch("/data/neighbors_117.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && neighbors) {
          map.addSource("neighbors", { type: "geojson", data: neighbors });
          map.addLayer({
            id: "neighbors-point",
            type: "circle",
            source: "neighbors",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 2, 4, 7, 7],
              "circle-color": [
                "match",
                ["get", "relation_to_rome"],
                "client", "#3a6ea5",
                "ally", "#2e8f7a",
                "trading_partner", "#b8862e",
                "rival", "#a05a2c",
                "enemy", "#8b2e2e",
                "#6a6a6a",
              ],
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const neighborsPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "neighbors-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const relationLabel: Record<string, string> = {
              client: "Client kingdom",
              ally: "Ally",
              trading_partner: "Trading partner",
              rival: "Rival",
              enemy: "Enemy",
            };
            const noteLine = p.one_line ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.one_line)}</div>` : "";
            neighborsPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(relationLabel[p.relation_to_rome] || p.relation_to_rome || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "neighbors-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 25: Language belts (public/data/languages.geojson) — everyday spoken-language
        // geography in 117 CE, distinct from the Latin/Greek administrative split (axis 5a).
        // Soft translucent fills, deliberately drawn in this late phase so they layer on top of
        // roads/provinces/POIs without occluding anything a user is more likely to click on.
        const languages = await fetch("/data/languages.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && languages) {
          map.addSource("languages", { type: "geojson", data: languages });
          map.addLayer({
            id: "languages-fill",
            type: "fill",
            source: "languages",
            paint: {
              "fill-color": [
                "match",
                ["get", "id"],
                "lang_latin", "#b0431a",
                "lang_greek", "#3a6ea5",
                "lang_punic", "#8b2e6e",
                "lang_berber", "#a08a2e",
                "lang_aramaic", "#2e8f7a",
                "lang_egyptian", "#c9a227",
                "lang_gaulish", "#5c8c3a",
                "lang_brittonic", "#3a9a6a",
                "lang_galatian", "#6a5f4a",
                "lang_iberian_celtiberian", "#a05a2c",
                "lang_aquitanian", "#8b5a2c",
                "lang_illyrian", "#7a4a8c",
                "lang_thracian", "#4a5a8c",
                "#6a6a6a",
              ],
              "fill-opacity": 0.16,
            },
          });
          map.addLayer({
            id: "languages-line",
            type: "line",
            source: "languages",
            paint: {
              "line-color": [
                "match",
                ["get", "id"],
                "lang_latin", "#b0431a",
                "lang_greek", "#3a6ea5",
                "lang_punic", "#8b2e6e",
                "lang_berber", "#a08a2e",
                "lang_aramaic", "#2e8f7a",
                "lang_egyptian", "#c9a227",
                "lang_gaulish", "#5c8c3a",
                "lang_brittonic", "#3a9a6a",
                "lang_galatian", "#6a5f4a",
                "lang_iberian_celtiberian", "#a05a2c",
                "lang_aquitanian", "#8b5a2c",
                "lang_illyrian", "#7a4a8c",
                "lang_thracian", "#4a5a8c",
                "#6a6a6a",
              ],
              "line-width": 1,
              "line-dasharray": [3, 2],
              "line-opacity": 0.5,
            },
          });

          const languagesPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "languages-fill", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const noteLine = p.one_line ? `<div style="margin-top:4px; max-width:240px;">${escapeHtml(p.one_line)}</div>` : "";
            languagesPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 260px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(p.family || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "languages-fill", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 26: Etruscan substrate (public/data/substrate.geojson) — pre-Roman Etruscan
        // cities, necropoleis, and sanctuaries still visible under Roman rule in 117 CE (axis 10b,
        // the first "historical substrate" culture layer). Ghosted markers with a dashed outline
        // per the brief's own styling note for substrate features, distinct from the solid-stroke
        // circles every other axis layer uses.
        const substrate = await fetch("/data/substrate.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && substrate) {
          map.addSource("substrate", { type: "geojson", data: substrate });
          map.addLayer({
            id: "substrate-point",
            type: "circle",
            source: "substrate",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3, 8, 6],
              "circle-color": "#7a6a52",
              "circle-opacity": 0.55,
              "circle-stroke-color": "#7a6a52",
              "circle-stroke-width": 1.4,
              "circle-stroke-opacity": 0.9,
            },
          });

          const substratePopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "substrate-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const noteLine = p.notes ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.notes)}</div>` : "";
            const cultureLabel = p.culture ? p.culture.charAt(0).toUpperCase() + p.culture.slice(1) : "";
            substratePopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name_english || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(cultureLabel)} ${escapeHtml(p.type || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "substrate-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 27: Asia's conventus centers (public/data/conventus_asia.geojson) — the province's
        // 13 assize/judicial-district capitals where the proconsul held circuit court (axis 8b).
        const conventus = await fetch("/data/conventus_asia.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && conventus) {
          map.addSource("conventus", { type: "geojson", data: conventus });
          map.addLayer({
            id: "conventus-point",
            type: "circle",
            source: "conventus",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3.5, 8, 6.5],
              "circle-color": "#8a6d3b",
              "circle-stroke-color": "#f4ead5",
              "circle-stroke-width": 1.6,
            },
          });

          const conventusPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "conventus-point", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const noteLine = p.notes ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.notes)}</div>` : "";
            conventusPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">Conventus center · ${escapeHtml(p.province || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "conventus-point", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Phase 28: Crop/agriculture zones (public/data/agriculture.geojson) — grain, olive-oil,
        // wine, and timber belts (axis 7a). Soft translucent fills, same visual family as the
        // Phase 25 language belts, colored by `commodity` rather than by language.
        const agriculture = await fetch("/data/agriculture.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && agriculture) {
          map.addSource("agriculture", { type: "geojson", data: agriculture });
          const agricultureColors: any = [
            "match",
            ["get", "commodity"],
            "grain", "#c9a227",
            "olive_oil", "#5c8c3a",
            "wine", "#8b2e6e",
            "timber", "#4a5057",
            "#6a6a6a",
          ];
          map.addLayer({
            id: "agriculture-fill",
            type: "fill",
            source: "agriculture",
            paint: {
              "fill-color": agricultureColors,
              "fill-opacity": 0.16,
            },
          });
          map.addLayer({
            id: "agriculture-line",
            type: "line",
            source: "agriculture",
            paint: {
              "line-color": agricultureColors,
              "line-width": 1,
              "line-dasharray": [3, 2],
              "line-opacity": 0.5,
            },
          });

          const commodityLabel: Record<string, string> = {
            grain: "Grain belt",
            olive_oil: "Olive-oil belt",
            wine: "Wine region",
            timber: "Timber zone",
          };
          const agriculturePopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "agriculture-fill", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const noteLine = p.one_line ? `<div style="margin-top:4px; max-width:240px;">${escapeHtml(p.one_line)}</div>` : "";
            agriculturePopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 260px;">
                   <div style="font-weight: 600;">${escapeHtml(p.name || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(commodityLabel[p.commodity] || p.commodity || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "agriculture-fill", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
          kick();
        }

        // Apply any persisted Layers-panel visibility (all groups default visible).
        applyAllLayers();
      });
    })();

    return () => {
      cancelled = true;
      if (onWinResize) window.removeEventListener("resize", onWinResize);
      if (onPopState) window.removeEventListener("popstate", onPopState);
      if (unsubPoi) unsubPoi();
      if (pushTimer) clearTimeout(pushTimer);
      if (ro) ro.disconnect();
      if (map) map.remove();
    };
  }, []);

  return <div ref={ref} style={{ position: "absolute", inset: 0 }} />;
}

/** Parses a `#lng,lat,zoomz` location hash (e.g. `#12.4964,41.9028,4.20z`) into a view, or null
 * if the hash is empty/malformed. */
function parseHash(hash: string): { lng: number; lat: number; zoom: number; poiId?: string } | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  // Optional trailing `:<poiId>` shares which place's panel was open, on top of the camera view
  // the coordinates-sync already covered. `poiId` matches a pois.geojson feature's own `id`.
  const m = raw.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*)z(?::([\w-]+))?$/);
  if (!m) return null;
  const lng = parseFloat(m[1]);
  const lat = parseFloat(m[2]);
  const zoom = parseFloat(m[3]);
  if (!isFinite(lng) || !isFinite(lat) || !isFinite(zoom)) return null;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null;
  return { lng, lat, zoom, poiId: m[4] || undefined };
}

function formatHash(lng: number, lat: number, zoom: number, poiId?: string): string {
  const base = `#${lng.toFixed(4)},${lat.toFixed(4)},${zoom.toFixed(2)}z`;
  return poiId ? `${base}:${poiId}` : base;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c],
  );
}

/** Build a "sea mask" FeatureCollection: one polygon covering the whole world with every land
 * outer ring cut out as a hole. Painted over rivers/provinces so Natural Earth linework that
 * over-extends into water (river estuaries past ancient coastlines, province polygons buffered
 * a few kilometers offshore) is occluded. Interior rings of land features (real lakes inside
 * a continent) are ignored — the `lakes` layer paints them explicitly and they're rare enough
 * that leaving them in the mask would just add coordinate weight for no visual gain. */
function buildSeaMask(land: any): GeoJSON.FeatureCollection {
  // Full-world outer ring, wound CCW. MapLibre uses non-zero fill so winding doesn't strictly
  // matter, but we keep GeoJSON right-hand-rule so the mask serializes cleanly if we ever
  // move this to a build-time file.
  const worldRing: [number, number][] = [
    [-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85],
  ];
  const holes: [number, number][][] = [];
  for (const f of land.features || []) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === "Polygon") {
      holes.push(g.coordinates[0]);
    } else if (g.type === "MultiPolygon") {
      for (const poly of g.coordinates) holes.push(poly[0]);
    }
  }
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: { type: "Polygon", coordinates: [worldRing, ...holes] },
      },
    ],
  };
}

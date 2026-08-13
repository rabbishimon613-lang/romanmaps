"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { applyAllLayers } from "./useLayers";
import { selectPoi, clearPoi } from "./usePoiPanel";
import { categoryColorMatchPairs, DEFAULT_COLOR } from "./poiCategories";
import { ostiaEntry } from "./ostiaDescriptions";
import { SITE_META } from "./sites";

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
          },
          layers: [
            { id: "bg", type: "background", paint: { "background-color": "#a9d1e3" } },
            {
              id: "land",
              type: "fill",
              source: "land",
              paint: { "fill-color": "#f4ead5" },
            },
            {
              id: "ancient-sea",
              type: "fill",
              source: "ancient-sea",
              paint: { "fill-color": "#a9d1e3" },
            },
            {
              id: "ancient-sea-outline",
              type: "line",
              source: "ancient-sea",
              minzoom: 11,
              paint: { "line-color": "#7fb0c9", "line-width": 0.8, "line-dasharray": [4, 3], "line-opacity": 0.6 },
            },
            {
              id: "provinces-fill",
              type: "fill",
              source: "provinces",
              paint: { "fill-color": "#ecdfbf", "fill-opacity": 0.18 },
            },
            {
              id: "provinces-line",
              type: "line",
              source: "provinces",
              paint: {
                "line-color": "#a58a5a",
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
                "line-color": "#7fb0c9",
                "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.3, 8, 1.4],
              },
            },
            { id: "lakes", type: "fill", source: "lakes", paint: { "fill-color": "#b8dbe6" } },
          ],
        },
        center: initialView ? [initialView.lng, initialView.lat] : [12.4964, 41.9028],
        zoom: initialView ? initialView.zoom : 4.2,
        minZoom: 2.5,
        maxZoom: 19,
        attributionControl: false,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
      });

      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution:
            'Data © <a href="https://dh.gu.se/dare/" target="_blank">DARE</a> · <a href="https://pelagios.org" target="_blank">Pelagios</a>',
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

      // Coordinates URL sync — keep #lng,lat,zoomz in the hash as the user pans/zooms/flies
      // anywhere (search, site jump, context menu), and make back/forward retrace those stops.
      // The very first write replaces the current history entry rather than pushing a new one,
      // so loading the app doesn't itself consume a "back" step.
      let firstHashWrite = true;
      let suppressNextPush = !!initialView;
      const writeHash = () => {
        if (!map) return;
        const c = map.getCenter();
        const hash = formatHash(c.lng, c.lat, map.getZoom());
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
      onPopState = () => {
        if (!map) return;
        const view = parseHash(window.location.hash);
        if (!view) return;
        suppressNextPush = true;
        map.flyTo({ center: [view.lng, view.lat], zoom: view.zoom, duration: 600 });
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
          minzoom: 4.5,
          paint: {
            "line-color": "#c17a4d",
            "line-width": ["interpolate", ["linear"], ["zoom"], 4.5, 0.5, 7, 1.2, 10, 2.4],
            "line-opacity": 0.75,
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
          paint: {
            "line-color": "#a12b0d",
            "line-width": ["interpolate", ["linear"], ["zoom"], 3, 1.4, 5, 2.4, 7, 3.4, 10, 4.4],
            "line-opacity": 0.95,
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
            "text-color": "#2a1e10",
            "text-halo-color": "#f4ead5",
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
            "text-color": "#5c4326",
            "text-halo-color": "#f4ead5",
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
            "text-max-width": 8,
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

        // Phase 14: Frontier lines (public/data/lines.geojson) — Fossatum Africae, the Upper
        // Germanic-Raetian Limes, and the Dacian Olt river frontier as of 117 CE (axis 3a).
        const lines = await fetch("/data/lines.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        if (!cancelled && map && lines) {
          map.addSource("frontier-lines", { type: "geojson", data: lines });
          map.addLayer({
            id: "frontier-lines-line",
            type: "line",
            source: "frontier-lines",
            paint: {
              "line-color": "#6a5f4a",
              "line-width": ["interpolate", ["linear"], ["zoom"], 3, 1.2, 8, 2.4],
              "line-dasharray": [3, 2],
              "line-opacity": 0.85,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });

          const frontierPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 10 });
          map.on("mouseenter", "frontier-lines-line", (e) => {
            if (!map) return;
            map.getCanvas().style.cursor = "pointer";
            const f = e.features?.[0];
            if (!f) return;
            const p: any = f.properties || {};
            const noteLine = p.notes ? `<div style="margin-top:4px; max-width:220px;">${escapeHtml(p.notes)}</div>` : "";
            frontierPopup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font: 13px Roboto, sans-serif; color: #202124;">
                   <div style="font-weight: 600;">${escapeHtml(p.name_english || "")}</div>
                   <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(p.province || "")}</div>
                   ${noteLine}
                 </div>`,
              )
              .addTo(map);
          });
          map.on("mouseleave", "frontier-lines-line", () => {
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
      if (pushTimer) clearTimeout(pushTimer);
      if (ro) ro.disconnect();
      if (map) map.remove();
    };
  }, []);

  return <div ref={ref} style={{ position: "absolute", inset: 0 }} />;
}

/** Parses a `#lng,lat,zoomz` location hash (e.g. `#12.4964,41.9028,4.20z`) into a view, or null
 * if the hash is empty/malformed. */
function parseHash(hash: string): { lng: number; lat: number; zoom: number } | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const m = raw.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*)z$/);
  if (!m) return null;
  const lng = parseFloat(m[1]);
  const lat = parseFloat(m[2]);
  const zoom = parseFloat(m[3]);
  if (!isFinite(lng) || !isFinite(lat) || !isFinite(zoom)) return null;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null;
  return { lng, lat, zoom };
}

function formatHash(lng: number, lat: number, zoom: number): string {
  return `#${lng.toFixed(4)},${lat.toFixed(4)},${zoom.toFixed(2)}z`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c],
  );
}

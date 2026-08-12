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
        center: [12.4964, 41.9028],
        zoom: 4.2,
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
      // Real animated flyTo — forces rAF frames the whole way, which paints.
      const openingFly = () => {
        if (!map) return;
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

        // Apply any persisted Layers-panel visibility (all groups default visible).
        applyAllLayers();
      });
    })();

    return () => {
      cancelled = true;
      if (onWinResize) window.removeEventListener("resize", onWinResize);
      if (ro) ro.disconnect();
      if (map) map.remove();
    };
  }, []);

  return <div ref={ref} style={{ position: "absolute", inset: 0 }} />;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c],
  );
}

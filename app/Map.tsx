"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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
      const [land, provinces, lakes, rivers] = await Promise.all([
        fetch("/data/land.geojson").then((r) => r.json()),
        fetch("/data/provinces.geojson").then((r) => r.json()),
        fetch("/data/10m_lakes.geojson").then((r) => r.json()),
        fetch("/data/10m_rivers_lake_centerlines.geojson").then((r) => r.json()),
      ]);
      if (cancelled || !ref.current) return;

      map = new maplibregl.Map({
        container: ref.current,
        style: {
          version: 8,
          glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
          sources: {
            land: { type: "geojson", maxzoom: 8, buffer: 128, tolerance: 1, data: land },
            provinces: { type: "geojson", maxzoom: 8, buffer: 128, tolerance: 1, data: provinces },
            lakes: { type: "geojson", maxzoom: 8, buffer: 128, tolerance: 1, data: lakes },
            rivers: { type: "geojson", maxzoom: 8, buffer: 128, tolerance: 1, data: rivers },
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
              id: "provinces-fill",
              type: "fill",
              source: "provinces",
              paint: { "fill-color": "#ecdfbf", "fill-opacity": 0.55 },
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
        maxZoom: 10,
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
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
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
          type: "geojson", maxzoom: 8, buffer: 128, tolerance: 1, data: secondaryRoads,
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
          type: "geojson", maxzoom: 8, buffer: 128, tolerance: 1, data: mainRoads,
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
        map.addSource("places", { type: "geojson", maxzoom: 8, buffer: 128, tolerance: 1, data: places });
        map.addLayer({
          id: "places-dot",
          type: "circle",
          source: "places",
          filter: ["==", ["get", "ancient"], 1],
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              3,
              ["case", ["==", ["get", "major"], 1], 2.4, 0.8],
              8,
              ["case", ["==", ["get", "major"], 1], 4.5, 2.4],
            ],
            "circle-color": "#3b2a17",
            "circle-stroke-color": "#f4ead5",
            "circle-stroke-width": 1,
          },
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
          minzoom: 5.5,
          layout: {
            "text-field": ["coalesce", ["get", "latin"], ["get", "modern"]],
            "text-font": ["Noto Sans Regular"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 5.5, 10, 9, 13],
            "text-offset": [0, 0.8],
            "text-anchor": "top",
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
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 3, 8, 7],
            "circle-color": "#8b1a1a",
            "circle-stroke-color": "#f4ead5",
            "circle-stroke-width": 1.5,
          },
        });
        map.addLayer({
          id: "pois-label",
          type: "symbol",
          source: "pois",
          filter: ["==", ["get", "extant_117ce"], true],
          minzoom: 6,
          layout: {
            "text-field": ["coalesce", ["get", "name_latin"], ["get", "name_english"]],
            "text-font": ["Noto Sans Regular"],
            "text-size": 12,
            "text-offset": [0, 1],
            "text-anchor": "top",
            "text-optional": true,
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#5c1414",
            "text-halo-color": "#f4ead5",
            "text-halo-width": 1.6,
          },
        });

        const poiPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 10, maxWidth: "280px" });
        map.on("mouseenter", "pois-dot", () => {
          if (!map) return;
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "pois-dot", () => {
          if (!map) return;
          map.getCanvas().style.cursor = "";
        });
        map.on("click", "pois-dot", (e) => {
          if (!map) return;
          const f = e.features?.[0];
          if (!f) return;
          const props: any = f.properties || {};
          // @ts-ignore
          const coords = (f.geometry.type === "Point" && f.geometry.coordinates) || null;
          if (!coords) return;
          const built = props.built ? (props.built < 0 ? `${-props.built} BCE` : `${props.built} CE`) : "";
          poiPopup
            .setLngLat(coords as [number, number])
            .setHTML(
              `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 260px;">
                 <div style="font-weight: 600; font-size: 14px;">${props.name_latin || props.name_english}</div>
                 ${props.name_english && props.name_english !== props.name_latin ? `<div style="color:#5f6368; font-size:12px;">${props.name_english}</div>` : ""}
                 ${built ? `<div style="color:#5f6368; font-size:11px; margin-top:4px;">Built ${built}</div>` : ""}
                 ${props.notes ? `<div style="margin-top:6px; font-size:12px; line-height:1.4;">${props.notes}</div>` : ""}
               </div>`,
            )
            .addTo(map);
        });
        kick();
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

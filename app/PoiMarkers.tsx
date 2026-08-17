"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { CATEGORY_GROUPS, colorForCategory, glyphForCategory, groupIdForCategory } from "./poiCategories";
import { useCategoryFilters } from "./CategoryChips";
import { useHiddenCategories } from "./useHiddenCategories";
import { selectPoi, usePoiPanel } from "./usePoiPanel";
import { useLayers } from "./useLayers";

type PoiFeature = GeoJSON.Feature<GeoJSON.Point, Record<string, any>>;

// Zoom gates — mirror Google Maps' rhythm: no POIs at empire-scale, pins only at province scale,
// pin+label once you're at city scale. Prevents the "swarm of fortress labels" flagged in audit.
const POI_MIN_ZOOM = 5;
const POI_LABEL_MIN_ZOOM = 8;
// Screen-space clustering: POIs whose projected centers land within this many CSS pixels of an
// earlier POI are collapsed into a single count-badge marker. Below the cluster-disable zoom the
// user is close enough to see distinct buildings, so we render individual markers regardless.
const CLUSTER_RADIUS_PX = 28;
const CLUSTER_DISABLE_ZOOM = 14;

/** Renders POIs as Google-Maps-style pill markers (colored circle w/ glyph) via HTML markers.
 * Category chip filter (top row) isolates to only the selected categories; the Layers panel's
 * per-category checkboxes (useHiddenCategories) independently hide specific ones — both AND
 * together, see the two `continue` guards below. The Layers panel's "Landmarks" toggle also
 * gates this component directly (same pattern as PeopleMarkers.tsx) — the native
 * pois-dot/pois-label map layers that toggle used to point at are vestigial (radius/opacity
 * forced to 0), so before this fix the toggle did nothing visible. */
export default function PoiMarkers() {
  const filters = useCategoryFilters();
  const hiddenCategories = useHiddenCategories();
  const layers = useLayers();
  const visible = layers["pois"];
  const selected = usePoiPanel();
  const selectedId = typeof selected?.props?.id === "string" ? selected.props.id : undefined;
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const featuresRef = useRef<PoiFeature[] | null>(null);
  // Always current, read from inside `render()` below instead of closing over `selectedId`
  // directly — the main effect intentionally does NOT depend on selection (see the comment on
  // its dependency array), so its closure's `selectedId` would otherwise go stale immediately.
  const selectedIdRef = useRef<string | undefined>(undefined);
  selectedIdRef.current = selectedId;
  // Re-run to redraw (styling only, no data refetch) whenever the selection changes.
  const rerenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    let mapRef: maplibregl.Map | undefined;
    let onZoomEnd: (() => void) | undefined;

    async function ensureFeatures() {
      if (featuresRef.current) return featuresRef.current;
      const res = await fetch("/data/pois.geojson");
      const fc: GeoJSON.FeatureCollection<GeoJSON.Point, Record<string, any>> = await res.json();
      const feats = (fc.features || []).filter((f) => {
        const p: any = f.properties || {};
        if (f.geometry?.type !== "Point") return false;
        // "extant_117ce" gates standing structures — a destroyed/not-yet-built building
        // shouldn't get a pin. Battles and shipwrecks are historical-memory event markers, not
        // structures (almost never "extant"), so they're exempt from that gate.
        return p.extant_117ce === true || p.category === "battle" || p.category === "shipwreck";
      });
      featuresRef.current = feats;
      return feats;
    }

    function render(map: maplibregl.Map, feats: PoiFeature[]) {
      // Clear existing
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const zoom = map.getZoom();
      if (zoom < POI_MIN_ZOOM) return;
      const showLabel = zoom >= POI_LABEL_MIN_ZOOM;
      const selectedId = selectedIdRef.current;

      const activeGroups = Object.keys(filters).filter((k) => filters[k]);
      const anyActive = activeGroups.length > 0;

      // First pass: filter by category chips, project each visible POI to screen pixels, then
      // greedily cluster within CLUSTER_RADIUS_PX. Above CLUSTER_DISABLE_ZOOM every POI stays
      // solo so building-level detail is legible.
      const visible: { f: PoiFeature; x: number; y: number }[] = [];
      for (const f of feats) {
        const props: any = f.properties || {};
        const category: string = props.category || "";
        const groupId = groupIdForCategory(category);
        if (anyActive && !activeGroups.includes(groupId)) continue;
        if (hiddenCategories.has(groupId)) continue;
        const [lng, lat] = f.geometry.coordinates as [number, number];
        const pt = map.project([lng, lat]);
        visible.push({ f, x: pt.x, y: pt.y });
      }

      type Cluster = { x: number; y: number; members: PoiFeature[] };
      const clusters: Cluster[] = [];
      const cluster = zoom < CLUSTER_DISABLE_ZOOM;
      const r2 = CLUSTER_RADIUS_PX * CLUSTER_RADIUS_PX;
      for (const v of visible) {
        if (!cluster) {
          clusters.push({ x: v.x, y: v.y, members: [v.f] });
          continue;
        }
        let joined = false;
        for (const c of clusters) {
          const dx = c.x - v.x;
          const dy = c.y - v.y;
          if (dx * dx + dy * dy <= r2) {
            c.members.push(v.f);
            joined = true;
            break;
          }
        }
        if (!joined) clusters.push({ x: v.x, y: v.y, members: [v.f] });
      }

      for (const c of clusters) {
        if (c.members.length === 1) {
          const isSelected = (c.members[0].properties || {}).id === selectedId;
          const marker = buildSoloMarker(c.members[0], showLabel, isSelected);
          marker.addTo(map);
          markersRef.current.push(marker);
        } else {
          const marker = buildClusterMarker(c.members, map);
          marker.addTo(map);
          markersRef.current.push(marker);
        }
      }
    }

    function buildSoloMarker(f: PoiFeature, showLabel: boolean, isSelected: boolean): maplibregl.Marker {
      const props: any = f.properties || {};
      const category: string = props.category || "";
      const color = colorForCategory(category);
      const glyph = glyphForCategory(category);
      const name = props.name_english || props.name_latin || "";
      const [lng, lat] = f.geometry.coordinates as [number, number];

      // Selected pin: ~1.35x scale + a white/color ring around the head, mirroring how Google
      // Maps distinguishes the open place from the rest of the pins on screen. Growing the pin
      // via its width/height attrs (not a CSS transform) keeps the existing translateY nudge and
      // anchor:"top" math untouched — the box just gets taller, same as the unselected case.
      const scale = isSelected ? 1.35 : 1;
      const w = Math.round(22 * scale);
      const h = Math.round(30 * scale);
      const glyphSize = Math.round(12 * scale);
      const glyphOffset = Math.round(5 * scale);
      const ring = isSelected
        ? `<circle cx="11" cy="11" r="10" fill="none" stroke="#fff" stroke-width="2.5"/>
           <circle cx="11" cy="11" r="10" fill="none" stroke="${color}" stroke-width="1.25"/>`
        : "";

      const el = document.createElement("div");
      el.className = isSelected ? "rm-poi-marker rm-poi-marker--selected" : "rm-poi-marker";
      el.style.cssText = `cursor:pointer;display:flex;flex-direction:column;align-items:center;transform:translateY(${-6 * scale}px);z-index:${isSelected ? 5 : 1};`;

      const labelHtml = showLabel && name
        ? `<div style="margin-top:2px;padding:1px 6px;background:rgba(255,255,255,.92);border-radius:4px;font:600 11px/1.2 var(--font-cinzel),Georgia,serif;letter-spacing:0.02em;color:#202124;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,.15);max-width:160px;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(name)}</div>`
        : "";

      el.innerHTML = `
        <div style="width:${w}px;height:${h}px;position:relative;filter:drop-shadow(0 1px 3px rgba(0,0,0,.4));">
          <svg viewBox="0 0 22 30" width="${w}" height="${h}" style="position:absolute;inset:0;">
            <path fill="${color}" d="M11 0a11 11 0 0 1 11 11c0 8-11 19-11 19S0 19 0 11A11 11 0 0 1 11 0z"/>
            <circle cx="11" cy="11" r="7.5" fill="rgba(255,255,255,.15)"/>
            ${ring}
          </svg>
          <svg viewBox="0 0 24 24" width="${glyphSize}" height="${glyphSize}" style="position:absolute;left:${glyphOffset}px;top:${glyphOffset}px;" fill="#fff">
            <path d="${glyph}"/>
          </svg>
        </div>
        ${labelHtml}
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        selectPoi(props, [lng, lat]);
      });

      return new maplibregl.Marker({ element: el, anchor: "top" }).setLngLat([lng, lat]);
    }

    function buildClusterMarker(members: PoiFeature[], map: maplibregl.Map): maplibregl.Marker {
      // Centroid of members' coords — the pin lands between the buildings, not on any one.
      let sx = 0, sy = 0;
      for (const m of members) {
        const [lng, lat] = m.geometry.coordinates as [number, number];
        sx += lng; sy += lat;
      }
      const cLng = sx / members.length;
      const cLat = sy / members.length;

      // Cluster color = category color of the plurality category in this cluster.
      const catCount = new Map<string, number>();
      for (const m of members) {
        const c = (m.properties || {}).category || "";
        catCount.set(c, (catCount.get(c) || 0) + 1);
      }
      let topCat = "";
      let topN = 0;
      for (const [k, v] of catCount) if (v > topN) { topN = v; topCat = k; }
      const color = colorForCategory(topCat);

      const el = document.createElement("div");
      el.style.cssText = "cursor:pointer;display:flex;align-items:center;justify-content:center;transform:translate(-50%,-50%);";
      el.innerHTML = `
        <div style="width:32px;height:32px;border-radius:999px;background:${color};color:#fff;display:grid;place-items:center;font:600 13px/1 Roboto,sans-serif;box-shadow:0 1px 2px rgba(0,0,0,.35);border:2px solid #fff;">
          ${members.length}
        </div>
      `;
      el.title = `${members.length} places — click to zoom`;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        // Fit bounds of members, capped so we always zoom in at least one level.
        const lngs = members.map((m) => (m.geometry.coordinates as [number, number])[0]);
        const lats = members.map((m) => (m.geometry.coordinates as [number, number])[1]);
        const west = Math.min(...lngs), east = Math.max(...lngs);
        const south = Math.min(...lats), north = Math.max(...lats);
        // Give a hair of padding for degenerate (all-at-one-point) clusters so fitBounds still zooms.
        const pad = 0.001;
        map.fitBounds(
          [[west - pad, south - pad], [east + pad, north + pad]],
          { padding: 80, duration: 700, maxZoom: 17 },
        );
      });

      return new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([cLng, cLat]);
    }

    async function attach() {
      const map = (window as any).__map as maplibregl.Map | undefined;
      if (!map) {
        setTimeout(attach, 300);
        return;
      }
      // Wait for the base style (land polygon in particular) to finish first-paint before we
      // start dropping HTML markers on top — otherwise on slow mobile the user briefly sees
      // pins floating on the ocean blue background while land is still loading.
      if (!map.loaded()) {
        await new Promise<void>((resolve) => {
          const onLoad = () => { map.off("load", onLoad); resolve(); };
          map.on("load", onLoad);
        });
        if (cancelled) return;
      }
      const feats = await ensureFeatures();
      if (cancelled) return;

      mapRef = map;
      // Layers-panel "Landmarks" toggle: when off, unmount markers and skip render/zoom-end wiring.
      if (!visible) {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        return;
      }
      rerenderRef.current = () => render(map, feats);
      render(map, feats);

      onZoomEnd = () => {
        if (!mapRef || cancelled || !featuresRef.current) return;
        render(mapRef, featuresRef.current);
      };
      map.on("zoomend", onZoomEnd);
    }

    attach();
    return () => {
      cancelled = true;
      rerenderRef.current = null;
      if (mapRef && onZoomEnd) mapRef.off("zoomend", onZoomEnd);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
    // Deliberately NOT dependent on `selectedId` — this effect fetches data, waits on the map's
    // one-time 'load' event when it isn't ready yet, and rebuilds the zoomend listener. `'load'`
    // only ever fires once per map instance, so re-running this whole effect on every place
    // selection would await an event that will never come a second time and silently strand
    // every marker at zero. Selection instead goes through the lightweight effect below, which
    // just re-runs the already-built `render()` closure via `rerenderRef`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, hiddenCategories, visible]);

  // Selecting/deselecting a place only changes which pin is enlarged+ringed — redraw without
  // touching the fetch/load-wait pipeline above.
  useEffect(() => {
    rerenderRef.current?.();
  }, [selectedId]);

  return null;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c],
  );
}

export { CATEGORY_GROUPS };

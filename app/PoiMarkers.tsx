"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { CATEGORY_GROUPS, colorForCategory, glyphForCategory, groupIdForCategory } from "./poiCategories";
import { useCategoryFilters } from "./CategoryChips";
import { selectPoi } from "./usePoiPanel";

type PoiFeature = GeoJSON.Feature<GeoJSON.Point, Record<string, any>>;

/** Renders POIs as Google-Maps-style pill markers (colored circle w/ glyph) via HTML markers.
 * Category chip filter (top row) toggles which categories are visible. */
export default function PoiMarkers() {
  const filters = useCategoryFilters();
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const featuresRef = useRef<PoiFeature[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function ensureFeatures() {
      if (featuresRef.current) return featuresRef.current;
      const res = await fetch("/data/pois.geojson");
      const fc: GeoJSON.FeatureCollection<GeoJSON.Point, Record<string, any>> = await res.json();
      const feats = (fc.features || []).filter((f) => {
        const p: any = f.properties || {};
        return p.extant_117ce === true && f.geometry?.type === "Point";
      });
      featuresRef.current = feats;
      return feats;
    }

    async function attach() {
      const map = (window as any).__map as maplibregl.Map | undefined;
      if (!map) {
        setTimeout(attach, 300);
        return;
      }
      const feats = await ensureFeatures();
      if (cancelled) return;

      // Clear existing
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const activeGroups = Object.keys(filters).filter((k) => filters[k]);
      const anyActive = activeGroups.length > 0;

      for (const f of feats) {
        const props: any = f.properties || {};
        const category: string = props.category || "";
        const groupId = groupIdForCategory(category);
        if (anyActive && !activeGroups.includes(groupId)) continue;

        const color = colorForCategory(category);
        const glyph = glyphForCategory(category);
        const name = props.name_english || props.name_latin || "";
        const [lng, lat] = f.geometry.coordinates as [number, number];

        const el = document.createElement("div");
        el.className = "rm-poi-marker";
        el.style.cssText = "cursor:pointer;display:flex;flex-direction:column;align-items:center;transform:translateY(-6px);";

        el.innerHTML = `
          <div style="width:22px;height:30px;position:relative;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35));">
            <svg viewBox="0 0 22 30" width="22" height="30" style="position:absolute;inset:0;">
              <path fill="${color}" d="M11 0a11 11 0 0 1 11 11c0 8-11 19-11 19S0 19 0 11A11 11 0 0 1 11 0z"/>
              <circle cx="11" cy="11" r="7.5" fill="rgba(255,255,255,.15)"/>
            </svg>
            <svg viewBox="0 0 24 24" width="12" height="12" style="position:absolute;left:5px;top:5px;" fill="#fff">
              <path d="${glyph}"/>
            </svg>
          </div>
          <div style="margin-top:2px;padding:1px 6px;background:rgba(255,255,255,.92);border-radius:4px;font:500 11px/1.2 Roboto,sans-serif;color:#202124;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,.15);max-width:160px;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(name)}</div>
        `;

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          selectPoi(props, [lng, lat]);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: "top" })
          .setLngLat([lng, lat])
          .addTo(map);
        markersRef.current.push(marker);
      }
    }

    attach();
    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [filters]);

  return null;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c],
  );
}

export { CATEGORY_GROUPS };

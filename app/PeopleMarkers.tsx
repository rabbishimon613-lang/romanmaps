"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useLayers } from "./useLayers";

type PersonFeature = GeoJSON.Feature<GeoJSON.Point, Record<string, any>>;

const ROLE_RING: Record<string, string> = {
  imperial: "#8859a6",
  military: "#a1442e",
  writer: "#2a7fb5",
  religious: "#a08a2e",
};
const DEFAULT_RING = "var(--icon)";

/** People alive (or just died) in 117 CE, pinned at their known location — portrait-medallion
 * markers with a colored ring by role (purple=imperial, red=military, blue=writer/philosopher,
 * gold=religious). Click opens a small self-contained popup (not the full PlaceDetails panel,
 * whose schema is POI-shaped, not person-shaped). Shares the "117 CE — people & events" Layers
 * toggle with the native event-polygon/point map layers in app/Map.tsx. */
export default function PeopleMarkers() {
  const layers = useLayers();
  const visible = layers["living-empire"];
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const featuresRef = useRef<PersonFeature[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function ensureFeatures() {
      if (featuresRef.current) return featuresRef.current;
      const res = await fetch("/data/people_117.geojson");
      if (!res.ok) {
        featuresRef.current = [];
        return [];
      }
      const fc: GeoJSON.FeatureCollection<GeoJSON.Point, Record<string, any>> = await res.json();
      featuresRef.current = (fc.features || []).filter((f) => f.geometry?.type === "Point");
      return featuresRef.current;
    }

    async function attach() {
      const map = (window as any).__map as maplibregl.Map | undefined;
      if (!map) {
        if (!cancelled) setTimeout(attach, 300);
        return;
      }
      const feats = await ensureFeatures();
      if (cancelled) return;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (!visible) return;

      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 18 });

      for (const f of feats) {
        const props: any = f.properties || {};
        const ring = ROLE_RING[props.role_group] || DEFAULT_RING;
        const [lng, lat] = f.geometry.coordinates as [number, number];

        // Outer `el` is what MapLibre positions (it rewrites `el.style.transform` on every
        // pan/zoom), so the hover "grow" lives on an inner `.rm-person-medallion` wrapper instead
        // — same split used for the POI pins above, for the same reason.
        const el = document.createElement("div");
        el.style.cssText = "cursor:pointer;";
        const medallion = document.createElement("div");
        medallion.className = "rm-person-medallion";
        medallion.style.cssText =
          "width:22px;height:22px;border-radius:999px;background:#fff;border:3px solid " +
          ring +
          ";box-shadow:var(--shadow-1);display:flex;align-items:center;justify-content:center;font:600 10px Roboto,sans-serif;color:" +
          ring +
          ";transition:transform 120ms ease;";
        medallion.textContent = (props.name || "?").slice(0, 1).toUpperCase();
        el.appendChild(medallion);
        el.title = props.name || "";
        el.addEventListener("mouseenter", () => { medallion.style.transform = "scale(1.12)"; });
        el.addEventListener("mouseleave", () => { medallion.style.transform = "scale(1)"; });

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const sourcesLine =
            Array.isArray(props.sources) && props.sources.length
              ? `<div style="color:var(--text-2); font-size:11px; margin-top:6px;">${props.sources.map(escapeHtml).join(" · ")}</div>`
              : "";
          popup
            .setLngLat([lng, lat])
            .setHTML(
              `<div style="font: 13px Roboto, sans-serif; color: var(--text); max-width: 240px;">
                 <div style="font-weight: 600;">${escapeHtml(props.name || "")}</div>
                 <div style="color:var(--text-2); font-size:11px; margin-top:2px;">${escapeHtml(props.role || "")} · ${escapeHtml(props.location_117 || "")}</div>
                 <div style="margin-top:6px;">${escapeHtml(props.one_line || "")}</div>
                 ${sourcesLine}
               </div>`,
            )
            .addTo(map);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([lng, lat]).addTo(map);
        markersRef.current.push(marker);
      }
    }

    attach();
    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return null;
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c],
  );
}

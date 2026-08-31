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
  ordinary: "#3d7a4e",
};
const DEFAULT_RING = "#5f6368";

/** People alive (or just died) in 117 CE, pinned at their known location — portrait-medallion
 * markers with a colored ring by role (purple=imperial, red=military, blue=writer/philosopher,
 * gold=religious, green=ordinary). Click opens a small self-contained popup (not the full PlaceDetails panel,
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
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (!visible) return;

      // Only fetch people_117.geojson once the group is actually on — previously this ran
      // unconditionally before the visibility check above, so every page load downloaded the
      // file even with "117 CE — people & events" off.
      const feats = await ensureFeatures();
      if (cancelled) return;

      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 18 });

      for (const f of feats) {
        const props: any = f.properties || {};
        const ring = ROLE_RING[props.role_group] || DEFAULT_RING;
        const [lng, lat] = f.geometry.coordinates as [number, number];

        const el = document.createElement("div");
        el.style.cssText =
          "width:22px;height:22px;border-radius:999px;background:#fff;border:3px solid " +
          ring +
          ";box-shadow:0 1px 3px rgba(0,0,0,.4);cursor:pointer;display:flex;align-items:center;justify-content:center;font:600 10px Roboto,sans-serif;color:" +
          ring +
          ";";
        el.textContent = (props.name || "?").slice(0, 1).toUpperCase();
        el.title = props.name || "";

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const sourcesLine =
            Array.isArray(props.sources) && props.sources.length
              ? `<div style="color:#5f6368; font-size:11px; margin-top:6px;">${props.sources.map(escapeHtml).join(" · ")}</div>`
              : "";
          // Several of these people are documented by a tablet or papyrus dated a few years
          // either side of 117 rather than on the day itself. Showing the evidence date lets the
          // bio state plain facts instead of hedging its way through every sentence.
          const attestedLine = props.attested
            ? `<div style="color:#5f6368; font-size:11px; margin-top:6px; font-style:italic;">Known from: ${escapeHtml(props.attested)}</div>`
            : "";
          popup
            .setLngLat([lng, lat])
            .setHTML(
              `<div style="font: 13px Roboto, sans-serif; color: #202124; max-width: 240px;">
                 ${popupImageHtml(props)}
                 <div style="font-weight: 600;">${escapeHtml(props.name || "")}</div>
                 <div style="color:#5f6368; font-size:11px; margin-top:2px;">${escapeHtml(props.role || "")} · ${escapeHtml(props.location_117 || "")}</div>
                 <div style="margin-top:6px;">${escapeHtml(props.one_line || "")}</div>
                 ${attestedLine}
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

/** Same graceful-degrading thumbnail treatment as app/Map.tsx's thematic-layer popups — see that
 * file's popupImageHtml for the full rationale (people_117.geojson's image_url research has been
 * accumulating for many shifts with nothing on the live site ever rendering it). */
function popupImageHtml(p: any): string {
  if (!p || !p.image_url) return "";
  const credit = p.image_credit
    ? `<div style="color:#5f6368; font-size:9px; margin-top:2px;">${escapeHtml(p.image_credit)}</div>`
    : "";
  return `<div style="margin-bottom:6px;">
             <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.image_alt || p.name || "")}"
                  style="width:100%; max-height:110px; object-fit:cover; border-radius:4px; display:block;"
                  onerror="this.closest('div').style.display='none';" />
             ${credit}
           </div>`;
}

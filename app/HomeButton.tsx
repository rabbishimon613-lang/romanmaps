"use client";

import type { Map as MLMap } from "maplibre-gl";
import { useIsMobile } from "./useIsMobile";
import { usePoiPanel } from "./usePoiPanel";

const HOME_CENTER: [number, number] = [12.4964, 41.9028];
const HOME_ZOOM = 4.2;

/** Google-Earth-style "home" button — flies back to the empire-scale opening view. Sits at the
 * top of the bottom-right FAB stack: Home → Layers → Ruler → Zoom. */
export default function HomeButton() {
  const isMobile = useIsMobile();
  const poiOpen = !!usePoiPanel();
  if (isMobile && poiOpen) return null;

  const goHome = () => {
    const map = (window as any).__map as MLMap | undefined;
    if (map) map.flyTo({ center: HOME_CENTER, zoom: HOME_ZOOM, duration: 900 });
  };

  return (
    <button
      title="Reset view"
      aria-label="Reset view to the whole empire"
      onClick={goHome}
      style={{
        position: "absolute",
        right: 12,
        // On phones this is the ONE floating action button in the corner — the slot Google Maps
        // gives to "recenter" — so it sits low, round and a size a thumb can actually hit.
        bottom: isMobile ? "calc(24px + env(safe-area-inset-bottom))" : 265,
        width: isMobile ? 48 : 40,
        height: isMobile ? 48 : 40,
        borderRadius: isMobile ? 999 : 8,
        background: "var(--surface)",
        boxShadow: isMobile ? "var(--shadow-2)" : "var(--shadow-1)",
        display: "grid",
        placeItems: "center",
        zIndex: 5,
      }}
    >
      <svg width={isMobile ? 24 : 20} height={isMobile ? 24 : 20} viewBox="0 0 24 24" fill="var(--icon)">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    </button>
  );
}

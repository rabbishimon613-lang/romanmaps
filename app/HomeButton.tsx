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
        bottom: 265,
        width: 40,
        height: 40,
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        display: "grid",
        placeItems: "center",
        zIndex: 5,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    </button>
  );
}

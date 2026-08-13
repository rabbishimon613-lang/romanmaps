"use client";

import { useEffect, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { useIsMobile } from "./useIsMobile";
import { usePoiPanel } from "./usePoiPanel";

/** Google-Maps-style compass: hidden while the map points north, appears the moment the user
 * rotates it (right-click-drag or two-finger twist on touch — both are MapLibre's own default
 * `dragRotate`/`touchZoomRotate` handlers, untouched here), rotates its needle to match the
 * map's current bearing, and resets north on click. Sits in the same bottom-right FAB stack as
 * ZoomControl/Ruler/Legend/Layers, above all of them since it's the newest addition. */
export default function Compass() {
  const [bearing, setBearing] = useState(0);
  const isMobile = useIsMobile();
  const poiOpen = !!usePoiPanel();

  useEffect(() => {
    let map: MLMap | undefined;
    let cancelled = false;
    let poll: number | undefined;

    const onRotate = () => {
      if (map) setBearing(map.getBearing());
    };

    const attach = () => {
      map = (window as any).__map as MLMap | undefined;
      if (!map) return false;
      setBearing(map.getBearing());
      map.on("rotate", onRotate);
      return true;
    };

    if (!attach()) {
      poll = window.setInterval(() => {
        if (cancelled) return;
        if (attach() && poll) window.clearInterval(poll);
      }, 150);
    }

    return () => {
      cancelled = true;
      if (poll) window.clearInterval(poll);
      map?.off("rotate", onRotate);
    };
  }, []);

  const resetNorth = () => {
    const map = (window as any).__map as MLMap | undefined;
    if (map) map.easeTo({ bearing: 0, duration: 300 });
  };

  // Hidden while the mobile Place details bottom sheet covers this corner — same pattern as
  // ZoomControl/Ruler/Legend/the Layers button.
  if (isMobile && poiOpen) return null;
  // North already up — nothing to reset, stay out of the way like real Google Maps.
  if (Math.abs(bearing) < 0.5) return null;

  return (
    <button
      title="Reset north"
      aria-label="Reset north"
      onClick={resetNorth}
      style={{
        position: "absolute",
        right: 12,
        bottom: 268,
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        style={{ transform: `rotate(${-bearing}deg)`, transition: "transform 80ms linear" }}
      >
        <path d="M12 2 8.5 12 12 22l3.5-10L12 2z" fill="#ea4335" />
        <path d="M12 2 8.5 12 12 11.4V2z" fill="#c5221f" />
      </svg>
    </button>
  );
}

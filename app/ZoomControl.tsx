"use client";

import { useEffect, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";

const MIN_ZOOM = 2.5;
const MAX_ZOOM = 10;

/** Google-Maps-style stacked +/- zoom buttons, bottom-right. Replaces MapLibre's default
 * NavigationControl, whose slot is CSS-hidden in favor of our own attribution text there. */
export default function ZoomControl() {
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    let map: MLMap | undefined;
    let cancelled = false;
    let poll: number | undefined;

    const onZoom = () => {
      if (map) setZoom(map.getZoom());
    };

    const attach = () => {
      map = (window as any).__map as MLMap | undefined;
      if (!map) return false;
      setZoom(map.getZoom());
      map.on("zoom", onZoom);
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
      map?.off("zoom", onZoom);
    };
  }, []);

  const zoomBy = (delta: number) => {
    const map = (window as any).__map as MLMap | undefined;
    if (map) map.zoomTo(map.getZoom() + delta, { duration: 200 });
  };

  const atMin = zoom !== null && zoom <= MIN_ZOOM + 0.01;
  const atMax = zoom !== null && zoom >= MAX_ZOOM - 0.01;

  return (
    <div
      style={{
        position: "absolute",
        right: 12,
        bottom: 12,
        width: 40,
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 3px 8px rgba(0,0,0,.15)",
        overflow: "hidden",
        zIndex: 5,
      }}
    >
      <button
        title="Zoom in"
        aria-label="Zoom in"
        onClick={() => zoomBy(1)}
        disabled={atMax}
        style={{
          width: 40,
          height: 40,
          display: "grid",
          placeItems: "center",
          opacity: atMax ? 0.35 : 1,
          cursor: atMax ? "default" : "pointer",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3c4043" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div style={{ height: 1, background: "#e0e0e0" }} />
      <button
        title="Zoom out"
        aria-label="Zoom out"
        onClick={() => zoomBy(-1)}
        disabled={atMin}
        style={{
          width: 40,
          height: 40,
          display: "grid",
          placeItems: "center",
          opacity: atMin ? 0.35 : 1,
          cursor: atMin ? "default" : "pointer",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3c4043" strokeWidth="2.2" strokeLinecap="round">
          <path d="M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

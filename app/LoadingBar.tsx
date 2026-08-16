"use client";

import { useEffect, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";

/** Thin indeterminate top-line progress bar shown whenever MapLibre is loading tiles or data.
 * Google-Maps-style — a very quiet, thin bar you barely notice unless work is actually happening. */
export default function LoadingBar() {
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let map: MLMap | undefined;
    let poll: number | undefined;
    let cancelled = false;

    const onData = () => {
      if (!map || cancelled) return;
      setBusy(!map.areTilesLoaded() || map.isMoving() || !map.loaded());
    };
    const onIdle = () => {
      if (!map || cancelled) return;
      setBusy(false);
    };
    const onDataLoading = () => {
      if (cancelled) return;
      setBusy(true);
    };

    const attach = () => {
      map = (window as any).__map as MLMap | undefined;
      if (!map) return false;
      map.on("dataloading", onDataLoading);
      map.on("data", onData);
      map.on("idle", onIdle);
      setBusy(!map.loaded());
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
      map?.off("dataloading", onDataLoading);
      map?.off("data", onData);
      map?.off("idle", onIdle);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 20,
        opacity: busy ? 1 : 0,
        transition: "opacity 300ms ease",
      }}
    >
      <div
        style={{
          width: "40%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
          animation: "rm-loading-bar 1.2s linear infinite",
        }}
      />
      <style>{`
        @keyframes rm-loading-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}

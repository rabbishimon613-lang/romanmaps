"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { Map as MLMap, MapMouseEvent } from "maplibre-gl";
import { loadPlaces, type Place } from "./places";
import { activateRuler, useRulerState } from "./useRuler";

type MenuPoint = { x: number; y: number; lng: number; lat: number };

const EARTH_RADIUS_KM = 6371.0088;

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(s)));
}

function nearestPlace(places: Place[], lng: number, lat: number): { place: Place; km: number } | null {
  let best: { place: Place; km: number } | null = null;
  for (const p of places) {
    const km = haversineKm([lng, lat], [p.lng, p.lat]);
    if (!best || km < best.km) best = { place: p, km };
  }
  return best;
}

/** Google-Maps-style right-click context menu: "What's here?" (drops a temporary pin with the
 * coordinates + nearest known Roman place), "Directions from/to here" (honestly disabled —
 * Directions itself hasn't shipped), "Measure distance" (hands off to the shared ruler store). */
export default function ContextMenu() {
  const [menu, setMenu] = useState<MenuPoint | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rulerActive = useRulerState().active;
  const rulerActiveRef = useRef(rulerActive);
  rulerActiveRef.current = rulerActive;
  const infoMarkerRef = useRef<maplibregl.Marker | null>(null);
  const infoPopupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: MLMap | undefined;

    function onContextMenu(e: MapMouseEvent) {
      e.preventDefault();
      // While the ruler is mid-measurement, right-click is its own "finish measuring" gesture
      // (see app/Ruler.tsx) — don't stack our menu on top of that.
      if (rulerActiveRef.current) return;
      setMenu({ x: e.point.x, y: e.point.y, lng: e.lngLat.lng, lat: e.lngLat.lat });
    }
    function onMoveStart() {
      setMenu(null);
    }

    // Touch devices have no right-click — a long-press on the map is the mobile equivalent,
    // same gesture Google Maps mobile uses for "What's here?".
    const LONG_PRESS_MS = 550;
    const MOVE_CANCEL_PX = 10;
    let touchTimer: ReturnType<typeof setTimeout> | null = null;
    let touchStart: { x: number; y: number } | null = null;

    function clearTouchTimer() {
      if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
      }
      touchStart = null;
    }
    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1 || !map) return;
      const t = e.touches[0];
      const rect = map.getCanvasContainer().getBoundingClientRect();
      const point = { x: t.clientX - rect.left, y: t.clientY - rect.top };
      touchStart = point;
      touchTimer = setTimeout(() => {
        if (!map || rulerActiveRef.current) return;
        const lngLat = map.unproject([point.x, point.y]);
        setMenu({ x: point.x, y: point.y, lng: lngLat.lng, lat: lngLat.lat });
      }, LONG_PRESS_MS);
    }
    function onTouchMove(e: TouchEvent) {
      if (!touchStart || e.touches.length !== 1 || !map) return;
      const t = e.touches[0];
      const rect = map.getCanvasContainer().getBoundingClientRect();
      const dx = t.clientX - rect.left - touchStart.x;
      const dy = t.clientY - rect.top - touchStart.y;
      if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) clearTouchTimer();
    }

    function attach() {
      const m = (window as any).__map as MLMap | undefined;
      if (!m) {
        if (!cancelled) setTimeout(attach, 300);
        return;
      }
      map = m;
      map.on("contextmenu", onContextMenu);
      map.on("movestart", onMoveStart);
      map.on("zoomstart", onMoveStart);
      const container = map.getCanvasContainer();
      container.addEventListener("touchstart", onTouchStart, { passive: true });
      container.addEventListener("touchmove", onTouchMove, { passive: true });
      container.addEventListener("touchend", clearTouchTimer, { passive: true });
      container.addEventListener("touchcancel", clearTouchTimer, { passive: true });
    }
    attach();

    return () => {
      cancelled = true;
      clearTouchTimer();
      if (map) {
        map.off("contextmenu", onContextMenu);
        map.off("movestart", onMoveStart);
        map.off("zoomstart", onMoveStart);
        const container = map.getCanvasContainer();
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        container.removeEventListener("touchend", clearTouchTimer);
        container.removeEventListener("touchcancel", clearTouchTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (!menu) return;
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(null);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(null);
    }
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menu]);

  function clearInfoPin() {
    infoMarkerRef.current?.remove();
    infoMarkerRef.current = null;
    infoPopupRef.current?.remove();
    infoPopupRef.current = null;
  }

  async function onWhatsHere(point: MenuPoint) {
    setMenu(null);
    const map = (window as any).__map as MLMap | undefined;
    if (!map) return;
    clearInfoPin();

    const places = await loadPlaces();
    const nearest = nearestPlace(places, point.lng, point.lat);
    const nearestLine = nearest
      ? `<div style="color:var(--text-2); font-size:12px; margin-top:4px;">Nearest known place: ${escapeHtml(
          nearest.place.latin || nearest.place.modern || "Unknown",
        )} (${nearest.km < 10 ? nearest.km.toFixed(1) : Math.round(nearest.km)} km away)</div>`
      : "";

    const el = document.createElement("div");
    el.innerHTML = `
      <svg width="27" height="36" viewBox="0 0 27 36" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.4));">
        <path fill="#ea4335" d="M13.5 0C6 0 0 6 0 13.5 0 24 13.5 36 13.5 36S27 24 27 13.5C27 6 21 0 13.5 0z"/>
        <circle cx="13.5" cy="13.5" r="5.5" fill="#fff"/>
      </svg>`;
    el.style.cssText = "transform:translateY(-18px);cursor:default;";
    const marker = new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([point.lng, point.lat]).addTo(map);
    infoMarkerRef.current = marker;

    const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 28 })
      .setLngLat([point.lng, point.lat])
      .setHTML(
        `<div style="font: 13px Roboto, sans-serif; color: var(--text); min-width: 160px;">
           <div style="font-weight: 600;">${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</div>
           ${nearestLine}
         </div>`,
      )
      .addTo(map);
    infoPopupRef.current = popup;
    popup.on("close", () => {
      marker.remove();
      if (infoMarkerRef.current === marker) infoMarkerRef.current = null;
      if (infoPopupRef.current === popup) infoPopupRef.current = null;
    });
  }

  function onMeasureFromHere(point: MenuPoint) {
    setMenu(null);
    activateRuler([point.lng, point.lat]);
  }

  if (!menu) return null;

  // Clamp so the menu never renders off-screen — matters most on narrow mobile viewports where a
  // long-press near the right/bottom edge is common.
  const MENU_WIDTH = 220;
  const MENU_HEIGHT = 168;
  const left = typeof window !== "undefined" ? Math.min(menu.x, window.innerWidth - MENU_WIDTH - 8) : menu.x;
  const top = typeof window !== "undefined" ? Math.min(menu.y, window.innerHeight - MENU_HEIGHT - 8) : menu.y;

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        left,
        top,
        zIndex: 10,
        background: "var(--surface)",
        borderRadius: 8,
        boxShadow: "var(--shadow-2)",
        padding: "6px 0",
        minWidth: 220,
        transform: "translate(-6px, -6px)",
      }}
    >
      <MenuItem label="What's here?" onClick={() => onWhatsHere(menu)} />
      <MenuItem label="Directions from here" disabled title="Coming soon — road routing hasn't shipped yet" />
      <MenuItem label="Directions to here" disabled title="Coming soon — road routing hasn't shipped yet" />
      <MenuItem label="Measure distance" onClick={() => onMeasureFromHere(menu)} />
    </div>
  );
}

function MenuItem({
  label,
  onClick,
  disabled,
  title,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "9px 16px",
        fontSize: 13,
        color: disabled ? "var(--text-3)" : "var(--text-strong)",
        background: "transparent",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c],
  );
}

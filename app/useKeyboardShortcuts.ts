"use client";

import { useEffect } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { activateRuler, deactivateRuler, useRulerState } from "./useRuler";

const PAN_PX = 80;
const ZOOM_STEP = 1;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

/** Google-Maps-style keyboard shortcuts: arrow keys pan, +/- zoom, `/` focuses the search box,
 * `M` toggles the ruler, `L` toggles the Layers panel. Ignored while typing in a text field
 * (Escape/Enter/arrow-key text-cursor movement stay untouched) and while a modifier key is held,
 * so browser/OS shortcuts and the search box's own arrow-key suggestion nav keep working. `/` is
 * the one exception — it's meant to jump focus into the search box from anywhere else on the page. */
export function useKeyboardShortcuts(opts: { focusSearch: () => void; toggleLayersPanel: () => void }) {
  const ruler = useRulerState();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const typing = isTypingTarget(e.target);

      if (e.key === "/") {
        if (typing) return;
        e.preventDefault();
        opts.focusSearch();
        return;
      }
      if (typing) return;

      const map = (window as any).__map as MLMap | undefined;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          map?.panBy([0, -PAN_PX], { duration: 200 });
          break;
        case "ArrowDown":
          e.preventDefault();
          map?.panBy([0, PAN_PX], { duration: 200 });
          break;
        case "ArrowLeft":
          e.preventDefault();
          map?.panBy([-PAN_PX, 0], { duration: 200 });
          break;
        case "ArrowRight":
          e.preventDefault();
          map?.panBy([PAN_PX, 0], { duration: 200 });
          break;
        case "+":
        case "=":
          e.preventDefault();
          if (map) map.zoomTo(map.getZoom() + ZOOM_STEP, { duration: 200 });
          break;
        case "-":
        case "_":
          e.preventDefault();
          if (map) map.zoomTo(map.getZoom() - ZOOM_STEP, { duration: 200 });
          break;
        case "m":
        case "M":
          e.preventDefault();
          if (ruler.active) deactivateRuler();
          else activateRuler();
          break;
        case "l":
        case "L":
          e.preventDefault();
          opts.toggleLayersPanel();
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [opts, ruler.active]);
}

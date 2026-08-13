"use client";

import { useSyncExternalStore } from "react";
import type { Map as MLMap } from "maplibre-gl";

export type LayerGroupId =
  | "roads"
  | "rivers"
  | "provinces"
  | "places"
  | "pois"
  | "road-stations"
  | "living-empire"
  | "trade-routes"
  | "disasters"
  | "health"
  | "mints"
  | "imperial-cult"
  | "politics";

export const LAYER_GROUPS: { id: LayerGroupId; label: string; mapLayerIds: string[] }[] = [
  { id: "roads", label: "Roads", mapLayerIds: ["roads-main", "roads-secondary"] },
  { id: "rivers", label: "Rivers & lakes", mapLayerIds: ["rivers", "lakes"] },
  { id: "provinces", label: "Province borders", mapLayerIds: ["provinces-fill", "provinces-line"] },
  { id: "places", label: "Cities & towns", mapLayerIds: ["places-dot", "places-label-major", "places-label-minor"] },
  { id: "pois", label: "Landmarks", mapLayerIds: ["pois-dot", "pois-label"] },
  { id: "road-stations", label: "Road stations", mapLayerIds: ["road-stations"] },
  // People/event markers are HTML overlays (app/PeopleMarkers.tsx), not native map layers — that
  // component reads this same group's boolean directly via useLayers() to decide whether to
  // render. The native event layers still get their visibility applied the normal way.
  { id: "living-empire", label: "117 CE — people & events", mapLayerIds: ["events-point", "events-polygon-fill", "events-polygon-line"] },
  { id: "trade-routes", label: "Trade routes", mapLayerIds: ["trade-routes-line", "trade-routes-node"] },
  { id: "disasters", label: "Disasters & memory", mapLayerIds: ["disasters-point"] },
  { id: "health", label: "Health & spa culture", mapLayerIds: ["health-point"] },
  { id: "mints", label: "Mints", mapLayerIds: ["mints-point"] },
  { id: "imperial-cult", label: "Imperial cult", mapLayerIds: ["imperial-cult-point"] },
  { id: "politics", label: "Political apparatus", mapLayerIds: ["politics-point"] },
];

type LayerState = Record<LayerGroupId, boolean>;

const STORAGE_KEY = "roman-maps:layers";

function defaults(): LayerState {
  return Object.fromEntries(LAYER_GROUPS.map((g) => [g.id, true])) as LayerState;
}

function readStored(): LayerState {
  const base = defaults();
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

let current: LayerState = defaults();
let hydrated = false;
const listeners = new Set<() => void>();

// Stable reference — useSyncExternalStore warns/loops if getServerSnapshot returns a new object each call.
const SERVER_SNAPSHOT: LayerState = defaults();

function getSnapshot(): LayerState {
  if (!hydrated) {
    current = readStored();
    hydrated = true;
  }
  return current;
}

function getServerSnapshot(): LayerState {
  return SERVER_SNAPSHOT;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function applyGroupToMap(map: MLMap, group: LayerGroupId, visible: boolean) {
  const def = LAYER_GROUPS.find((g) => g.id === group);
  if (!def) return;
  for (const layerId of def.mapLayerIds) {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
    }
  }
}

/** Call once the map has finished adding its layers (e.g. end of Map.tsx's load handler) to apply any persisted hidden groups. */
export function applyAllLayers() {
  const map = (window as any).__map as MLMap | undefined;
  if (!map) return;
  const state = getSnapshot();
  for (const g of LAYER_GROUPS) applyGroupToMap(map, g.id, state[g.id]);
}

export function toggleLayer(group: LayerGroupId) {
  const state = getSnapshot();
  current = { ...state, [group]: !state[group] };
  hydrated = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // ignore quota/private-mode errors
    }
  }
  const map = (window as any).__map as MLMap | undefined;
  if (map) applyGroupToMap(map, group, current[group]);
  listeners.forEach((l) => l());
}

/** Persisted per-layer-group visibility, shared across every component that calls this hook. */
export function useLayers(): LayerState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

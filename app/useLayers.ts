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
  | "politics"
  | "frontier-lines"
  | "aqueduct-lines"
  | "euergetism"
  | "penal"
  | "religions"
  | "sports"
  | "diplomacy"
  | "crafts"
  | "letters"
  | "learning"
  | "landmarks"
  | "neighbors"
  | "languages"
  | "substrate"
  | "conventus"
  | "agriculture"
  | "housing"
  | "cuisine"
  | "death-rituals"
  | "ethnic-pockets";

/** `base: true` marks the five groups that make up the map you see on first load — the
 * equivalent of Google's default basemap. Everything else is a thematic overlay and starts
 * OFF. Twenty-nine overlays all defaulting to on is how the map ended up as a plate of
 * overlapping translucent polygons and a confetti of colored dots; a thematic layer is only
 * readable one or two at a time. */
export const LAYER_GROUPS: { id: LayerGroupId; label: string; mapLayerIds: string[]; base?: boolean }[] = [
  { id: "roads", label: "Roads", mapLayerIds: ["roads-main-casing", "roads-main", "roads-secondary"], base: true },
  { id: "rivers", label: "Rivers & lakes", mapLayerIds: ["rivers", "lakes"], base: true },
  { id: "provinces", label: "Province borders", mapLayerIds: ["provinces-fill", "provinces-line"], base: true },
  { id: "places", label: "Cities & towns", mapLayerIds: ["places-dot", "places-label-major", "places-label-minor"], base: true },
  // No native map layers — app/PoiMarkers.tsx reads this group's visibility directly.
  { id: "pois", label: "Landmarks", mapLayerIds: [], base: true },
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
  { id: "frontier-lines", label: "Frontier lines", mapLayerIds: ["frontier-lines-line"] },
  { id: "aqueduct-lines", label: "Aqueducts (major lines)", mapLayerIds: ["aqueduct-lines-line"] },
  { id: "euergetism", label: "Welfare & benefaction", mapLayerIds: ["euergetism-point"] },
  { id: "penal", label: "Exile & penal geography", mapLayerIds: ["penal-point"] },
  { id: "religions", label: "Religious communities", mapLayerIds: ["religions-point"] },
  { id: "sports", label: "Sports & athletic culture", mapLayerIds: ["sports-point"] },
  { id: "diplomacy", label: "Foreign relations & embassies", mapLayerIds: ["diplomacy-point"] },
  { id: "crafts", label: "Textile & luxury craft", mapLayerIds: ["crafts-point"] },
  { id: "letters", label: "Correspondence networks", mapLayerIds: ["letters-node-point", "letters-route-line"] },
  { id: "learning", label: "Intellectual & educational centers", mapLayerIds: ["learning-point"] },
  { id: "landmarks", label: "Natural landmarks", mapLayerIds: ["landmarks-point"] },
  { id: "neighbors", label: "Client kingdoms & neighbors", mapLayerIds: ["neighbors-point"] },
  { id: "languages", label: "Language belts", mapLayerIds: ["languages-fill", "languages-line"] },
  { id: "substrate", label: "Pre-Roman substrate", mapLayerIds: ["substrate-point"] },
  { id: "conventus", label: "Conventus centers (Asia, Baetica, Tarraconensis)", mapLayerIds: ["conventus-point"] },
  { id: "agriculture", label: "Crop & agriculture zones", mapLayerIds: ["agriculture-fill", "agriculture-line"] },
  { id: "housing", label: "Housing typologies", mapLayerIds: ["housing-fill", "housing-line"] },
  { id: "cuisine", label: "Cuisine regions", mapLayerIds: ["cuisine-fill", "cuisine-line"] },
  { id: "death-rituals", label: "Death ritual regions", mapLayerIds: ["death-rituals-fill", "death-rituals-line"] },
  { id: "ethnic-pockets", label: "Ethnic & cultural pockets", mapLayerIds: ["ethnic-pockets-point"] },
];

type LayerState = Record<LayerGroupId, boolean>;

// v2: the default flipped from "everything on" to "base map only", so the key is bumped —
// anyone carrying a v1 blob would otherwise keep the twenty-nine-overlay version forever.
const STORAGE_KEY = "roman-maps:layers:v2";

function defaults(): LayerState {
  return Object.fromEntries(LAYER_GROUPS.map((g) => [g.id, !!g.base])) as LayerState;
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

/* ---------------------------------------------------------------------------------------------
 * Lazy overlay loading — [11-P0-2].
 *
 * Every thematic group is OFF on first load (invariant 0), yet Map.tsx used to fetch, parse and
 * add all ~27 of their GeoJSON files on every cold load, only to immediately set them to
 * `visibility: none`. Map.tsx now hands each group's "fetch + addSource + addLayer + wire
 * handlers" body to `registerLayerLoader` instead of running it, and the group's data is only
 * pulled the first time something actually needs the layers on the map: the user switching the
 * group on, or a returning visitor whose persisted state already has it on.
 *
 * The same pattern app/PeopleMarkers.tsx already uses for its HTML people markers, applied to
 * the native MapLibre layers.
 * ------------------------------------------------------------------------------------------- */

type LayerLoader = () => Promise<void>;
const loaders = new Map<LayerGroupId, LayerLoader>();
const loadedGroups = new Set<LayerGroupId>();
const inflightLoads = new Map<LayerGroupId, Promise<void>>();

/** Re-apply every group's visibility without triggering any loading. Runs after a loader
 * finishes because a loader adds its layers with MapLibre's default `visibility: visible`, and
 * because one file can back two groups (lines.geojson carries both frontier and aqueduct lines) —
 * so the group that wasn't asked for must be pushed back to hidden. */
function applyVisibilityOnly(map: MLMap) {
  const state = getSnapshot();
  for (const g of LAYER_GROUPS) applyGroupToMap(map, g.id, state[g.id]);
}

/** Load a group's layers onto the map if they aren't there yet. Idempotent and de-duped: a
 * group that has already loaded (or is mid-flight) never fetches twice, so toggling a layer off
 * and back on is free. */
export function ensureLayerLoaded(group: LayerGroupId): Promise<void> {
  if (loadedGroups.has(group)) return Promise.resolve();
  const inflight = inflightLoads.get(group);
  if (inflight) return inflight;
  const loader = loaders.get(group);
  // No loader registered yet — Map.tsx registers them partway through its load chain, so a very
  // early toggle can land here. `registerLayerLoader` re-checks the group's state on arrival and
  // loads it then, which covers that case.
  if (!loader) return Promise.resolve();
  const p = loader()
    .then(() => {
      loadedGroups.add(group);
    })
    .catch(() => {
      // A failed fetch shouldn't wedge the group forever — leaving it out of `loadedGroups`
      // means the next toggle-on retries.
    })
    .finally(() => {
      inflightLoads.delete(group);
      const map = (window as any).__map as MLMap | undefined;
      if (map) applyVisibilityOnly(map);
    });
  inflightLoads.set(group, p);
  return p;
}

/** Map.tsx calls this once per thematic group instead of running that group's phase eagerly. */
export function registerLayerLoader(group: LayerGroupId, loader: LayerLoader) {
  loaders.set(group, loader);
  // The group may already be switched on — persisted from a previous session, or toggled by the
  // user while the base map was still loading. Either way it needs its data now.
  if (getSnapshot()[group]) void ensureLayerLoaded(group);
}

/** Drop every registration. Called by Map.tsx when it (re)creates the map, so a remount doesn't
 * inherit loaders pointing at a destroyed map or "already loaded" flags for layers that no
 * longer exist. */
export function resetLayerLoaders() {
  loaders.clear();
  loadedGroups.clear();
  inflightLoads.clear();
}

/** Call once the map has finished adding its layers (e.g. end of Map.tsx's load handler) to
 * apply any persisted hidden groups — and to lazily load any persisted-ON thematic group whose
 * layers aren't on the map yet. */
export function applyAllLayers() {
  const map = (window as any).__map as MLMap | undefined;
  if (!map) return;
  const state = getSnapshot();
  for (const g of LAYER_GROUPS) {
    if (state[g.id]) void ensureLayerLoaded(g.id);
    applyGroupToMap(map, g.id, state[g.id]);
  }
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
  // Switching a thematic group on for the first time is what pulls its data down.
  if (current[group]) void ensureLayerLoaded(group);
  listeners.forEach((l) => l());
}

/** Turn every non-base overlay back off in one go — the escape hatch when someone has switched
 * on a dozen thematic layers and wants the plain map back. */
export function clearOverlays() {
  const state = getSnapshot();
  const next = { ...state };
  for (const g of LAYER_GROUPS) if (!g.base) next[g.id] = false;
  current = next;
  hydrated = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // ignore quota/private-mode errors
    }
  }
  const map = (window as any).__map as MLMap | undefined;
  if (map) for (const g of LAYER_GROUPS) if (!g.base) applyGroupToMap(map, g.id, false);
  listeners.forEach((l) => l());
}

/** How many thematic overlays are currently on — drives the badge on the Layers button. */
export function countActiveOverlays(state: LayerState): number {
  return LAYER_GROUPS.filter((g) => !g.base && state[g.id]).length;
}

/** Persisted per-layer-group visibility, shared across every component that calls this hook. */
export function useLayers(): LayerState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

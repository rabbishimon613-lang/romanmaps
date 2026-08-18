#!/usr/bin/env node
// Builds a routable graph from the two Itiner-e road-network files (public/data/roads_main.geojson
// + roads_secondary.geojson) for the "Directions" feature ([07-P1-1] travel-time / FEATURE_BACKLOG's
// "Directions" P0 item) — road-only routing, MVP scope per that item's own note.
//
// The network is ~14.6k LineString segments. Their endpoints already coincide almost everywhere
// once rounded to 4 decimal degrees (~11m) — a quick check found 9,477 of 10,214 unique rounded
// endpoints shared by more than one segment — so this script treats each segment as one edge
// between two endpoint-nodes (dedupe by rounded coordinate) rather than attempting a full
// vertex-level graph. That's a real simplification: a road that crosses another mid-segment
// without a shared endpoint in the source data won't get an intersection node here. Good enough
// for point-to-point routing between named places, which is what the feature needs.
//
// Output (public/data/route_graph.json) is self-contained — nodes as [lng,lat] pairs, edges with
// their own full coordinate arrays for rendering the chosen path — so the client doesn't need to
// cross-reference roads_main/roads_secondary.geojson at query time (those stay the map's own
// display layers, untouched).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "public", "data");
const ROUND = 4; // decimal degrees for node dedup, ~11m at the equator

function key(lng, lat) {
  return `${lng.toFixed(ROUND)},${lat.toFixed(ROUND)}`;
}

const EARTH_RADIUS_KM = 6371.0088;
function haversineKm(aLng, aLat, bLng, bLat) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(s)));
}

function lineLengthKm(coords) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineKm(coords[i - 1][0], coords[i - 1][1], coords[i][0], coords[i][1]);
  }
  return total;
}

const nodeIndex = new Map(); // key -> node index
const nodes = []; // [lng,lat]
const edges = []; // { a, b, distKm, coords }

function nodeFor(lng, lat) {
  const k = key(lng, lat);
  let idx = nodeIndex.get(k);
  if (idx === undefined) {
    idx = nodes.length;
    nodes.push([lng, lat]);
    nodeIndex.set(k, idx);
  }
  return idx;
}

let skippedDegenerate = 0;
for (const file of ["roads_main.geojson", "roads_secondary.geojson"]) {
  const fc = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
  for (const feat of fc.features) {
    const geom = feat.geometry;
    if (!geom || geom.type !== "LineString" || !Array.isArray(geom.coordinates) || geom.coordinates.length < 2) {
      skippedDegenerate++;
      continue;
    }
    const coords = geom.coordinates;
    const [lng0, lat0] = coords[0];
    const [lng1, lat1] = coords[coords.length - 1];
    const a = nodeFor(lng0, lat0);
    const b = nodeFor(lng1, lat1);
    if (a === b) {
      skippedDegenerate++;
      continue; // a loop back to its own start isn't a useful routing edge
    }
    const distKm = lineLengthKm(coords);
    if (!(distKm > 0)) {
      skippedDegenerate++;
      continue;
    }
    edges.push({ a, b, distKm, coords, name: feat.properties?.Name || undefined });
  }
}

// Connectivity sanity check via union-find, logged (not enforced) — a road-only network over a
// pre-modern empire genuinely has disconnected components across sea gaps (Britain, Sardinia,
// Crete, ...), so a single giant component isn't expected, just worth knowing the shape of.
const parent = Array.from({ length: nodes.length }, (_, i) => i);
function find(x) {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]];
    x = parent[x];
  }
  return x;
}
function union(x, y) {
  const rx = find(x), ry = find(y);
  if (rx !== ry) parent[rx] = ry;
}
for (const e of edges) union(e.a, e.b);
const compSize = new Map();
for (let i = 0; i < nodes.length; i++) {
  const r = find(i);
  compSize.set(r, (compSize.get(r) || 0) + 1);
}
const sizes = [...compSize.values()].sort((a, b) => b - a);

writeFileSync(
  join(DATA_DIR, "route_graph.json"),
  JSON.stringify({ nodes, edges }),
);

console.log(`route_graph.json: ${nodes.length} nodes, ${edges.length} edges (${skippedDegenerate} degenerate segments skipped)`);
console.log(`Connected components: ${compSize.size}. Largest 5 by node count: ${sizes.slice(0, 5).join(", ")}`);

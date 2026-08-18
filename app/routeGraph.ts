"use client";

/** The road-network routing graph built by scripts/build-route-graph.mjs from Itiner-e's
 * roads_main.geojson + roads_secondary.geojson — [07-P1-1] travel-time / FEATURE_BACKLOG's
 * "Directions" item. Road-only, MVP scope per that item's own note: no sea legs, so a query
 * across a strait (mainland Italy to Britain, say) correctly finds no route rather than faking
 * one. Lazy-loaded (~6MB) only when Directions is actually opened, never on the initial map load. */

export type RouteGraph = {
  nodes: [number, number][];
  edges: { a: number; b: number; distKm: number; coords: [number, number][]; name?: string }[];
};

type Adjacency = Map<number, { to: number; edgeIdx: number; distKm: number }[]>;

let graphCache: Promise<RouteGraph> | null = null;
let adjacencyCache: Adjacency | null = null;

export function loadRouteGraph(): Promise<RouteGraph> {
  if (!graphCache) {
    graphCache = fetch("/data/route_graph.json").then((r) => r.json());
  }
  return graphCache;
}

function adjacencyFor(graph: RouteGraph): Adjacency {
  if (adjacencyCache) return adjacencyCache;
  const adj: Adjacency = new Map();
  graph.edges.forEach((e, edgeIdx) => {
    if (!adj.has(e.a)) adj.set(e.a, []);
    if (!adj.has(e.b)) adj.set(e.b, []);
    adj.get(e.a)!.push({ to: e.b, edgeIdx, distKm: e.distKm });
    adj.get(e.b)!.push({ to: e.a, edgeIdx, distKm: e.distKm });
  });
  adjacencyCache = adj;
  return adj;
}

const EARTH_RADIUS_KM = 6371.0088;
function haversineKm(aLng: number, aLat: number, bLng: number, bLat: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** The nearest graph node to an arbitrary click point, plus how far the "walk to the road" leg
 * is — a real simplification worth surfacing in the UI rather than hiding, since the graph only
 * has nodes at road-segment endpoints, not at the exact point someone clicked. */
export function nearestNode(graph: RouteGraph, lng: number, lat: number): { idx: number; distKm: number } {
  let best = 0;
  let bestKm = Infinity;
  for (let i = 0; i < graph.nodes.length; i++) {
    const [nlng, nlat] = graph.nodes[i];
    const d = haversineKm(lng, lat, nlng, nlat);
    if (d < bestKm) {
      bestKm = d;
      best = i;
    }
  }
  return { idx: best, distKm: bestKm };
}

/** Binary min-heap keyed by distance — plain array-based Dijkstra over ~10k nodes/~15k edges
 * would be O(V^2) (~100M ops) and noticeably janky on a click; this keeps it to O(E log V). */
class MinHeap {
  private heap: [number, number][] = []; // [distance, nodeIdx]

  push(dist: number, node: number) {
    this.heap.push([dist, node]);
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent][0] <= this.heap[i][0]) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  pop(): [number, number] | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      let i = 0;
      const n = this.heap.length;
      for (;;) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < n && this.heap[l][0] < this.heap[smallest][0]) smallest = l;
        if (r < n && this.heap[r][0] < this.heap[smallest][0]) smallest = r;
        if (smallest === i) break;
        [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
        i = smallest;
      }
    }
    return top;
  }

  get size() {
    return this.heap.length;
  }
}

export type RouteResult = { coords: [number, number][]; distKm: number };

/** Dijkstra shortest path by real road-network distance (not straight-line) between two graph
 * node indices. Returns null if they're in different connected components — a genuinely correct
 * "no road route" for, say, a mainland-to-Britain query, not a bug. */
export function shortestPath(graph: RouteGraph, startIdx: number, endIdx: number): RouteResult | null {
  if (startIdx === endIdx) return { coords: [graph.nodes[startIdx]], distKm: 0 };
  const adj = adjacencyFor(graph);
  const dist = new Float64Array(graph.nodes.length).fill(Infinity);
  const prevEdge = new Int32Array(graph.nodes.length).fill(-1);
  const prevNode = new Int32Array(graph.nodes.length).fill(-1);
  const visited = new Uint8Array(graph.nodes.length);
  dist[startIdx] = 0;
  const heap = new MinHeap();
  heap.push(0, startIdx);

  while (heap.size > 0) {
    const [d, u] = heap.pop()!;
    if (visited[u]) continue;
    visited[u] = 1;
    if (u === endIdx) break;
    for (const { to, edgeIdx, distKm } of adj.get(u) || []) {
      if (visited[to]) continue;
      const nd = d + distKm;
      if (nd < dist[to]) {
        dist[to] = nd;
        prevEdge[to] = edgeIdx;
        prevNode[to] = u;
        heap.push(nd, to);
      }
    }
  }

  if (!isFinite(dist[endIdx])) return null;

  // Walk back from end to start, collecting each edge's own coordinate array (oriented to match
  // the direction actually traveled) so the rendered route follows the real road geometry, not
  // straight lines between node dots.
  const coordChunks: [number, number][][] = [];
  let cur = endIdx;
  while (cur !== startIdx) {
    const edgeIdx = prevEdge[cur];
    const prev = prevNode[cur];
    const e = graph.edges[edgeIdx];
    const forward = e.a === prev; // edge stored a->b; walking prev->cur means a->b if a===prev
    const chunk = forward ? e.coords : [...e.coords].reverse();
    coordChunks.push(chunk);
    cur = prev;
  }
  coordChunks.reverse();
  const coords: [number, number][] = [];
  for (const chunk of coordChunks) {
    if (coords.length > 0) chunk.shift(); // drop duplicate join point between consecutive edges
    coords.push(...(chunk as [number, number][]));
  }

  return { coords, distKm: dist[endIdx] };
}

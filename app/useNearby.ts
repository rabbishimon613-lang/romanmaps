"use client";

import { useEffect, useState } from "react";
import { loadPois } from "./places";

export type NearbyRow = {
  id: string;
  name: string;
  category: string;
  lng: number;
  lat: number;
  distanceM: number;
  imageUrl?: string;
  props: Record<string, any>;
};

const EARTH_RADIUS_M = 6371008.8;

function haversineMeters(aLng: number, aLat: number, bLng: number, bLat: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(s)));
}

// A same-category place counts as this much closer when ranking — enough that a relevant temple
// a few km further off can outrank an unrelated warehouse next door, without ignoring proximity
// entirely (an irrelevant category at 200m still beats a relevant one at 50km).
const CATEGORY_BOOST_M = 8000;
// Two records this close together are a near-duplicate pin (the same building recorded twice,
// e.g. the still-open [12-FIX-3] Pantheon duplicate), not a genuinely different nearby place —
// exclude them rather than surface "X, 8 m away" on X's own card.
const MIN_DISTANCE_M = 25;

/** The `[03-P1-4]` "nearby-related" ranking, shared by the live map panel (PlaceDetails.tsx) and
 * the static per-place page (place/[slug]/page.tsx isn't a client component, so it reimplements
 * the same scoring server-side against the file it already reads — see that file's own
 * `nearbyFor()`). Ranks every other curated POI by great-circle distance, with same-category
 * places pulled closer in the ranking, and returns the top `count`. */
export function rankNearby<T extends { id: string; lng: number; lat: number; category: string }>(
  all: T[],
  currentId: string,
  lng: number,
  lat: number,
  category: string,
  count: number,
): (T & { distanceM: number })[] {
  return all
    .filter((p) => p.id !== currentId)
    .filter((p) => haversineMeters(lng, lat, p.lng, p.lat) >= MIN_DISTANCE_M)
    .map((p) => {
      const d = haversineMeters(lng, lat, p.lng, p.lat);
      const sameCategory = !!category && p.category === category;
      return { p, d, score: sameCategory ? d - CATEGORY_BOOST_M : d };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(({ p, d }) => ({ ...p, distanceM: d }));
}

/** Client-side version for the live map panel — loads the already-cached `pois.geojson` (shared
 * with search) rather than fetching its own copy. */
export function useNearbyPois(
  currentId: string | undefined,
  lng: number | undefined,
  lat: number | undefined,
  category: string,
  count = 6,
): NearbyRow[] {
  const [rows, setRows] = useState<NearbyRow[]>([]);

  useEffect(() => {
    if (!currentId || lng === undefined || lat === undefined) {
      setRows([]);
      return;
    }
    let cancelled = false;
    loadPois().then((pois) => {
      if (cancelled) return;
      const flat = pois.map((p) => ({
        id: p.id,
        lng: p.lng,
        lat: p.lat,
        category: p.poiProps?.category || "",
        name: p.latin || p.modern || "Unnamed place",
        imageUrl: p.poiProps?.image_url as string | undefined,
        props: p.poiProps || {},
      }));
      setRows(rankNearby(flat, currentId, lng, lat, category, count));
    });
    return () => {
      cancelled = true;
    };
  }, [currentId, lng, lat, category, count]);

  return rows;
}

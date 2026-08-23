"use client";

import { EMPIRE_BOUNDS, EMPIRE_OUTLINE_PATH } from "./empireOutline";

/** [13-P0-3] image-fallback: a "you are here" locator map for the ~230 POIs that ship with no
 * `image_url`, replacing the flat gradient rail `PlaceDetails.tsx` used to fall back to. Draws a
 * heavily simplified coastline silhouette (`empireOutline.ts`, generated from the same
 * `land.geojson` the real map uses) and a pin at the place's real coordinates — a genuine "static
 * map thumbnail" per the ticket, built from local vector data already in the app rather than a
 * raster tile fetch, so it costs nothing over the network and can't be broken by this sandbox's
 * usual `demotiles.maplibre.org` block.
 */
export function LocatorThumbnail({
  lng,
  lat,
  color,
}: {
  lng: number;
  lat: number;
  color: string;
}) {
  const { minLng, minLat, maxLng, maxLat } = EMPIRE_BOUNDS;
  const width = maxLng - minLng;
  const height = maxLat - minLat;
  const cx = lng;
  const cy = -lat;

  return (
    <svg
      viewBox={`${minLng} ${-maxLat} ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      style={{ display: "block" }}
      role="img"
      aria-label="Map showing this place's location within the empire"
    >
      <rect x={minLng} y={-maxLat} width={width} height={height} fill={`${color}14`} />
      <path
        d={EMPIRE_OUTLINE_PATH}
        fill="none"
        stroke={`${color}66`}
        strokeWidth={0.18}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={1.1} fill="none" stroke={color} strokeWidth={0.28} opacity={0.55} />
      <circle cx={cx} cy={cy} r={0.42} fill={color} stroke="#fff" strokeWidth={0.12} />
    </svg>
  );
}

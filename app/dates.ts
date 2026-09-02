/** Shared date-formatting helpers for place cards (`PlaceDetails.tsx`) and static place pages
 * (`place/[slug]/page.tsx`), which otherwise duplicate this logic. Most records still carry a
 * single exact year in `built`/`destroyed` (negative = BCE) — this only changes behavior when a
 * record also carries the new optional `built_date`/`destroyed_date` fuzzy-date object, so every
 * existing record renders exactly as before. */

export type FuzzyDate = { earliest?: number | string; latest?: number | string; display?: string };

export function formatYear(y: number | string | undefined | null): string {
  if (y === null || y === undefined || y === "") return "";
  const n = Number(y);
  if (Number.isNaN(n)) return String(y);
  return n < 0 ? `${-n} BCE` : `${n} CE`;
}

function formatRange(earliest: number, latest: number): string {
  const sameEra = earliest < 0 === latest < 0;
  if (sameEra) {
    const era = earliest < 0 ? "BCE" : "CE";
    return `${Math.abs(earliest)}–${Math.abs(latest)} ${era}`;
  }
  return `${formatYear(earliest)} – ${formatYear(latest)}`;
}

/** Resolves a display string for a date, preferring a fuzzy `{earliest,latest,display}` object
 * over a bare exact year when both are present. `display` wins outright (a hand-written string
 * like "Augustan era, or a century later — sources disagree" says something a numeric range
 * can't); otherwise a present earliest+latest pair renders as a year range; a lone earliest or
 * latest renders as "After X"/"Before X"; with no fuzzy object at all, falls back to the plain
 * exact year, unchanged from the old single-field behavior. */
export function resolveDateLine(
  exact: number | string | undefined | null,
  fuzzy: FuzzyDate | string | undefined | null
): string {
  // MapLibre flattens object feature properties to a JSON string on a click query; a deep link
  // or a direct geojson fetch hands the same field over as a real object. Accept both.
  if (typeof fuzzy === "string" && fuzzy.trim().startsWith("{")) {
    try {
      fuzzy = JSON.parse(fuzzy) as FuzzyDate;
    } catch {
      fuzzy = undefined;
    }
  }
  if (fuzzy && typeof fuzzy === "object") {
    if (fuzzy.display) return fuzzy.display;
    const hasEarliest = fuzzy.earliest !== undefined && fuzzy.earliest !== null && fuzzy.earliest !== "";
    const hasLatest = fuzzy.latest !== undefined && fuzzy.latest !== null && fuzzy.latest !== "";
    if (hasEarliest && hasLatest) return formatRange(Number(fuzzy.earliest), Number(fuzzy.latest));
    if (hasEarliest) return `After ${formatYear(fuzzy.earliest)}`;
    if (hasLatest) return `Before ${formatYear(fuzzy.latest)}`;
  }
  return formatYear(exact);
}

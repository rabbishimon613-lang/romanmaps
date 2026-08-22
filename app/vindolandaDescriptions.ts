/** Hand-curated descriptions for named buildings at Vindolanda (Roman auxiliary fort near
 * Hadrian's Wall, Northumberland, UK — famous for the Vindolanda writing tablets) — same pattern
 * as app/ostiaDescriptions.ts and the other curate-buildings files [06-P0-2]. Keys are exact
 * substrings of public/data/sites/vindolanda_buildings.geojson's `name` property.
 *
 * Vindolanda is unusual: the Trust rebuilt the fort from scratch roughly every 10-20 years for
 * centuries, each new fort raised directly on the collapsed previous one (why the anaerobic soil
 * preserved the ink tablets). The fort standing on 11 August 117 CE is Period IV (c. 105-120 CE,
 * Cohors I Tungrorum) — NOT the famous Period III fort (c. 97-105 CE, Flavius Cerialis's Batavian
 * cohort, source of the best-known tablet archive), which was deliberately demolished 12 years
 * before this map's snapshot date.
 *
 * Real, unresolved limitation flagged rather than papered over: three OSM building names at this
 * site are shared by 2-3 physically distinct polygons that belong to DIFFERENT fort periods with
 * DIFFERENT 117 CE status ("Bath House" x2 — one pre-Hadrianic/standing in 117, one 3rd-century
 * and not; "Temple" x3, all later stone-fort-era but only one confidently identified). This
 * lookup matches by name only, so it cannot give two identically-named features two different
 * answers — writing one entry under "Bath House" would be wrong for whichever polygon it doesn't
 * describe. Dropped rather than guessed; see FEATURE_BACKLOG.md for the architecture note. "Well"
 * is dropped for a different reason — genuinely undated in every source found, not even a
 * confident before/after-117 call. "Nymphis Sacrum Vicani Vindolandensis" is dropped because the
 * clickable structure is itself a modern Trust reconstruction in the museum garden (the ancient
 * altar it reproduces was excavated nearby, but isn't what a click on this polygon represents).
 *
 * Filled in by cloud shift 44 research — see SHIFT_LOG.md for sourcing detail.
 */

export type VindolandaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const VINDOLANDA_LOOKUP: Record<string, VindolandaEntry> = {
  "Vindolanda Fort": {
    english: "Vindolanda Fort (Period IV)",
    category: "fort",
    extant_117ce: true,
    built: 105,
    destroyed: 120,
    description:
      "Cohors I Tungrorum built Vindolanda's Period IV fort in timber and turf around 105 CE, expanding it westward into the largest timber fort ever raised on the site. Roughly 800 part-mounted Tungrian infantry garrisoned its ramparts through Trajan's reign, including on 11 August 117. A tombstone for centurion Titus Annius records a Tungrian officer killed fighting in Britain that same year. Soldiers dismantled this fort around 120 to build its successor.",
  },
  Spring: {
    english: "The Vindolanda spring",
    category: "water",
    extant_117ce: true,
    description:
      "A natural spring fed Vindolanda's water supply from a location northwest of the settlement, later channeled by aqueduct to the fort's 3rd-century bathhouse. This abundant, reliable source was one reason Roman engineers chose the site for a fort in the first place. The ground around it stayed boggy in every season, long before and after any Roman buildings stood nearby — including the timber fort garrisoned here in 117.",
  },
  "Granary & Stores": {
    english: "Granary and Stores",
    category: "civic",
    extant_117ce: false,
    built: 213,
    description:
      "Vindolanda's garrison raised twin stone granaries inside the 3rd-century stone fort to store grain and supplies for hundreds of troops. Workers partitioned the eastern granary into a shop in the 4th century, while the western granary kept storing goods until the end of Roman Britain. Both later became houses, sheltering families for perhaps 500 years after the legions departed. Neither granary existed yet in 117 — the fort standing that year was still built of timber and turf.",
  },
  Workshops: {
    english: "Vicus workshops",
    category: "civic",
    extant_117ce: false,
    built: 213,
    description:
      "Craftsmen and merchants ran workshops flanking the main road through Vindolanda's 3rd-century vicus, a civilian settlement roughly five times the size of the fort itself. Traders here served a population of wives, children and artisans that could outnumber the resident garrison two or three to one. The largest building in the vicus, a tavern, stood right beside these workshops. This commercial quarter did not yet exist in 117.",
  },
  "Water tank": {
    english: "Stone water tank",
    category: "water",
    extant_117ce: false,
    built: 200,
    description:
      "Vindolanda Trust archaeologists excavated a free-standing stone water tank in 2015, finding it enclosed within a later temple precinct alongside animal bones, barrels and hairpins. Nearby lay a stone carved with a hare and a hound, likely honoring Diana, goddess of the hunt. The tank belonged to Vindolanda's stone-fort-era religious precinct, generations after the timber fort garrisoned here in 117.",
  },
};

/** Look up a matching description for an OSM building name. */
export function vindolandaEntry(name: string | null | undefined): VindolandaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(VINDOLANDA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return VINDOLANDA_LOOKUP[k];
  }
  return undefined;
}

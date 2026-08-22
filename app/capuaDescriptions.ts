/** Hand-curated descriptions for named buildings at Capua (ancient Capua, modern Santa Maria
 * Capua Vetere, Italy) — same pattern as app/ostiaDescriptions.ts and the other curate-buildings
 * files [06-P0-2]. Keys are exact substrings of public/data/sites/capua_buildings.geojson's `name`
 * property, in Italian, matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Filled in by cloud shift 44 research — see SHIFT_LOG.md for sourcing detail.
 */

export type CapuaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const CAPUA_LOOKUP: Record<string, CapuaEntry> = {
  "Amfiteatro Campano": {
    english: "Campanian Amphitheatre",
    category: "amphitheater",
    extant_117ce: true,
    built: 100,
    description:
      "Rome's second-largest amphitheatre rose at Capua around 100 CE, replacing the older arena where Spartacus had trained decades earlier. Its elliptical bowl measured 170 meters across and held as many as 60,000 spectators across four tiers of seating. Underground passages let workers hoist animals and fighters up through trapdoors into the arena floor. Already open for business by 117, it wouldn't get its marble facing and formal dedication for another two decades.",
  },
  "Resti del primo Anfiteatro": {
    english: "Remains of the First Amphitheatre",
    category: "amphitheater",
    extant_117ce: false,
    built: -130,
    destroyed: 100,
    description:
      "Capua raised one of the Roman world's first stone amphitheatres here in the 2nd century BCE, decades before Rome built anything to match it. Slaves trained as gladiators within its walls, and in 73 BCE Spartacus led a breakout from this arena that ignited a revolt engulfing Italy for two years. It stood only about 20 meters from the site of the later, far larger Campanian Amphitheatre, which replaced it around 100 CE — gone from the ground long before Trajan's death.",
  },
  "Castellum aquae": {
    english: "Water Castle",
    category: "water",
    extant_117ce: true,
    built: 80,
    description:
      "A stone tower rose at Capua's eastern gate in the final decades of the 1st century CE to regulate water flowing in along the Aqua Iulia, the aqueduct Octavian had funded for the city. Water climbed to the tank at the tower's top under hydraulic pressure, then dropped back down through pipes that fed fountains and baths across town. Archaeologists uncovered its ruins only in 1970, but by 117 it had already been supplying the city for decades.",
  },
  "Domus di Via degli Orti": {
    english: "House on Via degli Orti",
    category: "domus",
    extant_117ce: true,
    built: 50,
    description:
      "A wealthy Capuan family built this townhouse in the city's eastern quarter during the 1st century CE and kept expanding it for the next 300 years. One dining room held two marble mosaic floors laid for banquets with honored guests. Workers building a school in the 1960s broke through into its buried rooms and a private bath complex — by 117 the house had already stood for decades, with most of its later additions still to come.",
  },
  "Mitreo di Santa Maria Capua Vetere": {
    english: "Mithraeum of Santa Maria Capua Vetere",
    category: "religious",
    extant_117ce: true,
    built: 100,
    description:
      "Worshippers carved this shrine to Mithras into a natural cave at Capua around 100 CE, making it the oldest known Mithraeum in the western Roman world. Its walls carry the most complete fresco cycle of the god's myth ever found, including Mithras plunging his blade into the sacred bull as the sun god Sol looks on from above. A single chamber ran about 12 meters long, lined with stone benches where initiates gathered for secret rites. Workers rediscovered it by chance in 1922.",
  },
};

/** Look up a matching description for an OSM building name. */
export function capuaEntry(name: string | null | undefined): CapuaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(CAPUA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return CAPUA_LOOKUP[k];
  }
  return undefined;
}

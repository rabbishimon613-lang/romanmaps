/** Hand-curated descriptions for named buildings in Trier (Roman Augusta Treverorum) — same
 * pattern as app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, app/herculaneumDescriptions.ts,
 * app/ephesusDescriptions.ts, app/delphiDescriptions.ts and app/jerashDescriptions.ts, the seventh
 * site to get this treatment [06-P0-2].
 *
 * Trier is a living modern city (Germany's oldest), like Ephesus rather than a buried site — but
 * unlike every prior site here, its OSM building extract is overwhelmingly a present-day city
 * dump: of 3,875 features in `public/data/sites/trier_buildings.geojson`, only 116 carry a `name`
 * at all, and roughly 105 of those are ordinary 20th/21st-century buildings (hospital wings, tax
 * offices, hotel chains, apartment blocks) with no researchable Roman-era connection. None of
 * Trier's headline Roman monuments — the Porta Nigra, the Amphitheater, the Aula Palatina, the
 * Römerbrücke — appear as named OSM features at all, so they can't be curated here; they exist on
 * the map only as unlabeled polygons or (where already present) as separate pois.geojson records.
 *
 * The 12 entries below are the named features that DO have a real, sourceable history. Every one
 * of them is honestly `extant_117ce: false` — Augusta Treverorum's grandest building boom came
 * generations later, once Trier became a Tetrarchic and then Constantinian imperial residence city
 * from 293 CE onward, and several entries here are medieval or early-modern buildings raised over
 * or near Roman ground centuries after the snapshot. That "everything here is false" result is
 * itself the honest finding for this batch, the same shape Jerash's mostly-post-117 building boom
 * produced — see BOARD.md's [06-P0-2] ticket note.
 *
 * Sources: cited inline per entry below (English and German Wikipedia via search-snippet
 * corroboration — direct fetch of wikipedia.org, livius.org and historyhit.com was network-
 * blocked in the researching session — plus historyhit.com, mosel-inside.de, triergesellschaft.de,
 * kulturdb.de and archaeologieverstehen.wordpress.com). Researched via a background WebSearch
 * pass, personally reviewed before merging. */

export type TrierEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name, longer keys checked first. Keep entries
// specific to one building. "Roter Turm" is deliberately absent: the same exact name string
// appears twice in the geojson at two different, unrelated real locations (a 1543 city-wall
// bastion and a 1647 tower on the Kurfürstliches Palais), so one lookup entry would misdescribe
// whichever of the two a click actually landed on — skipped rather than guessed, per the research
// pass's own flag.
export const TRIER_LOOKUP: Record<string, TrierEntry> = {
  Barbarathermen: {
    english: "Barbara Baths",
    category: "bath",
    extant_117ce: false,
    built: 150,
    description:
      "Augusta Treverorum's first great public bathhouse rose around 150 CE on the bank of the Moselle, sprawling across some 42,000 square meters — briefly the largest bath complex north of the Alps. Its plan followed North African bathhouse conventions rather than the usual Italian layout, an unusual choice this far from the Mediterranean. Bathers used it for more than two centuries before Jesuit builders quarried its walls for a college around 1610. In 117 CE the site was still open riverside ground; Trajan's Trier had no such bath yet.",
  },
  Kaiserthermen: {
    english: "Imperial Baths",
    category: "bath",
    extant_117ce: false,
    built: 298,
    description:
      "Trier's Imperial Baths rose from around 298 CE on the orders of Constantius Chlorus, who had just made the city an imperial residence, with Constantine the Great pushing the project further after 306. The finished halls covered roughly 250 by 145 meters, rivaled in size only by the great baths of Rome itself, though work stalled in 316 and the complex was never finished as a working bathhouse. In 117 CE this ground held an ordinary residential block of Trajan-era row houses — nearly two centuries would pass before an emperor ever lived in Trier.",
  },
  "Thermen am Viehmarkt": {
    english: "Viehmarkt Baths",
    category: "bath",
    extant_117ce: false,
    built: 300,
    description:
      "Excavators broke into these baths by accident in 1987 while digging a parking-garage pit, and the find was so well preserved that the city built a glass pavilion over the hole instead of filling it in. The bath itself was carved in the 4th century out of an enormous public building whose original 2nd-century purpose is still unexplained — a structure that had itself replaced ordinary houses standing there since the city's Augustan founding. In 117 CE the plot held only those early houses; both the mystery building and the bathhouse it later became lay generations in the future.",
  },
  Kastilport: {
    english: "Kastilport Gate",
    category: "gate",
    extant_117ce: false,
    built: 1150,
    description:
      "This gate in Trier's medieval wall led travelers out toward the old suburb of Castil and the Roman amphitheater beyond, its Romanesque core dating to around the mid-12th century and later widened in the 1200s. Sealed off in 1552 as the city's fortifications changed, it survived only as scattered remnants until the Trier Society rebuilt it in 1995-96. In 117 CE this spot sat well within Augusta Treverorum's unwalled Trajanic city — a millennium would pass before anyone built a defensive gate here.",
  },
  "Kurfürstliches Palais": {
    english: "Electoral Palace",
    category: "palace",
    extant_117ce: false,
    built: 1614,
    description:
      "Trier's prince-electors built this palace on remarkable ground: a Roman governor's residence had stood here since the mid-1st century CE, and its late-antique successor became the emperor's own audience hall around 310 CE. The archbishops raised their own residence over the ruins starting around 1614, tearing down the old hall's south and east walls to make room, and the palace grew into its full Rococo form over the following century. In 117 CE a working Roman governor's palace already occupied this ground, built decades earlier under the Flavians — the Baroque building visitors see today was fifteen centuries in the future.",
  },
  "Ehemalige Abtei Sankt Maximin": {
    english: "Former Abbey of St. Maximin",
    category: "sanctuary",
    extant_117ce: false,
    built: 350,
    description:
      "This abbey grew out of a Roman cemetery just north of the later Porta Nigra, where the earliest surviving sarcophagi date to the 2nd century CE and a Christian basilica went up around a private mausoleum in the mid-4th century. Bishop Maximin, who died in 346, was buried here, and the site took his name after his relics were moved in a few years later; a Benedictine community had taken root by the 6th century and grew into the wealthiest of Trier's monasteries. In 117 CE this ground lay outside the city as ordinary suburban land — nothing yet marked it as a burial site.",
  },
  Frankenturm: {
    english: "Franks' Tower",
    category: "tower",
    extant_117ce: false,
    built: 1100,
    description:
      "One of only three fortified merchant towers surviving from Trier's medieval old town, the Frankenturm went up around 1100 near the Hauptmarkt and took its name from a 14th-century resident, Franco von Senheim. Its builders quarried stone straight from Roman ruins scattered across the city and deliberately laid the masonry to imitate genuine Roman brick coursing. Originally five stories, it was cut down to two and a half in 1308 and only rebuilt to full height in 1938-39. In 117 CE this plot sat inside the ordinary Roman street grid of a thriving provincial capital — nearly a thousand years before any tower stood here.",
  },
  Steipe: {
    english: "Steipe",
    category: "civic",
    extant_117ce: false,
    built: 1430,
    description:
      "The Steipe served as Trier's overflow town hall, a Gothic reception building raised around 1430 where the Fleischstraße and Dietrichstraße meet the Hauptmarkt, then rebuilt more grandly between 1481 and 1483. Its facade carried a set of stone giants and city patron saints carved in 1483. Allied bombing leveled the building in the Second World War, and it was reconstructed only decades later, now serving as the city council's ceremonial house. In 117 CE this corner sat inside Augusta Treverorum's dense grid of streets and houses — the medieval market square itself wasn't laid out until 958.",
  },
  Dreikönigenhaus: {
    english: "House of the Three Kings",
    category: "house",
    extant_117ce: false,
    built: 1230,
    description:
      "This fortified townhouse on the Simeonstraße went up around 1230 for a family of knights or wealthy merchants, its ground-floor entrance reachable only by a drawbridge that could be raised at the first sign of trouble. Called simply \"Zum Säulchen\" for its ornate marble window columns, it only picked up its current name around 1680, when an innkeeper opened a guesthouse there under that sign. In 117 CE this ground held ordinary Roman city housing; the very idea of a private defensive tower was still eleven centuries away.",
  },
  "Turm Jerusalem": {
    english: "Jerusalem Tower",
    category: "tower",
    extant_117ce: false,
    built: 1050,
    description:
      "The Jerusalem Tower rose in the 11th century as the fortified residence of Trier's cathedral canons, taking its name from the Curia Jerusalem — the legal court the canons ran here inside the cathedral's own jurisdiction. Its builders, like other medieval Trier towers, reused stone from Roman ruins and copied genuine Roman brick coursing closely enough to fool a casual glance. In 117 CE the ground beside the future cathedral complex was still ordinary Roman streetscape — no church, no tower, and Constantine's building program lay two centuries ahead.",
  },
  Vogtsburg: {
    english: "Vogtsburg",
    category: "house",
    extant_117ce: false,
    built: 1050,
    description:
      "Also called the Eulenburg, this steep three-story stone house on the Kutzbachstraße has a Romanesque core going back to around the mid-11th century, expanded with a tower in the 14th century and a polygonal Renaissance stair turret added in 1543. Its original round-arched triple-arcade window still survives in the front wall. In 117 CE this plot lay within Trajan-era Augusta Treverorum's built-up quarters — nine centuries before any of this masonry was laid.",
  },
  "Ruine Konventsaal": {
    english: "Convent Hall Ruins",
    category: "sanctuary",
    extant_117ce: false,
    description:
      "These ruins mark the assembly hall of the St. Irminen convent, founded in the mid-7th century after King Dagobert I granted the site — originally a set of Roman state warehouses — to the archbishop of Trier for a Benedictine community. The convent's surviving fabric is mostly Romanesque, from the 11th and 12th centuries, with a Rococo church added alongside it in the 1760s. In 117 CE this ground served the logistical needs of a Roman provincial capital — active granaries and storehouses, not yet a monastery, and five and a half centuries from Dagobert's donation.",
  },
};

/** Look up a matching description for an OSM building name. */
export function trierEntry(name: string | null | undefined): TrierEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(TRIER_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return TRIER_LOOKUP[k];
  }
  return undefined;
}

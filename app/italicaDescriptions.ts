/** Hand-curated descriptions for named buildings in Italica — same pattern as
 * app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, app/herculaneumDescriptions.ts,
 * app/ephesusDescriptions.ts, app/delphiDescriptions.ts, app/jerashDescriptions.ts,
 * app/trierDescriptions.ts, app/meridaDescriptions.ts, app/palmyraDescriptions.ts,
 * app/athensDescriptions.ts, app/leptisMagnaDescriptions.ts, app/timgadDescriptions.ts,
 * app/djemilaDescriptions.ts, app/volubilisDescriptions.ts, app/sabrathaDescriptions.ts,
 * app/baalbekDescriptions.ts and app/luniDescriptions.ts — this is the eighteenth site to get
 * this treatment [06-P0-2].
 *
 * Italica was founded in 206 BCE by Scipio Africanus for veterans wounded in the Second Punic
 * War — one of Rome's first colonies outside Italy. The old veteran settlement (the vetus urbs)
 * lies mostly buried under the modern town of Santiponce; the archaeological park visitors walk
 * today is almost entirely the nova urbs, a large new quarter Hadrian built after taking power
 * in 117 CE and elevating the city to colonial status as Colonia Aelia Augusta Italica. Trajan
 * was almost certainly born here (his family, the Ulpii, were long settled at Italica); ancient
 * sources are split on whether Hadrian was too, or was born in Rome to an Italica family — either
 * way the city's whole modern identity rests on both emperors.
 *
 * That timing makes this site a sharp 117 CE snapshot case in the opposite direction from most
 * curate-buildings sites: it isn't that a handful of famous monuments postdate the snapshot,
 * it's that almost the entire visible archaeological park does. Every named building below —
 * every mosaic-floored domus, the Exedra and Neptune-mosaic collegium buildings, even the
 * cistern that supplied the new quarter — belongs to Hadrian's nova urbs and sits on ground that
 * was still open field on 11 August 117 CE. Only the Lesser Baths, built under Trajan in the old
 * quarter near the forum, was already standing. The amphitheatre (one of the largest in the
 * Roman world, ~25,000 seats against a city of perhaps 8,000 people) and the Traianeum (Hadrian's
 * temple to the newly deified Trajan) both belong to this same post-117 expansion but aren't
 * separately tagged as clickable buildings in the source data — noted here rather than invented
 * as records.
 *
 * Researched via a background WebSearch pass (the Junta de Andalucía's own Conjunto Arqueológico
 * de Itálica site, the IAPH digital repository, the ROMULA/UPO archaeology journal, Wikidata, and
 * several Spanish-language archaeology outlets — direct fetch of most of these was network-
 * blocked in the researching session, so facts are corroborated through search-snippet synthesis,
 * the same constraint every recent shift's Track A work has documented), personally reviewed
 * before merging. */

export type ItalicaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (Spanish), longer keys checked first, so
// keep entries specific to one building.
export const ITALICA_LOOKUP: Record<string, ItalicaEntry> = {
  "Cisterna Romana": {
    english: "Roman Cistern",
    category: "other",
    extant_117ce: false,
    built: 130,
    description:
      "Three parallel barrel-vaulted galleries, faced in brick and waterproofed with pink opus signinum mortar, formed this reservoir on Italica's southwestern edge. Fed by the city aqueduct, it held roughly 900,000 liters for the new quarter Hadrian was building beyond the old town, its three chambers running 28 meters long and 5 meters tall inside. In 117 CE this hillside was still open ground — the cistern was still years from being cut.",
  },
  "Casa de los Pájaros": {
    english: "House of the Birds",
    category: "domus",
    extant_117ce: false,
    built: 150,
    description:
      "This 1,700-square-meter mansion in Italica's Hadrianic new quarter took its name from a spectacular floor: a six-by-five-meter carpet of 33 birds — swans, doves, raptors, waterfowl — worked in stone and colored glass tesserae with a naturalist's precision. Rooms opened around a peristyle courtyard in the axial plan typical of grand Roman townhouses. In 117 CE this ground lay outside the walls, the House of the Birds still decades away.",
  },
  "Casa del Planetario": {
    english: "House of the Planetarium",
    category: "domus",
    extant_117ce: false,
    built: 130,
    description:
      "Spread across roughly 1,600 square meters of Hadrian's new town, this domus earned its name from a mosaic mapping the seven planetary deities that named the days of the week, Venus enthroned at its center. A second floor nearby showed Dionysus and Ariadne ringed by centaurs and exotic beasts, both surviving open to the sky in remarkable condition. In 117 CE this neighborhood did not exist yet.",
  },
  "Termas menores": {
    english: "Lesser Baths",
    category: "bath",
    extant_117ce: true,
    built: 100,
    description:
      "Built under Trajan in Italica's old quarter near the forum, these public baths covered some 5,000 square meters at their height, though only about 1,500 remain visible beneath the modern town. Bathers moved through two heated caldaria, a tepidarium and a frigidarium, alongside a library and massage room. Already standing in 117 CE, the Lesser Baths had served the city for a generation.",
  },
  "Edificio de la Exedra": {
    english: "Exedra Building",
    category: "civic",
    extant_117ce: false,
    built: 130,
    description:
      "One of Italica's largest structures, this Hadrianic complex combined a residence, gymnasium and baths behind a facade on the city's main street, likely serving as headquarters for a trade guild. Its communal latrine, opened to visitors only in 2019, still preserves stone toilet seats over a flushing channel beneath a mosaic of pygmies battling cranes. In 117 CE this stretch of Italica was still empty land.",
  },
  "Edificio del mosaico Neptuno": {
    english: "Building of the Neptune Mosaic",
    category: "civic",
    extant_117ce: false,
    built: 150,
    description:
      "Occupying a full city block of roughly 6,000 square meters in Hadrian's new quarter, this complex paired a residence with baths and rooms for a trade guild, where Italica's men met to do business. Its name comes from a frigidarium mosaic showing Neptune, trident raised, driving a chariot of seahorses through a sea of creatures, in black and white against the tiled floor. In 117 CE this block was open field, the mosaic decades from being laid.",
  },
  "Casa de Patio Rodio": {
    english: "House of the Rhodian Courtyard",
    category: "domus",
    extant_117ce: false,
    built: 130,
    description:
      "Excavators reexamining this Hadrianic townhouse in the 2010s overturned a century-old floor plan, finding not the \"Rhodian peristyle\" that gave it its name but an axial courtyard house with four dining rooms, a latrine and a fish pond built into the courtyard itself. Richly patterned mosaic floors decorated its main rooms. In 117 CE this house did not exist, part of a quarter Italica had not yet built.",
  },
  "Casa de Hylas": {
    english: "House of Hylas",
    category: "domus",
    extant_117ce: false,
    built: 150,
    description:
      "Named for its showpiece mosaic, this domus in Italica's Hadrianic new quarter depicted the youth Hylas, companion of Hercules, dragged beneath a spring's surface by love-struck water nymphs as he drew water for his hero. Other floors carried personifications of the four seasons and prowling tigers; the Hylas panel itself was later cut free and moved to Seville's Archaeological Museum. In 117 CE this house was still unbuilt, its myth-laden floor decades in the future.",
  },
};

/** Look up a matching description for an OSM building name. */
export function italicaEntry(name: string | null | undefined): ItalicaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(ITALICA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return ITALICA_LOOKUP[k];
  }
  return undefined;
}

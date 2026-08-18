/** Hand-curated descriptions for named buildings in Merida (Roman Augusta Emerita) — same
 * pattern as app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, app/herculaneumDescriptions.ts,
 * app/ephesusDescriptions.ts, app/delphiDescriptions.ts, app/jerashDescriptions.ts and
 * app/trierDescriptions.ts, the eighth site to get this treatment [06-P0-2].
 *
 * Augusta Emerita was founded in 25 BCE as a colony for veterans of the Fifth Alaudae and Tenth
 * Gemina legions, and unlike Trier its monumental core was already largely built by 117 CE — most
 * of the entries below are honestly `extant_117ce: true`. Of 46 named features in
 * `public/data/sites/merida_buildings.geojson`, most are modern hotels, shops and civic offices;
 * one genuine Roman feature ("Termas romanas") was deliberately left out — its coordinates sit
 * away from any documented bath complex this research could confidently identify, so rather than
 * guess which of Augusta Emerita's six known public baths it is, it's skipped (same call Trier's
 * "Roter Turm" made for a different reason).
 *
 * Two real misattributions surfaced in the research and are written into the entries themselves
 * rather than silently corrected: the "Temple of Diana" has nothing to do with Diana (a 17th-
 * century local historian's guess), and the "Arch of Trajan" has nothing to do with Trajan either
 * (built under Tiberius, renamed centuries later after its real dedicatory inscription was lost).
 *
 * Sources: researched via a background WebSearch pass (direct fetch of wikipedia.org, livius.org,
 * consorciomerida.org and turismomerida.org was network-blocked in the researching session, same
 * constraint every recent shift has hit) — spain.info, historyhit.com, turismoextremadura.com,
 * meridavisitas.com, es.wikipedia.org (via search-snippet synthesis), rafaelmoneo.com. */

export type MeridaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name, longer keys checked first.
export const MERIDA_LOOKUP: Record<string, MeridaEntry> = {
  "Templo de Diana": {
    english: "Temple of Diana",
    category: "temple",
    extant_117ce: true,
    built: 2,
    description:
      "Six towering granite columns still carry their Corinthian capitals on this Augustan-era temple, raised for the imperial cult of Rome and Augustus at the crossing point of the city's two main streets. A local historian misnamed it for Diana in the seventeenth century — the goddess had nothing to do with it. A Renaissance palace was later built straight through the cella, its walls still threaded between the ancient columns today. By 117 CE the temple had anchored Augusta Emerita's forum for well over a century.",
  },
  "Foro Romano": {
    english: "Municipal Forum",
    category: "forum",
    extant_117ce: true,
    built: -25,
    description:
      "Augusta Emerita's municipal forum framed daily business for a colony founded in 25 BCE for time-served veterans of the Fifth and Tenth legions, its porticoes lined with statues of the imperial family and local benefactors. A carved relief recovered here shows a bearded man widely read as Marcus Agrippa, Augustus's own son-in-law, said to have presided over the colony's founding ceremony. By 117 CE the forum had anchored the city's public life for close to a century and a half.",
  },
  "Arco de Trajano": {
    english: "Trajan's Arch",
    category: "gate",
    extant_117ce: true,
    built: 15,
    description:
      "Fifteen meters of dressed granite frame the single great arch of this gateway, though the emperor in its name never built it and likely never saw it. A dedicatory inscription once fixed the true date under Tiberius; once those words wore away, locals simply guessed \"Trajan.\" Its real job was ceremonial — marking the entrance to the sacred precinct around the city's Imperial cult temple, not any triumph. By 117 CE it had welcomed worshippers into that enclosure for roughly a century.",
  },
  "Circo Romano de Mérida": {
    english: "Roman Circus",
    category: "circus",
    extant_117ce: true,
    built: 15,
    description:
      "Thirty thousand spectators could pack this circus for chariot races along a track stretching more than 400 meters between the starting gates and the turning post — one of the best-preserved examples anywhere in the Roman world. Built for a colony of veteran soldiers who expected Rome's own entertainments, it staged races between the same four factions that thrilled crowds in the capital, and excavators have found evidence the arena was even flooded for staged naval battles. By 117 CE it had been drawing crowds for roughly a century.",
  },
  "Casa del Mitreo": {
    english: "Mithraeum House",
    category: "domus",
    extant_117ce: true,
    built: 100,
    description:
      "This grand townhouse near the amphitheater takes its name from a 20th-century link to the cult of Mithras that scholars have since dropped entirely — the name stuck anyway. Its famous Cosmological Mosaic, a reception-room floor with figures for earth, sea and sky, is now dated a century or so later than the house's own construction. Built as Augusta Emerita's elite were expanding their residences beyond the old city walls, the house itself was already standing at Trajan's death in 117 CE — its showpiece floor was still to come.",
  },
  "Casa del Anfiteatro": {
    english: "Amphitheater House",
    category: "domus",
    extant_117ce: true,
    built: 60,
    description:
      "A trapezoidal garden courtyard with its own well and fountain, plus private baths, made this one of Augusta Emerita's more comfortable 1st-century townhouses, built beside the city's amphitheater and occupied for two centuries. Its best-known floor, a mosaic of workers treading grapes for the goddess Venus, wasn't laid until the 3rd century — a later owner's addition to a house already old by then. In 117 CE the house stood much as its first owners built it, a hundred years before that famous mosaic went down.",
  },
  "Los Columbarios": {
    english: "The Columbaria",
    category: "tomb",
    extant_117ce: true,
    built: -20,
    description:
      "Two family tomb enclosures anchor this necropolis south of the city walls: a square columbarium built by Gaius Voconius Proculus for his father, mother and sister, and a trapezoidal tomb raised nearby for the Julii. Niches once held cremation urns for generations of both families, alongside a carved family portrait of the Voconii that survives today. Founded in the last decades before Augustus's death, the Voconii tomb was still receiving burials well past 117 CE — a working cemetery at this map's own snapshot, not yet a relic.",
  },
  "Sala Decumanus": {
    english: "Decumanus Maximus",
    category: "street",
    extant_117ce: true,
    built: -25,
    description:
      "More than six meters of diorite and quartzite paving survive from Augusta Emerita's Decumanus Maximus, one of the two great streets that crossed at the city's founding and fixed the grid every later building followed. Porticoes sheltered pedestrians along both sidewalks through the 1st and 2nd centuries, wide enough for cart traffic to pass in both directions at once. The surviving stretch ran from the Roman bridge toward the old town's Puerta de la Villa. By 117 CE it had carried the city's daily traffic for close to a century and a half.",
  },
  "Alcazaba de Mérida": {
    english: "Alcazaba of Merida",
    category: "fortress",
    extant_117ce: false,
    built: 835,
    description:
      "Emir Abd al-Rahman II raised this fortress in 835 CE to guard the Roman bridge and control the city's river crossing — the oldest Islamic-era citadel on the Iberian Peninsula. Its 130-meter walls and 25 towers were built almost entirely from reused Roman and Visigothic masonry, quarried straight out of Augusta Emerita's own ruins. Inside, a stepped cistern still descends to the Guadiana's water table through Roman-style vaulting turned to an entirely new purpose. In 117 CE this ground held nothing but the riverbank approach to the bridge; the fortress was seven centuries away.",
  },
  "Museo Nacional de Arte Romano": {
    english: "National Museum of Roman Art",
    category: "museum",
    extant_117ce: false,
    built: 1986,
    description:
      "Architect Rafael Moneo raised this museum in 1986 out of bare brick and repeated round arches deliberately modeled on Roman construction — a modern building built to feel like the ruins it houses. Inside, more than 55,000 objects trace Augusta Emerita's Roman and late-antique life, including an equestrian statue honoring the emperor Augustus himself. Its foundations sit directly over excavated Roman remains, visible through glass floors inside. In 117 CE this plot was ordinary city ground; the museum is entirely a 20th-century addition.",
  },
  Xenodoquio: {
    english: "The Xenodochium",
    category: "hospital",
    extant_117ce: false,
    built: 580,
    description:
      "Bishop Masona founded this hostel-and-hospital complex in 580 CE for the pilgrims flooding into Mérida to visit the tomb of the martyr Eulalia, making it one of the first documented hospitals in Spain. Its plan borrowed from Byzantine architecture — a basilica-like central hall flanked by two porticoed courtyards — and it took in the sick regardless of faith; Masona was recorded showing kindness to Jews and pagans alike. In 117 CE Mérida had no Christian cult of any kind yet, let alone a martyr's tomb to draw pilgrims — Eulalia's own death was still nearly two centuries away.",
  },
};

/** Look up a matching description for an OSM building name. */
export function meridaEntry(name: string | null | undefined): MeridaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(MERIDA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return MERIDA_LOOKUP[k];
  }
  return undefined;
}

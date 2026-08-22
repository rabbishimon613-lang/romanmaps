/** Hand-curated descriptions for named buildings at Verona (Roman Italy) — same pattern as
 * app/ostiaDescriptions.ts and the other curate-buildings files [06-P0-2]. Keys are exact
 * substrings of public/data/sites/verona_buildings.geojson's `name` property, in Italian,
 * matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Verona became a Roman municipium in 89 BCE and grew into a prosperous crossroads city on the
 * Via Postumia. Its five genuinely ancient monuments here all date to the late Republic through
 * the early-to-mid 1st century CE — by 117 CE every one of them was already 80-150 years old.
 *
 * Three real candidates were researched and correctly excluded rather than guessed: "Porta
 * Nuova" and "Porta San Giorgio" are both post-Roman fortification gates (Renaissance/Sanmicheli-
 * era and 14th-century Scaliger-era respectively, despite sitting on the historic walls);
 * "Ponte Scaligero" is a 14th-century medieval bridge built by Cangrande II della Scala, not the
 * city's actual Roman-era river crossing (Ponte Pietra, which isn't present in this site's own
 * OSM building extract and so isn't curated here). One real name collision guarded in
 * `veronaEntry()` itself: "Museo archeologico al Teatro Romano" is the modern museum building
 * overlooking the theatre, not the ancient theatre, and would otherwise inherit its description
 * since the string is a literal substring match.
 *
 * Sources: English and Italian Wikipedia, Comune di Verona's own tourism pages
 * (turismo.comune.verona.it, visitverona.it, cittadiverona.it), Italy's national cultural
 * heritage catalog (catalogo.beniculturali.it) — cross-confirmed across 2+ independent results
 * per fact, researched via a background WebSearch pass (direct fetches to these domains stayed
 * blocked in this environment). Filled in by a cloud shift — see SHIFT_LOG.md for sourcing detail.
 */

export type VeronaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const VERONA_LOOKUP: Record<string, VeronaEntry> = {
  "Arco dei Gavi": {
    english: "Arch of the Gavii",
    category: "arch",
    extant_117ce: true,
    built: 10,
    description:
      "The Gavia family raised this arch beside the Via Postumia in the early 1st century CE to advertise their own wealth rather than any military victory. Its architect, Lucius Vitruvius Cerdo, did something almost no Roman builder did — he carved his own name into the archway, turning the monument into his signature as much as the Gavii's memorial. By 117 CE the arch had already stood beside the road into Verona for roughly a century, a private family monument that outlasted the family itself.",
  },
  "Porta Borsari": {
    english: "Porta Borsari",
    category: "gate",
    extant_117ce: true,
    built: 30,
    description:
      "Verona's garrison first raised a gate here in the late 1st century BCE, naming it Porta Iovia after a nearby temple to Jupiter. In the first half of the 1st century CE the city replaced its plain approach with a lavish four-story facade of white limestone, stacking fluted pilasters and arched windows over two full rows, flanked by square towers. By 117 CE that facade had already greeted travelers on the Via Postumia for the better part of a century, nearly 150 years before an emperor's own inscription would record its next major repair.",
  },
  "Porta Leoni": {
    english: "Porta Leoni",
    category: "gate",
    extant_117ce: true,
    built: -50,
    description:
      "Four Roman magistrates financed this gate in the 1st century BCE, building it largely from brick and tuff with one face toward the forum and another toward open country. In the first half of the 1st century CE the city sheathed that brick shell in white Valpantena stone, upgrading a working checkpoint into a monument worthy of the Cardo Maximus it guarded. By 117 CE its stone-faced towers had watched over the road toward Aquileia for roughly a century, long before medieval Veronese noticed carved lions nearby and gave the gate the name it still carries.",
  },
  "Teatro Romano": {
    english: "Roman Theatre",
    category: "theater",
    extant_117ce: true,
    built: -10,
    description:
      "Verona's builders cut this theatre into the slope of the Colle San Pietro at the end of the 1st century BCE, under Augustus, making it the oldest structure standing in the city. Rather than raising it on vaulted substructures, they shaped the tiered seating straight into the hillside in the older Greek manner, holding up to 6,000 spectators above the Adige River. By 117 CE the theatre had already entertained Veronese audiences for more than a century, centuries before it vanished under later houses and was dug back into view by a 19th-century merchant.",
  },
  "Tempio di Giove Lustrale": {
    english: "Temple of Jupiter Lustralis",
    category: "temple",
    extant_117ce: true,
    built: 30,
    description:
      "Roman Verona built this temple to Jupiter Lustralis in the first half of the 1st century CE, raising it on a tall podium beside the Via Postumia as part of a citywide push to monumentalize its main artery. The temple took its epithet from the lustratio, a purification rite in which priests sprinkled worshippers with water and laurel branches, and it stood close enough to the nearby city gate that Romans simply called that gate Porta Iovia after it. By 117 CE the temple had presided over its stretch of road for roughly a century, its mysterious underground chamber still in cultic use.",
  },
};

/** Look up a matching description for an OSM building name. */
export function veronaEntry(name: string | null | undefined, _osmId?: number): VeronaEntry | undefined {
  if (!name) return undefined;
  // "Museo archeologico al Teatro Romano" is the modern archaeological museum overlooking the
  // theatre (a former convent building), not the ancient theatre itself — excluded before the
  // substring matcher runs so it doesn't inherit the theatre's own description.
  if (name.includes("Museo archeologico")) return undefined;
  const keys = Object.keys(VERONA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return VERONA_LOOKUP[k];
  }
  return undefined;
}

import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { SITE_URL } from "../siteUrl";
import { SITES } from "../sites";

/** [09-P2-8] how-we-know — a public methodology page. Roman Maps makes a lot of specific claims
 * (a building's exact founding year, whether it was still standing on one particular day in 117
 * CE, a governor's name) and a reader has no way to tell a well-sourced one from a guess just by
 * looking at the map. This page explains the rules the project holds itself to, the same rules
 * SHIFT_BRIEF.md and BOARD.md enforce on every contributor, in plain language for a visitor who
 * has never seen either file. Numbers below are computed from the real data at build time —
 * `scripts/metrics.mjs`'s own argument for why a number is worth publishing at all: a hand-kept
 * count goes stale the moment the data grows past it. */

function dataPath(name: string): string {
  return path.join(process.cwd(), "public", "data", name);
}

function loadPois(): { properties: Record<string, any> }[] {
  const raw = readFileSync(dataPath("pois.geojson"), "utf8");
  return (JSON.parse(raw) as { features: { properties: Record<string, any> }[] }).features;
}

export const metadata: Metadata = {
  title: "How We Know — Roman Maps",
  description:
    "The sourcing rules, confidence levels, and 117 CE snapshot discipline behind every place on Roman Maps.",
  alternates: { canonical: "/how-we-know" },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/how-we-know`,
    siteName: "Roman Maps",
    title: "How We Know — Roman Maps",
    description:
      "The sourcing rules, confidence levels, and 117 CE snapshot discipline behind every place on Roman Maps.",
    locale: "en",
  },
  twitter: {
    card: "summary",
    title: "How We Know — Roman Maps",
    description:
      "The sourcing rules, confidence levels, and 117 CE snapshot discipline behind every place on Roman Maps.",
  },
};

const label = { fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 0.6, color: "#8a7a60" };
const h2 = { fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 0.6, color: "#8a7a60", margin: "0 0 10px" };
const p = { fontSize: 16, lineHeight: 1.65, margin: "0 0 18px" };

export default function HowWeKnowPage() {
  const pois = loadPois();
  const total = pois.length;
  const withImage = pois.filter((f) => f.properties.image_url).length;
  const withSources = pois.filter((f) => Array.isArray(f.properties.sources) && f.properties.sources.length > 0).length;
  const withAncient = pois.filter((f) => Array.isArray(f.properties.ancient_sources) && f.properties.ancient_sources.length > 0).length;
  const highConfidence = pois.filter((f) => f.properties.confidence === "high");
  const highConfidenceCited = highConfidence.filter((f) => Array.isArray(f.properties.ancient_sources) && f.properties.ancient_sources.length > 0);
  const curatedSiteCount = SITES.length;
  const thinCount = pois.filter((f) => {
    const notes: string | undefined = f.properties.notes;
    if (!notes) return true;
    return notes.trim().split(/\s+/).length < 60;
  }).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Know",
    description: metadata.description,
    url: `${SITE_URL}/how-we-know`,
  };

  return (
    <main style={{ minHeight: "100%", background: "#f4ead5", color: "#2a2118" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Link href="/" style={{ display: "inline-block", marginBottom: 32, fontSize: 14, color: "#8a5a2b", textDecoration: "none" }}>
          &larr; Back to the map
        </Link>

        <div style={{ height: 6, borderRadius: 3, background: "linear-gradient(90deg, #8a5a2b 0%, #8a5a2b66 100%)", marginBottom: 28 }} />

        <div style={{ ...label, marginBottom: 6 }}>Roman Maps explains</div>
        <h1 className="roman-label" style={{ fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.15, margin: "0 0 12px" }}>
          How We Know
        </h1>
        <p style={{ fontSize: 17, color: "#6b5a42", margin: "0 0 28px", lineHeight: 1.5 }}>
          Every claim on this map — a founding date, a governor's name, whether a building was
          still standing on one particular day — traces back to a real source. Here's the
          discipline behind that.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>The one rule that shapes everything else</h2>
          <p style={p}>
            Roman Maps is frozen at a single moment: <strong>11 August 117 CE</strong>, the day
            the emperor Trajan died at Selinus in Cilicia. It is not a timeline and it does not
            blur centuries together. Every record on the map carries a plain{" "}
            <code>extant_117ce</code> flag — standing on that exact day, or not.
          </p>
          <p style={p}>
            That single rule forces real judgment calls, and we make them the same way every
            time. A building finished before 117 is <strong>true</strong>. A building finished
            after — the Pantheon as it looks today (126 CE), the Colosseum's later renovations,
            Hadrian's Wall (begun 122) — is <strong>false</strong>, even though it is often the
            more famous version of the building. A building destroyed before 117 — Pompeii,
            buried in 79 CE — is also <strong>false</strong>, but we still show it, because it
            was still a real place in Roman memory. A building under construction right at the
            snapshot gets a note explaining exactly how far along the work was, rather than a
            flat yes or no. When the evidence doesn't clearly settle it, we default to{" "}
            <strong>false</strong> and say why in the description — the safer wrong answer is the
            one that undersells a monument, not the one that shows something too early.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>Where the map itself comes from</h2>
          <p style={p}>
            The base geography — coastlines, rivers, provinces, the road network — is assembled
            from open scholarly and cartographic datasets: <strong>Itiner-e</strong> and{" "}
            <strong>Pelagios</strong> for Roman roads, the <strong>DARE</strong> (Digital Atlas of
            the Roman Empire) project for province boundaries and the ancient gazetteer,{" "}
            <strong>Natural Earth</strong> for coastlines and physical geography, and{" "}
            <strong>OpenStreetMap</strong> contributors for the building-by-building street plans
            of the {curatedSiteCount} archaeological sites you can walk through at full zoom —
            Ostia, Pompeii, Ephesus, Palmyra, and the rest. None of that is invented; all of it is
            checked against the ancient footprint before it ships, and every layer's source is
            named in the map's own attribution strip.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>Two kinds of source, kept separate</h2>
          <p style={p}>
            Click any curated place and you'll usually find two different source blocks, and
            they answer two different questions. <strong>Sources</strong> is where we found the
            facts — modern scholarship, excavation reports, museum records, the reference works
            that establish a date or an identification. <strong>In ancient writing</strong> is
            different: a passage from a Roman-era author, inscription, or papyrus that mentions
            the place directly — Suetonius on the Basilica Julia, a milestone naming a road
            station, a graffito naming a house's owner. Not every place has one; ancient authors
            wrote about famous temples and forums far more than they wrote about ordinary
            frontier forts, and we don't invent a citation to fill the gap.
          </p>
          <p style={p}>
            As of today, <strong>{withSources.toLocaleString()}</strong> of{" "}
            {total.toLocaleString()} curated places ({Math.round((withSources / total) * 100)}%)
            carry a modern source, and <strong>{withAncient.toLocaleString()}</strong> of them ({Math.round((withAncient / total) * 100)}%) quote
            an ancient author or inscription directly, and{" "}
            <strong>{highConfidenceCited.length} of {highConfidence.length}</strong> of our
            highest-confidence records ({Math.round((highConfidenceCited.length / Math.max(highConfidence.length, 1)) * 100)}%)
            now carry that ancient-source citation — a number we track as a standing target, not
            a finished total, because it only ever goes up as research continues.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>Confidence, honestly labeled</h2>
          <p style={p}>
            Every curated record carries a <strong>confidence</strong> rating — high, medium, or
            low — based on how firmly its location and identification are established in the
            record.<strong> High</strong> means excavated, securely identified, and precisely
            located. <strong>Medium</strong> means the identification is generally accepted but
            the exact spot or date has some give. <strong>Low</strong> means "somewhere in this
            valley" or "named in a text but never excavated" — we still show it, because a
            documented uncertain location is more honest than pretending the place doesn't exist,
            but we say plainly that it's uncertain. This label never appears as jargon on the
            place card itself — no visitor should have to learn what "confidence: medium" means
            just to read a description — but it drives which places get a precise pin versus an
            approximate one, and it's always available in the place's own data record for anyone
            who wants to check our work.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>Images</h2>
          <p style={p}>
            <strong>{withImage.toLocaleString()}</strong> of {total.toLocaleString()} curated
            places ({Math.round((withImage / total) * 100)}%) carry a real image — a scholarly
            reconstruction drawing, a 19th-century engraving, or a modern photograph of the actual
            ruin, sourced from Wikimedia Commons and credited by name underneath. We do not use
            AI-generated images, stock photography standing in for a specific site, or modern
            photographs that show visibly modern infrastructure where an ancient one should be —
            a wrong picture is worse than no picture, so a place with no verified image gets a
            plain tinted rail instead of a guess.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>What's still incomplete</h2>
          <p style={p}>
            This map is built in public, in ongoing research shifts, and we'd rather say what's
            missing than paper over it. Some provinces have no securely dated 117 CE governor in
            the surviving record at all — we leave those blank rather than guess a name.
            Inscriptions and literary mentions run out for entire categories of place (tombs,
            villas, shipwrecks) where ancient authors simply had no reason to write about them.
            <strong> {thinCount} places</strong> still have a description under 60 words, and
            that number is a live work queue, not a hidden one — <code>npm run metrics</code>{" "}
            prints it fresh every time it runs, the same script that generated the counts on this
            page.
          </p>
          <p style={p}>
            When we get something wrong, we don't quietly delete it — we correct it in a follow-up
            commit and note the correction in the project's own running shift log, the same
            standard a Wikipedia talk page holds itself to. If you find an error, the map's data
            files are what actually ship — there is no separate "true" answer hidden somewhere
            else.
          </p>
        </section>

        <section style={{ marginBottom: 20 }}>
          <h2 style={h2}>Read more</h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>
              <Link href="/hub/117-ce" style={{ color: "#8a5a2b", textDecoration: "none", fontSize: 14.5 }}>
                Why the map is frozen on 11 August 117 CE &rarr;
              </Link>
            </li>
            <li>
              <Link href="/hub/roman-roads" style={{ color: "#8a5a2b", textDecoration: "none", fontSize: 14.5 }}>
                The Roman Road Network &rarr;
              </Link>
            </li>
          </ul>
        </section>

        <p style={{ marginTop: 40, fontSize: 13, color: "#8a7a60" }}>
          Roman Maps shows the empire frozen at 11 August 117 CE, the day Trajan died — its
          moment of greatest territorial extent.{" "}
          <Link href="/" style={{ color: "#8a5a2b" }}>
            Explore the full map &rarr;
          </Link>
        </p>
      </div>
    </main>
  );
}

# Roman Maps — SEO Log

*Started 2026-08-15 by the daily sweep. Brief: `/Volumes/EOS_DIGITAL/SEO-DOCTRINE.md`.*

---

## 2026-08-15 — first sweep. The site had no SEO surface at all.

**Canonical host, confirmed at run time:** `https://romanmaps.vercel.app`, from
`SHIFT_BRIEF.md` line 3 and a live 200. No custom domain is attached. Local was
**51 commits behind `origin/main`** and was fast-forwarded before anything was
judged — the four cloud shifts push straight to origin, so reading the local
clone without fetching would have described a three-day-old site.

### The finding, and it is structural

**Roman Maps is one indexable page.** Not "mostly unindexed" — *unindexable
beyond a single URL*. `find app -name page.tsx` returns exactly one route.
Every archaeological site, every one of the ~16,000 gazetteer places and all
20-odd data layers are reached through client-side state and a
`#lng,lat,zoomz` location hash. **Search engines discard hashes.** There is
nothing for a search for "Leptis Magna" or "plan of Pompeii" to land on.

Before today it also had, in production:

| | before | after this run |
|---|---|---|
| `robots.txt` | **404** | added (`app/robots.ts`) |
| `sitemap.xml` | **404** | added (`app/sitemap.ts`), 1 URL — honestly 1 |
| canonical | **none** | self-referencing `/` |
| `metadataBase` | **none** | set from one constant |
| description | one line, 47 chars | a real 190-char description |
| OpenGraph / Twitter | **none** | added, no fake image reference |

**Nothing was measured.** Roman Maps has no Search Console property and no
analytics this routine can read, so there are **no traffic numbers in this
entry and none should be inferred.** Given a 404 robots.txt and no sitemap
until today, the prior is that indexing is near zero, but that is a prior and
not a measurement.

### Changed this run

- **`app/siteUrl.ts`** (new) — one exported `SITE_URL`. `metadataBase`,
  `robots.ts` and `sitemap.ts` all derive from it. Hard-coding a host in three
  files is how a site ends up split across two addresses in the index.
- **`app/robots.ts`** (new) — allow all, declares the sitemap.
- **`app/sitemap.ts`** (new) — the one real URL. **No `lastModified` stamped.**
  The app changes most days but a date rewritten on every build is a synthetic
  freshness signal; the doctrine forbids it and Bilbo has already been burned
  by exactly that on 947 URLs.
- **`app/layout.tsx`** — canonical, metadataBase, a truthful description
  naming what is actually on the map (provinces, roads, rivers, the gazetteer,
  40 street-level sites), OpenGraph and Twitter cards. `twitter.card` is
  `summary`, not `summary_large_image`: **there is no OG image in `public/`**
  and declaring one that does not exist is worse than declaring none.
- **`FEATURE_BACKLOG.md`** — added a P2 item for the real fix: `/site/[slug]`
  server-rendered pages for the 40 sites in `app/sites.ts`, then list them in
  the sitemap. Explicitly warns against generating 16,000 gazetteer stubs,
  which would be index bloat rather than coverage.

### Not done, deliberately

- **The per-site routes themselves.** That is a feature, it belongs to a cloud
  shift working from `FEATURE_BACKLOG.md`, and writing it inside an SEO sweep
  would be the sweep doing product work it cannot then verify. Handed off.
- **No build, no deploy** — per the operating cycle. `npx tsc --noEmit` passes
  clean; the repo's own `pre-push` hook runs the real `next build` at push
  time, which is the correctness gate this routine is allowed to lean on.
- **No IndexNow / no Search Console submission.** There is no verified property
  for this host. See blocked, below.

### Blocked — needs Pedro, one action

- **Add `romanmaps.vercel.app` to Google Search Console and submit the
  sitemap.** Until that exists this property cannot be measured at all, and
  every future entry in this log will say "not measured" for the same reason.
  It is a one-time verification. **This line repeats every run until it is
  done.**

### For the next sweep

- Re-check that `/robots.txt` and `/sitemap.xml` return 200 in production once
  the 19:00 publisher has shipped. They are code routes, not static files, so
  they only exist after a deploy.
- If the `/site/[slug]` backlog item has shipped, the sitemap must grow from 1
  URL to 41 in the same run — a shipped feature that never reaches the sitemap
  is the failure mode to watch for.

---

## 2026-08-25 — every `/place/[slug]` page was titled in Latin

Flagged by cloud shift 55, fixed by the following cloud shift (this run). By the time
`app/place/[slug]/page.tsx` landed (per the 2026-08-15 sweep's own "next sweep" note above),
its name resolution read `p.name_latin || p.name_english`, backwards from invariant 1.5's
explicit rule (English-standard display name; ancient name lives in the subtitle/body). That
one line drove five surfaces at once, all now swapped to `name_english || name_latin`:

- `<title>` and `<h1>` on all 576 `/place/[slug]` pages — the Colosseum's page was titled
  **"Amphitheatrum Flavium — Roman Maps"**, Paestum's **"Templum Neptuni"**. Verified in a
  clean `next build`: `colosseum.html`'s `<title>` now reads **"Colosseum (Flavian
  Amphitheatre) — Roman Maps"**, with `Amphitheatrum Flavium` demoted to the subtitle line
  exactly as the Baths of Neptune / other already-correct city pages do.
- OpenGraph and Twitter card `title`, and the JSON-LD `Place.name` — same page, same string,
  so the same fix covers all three; these are what a shared link preview and a rich-result
  snippet show, not just what a human reader sees on the page.
- The "Nearby" card row on that same page (`nName`), which was showing Latin names for the six
  related-place cards under every listing.
- `app/PlaceDetails.tsx` — the live map's click-through card, the single most-viewed curated-POI
  surface on the site, had the identical `name_latin || name_english` line; same swap, subtitle
  now correctly shows the Latin name only when it differs from the English one.
- `app/province/[slug]/page.tsx` — the "N places on the map" list on each of the 41 province
  pages sorted and displayed by Latin name; same fix, alphabetical order changes for any
  province page where a place's English name doesn't share its first letter with the Latin one.
- `app/Chrome.tsx`'s `selectedName` (desktop header, once a place is selected) — same bug,
  same fix.

**Not touched, deliberately**: `app/places.ts::loadPois()` (`modern: props.name_english`) was
already correct — the general search index's curated-result path never had this bug. The raw
16k-point gazetteer's `Place.latin`/`Place.modern` fields (`app/places.ts::loadPlaces()`,
`places_medium.geojson`) and every UI surface that reads them (search dropdown, nearby list,
context-menu nearest-place label, `PlacesInViewList`) were left as-is: that is a different data
source with no `pois.geojson`-style guaranteed English name for every record, out of this
fix's scope, and a systemic rewrite of that fallback order needs its own considered pass rather
than a drive-by inside an SEO fix. `Map.tsx`'s marker labels, hover popups, and `TourPlayer.tsx`
already used the correct `name_english || name_latin` order — spot-checked while auditing, not
part of the bug.

**Verified**: clean `next build` (676 static pages, 576 of them `/place/[slug]`), `npm run
validate` unchanged (17 warnings, same set as before this fix — nothing new). Spot-checked
`colosseum.html`'s rendered `<title>` and `<h1>` directly out of `.next/server/app/place/`
rather than trusting the diff alone.

This was cloud shift 55's own recommended next pick (see `SHIFT_LOG.md`, "Found, not fixed"),
logged there as the highest-value unclaimed item because it costs real value on every one of
576 already-indexed pages: `<title>`, `<h1>`, OG/Twitter title, and JSON-LD `name` all read
backwards from what a searcher actually types.

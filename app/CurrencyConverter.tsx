"use client";

import { useState } from "react";

/** Roman monetary system, 117 CE: 1 aureus = 25 denarii = 100 sestertii = 400 asses.
 * Values expressed in denarii (the base unit here) for easy cross-conversion. */
type Denomination = "as" | "sestertius" | "denarius" | "aureus";

const IN_DENARII: Record<Denomination, number> = {
  as: 1 / 16,
  sestertius: 1 / 4,
  denarius: 1,
  aureus: 25,
};

const LABELS: Record<Denomination, { singular: string; plural: string }> = {
  as: { singular: "As", plural: "Asses" },
  sestertius: { singular: "Sestertius", plural: "Sestertii" },
  denarius: { singular: "Denarius", plural: "Denarii" },
  aureus: { singular: "Aureus", plural: "Aurei" },
};

const ORDER: Denomination[] = ["as", "sestertius", "denarius", "aureus"];

// Rough modern equivalent, grain-purchasing-power method: a modius of wheat cost about 3 denarii
// in mid-1st-century Rome (Roman Empire price data, GPIH database; Pliny the Elder, Natural
// History 18.90). Priced against modern wheat/bread cost, that puts one denarius at roughly
// $20-28 today — a commonly used estimate, not a precise figure. Currency-across-two-millennia
// conversion has no single right answer; this app picks one defensible, sourced method and says
// so rather than presenting false precision.
const USD_PER_DENARIUS_LOW = 20;
const USD_PER_DENARIUS_HIGH = 28;

// [07-P1-3] Prices & wages — real attested figures from the same broad period (late 1st/early
// 2nd c. CE), each tied to a named ancient source rather than Diocletian's 301 CE Price Edict
// (184 years past this map's 117 CE snapshot, and the single most commonly misused "Roman
// prices" source online). Kept to a short list of well-attested figures rather than padded with
// single-source estimates — "real data or don't include it."
type PriceItem = { label: string; asses: number; note: string; source: string };

const PRICE_ITEMS: PriceItem[] = [
  {
    label: "A legionary's yearly pay",
    asses: 300 * 16,
    note: "Domitian raised the legionary stipendium from 225 to 300 denarii a year in 84 CE, the rate still standing under Trajan.",
    source: "Suetonius, Domitian 7.3",
  },
  {
    label: "A modius of wheat (~6.5kg)",
    asses: 40,
    note: "Pliny the Elder's benchmark for an ordinary, unremarkable grain price at Rome.",
    source: "Pliny the Elder, Natural History 18.90",
  },
  {
    label: "A sextarius (~0.5L) of house wine",
    asses: 1,
    note: "A Pompeii tavern's price list, scratched on the wall: an as for house wine, two for better, four for Falernian.",
    source: "CIL IV 1679",
  },
  {
    label: "A day's unskilled labor",
    asses: 16,
    note: "The standard day-wage for a hired hand, a denarius, appears as an unremarkable fact of life in the era's writing.",
    source: "Matthew 20:2",
  },
];

const STORAGE_KEY = "roman-maps:currency-unit";

function readStoredUnit(): Denomination {
  if (typeof window === "undefined") return "denarius";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw && ORDER.includes(raw as Denomination) ? (raw as Denomination) : "denarius";
}

function formatAmount(n: number): string {
  if (!isFinite(n)) return "0";
  if (n === 0) return "0";
  if (n >= 100) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (n >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return n.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

/** Google-Business-panel-style Roman currency converter — lives inside Chrome.tsx's hamburger
 * menu, next to the distance-units toggle. Educational, not a precise financial tool: ancient
 * purchasing power doesn't map cleanly onto a modern dollar, so this shows the fixed Roman
 * denomination ratios (exact, uncontroversial) plus one clearly-labeled, sourced estimate for a
 * rough modern-dollar sense of scale. */
export default function CurrencyConverter() {
  const [expanded, setExpanded] = useState(false);
  const [unit, setUnit] = useState<Denomination>(readStoredUnit);
  const [amountStr, setAmountStr] = useState("1");

  const amount = parseFloat(amountStr) || 0;
  const inDenarii = amount * IN_DENARII[unit];
  const usdLow = inDenarii * USD_PER_DENARIUS_LOW;
  const usdHigh = inDenarii * USD_PER_DENARIUS_HIGH;

  const setUnitPersist = (u: Denomination) => {
    setUnit(u);
    try {
      window.localStorage.setItem(STORAGE_KEY, u);
    } catch {
      // ignore quota/private-mode errors
    }
  };

  return (
    <div style={{ borderTop: "1px solid var(--divider)" }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-strong)",
        }}
      >
        Roman currency
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="var(--icon)"
          style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 120ms" }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ fontSize: 11, color: "var(--text-2)", marginBottom: 10 }}>
            1 aureus = 25 denarii = 100 sestertii = 400 asses
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <input
              type="number"
              min={0}
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              style={{
                width: 70,
                height: 32,
                borderRadius: 6,
                border: "1px solid var(--divider)",
                padding: "0 8px",
                fontSize: 13,
                color: "var(--text)",
              }}
            />
            <select
              value={unit}
              onChange={(e) => setUnitPersist(e.target.value as Denomination)}
              style={{
                flex: 1,
                height: 32,
                borderRadius: 6,
                border: "1px solid var(--divider)",
                padding: "0 6px",
                fontSize: 13,
                color: "var(--text)",
                background: "var(--surface)",
              }}
            >
              {ORDER.map((u) => (
                <option key={u} value={u}>
                  {LABELS[u].plural}
                </option>
              ))}
            </select>
          </div>

          <div style={{ background: "var(--surface-3)", borderRadius: 6, padding: "8px 10px", marginBottom: 8 }}>
            {ORDER.map((u) => {
              const val = inDenarii / IN_DENARII[u];
              const lbl = val === 1 ? LABELS[u].singular : LABELS[u].plural;
              return (
                <div
                  key={u}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "var(--text)",
                    padding: "3px 0",
                  }}
                >
                  <span style={{ color: "var(--text-2)" }}>{lbl}</span>
                  <span style={{ fontWeight: 500 }}>{formatAmount(val)}</span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 4 }}>
            ≈ ${formatAmount(usdLow)}–${formatAmount(usdHigh)} today
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-3)", lineHeight: 1.4 }}>
            Rough estimate based on the purchasing power of wheat in 117 CE, when a modius (~6.5kg)
            cost about 3 denarii. Converting ancient money to modern dollars has no single right
            answer — treat this as a sense of scale, not an exchange rate.
          </div>

          <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--divider)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-strong)", marginBottom: 8 }}>
              What things cost
            </div>
            {PRICE_ITEMS.map((item) => {
              const itemDenarii = item.asses / 16;
              const buys = itemDenarii > 0 ? inDenarii / itemDenarii : 0;
              return (
                <div key={item.label} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--text)" }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: 500, flexShrink: 0, marginLeft: 8 }}>
                      {formatAmount(itemDenarii)} den.
                    </span>
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--text-3)", lineHeight: 1.35, marginTop: 1 }}>
                    {item.note} <span style={{ fontStyle: "italic" }}>({item.source})</span>
                    {amount > 0 && buys >= 0.1 && (
                      <> — your amount above buys about {formatAmount(buys)} of these.</>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

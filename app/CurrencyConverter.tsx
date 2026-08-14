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
    <div style={{ borderTop: "1px solid #e8eaed" }}>
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
          color: "#3c4043",
        }}
      >
        Roman currency
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#5f6368"
          style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 120ms" }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ fontSize: 11, color: "#5f6368", marginBottom: 10 }}>
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
                border: "1px solid #dadce0",
                padding: "0 8px",
                fontSize: 13,
                color: "#202124",
              }}
            />
            <select
              value={unit}
              onChange={(e) => setUnitPersist(e.target.value as Denomination)}
              style={{
                flex: 1,
                height: 32,
                borderRadius: 6,
                border: "1px solid #dadce0",
                padding: "0 6px",
                fontSize: 13,
                color: "#202124",
                background: "#fff",
              }}
            >
              {ORDER.map((u) => (
                <option key={u} value={u}>
                  {LABELS[u].plural}
                </option>
              ))}
            </select>
          </div>

          <div style={{ background: "#f8f9fa", borderRadius: 6, padding: "8px 10px", marginBottom: 8 }}>
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
                    color: "#202124",
                    padding: "3px 0",
                  }}
                >
                  <span style={{ color: "#5f6368" }}>{lbl}</span>
                  <span style={{ fontWeight: 500 }}>{formatAmount(val)}</span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: 13, color: "#1a73e8", fontWeight: 600, marginBottom: 4 }}>
            ≈ ${formatAmount(usdLow)}–${formatAmount(usdHigh)} today
          </div>
          <div style={{ fontSize: 10.5, color: "#80868b", lineHeight: 1.4 }}>
            Rough estimate based on the purchasing power of wheat in 117 CE, when a modius (~6.5kg)
            cost about 3 denarii. Converting ancient money to modern dollars has no single right
            answer — treat this as a sense of scale, not an exchange rate.
          </div>
        </div>
      )}
    </div>
  );
}

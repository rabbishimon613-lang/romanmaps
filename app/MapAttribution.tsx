"use client";

/** Google-Maps-style bottom attribution row: gray text on translucent white, 12px, hugs the bottom. */
export default function MapAttribution() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 60,
        right: 0,
        height: 22,
        background: "rgba(255,255,255,.85)",
        color: "#5f6368",
        fontSize: 11,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 12,
        zIndex: 3,
        pointerEvents: "auto",
        userSelect: "none",
      }}
    >
      <span style={{ fontWeight: 500 }}>Roman Maps</span>
      <span style={{ opacity: 0.7 }}>·</span>
      <span>117 CE snapshot</span>
      <span style={{ opacity: 0.7 }}>·</span>
      <span>
        Data ©{" "}
        <a href="https://itiner-e.org" target="_blank" rel="noopener noreferrer" style={{ color: "#5f6368", textDecoration: "underline" }}>
          Itiner-e
        </a>{" "}
        ·{" "}
        <a href="https://dh.gu.se/dare/" target="_blank" rel="noopener noreferrer" style={{ color: "#5f6368", textDecoration: "underline" }}>
          DARE
        </a>{" "}
        ·{" "}
        <a href="https://pelagios.org" target="_blank" rel="noopener noreferrer" style={{ color: "#5f6368", textDecoration: "underline" }}>
          Pelagios
        </a>{" "}
        · OSM contributors
      </span>
    </div>
  );
}

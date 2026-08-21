// Shared emblem for every generated icon size (favicon, apple touch icon, PWA manifest icons).
// Parchment medallion + laurel ring matches the map's own light-mode land color (`#f4ead5`,
// see app/Map.tsx's LIGHT palette) rather than the blue Google-Maps chrome tokens, since this is
// the product's own mark, not a piece of UI chrome bound by invariant 0's "no literal colors in
// chrome" rule. The ring sits well inside an 80%-of-canvas safe zone so OS icon masks (circle,
// squircle, rounded square) never clip it.
export function AppIconMark({ size, fill = true }: { size: number; fill?: boolean }) {
  const ring = Math.round(size * 0.74);
  const stroke = Math.max(2, Math.round(size * 0.045));
  const glyph = Math.round(size * 0.4);
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: fill ? "#f4ead5" : "transparent",
      }}
    >
      <div
        style={{
          width: ring,
          height: ring,
          borderRadius: "50%",
          border: `${stroke}px solid #7a2e2e`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "serif",
            fontWeight: 700,
            fontSize: glyph,
            color: "#7a2e2e",
            lineHeight: 1,
          }}
        >
          M
        </span>
      </div>
    </div>
  );
}

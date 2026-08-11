"use client";

export default function Chrome() {
  return (
    <>
      {/* Top-left: search card, exactly like Google Maps */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          width: 408,
          maxWidth: "calc(100vw - 20px)",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 3px 8px rgba(0,0,0,.15)",
          zIndex: 5,
          overflow: "hidden",
        }}
      >
        {/* Search row */}
        <div style={{ display: "flex", alignItems: "center", height: 48, padding: "0 4px 0 14px" }}>
          {/* Menu (hamburger) */}
          <IconBtn label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </IconBtn>
          <input
            placeholder="Search Roman Maps"
            style={{
              flex: 1,
              height: "100%",
              border: 0,
              outline: "none",
              padding: "0 12px",
              fontSize: 16,
              color: "#202124",
              background: "transparent",
            }}
          />
          <IconBtn label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4285f4">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </IconBtn>
          <div style={{ width: 1, height: 24, background: "#e0e0e0", margin: "0 4px" }} />
          <button
            title="Directions"
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
              background: "#4285f4",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.41 0l-9 9a1 1 0 0 0 0 1.41l9 9a1 1 0 0 0 1.41 0l9-9a1 1 0 0 0 0-1.41zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom-left: epoch pill */}
      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 24,
          background: "#fff",
          borderRadius: 999,
          padding: "8px 14px",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          fontSize: 13,
          color: "#3c4043",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 5,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "#b0431a" }} />
        <strong style={{ fontWeight: 600 }}>117 CE</strong>
        <span style={{ color: "#5f6368" }}>· The Empire at its peak</span>
      </div>

      {/* Bottom-right: layers button (above zoom controls) */}
      <button
        title="Layers"
        style={{
          position: "absolute",
          right: 12,
          bottom: 118,
          width: 40,
          height: 40,
          borderRadius: 8,
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          display: "grid",
          placeItems: "center",
          zIndex: 5,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
          <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" />
        </svg>
      </button>

      {/* Bottom-right: mini attribution / brand */}
      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 8,
          fontSize: 10,
          color: "#5f6368",
          zIndex: 4,
        }}
      >
        Roman Maps
      </div>
    </>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      title={label}
      style={{ width: 40, height: 40, borderRadius: 999, display: "grid", placeItems: "center" }}
    >
      {children}
    </button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { useUnits } from "./useUnits";
import { loadPlaces, searchPlaces, type Place } from "./places";
import { LAYER_GROUPS, toggleLayer, useLayers } from "./useLayers";

export default function Chrome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [units, setUnits] = useUnits();
  const menuRef = useRef<HTMLDivElement>(null);

  const [layersOpen, setLayersOpen] = useState(false);
  const layers = useLayers();
  const layersRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!resultsOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setResultsOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [resultsOpen]);

  useEffect(() => {
    if (!layersOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (layersRef.current && !layersRef.current.contains(e.target as Node)) setLayersOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLayersOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [layersOpen]);

  const onQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    if (!value.trim()) {
      setResults([]);
      setResultsOpen(false);
      return;
    }
    loadPlaces().then((places) => {
      setResults(searchPlaces(places, value));
      setResultsOpen(true);
    });
  };

  const flyToPlace = (p: Place) => {
    const map = (window as any).__map as MLMap | undefined;
    if (map) map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 7.5), duration: 1000 });
    setQuery(p.latin || p.modern);
    setResultsOpen(false);
    setActiveIndex(-1);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!resultsOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = results[activeIndex] ?? results[0];
      if (chosen) flyToPlace(chosen);
    } else if (e.key === "Escape") {
      setResultsOpen(false);
    }
  };

  return (
    <>
      {/* Top-left: search card, exactly like Google Maps */}
      <div
        ref={menuRef}
        style={{
          position: "absolute",
          top: 10,
          left: 70,
          width: 408,
          maxWidth: "calc(100vw - 20px)",
          zIndex: 5,
        }}
      >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 3px 8px rgba(0,0,0,.15)",
          overflow: "hidden",
        }}
      >
        {/* Search row */}
        <div style={{ display: "flex", alignItems: "center", height: 48, padding: "0 4px 0 14px" }}>
          {/* Menu (hamburger) */}
          <IconBtn label="Menu" onClick={() => setMenuOpen((o) => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </IconBtn>
          <input
            placeholder="Search Roman Maps"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => results.length > 0 && setResultsOpen(true)}
            onKeyDown={onSearchKeyDown}
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
          <IconBtn label="Search" onClick={() => results[0] && flyToPlace(results[0])}>
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

      {resultsOpen && results.length > 0 && (
        <div
          style={{
            marginTop: 8,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 3px 8px rgba(0,0,0,.15)",
            overflow: "hidden",
          }}
        >
          {results.map((p, i) => {
            const name = p.latin || p.modern || "Unknown";
            const subtitle = p.modern && p.modern !== p.latin ? `Today: ${p.modern}` : "";
            return (
              <button
                key={p.id}
                onClick={() => flyToPlace(p)}
                onMouseEnter={() => setActiveIndex(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  height: 48,
                  padding: "0 14px",
                  textAlign: "left",
                  background: activeIndex === i ? "#f1f3f4" : "transparent",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368" style={{ flexShrink: 0 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                </svg>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: 14, color: "#202124", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {name}
                  </div>
                  {subtitle && (
                    <div style={{ fontSize: 12, color: "#5f6368", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {subtitle}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {menuOpen && (
        <div
          style={{
            marginTop: 8,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 3px 8px rgba(0,0,0,.15)",
            padding: "8px 0",
            width: 260,
            maxWidth: "calc(100vw - 20px)",
          }}
        >
          <div style={{ padding: "6px 16px 10px", fontSize: 13, fontWeight: 600, color: "#3c4043" }}>
            Distance units
          </div>
          <div style={{ display: "flex", gap: 8, padding: "0 12px 8px" }}>
            {(["km", "mi"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  background: units === u ? "#e8f0fe" : "#f1f3f4",
                  color: units === u ? "#1a73e8" : "#3c4043",
                }}
              >
                {u === "km" ? "Kilometers" : "Miles"}
              </button>
            ))}
          </div>
        </div>
      )}
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

      {/* Bottom-right: layers button (above zoom controls) + panel */}
      <div ref={layersRef} style={{ position: "absolute", right: 12, bottom: 118, zIndex: 5 }}>
        {layersOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 48,
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 1px 4px -1px rgba(0,0,0,.3), 0 3px 8px rgba(0,0,0,.15)",
              padding: "8px 0",
              width: 220,
            }}
          >
            <div style={{ padding: "6px 16px 10px", fontSize: 13, fontWeight: 600, color: "#3c4043" }}>
              Layers
            </div>
            {LAYER_GROUPS.map((g) => (
              <label
                key={g.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 16px",
                  fontSize: 13,
                  color: "#3c4043",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={layers[g.id]}
                  onChange={() => toggleLayer(g.id)}
                  style={{ width: 16, height: 16, cursor: "pointer" }}
                />
                {g.label}
              </label>
            ))}
          </div>
        )}
        <button
          title="Layers"
          onClick={() => setLayersOpen((o) => !o)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: layersOpen ? "#e8f0fe" : "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,.2)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={layersOpen ? "#1a73e8" : "#5f6368"}>
            <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" />
          </svg>
        </button>
      </div>

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

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      style={{ width: 40, height: 40, borderRadius: 999, display: "grid", placeItems: "center" }}
    >
      {children}
    </button>
  );
}

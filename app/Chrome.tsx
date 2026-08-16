"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { useUnits } from "./useUnits";
import { loadPlaces, searchPlaces, type Place } from "./places";
import { clearOverlays, countActiveOverlays, LAYER_GROUPS, toggleLayer, useLayers } from "./useLayers";
import { CATEGORY_GROUPS } from "./poiCategories";
import { toggleHiddenCategory, useHiddenCategories } from "./useHiddenCategories";
import { useIsMobile } from "./useIsMobile";
import { usePoiPanel } from "./usePoiPanel";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import EpochModal from "./EpochModal";
import CurrencyConverter from "./CurrencyConverter";
import { useOnboardingHint } from "./useOnboardingHint";
import { activateRuler } from "./useRuler";

export default function Chrome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [units, setUnits] = useUnits();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [layersOpen, setLayersOpen] = useState(false);
  const [poiCategoriesExpanded, setPoiCategoriesExpanded] = useState(false);
  const layers = useLayers();
  const overlayCount = countActiveOverlays(layers);
  const hiddenCategories = useHiddenCategories();
  const layersRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const poiOpen = !!usePoiPanel();
  // Hidden while the mobile Place details bottom sheet covers this corner of the screen —
  // same fix applied to ZoomControl/Ruler/Legend, the rest of the bottom-right FAB stack.
  const hideLayersForSheet = isMobile && poiOpen;

  const [epochModalOpen, setEpochModalOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const onboardingHint = useOnboardingHint();

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
    if (onboardingHint.visible) onboardingHint.dismiss();
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

  useKeyboardShortcuts({
    focusSearch: () => searchInputRef.current?.focus(),
    toggleLayersPanel: () => setLayersOpen((o) => !o),
  });

  return (
    <>
      {/* Top-left: search card, exactly like Google Maps. On phones it becomes the full-width
          rounded pill the Maps app uses, inset from the edges and clear of the notch. */}
      <div
        ref={menuRef}
        style={{
          position: "absolute",
          top: isMobile ? "calc(8px + env(safe-area-inset-top))" : 10,
          left: isMobile ? 8 : 70,
          right: isMobile ? 8 : undefined,
          width: isMobile ? undefined : 408,
          maxWidth: isMobile ? undefined : "calc(100vw - 20px)",
          zIndex: 5,
        }}
      >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: isMobile ? 999 : 8,
          boxShadow: "var(--shadow-2)",
          overflow: "hidden",
        }}
      >
        {/* Search row */}
        <div style={{ display: "flex", alignItems: "center", height: isMobile ? 46 : 48, padding: isMobile ? "0 6px" : "0 4px 0 14px" }}>
          {/* Menu (hamburger) */}
          <IconBtn label="Menu" onClick={() => setMenuOpen((o) => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--icon)">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </IconBtn>
          <input
            ref={searchInputRef}
            placeholder="Search Roman Maps"
            title="Search Roman Maps (press / to focus)"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => {
              if (onboardingHint.visible) onboardingHint.dismiss();
              results.length > 0 && setResultsOpen(true);
            }}
            onKeyDown={onSearchKeyDown}
            style={{
              flex: 1,
              height: "100%",
              border: 0,
              outline: "none",
              padding: "0 12px",
              fontSize: 16,
              color: "var(--text)",
              background: "transparent",
            }}
          />
          <IconBtn label="Search" onClick={() => results[0] && flyToPlace(results[0])}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </IconBtn>
        </div>
      </div>

      {onboardingHint.visible && !resultsOpen && !menuOpen && (
        <div
          style={{
            marginTop: 8,
            marginLeft: isMobile ? 4 : 0,
            width: "fit-content",
            maxWidth: "calc(100% - 8px)",
            background: "var(--surface)",
            color: "var(--text-2)",
            borderRadius: 999,
            boxShadow: "var(--shadow-1)",
            padding: "6px 6px 6px 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12.5,
          }}
        >
          <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Try &ldquo;Londinium&rdquo; or &ldquo;Ephesus&rdquo;
          </span>
          <button
            title="Dismiss"
            onClick={onboardingHint.dismiss}
            style={{
              width: 22,
              height: 22,
              flexShrink: 0,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              color: "var(--icon)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      )}

      {resultsOpen && results.length > 0 && (
        <div
          style={{
            marginTop: 8,
            background: "var(--surface)",
            borderRadius: 8,
            boxShadow: "var(--shadow-2)",
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
                  background: activeIndex === i ? "var(--surface-2)" : "transparent",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--icon)" style={{ flexShrink: 0 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                </svg>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: 14, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {name}
                  </div>
                  {subtitle && (
                    <div style={{ fontSize: 12, color: "var(--text-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
            background: "var(--surface)",
            borderRadius: 8,
            boxShadow: "var(--shadow-2)",
            padding: "8px 0",
            width: isMobile ? "100%" : 260,
            maxWidth: "calc(100vw - 20px)",
          }}
        >
          <div style={{ padding: "6px 16px 10px", fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>
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
                  background: units === u ? "var(--accent-bg)" : "var(--surface-2)",
                  color: units === u ? "var(--accent)" : "var(--text-strong)",
                }}
              >
                {u === "km" ? "Kilometers" : "Miles"}
              </button>
            ))}
          </div>

          {/* The ruler's own FAB is desktop-only (the phone corner is a single button), so the
              menu is where measuring lives on mobile. */}
          {isMobile && (
            <button
              onClick={() => {
                setMenuOpen(false);
                activateRuler();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                height: 44,
                padding: "0 16px",
                textAlign: "left",
                fontSize: 13,
                color: "var(--text-strong)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--icon)" style={{ flexShrink: 0 }}>
                <path d="M21.71 2.29a1 1 0 0 0-1.42 0L2.29 20.29a1 1 0 1 0 1.42 1.42L5 20.41l1.29 1.3a1 1 0 0 0 1.42-1.42L6.41 19l2-2 1.3 1.29a1 1 0 0 0 1.4-1.4L9.83 15.6l2-2 1.29 1.29a1 1 0 0 0 1.42-1.42L13.24 12.17l2-2 1.29 1.29a1 1 0 0 0 1.42-1.42L16.66 8.75l2-2 1.29 1.3a1 1 0 0 0 1.42-1.43L20.07 5.3l1.64-1.63a1 1 0 0 0 0-1.38z" />
              </svg>
              Measure distance
            </button>
          )}

          <CurrencyConverter />
        </div>
      )}
      </div>

      {/* Bottom-left: epoch pill — click opens the "Why 117 CE?" explainer */}
      <button
        title="Why 117 CE?"
        onClick={() => setEpochModalOpen(true)}
        style={{
          position: "absolute",
          left: isMobile ? 8 : 72,
          bottom: isMobile ? "calc(26px + env(safe-area-inset-bottom))" : 24,
          background: "var(--surface)",
          borderRadius: 999,
          padding: isMobile ? "6px 12px" : "8px 14px",
          boxShadow: "var(--shadow-1)",
          fontSize: isMobile ? 12 : 13,
          color: "var(--text-strong)",
          display: hideLayersForSheet ? "none" : "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 5,
          cursor: "pointer",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "#b0431a" }} />
        <strong style={{ fontWeight: 600 }}>117 CE</strong>
        {/* The tagline is the first thing to go on a phone — the pill has to stay a pill. */}
        {!isMobile && <span style={{ color: "var(--text-2)" }}>· The Empire at its peak</span>}
      </button>
      {epochModalOpen && <EpochModal onClose={() => setEpochModalOpen(false)} />}

      {/* Layers. Desktop: bottom-right FAB stack. Mobile: the round button Google Maps parks
          under the search pill, top-right, with its panel dropping from there. */}
      {!hideLayersForSheet && (
      <div
        ref={layersRef}
        style={
          isMobile
            ? { position: "absolute", right: 8, top: "calc(62px + env(safe-area-inset-top))", zIndex: 5 }
            : { position: "absolute", right: 12, bottom: 169, zIndex: 5 }
        }
      >
        {layersOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              ...(isMobile ? { top: 52 } : { bottom: 48 }),
              background: "var(--surface)",
              borderRadius: 8,
              boxShadow: "var(--shadow-2)",
              padding: "8px 0",
              width: isMobile ? 250 : 220,
              maxHeight: isMobile ? "60vh" : "70vh",
              overflowY: "auto",
            }}
          >
            <SectionHeader>Base map</SectionHeader>
            {LAYER_GROUPS.filter((g) => g.base).map((g) => (
              <div key={g.id}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 16px",
                    fontSize: 13,
                    color: "var(--text-strong)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={layers[g.id]}
                    onChange={() => toggleLayer(g.id)}
                    style={{ width: 16, height: 16, cursor: "pointer" }}
                  />
                  <span style={{ flex: 1 }}>{g.label}</span>
                  {g.id === "pois" && (
                    <button
                      title={poiCategoriesExpanded ? "Hide landmark categories" : "Show landmark categories"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPoiCategoriesExpanded((v) => !v);
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="var(--icon)"
                        style={{ transform: poiCategoriesExpanded ? "rotate(180deg)" : "none" }}
                      >
                        <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </button>
                  )}
                </label>
                {g.id === "pois" && poiCategoriesExpanded && (
                  <div style={{ paddingBottom: 4 }}>
                    {CATEGORY_GROUPS.map((c) => (
                      <label
                        key={c.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "5px 16px 5px 36px",
                          fontSize: 12.5,
                          color: "var(--text-strong)",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!hiddenCategories.has(c.id)}
                          onChange={() => toggleHiddenCategory(c.id)}
                          style={{ width: 14, height: 14, cursor: "pointer" }}
                        />
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 999,
                            background: c.color,
                            flexShrink: 0,
                            display: "inline-block",
                          }}
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div style={{ height: 1, background: "var(--divider)", margin: "8px 0" }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 16px 10px",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-strong)",
              }}
            >
              <span style={{ flex: 1 }}>
                Overlays{overlayCount > 0 ? ` · ${overlayCount}` : ""}
              </span>
              {overlayCount > 0 && (
                <button
                  onClick={clearOverlays}
                  style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}
                >
                  Clear
                </button>
              )}
            </div>
            {/* Thematic layers, all off by default. Readable one or two at a time — stacking
                them is what made the map unreadable, so they're deliberately a second tier. */}
            {LAYER_GROUPS.filter((g) => !g.base).map((g) => (
              <label
                key={g.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 16px",
                  fontSize: 13,
                  color: "var(--text-strong)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={layers[g.id]}
                  onChange={() => toggleLayer(g.id)}
                  style={{ width: 16, height: 16, cursor: "pointer", flexShrink: 0 }}
                />
                <span style={{ flex: 1 }}>{g.label}</span>
              </label>
            ))}
          </div>
        )}
        <button
          title="Layers"
          onClick={() => setLayersOpen((o) => !o)}
          style={{
            position: "relative",
            width: isMobile ? 44 : 40,
            height: isMobile ? 44 : 40,
            borderRadius: isMobile ? 999 : 8,
            background: layersOpen ? "var(--accent-bg)" : "var(--surface)",
            boxShadow: "var(--shadow-1)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={layersOpen ? "var(--accent)" : "var(--icon)"}>
            <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" />
          </svg>
          {overlayCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                minWidth: 16,
                height: 16,
                padding: "0 4px",
                borderRadius: 999,
                background: "var(--accent)",
                color: "var(--on-accent)",
                fontSize: 10,
                fontWeight: 700,
                display: "grid",
                placeItems: "center",
              }}
            >
              {overlayCount}
            </span>
          )}
        </button>
      </div>
      )}

    </>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "6px 16px 10px", fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>
      {children}
    </div>
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

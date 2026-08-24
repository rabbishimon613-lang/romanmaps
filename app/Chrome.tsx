"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { Map as MLMap } from "maplibre-gl";
import { useUnits } from "./useUnits";
import { loadPlaces, loadPois, searchPlaces, type Place } from "./places";
import { clearOverlays, countActiveOverlays, LAYER_GROUPS, toggleLayer, useLayers } from "./useLayers";
import { CATEGORY_GROUPS } from "./poiCategories";
import { toggleHiddenCategory, useHiddenCategories } from "./useHiddenCategories";
import { useIsMobile } from "./useIsMobile";
import { usePoiPanel, selectPoi, clearPoi } from "./usePoiPanel";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import EpochModal from "./EpochModal";
import Entrance from "./Entrance";
import CurrencyConverter from "./CurrencyConverter";
import SailingSeason from "./SailingSeason";
import ThemeToggle from "./ThemeToggle";
import { useOnboardingHint } from "./useOnboardingHint";
import { useEntrance } from "./useEntrance";
import { activateRuler } from "./useRuler";
import { openTourPanel } from "./useTour";
import { openPlacesInView } from "./usePlacesInView";
import { motionDuration } from "./reducedMotion";

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
  const selectedPoi = usePoiPanel();
  const poiOpen = !!selectedPoi;
  // Hidden while the mobile Place details bottom sheet covers this corner of the screen —
  // same fix applied to ZoomControl/Ruler/Legend, the rest of the bottom-right FAB stack.
  const hideLayersForSheet = isMobile && poiOpen;
  // Desktop-only: real Google Maps collapses the search card into a back-arrow + place name
  // header the moment a place is selected, instead of leaving a separate details panel floating
  // below an unrelated search box. Mobile keeps its own bottom-sheet header (drag handle + X)
  // since that's already the correct mobile pattern — this merge is desktop-only parity work.
  const headerMode = !isMobile && !!selectedPoi;
  const selectedName = selectedPoi?.props?.name_latin || selectedPoi?.props?.name_english || "";

  const [epochModalOpen, setEpochModalOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const onboardingHint = useOnboardingHint();
  const entrance = useEntrance();

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

  // A place selected while the search dropdown/hamburger menu happened to be open would otherwise
  // leave those floating below the new back-arrow + name header, disconnected from any visible
  // search box — close both the moment the header takes over.
  useEffect(() => {
    if (headerMode) {
      setResultsOpen(false);
      setMenuOpen(false);
    }
  }, [headerMode]);

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
    Promise.all([loadPlaces(), loadPois()]).then(([places, pois]) => {
      setResults(searchPlaces([...pois, ...places], value));
      setResultsOpen(true);
    });
  };

  // A search hit with no `pois.geojson` record (most of the raw gazetteer) has no card to open —
  // drop the same red "What's here?" pin ContextMenu.tsx uses on a right-click, so choosing it
  // still visibly marks where the map just flew to instead of a silent pan. Cleared on the next
  // selection of either kind, and on unmount.
  const searchPinRef = useRef<maplibregl.Marker | null>(null);
  const searchPopupRef = useRef<maplibregl.Popup | null>(null);
  const clearSearchPin = () => {
    searchPinRef.current?.remove();
    searchPinRef.current = null;
    searchPopupRef.current?.remove();
    searchPopupRef.current = null;
  };
  useEffect(() => clearSearchPin, []);

  const flyToPlace = (p: Place) => {
    const map = (window as any).__map as MLMap | undefined;
    clearSearchPin();
    if (p.poiProps) {
      // A curated POI — open its real card the same way clicking its marker on the map does.
      // `selectPoi` triggers Map.tsx's own panel-aware `easeTo` (padding so the pin lands clear of
      // the panel/sheet, current zoom unchanged) — call it FIRST, then override with our own
      // `flyTo` that adds the zoom-in a search jump needs. Both run synchronously in the same
      // tick, and MapLibre cancels whichever camera call came first, so the one that must win
      // (ours, since it carries the zoom) has to be issued last. Padding mirrors Map.tsx's
      // `applySelectionCamera` so the pin still lands clear of the panel/sheet.
      selectPoi(p.poiProps, [p.lng, p.lat]);
      if (map) {
        const isMobileNow = window.innerWidth <= 640;
        const padding = isMobileNow
          ? { top: 0, right: 0, left: 0, bottom: Math.round(window.innerHeight * 0.55) }
          : { top: 66, right: 0, left: 470, bottom: 40 };
        map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 15.5), padding, duration: motionDuration(900) });
      }
    } else {
      if (map) {
        map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 7.5), duration: motionDuration(1000) });
        const el = document.createElement("div");
        el.innerHTML = `
          <svg width="27" height="36" viewBox="0 0 27 36" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.4));">
            <path fill="#ea4335" d="M13.5 0C6 0 0 6 0 13.5 0 24 13.5 36 13.5 36S27 24 27 13.5C27 6 21 0 13.5 0z"/>
            <circle cx="13.5" cy="13.5" r="5.5" fill="#fff"/>
          </svg>`;
        el.style.cssText = "transform:translateY(-18px);cursor:default;";
        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([p.lng, p.lat]).addTo(map);
        searchPinRef.current = marker;
        const label = p.latin || p.modern || "Unknown place";
        const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 28 })
          .setLngLat([p.lng, p.lat])
          .setHTML(
            `<div style="font: 13px Roboto, sans-serif; color: var(--text); font-weight: 600;">${escapeSearchHtml(label)}</div>`,
          )
          .addTo(map);
        searchPopupRef.current = popup;
        popup.on("close", () => {
          marker.remove();
          if (searchPinRef.current === marker) searchPinRef.current = null;
          if (searchPopupRef.current === popup) searchPopupRef.current = null;
        });
      }
    }
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
        {/* Search row — becomes a back-arrow + place-name header on desktop while a place is
            selected, exactly like real Google Maps merging the search box into the details
            panel's own header instead of leaving two disconnected floating cards. */}
        <div style={{ display: "flex", alignItems: "center", height: isMobile ? 46 : 48, padding: isMobile ? "0 6px" : "0 4px 0 14px" }}>
          {headerMode ? (
            <>
              <IconBtn label="Back to search" onClick={() => clearPoi()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--icon)">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </IconBtn>
              <div
                className="roman-label"
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  padding: "0 8px",
                }}
              >
                {selectedName}
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {onboardingHint.visible && !resultsOpen && !menuOpen && !headerMode && (
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

      {resultsOpen && results.length > 0 && !headerMode && (
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

      {menuOpen && !headerMode && (
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
              menu is where measuring lives on mobile. Same reasoning for guided tours — desktop
              has its own left-rail icon (LeftRail.tsx), mobile has no rail at all. */}
          {isMobile && (
            <>
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
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openTourPanel();
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
                  <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                </svg>
                Guided tours
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openPlacesInView();
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
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                </svg>
                Places in view
              </button>
            </>
          )}

          <CurrencyConverter />
          <SailingSeason />
          <ThemeToggle />
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
      {entrance.visible && <Entrance onClose={entrance.dismiss} />}

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

function escapeSearchHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }) [c] as string,
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

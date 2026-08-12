"use client";

import { useSyncExternalStore } from "react";
import { CATEGORY_GROUPS } from "./poiCategories";

const KEY = "roman-maps:category-filters";
type FilterState = Record<string, boolean>;

let state: FilterState = {};
const listeners = new Set<() => void>();

function load(): FilterState {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
function save(next: FilterState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
}

state = load();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getSnapshot() {
  return state;
}
// Must return a stable reference — React re-renders on !== and would loop otherwise.
const EMPTY: FilterState = Object.freeze({});
function getServerSnapshot(): FilterState {
  return EMPTY;
}

export function toggleCategory(id: string) {
  state = { ...state, [id]: !state[id] };
  save(state);
  listeners.forEach((cb) => cb());
}
export function clearCategoryFilters() {
  state = {};
  save(state);
  listeners.forEach((cb) => cb());
}
export function useCategoryFilters(): FilterState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
export function activeGroupIds(): string[] {
  return Object.keys(state).filter((k) => state[k]);
}

export default function CategoryChips() {
  const filters = useCategoryFilters();
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 480,
        right: 10,
        zIndex: 6,
        display: "flex",
        gap: 8,
        overflowX: "auto",
        alignItems: "center",
        scrollbarWidth: "none",
      }}
    >
      {activeCount > 0 && (
        <button
          onClick={clearCategoryFilters}
          style={{
            flexShrink: 0,
            height: 40,
            padding: "0 14px",
            borderRadius: 999,
            background: "#e8f0fe",
            color: "#1a73e8",
            fontSize: 13,
            fontWeight: 600,
            border: "1px solid #d2e3fc",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
          Clear
        </button>
      )}
      {CATEGORY_GROUPS.map((g) => {
        const on = !!filters[g.id];
        return (
          <button
            key={g.id}
            onClick={() => toggleCategory(g.id)}
            style={{
              flexShrink: 0,
              height: 40,
              padding: "0 14px 0 10px",
              borderRadius: 999,
              background: on ? "#e8f0fe" : "#fff",
              color: on ? "#1967d2" : "#3c4043",
              fontSize: 13,
              fontWeight: 500,
              border: on ? "1px solid #a4c2f4" : "1px solid transparent",
              boxShadow: on ? "none" : "0 1px 3px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.1)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: g.color,
                flexShrink: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
                <path d={g.glyph} />
              </svg>
            </span>
            {g.short}
          </button>
        );
      })}
    </div>
  );
}

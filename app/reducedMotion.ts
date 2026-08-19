/** [05-P0-3] MapLibre's flyTo/easeTo calls animate via requestAnimationFrame, not CSS, so the
 * globals.css prefers-reduced-motion block can't reach them. Wrap every camera-animation
 * `duration` with this so a reduced-motion user gets an instant cut instead of a forced pan. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function motionDuration(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}

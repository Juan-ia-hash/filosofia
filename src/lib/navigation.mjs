export const SLIDE_COUNT = 17;
export const FINALE_INDEX = 17;
export const TRANSITION_MS = 650;
export const INTERACTIVE_SELECTOR = 'button, a, input, select, textarea, summary, [role="button"], [role="dialog"], [contenteditable="true"], [data-no-nav]';
export function destination(current, direction) {
  if (direction < 0) return Math.max(0, current - 1);
  return current === FINALE_INDEX ? 0 : current + 1;
}
export function directionFromKey(key) {
  if (['ArrowRight', ' ', 'PageDown'].includes(key)) return 1;
  if (['ArrowLeft', 'PageUp'].includes(key)) return -1;
  return 0;
}
export function directionFromPoint(x, left, width) {
  return x - left < width / 2 ? -1 : 1;
}

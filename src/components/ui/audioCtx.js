let shared;
export function getAudioContext() {
  if (!shared) shared = new (window.AudioContext || window.webkitAudioContext)();
  return shared;
}

const map = typeof window !== "undefined"
  ? (window.__mediaElSourceMap ||= new WeakMap())
  : new WeakMap();

export function getOrCreateMediaElementSource(el) {
  const ctx = getAudioContext();
  let src = map.get(el);
  if (!src) {
    src = ctx.createMediaElementSource(el);
    map.set(el, src);
  }
  return src;
}
import React, { useEffect, useRef } from "react";

/* ---- Audio graph utilities (singleton + reuse) ---- */
let _ctx;
function getAudioContext() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
}

// Persist sources per HTMLMediaElement so we never create twice
const sourceMap =
  typeof window !== "undefined"
    ? (window.__mediaElSourceMap ||= new WeakMap())
    : new WeakMap();

function getOrCreateMediaElementSource(el) {
  const ctx = getAudioContext();
  let src = sourceMap.get(el);
  if (!src) {
    src = ctx.createMediaElementSource(el);
    sourceMap.set(el, src);
  }
  return src;
}

export default function AudioVisualizer({ audioRef, barColor = "#f0abfc" }) {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const lastElRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const el = audioRef?.current;
    if (!el) return;

    const ctx = getAudioContext();

    // Unlock on first gesture (once)
    const unlock = async () => {
      if (ctx.state === "suspended") await ctx.resume();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    // Create/reuse a single analyser
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      analyser.connect(ctx.destination); // keep audio flowing through analyser
      analyserRef.current = analyser;
    }

    // Only (re)wire when the actual <audio> element instance changes
    if (el !== lastElRef.current) {
      const srcCurrent = getOrCreateMediaElementSource(el);

      // If a previous element was wired, disconnect it from this analyser
      if (lastElRef.current) {
        const oldSrc = sourceMap.get(lastElRef.current);
        try { oldSrc && oldSrc.disconnect(analyserRef.current); } catch {}
      }

      // Connect current element → analyser (only once per element)
      try { srcCurrent.connect(analyserRef.current); } catch (e) {
        // If this ever fires, another part of the app created a source for the same element.
        console.warn("Media source connect skipped:", e);
      }

      lastElRef.current = el;
    }

    // Draw loop
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const gctx = canvas.getContext("2d");
    const buffer = new Uint8Array(analyser.frequencyBinCount);

    // build gradient once
    const gradient = gctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#a855f7");
    gradient.addColorStop(0.5, "#ec4899");
    gradient.addColorStop(1, "#f97316");

    const draw = () => {
      analyser.getByteFrequencyData(buffer);
      const { width, height } = canvas;
      gctx.clearRect(0, 0, width, height);

      const barW = Math.max(2, (width / buffer.length) * 2);
      for (let i = 0, x = 0; i < buffer.length; i++, x += barW + 1) {
        const val = buffer[i];
        const barH = (val / 255) * height;
        gctx.fillStyle = gradient; // or barColor if you prefer a solid
        gctx.fillRect(x, height - barH, barW, barH);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      // Do NOT destroy the MediaElementSource; it belongs to the <audio> element lifetime.
      // If you ever unmount the visualizer permanently and want to decouple audio from analyser:
      // try { sourceMap.get(lastElRef.current)?.disconnect(analyserRef.current) } catch {}
    };
    // IMPORTANT: depend on the ELEMENT instance, not its src,
    // so we don't re-create the source on every track change.
  }, [audioRef?.current]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={80}
      className="mx-auto mt-4"
    />
  );
}

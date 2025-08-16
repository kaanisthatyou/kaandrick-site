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

    // Unlock audio on first gesture
    const unlock = async () => {
      if (ctx.state === "suspended") await ctx.resume();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    // Create/reuse analyser
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
    }

    // Rewire only if element changes
    if (el !== lastElRef.current) {
      const srcCurrent = getOrCreateMediaElementSource(el);

      if (lastElRef.current) {
        const oldSrc = sourceMap.get(lastElRef.current);
        try {
          oldSrc && oldSrc.disconnect(analyserRef.current);
        } catch {}
      }

      try {
        srcCurrent.connect(analyserRef.current);
      } catch (e) {
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

    // Resize handler: match internal buffer to CSS size
    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      analyser.getByteFrequencyData(buffer);
      const { width, height } = canvas;
      gctx.clearRect(0, 0, width, height);

      const barW = Math.max(2, (width / buffer.length) * 2);
      const gradient = gctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#a855f7");
      gradient.addColorStop(0.5, "#ec4899");
      gradient.addColorStop(1, "#f97316");

      for (let i = 0, x = 0; i < buffer.length; i++, x += barW + 1) {
        const val = buffer[i];
        const barH = (val / 255) * height;
        gctx.fillStyle = gradient; // or barColor for solid
        gctx.fillRect(x, height - barH, barW, barH);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [audioRef?.current]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
}

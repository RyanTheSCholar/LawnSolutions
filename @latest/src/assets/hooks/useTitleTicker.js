// src/hooks/useTitleTickerUltra.js (same as before, but tune defaults)
import { useEffect, useRef } from "react";

export function useTitleTickerUltra({
  texts = [],
  charsPerSecond = 8,        // ~8 cps is the sweet spot
  separator = "   •   ",
  pad = 16,
  windowLen = 44,
  targetFps = 24,            // 24–30 is ideal for titles
  fallback = typeof document !== "undefined" ? document.title : "",
} = {}) {
  const rafRef = useRef(0);
  const prevTitleRef = useRef("");
  const accCharsRef = useRef(0);
  const idxRef = useRef(0);

  useEffect(() => {
    if (!texts.length || typeof document === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    const gap = " ".repeat(Math.max(0, pad));
    const base = texts.join(separator) + gap;
    const loop = base + base;

    prevTitleRef.current = document.title;

    const stepCharsPerMs = Math.max(0.001, charsPerSecond / 1000);
    const minFrameMs = 1000 / Math.min(60, Math.max(10, targetFps));

    let lastMs = performance.now();
    let carryMs = 0;

    const tick = (nowMs) => {
      const dt = nowMs - lastMs;
      lastMs = nowMs;

      if (!document.hidden) {
        carryMs += dt;
        if (carryMs >= minFrameMs) {
          const advance = carryMs * stepCharsPerMs;
          accCharsRef.current += advance;
          carryMs = 0;

          const whole = accCharsRef.current | 0;
          if (whole > 0) {
            accCharsRef.current -= whole;
            idxRef.current = (idxRef.current + whole) % base.length;
            const i = idxRef.current;
            document.title = loop.slice(i, i + windowLen).trim();
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const onVis = () => { lastMs = performance.now(); };
    document.addEventListener("visibilitychange", onVis, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVis);
      document.title = fallback || prevTitleRef.current;
    };
  }, [JSON.stringify(texts), charsPerSecond, separator, pad, windowLen, targetFps, fallback]);
}
// src/hooks/useFaviconMarquee.js
import { useEffect, useRef } from "react";

/**
 * Ultra-smooth animated favicon using a canvas.
 * Draws a rounded green badge with a sliding glow (brand "pulse").
 */
export function useFaviconMarquee({
  size = 96,                 // internal canvas resolution (crisp on HiDPI)
  bg = "#05270a",            // brand green
  color = "#ffffff",         // monogram color
  round = true,              // rounded badge
  fps = 60,                  // canvas frame rate
  text = "LS",               // monogram ("" to hide)
} = {}) {
  const rafRef = useRef(0);

  useEffect(() => {
    // <link rel="icon"> (dynamic)
    let link = document.querySelector('link[rel="icon"][data-dynamic="1"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.setAttribute("data-dynamic", "1");
      document.head.appendChild(link);
    }

    // Canvas
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");

    const periodMs = 1600; // one glow sweep
    const radius = size * 0.5;
    const pad = Math.round(size * 0.08);
    const r = radius - pad;

    const draw = (t) => {
      ctx.clearRect(0, 0, size, size);

      // background badge
      ctx.fillStyle = bg;
      if (round) {
        ctx.beginPath();
        ctx.arc(radius, radius, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        roundRect(ctx, pad, pad, size - pad * 2, size - pad * 2, size * 0.2);
        ctx.fill();
      }

      // moving shine
      const p = (t % periodMs) / periodMs; // 0..1
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(Math.max(0, p - 0.08), "rgba(255,255,255,0)");
      grad.addColorStop(p, "rgba(255,255,255,0.22)");
      grad.addColorStop(Math.min(1, p + 0.08), "rgba(255,255,255,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grad;
      if (round) {
        ctx.beginPath();
        ctx.arc(radius, radius, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        roundRect(ctx, pad, pad, size - pad * 2, size - pad * 2, size * 0.2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // monogram
      if (text) {
        ctx.fillStyle = color;
        ctx.font = `${Math.floor(size * 0.48)}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, radius, radius + (round ? 1 : 0));
      }

      // swap favicon
      link.href = c.toDataURL("image/png");
    };

    let last = performance.now();
    const minFrame = 1000 / Math.min(60, Math.max(24, fps));

    const tick = (now) => {
      if (!document.hidden && !prefersReducedMotion()) {
        if (now - last >= minFrame) {
          draw(now);
          last = now;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [size, bg, color, round, fps, text]);
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

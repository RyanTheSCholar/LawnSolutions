// src/hooks/usePageMeta.js
import { useEffect } from "react";

/**
 * Sets per-page <title> and <meta name="description"> on mount/update.
 * Restores the previous title/description on unmount.
 */
export function usePageMeta({
  title,
  description,
  restoreOnUnmount = false, // set true if you want to restore previous meta when leaving this page
}) {
  useEffect(() => {
    const prevTitle = document.title;
    const metaEl =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    const prevDesc = metaEl.getAttribute("content") || "";

    if (title) document.title = title;
    if (description) metaEl.setAttribute("content", description);

    return () => {
      if (!restoreOnUnmount) return;
      document.title = prevTitle;
      metaEl.setAttribute("content", prevDesc);
    };
  }, [title, description, restoreOnUnmount]);
}

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

const ANALYZE_RAW = process?.env?.ANALYZE ?? ""; // <- won't throw
const analyze = ["1", "true", "yes", "on"].includes(String(ANALYZE_RAW).toLowerCase());

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: "brotliCompress", ext: ".br", deleteOriginFile: false }),
    compression({ algorithm: "gzip", ext: ".gz", deleteOriginFile: false }),
    analyze && visualizer({ filename: "dist/stats.html", gzipSize: true, brotliSize: true })
  ].filter(Boolean),
  build: {
    target: "es2019",
    cssTarget: "chrome61",
    minify: "esbuild",
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "router";
            if (id.includes("react") || id.includes("scheduler")) return "react";
            if (id.includes("lodash")) return "lodash";
            return "vendor";
          }
        }
      }
    }
  },
  server: { port: 5173 },
  preview: { port: 4173 }
});

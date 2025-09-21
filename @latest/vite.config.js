import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { process } from "node:process";

// Set ANALYZE=1 in your env to output dist/stats.html after build
const analyze = process.env.ANALYZE === "1";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Serve pre-compressed assets (Brotli + gzip); your host should honor them.
    compression({ algorithm: "brotliCompress", ext: ".br", deleteOriginFile: false }),
    compression({ algorithm: "gzip", ext: ".gz", deleteOriginFile: false }),
    analyze && visualizer({ filename: "dist/stats.html", gzipSize: true, brotliSize: true })
  ].filter(Boolean),

  build: {
    target: "es2019",       // modern, smaller output
    cssTarget: "chrome61",
    minify: "esbuild",
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 0,   // always emit files so they can be cached/compressed
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split big deps so first paint ships less JS
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "router";
            if (id.includes("react") || id.includes("scheduler")) return "react";
            if (id.includes("lodash")) return "lodash";
            // default vendor bucket
            return "vendor";
          }
        }
      }
    }
  },

  // Strong caching for hashed assets in production (your host/CDN should set headers)
  server: { port: 5173 }, 
  preview: { port: 4173 }
    // dev only convenience
});
  
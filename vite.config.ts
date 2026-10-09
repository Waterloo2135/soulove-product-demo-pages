import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Portable build: relative paths + classic script (no type=module) so file:// double-click works.
export default defineConfig({
  plugins: [
    react(),
    {
      name: "file-protocol-html",
      closeBundle() {
        const dist = join(process.cwd(), "dist");
        const htmlPath = join(dist, "index.html");
        if (!existsSync(htmlPath)) return;
        let html = readFileSync(htmlPath, "utf8");
        html = html.replace(/\s*crossorigin/g, "");
        html = html.replace(
          /<script\s+type="module"\s+src="\.\/([^"]+)"><\/script>/,
          '<script src="./$1" defer></script>'
        );
        writeFileSync(htmlPath, html);
      },
    },
  ],
  base: "./",
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    modulePreload: false,
    target: "es2018",
    rollupOptions: {
      output: {
        format: "iife",
        name: "SouloveDemo",
        inlineDynamicImports: true,
        entryFileNames: "assets/app.js",
        assetFileNames: "assets/app.[ext]",
      },
    },
  },
});


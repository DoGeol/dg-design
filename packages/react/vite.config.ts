import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json" with { type: "json" };

const root = path.dirname(fileURLToPath(import.meta.url));

// ESM only, per-module CSS output (seed packages/react/vite.config.mts pattern,
// minus the CJS output — DDS ships ESM only).
export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      staticImport: true,
      exclude: ["src/**/*.test.tsx", "src/test-setup.ts"],
    }),
    react(),
    copyComponentCss(),
  ],
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: [path.resolve(root, "src/index.ts"), path.resolve(root, "src/button/Button.tsx")],
      formats: ["es"],
    },
    outDir: "dist",
    rollupOptions: {
      // dependencies + peerDependencies stay real imports for the consumer, not bundled.
      // .css is external too: hand-authored CSS is shipped as-is (see copyComponentCss
      // below), not run through Vite's CSS pipeline, which drops the side-effect import
      // in preserveModules output instead of pointing it at the extracted chunk.
      external: [
        /\.css$/,
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
        "react/jsx-runtime",
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        exports: "named",
        banner: ({ fileName }) => renderBanner(fileName),
      },
    },
  },
});

/** Copies every src/**\/*.css verbatim to the matching dist/**\/*.css path. */
function copyComponentCss(): Plugin {
  return {
    name: "dds-copy-component-css",
    closeBundle() {
      const srcDir = path.resolve(root, "src");
      const outDir = path.resolve(root, "dist");
      for (const entry of fs.readdirSync(srcDir, { recursive: true })) {
        const relPath = entry.toString();
        if (!relPath.endsWith(".css")) continue;
        const from = path.join(srcDir, relPath);
        const to = path.join(outDir, relPath);
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
      }
    },
  };
}

function renderBanner(fileName: string) {
  const file = path.parse(fileName);
  // barrel file re-exports only, no client-only hooks/refs to guard
  if (file.name === "index") {
    return "";
  }
  return "'use client';";
}

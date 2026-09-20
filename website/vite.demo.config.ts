import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {alias: {"@": fileURLToPath(new URL("./", import.meta.url))}},
  server: {host: "0.0.0.0", port: 3000, strictPort: true},
  preview: {host: "0.0.0.0", port: 3000, strictPort: true},
  build: {outDir: "dist-demo", chunkSizeWarningLimit: 900},
});

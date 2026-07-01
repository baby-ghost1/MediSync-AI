import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
    open: true,
  },

  preview: {
    port: 4173,
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react-router")) {
            return "vendor";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "motion";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "query";
          }
          if (id.includes("node_modules/lucide-react") || id.includes("node_modules/react-icons")) {
            return "icons";
          }
          if (id.includes("node_modules/react-hook-form") || id.includes("node_modules/zod") || id.includes("node_modules/@hookform")) {
            return "forms";
          }
          if (id.includes("node_modules/react-markdown") || id.includes("node_modules/rehype") || id.includes("node_modules/remark")) {
            return "markdown";
          }
        },
      },
    },
  },
});

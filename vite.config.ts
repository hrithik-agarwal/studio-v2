import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";
import path from "path";
import fs from "fs";

const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost-cert.pem"),
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Environment variables configuration
  envPrefix: "VITE_", // Only expose vars with VITE_ prefix
  envDir: "./", // Root directory for env files

  // Logger configuration
  logLevel: "info", // Show build output
  clearScreen: false, // Useful for CI/CD

  // Server configuration
  server: {
    port: 44307,
    https: options,
    strictPort: true,
    host: true, // Listen on all addresses
    cors: true, // Enable CORS
    hmr: {
      overlay: true, // Show errors overlay
    },
  },

  // Resolve configuration
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "zustand",
      "@azure/msal-react",
      "@fluentui/react-components",
      "i18next",
      "react-i18next",
    ],
    exclude: [],
  },

  // CSS configuration
  css: {
    devSourcemap: true,
  },

  // Plugins
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({ algorithm: "brotliCompress" }),
  ],

  // Build configuration
  build: {
    target: "esnext", // Modern browsers
    sourcemap: mode === "production" ? "hidden" : true,
    minify: mode === "production" ? "esbuild" : false,
    assetsInlineLimit: 4096, // Inline assets < 4kb
    reportCompressedSize: true, // Show compressed sizes in build output
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // Core React libs - changes rarely
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-core";
            }

            // Router - separate from core for better caching
            if (id.includes("react-router")) {
              return "react-router";
            }

            // Large UI libraries
            if (id.includes("@fluentui")) {
              return "fluentui-vendor";
            }

            // Auth libraries
            if (id.includes("@azure/msal")) {
              return "msal-vendor";
            }

            // i18n
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "i18n-vendor";
            }

            // State management
            if (id.includes("zustand")) {
              return "state-vendor";
            }

            // Other vendors
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
  },
}));

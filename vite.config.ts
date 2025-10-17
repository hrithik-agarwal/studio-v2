import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost-cert.pem"),
};

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 44307,
    https: options,
    strictPort: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "react-vendor";
            }

            if (id.includes("@fluentui")) {
              return "fluentui-vendor";
            }

            if (id.includes("@azure/msal")) {
              return "msal-vendor";
            }

            if (id.includes("i18next")) {
              return "i18n-vendor";
            }

            if (id.includes("zustand")) {
              return "state-vendor";
            }

            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
};


// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 44307,
    https: options,
    strictPort: true,
    allowedHosts: [".replit.dev", ".repl.run"],
  },
  preview: {
    allowedHosts: [".replit.dev", ".repl.run"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), tailwindcss()],
});

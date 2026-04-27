import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/love/" : "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        love: resolve(__dirname, "love.html")
      }
    }
  }
}));

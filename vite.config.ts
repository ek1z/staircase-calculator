import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import stylex from "@stylexjs/unplugin";

export default defineConfig({
  // Served from https://<user>.github.io/staircase-calculator/
  base: "/staircase-calculator/",
  plugins: [stylex.vite(), react()],
});

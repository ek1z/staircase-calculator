import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import stylex from "@stylexjs/unplugin";

// https://astro.build/config
export default defineConfig({
  // Julkaistaan osoitteessa https://ek1z.github.io/staircase-calculator/
  site: "https://ek1z.github.io",
  base: "/staircase-calculator/",
  output: "static",
  integrations: [react()],
  vite: {
    // StyleX kääntyy Astron oman Viten kautta; tuotannossa se liittää
    // käännetyt tyylit CSS-assettiin (auto-linkitetty <link>).
    plugins: [stylex.vite()],
  },
});

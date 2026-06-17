import * as stylex from "@stylexjs/stylex";
import { colors } from "./tokens.stylex";

// ── Tumma teema ───────────────────────────────────────────────────────────
// createTheme palauttaa luokan, joka asetetaan juurielementtiin; kaikki
// jälkeläiset (myös SVG-leikkaus) perivät korvatut muuttujat. "Sinikopio
// pimeässä": tumma navy-tausta, vaalea muste, kirkkaammat aksenttivärit.
export const darkTheme = stylex.createTheme(colors, {
  paper: "#0A1019",     // syvempi tausta → kortit erottuvat selvemmin
  surface: "#172234",   // nostettu pinta, korkeampi kontrasti taustaan
  ink: "#F3F7FD",       // lähes valkoinen teksti/viivat (~15:1 taustaa vasten)
  inkSoft: "#AEBED6",   // kirkkaampi toissijainen teksti (AA, ~8:1)
  line: "#7FB8EC",      // kirkkaampi mittasininen
  hint: "rgba(243,247,253,0.18)", // näkyvämmät erottimet
  grid: "rgba(243,247,253,0.05)",
  pass: "#5FD79B",
  fail: "#FF8C8C",
  warn: "#F2BE5C",
  board: "#E2B477",     // kirkkaampi reisilankku-aksentti
  boardFill: "rgba(226,180,119,0.22)",
  callout: "#F4A78F",
});

export type ThemeName = "light" | "dark";

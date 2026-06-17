import * as stylex from "@stylexjs/stylex";

// ── Teemoitettavat muuttujat ──────────────────────────────────────────────
// defineVars-arvot kääntyvät `var(--hash)`-merkkijonoiksi, joita voi käyttää
// sekä CSS-tyyleissä että SVG:n fill/stroke-attribuuteissa. createTheme
// (themes.ts) korvaa nämä tummalle teemalle. Vain teemautuvat arvot kuuluvat
// tänne — kiinteät välistykset ja fonttikoot pysyvät komponenttien tyyleissä.

export const colors = stylex.defineVars({
  paper: "#F7F5EF",      // sivun tausta
  surface: "#FFFFFF",    // korttien / paneelien tausta
  ink: "#16263F",        // ensisijainen teksti ja viivat
  inkSoft: "#5B6B82",    // toissijainen teksti
  line: "#2C5C8A",       // mittaviivojen sininen
  hint: "rgba(22,38,63,0.10)", // ohuet erottimet
  grid: "rgba(22,38,63,0.035)", // taustaruudukko
  pass: "#2E7D52",
  fail: "#B23A3A",
  warn: "#B5791F",
  board: "#B07A3C",      // reisilankku
  boardFill: "rgba(176,122,60,0.16)",
  callout: "#9A3B2E",    // askelman e/n -merkinnät
});

export const fonts = stylex.defineVars({
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
});

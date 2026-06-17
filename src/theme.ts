import type { CSSProperties } from "react";

// ── Väripaletti ───────────────────────────────────────────────────────────
export const C = {
  paper: "#F7F5EF", ink: "#16263F", inkSoft: "#5B6B82", line: "#2C5C8A",
  hint: "rgba(22,38,63,0.10)", pass: "#2E7D52", fail: "#B23A3A", warn: "#B5791F",
  board: "#B07A3C", boardFill: "rgba(176,122,60,0.16)",
};

// ── Kirjasinperheet ─────────────────────────────────────────────────────────
export const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
export const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// ── Jaetut tyylit ────────────────────────────────────────────────────────
export const stepBtn: CSSProperties = {
  border: `1.5px solid ${C.ink}`, background: "#fff", color: C.ink,
  fontFamily: MONO, fontSize: 13, padding: "9px 14px", cursor: "pointer",
};

import { useMemo, useSyncExternalStore } from "react";
import type { ThemeName } from "./themes";

// ── URL-pohjainen tila ────────────────────────────────────────────────────
// Hakustring (?h=…&l=…) toimii sovelluksen ainoana totuudenlähteenä: arvot
// luetaan URL:sta ja kirjoitetaan takaisin replaceState:lla (ei historiaroskaa).
// Oletusarvot jätetään pois URL:sta, joten tuore vierailu pitää osoitteen siistinä.

const DEFAULTS = { H: 2300, L: 3000, W: 250, typeId: "asunto" };
const EVENT = "urlstatechange";

type Patch = Record<string, string | number | null | undefined>;

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function getSnapshot() {
  return window.location.search;
}

function num(value: string | null, fallback: number) {
  if (value == null) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// Teeman oletus: käyttöjärjestelmän asetus, ellei URL pakota arvoa.
function systemTheme(): ThemeName {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Lukee nykyiset parametrit tuoreeltaan, yhdistää muutoksen ja kirjoittaa URL:iin.
// null/undefined poistaa avaimen (palautuu oletukseen).
function update(patch: Patch) {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(patch)) {
    if (value == null) params.delete(key);
    else params.set(key, String(value));
  }
  const search = params.toString();
  const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(EVENT));
}

export function useStairParams() {
  const search = useSyncExternalStore(subscribe, getSnapshot);
  return useMemo(() => {
    const p = new URLSearchParams(search);
    const nRaw = p.get("n");
    const nVal = num(nRaw, NaN);
    const themeRaw = p.get("theme");
    return {
      H: num(p.get("h"), DEFAULTS.H),
      L: num(p.get("l"), DEFAULTS.L),
      W: num(p.get("w"), DEFAULTS.W),
      typeId: p.get("t") ?? DEFAULTS.typeId,
      // nOverride on määritelty vain kun käyttäjä on asettanut nousumäärän käsin.
      nOverride: nRaw != null && Number.isFinite(nVal) ? Math.max(2, nVal) : undefined,
      theme: (themeRaw === "dark" || themeRaw === "light" ? themeRaw : systemTheme()) as ThemeName,
      update,
    };
  }, [search]);
}
